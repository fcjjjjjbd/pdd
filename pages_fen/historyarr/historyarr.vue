<!-- .log() for()行动 做到 错1改1 转恶微山 -->
<template>
  <view class="self">
    <view>
      <uni-fab ref="fab" :pattern="{icon:'pyq'}" :content="content" horizontal="right" vertical="bottom" popMenu
        @trigger="trigger" />
    </view>
    <view class="list">
      <view class="item" v-for="item in historyList" :key="item._id">
        <goods-item :item="item"></goods-item>
      </view>
    </view>
  </view>
</template>

<script setup>
  import {
    ref,
    computed
  } from "vue";
  const content = ref([{
      iconPath: 'https://mp-809a65a0-175d-4ce6-b53d-81522f24f79b.cdn.bspapp.com/userAvatar/logo.png',
      text: '全部清空',
      active: false
    },
    {
      iconPath: 'https://mp-809a65a0-175d-4ce6-b53d-81522f24f79b.cdn.bspapp.com/userAvatar/logo.png',
      text: '置顶',
      active: false
    }
  ])
  const historyList = ref([])

  onShow(async () => {
    gethistory()
  })
  // 悬浮事件
  const trigger = (e) => {
    const index = e.index;
    switch (index) {
      case 0:
         uni.removeStorageSync("storgClassList");
   historyList.value = []
         break;
      case 1:
      uni.pageScrollTo({
	scrollTop: 0,
	duration: 100
});     
        // 执行特定于 index 1 的逻辑
        break;

      default:
        console.log(`默认逻辑}`);
        // 默认逻辑
        break;
    }
  }
  const gethistory = () => {
    
    let arr = uni.getStorageSync("storgClassList") || []
    historyList.value = arr
  }
</script>

<style lang="scss" scoped>
  .self {
    padding: 30rpx;

    .list {}

  }
</style>