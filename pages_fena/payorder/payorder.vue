<template>
  <view class="scorePage">
    <z-paging
      ref="paging"
      v-model="scoreData"
      @query="queryList"
      :default-page-size="10"
      empty-view-text="还没有积分"
    >
      <template #loading>
        <uni-load-more status="loading"></uni-load-more>
      </template>

      <template>
        <view class="head">
          <view class="number">0</view>
          <view class="text">当前余额</view>
        </view>
      </template>

      <view class="list">
        <view class="item" v-for="item in scoreData" :key="item._id">
          <view class="left">
            <view class="title">{{ item._id }}</view>
            <view class="time">{{
              dayjs(item.createTime).format("YYYY-MM-DD ")
            }}</view>
          </view>
          <view class="right">{{ convertYuanToFen(item.total_fee) }}元</view>
        </view>
      </view>
    </z-paging>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import dayjs from "dayjs";
import { convertYuanToFen } from "@/utils/tools.js";
const paging = ref(null);
const scoreData = ref([]);
const db = uniCloud.database();

//滚动数据处理
const queryList = (pageNo, pageSize) => {
  getScoreList(pageNo, pageSize);
};

//获取积分列表
async function getScoreList(pageNo, pageSize) {
  let skip = (pageNo - 1) * pageSize;
  try {
    let {
      result: { data, errCode },
    } = await db
      .collection("pay-order")
      .where(`user_id == $cloudEnv_uid`)
      .skip(skip)
      .limit(pageSize)
      .get();
    if (errCode != 0) return;
    console.log(data);
    paging.value.complete(data);
  } catch (e) {
    paging.value.complete(false);
  }
}
</script>

<style lang="scss" scoped>
.scorePage {
  .head {
    background-image: linear-gradient(
      to right,
      rgba(75, 228, 197, 1),
      rgba(75, 228, 197, 0.5)
    );
    width: 690rpx;
    margin: 50rpx auto;
    border-radius: 10rpx;
    padding: 30rpx;
    color: #fff;
    text-align: center;
    .number {
      font-size: 52rpx;
      font-weight: 600;
    }
    .text {
      font-size: 28rpx;
      opacity: 0.8;
    }
  }
  .list {
    padding: 0rpx 30rpx 0;
    .item {
      padding: 40rpx 0;
      border-bottom: 1px solid $border-color-light;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        color: $text-font-color-3;
        font-size: 28rpx;
        .title {
          font-size: 38rpx;
          color: $text-font-color-1;
          padding-bottom: 10rpx;
        }
      }
      .right {
        font-size: 34rpx;
      }
    }
  }
}
</style>
