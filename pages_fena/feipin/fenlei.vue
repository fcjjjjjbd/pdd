<!-- console.log() -->
<template>
  <view class="self">
    <view class="search">
      <uni-search-bar
        @confirm="onSearch"
        @cancel="onClear"
        @clear="onClear"
        placeholder="搜索"
        v-model="keyword"
        cancelButton="none"
        :focus="true"
      >
      </uni-search-bar>
      <view class="search-btn" @click="onSearch"
        ><button class="mini-btn" type="warn" size="mini">搜索</button>
      </view>
    </view>
    <view class="list">
      全市回收最高价上门回收加 13453555442
      <view class="content">
        <view class="item" v-for="(item, index) in Paylist" :key="item._id">
          <view class="left"> {{ index + 1 }}</view>
          <view class="right">
            <view class="top1"> 回收{{ item.name }}-{{ item.jinjia }} </view>
            <view class="info">
              <view class="phone" v-if="isAdminRole()">
                {{ item.shoujia }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { showToast, isAdminRole } from "@/utils/common.js";

const addcloubobj = uniCloud.importObject("goods-backend");

const Paylist = ref([]);
const keyword = ref("");

// 搜索
const onSearch = () => {
  console.log("123");
};
// 取消搜索
const onClear = () => {
  console.log("123");
};
// 获取列表
const getlist = async () => {
  let { data, errCode } = await addcloubobj.huishoulist();
  console.log(data);
  Paylist.value = data;
};
getlist();
</script>

<style lang="scss" scoped>
.self {
  .search {
    @include flex-box();
    width: 100vw;
  }
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
      padding-bottom: 20rpx;

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
        }
      }
    }
  }
}
</style>
