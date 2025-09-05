<!-- 行动   -->
<template>
  <view class="home">
    <order-map> </order-map>
    <view class="info">
      <view class="name"> </view>
    </view>

    <view class="main">
      <view class="top" v-if="isAdminRole()">
        <button type="primary" size="mini" plain @click="jgadmin">
          价格后台
        </button></view
      >
      <view>{{ urlobj.name }}明码标价</view>
      <uni-table border stripe emptyText="暂无更多数据">
        <!-- 表头行 -->
        <uni-tr>
          <uni-th align="center">上门服务类型</uni-th>
          <uni-th align="center">上门收费价格(元)</uni-th>
        </uni-tr>
        <!-- 表格数据行 -->
        <uni-tr v-for="row in priceInfo">
          <uni-td style="font-size: 35rpx; color: black">{{
            row.title
          }}</uni-td>
          <uni-td
            ><view class="tabbrinfo">
              <view class="chil" style="color: red; font-size: 35rpx">
                ￥{{ row.price }}
              </view>
            </view></uni-td
          >
          <uni-td> </uni-td>
        </uni-tr>
      </uni-table>
    </view>
    <view v-if="true">
      <up-collapse accordion>
        <up-collapse-item title="进价渠道">
          <template #value>
            <view class="">下拉打开</view>
          </template>
          <text>{{ urlobj.jinjia }} 11</text>
        </up-collapse-item>
      </up-collapse>
    </view>
    <view>现在发布预约上门</view>
    <view class="chosse" @click="chosse"
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

    <delivery-layout :deliveryInfo="addressobj"></delivery-layout>
    <!-- body -->

    <view class="tijiao"
      ><button type="primary" @click="tijiao">预约上门</button></view
    >
  </view>
</template>

<script setup>
const mmbjydx = uniCloud.importObject("goods-backend", {
  customUI: true,
});
import { showToast, isAdminRole, addressff } from "@/utils/common.js";
import dayjs from "dayjs";
import { removeHtmlTags, convertImageToWebP } from "@/utils/tools.js";
import { usedsmaxStore } from "@/stores/dsmax.js";
const maxStore = ref(usedsmaxStore());
const addcloubobj = uniCloud.importObject("goods-backend");
const checkobj = uniCloud.importObject("check_info");

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
const addressobj = ref({
  address: "",
  username: "",
  mobile: "",
}); //默认地址
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
// 选择类型
const chosse = () => {
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
  if (e.feiobj) {
    urlobj.value = JSON.parse(decodeURIComponent(e.feiobj));
  }
  console.log(urlobj.value);
  getnav();
});
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
  if (!addressobj.value.address)
    return showToast({
      title: "请输入地址",
    });
  if (maxStore.value.ordernum > 6)
    return showToast({
      title: "订单超出",
    });
  dataobj.value.content = removeHtmlTags(dataobj.value.content);
  let cesires = await checkobj.textcheck(
    `${dataobj.value.title} ${dataobj.value.content}`,
    "o5tQd7U__aPjwWnoYBPUivS4C_sw"
  );
  if (cesires.Code != 0)
    return showToast({
      title: "内容违规",
    });
  goodsff();
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
      addressobj: addressobj.value,
      creattime: Date.now(),
      temptime: Date.now() + 345600000,
    };
    let { errCode, errMsg } = await addcloubobj.addorderinfo(objyun);

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
uni.$on("Update", (e) => {
  addressobj.value = e;
});
onUnload(() => {
  uni.$off("Update");
});

// 默认地址
const getmorenaddress = async () => {
  let { data, errCode } = await addcloubobj.getaddresss();
  if (!data.length) return;
  if (errCode !== 0) return;

  addressobj.value = data[0];
};
// getmorenaddress();
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
}
</style>
