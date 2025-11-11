<!-- 行动   -->
<template>
  <view class="home">
    <order-map> </order-map>
    <view class="info" @click="goToAdvpayList()">
      <uv-button
        text="渐变色按钮"
        size="normal"
        color="linear-gradient(to right, rgb(66, 83, 216), rgb(213, 51, 186))"
        >师傅广告费排名</uv-button
      >
    </view>

    <view @click="chosse">
      <button size="mini">明码标价</button>
    </view>
    <view class="chosse" @click="chossetype"
      >选择类型:
      <view class="typee">{{ fullName }}</view>
      <view><uni-icons type="right" size="30"></uni-icons></view>
    </view>
    <!-- 添加学博客图片 -->
    <view class="picarr">
      <view class="box pic" v-for="(item, index) in temparr" :key="item._id">
        <image class="img" :src="item.path" mode="aspectFit"></image>
        <view class="mask">
          <view class="icon"> </view>
          <view class="icon" @click="delepic(index)">
            <uni-icons type="trash" size="30"></uni-icons>
          </view>
        </view>
      </view>
      <view class="box add" @click="addpic" v-if="temparr.length < 3">
        <uni-icons type="plus" size="39"></uni-icons>
        添加图片
      </view>
    </view>

    <view class="title">商品备注说明 </view>
    <textarea
      class="textareas"
      v-model="dataobj.content"
      auto-height
      placeholder="订单类型实际描述"
      style="width: 100%; min-height: 400rpx"
    ></textarea>

    <!-- 上门地址 -->
    <view class="delivery-box">
      <view
        class="row-wrap address-wrap"
        @click="routerTo('/pages/my/address?type=select')"
      >
        <view class="left-wrap">
          <view class="label">收货信息：</view>
          <view class="name" v-if="orderStore.addressInfo?._id"
            >{{ orderStore.addressInfo.name }}，{{
              orderStore.addressInfo.phone
            }}</view
          >
          <view class="name" v-else style="font-weight: bold"
            >请选择收货地址</view
          >
          <view class="address" v-if="orderStore.addressInfo?._id">{{
            orderStore.addressInfo.address + orderStore.addressInfo.house
          }}</view>
        </view>
        <view class="right-wrap">
          <uni-icons class="arrow" type="right" size="30rpx" color="#aaa" />
        </view>
      </view>
    </view>

    <view class="tijiao"
      ><button type="primary" @click="tijiao">预约上门</button></view
    >
    <!-- 弹窗 -->

    <!-- 类型选择弹窗 -->
    <uni-popup ref="typePopup" type="bottom" background-color="#fff">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">选择服务类型</text>
          <uni-icons
            type="closeempty"
            size="24"
            @click="closeTypePopup"
          ></uni-icons>
        </view>
        <view class="popup-body">
          <uni-table border stripe emptyText="暂无数据">
            <uni-tr>
              <uni-th align="center" width="80">类型</uni-th>
              <uni-th align="center" width="100">描述</uni-th>
              <uni-th align="center" width="60">操作</uni-th>
            </uni-tr>
            <uni-tr v-for="(item, index) in typeTableData" :key="index">
              <uni-td align="center">{{ item.name }}</uni-td>
              <uni-td align="center">{{ item.desc }}</uni-td>
              <uni-td align="center">
                <button size="mini" type="primary" @click="selectType(item)">
                  选择
                </button>
              </uni-td>
            </uni-tr>
          </uni-table>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
const mmbjydx = uniCloud.importObject("goods-backend", {
  customUI: true,
});
const addressCloudObj = uniCloud.importObject("client-user-address", {
  customUI: true,
});

import { showToast, isAdminRole, addressff, routerTo } from "@/utils/common.js";
import dayjs from "dayjs";
import { removeHtmlTags, convertImageToWebP } from "@/utils/tools.js";
import { usedsmaxStore } from "@/stores/dsmax.js";
import { useOrderStore } from "@/stores/order.js";
const orderStore = useOrderStore();

const maxStore = ref(usedsmaxStore());
const checkobj = uniCloud.importObject("secCheckContent");

