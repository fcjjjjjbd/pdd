<script setup>
const demo = ref(null);

const demoo = async () => {};
</script>
``` html
<view class="card">
  <image :src="../../static/images/logo.png" mode="aspectFill"></image>
  <text>运动鞋</text>
 <uv-button text="测试"></uv-button>
</view>
``` ``` css
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
}
</style>
```
