<!-- 4.6 -->
<template>
  <view class="container">
    <mod-nav-bar title="pdd" title-color="#fff"></mod-nav-bar>

    <!-- 搜索框区域 -->
    <view class="top-box">
      <view class="search-box">
        <uni-search-bar
          placeholder="搜索商品"
          @confirm="onSearch"
          @clear="onClear"
          cancelButton="none"
          focus-color="#007aff"
          bg-color="#f0f2f6"
        />
      </view>
      <view class="text">搜索</view>
    </view>

    <!-- 功能按钮区域 -->
    <view class="top">
      <view class="box" @click="clickPromote">
        <uni-icons type="info" size="28"></uni-icons>
        <view class="text">推广</view>
      </view>
      <!--
      <view class="box" @click="clickshare">
        <uni-icons type="download" size="23"></uni-icons>
        <view class="text">售后</view>
      </view>
      <view class="box" @click="clicktui">
        <uni-icons type="download" size="23"></uni-icons>
        <view class="text">推荐</view>
      </view>
      -->
    </view>

    <!-- 左边分类 -->
    <view class="left-v">
      <view
        :class="index === isActive ? 'active' : ''"
        @click="clickFun(item._id, index)"
        v-for="(item, index) in categoryList"
        :key="item._id"
      >
        {{ item.name }}
      </view>
    </view>
    <view class="right-v">
      <view class="three-v">
        <text
          @click="
            routerTo(
              `/pages/order/edit?category_id=${
                rew._id
              }&name=${encodeURIComponent(rew.name)}`
            )
          "
          class="item"
          v-for="(rew, index) in rights"
          :key="rew._id"
        >
          <view class=""><uni-icons type="contact" size="40"></uni-icons></view>
          {{ rew.name }}
        </text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { showToast, isAdminRole, routerTo } from "@/utils/common.js";

const goodsCloudObj = uniCloud.importObject("client-product-goods");
const categoryList = ref([]);

const isActive = ref(0); //选中的左分类index
const rights = ref([]); //选中的分类右数据

const getCategory = async () => {
  try {
    let { errCode, data, errMsg } = await goodsCloudObj.list();
    if (errCode !== 0) return showToast(errMsg);
    console.log(data);
    categoryList.value = data;
    rights.value = categoryList.value[0].goods;
  } catch (err) {
    console.log(err);
    showToast(err);
  }
};
getCategory();
const clickPromote = () => {
  routerTo("/pages_fena/appcenter/appcenter");
};

const clickshare = () => {
  // 售后功能
  showToast("售后功能开发中...");
};

const clicktui = () => {
  // 推荐功能
  showToast("推荐功能开发中...");
};
// 搜索相关方法
const onSearch = (e) => {
  const keyword = e.value;
  console.log("搜索关键词:", keyword);
  // TODO: 实现搜索逻辑
  showToast("搜索功能开发中...");
};

const onClear = () => {
  console.log("清空搜索");
  // TODO: 实现清空搜索逻辑
};

onMounted(async () => {
  // 如果有分类数据，默认选择第一个分类
  if (categoryList.value.length > 0) {
    rights.value = navlistStore.rightList.filter((item) => {
      return item.category_id === categoryList.value[0]._id;
    });
  }
});
</script>

<style lang="scss" scoped>
.container {
  .top-box {
    width: 100%;
    height: 88rpx;
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 0 20rpx;
    justify-content: space-between;
    margin-bottom: 20rpx;
    color: #333;
    position: relative;
    z-index: 10;

    .search-box {
      flex: 1;
      background-color: #f0f2f6;
      height: 70rpx;
      border-radius: 8rpx;
      display: flex;
      align-items: center;
      padding: 0 20rpx;
      margin-right: 20rpx;
    }

    .text {
      font-size: 35rpx;
      color: #007aff;
      white-space: nowrap;
    }
  }
  .top {
    background: rgba(255, 255, 255, 0.8);
    height: 120rpx;
    border-radius: 120rpx;
    color: #000;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0rpx 2rpx 12rpx rgba(0, 0, 0, 0.1);
    margin: 0 20rpx 20rpx 20rpx;
    position: relative;
    z-index: 5;
    // backdrop-filter: blur(20rpx);

    .box {
      flex-direction: column;

      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 2rpx 12rpx;

      .text {
        font-size: 28rpx;
        color: $text-font-color-2;
      }
    }
  }
  .scrollNav {
    padding: 30rpx;

    scroll-view {
      white-space: nowrap;

      .item {
        display: inline-block;
        padding: 0 30rpx;
        text-align: center;

        .text {
          font-size: 50rpx;
          color: var(--globalColor);
          padding-top: 10rpx;
        }
      }

      .item:first-child {
        padding-left: 0;
      }

      .item:last-child {
        padding-right: 0;
      }
    }
  }

  .left-v {
    width: 200rpx;
    background-color: #f5f5f5;
    height: calc(100vh - 250rpx);
    float: left;
    border-right: 1rpx solid black;
    position: relative;
    z-index: 1;

    view {
      @extend .baseClass;

      &.active {
        background-color: black;
        font-size: 46rpx;
        color: #939393;
        font-weight: 800;
        border-left: 8rpx solid #e98f36;
      }
    }
  }

  .right-v {
    width: 550rpx;
    background-color: #fff;
    height: calc(100vh - 250rpx);
    float: right;
    overflow: scroll;
    position: relative;
    z-index: 1;

    .three-v {
      padding: 10rpx;
      height: calc(100vh - 200rpx);
      overflow: scroll;

      .item {
        background-color: #bbbabc;
        padding: 10rpx;
        border-radius: 15rpx;
        font-size: 39rpx;
        color: black;
        margin-left: 15rpx;
        margin-top: 20rpx;
        text-align: center;
        float: left;
        width: 250rpx;
        overflow: hidden;
        line-height: 1.5;
      }
    }
  }

  .baseClass {
    padding: 20rpx 0;
    text-align: center;
  }

  .navorder {
    width: 120rpx;
    height: 120rpx;
    background: #0199fe;
    border-radius: 50%;
    color: #fff;
    position: fixed;
    z-index: 100;
    bottom: 150rpx;
    right: 50rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 20rpx rgba(1, 153, 254, 0.8);

    .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