const emit = defineEmits(["Updatelist"]);
const current_id = ref(uniCloud.getCurrentUserInfo().uid); // 当前用户id

const urlobj = ref({}); //url参数
const priceInfo = ref([]); //表单数据
const dataobj = ref({
  content: "",
  imageValue: [],
  goods_thumb: "",
  title: "",
}); //订单所有信息

const temparr = ref([]); //本地临时图片
let typelist = [
  "维修 ",
  "安装",
  "清洗保洁",
  "上门回收",
  "移机",
  "淘宝订单",
  "拆除",
  "装修",
];
const trpevalue = ref(typelist[0]); //默认选择

// 表格数据
const typeTableData = ref([
  { name: "维修", desc: "家电维修、水电维修等服务" },
  { name: "安装", desc: "家电安装、家具安装等服务" },
  { name: "清洗保洁", desc: "家电清洗、家庭保洁等服务" },
  { name: "上门回收", desc: "废品回收、旧物回收等服务" },
  { name: "移机", desc: "空调移机、家电移位等服务" },
  { name: "淘宝订单", desc: "淘宝相关服务订单" },
  { name: "拆除", desc: "家电拆除、装修拆除等服务" },
  { name: "装修", desc: "家庭装修、局部装修等服务" },
]);

// 弹窗引用
const typePopup = ref(null);

// 选择类型
const chosse = () => {
  typePopup.value.open();
};

// 关闭弹窗
const closeTypePopup = () => {
  typePopup.value.close();
};

