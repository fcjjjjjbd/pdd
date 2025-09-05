<!-- 下拉刷新模板 -->
<template>
  <view class="soupLayout">
    <z-paging ref="paging" v-model="dataList" @query="queryList" :default-page-size="4" empty-view-text="无数据"
      empty-view-img="http://cdn.uviewui.com/uview/empty/comment.png">
      <!-- 一开始req加载状态 -->
      <template #loading>
        <view style="padding:60rpx;">
          <uni-load-more status="loading"></uni-load-more>
        </view>
      </template>
      <template #top>

      </template>

      <view class="content">
        <view class="item" v-for="(item,index) in dataList" :key="item._id">
          <view>
            {{item.content}}
          </view>
          <view class="but">
            <view class="" @click="copyuid(item.goodsid)">
              <button class="mini-btn" type="primary" size="mini">举报商家uid</button>
            </view>
            <view class="" @click="copyuid(item.weixi)">
              <button class="mini-btn" type="default" size="mini">微信号</button>
            </view>
            <view class="" @click="shancu(item._id,index)">
              <button class="mini-btn" type="warn" size="mini">删除</button>
            </view>
          </view>
        </view>
      </view>
    </z-paging>
  </view>
</template>

<script setup>
  const dsobj = uniCloud.importObject("goods_item", {
    customUI: true
  })
  const db = uniCloud.database();
  const paging = ref(null)
  const dataList = ref([])

  // 请求数据   
  const queryList = async (pageNo, pageSize) => {
    getgoodsList(pageNo, pageSize);
  }
  const getgoodsList = async (pageNo, pageSize) => {
    let skip = (pageNo - 1) * pageSize
    console.log(skip)
    let res = await dsobj.jubao()
    console.log(res)
    paging.value.complete(res);
  }
  // 复制
  const copyuid = async (value) => {
    if (!value) return;
    uni.setClipboardData({
      data: value,
      success: res => {
        console.log(res);
      },
      fail: err => {
        console.log(err);
      }
    })
  }


  // 删除 
  const shancu = async (id, index) => {

    let res = await dsobj.delejubao(id)
  }
</script>

<style lang="scss" scoped>
  .soupLayout {
    .content {
      width: 100%;
      height: 100%;
      background-color: #fff;
      padding: 20rpx;
      border-radius: 8rpx;

      .item {
        letter-spacing: 4rpx;
        font-size: 34rpx;
        font-weight: bold;
        border-bottom: 1rpx solid $text-font-color-3;
        padding-bottom: 28rpx;

        .but {
          display: flex;

        }
      }
    }
  }
</style>