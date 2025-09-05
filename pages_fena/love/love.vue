<!-- 我的收藏 -->
<template>
  <view class="soupLayout">

    <z-paging ref="paging" v-model="dataList" @query="queryList" :default-page-size="4">

      <!-- 一开始加载状态 -->
      <template #loading>
        <view class="">
          <uni-load-more status="loading"></uni-load-more>
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
  import {
    ref
  } from 'vue';
  const db = uniCloud.database();
  const paging = ref(null)
  const dataList = ref([])

  // 请求数据   
  const queryList = async (pageNo, pageSize) => {
    getgoodsList(pageNo, pageSize);
  }
  const getgoodsList = async (pageNo, pageSize) => {
    let skip = (pageNo - 1) * pageSize
    const collectdd = db.collection('collect_g').where(` user_id ==$cloudEnv_uid `).getTemp();
    const detaill = db.collection('goods_detail').field(
      "_id, address,  collect_count, goods_thumb,like_count,title").getTemp();
    let {
      result: {
        data,
        errCode
      }
    } = await db.collection(collectdd, detaill).field(`		
		arrayElemAt(goods_id._id, 0) as _id,
		arrayElemAt(goods_id.title, 0) as title,
    arrayElemAt(goods_id.address, 0) as address,
    arrayElemAt(goods_id.collect_count, 0) as collect_count,
    arrayElemAt(goods_id.goods_thumb, 0) as goods_thumb,
    arrayElemAt(goods_id.like_count, 0) as like_count
		`)
      .skip(skip)
      .limit(pageSize).get();
    if (errCode != 0) return showToast("操作有误");
    console.log(data);
    paging.value.complete(data);

  }
</script>

<style lang="scss" scoped>
  .soupLayout {

    .list {
      padding: 30rpx 0;


    }
  }
</style>