// 选择类型
const selectType = (item) => {
  trpevalue.value = item.name;
  closeTypePopup();
};
const getAddress = async () => {
  try {
    let { errCode, data: [item = {}] = [] } = await addressCloudObj.list({
      pageSize: 1,
    });
    orderStore.addressInfo = item;
  } catch (err) {
    console.log(err);
  }
};
getAddress();
// 获取表格数据
const getnav = async () => {
  let { data } = await mmbjydx.getmmbj(urlobj.value._id);
  console.log(data);
  priceInfo.value = data;
};
//新增价格
const jgadmin = async () => {
  uni.navigateTo({
    url: "/pages_fena/detail_price/detail_price?idd=" + urlobj.value._id,
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

// 选择好图片
const addpic = () => {
  uni.chooseImage({
    count: 3, //默认9
    success: function (res) {
      temparr.value = [...temparr.value, ...res.tempFiles].slice(0, 8);
    },
  });
};
onLoad((e) => {
  urlobj.value = e;
  console.log(urlobj.value);
  getnav();
});
// 选择类型
const chossetype = () => {
  uni.showActionSheet({
    itemList: typelist,
    success: function (res) {
      trpevalue.value = typelist[res.tapIndex];
    },
    fail: function (res) {
      console.log(res.errMsg);
    },
  });
};
const fullName = computed(() => {
  return (trpevalue.value + urlobj.value.name).replace(/\s+/g, ""); // 去除中间空格
});
// 提交
const tijiao = async () => {
  dataobj.value.title = fullName.value;

  if (!dataobj.value.title)
    return showToast({
      title: "请输入标题",
    });
  if (!temparr.value.length)
    return showToast({
      title: "请输入图片",
    });

  if (maxStore.value.ordernum > 6)
    return showToast({
      title: "订单超出",
    });
  dataobj.value.content = removeHtmlTags(dataobj.value.content);
  uni.showLoading();
  let secRes = await checkobj.textSecCheck(
    dataobj.value.content,
    "o5tQd7U__aPjwWnoYBPUivS4C_sw"
  );
  console.log(secRes);
  if (secRes.code == 0) {
    // 响应码是0，继续执行
    goodsff();
  } else {
    // 响应码不是0，显示错误提示并返回
    uni.hideLoading();
    uni.showModal({
      title: secRes.errMsg || "操作失败",
      content: secRes.result?.label
        ? `发布内容存在"${secRes.result.label}"问题,请重新编辑后发布!`
        : "请检查输入内容后重试",
      showCancel: false,
    });
    return;
  }
};

// 提交云端
const goodsff = async () => {
  try {
    uni.showLoading({
      mask: true,
    });
    // 上传云端图片
    for (let item of temparr.value) {
      let yspic = await convertImageToWebP(item.path);
      let res = await uniCloud.uploadFile({
        filePath: yspic,
        cloudPathAsRealPath: true,
        cloudPath:
          "dspic/" + dayjs().format("YYYY-MM-DD") + "/" + Date.now() + ".webp",
      });
      dataobj.value.imageValue.push(res);
    }
    let arr = dataobj.value.imageValue.map((row) => {
      return {
        url: row.fileID,
      };
    });
    dataobj.value.imageValue = arr;
    dataobj.value.goods_thumb = arr[0].url; //封面图
    const { _id } = urlobj.value;
    dataobj.value.category_id = _id;
    let objyun = {
      ...dataobj.value,
      addressobj: orderStore.addressInfo,
      creattime: Date.now(),
      temptime: Date.now() + 345600000,
    };
    let { errCode, errMsg } = await mmbjydx.addorderinfo(objyun);

    if (errCode !== 0)
      return showToast({
        title: errMsg,
      });
    showToast({
      title: "新增成功",
    });
    uni.$emit("Updatelist");
    uni.redirectTo({
      url: "/pages/order/myorderlist",
    });
  } catch (err) {
    showToast({
      title: err,
    });
  } finally {
    uni.hideLoading();
  }
};
// 删除本地图片
const delepic = (index) => {
  temparr.value.splice(index, 1);
};
const goToAdvpayList = () => {
  routerTo(`/pages_fen/advpay/list?id=${urlobj.value.category_id}`);
};
</script>

<style lang="scss" scoped>
.home {
  padding: 20rpx;

  .info {
    margin-bottom: 30rpx;

    .title {
      font-size: 35rpx;
      color: #666;
    }

    .name {
      font-size: 50rpx;
      font-weight: 500;
      margin-top: 10rpx;
    }
  }

  .main {
    margin: 30rpx 0;

    .top {
      margin-bottom: 20rpx;
    }
  }

  .chosse {
    @include flex-box();

    .typee {
      font-size: 45rpx;
    }
  }

  .picarr {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20rpx;
    margin: 20rpx 0;

    .box {
      aspect-ratio: 1;
      border: 1px solid black;
      border-radius: 8rpx;
      overflow: hidden;

      &.pic {
        position: relative;

        .img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .mask {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: opacity 0.3s;

          &:hover {
            opacity: 1;
          }

          .icon {
            color: #fff;
            padding: 10rpx;
          }
        }
      }

      &.add {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #f8f8f8;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
          background: #f0f0f0;
        }
      }
    }
  }

  .title {
    font-size: 32rpx;
    font-weight: 500;
    margin: 30rpx 0 20rpx;
  }

  .textareas {
    width: 100%;
    min-height: 400rpx;
    padding: 20rpx;
    border: 1px solid #eee;
    border-radius: 8rpx;
    font-size: 28rpx;
    line-height: 1.5;
  }

  .row-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 32rpx;
    .label {
      flex-shrink: 0;
      font-size: 28rpx;
      color: #999;
    }
  }

  .address-wrap {
    .left-wrap {
      padding-right: 20rpx;
      .label {
        font-size: 28rpx;
        color: #999;
      }
      .name {
        font-size: 32rpx;
        padding: 10rpx 0;
      }
      .address {
        font-size: 26rpx;
        color: #666;
      }
    }
  }

  .tijiao {
    margin: 60rpx auto;
    width: 80%;

    button {
      width: 100%;
      height: 88rpx;
      line-height: 88rpx;
      font-size: 32rpx;
      border-radius: 44rpx;
    }
  }

  // 弹窗样式
  .popup-content {
    padding: 30rpx;
    max-height: 80vh;

    .popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30rpx;
      padding-bottom: 20rpx;
      border-bottom: 1px solid #eee;

      .popup-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }
    }

    .popup-body {
      max-height: 60vh;
      overflow-y: auto;
    }
  }
}
</style>
