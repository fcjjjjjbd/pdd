<!-- <view class=""></view>  -->
<template>
  <view>
    <view class="home">
      <view class="nav">
        <view
          :class="{ active: currentContent === 'detail' }"
          @click="showContent('detail')"
          >订单详情</view
        >
        <view
          :class="{ active: currentContent === 'list' }"
          @click="showContent('list')"
          >限时报价</view
        >
      </view>

      <view v-if="orderdetail">
        <view v-show="currentContent === 'detail'" class="detail">
          <scroll-view scroll-y class="scroll-view">
            <view class="top1">
              <view class="djstime">距离报价结束{{ endtime }}</view>
              <view class="guize" @click="guizepp">
                <uni-icons type="email-filled" size="30"></uni-icons>
                服务说明
              </view>
            </view>

            <order-map></order-map>
            <view class="banner">
              <swiper
                circular
                indicator-dots
                indicator-color="rgba(255,255,255,0.5)"
                indicator-active-color="#fff"
                autoplay
                interval="8000"
              >
                <swiper-item
                  v-for="(row, index) in orderdetail.imageValue"
                  :key="index"
                >
                  <image
                    @click="clickpic(index)"
                    :src="row.url || '../../static/images/logo.png'"
                    mode="scaleToFill"
                  >
                  </image>
                </swiper-item>
              </swiper>
            </view>
            <view class="title">{{ orderdetail.title }}</view>
            <view
              class="addressinfo"
              @click="clickcopy1"
              v-if="orderdetail.addressobj"
            >
              {{
                orderdetail.addressobj.area_name +
                orderdetail.addressobj.address
              }}
            </view>

            <view class="content">
              <view class="top">订单详细内容</view>
              <text> {{ orderdetail.content }}</text>
            </view>
            <view class="copy">下单时间:5.16</view>
            <view class="copy" @click="clickcopy2(orderdetail._id)"
              >订单id: {{ orderdetail._id }}</view
            >
          </scroll-view>
        </view>
      </view>
      <view v-show="currentContent === 'list'" class="list">
        <view class="name1" @click="goadv">师傅广告费排名</view>
        <view class="item" v-for="item in orderlist" :key="item">
          <order-item :item="item"></order-item>
        </view>
      </view>

      <view class="btn" v-if="orderdetail.user_id !== current_id">
        <view class="left">
          <view class="item" @click="gosfdb">
            <uni-icons type="contact" size="30"></uni-icons>
            <text>师傅名片</text>
          </view>
        </view>
        <view class="right" @click="jiepupub">现在抢单</view>
      </view>
    </view>

    <uni-popup ref="jiedanPopup">
      <view class="jiedanPopup">
        <view class="content">
          <view class="rew"
            >报价金额<input
              type="number"
              maxlength="5"
              v-model.number="editobj.price"
              class="fromIpt"
              placeholder="输入真实价格"
            />
          </view>
          <view class="rew"
            >报价备注<input
              type="text"
              maxlength="13"
              v-model="editobj.content"
              class="fromIpt"
              placeholder="输入备注信息"
          /></view>
        </view>
        <view class="footer">
          <button @click="submitjiedan" type="primary" size="mini">提交</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { usedsmaxStore } from "@/stores/dsmax.js";
const maxStore = ref(usedsmaxStore());

import { showToast } from "@/utils/common.js";
import dayjs from "dayjs";
const db = uniCloud.database();
const dbCmd = db.command;
const $ = dbCmd.aggregate;

const addcloubobj = uniCloud.importObject("goods-backend");
const editobj = ref({
  //接单对象
  price: null,
  content: "",
});
const currentContent = ref("detail");
const orderid = ref(null); //详情页id
const orderdetail = ref({}); //详情页实例
const orderlist = ref([]); //师傅订单实例

const jiedanPopup = ref(null); //接单弹窗
const current_id = ref(uniCloud.getCurrentUserInfo().uid); // 当前用户id

