<template>
  <view class="pro-item">
    <view class="pro-item-box shadow" @click="toDetail">
      <view class="pic">
        <image class="img" :src="item.imageValue[0].url" mode="aspectFill"></image>
      </view>
      <view class="text">
        <view class="title u-line-1">{{ item.title }}</view>
        <view class="price">
          <text>¥{{ item.price }}</text>
        </view>
      </view>
    </view>
    <view class="bottom">
      <view class="time">{{ ordertime }}</view>
      <view class="numsf">{{ item.num }}件</view>
      <view class="delete" @click="deleteAddress(item._id)">删除</view>
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";
import dayjs from "dayjs";
import { db } from "@/utils/db.js";
import addcloubobj from "@/utils/addcloub.js";

const props = defineProps({
  item: {
    type: Object,
    default: () => {
      return {};
    },
  },
  type: {
    type: Number,
    default: 0,
  },
});
const ordertime = computed(() => {
  return dayjs(props.item.ordertime).format("YYYY-MM-DD");
});

// 跳转详情页
const toDetail = () => {
  uni.navigateTo({
    url: "/pages/order/detail?id=" + props.item._id,
  });
};

// 删除订单
const deleteAddress = async (id1) => {
  let res = await uni.showModal({
    title: "是否删除",
  });
  if (res.confirm) {
    let imgarr = props.item.imageValue.map((item) => item.url);

    await db.collection("order-detail").doc(id1).remove(); // 删除商品
    addcloubobj.removeimg(imgarr);
    uni.$emit("removemit");
  }
};
</script>

<style lang="scss">
.shadow {
  box-shadow: 0 1rpx 4rpx -4rpx rgba(0, 0, 0, 0.16),
    0 6rpx 12rpx rgba(0, 0, 0, 0.12),
    0 4rpx 16rpx 4rpx rgba(0, 0, 0, 0.09);
}

.pro-item {
  width: 100%;

  .pro-item-box {
    @include flex-box();
    // padding: 20rpx;
    height: 260rpx;
    background-color: #fff;
    border-radius: 8rpx;
    padding: 0 20rpx;

    .pic {
      width: 222rpx;
      height: 220rpx;
      border-radius: 10rpx;
      overflow: hidden;

      .img {
        height: 100%;
        width: 100%;
      }
    }

    .text {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 20rpx;

      .title {
        font-size: 40rpx;
      }

      .price {
        @include flex-box-set(start, end);
        font-weight: bold;
        margin: 20rpx 0;
      }
    }
  }

  .bottom {
    display: flex;
    font-size: 24rpx;
    font-size: 30rpx;
    font-weight: bold;
    @include flex-box();

    .time {
      margin-right: 10rpx;
      color: $text-font-color-2;
    }

    .numsf {
      margin-right: 10rpx;
    }

    .delete {
      border: 2px solid #000;
      border-radius: 50px;
      padding: 3px 5px;
    }
  }
}
</style>