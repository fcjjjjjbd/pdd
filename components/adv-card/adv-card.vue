<!-- console.log()  <view class=""> </view> {知}1行动做到 1 错1改1 转0为1 不1则0,     v-if="newItem.user_id == isAdminRole()"
      -->
<script setup>
import debounce from "lodash.debounce";
const db = uniCloud.database();
import { showToast } from "@/utils/common.js";
const emit = defineEmits(["clickPic"]); // 声明引入
const current_id = uniCloud.getCurrentUserInfo().uid; // 当前用户id

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
});
const newItem = ref(props.item);
console.log(props.item);
 
// 点击拨通电话
const cliphone = (value) => {
  uni.makePhoneCall({
    phoneNumber: value,
  });
};

// 图片点击事件
const handleImageClick = () => {
  emit("clickPic");
};

const demoo = async () => {};
</script>
<template>
  <view class="adv-card-container">
    <view class="adv-card-left">
      <image
        class="adv-card-image"
        :src="newItem.imageValue?.[0]?.fileID || '/static/images/notPic.png'"
        mode="aspectFill"
        @click="handleImageClick"
      ></image>
    </view>
    <view class="adv-card-right">
      <view class="adv-card-title">
        {{ newItem.content }}
      </view>

      <view class="adv-card-bottom">
        <view class="adv-card-actions">
          <view class="adv-card-icons">
            <!-- 收藏 -->
            <view class="icon-item" @click.stop="clickLike()">
              <uni-icons
                v-if="newItem.isLike"
                type="star-filled"
                size="22"
                color="#ff4d4f"
              ></uni-icons>
              <uni-icons
                v-else
                type="star"
                size="22"
                color="#bfbfbf"
              ></uni-icons>
              <text
                v-if="newItem.like_count > 0"
                class="count-text"
                :class="{ active: newItem.isLike }"
                >{{ newItem.like_count }}</text
              >
            </view>

            <!-- 评论 -->
            <view class="icon-item">
              <uni-icons type="chat" size="22" color="#bfbfbf"></uni-icons>
              <text v-if="newItem.comment_count > 0" class="count-text">
                {{ newItem.comment_count }}
              </text>
            </view>
          </view>

          <view class="adv-card-buttons">
            <view
              v-if="newItem.phone"
              class="action-btn phone"
              @click.stop="cliphone(newItem.phone)"
            >
              <text>电话</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.adv-card-container {
  display: flex;
  padding: 24rpx;
  background-color: #fff;
  border-radius: 20rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.99);
  }

  .adv-card-left {
    width: 220rpx;
    height: 220rpx;
    margin-right: 24rpx;
    flex-shrink: 0;
    border-radius: 16rpx;
    overflow: hidden;
    background-color: #f8f8f8;
    box-shadow: inset 0 0 10rpx rgba(0, 0, 0, 0.02);

    .adv-card-image {
      width: 100%;
      height: 100%;
      transition: transform 0.3s;
    }
  }

  .adv-card-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden; // 防止内容溢出

    .adv-card-title {
      font-size: 30rpx;
      line-height: 1.5;
      font-weight: 600;
      color: #333;
      margin-bottom: 16rpx;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .adv-card-bottom {
      margin-top: auto;
    }

    .adv-card-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10rpx;

      .adv-card-icons {
        display: flex;
        align-items: center;
        gap: 24rpx;

        .icon-item {
          display: flex;
          align-items: center;
          padding: 8rpx 0;

          .count-text {
            font-size: 24rpx;
            color: #999;
            margin-left: 6rpx;
            font-weight: 500;

            &.active {
              color: #ff4d4f;
            }
          }
        }
      }

      .adv-card-buttons {
        display: flex;
        gap: 16rpx;

        .action-btn {
          padding: 0 24rpx;
          height: 56rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 28rpx;
          font-size: 24rpx;
          font-weight: 500;
          color: #fff;
          box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);

          &.phone {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            box-shadow: 0 4rpx 12rpx rgba(79, 172, 254, 0.3);
          }

          &:active {
            opacity: 0.9;
            transform: translateY(2rpx);
          }
        }
      }
    }
  }
}
</style>
