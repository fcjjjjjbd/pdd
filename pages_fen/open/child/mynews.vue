<script setup>
import { ref } from "vue";
import { routerTo, showModal, showLoading, showToast } from "@/utils/common.js";

const opencloubobj = uniCloud.importObject("client-aopen", {
  customUI: true,
});

const dataList = ref([]);
const getmy = async () => {
  let { errCode, errMsg, count, data } = await opencloubobj.myopen();
  if (errCode !== 0) return showToast("获取失败");
  console.log(data);
  dataList.value = data;
};
getmy();
// 新增文章按钮点击事件
const goToEdit = () => {
  uni.navigateTo({
    url: "/pages_fen/open/edit",
  });
};
// 删除
const delTable = async (id) => {
  try {
    if (!(await showModal({ content: "是否确认删除?" }))) return;
    showLoading("执行中..");
    let { errCode, errMsg, data } = await opencloubobj.remove(id);
    if (errCode !== 0) return showToast("删除失败");
    showToast("删除成功");
    dataList.value = dataList.value.filter((item) => item._id !== id);
    getmy();
  } catch (err) {
    showModal(err);
    console.log(err);
  } finally {
    uni.hideLoading();
  }
};
</script>
<template>
  <view class="home"
    >我发布的

    <view class="list-wrap">
      <view
        class="item-wrap"
        v-for="item in dataList"
        :key="item._id"
        @click="routerTo('/pages_fen/open/open-newsdetail?id=' + item._id)"
      >
        <view class="left-wrap">
          <view class="title">
            {{ item.name }}
          </view>
          <view class="info">
            <view @click.stop="routerTo('/pages_fen/open/edit?id=' + item._id)"
              ><uni-icons type="compose" size="30"></uni-icons>
              修改
            </view>
            <view @click.stop="delTable(item._id)"
              ><uni-icons type="trash" size="30"></uni-icons>
              删除
            </view>
          </view>
        </view>
        <view class="right-wrap" v-if="item.goods_thumb">
          <image class="img" :src="item.goods_thumb" mode="aspectFill"></image>
        </view>
      </view>
    </view>

    <!-- 新增文章按钮 -->
    <view class="add-article-btn">
      <button @click="goToEdit">新增文章</button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.home {
  padding: 20rpx;
  background-color: #f5f5f5;
  height: 900rpx;
  width: 100%;

  .list-wrap {
    padding: 12rpx 0;

    .item-wrap {
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      align-items: stretch;
      justify-content: space-between;
      padding: 24rpx 32rpx;
      gap: 24rpx;
      height: 200rpx;

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
  }

  /* 新增文章按钮样式 */
  .add-article-btn {
    position: fixed;
    bottom: 60rpx;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    /* 提高 z-index 值确保按钮在最上层 */

    button {
      background-color: #007aff;
      color: white;
      border-radius: 50rpx;
      padding: 20rpx 40rpx;
      font-size: 32rpx;
    }
  }
}
</style>
