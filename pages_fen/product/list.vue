<!-- 我的发布商品 :auto="false" -->
<template>
  <view class="soupLayout">
    <z-paging
      ref="paging"
      v-model="dataList"
      @query="queryList"
      :default-page-size="4"
    >
      <template #top>
        <view class="top u-m-b-20">
          <view class="box" @click="addgoods">
            <uni-icons type="plus" size="28"></uni-icons>
            <view class="text">添加商品</view>
          </view>
        </view>
        <view class="search">
          <uni-search-bar
            @confirm="onSearch"
            @cancel="onClear"
            @clear="onClear"
            placeholder="搜索"
            v-model="keyword"
            focus
          >
          </uni-search-bar>
        </view>
      </template>

      <template #loading>
        <view class="">
          <uni-load-more status="loading"></uni-load-more>
        </view>
      </template>

      <view class="list">
        <view class="item" v-for="(item, index) in dataList" :key="item._id">
          <view class="" @click="clickChlidBtn(item._id)">
            {{ item.name }}
          </view>

          <view class="info">
            <view @click="editobj(item)"
              ><uni-icons type="compose" size="30"></uni-icons>
            </view>
            <view @click.stop="deleteAddress(item._id, index)"
              ><uni-icons type="trash" size="30"></uni-icons>
            </view>
          </view>
        </view>
      </view>
    </z-paging>
  </view>
</template>

<script setup>
const dsyunobj = uniCloud.importObject("goods-backend");
import { showToast, isAdminRole, stateFormat } from "@/utils/common.js";

const db = uniCloud.database();
const goods_yun = uniCloud.importObject("goods_item");
const paging = ref(null);
const dataList = ref([]);
const keyword = ref("");
const onSearch = async () => {
  let {
    result: { data, errCode },
  } = await db
    .collection("goods_detail")
    .where(`${new RegExp(keyword.value, "gi")}.test(name)`)
    .get();
  dataList.value.unshift(data[0]);
  console.log(dataList.value);
};
//详情页
const clickChlidBtn = (id) => {
  uni.navigateTo({
    url: "/pages/detail/detail?feiid=" + id,
  });
};
// 搜索栏清空
const onClear = () => {};
// 判断添加商品
const addgoods = async () => {
  uni.navigateTo({
    url: "/pages_fen/product/edit",
  });
};
// 请求数据  async function (pageNo, pageSize)
function queryList(pageNo, pageSize) {
  getgoodsList(pageNo, pageSize);
}
const getgoodsList = async (pageNo, pageSize) => {
  let skip = (pageNo - 1) * pageSize;
  let {
    result: { data, errCode },
  } = await db
    .collection("goods_detail")
    .orderBy("publish_date", "desc")
    .skip(skip)
    .limit(pageSize)
    .get();
  console.log(data);

  if (errCode != 0) return;
  paging.value.complete(data);
};

// emit接收事件 刷新列表
uni.$on("Updatelist", (e) => {
  paging.value.reload();
});
// 修改对象pinia
const editobj = async (obj) => {
  console.log(obj);
  let params = encodeURIComponent(JSON.stringify(obj));

  uni.navigateTo({
    url: "/pages_fena/product/edit?xgobj=" + params,
  });
}; // 删除订单
const deleteAddress = async (id1, e) => {
  let res = await uni.showModal({
    title: "是否删除",
  });
  //   let imgarr = props.item.imageValue.map((item) => item.url);
  // addcloubobj.removeimg(imgarr);
  dataList.value.splice(e, 1);
  await db.collection("goods_detail").doc(id1).remove(); //删除商品
};
</script>

<style lang="scss" scoped>
.soupLayout {
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
        color: black;
      }
    }
  }

  .list {
    padding: 30rpx 30rpx 0;

    .item {
      @include flex-box();
      .info {
        display: flex;
      }
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
  }
}
</style>
