<template>
  <view class="user">
    <navigator url="/uni_modules/uni-id-pages/pages/userinfo/userinfo">
      <view class="top">
        <view class="group">
          <!-- 头像 -->
          <view class="userinfo">
            <view class="pic">
              <image
                :src="
                  userStore?.userInfo?.avatar || '../../static/images/logo.png'
                "
                mode="aspectFill"
              ></image>
              <image
                :src="
                  userInfo?.avatar_file?.url || '../../static/images/logo.png'
                "
                mode="aspectFill"
              ></image>
            </view>
            <!-- 昵称 -->
            <view class="text" v-if="true">
              <view class="nickname">{{ userStore.userInfo.username }}</view>
              <view class="nickname">{{ userInfo.nickname }}</view>
              <view class="year"> </view>
            </view>
            <view class="text" v-else>
              <view class="nickname">点击登录</view>
            </view>
          </view>
          <view class="more">
            <uni-icons type="arrow-right" size="30"></uni-icons>
          </view>
        </view>

        <view class="bg">
          <!-- #ifdef MP-WEIXIN -->
          <image
            :src="userStore?.userInfo?.avatar || '../../static/images/logo.png'"
            mode="aspectFill"
          ></image>
          <!-- #endif -->
          <!-- #ifdef H5 -->
          <image
            :src="userInfo?.avatar_file?.url || '../../static/images/logo.png'"
            mode="aspectFill"
          ></image>

          <!-- #endif -->
        </view>
      </view>
    </navigator>

    <!-- 我的订单 -->
    <view class="order-wrap">
      <view class="head">
        <view class="label">我的订单</view>
        <view class="value" @click="routerTo('/pages/order/myorderlist')">
          查看全部
          <uni-icons type="right" color="#999"></uni-icons>
        </view>
      </view>
      <view class="list">
        <view class="item" v-for="item in orderMenus" :key="item.value">
          <view class="icon-wrap">
            <!-- <text class="iconfont" :class="item.icon"></text>
             -->
            <uni-icons type="contact" size="30"></uni-icons>
            <view class="tag">3</view>
          </view>
          <view class="label">{{ item.text }}</view>
        </view>
      </view>
    </view>

    <view class="main">
      <view class="group">
        <navigator url="/pages/my/address">
          <view class="item">
            <view class="left"
              ><text class="iconfont icon-a-32-wenjian"></text
              ><text class="text">收货地址</text></view
            >
            <uni-icons type="arrow-right" size="30"></uni-icons>
          </view>
        </navigator>
        <navigator url="/pages_fena/love/love">
          <view class="item">
            <view class="left"
              ><text class="iconfont icon-a-106-xihuan"></text
              ><text class="text">我的收藏</text></view
            >
            <uni-icons type="arrow-right" size="30"></uni-icons>
          </view>
        </navigator>
        <!-- 
        <navigator url="/pages_fena/product/list">
          <view class="item">
            <view class="left"
              ><text class="iconfont icon-a-24-bianji"></text
              ><text class="text">添加商品</text></view
            >
            <uni-icons type="arrow-right" size="30"></uni-icons>
          </view>
        </navigator> -->

   
        <navigator url="/pages/shifu/list">
          <view class="item">
            <view class="left"
              ><text class="iconfont icon-a-32-wenjian"></text
              ><text class="text">师傅接单</text></view
            >
            <uni-icons type="arrow-right" size="30"></uni-icons>
          </view>
        </navigator>

        <navigator url="/pages_fena/manage/list">
          <view class="item" v-if="isAdminRole()">
            <view class="left"
              ><text class="iconfont icon-a-5-xinxi"></text
              ><text class="text">后台管理</text></view
            >
            <uni-icons type="arrow-right" size="30"></uni-icons>
          </view>
        </navigator>
      </view>
    </view>
  </view>
</template>

<script setup>
import { isAdminRole, routerTo } from "@/utils/common.js";
import { useUserStore } from "@/stores/user.js";
import { store, mutations } from "@/uni_modules/uni-id-pages/common/store.js";
import { ORDER_STATUS_ENUMS } from "@/utils/config.js";
const userStore = ref(useUserStore()); // 微信当前pinia用户信息

const orderMenus = ORDER_STATUS_ENUMS().filter((item) => item.myOrder === true);

const db = uniCloud.database(); // 连接云对象整体
// h5当前用户信息
const userInfo = computed(() => store.userInfo);
</script>

<style lang="scss">
.user {
  .top {
    height: 300rpx;
    background: #bbb;
    padding: 0 30rpx;
    padding-top: var(--status-bar-height);
    position: relative;
    display: flex;
    align-items: center;

    .group {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      color: #fff;

      .userinfo {
        display: flex;
        width: 100%;
        align-items: center;

        .pic {
          width: 120rpx;
          height: 120rpx;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #fff;

          image {
            width: 100%;
            height: 100%;
          }
        }

        .text {
          padding-left: 20rpx;

          .nickname {
            font-size: 44rpx;
            font-weight: 600;
          }

          .year {
            font-size: 26rpx;
            opacity: 0.6;
            padding-top: 5rpx;
          }
        }
      }

      .more {
        .iconfont {
          font-size: 40rpx;
        }
      }
    }

    .bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;

      image {
        width: 100%;
        height: 100%;
        filter: blur(20px);
        transform: scale(2);
        opacity: 0.5;
      }
    }
  }

  .order-wrap {
    position: relative;
    width: 100%;
    border-radius: 12rpx;
    background-color: #fff;
    margin-bottom: 32rpx;

    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 80rpx;
      padding: 0 32rpx;
      border-bottom: 1px solid #f4f4f4;

      .label {
        font-size: 28rpx;
        color: #333;
      }

      .value {
        font-size: 26rpx;
        color: #999;
        display: flex;
        align-items: center;
      }
    }

    .list {
      min-height: 100rpx;
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
      padding: 32rpx 0;

      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 10rpx;

        .icon-wrap {
          position: relative;

          .iconfont {
            font-size: 52rpx;
          }

          .tag {
            position: absolute;
            right: -6rpx;
            top: -6rpx;
            min-width: 26rpx;
            height: 26rpx;
            padding: 6rpx;
            font-size: 18rpx;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: $uni-color-primary;
            border-radius: 26rpx;
          }
        }

        .label {
          font-size: 28rpx;
          color: #333;
        }
      }
    }
  }

  .main {
    width: 100%;
    min-height: 200rpx;
    background: #fff;
    border-radius: 30rpx;
    transform: translateY(-30rpx);
    padding: 30rpx 0;

    .group {
      padding: 15rpx 30rpx;
      border-bottom: 15rpx solid #f4f4f4;

      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 25rpx 0;
        font-size: 36rpx;
        color: #555;
        border-bottom: 1rpx solid #f8f8f8;

        .left {
          display: flex;
          align-items: center;

          .iconfont {
            font-size: 38rpx;
            margin-right: 10rpx;
          }
        }

        .right {
          .iconfont {
            font-size: 26rpx;
          }
        }
      }

      .item:last-child {
        border: none;
      }
    }
  }
}
</style>
