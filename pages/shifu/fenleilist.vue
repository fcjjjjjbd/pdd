<!-- 下拉刷新模板 -->
<template>
  <view class="home">
    <z-paging
      ref="paging"
      v-model="dataList"
      @query="queryList"
      :default-page-size="4"
      empty-view-text="无数据"
    >
      <!-- 一开始req加载状态 -->
      <template #loading>
        <view style="padding: 60rpx">
          <uni-load-more status="loading"></uni-load-more>
        </view>
      </template>
      <view class="top">
        <view class="name">分类:{{ dsobj.name }}</view>
      </view>

      <view class="list">
        <view class="item" v-for="item in dataList">
          <goods-item :item="item" :type="1"></goods-item>
        </view>
      </view>
    </z-paging>
  </view>
</template>

<script setup>
import { showToast } from "@/utils/common.js";
const db = uniCloud.database();
const dbCmd = db.command;
const $ = dbCmd.aggregate;
const addcloubobj = uniCloud.importObject("goods-backend");
const dsobj = ref({}); //定义一个分类url对象
const paging = ref(null);
const dataList = ref([]);
onLoad(async (e) => {
  if (e.obj) {
    dsobj.value = JSON.parse(decodeURIComponent(e.obj));
  }
  console.log(dsobj.value);
});
// 请求数据   云对象
const queryList = async (pageNo, pageSize) => {
  getgoodsList(pageNo, pageSize);
};
const getgoodsList = async (pageNo, pageSize) => {
  let skip = (pageNo - 1) * pageSize;
  let {
    result: { errCode, errMsg, data },
  } = await db
    .collection("order-detail")
    .aggregate()
    .match({
      category_id: dsobj.value._id,
    })
    .lookup({
      from: "shifu-order",
      let: {
        uid: "$_id",
      },
      pipeline: $.pipeline()
        .match(dbCmd.expr($.eq(["$detail_id", "$$uid"])))
        .count("length")
        .done(),
      as: "orderlength",
    })
    .skip(skip)
    .limit(pageSize)
    .project({
      addressobj: 1,
      title: 1,
      goods_thumb: 1,
      ordertime: 1,
      orderlength: $.arrayElemAt(["$orderlength.length", 0]),
    })
    .end();
  console.log(data);
  paging.value.complete(data);
};
</script>

<style lang="scss" scoped>
.home {
  padding: 20rpx;
  .top {
    @include flex-box();
    font-size: 30rpx;
    margin-bottom: 20rpx;
  }
}
</style>
