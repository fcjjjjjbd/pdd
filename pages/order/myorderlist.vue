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
      <template #top>
        <view class="ordernav">
          <z-tabs :list="List" active-color="red" />
        </view>
      </template>

      <view class="list">
        <view class="item" v-for="item in dataList" :key="item._id">
          <goods-item :item="item"></goods-item>
        </view>
      </view>
    </z-paging>
  </view>
</template>

<script setup>
import { showToast, isAdminRole } from "@/utils/common.js";
import { usedsmaxStore } from "@/stores/dsmax.js";
const maxStore = ref(usedsmaxStore());

const db = uniCloud.database();
const dbCmd = db.command;
const $ = dbCmd.aggregate;
const addcloubobj = uniCloud.importObject("goods-backend");
const current_id = ref(uniCloud.getCurrentUserInfo().uid); // 当前用户id

//<view class=""> </view>
const List = ref([
  {
    name: "进行中",
    value: 0,
  },
  {
    name: "已完成",
    value: 1,
  },
]);
const paging = ref(null);
const dataList = ref([]);

// 请求数据
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
      user_id: current_id.value,
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
      imageValue: 1,
      orderlength: $.arrayElemAt(["$orderlength.length", 0]),
    })
    .sort({
      creattime: -1,
    })
    .end();
  console.log(data);
  maxStore.value.changenum(data.length);
  paging.value.complete(data);
};

uni.$on("removemit", () => {
  paging.value.reload();
});
</script>

<style lang="scss" scoped>
.home {
  padding: 20rpx;
}
</style>
