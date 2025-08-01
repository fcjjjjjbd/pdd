<script setup>
  /**
   * 商品卡片组件
   * @property {Object} item - 商品信息对象
   * @property {Number} item.id - 商品ID
   * @property {String} item.title - 商品标题
   * @property {Number} item.price - 商品价格
   * @property {String} item.image - 商品图片路径
   * @property {String} item.location - 商品所在位置
   * @property {String} item.description - 商品描述
   */

  /**
   * 点击商品卡片时触发
   */
  const emits = defineEmits(['click']);
  const props = defineProps({
    item: {
      type: Object,
      required: true,
      default: () => ({})
    }
  });

  const handleClick = () => {
    emit('click', props.item);
  };
</script>

<template>
  <view class="product-item" @click="handleClick">
    <image :src="item.image" mode="aspectFill"></image>
    <view class="product-info">
      <text class="product-title">{{item.title}}</text>
      <text class="product-price">¥{{item.price}}</text>
      <text class="product-location">{{item.location}}</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
  .product-item {
    display: flex;
    flex-direction: column;
    background-color: #FFFFFF;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
    overflow: hidden;
    width: 336px;
    height: 493px;
    box-sizing: border-box;
    margin: 10px;

    image {
      width: 100%;
      height: 336px;
      object-fit: cover;
    }

    .product-info {
      padding: 20rpx;
      display: flex;
      flex-direction: column;
      flex: 1;

      .product-title {
        font-size: 30rpx;
        font-weight: bold;
        margin-bottom: 10rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .product-price {
        color: #CC0000;
        font-size: 32rpx;
        font-weight: bold;
        margin-top: auto;
        margin-bottom: 10rpx;
      }

      .product-location {
        color: #999999;
        font-size: 24rpx;
      }
    }
  }
</style>