<template>
  <view class="uni-view-container">
    <view class="interaction-bar">
      <!-- 阅读量 -->
      <view class="interaction-item" @click="handleRead">
        <uni-icons type="eye" size="16" color="#999"></uni-icons>
        <text class="interaction-text">{{ formatNumber(readCount) }}</text>
      </view>
      
      <!-- 点赞 -->
      <view class="interaction-item" @click="handleLike">
        <uni-icons 
          :type="isLiked ? 'heart-filled' : 'heart'" 
          size="16" 
          :color="isLiked ? '#ff4757' : '#999'"
        ></uni-icons>
        <text class="interaction-text" :class="{ 'liked': isLiked }">
          {{ formatNumber(likeCount) }}
        </text>
      </view>
      
      <!-- 收藏 -->
      <view class="interaction-item" @click="handleCollect">
        <uni-icons 
          :type="isCollected ? 'star-filled' : 'star'" 
          size="16" 
          :color="isCollected ? '#ffa502' : '#999'"
        ></uni-icons>
        <text class="interaction-text" :class="{ 'collected': isCollected }">
          {{ formatNumber(collectCount) }}
        </text>
      </view>
      
      <!-- 分享 -->
      <view class="interaction-item" @click="handleShare">
        <uni-icons type="redo" size="16" color="#999"></uni-icons>
        <text class="interaction-text">分享</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props 定义
const props = defineProps({
  // 阅读量
  readCount: {
    type: Number,
    default: 0
  },
  // 点赞数
  likeCount: {
    type: Number,
    default: 0
  },
  // 收藏数
  collectCount: {
    type: Number,
    default: 0
  },
  // 是否已点赞
  isLiked: {
    type: Boolean,
    default: false
  },
  // 是否已收藏
  isCollected: {
    type: Boolean,
    default: false
  },
  // 文章ID或其他标识
  itemId: {
    type: [String, Number],
    default: ''
  }
})

// Emits 定义
const emit = defineEmits(['like', 'collect', 'share', 'read'])

// 数字格式化函数
const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

// 处理阅读事件
const handleRead = () => {
  emit('read', props.itemId)
}

// 处理点赞事件
const handleLike = () => {
  emit('like', {
    itemId: props.itemId,
    isLiked: props.isLiked,
    likeCount: props.likeCount
  })
}

// 处理收藏事件
const handleCollect = () => {
  emit('collect', {
    itemId: props.itemId,
    isCollected: props.isCollected,
    collectCount: props.collectCount
  })
}

// 处理分享事件
const handleShare = () => {
  emit('share', props.itemId)
}
</script>

<style lang="scss" scoped>
.uni-view-container {
  width: 100%;
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
  font-size: 24rpx;
  color: #666;
  line-height: 1;
  
  &.liked {
    color: #ff4757;
  }
  
  &.collected {
    color: #ffa502;
  }
}

// 响应式设计
@media (max-width: 750rpx) {
  .interaction-bar {
    gap: 24rpx;
  }
  
  .interaction-item {
    gap: 6rpx;
    padding: 6rpx 10rpx;
  }
  
  .interaction-text {
    font-size: 22rpx;
  }
}
</style>