<template>
  <view class="self">
    <u-cell title="首页分类" isLink url="/pages_fena/z2/z2"></u-cell>

    <u-cell
      title="首页分类列表"
      isLink
      url="/pages_fen/feipin-admin/index"
    ></u-cell>
    <uni-collapse>
      <uni-collapse-item title="crud" :open="true" :show-animation="true">
        <view class="content">
          <u-cell title="用户公告" isLink url="/pages_fena/z3/z3"></u-cell>
          <u-cell title="pdd搜索词" isLink url="/pages_fena/z4/z4"></u-cell>
        </view>
      </uni-collapse-item>
    </uni-collapse>
    <u-cell
      title="商品id删除,加积分,是否推荐"
      isLink
      url="/pages_fena/managerff/managerff"
    ></u-cell>
    <u-cell title="商品审核" isLink url="/pages_fena/reviewed/list"></u-cell>
    <u-cell title="投诉列表" isLink url="/pages_fena/gonggao/gonggao"></u-cell>

    <view class="goback" @click="goback">返回</view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
const goback = () => {
  uni.reLaunch({
    url: "/pages/navlist/navlist",
  });
};
</script>

<style lang="scss" scoped>
.self {
  .goback {
    position: fixed;
    top: 1vh;
    left: 10rpx;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.3);
    width: 70rpx;
    height: 70rpx;
    border-radius: 50%;
    @include flex-box-set();
  }
}
</style>
