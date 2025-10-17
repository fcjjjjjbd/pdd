<script setup>
import { ref } from "vue";
import dayjs from "dayjs";
import { routerTo } from "@/utils/common.js";
import mynews from "@/pages_fen/open/child/mynews.vue";
import UniView from "@/components/uni-view/uni-view.vue";
const newsCloudObj = uniCloud.importObject("client-news", {
  customUI: true,
});
const dataList = ref([]);
const keyword = ref("");

const paging = ref(null);

const show1 = ref(null);
const navlist = ref([
  {
    name: "全部",
    value: "0",
  },
  {
    name: "推荐",
    value: "1",
  },
  {
    name: "最新",
    value: "2",
  },
]);
const queryList = async (pageCurrent, pageSize) => {
  try {
    let { errCode, data } = await newsCloudObj.list({
      pageCurrent,
      pageSize,
    });
    if (errCode !== 0) return paging.value.complete(false);
    paging.value.complete(data);
  } catch (err) {
    paging.value.complete(false);
  }
};
// 搜索onSearch
const onSearch = () => {};
// 我的列表
const mynew = () => {
  show1.value.open();
};
// 切换导航
const navclick = (index) => {
  console.log(index);
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

// 处理分享事件
const handleShare = (itemId) => {
  console.log("分享事件:", itemId);
  // 这里可以调用分享功能
  uni.share({
    provider: "weixin",
    scene: "WXSceneSession",
    type: 0,
    href: `/pages_fen/open/open-newsdetail?id=${itemId}`,
    title: "分享文章",
    summary: "来看看这篇有趣的文章",
    success: function (res) {
      console.log("success:" + JSON.stringify(res));
    },
    fail: function (err) {
      console.log("fail:" + JSON.stringify(err));
    },
  });
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
        class="paging-container"
      >
        <template #top>
          <uni-search-bar @confirm="onSearch" v-model="keyword" >
			</uni-search-bar>
    
        </template>
        <!-- 分类标签 - 搜索框下方 -->
        <view class="tabs-section">
          <uv-tabs :list="navlist" @click="navclick" />
        </view>
        <template #loading>
          <uni-load-more status="loading" />
        </template>

        <view class="news-list">
          <UniView
            v-for="item in dataList"
            :key="item._id"
            :item-id="item._id"
            :title="item.title"
            :author="item.nickname"
            :publish-date="item.publish_date"
            :avatar="item.avatar"
            :read-count="item.read_count || 0"
            :like-count="item.like_count || 0"
            :collect-count="item.collect_count || 0"
            :is-liked="item.is_liked || false"
            :is-collected="item.is_collected || false"
            @content-click="handleContentClick"
            @like="handleLike"
            @collect="handleCollect"
            @share="handleShare"
            @read="handleRead"
          />
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
      <mynews />
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

  .tabs-section {
    padding: 0 24rpx;
  }

  .news-list {
    padding: 20rpx 24rpx;
  }
}
</style>
