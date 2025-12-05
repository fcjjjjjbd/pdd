<script setup>
import dayjs from "dayjs";
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { showToast } from "../../utils/common";
const pddCloudObj = uniCloud.importObject("client-aopen", {
  customUI: true,
});
let id;
onLoad((e) => {
  id = e.id;
  getDetail();
});

const detail = ref();

// {errCode,data}
const getDetail = async () => {
  try {
    let { data } = await pddCloudObj.detailxg(id);
    console.log(data);

    // 处理图片数组，提取fileID并转换为字符串数组
    if (data.imageValue && Array.isArray(data.imageValue)) {
      data.imageValue = data.imageValue.map((item) => item.fileID);
    }

    detail.value = data;
  } catch (err) {
    console.log(err);
    showToast(err);
  }
};

// 图片点击预览功能
const clickPic = (index) => {
  uni.previewImage({
    urls: detail.value.imageValue,
    current: index,
  });
};
</script>

<template>
  <view class="page-wrap" v-if="detail?.name">
    <text :style="{ 'font-size': '35rpx', 'font-weight': 'bold' }">
      {{ detail.content }}
    </text>
    <!-- 图片网格展示区域 -->
    <view class="image-grid" v-if="detail.imageValue.length > 0">
      <view
        class="image-item"
        v-for="(imageUrl, index) in detail.imageValue"
        :key="index"
        @click="clickPic(index)"
      >
        <image
          :src="imageUrl"
          mode="aspectFill"
          class="grid-image"
          :lazy-load="true"
        ></image>
      </view>
    </view>

    <view style="padding: 30rpx 0; font-size: 28rpx; color: #666"
      >阅读量： {{ detail.view_count }}</view
    >
  </view>
  <uni-load-more status="loading" v-else></uni-load-more>
</template>

<style lang="scss" scoped>
.page-wrap {
  padding: 24rpx 32rpx;
  .news-title {
    font-size: 36rpx;
    font-weight: bolder;
    line-height: 1.6em;
    padding-bottom: 24rpx;
  }
  .news-info {
    display: flex;
    gap: 16rpx;
    font-size: 28rpx;
    color: #888;
    padding-bottom: 24rpx;
  }
  .news-content {
    :deep(._root) {
      overflow-x: hidden;
    }
  }

  // 图片网格布局样式
  .image-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 15rpx;
    margin: 30rpx 0;

    .image-item {
      width: calc(50% - 7.5rpx); // 2列布局，减去间距的一半
      aspect-ratio: 1; // 保持正方形比例
      border-radius: 8rpx;
      overflow: hidden;
      background-color: #f5f5f5;
      position: relative;
      cursor: pointer;
      transition: transform 0.2s ease;

      &:active {
        transform: scale(0.98);
      }

      .grid-image {
        width: 100%;
        height: 100%;
        border-radius: 8rpx;
        background-color: #f0f0f0;
      }
    }
  }
}
</style>
