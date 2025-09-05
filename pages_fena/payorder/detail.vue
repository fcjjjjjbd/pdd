<!-- console.log() for()行动 做到 错1改1 转恶微山 -->
<template>
  <view class="home">
    <view class="top" v-if="item">
      <goods-item :item="item"></goods-item>
    </view>

    <view class="content">
      <view class="row">
        <view class="label">订单ID：</view>
        <text selectable class="value">{{ objj.order_no }}</text>
      </view>

      <view class="row">
        <view class="label"></view>
        <text class="value class"></text>
      </view>

      <view class="row">
        <view class="label">下单时间：</view>
        <text class="value"></text>
      </view>

      <view class="row">
        <text class="label">实付款：</text>
        <view class="value"> </view>
      </view>
    </view>
  </view>
</template>
<script setup>
const db = uniCloud.database(); // 连接云对象整体
const item = ref(null);
const objj = ref({});
onLoad(async (e) => {
  objj.value = JSON.parse(decodeURI(e.item));
  console.log(objj.value);
  gooddata();
});
const gooddata = async () => {
  let {
    result: { data, errCode },
  } = await db.collection("goods_detail").doc(objj.value.goods_id).get({
    getone: true,
  });
  item.value = data[0];
  console.log(data);
};
</script>

<style lang="scss">
.home {
  .content {
    .row {
      display: flex;
      padding: 16rpx 0;
      font-size: 32rpx;
      line-height: 1.7em;

      .label {
        color: $text-font-color-2;
        width: 200rpx;
        text-align: right;
        font-size: 30rpx;
      }

      .value {
        flex: 1;
        width: 0;
      }

      .class {
        color: $brand-theme-color;
      }
    }
  }
}
</style>
