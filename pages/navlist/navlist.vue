<!-- 4.6 -->
<template>
  <view class="container">
    <mod-nav-bar title="pdd" title-color="#fff"></mod-nav-bar>

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
    rights.value = categoryList.value[0].goods
;
  } catch (err) {
    console.log(err);
    showToast(err);
  }
};
getCategory();
const clickFun = (id, index) => {
  rights.value = categoryList.value[index].goods


  isActive.value = index;
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
