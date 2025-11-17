<!-- create赋值,默认推荐,去除无用优化代码   -->
<template>
  <view class="home">
   
    <!-- 添加图片 -->
    <view class="picarr">
      <view
        class="box add"
        @click="addpic"
        v-if="dataobj.imageValue.length < 1"
      >
        <uni-icons type="plus" size="39"></uni-icons>
      </view>

      <view
        class="box pic"
        v-for="(item, index) in dataobj.imageValue"
        :key="index"
      >
        <image class="img" :src="item.fileID" mode="aspectFit"></image>
        <view class="mask">
          <view class="icon"> </view>
          <view class="icon" @click="delepic(index)">
            <uni-icons type="trash" size="30"></uni-icons>
          </view>
        </view>
      </view>
    </view>

    <textarea
      v-model="dataobj.content"
      auto-height
      placeholder="详细信息明码标价,明码标价"
      style="width: 100%; min-height: 400rpx"
      class="font-30"
      maxlength="60"
    ></textarea>
     <view class="phone">
      手机号
      <uv-input
        maxlength="11"
        v-model.number="dataobj.phone"
        type="number"
        shape="circle"
        placeholder="手机号"
        prefixIconStyle="font-size: 22rpx;color: #909399"
      ></uv-input>
    </view>

     <view class="phone">
      微信号(选填)
      <uv-input
        maxlength="25"
        v-model="dataobj.wx_count "
         shape="circle"
            placeholder="选填"
       prefixIconStyle="font-size: 22rpx;color: #909399"
      ></uv-input>
    </view>

    <view v-if="isAdminRole()" class="likes">
      收藏量:
      <uv-number-box
        integer
        v-model="dataobj.like_count"
        placeholder="请输入数量"
      ></uv-number-box>
    </view>
    <view class="tijiao"
      ><button type="primary" @click="tijiao">{{ pageType }}</button></view
    >
    <uni-pay ref="payRef"> </uni-pay>
  </view>
</template>

<script setup>
const secCheckObj = uniCloud.importObject("secCheckContent");
import { usePay } from "./orderHooks.js";
import { showToast, isAdminRole } from "@/utils/common.js";
import { removeHtmlTags, convertImageToWebP, uuid } from "@/utils/tools.js";
import dayjs from "dayjs";
const db = uniCloud.database();
const goods_yundx = uniCloud.importObject("goods-backend");
const pddyun = uniCloud.importObject("client-adv", {
  customUI: true,
});
const { payRef } = usePay();
let id = ref();
const emit = defineEmits(["Updatelist"]);
const current_id = ref(uniCloud.getCurrentUserInfo().uid); // 当前用户id
const fenleipp = ref(null);
const actionSheet = ref(null);
const list2 = ref([]);

const dataobj = ref({
  content: "",
  imageValue: [],
  temparr: [], //本地临时图片
  category_id: "",
  total_fee: 2, // 添加分类名称字段
  phone: null,
  like_count: 0,
  wx_count:""
});
const pageType = computed(() => (unref(id) ? "修改" : "新增"));

const rights = ref(null);
// 传递type
onLoad(async (e) => {
  id.value = e.id;
  // 接收分类 id 参数
  if (e.category_id) {
    dataobj.value.category_id = e.category_id;
  }
  if (id.value) getDetail();
});
const getDetail = async () => {
  let { errCode, data } = await pddyun.detailxg(unref(id));
  dataobj.value = data;
  console.log(data);
};

// 选择好图片
const addpic = async () => {
  const res = await new Promise((resolve) => {
    uni.chooseImage({
      count: 8,
      success: resolve,
      fail: () => resolve(null), // 处理取消选择的情况
    });
  });

  if (!res || !res.tempFilePaths.length) return; // 2. 未选择图片直接返回

  dataobj.value.temparr = res.tempFilePaths;

  // 上传云端图片
  for (let item of dataobj.value.temparr) {
    let yspic = await convertImageToWebP(item);
    let res = await uniCloud.uploadFile({
      filePath: yspic,
      cloudPathAsRealPath: true,
      cloudPath:
        "dspic/" + dayjs().format("YYYY-MM-DD") + "/" + Date.now() + ".webp",
    });
    console.log(res);
    dataobj.value.imageValue.push(res);
  }
  dataobj.value.temparr = [];
};

// 提交
const tijiao = async () => {
  dataobj.value.content = removeHtmlTags(dataobj.value.content);
  uni.showLoading();
  let secRes = await secCheckObj.textSecCheck(
    dataobj.value.content,
    "o5tQd7U__aPjwWnoYBPUivS4C_sw"
  );
  if (secRes.code == 0) {
    if (!dataobj.value.phone) {
      uni.showModal({
        title: "操作失败",
        content: "请输入手机号",
        showCancel: false,
      });
      return; // 这里已经能阻断后续代码
    }
    goodsff();
  } else {
    uni.showModal({
      title: secRes.errMsg || "操作失败",
      content: secRes.result?.label
        ? `发布内容存在"${secRes.result.label}"问题,请重新编辑后发布!`
        : "请检查输入内容后重试",
      showCancel: false,
    });
    return;
  }
};
// 提交云端
const goodsff = async () => {
  try {
    let order_no = uuid();
    dataobj.value = {
      ...dataobj.value,
      total_fee: 1,
      description: "分类对应广告费",
      order_no,
    };
    if (isAdminRole()) {
      dataobj.value = { ...dataobj.value, order_status: 1 };
    }
    let { errCode, errMsg } = unref(id)
      ? await pddyun.update(dataobj.value)
      : await pddyun.add(dataobj.value);
    if (errCode !== 0) return showToast("创建订单有误，请刷新重试");

    showToast({
      title: "新增成功",
    });

    payRef.value.createOrder({
      provider: "alipay",
      total_fee: 1,
      type: "goods",
      order_no,
      description: "测试支付",
    });
    setTimeout(() => {
      uni.navigateBack({
        delta: 2,
      });
    }, 4000);
  } catch (err) {
    showToast({
      title: err,
    });
  }
};
// 删除本地图片
const delepic = async (index) => {
  await goods_yundx.deletimg(dataobj.value.imageValue[index].fileID);
  dataobj.value.imageValue.splice(index, 1);
};
</script>

<style lang="scss" scoped>
.home {
  padding: 20rpx;

  .phone {
    display: flex;
    align-items: center;
  }

  .picarr {
    display: grid;
    grid-template-columns: repeat(3, 1fr); // 每行显示三个图片
    gap: 3px; // 图片之间的间距

    .box {
      width: 240rpx;
      aspect-ratio: 13 / 16;
      border: 1px solid black;
    }

    .pic {
      image {
        width: 100%;
        height: 100%;
      }

      .mask {
        display: flex;
        background: rgba(240, 255, 255, 1);

        .icon {
          width: 50%;
        }
      }
    }

    .add {
      @include flex-box-set();
      cursor: pointer;
    }
  }
  .likes {
    display: flex;
  }
  .tijiao {
    padding-top: 150rpx;
    width: 80%;
  }
}
</style>
