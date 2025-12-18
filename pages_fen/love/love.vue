<template>
  <view class="pages">
    <z-paging
      ref="paging"
      safe-area-inset-bottom
      v-model="soupData"
      @query="queryList"
    >
      <template #loading>
        <uni-load-more status="loading"></uni-load-more>
      </template>

      <view class="list">
        <view class="item" v-for="item in soupData" :key="item._id">
          <adv-card :item="item"></adv-card>
        </view>
      </view>
    </z-paging>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { showToast } from "../../utils/common";
const soupData = ref([]);
const paging = ref(null);
const db = uniCloud.database();

const queryList = (pageNo, pageSize) => {
  getSoupList(pageNo, pageSize);
};

const getSoupList = async (pageNo, pageSize) => {
  let likeTemp = db
    .collection("soup-like")
    .where(`user_id == $cloudEnv_uid`)
    .getTemp();
  let soupTemp = db.collection("pdd-adv").getTemp();
  let {
    result: { errCode, data },
  } = await db
    .collection(likeTemp, soupTemp)
    .field(
      `
    create_date as publish_date,
    arrayElemAt(soup_id._id, 0) as _id,
    arrayElemAt(soup_id.content, 0) as content,
    arrayElemAt(soup_id.like_count, 0) as like_count,
    arrayElemAt(soup_id.comment_count, 0) as comment_count,
    arrayElemAt(soup_id.phone, 0) as phone,
    arrayElemAt(soup_id.like_count, 0) as like_count,
   arrayElemAt(soup_id.imageValue, 0) as imageValue
      `
    )
    .orderBy("create_time desc")
    .get();
  console.log(data);

  // 为每个对象添加isLike: true
  if (data && data.length > 0) {
    data = data.map((item) => ({
      ...item,
      isLike: true,
    }));
  }

  if (errCode != 0) return showToast("操作有误");

  paging.value.complete(data);
};
</script>

<style lang="scss" scoped>
.pages {
  .list {
    padding: 30rpx 30rpx 0;
  }
}
</style>