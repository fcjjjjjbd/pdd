<!-- console.log() -->
<template>
     <view class="infos">
      <view class="box1">
  <up-icon name="edit-pen" color="#1C1C1C" size="40"></up-icon>
<view class="">发布订单</view>
</view>
<view class="box1">
  <up-icon name="rmb-circle" color="#FF6A6A" size="40"></up-icon>
<view class="">师傅报价</view>
</view>
     <view class="box1">
  <up-icon name="account" color="#2979ff" size="40"></up-icon>
<view class="">挑选师傅</view>
</view>
  <view class="box1">
  <uni-icons type="phone" color="#9AFF9A" size="40"></uni-icons>

<view class="">预约上门</view>
</view>
 <view class="box1">
  <up-icon name="red-packet" color="#FF6A6A" size="40"></up-icon>
<view class="">验收付款</view>
</view>

  </view>
 
</template>

<script setup>


</script>

<style lang="scss" scoped>
.infos{
  display: flex;
  justify-content: space-between;
	align-items: center;
.box1{
@include flex-box-set();
flex-direction: column;
 position: relative; // 添加相对定位

    &:not(:last-child)::after { // 除了最后一个元素外，其他元素添加伪元素
   content: '';
      position: absolute;
      right: -20px; // 根据需要调整位置
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-top: 5px solid transparent;
      border-bottom: 5px solid transparent;
      border-left: 10px solid black; // 箭头颜色

    }
}
}
</style>