onLoad((e) => {
  let { id = null } = e;
  orderid.value = id;
  getdetail();
});
// 报价结束
const endtime = computed(() => {
  return dayjs(orderdetail.value.temptime).format("MM月DD日HH时");
});
//  接单
const jiepupub = async () => {
  jiedanPopup.value.open();
};
// 接单
const submitjiedan = async () => {
  if (!maxStore.value.sfselfinfo) {
    uni.navigateTo({
      url: "/pages/shifu/selfdb",
    });
    return;
  }
  let result = orderlist.value.some((item) => item.user_id == current_id.value);
  if (result)
    return uni.showToast({
      title: "您已经接单了",
      icon: "none",
    });
  editobj.value = {
    ...editobj.value,
    detail_id: orderdetail.value._id,
  };

  let {
    result: { errCode },
  } = await db.collection("shifu-order").add(editobj.value);
  if (errCode !== 0) return;
  showToast({
    title: "抢单成功",
  });
  showContent("list"); //跳转到列表页
  getdetail();
  jiedanPopup.value.close();
};
// 详情信息
const getdetail = async () => {
  console.log(orderid.value);
  let {
    result: { errCode, data },
  } = await db
    .collection("order-detail")
    .aggregate()
    .match({
      _id: orderid.value,
    })
    .lookup({
      from: "shifu-order",
      let: {
        uid: "$_id",
      },
      pipeline: $.pipeline()
        .match(dbCmd.expr($.eq(["$detail_id", "$$uid"])))
        .done(),
      as: "allorder",
    })
    .end();
  console.log(data);
  orderdetail.value = data[0];
  orderlist.value = data[0].allorder;
};

// 切换导航
const showContent = (content) => {
  currentContent.value = content;
};
// 规则
const guizepp = () => {
  console.log("规则");
  uni.navigateTo({
    url: "/pages_fena/appcenter/appcenter",
  });
};
// 师傅自己信息
const gosfdb = () => {
  uni.navigateTo({
    url: "/pages/shifu/selfdb",
  });
};
// 师傅广告费
const goadv = () => {
  uni.navigateTo({
    url: "/pages_fen/advpay/list?id=" + dsobj.value._id,
  });
};
// 轮播图放大
const clickpic = (index) => {
  const arr = orderdetail.value.imageValue.map((row) => row.url);
  uni.previewImage({
    urls: arr,
    current: index,
  });
};
// 复制
const clickcopy1 = () => {
  let Address = `${orderdetail.value.addname}${orderdetail.value.address}`;
  uni.setClipboardData({
    data: Address,
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
</script>

<style lang="scss" scoped>
.home {
  padding: 10px;
  height: 100vh;
  /* 设置为视口高度 */
  display: flex;
  flex-direction: column;

  .nav {
    display: flex;
    justify-content: space-evenly;
    padding: 10px;

    view {
      padding: 10rpx 20rpx;
      cursor: pointer;

      &.active {
        color: rgb(255, 0, 8);
        /* 高亮字体蓝色 */
        font-weight: bold;
        font-size: 39rpx;
      }
    }
  }

  .scroll-view {
    flex: 1;
    /* 占据剩余空间 */
    padding-bottom: 180rpx;
  }

  .detail {
    .top1 {
      @include flex-box();

      .guize {
        justify-content: center;
        align-items: center;
        border-top: 1px solid black;
      }
    }

    .banner {
      width: 650rpx;
      padding: 30rpx 0;
      height: 480rpx;

      swiper {
        width: 100%;
        height: 100%;

        &-item {
          width: 100%;
          height: 100%;
          padding: 0 30rpx;

          image {
            width: 100%;
            height: 100%;
            border-radius: 10rpx;
          }
        }
      }
    }

    .title {
      font-size: 48rpx;
      font-weight: bold;
      border-bottom: 1px solid $text-font-color-3;
      margin-bottom: 17rpx;
    }

    .addressinfo {
      font-size: 38rpx;
      border-bottom: 1px solid $text-font-color-3;
      margin-bottom: 17rpx;
    }

    .content {
      padding: 30rpx 0;

      .text {
        color: black;
        padding-left: 10rpx;
        width: 80rpx;
        line-height: 1em;
        text-align: right;
        font-size: 28rpx;
      }
    }
  }

  .list {
    flex: 1;
    /* 占据剩余空间 */
    padding-bottom: 180rpx;
    
    .name1 {
      font-size: 32rpx;
      text-align: center;
      margin-bottom: 20rpx;
      color: #007bff;
      text-decoration: underline;
    }
  }

  .btn {
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

    .left {
      display: flex;

      .item {
        display: flex;
        flex-direction: column;
        padding: 10rpx 15rpx;
      }
    }

    .right {
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
    }
  }
}

.jiedanPopup {
  background: #fff;
  padding: 30rpx;
  width: 80vw;
  border-radius: 30rpx;

  .content {
    .rew {
      .fromIpt {
        border: 1px solid $border-color;
        height: 80rpx;
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
