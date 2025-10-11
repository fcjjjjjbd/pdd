<script setup>
  import {
    ref
  } from 'vue';

  const demo = ref(null);
  const dataList = ref([]);

  const demoo = async () => {};

  // 新增文章按钮点击事件
  const goToEdit = () => {
    uni.navigateTo({
      url: '/pages_fen/open/edit'
    });
  };
</script>
<template>
  <view class="home">我的新闻组件

    <view class="list-wrap">
      <view class="item-wrap" v-for="item in dataList" :key="item._id"
        @click="routerTo('/pages_fen/open/open-newsdetail?id=' + item._id)">
        <view class="left-wrap">
          <view class="title">
            {{ item.title }}
          </view>
          <view class="info">
            <view @click="updataff(item)"><uni-icons type="compose" size="30"></uni-icons>
            </view>
            <view @click.stop="removeff(item._id)"><uni-icons type="trash" size="30"></uni-icons>
            </view>
          </view>
        </view>
        <view class="right-wrap" v-if="item.avatar">
          <image class="img" :src="item.avatar" mode="aspectFill"></image>
        </view>
      </view>
    </view>

    <!-- 新增文章按钮 -->
    <view class="add-article-btn">
      <button @click="goToEdit">新增文章</button>

    </view>
  </view>
</template>

<style lang="scss" scoped>
  .home {
    padding: 20rpx;
    background-color: #f5f5f5;
    height: 900rpx;
    width: 100%;

    .list-wrap {
      padding: 12rpx 0;

      .item-wrap {
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        align-items: stretch;
        justify-content: space-between;
        padding: 24rpx 32rpx;
        gap: 24rpx;
        height: 200rpx;

        .left-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .title {
            font-size: 30rpx;
            color: #333;
            @include text-ellipsis(2);
          }

          .info {
            display: flex;
            font-size: 26rpx;
            color: #aaa;
            gap: 12rpx;
          }
        }

        .right-wrap {
          flex-shrink: 0;
          height: 100%;
          aspect-ratio: 16 / 10;
          border-radius: 8rpx;
          overflow: hidden;

          .img {
            width: 100%;
            height: 100%;
          }
        }
      }

    }

    /* 新增文章按钮样式 */
    .add-article-btn {
      position: fixed;
      bottom: 60rpx;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      /* 提高 z-index 值确保按钮在最上层 */

      button {
        background-color: #007AFF;
        color: white;
        border-radius: 50rpx;
        padding: 20rpx 40rpx;
        font-size: 32rpx;
      }
    }
  }
</style>