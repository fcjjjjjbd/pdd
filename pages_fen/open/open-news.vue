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
const list = ref([
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
  console.log('点赞事件:', data);
  // 这里可以调用后端API更新点赞状态
};

// 处理收藏事件
const handleCollect = (data) => {
  console.log('收藏事件:', data);
  // 这里可以调用后端API更新收藏状态
};

// 处理分享事件
const handleShare = (itemId) => {
  console.log('分享事件:', itemId);
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
    }
  });
};

// 处理阅读事件
const handleRead = (itemId) => {
  console.log('阅读事件:', itemId);
  // 这里可以统计阅读量
};
</script>

<template>
  <uv-tabs :list="list" @click="navclick"></uv-tabs>
  <view class="page-wrap">
    <z-paging ref="paging" v-model="dataList" @query="queryList">
      <template #top>
        <uni-search-bar
          @confirm="onSearch"
          placeholder="搜索"
          v-model="keyword"
        >
        </uni-search-bar>
      </template>
      <template #loading>
        <uni-load-more status="loading"></uni-load-more>
      </template>
      <view class="list-wrap">
        <view
          class="item-wrap"
          v-for="item in dataList"
          :key="item._id"
        >
          <view class="content-wrap" @click="routerTo('/pages_fen/open/open-newsdetail?id=' + item._id)">
            <view class="left-wrap">
              <view class="title">
                {{ item.title }}
              </view>
              <view class="info">
                <view class="author">{{ item.nickname }}</view>
                <view class="time">{{
                  dayjs(item.publish_date).format("YYYY-MM-DD HH:mm")
                }}</view>
              </view>
            </view>
            <view class="right-wrap" v-if="item.avatar">
              <image class="img" :src="item.avatar" mode="aspectFill"></image>
            </view>
          </view>
          <!-- 添加交互栏组件 -->
          <UniView 
            :item-id="item._id"
            :read-count="item.read_count || 0"
            :like-count="item.like_count || 0"
            :collect-count="item.collect_count || 0"
            :is-liked="item.is_liked || false"
            :is-collected="item.is_collected || false"
            @like="handleLike"
            @collect="handleCollect"
            @share="handleShare"
            @read="handleRead"
          />
        </view>
      </view>
      <uni-fab
        ref="fab"
        :pattern="{ icon: 'pyq' }"
        horizontal="right"
        vertical="bottom"
        @fabClick="mynew"
      />
      <uni-popup ref="show1" type="bottom" background-color="#fff">
        <mynews />
      </uni-popup>
    </z-paging>
  </view>
</template>

<style lang="scss" scoped>
.search {
  margin: 140px 0;
}

.page-wrap {
  .list-wrap {
    padding: 12rpx 0;

    .item-wrap {
      border-bottom: 1px solid #f0f0f0;
      padding: 24rpx 32rpx;
      
      .content-wrap {
        display: flex;
        align-items: stretch;
        justify-content: space-between;
        gap: 24rpx;
        height: 200rpx;
        margin-bottom: 16rpx;
      }

      .left-wrap {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .title {
          font-size: 30rpx;
          color: #333;
          @include text-ellipsis(2);
        }

        .info {
          display: flex;
          font-size: 26rpx;
          color: #aaa;
          gap: 12rpx;
        }
      }

      .right-wrap {
        flex-shrink: 0;
        height: 100%;
        aspect-ratio: 16 / 10;
        border-radius: 8rpx;
        overflow: hidden;

        .img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .item-wrap:last-child {
      border-bottom: none;
    }
  }
}
</style>
