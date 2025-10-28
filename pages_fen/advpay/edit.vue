<!-- create赋值,默认推荐,去除无用优化代码   -->
<template>
  <view class="home">
    电话
    <uv-input
      maxlength="11"
      type="number"
      shape="circle"
      placeholder="前置图标"
      prefixIcon="search"
      prefixIconStyle="font-size: 22px;color: #909399"
    ></uv-input>
    <!-- 添加图片 -->
    <view class="picarr">
      <view
        class="box add"
        @click="addpic"
        v-if="dataobj.imageValue.length < 1"
      >
        <uni-icons type="plus" size="39"></uni-icons>
      </view>

      <view class="box pic" v-for="(item, index) in dataobj.imageValue">
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
      placeholder="分享技术文章"
      style="width: 100%; min-height: 400rpx"
      class="font-30"
      maxlength="999"
    ></textarea>

    <view class="tijiao"
      ><button type="primary" @click="tijiao">{{ pageType }}</button></view
    >
  </view>
</template>

<script setup>
import { showToast, isAdminRole } from "@/utils/common.js";
import { removeHtmlTags, convertImageToWebP } from "@/utils/tools.js";
import dayjs from "dayjs";
import { useNavlistStore } from "@/stores/navlistStore.js";
const useNavlist = useNavlistStore();
const db = uniCloud.database();
const goods_yundx = uniCloud.importObject("goods-backend");
const pddyun = uniCloud.importObject("client-adv", { customUI: true });
let id = ref();
const emit = defineEmits(["Updatelist"]);
const current_id = ref(uniCloud.getCurrentUserInfo().uid); // 当前用户id
const fenleipp = ref(null);
const actionSheet = ref(null);
const list2 = ref([]);

const dataobj = ref({
  name: "",
  content: "",
  imageValue: [],
  temparr: [], //本地临时图片
  category_id: "",
  category_name: "", // 添加分类名称字段
  goods_thumb: "",
});
const pageType = computed(() => (unref(id) ? "修改" : "新增"));

const rights = ref(null);
// 获取分类
const getfenlei = async () => {
  let { errCode, errMsg, count, data } = await pddyun.list();
  if (errCode !== 0) return showToast("获取失败");
  dataobj.value.category_id = data[0]._id;
  dataobj.value.category_name = data[0].name; // 设置默认分类名称
  list2.value = data.map((item) => {
    return {
      _id: item._id,
      name: item.name,
      color: "#000000",
      fontSize: "30",
    };
  });
};
getfenlei();
onLoad(async (e) => {
  id.value = e.id;
  if (id.value) getDetail();
  uni.setNavigationBarTitle({ title: unref(pageType) });
});
const getDetail = async () => {
  let { errCode, data } = await pddyun.detailxg(unref(id));
  dataobj.value = data;
  console.log(data);
};
// 选择分类
const select = async (e) => {
  console.log(e);
  dataobj.value.category_id = e._id;
  dataobj.value.category_name = e.name; // 同步更新分类名称
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
  dataobj.value.goods_thumb = dataobj.value.imageValue[0].fileID;
  dataobj.value.temparr = [];
};

// 提交
const tijiao = async () => {
  dataobj.value.content = removeHtmlTags(dataobj.value.content);
  console.log(dataobj.value);
  dataobj.value.name = dataobj.value.content.slice(0, 20);

  goodsff();
};
// 提交云端
const goodsff = async () => {
  try {
    uni.showLoading({
      mask: true,
    });

    let { errCode, errMsg } = unref(id)
      ? await pddyun.update(dataobj.value)
      : await pddyun.add(dataobj.value);
    if (errCode !== 0) {
      return showToast({
        title: errMsg,
      });
    }
    showToast({
      title: "新增成功",
    });
  } catch (err) {
    showToast({
      title: err,
    });
  } finally {
    uni.hideLoading();
    uni.switchTab({
      url: "/pages_fen/open/open-news",
    });
    init();
  }
};
// 删除本地图片
const delepic = async (index) => {
  await goods_yundx.deletimg(dataobj.value.imageValue[index].fileID);
  dataobj.value.imageValue.splice(index, 1);
};
//恢复默认
const init = () => {
  dataobj.value = {
    content: "",
    imageValue: [],
    temparr: [],
    goods_thumb: "", //本地临时图片
  };
};

const selects = () => {
  actionSheet.value.open();
};
</script>

<style lang="scss" scoped>
.home {
  padding: 20rpx;

  .category-row {
    display: flex;
    align-items: center;
  }
  .row-add {
    display: flex;
    flex-direction: column;
    padding: 20rpx 0;
    font-size: 30rpx;
    font-weight: bold;

    .label {
      width: 300rpx;
      padding-right: 20rpx;
    }
  }

  .title {
    padding: 30rpx 0;
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

  .tijiao {
    padding-top: 150rpx;
    width: 80%;
  }
}
</style>
