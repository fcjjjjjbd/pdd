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
      <uni-popup ref="payPopup" type="bottom" :is-mask-click="false">
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

const addcloubobj = uniCloud.importObject("goods-backend");
const db = uniCloud.database();
const dbCmd = db.command;
const paging = ref(null); //分页
const Paylist = ref([]); //列表
const Pay = ref(null); //支付组件
const payPopup = ref(null);
const classyid = ref(null); //分类id
const current_id = ref(uniCloud.getCurrentUserInfo().uid); // 当前用户id
const statuss = ref(0); //管理员功能
const starbool = ref(true); //收藏功能
onLoad((e) => {
  let { id = null } = e;
  classyid.value = id;
  console.log(classyid.value);
  nextTick(() => {
    paging.value.reload();
  });
});

const queryList = async (pageNo, pageSize) => {
  getlist(pageNo, pageSize);
};
// 请求数据
const getlist = async (pageNo, pageSize) => {
  let skip = (pageNo - 1) * pageSize;
  let parmobj = {
    classifyid: classyid.value,
    pageSize,
    skip,
  };
  let {
    result: { errCode, data },
  } = await db
    .collection("pay-order")
    .where(` classifyid == "${classyid.value}" && status == 1 `)
    .orderBy("total_fee", "desc")
    .field("content,order_no,phone,total_fee,status,user_id")
    .skip(skip)
    .limit(pageSize)
    .get();
  console.log(data);
  if (errCode != 0) return;
  paging.value.complete(data);
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
