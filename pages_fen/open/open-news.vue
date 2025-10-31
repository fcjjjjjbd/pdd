<script setup>
import { ref } from "vue";
import dayjs from "dayjs";
import { routerTo, showLoading, showModal, showToast } from "@/utils/common.js";
import UniView from "./child/mynews.vue";
const pddCloudObj = uniCloud.importObject("client-aopen", {
  customUI: true,
});
const dataList = ref([]);

const paging = ref(null);

const show1 = ref(null);
const navlist = ref([]);
const selectcategoryid = ref();     
const jump = async () => {
  uni.navigateTo({
    url: "/pages_fen/open/open-search",
  });
};
// 获取分类数组
const getcategory = async () => {
  try {
    let { errCode, data } = await pddCloudObj.list();
    if (errCode !== 0) {
      showToast("获取分类失败");
      return false; // 返回false表示获取失败
    }
    navlist.value = data;
    selectcategoryid.value = data[0]._id;
    console.log("分类数据获取成功:", data);
    return true; // 返回true表示获取成功
  } catch (error) {
    console.error("获取分类出错:", error);
    showToast("获取分类失败");
    return false;
  }
};
const queryList = async (pageCurrent, pageSize) => {
  try {
    let { errCode, data } = await pddCloudObj.categorylist({
      pageSize,
      pageCurrent,
      category_id:   selectcategoryid.value
    });
    if (errCode !== 0) return paging.value.complete(false);
    console.log(data);
    paging.value.complete(data);
  } catch (err) {
    paging.value.complete(false);
  }
};
// 初始化数据 - 先获取分类，再获取列表
nextTick(async () => {
  // 先获取分类数据
  const categorySuccess = await getcategory();
  
  // 只有分类获取成功后，才请求列表数据
  if (categorySuccess) {
    paging.value.reload();
  } else {
    console.log("分类获取失败，不执行列表数据请求");
  }
});
// 我的列表
const mynew = () => {
  show1.value.open();
};
// 切换导航
const navclick = (e) => {
  console.log(e);
  selectcategoryid.value = e._id;
  paging.value.reload();
};

// 处理点赞事件
const handleLike = (data) => {
  console.log("点赞事件:", data);
  // 这里可以调用后端API更新点赞状态
};

// 处理收藏事件
const handleCollect = (data) => {
  console.log("收藏事件:", data);
  // 这里可以调用后端API更新收藏状态
};

// 处理阅读事件
const handleRead = (itemId) => {
  console.log("阅读事件:", itemId);
  // 这里可以统计阅读量
};

// 处理内容点击事件
const handleContentClick = (itemId) => {
  routerTo("/pages_fen/open/open-newsdetail?id=" + itemId);
};
</script>

<template>
  <view class="page-container">
    <!-- 内容列表 - 分类下方 -->
    <view class="content-section">
      <z-paging
        ref="paging"
        v-model="dataList"
        @query="queryList"
        :auto="false"
      >
        <template #top>
          <view class="u-flex top-box" >
        <mode-search @on-confirm="jump"></mode-search>
 </view>
        </template>
        <!-- 分类标签 - 搜索框下方 -->
        <view class="tabs-section">
          <uv-tabs :list="navlist" @click="navclick" />
        </view>
        <template #loading>
          <uni-load-more status="loading" />
        </template>

        <view class="news-list">
          <aopen-item v-for="item in dataList" :item="item" @click="routerTo('/pages_fen/open/open-newsdetail?id='+item._id)"> </aopen-item>
        </view>
      </z-paging>
    </view>

    <!-- 浮动按钮 -->
    <uni-fab
      ref="fab"
      :pattern="{ icon: 'pyq' }"
      horizontal="right"
      vertical="bottom"
      @fabClick="mynew"
    />

    <!-- 弹窗 -->
    <uni-popup ref="show1" type="bottom" background-color="#fff">
      <UniView />
    </uni-popup>
  </view>
</template>

<style lang="scss" scoped>
// 页面主容器

// 分类标签区域 - 搜索框下方
.tabs-section {
  position: sticky;
  top: 20rpx; // 搜索框高度
  z-index: 99;
  background-color: #fff;
  padding: 0 32rpx;
  border-bottom: 2rpx solid #e5e5e5;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.04);
}

// 内容区域 - 分类下方
.content-section {
  flex: 1;
  overflow: hidden;
  margin-top: 0; // 移除之前的padding-top

  .paging-container {
    height: 100%;

    .news-list {
      padding: 50rpx 32rpx;

      // 新闻项之间的间距
      :deep(.uni-view-item) {
        margin-bottom: 24rpx;
        background-color: #fff;
        border-radius: 16rpx;
        padding: 24rpx;
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
        position: relative;
        z-index: 1; // 确保内容在正确层级

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}

// z-paging 深层样式优化
:deep(.z-paging-content) {
  height: 100%;
  overflow-y: auto;
  padding-top: 0; // 确保内容从顶部开始
}

:deep(.z-paging-container) {
  height: 100%;
  position: relative;
  z-index: 1; // 确保在正确层级
}

// 浮动按钮样式调整
:deep(.uni-fab) {
  z-index: 98;
  position: fixed; // 确保浮动按钮固定定位
}

// 响应式设计
@media screen and (max-width: 750rpx) {
  .search-section {
    padding: 16rpx 24rpx;
  }


  .news-list {
    padding: 20rpx 24rpx;
  }
}
</style>
