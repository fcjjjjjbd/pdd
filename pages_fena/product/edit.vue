<!-- 行动   -->
<template>
  <view class="home">
    <!-- 分类选择 -->
    <view class="category-row">
      <button class="category-btn" size="mini" @click="showCategoryPicker">
        选择分类
      </button>
      <uv-input
        class="category-input"
        placeholder="输入分类名称"
        border="surround"
        maxlength="20"
        clearable
        type="text"
        v-model="dataobj.Category"
        autoBlur
      ></uv-input>
    </view>

    <!-- 添加学博客图片 -->
    <view class="title">添加轮播图 </view>
    <view class="picarr">
      <view
        class="box add"
        @click="addpic"
        v-if="dataobj.imageValue.length < 8"
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

    <view class="title">详情信息 </view>
    <textarea
      v-model="dataobj.content"
      auto-height
      placeholder="商品类型描述,每个明码标价"
      style="width: 100%; min-height: 400rpx"
      class="font-30"
      maxlength="999"
    ></textarea>
    <view class="title">进价渠道</view>
    <textarea
      v-model="dataobj.pifacontent"
      auto-height
      placeholder="招人,视频指导解决"
      style="width: 100%; min-height: 400rpx"
      class="font-30"
      maxlength="999"
    ></textarea>

    <view class="tijiao"
      ><button type="primary" @click="tijiao">提交商品</button></view
    >
    <!-- 弹窗 -->
    
  </view>
</template>

<script setup>
import { showToast, isAdminRole } from "@/utils/common.js";
import { removeHtmlTags, convertImageToWebP } from "@/utils/tools.js";
import dayjs from "dayjs";
const db = uniCloud.database();
const goods_yun = uniCloud.importObject("goods_item");
const goods_yundx = uniCloud.importObject("goods-backend");

const emit = defineEmits(["Updatelist"]);
const current_id = ref(uniCloud.getCurrentUserInfo().uid); // 当前用户id
const fenleipp = ref(null);
const dataobj = ref({
  name: "",

  content: "",
  pifacontent: "",
  imageValue: [],
  temparr: [], //本地临时图片
  Category: "",
  goods_thumb: "",
});
const rights = ref(null);
onLoad(async (e) => {
  if (e.xgobj) {
    let dsobj = JSON.parse(decodeURIComponent(e.xgobj));
    console.log(dsobj);
    dataobj.value = dsobj;
  }
});
// 分类赋值
const selext = async (e, name) => {
  console.log(name);
  dataobj.value.Category = e;
  dataobj.value.name = name;

  fenleipp.value.close();
};

// 改变分类
const flchange = async (e) => {
  
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

  goodsff();
};
// 提交云端
const goodsff = async () => {
  try {
    uni.showLoading({
      mask: true,
    });

    if (dataobj.value._id) {
      let copyobj = {
        ...dataobj.value,
      };
      delete copyobj._id;
      console.log(copyobj);
      await db
        .collection("goods_detail")
        .doc(dataobj.value._id)
        .update(copyobj); //修改商品
    } else {
      let {
        result: { data, errCode, errMsg },
      } = await db.collection("goods_detail").add(dataobj.value);
      if (errCode !== 0) {
        return showToast({
          title: errMsg,
        });
      }
    }
    showToast({
      title: "新增成功",
    });
    uni.$emit("Updatelist");
    uni.redirectTo({
      url: "/pages_fena/product/list",
    });
    init();
  } catch (err) {
    showToast({
      title: err,
    });
  } finally {
    uni.hideLoading();
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
    pifacontent: "",
    imageValue: [],
    temparr: [],
    goods_thumb: "", //本地临时图片
  };
};

const showCategoryPicker = () => {
 
};
</script>

<style lang="scss" scoped>
.fenleipp {
  background-color: #fff;
  padding: 20rpx;
  border-radius: 20rpx;
  max-height: 80vh;
  overflow-y: auto;
}
.home {
  padding: 20rpx;

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

  .category-row {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;

    .category-btn {
      margin-right: 20rpx;
      padding: 10rpx 20rpx;
      background-color: #007aff;
      color: #fff;
      border-radius: 10rpx;
    }

    .category-input {
      flex: 1;
    }
  }

  .tijiao {
    padding-top: 150rpx;
    width: 80%;
  }
}
</style>
