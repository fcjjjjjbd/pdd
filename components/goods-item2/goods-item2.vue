<template>
  <view class="pro-item">
    <view class="pro-item-box shadow" @click="toDetail" v-if="item.title">
      <view class="pic">
        <image
          class="img"
          :src="item.goods_thumb || '../../static/images/download.jpg'"
          mode="aspectFill"
        ></image>
      </view>
      <view class="text">
        <view class="title u-line-1"
          >{{ truncateString(item.title, 13) }}
        </view>
        <view class="price">
          <view class="big u-line-2">长治市各市区县包邮 </view>
        </view>
      </view>
    </view>
    <view class="bottom" v-if="type == 0">
      <view class="delete" @click="editobj(item)">修改</view>
      <view
        class="delete"
        v-if="type == 0"
        @click.stop="deleteAddress(item._id)"
        >删除</view
      >
    </view>
  </view>
</template>

<script setup>
import dayjs from "dayjs";
import { usedsmaxStore } from "../../stores/dsmax.js";
const dsmax = usedsmaxStore();
import { addressff } from "../../utils/common.js";
import { truncateString } from "../../utils/tools.js";
const emit = defineEmits(["removemit"]); // 声明引入
const db = uniCloud.database();
const addcloubobj = uniCloud.importObject("goods-backend");
const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  type: {
    type: Number,
    default: 0,
  },
});
const ordertime = computed(() => {
  return dayjs(props.item.ordertime).format("YYYY-MM-DD");
});
//  跳详情页
const toDetail = () => {
  uni.navigateTo({
    url: "/pages/detail/detail?id=" + props.item._id,
  });
};
// 修改对象pinia
const editobj = async (obj) => {
  console.log(obj);
  let params = encodeURIComponent(JSON.stringify(obj));

  uni.navigateTo({
    url: "/pages_fena/product/edit?xgobj=" + params,
  });
}; // 删除订单
const deleteAddress = async (id1) => {
  let res = await uni.showModal({
    title: "是否删除",
  });
  if (res.confirm) {
    //   let imgarr = props.item.imageValue.map((item) => item.url);
    // addcloubobj.removeimg(imgarr);

    await db.collection("goods_detail").doc(id1).remove(); //删除商品
    uni.$emit("removemit");
  }
};
</script>

<style lang="scss">
.shadow {
  box-shadow: 0 1rpx 4rpx -4rpx rgba(0, 0, 0, 0.16),
    0 6rpx 12rpx rgba(0, 0, 0, 0.12), 0 4rpx 16rpx 4rpx rgba(0, 0, 0, 0.09);
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
      /* 边框宽度和颜色 */
      border-radius: 50px;
      /* 边框半径，数值越大越接近椭圆 */
      padding: 3px 5px;
    }
  }
}
</style>
