<template>
  <view class="article-item" @click="onArticleClick">
    <view class="image-wrap">
      <image :src="info.cover" mode="aspectFill" class="cover-image"></image>
    </view>
    <view class="content-wrap">
      <view class="title">{{ info.title }}</view>
      <view class="stats">
        <view class="stat-item">
          <uni-icons type="heart" size="16" color="#999"></uni-icons>
          <text class="stat-text">{{ info.likes }}</text>
        </view>
        <view class="stat-item">
          <uni-icons type="eye" size="16" color="#999"></uni-icons>
          <text class="stat-text">{{ info.views }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  info: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

const onArticleClick = () => {
  emit('click', props.info)
}
</script>

<style lang="scss" scoped>
.article-item {
  display: flex;
  padding: 24rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  
  .image-wrap {
    width: 200rpx;
    height: 150rpx;
    border-radius: 12rpx;
    overflow: hidden;
    flex-shrink: 0;
    
    .cover-image {
      width: 100%;
      height: 100%;
    }
  }
  
  .content-wrap {
    flex: 1;
    margin-left: 24rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
    .title {
      font-size: 32rpx;
      font-weight: 500;
      color: #333;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    
    .stats {
      display: flex;
      align-items: center;
      margin-top: 16rpx;
      
      .stat-item {
        display: flex;
        align-items: center;
        margin-right: 32rpx;
        
        .stat-text {
          font-size: 24rpx;
          color: #999;
          margin-left: 8rpx;
        }
      }
    }
  }
}
</style>