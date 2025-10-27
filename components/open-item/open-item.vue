<template>
  <view class="uni-view-container">
    <!-- 新闻内容区域 -->
    <view class="news-content" @click="handleContentClick">
      <view class="content-wrap">
        <view class="left-wrap">
          <view class="title">{{ item.name }}</view>
        </view>
        <view class="right-wrap" >
          <image class="img" :src="item.goods_thumb" mode="aspectFill"></image>
        </view>
      </view>
    </view>

    <!-- 交互栏 -->
    <view class="interaction-bar">
      <!-- 阅读量 -->
      <view class="interaction-item" >
        <uni-icons type="eye" size="16" color="#666"></uni-icons>
        <text class="interaction-text">{{ formatNumber(item.readCount || 0) }}</text>
      </view>

      <!-- 点赞 -->
      <view class="interaction-item" >
        <uni-icons
          :type="item.isLiked ? 'heart-filled' : 'heart'"
          size="16"
          :color="item.isLiked ? '#ff4757' : '#666'"
        ></uni-icons>
        <text class="interaction-text" :class="{ liked: item.isLiked }">
          {{ formatNumber(item.likeCount || 0) }}
        </text>
      </view>

      <!-- 收藏 -->
      <view class="interaction-item">
        <uni-icons
          :type="item.isCollected ? 'star-filled' : 'star'"
          size="16"
          :color="item.isCollected ? '#ffa502' : '#666'"
        ></uni-icons>
        <text class="interaction-text" :class="{ collected: item.isCollected }">
          {{ formatNumber(item.collectCount || 0) }}
        </text>
      </view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  },
})

// Emits 定义
const emit = defineEmits(["like", "collect", "read", "content-click"]);

// 数字格式化函数
const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + "w";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
};

// 处理内容点击事件
const handleContentClick = () => {
  emit("content-click", props.item);
};

// 处理阅读事件
const handleRead = () => {
  emit("read", props.item);
};


</script>

<style lang="scss" scoped>
.uni-view-container {
  width: 100%;
  border-bottom: 1px solid #f0f0f0;
  padding: 24rpx 5rpx;

  &:last-child {
    border-bottom: none;
  }
}

.news-content {
  margin-bottom: 16rpx;

  .content-wrap {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    gap: 24rpx;
    height: 200rpx;
  }

  .left-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .title {
      font-size: 35rpx;
      color: #333;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.4;
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

.interaction-bar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 32rpx;
  padding: 16rpx 0;
}

.interaction-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 12rpx;
  border-radius: 20rpx;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: #e9ecef;
  }

  &:active {
    transform: scale(0.95);
  }
}

.interaction-text {
  font-size: 40rpx;
  color: #666;
  line-height: 1;

}

// 响应式设计
@media (max-width: 750rpx) {
  .interaction-bar {
    gap: 24rpx;
  }

  .interaction-item {
      padding: 6rpx 10rpx;
  }

  .interaction-text {
    font-size: 35rpxrpx;
  }
}
</style>
