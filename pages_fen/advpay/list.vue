<!-- console.log() 居安思死-->
<template>
  <view>
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
        <view class="top"> </view>
        <view class="content">
          <view class="item" v-for="(item, index) in Paylist" :key="item._id">
            <view class="left"> {{ priceFormat(item.total_fee) }}¥ </view>
            <view class="right">
              <view class="top1" @click="clickcopy2(item.content)">
                {{ item.content }}
              </view>
              <view class="info">
                <view class="phone" @click="clickcopy2(item.phone)">
                  {{ item.phone }}
                </view>
                <view class="rights">
                  <view class="item" @click="starff">
                    <view class="wen"></view>
                    <uni-icons
                      v-if="starbool"
                      type="star"
                      size="28"
                      color="#999"
                    ></uni-icons>
                    <uni-icons
                      v-else
                      type="star-filled"
                      size="28"
                      color="#ff0000"
                    ></uni-icons>
                    <text v-if="false">5</text>
                  </view>

                  <view
                    class="item"
                    v-if="item.user_id == current_id || isAdminRole()"
                    @click="removeid(item._id, index)"
                  >
                    <uni-icons type="trash" size="30"></uni-icons>
                  </view>
                  <view
                    class="item"
                    v-if="item.user_id == current_id || isAdminRole()"
                    @click="updataid()"
                  >
                    <uni-icons type="chat-filled" size="30"></uni-icons>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="bottom">
          <view class="btn" @click="addpp">上传</view>
        </view>
      </z-paging>
    </view>
    <uni-popup ref="payPopup">
      <view class="jiedanPopup">
        <view class="content">
          <view class="rew"
            >支付广告费<uni-easyinput
              type="number"
              maxlength="4"
              v-model.number="payobj.total_fee"
              class="fromIpt"
              placeholder="付费"
            />
          </view>
          <view class="rew"
            >业务描述明码标价<uni-easyinput
              type="text"
              maxlength="55"
              v-model="payobj.content"
              class="fromIpt"
              placeholder="输入自己的业务信息,每个价格"
          /></view>
          <view class="rew"
            >电话/微信<uni-easyinput
              type="text"
              maxlength="12"
              v-model="payobj.phone"
              class="fromIpt"
              placeholder="输入电话号"
          /></view>
        </view>
        <view class="footer">
          <button @click="submit" type="warn" size="default">支付</button>
        </view>
      </view>
    </uni-popup>
    <!-- 弹窗支付 -->
    <uni-pay ref="Pay" @success="paySuccess" @cancel="payCancel"></uni-pay>
  </view>
</template>

<script setup>
import { showToast, isAdminRole } from "@/utils/common.js";
import { priceFormat } from "@/utils/tools.js";

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
const payobj = ref({
  total_fee: null,
  content: "",
  phone: "",
}); //支付对象
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
// 收藏
const starff = () => {
  starbool.value = !starbool.value;
};
const addpp = () => {
  payPopup.value.open();
};
//提交云端
const submit = () => {
  // 自由return支付
  statuss.value = 1;
  payobj.value.total_fee = 2;
  if (payobj.value.total_fee < 2)
    return showToast({
      title: "最低2元",
    });
  if (isAdminRole()) {
    statuss.value = 1;
  }
  createOrder();
};
// 支付
const createOrder = async () => {
  // #ifdef MP-WEIXIN
  let provider = "wxpay";
  // #endif
  // #ifndef MP-WEIXIN
  let provider = "alipay";
  // #endif
  let order_no = Date.now() + "_" + String(Math.random()).substring(3, 9);
  let obj = {
    ...payobj.value,
    total_fee: payobj.value.total_fee * 100,
    orderType: "payad",
    order_no,
    classifyid: classyid.value,
    status: statuss.value,
  };
  let {
    result: { errCode },
  } = await db.collection("pay-order").add(obj);

  if (errCode != 0) return;
  let out_trade_no = order_no + "_" + String(Math.random()).substring(3, 9);
  // statuss.value = 0;
  //  自由
  payPopup.value.close();
  const newItem = {
    _id: 123,
    content: payobj.value.content,
    total_fee: payobj.value.total_fee,
    phone: payobj.value.phone,
  };
  Paylist.value.unshift(newItem);
  return;
  Pay.value.createOrder({
    provider,
    total_fee: payobj.value.total_fee * 100, // 支付金额，单位分 100 = 1元
    type: "goods", // 支付回调类型
    order_no, // 业务系统订单号
    out_trade_no, // 插件支付单号
    description: "支付师傅广告费", // 支付描述
  });
  payPopup.value.close();
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
