<template>
  <view class="action-bar">
    <view class="action-item input-item" @click="onComment">
      <view class="inputt">写评论</view>
    </view>

    <view class="action-item" @click="onLike">
      <uni-icons
        :type="isFavorite ? 'star-filled' : 'star'"
        size="24"
        :color="isFavorite ? '#FF0000' : '#666'"
      ></uni-icons>
      <text
        >{{ isFavorite ? "已收藏" : "收藏" }}
        {{ detail.like_count > 0 ? detail.like_count : "" }}</text
      >
    </view>

    <view class="action-item" @click="onCall" v-if="detail.phone">
      <uni-icons type="phone-filled" size="24" color="#007aff"></uni-icons>
      <text>拨打电话</text>
    </view>

    <view class="action-item" @click="onCopy" v-if="detail.wx_count">
      <uni-icons type="weixin" size="24" color="#4cd964"></uni-icons>
      <text>复制微信</text>
    </view>

    <view class="action-item" @click="onReport">
      <uni-icons type="info" size="24" color="#dd524d"></uni-icons>
      <text>举报</text>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  detail: {
    type: Object,
    default: () => ({}),
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
});
console.log(props.detail)

const emit = defineEmits(["like", "comment"]);

const onComment = () => {
  emit("comment");
};

const onLike = () => {
  emit("like");
};

const onCall = () => {
  if (props.detail.phone) {
    uni.makePhoneCall({
      phoneNumber: String(props.detail.phone),
    });
  }
};

const onCopy = () => {
  if (props.detail.wx_count) {
    uni.setClipboardData({
      data: props.detail.wx_count,
      success: () => {
        uni.showToast({
          title: "微信已复制",
          icon: "none",
        });
      },
    });
  }
};

const onReport = () => {
  uni.showActionSheet({
    itemList: ["垃圾广告", "违法违规", "涉黄涉暴", "其他"],
    success: (res) => {
      uni.showToast({
        title: "举报已提交",
        icon: "none",
      });
    },
  });
};
</script>

<style lang="scss" scoped>
.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  padding: 20rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 999;
  border-top: 1rpx solid #eee;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;

  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    text {
      font-size: 24rpx;
      color: #666;
      margin-top: 10rpx;
    }
  }

  .input-item {
    width: 220rpx;
    margin-right: 20rpx;
  }

  .inputt {
    width: 100%;
    height: 70rpx;
    background: #f7f7f7;
    border: 1px solid #ccc;
    border-radius: 70rpx;
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    font-size: 28rpx;
    color: #666;
    box-sizing: border-box;
  }
}
</style>
