<template>
  <view class="user">
    <navigator url="/uni_modules/uni-id-pages/pages/userinfo/userinfo">
      <view class="top">
        <view class="group">
          <view class="user-wrap">
       
          <view class="userinfo">
            <view class="left" @click="handleLogin">
              <image
                class="img"
                :src="userInfo.avatar || '/static/images/logo.png'"
                mode="aspectFill"
              ></image>
            </view>
            <view class="right">
              <view class="head" @click="handleLogin">
                <view class="nickname" v-if="!hasLogin">游客，请登录</view>
                <view class="nickname" v-else>
                  {{ truncateString(userInfo.nickname, 8) }}
                </view>
                <view class="tag">正式会员</view>
              </view>
              <view class="id" v-if="hasLogin">
                ID：
                <text selectable>{{ userInfo._id }}</text>
              </view>
            </view>
          </view>
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
      </view>
    </view>
  </view>
</template>

<script setup>
import {
  getPageAndParams,
  routerTo,
  showModal,
  truncateString,
} from "../../utils/common";
import { mutations, store } from "@/uni_modules/uni-id-pages/common/store.js";

const db = uniCloud.database(); // 连接云对象整体
const hasLogin = computed(() => store.hasLogin);
// h5当前用户信息
const userInfo = computed(() => store.userInfo);
const handleLogin = () => {
  if (unref(hasLogin)) {
    routerTo("/uni_modules/uni-id-pages/pages/userinfo/userinfo");
  } else {
    routerTo(
      "/" +
        pagesJson.uniIdRouter.loginPage +
        "?uniIdRedirectUrl=" +
        getPageAndParams()
    );
  }
};
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

     	.user-wrap {
			width: 100%;
			padding: 32rpx;
			border-radius: 12rpx;
			background-color: #fff;
			margin-bottom: 32rpx;
			position: relative;

			.userinfo {
				display: flex;
				gap: 20rpx;
				position: relative;

				.left {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
					overflow: hidden;
					flex-shrink: 0;

					.img {
						width: 100%;
						height: 100%;
					}
				}

				.right {
					display: flex;
					flex-direction: column;
					justify-content: center;
					gap: 10rpx;

					.head {
						display: flex;
						gap: 20rpx;

						.nickname {
							font-size: 32rpx;
							font-weight: bolder;
							color: #000;
						}

						.tag {
							background: #eccc7d;
							color: #ae6337;
							font-size: 22rpx;
							padding: 2rpx 16rpx;
							display: flex;
							align-items: center;
							border-radius: 20rpx;
						}
					}

					.id {
						font-size: 22rpx;
						color: #999;
					}
				}
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
