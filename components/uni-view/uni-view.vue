<template>
  <view class="uni-view-container">
    <!-- 新闻内容区域 -->
    <view class="news-content" @click="handleContentClick">
      <view class="content-wrap">
        <view class="left-wrap">
          <view class="title">{{ name }}</view>
        </view>
        <view class="right-wrap" v-if="avatar">
          <image class="img" :src="avatar" mode="aspectFill"></image>
        </view>
      </view>
    </view>

    <!-- 交互栏 -->
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
        <text class="interaction-text" :class="{ liked: isLiked }">
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
        <text class="interaction-text" :class="{ collected: isCollected }">
          {{ formatNumber(collectCount) }}
        </text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import dayjs from "dayjs";

// Props 定义
const props = defineProps({
  // 新闻内容相关
  name: {
    type: String,
    default: "",
  },
  avatar: {
    type: String,
    default: "",
  },
  // 阅读量
  readCount: {
    type: Number,
    default: 0,
  },
  // 点赞数
  likeCount: {
    type: Number,
    default: 0,
  },
  // 收藏数
  collectCount: {
    type: Number,
    default: 0,
  },
  // 是否已点赞
  isLiked: {
    type: Boolean,
    default: false,
  },
  // 是否已收藏
  isCollected: {
    type: Boolean,
    default: false,
  },
  // 文章ID或其他标识
  itemId: {
    type: [String, Number],
    default: "",
  },
});

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
  emit("content-click", props.itemId);
};

// 处理阅读事件
const handleRead = () => {
  emit("read", props.itemId);
};

// 处理点赞事件
const handleLike = () => {
  emit("like", {
    itemId: props.itemId,
    isLiked: props.isLiked,
    likeCount: props.likeCount,
  });
};

// 处理收藏事件
const handleCollect = () => {
  emit("collect", {
    itemId: props.itemId,
    isCollected: props.isCollected,
    collectCount: props.collectCount,
  });
};

// 处理分享事件
// const handleShare = () => {
//   emit("share", props.itemId);
// };
</script>

<style lang="scss" scoped>
.uni-view-container {
  width: 100%;
  border-bottom: 1px solid #f0f0f0;
  padding: 24rpx 32rpx;

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
      font-size: 30rpx;
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
