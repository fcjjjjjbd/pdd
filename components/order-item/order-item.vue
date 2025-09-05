<!-- console.log() -->
<template>
  <view class="sfsh">
    <view class="left">
      <view>{{ maxStore.sfselfinfo.name }}师傅</view>
      <view>备注:{{ item.content }}</view>
    </view>
    <view class="right">
      <view class="pricw"> 报价:{{ item.price }}元 </view>
      <view class="phone" @click="gophone"
        ><uni-icons type="phone" size="25" color="green"></uni-icons>
        打电话
      </view>
    </view>
  </view>
</template>

<script setup>
import { usedsmaxStore } from "@/stores/dsmax.js";
const maxStore = ref(usedsmaxStore());

const props = defineProps({
  item: {
    type: Object,
    default() {},
  },
});
// 打电话
const gophone = () => {
  const phoneNumber = String(maxStore.value.sfselfinfo.mobile);
  uni.makePhoneCall({
    phoneNumber: phoneNumber,
  });
};
</script>

<style lang="scss" scoped>
.sfsh {
  border-bottom: 1px solid $text-font-color-3;
  padding: 10px 0;
  @include flex-box();

  .left {
  }
  .right {
    padding: 0 20rpx;
    .pricw {
      width: fit-content;
      color: red;
      margin-bottom: 7px;
      font-size: 45rpx;
    }
    .phone {
      border: 2px solid #000; /* 边框宽度和颜色 */
      border-radius: 50px; /* 边框半径，数值越大越接近椭圆 */
      padding: 5rpx 7rpx;
    }
  }
}
</style>
