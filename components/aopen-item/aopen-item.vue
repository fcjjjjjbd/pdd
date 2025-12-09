<template>
  <view class="content-container" @click="handleContentClick">
    <!-- 新闻内容区域 -->
    <view class="left-wrap">
      <view class="title">{{ item.name }}</view>
      <!-- 作者昵称 -->
      <!-- 交互栏 -->
      <view class="interaction-bar">
        <view class="author-nickname">{{
          (item.author || "呀11").slice(0, 5)
        }}</view>

        <!-- 阅读量 -->
        <view class="interaction-item">
          阅读
          <text class="interaction-text">{{
            formatNumber(item.readCount || 0)
          }}</text>
        </view>

        <!-- 点赞 -->
        <view class="interaction-item">
          评论
          <text class="interaction-text" :class="{ liked: item.isLiked }">
            {{ formatNumber(item.likeCount || 0) }}
          </text>
        </view>

        <!-- 收藏 -->
        <view class="interaction-item">
          收藏
          <text
            class="interaction-text"
            :class="{ collected: item.isCollected }"
          >
            {{ formatNumber(item.collectCount || 0) }}
          </text>
        </view>
      </view>
    </view>

    <!-- 右边图片 -->
    <view class="right-wrap">
      <image
        class="img"
        :src="item.goods_thumb || '/static/images/notPic.png'"
        mode="aspectFill"
      ></image>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
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
  emit("content-click", props.item);
};

// 处理阅读事件
const handleRead = () => {
  emit("read", props.item);
};
</script>

<style lang="scss" scoped>
.content-container {
  width: 100%;
  border-bottom: 1px solid #f0f0f0;
  padding: 20rpx 5rpx;
  margin-bottom: 16rpx;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
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
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.4;
      margin-bottom: 8rpx;
    }

    .author-nickname {
      font-size: 24rpx;
      color: #666;
      margin-bottom: 8rpx;
    }

    .interaction-bar {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 24rpx;
      padding: 0;
      margin-top: auto;

      .interaction-item {
        display: flex;
        align-items: center;
        gap: 8rpx;
        padding: 6rpx 10rpx;
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
      }
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
      object-fit: cover;
    }
  }
}
</style>
