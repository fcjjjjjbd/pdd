<!-- console.log()  <view class=""> </view> for()行动做到 错1改1 转恶0为善1 -->
<template>
  <view class="Layout">
    <view class="top u-m-b-20">
      <view class="box" @click="clicktui">
        <uni-icons type="download" size="23"></uni-icons>
        <view class="text">推荐排行</view>
      </view>
    </view>

    <view class="share">
      <scroll-view scroll-y>
        <view class="info">
          <view class="code">
            <view class="pic">
              <image
                class="img"
                src="https://mp-f18d6178-7240-42d3-98b7-73076158595e.cdn.bspapp.com/cloudstorage/58524128-ec73-4e18-b6f1-fc62e65cbaaf.png"
                mode="aspectFit"
              ></image>
            </view>
   <!-- <view class="pic">
              <image class="img" :src="dingpic" mode="aspectFit"></image>
            </view> -->
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { showToast } from "../../utils/common";
const infoPopup = ref(null);
const advarr = ref([]); //公告数组

// 推荐
const clicktui = async () => {
  // 页面已删除，暂时禁用导航
  uni.showToast({
    title: "功能暂不可用",
    icon: "none",
  });
};
// 复制网站二维码
const copyy = async (value) => {
  uni.setClipboardData({
    data: value,
    success: (res) => {
      console.log(res);
    },
    fail: (err) => {
      console.log(err);
    },
  });
  showToast("复制成功");
};
// 分享
const clickshare = () => {
  infoPopup.value.open();
};
</script>

<style lang="scss">
.Layout {
  padding: 20rpx;

  .top {
    background: rgba(255, 255, 255, 0.8);
    height: 120rpx;
    border-radius: 120rpx;
    color: #000;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0rpx 2rpx 12rpx rgba(0, 0, 0, 0.1);
    // backdrop-filter: blur(20rpx);

    .box {
      flex-direction: column;

      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 2rpx 12rpx;

      .text {
        font-size: 28rpx;
        color: $text-font-color-2;
      }
    }
  }

  .content {
    width: 100%;
    height: 100%;
    background-color: #fff;
    padding: 20rpx;
    border-radius: 8rpx;

    .item {
      letter-spacing: 4rpx;
      font-size: 34rpx;
      font-weight: bold;
      border-bottom: 1rpx solid $text-font-color-3;
      padding-bottom: 28rpx;
    }
  }
}

.qun {
  display: flex;
  flex-direction: column;

  .num {
    margin-bottom: 20rpx;
    font-size: 28rpx;
    color: #333;
  }
}

.share {
  background: #fff;
  padding: 20rpx;
  border-radius: 30rpx 30rpx 0 0;
  overflow: hidden;
  font-size: 28rpx;

  scroll-view {
    max-height: 80vh;

    .info {
      .code {
        width: 100%;
        height: 100%;
      }

      .pic {
        width: 600rpx;
        height: 600rpx;
        margin: 0 auto;
        background: #fff;
        border-radius: 8rpx;
        overflow: hidden;

        .img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
