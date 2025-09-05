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
        <view class="search">
          <uni-search-bar
            @confirm="onSearch"
            @cancel="onClear"
            @clear="onClear"
            placeholder="搜索"
            v-model="keyword"
          >
          </uni-search-bar> </view
      ></template>

      <view class="list">
        <view
          class="list-item"
          v-for="(item, index) in dataList"
          :key="index"
          @click="godetail(item)"
        >
          {{ item.title }}
        </view>
      </view>

      <navigator url="/pages_fen/kaiyuan/edit" class="navorder">
        <view class="item">
          <text>发布</text>
        </view>
      </navigator>
    </z-paging>
  </view>
</template>

<script setup>
const db = uniCloud.database(); // 连接云对象整体

import { ref } from "vue";
const paging = ref(null);

const dataList = ref([]);
const keyword = ref("");
// 跳转详情
const godetail = async (e) => {
  console.log(e);
  uni.navigateTo({
    url: "/pages/detail/detail?id=" + e._id,
  });
};
const queryList = (pageNo, pageSize) => {
  getSoupList(pageNo, pageSize);
};

const getSoupList = async (pageNo, pageSize) => {
  let skip = (pageNo - 1) * pageSize;

  try {
    let {
      result: { errCode, data },
    } = await db
      .collection("goods_detail")
      .field("publish_date,title")
      .orderBy("publish_date", "desc")
      .skip(skip)
      .limit(pageSize)
      .get();

    if (errCode != 0) return;
    paging.value.complete(data);
  } catch (e) {
    paging.value.complete(false);
  }
};
//搜索
const onSearch = () => {
  console.log("123");
};
// 取消搜索
const onClear = () => {
  console.log("123");
};
</script>

<style lang="scss" scoped>
.home {
  padding: 20rpx;

  .list {
    display: flex;
    flex-direction: column;
    margin-bottom: 150rpx; // 为悬浮按钮留出空间
  }

  .list-item {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx; // 列表项之间的间距
  }

  .navorder {
    width: 120rpx;
    height: 120rpx;
    background: #0199fe;
    border-radius: 50%;
    color: #fff;
    position: fixed;
    z-index: 100;
    bottom: 150rpx;
    right: 50rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 20rpx rgba(1, 153, 254, 0.8);

    .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
  .navorder {
    width: 120rpx;
    height: 120rpx;
    background: #0199fe;
    border-radius: 50%;
    color: #fff;
    position: fixed;
    z-index: 100;
    bottom: 100rpx;
    right: 50rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 20rpx rgba(1, 153, 254, 0.8);

    .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
