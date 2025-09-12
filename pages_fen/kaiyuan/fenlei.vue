<!-- 4.6 -->
<template>
  <view class="container">
    <view class="u-flex top-box" @click="jump">
      <view class="u-flex search-box">
        <uni-icons type="search" size="20"></uni-icons>
        <text class="text u-m-l-8">搜索</text>
      </view>
    </view>

    <!-- 导航菜单 -->
    <view class="scrollNav">
      <scroll-view scroll-x>
        <!-- 售后功能已转移到个人中心页面 -->
      </scroll-view>
    </view>

    <!-- 左边分类 -->
    <view class="left-v">
      <view
        :class="index === isActive ? 'active' : ''"
        @click="clickFun(item._id, index)"
        v-for="(item, index) in navlistStore.leftList"
        :key="item._id"
      >
        {{ item.name }}
      </view>
    </view>
    <view class="right-v">
      <view class="three-v">
        <text
          @click="clickChlidBtn(rew)"
          class="item"
          v-for="(rew, index) in rights"
          :key="rew._id"
        >
          {{ rew.name }}
        </text>
      </view>
    </view>

    <view
      class="navorder"
      @click="
        jumpToExternalUrl(
          'https://hellouniadmin.dcloud.net.cn/admin/#/uni_modules/uni-cms/pages/article/list/list'
        )
      "
    >
      <view class="item">
        <text>订单</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { useNavlistStore } from "@/stores/navlistStore";

const navlistStore = useNavlistStore();

const db = uniCloud.database();

const dsyunobj = uniCloud.importObject("goods-backend");
const isActive = ref(0); //选中的左分类index
const rights = ref([]); //选中的分类右数据

// 添加的跳转到站外地址的函数
const jumpToExternalUrl = (url) => {
  // #ifdef H5
  window.open(url, "_blank");
  // #endif

  // #ifndef H5
  plus.runtime.openURL(url);
  // #endif
};

const jump = async () => {
  uni.navigateTo({
    url: "/pages/search/search",
  });
};

const clickFun = (id, index) => {
  rights.value = navlistStore.rightList.filter((item) => {
    return item.category_id == id;
  });
  isActive.value = index;
};
// 跳转详情
const clickChlidBtn = async (value) => {
  console.log(value);
  let params = encodeURI(JSON.stringify(value));
  uni.navigateTo({
    url: "/pages/order/edit?feiobj=" + params,
  });
  return;
};

onMounted(async () => {
  await navlistStore.fetchLeftList();
  await navlistStore.fetchRightList();

  if (navlistStore.leftList.length > 0) {
    rights.value = navlistStore.rightList.filter((item) => {
      return item.category_id === navlistStore.leftList[0]._id;
    });
  }
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;

  .top-box {
    width: 100%;
    height: 88rpx;
    background-color: #fff;
    align-items: center;
    padding: 0 20rpx;
    justify-content: space-between;
    margin-bottom: 20rpx;
    color: #333;

    .search-box {
      flex: 1;
      background-color: #f0f2f6;
      height: 90rpx;
      border-radius: 8rpx;
      align-items: center;
    }

    .text {
      font-size: 35rpx;
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

        .pic {
          width: 125rpx;
          height: 125rpx;

          .img {
            width: 100%;
            height: 100%;
          }
        }

        .text {
          font-size: 32rpx;
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
    height: 100vh;
    float: left;
    border-right: 1rpx solid black;

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
    height: 100vh;
    float: right;
    overflow: scroll;

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
