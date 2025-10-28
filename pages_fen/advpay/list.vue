<!-- console.log() 居安思死-->
<template>
  <view class="self">
    <z-paging
      ref="paging"
      v-model="Paylist"
      @query="queryList"
      :default-page-size="6"
      :auto="false"
    >
      <template #loading>
        <uni-load-more status="loading"></uni-load-more>
      </template>
      <view class="content">
        <view class="item" v-for="(item, index) in Paylist" :key="item._id">
          <adv-card :item="item"></adv-card>
        </view>
      </view>
      <view class="bottom">
        <view class="btn" @click="addpp">上传</view>
      </view>
      <uni-popup ref="payPopup" type="bottom">
        <Myedit />
      </uni-popup>
      <!-- 弹窗支付 -->
      <uni-pay ref="Pay" @success="paySuccess" @cancel="payCancel"></uni-pay>
    </z-paging>
  </view>
</template>

<script setup>
import { showToast, isAdminRole } from "@/utils/common.js";
import { priceFormat } from "@/utils/tools.js";
import Myedit from "./child/mynews.vue";
const db = uniCloud.database(); // 连接云对象整体

const pddCloudObj = uniCloud.importObject("client-adv");
const dbCmd = db.command;
const query = ref({
  pageSize: 10,
  pageCurrent: 1,
  category_id: "",
});
const paging = ref(null);
const Paylist = ref([]); //列表
const Pay = ref(null); //支付组件
const payPopup = ref(null);
const current_id = ref(uniCloud.getCurrentUserInfo().uid); // 当前用户id
const statuss = ref(0); //管理员功能
onLoad((e) => {
  let { id = null } = e;
  query.value.category_id = id;
  console.log(e);
  nextTick(() => {
    paging.value.reload();
  });
});

const queryList = async (pageNo, pageSize) => {
  try {
    let { errCode, data } = await pddCloudObj.categorylist(unref(query));
    if (errCode !== 0) return paging.value.complete(false);
    console.log(data);
    paging.value.complete(data);
  } catch (err) {
    paging.value.complete(false);
  }
};

const addpp = () => {
  payPopup.value.open();
};

// 复制地址
const clickcopy2 = (value) => {
  uni.setClipboardData({
    data: value,
    success: () => {
      uni.showToast({
        title: "复制成功",
        icon: "success",
      });
    },
    fail: () => {
      uni.showToast({
        title: "复制失败",
        icon: "none",
      });
    },
  });
};
// 删除
const removeid = async (id, index) => {
  let res = await uni.showModal({
    title: "是否删除",
  });
  if (res.confirm) {
    await db.collection("pay-order").doc(id).remove(); //删除商品
    Paylist.value.splice(index, 1);
  }
};
// 修改
const updataid = async () => {};

//支付成功回调
const paySuccess = (e) => {
  console.log(e);
};
const payCancel = () => {};
</script>

<style lang="scss" scoped>
.self {
  width: 100vw;

  .content {
    width: 100%;
    height: 100%;
    background-color: #fff;
    padding: 10rpx;
    border-radius: 8rpx;

    .item {
      display: flex;
      letter-spacing: 4rpx;
      font-size: 34rpx;
      font-weight: bold;
      border-bottom: 1rpx solid $text-font-color-3;
      padding-bottom: 10rpx;

      .left {
        display: flex;
        align-items: center;
        font-size: 24rpx;
        color: $text-font-color-2;
      }

      .right {
        display: flex;
        flex-direction: column;
        width: 100%;

        .info {
          @include flex-box();

          .rights {
            display: flex;

            .item {
              display: flex;
              align-items: center;

              margin-right: 5rpx;
              .wen {
              }
            }
          }
        }
      }
    }
  }

  .bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 180rpx;
    @include flex-box();
    align-items: center;
    padding: 0 25rpx;
    border-top: 1px solid black;
    background: white;
    z-index: 10;

    .btn {
      width: 50%;
      background-color: rgb(0, 123, 255);
      /* 背景蓝色 */
      color: white;
      /* 字体白色 */
      border-radius: 10rpx;
      /* 圆角 */
      @include flex-box-set();
      height: 100rpx;
      /* 根据需要调整高度 */
      font-size: 32rpx;
      margin-left: 190rpx;
    }
  }
}

.jiedanPopup {
  background: #fff;
  padding: 30rpx;
  width: 100vw;
  border-radius: 30rpx;

  .content {
    .rew {
      .fromIpt {
        border: 1px solid $border-color;
        height: 90rpx;
        padding: 0 20rpx;
        border-radius: 10rpx;
        background: #fcfcfc;
      }
    }
  }

  .footer {
    @include flex-box-set();
  }
}
</style>
