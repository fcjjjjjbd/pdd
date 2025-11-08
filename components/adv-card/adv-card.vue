
<script setup>
import { ref } from "vue";
import { showToast, isAdminRole } from "@/utils/common.js";
const emit = defineEmits(["openpp", "clickPic"]); // 声明引入
const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
});

// 点击拨通电话
const cliphone = (value) => {
  uni.makePhoneCall({
    phoneNumber: value,
  });
};
const starbool = ref(false); // 定义收藏状态

// 收藏功能
const starff = () => {
  starbool.value = !starbool.value;
 
};

//
const comments = () => {
  emit("openpp");
};

// 图片点击事件
const handleImageClick = () => {
  emit("clickPic");
};

const demoo = async () => {};
</script>
<template>
  <view class="adv-card-container">
    <view class="adv-card-left" >
      <image
        class="adv-card-image"
        :src="newItem.imageValue?.[0]?.fileID || '/static/images/logo.png'"
        mode="aspectFill"
        @click="handleImageClick"
      ></image>
    </view>
    <view class="adv-card-right">
      <view class="adv-card-title" @click="clickcopy2(item.content)">
        {{ item.content }}
      </view>
      <view class="adv-card-actions">
        <view class="adv-card-icons">
          <!-- 收藏 -->
          <view class="icon-item" @click="starff()">
            <uni-icons
              v-if="!starbool"
              type="star"
              size="20"
              color="#999"
            ></uni-icons>
            <uni-icons
              v-else
              type="star-filled"
              size="20"
              color="#ff0000"
            ></uni-icons>
            <text v-if="true">0</text>
            <!-- 占位符，可替换为实际收藏数 -->
          </view>

          <!-- 评论 -->
          <view class="icon-item" @click="comments">
            <uni-icons type="chat" size="20" color="#999"></uni-icons>
          </view>
        </view>
        <view class="adv-card-call-button" @click="clickcopy2(item.phone)">
          <button
            class="mini-btn"
            type="primary"
            size="mini"
            @click="cliphone(item.phone)"
          >
            打电话
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.adv-card-container {
  display: flex;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

  .adv-card-left {
    width: 200rpx; // 图片区域宽度
    height: 200rpx; // 图片区域高度
    margin-right: 20rpx;
    flex-shrink: 0; // 防止图片区域缩小

    .adv-card-image {
      width: 100%;
      height: 100%;
      border-radius: 4rpx;
    }
  }

  .adv-card-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .adv-card-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 10rpx;
      // 限制标题为两行，超出部分显示省略号
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .adv-card-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto; // 将操作区域推到底部

      .adv-card-icons {
        display: flex;
        gap: 20rpx; // 图标之间的间距

        .icon-item {
          display: flex;
          align-items: center;
          font-size: 24rpx;
          color: #666;
          padding: 10rpx;
          text {
            margin-left: 8rpx;
          }
        }
      }

      .adv-card-call-button {
        margin: 0 20rpx;
        .mini-btn {
          padding: 0 20rpx;
          height: 60rpx;
          line-height: 60rpx;
          font-size: 28rpx;
        }
      }
    }
  }
}
</style>
