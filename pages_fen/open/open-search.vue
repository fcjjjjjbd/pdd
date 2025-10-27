<!-- 搜索页面 uni-search-bar   -->
<template>
  <view class="searchLayout">
    <z-paging
      ref="paging"
      v-model="searchdata"
      @query="queryList"
      :auto="false"
      :default-page-size="5"
    >
      <view class="" style="display: flex; align-items: center">
        <view class="" style="flex: 1">
          <uni-search-bar
            @confirm="onSearch"
            cancelButton="none"
            @cancel="onClear"
            @clear="onClear"
            focus
            placeholder="搜索"
            v-model="keyword"
          >
          </uni-search-bar>
        </view>
        <view
          style="padding: 10rpx; font-size: 39rpx; color: red"
          @click="onSearch"
        >
          搜索</view
        >
      </view>

      <view v-if="!searchdata.length || nodata">
        <view class="history" v-if="searchdata.length == 0">
          <view class="topTitle" v-if="historySearch.length">
            <view class="text">历史搜索</view>
            <view class="icon" @click="removeHistory">
              <uni-icons type="trash" size="25"></uni-icons>
            </view>
          </view>
          <view class="tabs">
            <view
              class="tab"
              v-for="tab in historySearch"
              :key="tab"
              @click="clickTab(tab)"
              >{{ tab }}</view
            >
          </view>
        </view>
        <!-- 搜索推荐 -->
        <view class="text">热门发现</view>
        <view class="topTitle">
          <view class="tabs">
            <view
              class="tab"
              v-for="row in hotsearch"
              :key="row._id"
              @click="clickTab(row.name)"
              >{{ row.name }}
            </view>
          </view>
        </view>
      </view>

      <!-- 产品哦列表 -->
      <view class="searclist" v-else>
         <open-item v-for="item in dataList" :key="item.id" :item="item" @click="routerTo('/pages_fen/open/open-newsdetail?id='+item._id)"> </open-item>
        </view>
   </z-paging>
  </view>
</template>

<script setup>
const dsyunobj = uniCloud.importObject("goods-backend");

import { showToast } from "@/utils/common.js";
const db = uniCloud.database();
const dbCmd = db.command;
const $ = dbCmd.aggregate;
const goodsydx = uniCloud.importObject("goods_item");
const paging = ref(null);
const keyword = ref("");
const nodata = ref(false);
const searchdata = ref([]); //商品数组
const historySearch = ref(uni.getStorageSync("historySearch") || []); //历史记录
const skipp = ref(0); //翻页数
const cityid = ref(uni.getStorageSync("city").id || null);
const hotsearch = ref([]); //热门搜索
// 热门搜索hotlist
const onhotlist = async () => {
  let { data, errCode } = await dsyunobj.searchhot();
  if (errCode != 0) return;
  hotsearch.value = data;
};
onhotlist();

onLoad(async (e) => {
  let { hot = null } = e;
  console.log(hot);
  if (hot) {
    keyword.value = hot;
    nextTick(() => {
      setTimeout(() => {
        paging.value.reload();
      }, 100);
    });
  }
});
//点击搜索
const onSearch = () => {
  historySearch.value = [
    ...new Set([keyword.value, ...historySearch.value]),
  ].slice(0, 12);
  uni.setStorageSync("historySearch", historySearch.value);
  return;
  paging.value.reload();
};
// 请求数据
const queryList = async (pageNo, pageSize) => {
  getdata(pageNo, pageSize);
};
// 搜索商品数组
const getdata = async (pageNo, pageSize) => {
  let skip = (pageNo - 1) * pageSize;
  if (keyword.value == "") return showToast("请输入搜索内容");
  let {
    result: { data, errCode },
  } = await db
    .collection("goods_detail")
    .aggregate()
    .match({
      status: 1,
      areaid: cityid.value,
    })
    .match(`${new RegExp(keyword.value, "gi")}.test(title)`)
    // 获取每个商品对应评分信息
    .lookup({
      from: "goods_Score",
      let: {
        uid: "$_id",
      },
      pipeline: $.pipeline()
        .match(dbCmd.expr($.eq(["$$uid", "$soup_id"])))
        .project({
          priceScore: 1,
          speedScore: 1,
          techScore: 1,
          badScore: 1,
        })
        .group({
          _id: null,
          numm: $.sum($.sum(["$priceScore", "$speedScore", "$techScore"])),
        })
        .done(),
      as: "ScoreInfo",
    })
    .addFields({
      numq: 5,
      numw: 3,
    })
    .project({
      likee: $.multiply(["$like_count", "$numw"]), //点赞*3分数
      collectt: $.multiply(["$collect_count", "$numq"]), //收藏*5分数
      ScoreInfo: $.arrayElemAt(["$ScoreInfo.numm", 0]), //每个商品评分合
      address: 1,
      collect_count: 1,
      goods_thumb: 1,
      like_count: 1,
      title: 1,
      score_count: 1, //商家充值的积分
    })
    .addFields({
      ScoreInfo: $.ifNull(["$ScoreInfo", 0]),
      badfenshu: $.multiply(["$ScoreInfo.badScore", 4]), //差评*4分数
    })
    .addFields({
      badfenshu: $.ifNull(["$badfenshu", 0]),
    })
    .addFields({
      totala: $.add(["$score_count", "$collectt", "$likee", "$ScoreInfo"]),
    })
    // 总分排序
    .addFields({
      totalb: $.subtract(["$totala", "$badfenshu"]),
    })
    .sort({
      totala: -1,
    })
    .skip(skip)
    .limit(pageSize)
    .end();
  if (errCode != 0) return showToast("搜索失败");
  if (data.length == 0) nodata.value = true;

  paging.value.complete(data);
  console.log(data);
};
// 清空
const onClear = () => {
  clear();
};
// 公共清空方法
const clear = () => {
  keyword.value = "";
  searchdata.value = [];
  nodata.value = false;
};
// 标签 搜索
const clickTab = (tab) => {
  clear();
  keyword.value = tab;
  onSearch();
};
//历史记录清空
const removeHistory = () => {
  uni.showModal({
    title: "清空历史搜索？",
    success: (res) => {
      if (res.confirm) {
        uni.removeStorageSync("historySearch");
        historySearch.value = [];
      }
    },
  });
};
</script>

<style lang="scss" scoped>
.searchLayout {
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .search {
      width: 100%;
    }

    .ssclick {
      flex: 0.3;
      font-size: 45rpx;
      color: red;
    }
  }

  .topTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 32rpx;
    color: #333;
  }

  .history {
    padding: 30rpx;
  }

  .recommend {
    padding: 30rpx;
  }

  .tabs {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding-top: 5rpx;

    .tab {
      background: #f4f4f4;
      font-size: 35rpx;
      color: #333;
      padding: 10rpx 28rpx;
      border-radius: 50rpx;
      margin-right: 10rpx;
      margin-top: 10rpx;
    }
  }

  .list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5rpx;
    padding: 20rpx 5rpx;

    .item {
      height: 440rpx;

      image {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
  }
}
</style>
