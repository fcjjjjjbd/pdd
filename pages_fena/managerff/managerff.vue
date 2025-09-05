<!-- console.log()  <view class=""> </view> for()行动做到 错1改1 转恶0为善1 -->
<template>
  <view class="Layout">
    <view class="row" @click="sanchu"> 根据id删除商品</view>
    <!-- 修改积分 -->
    <view class="row"
      >排序积分
      <up-input
        v-model="goodsa"
        placeholder="商品id"
        prefixIconStyle="font-size: 22px;color: #909399"
      ></up-input>
      <up-input
        v-model="goodsb"
        placeholder="修改分数"
        suffixIconStyle="color: #909399"
      ></up-input>
      <view class="titiao" @click="addfen">
        <up-button type="primary" text="修改积分"></up-button>
      </view>
    </view>

    <view>
      是否推荐
      <uni-easyinput v-model="tjobj.uid" placeholder="输入推荐uid">
      </uni-easyinput>
      <switch @change="clickboo"></switch>
      <view class="group" @click="addtuijian">
        <button type="primary">推荐</button>
      </view>
    </view>

    <uni-popup ref="sancupopub" type="dialog">
      <uni-popup-dialog
        mode="input"
        title="删除id商品"
        v-model="goodsid"
        placeholder="请输入昵称"
        @confirm="sancuConfirm"
      >
      </uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script setup>
import { showToast } from "@/utils/common.js";
const db = uniCloud.database();
const sancupopub = ref(null);
const goodsid = ref("");
const goodsa = ref("");
const goodsb = ref(null);
const tjobj = ref({
  //推荐
  uid: null,
});

// 是否推荐
const addtuijian = () => {
  console.log(tjobj.value);
  db.collection("goods_detail").doc(tjobj.value.uid).update({
    tuijian: tjobj.value.tuijian,
  });
};
// 推荐开关
const clickboo = (e) => {
  // tjobj.value.tuijian = e.detail.value;
};
// 删除
const sanchu = () => {
  sancupopub.value.open();
};
const sancuConfirm = async () => {
  let {
    result: { errCode },
  } = await db.collection("goods_detail").doc(goodsid.value).remove(); //删除商品
  await db
    .collection("collect_g")
    .where({
      goods_id: goodsid.value,
    })
    .remove(); //删除商品收藏
  await db
    .collection("goods_comment")
    .where({
      soup_id: goodsid.value,
    })
    .remove(); //删除商品评论
  db.collection("goods_like")
    .where({
      soup_id: goodsid.value,
    })
    .remove(); //删除商品点赞
  if (errCode == 0) {
    showToast("删除成功");
  }
};
//  修改积分
const addfen = async () => {
  console.log(goodsb.value);
  goodsb.value = parseInt(goodsb.value);
  if (!goodsa.value || !goodsb.value) return showToast("id或积分不能为空");
  let res = await db.collection("goods_detail").doc(goodsa.value).update({
    score_count: goodsb.value,
  });
  showToast("修改成功");
};
</script>

<style lang="scss" scoped>
.Layout {
  padding: 30rpx;

  .row {
    padding: 30rpx 0;
  }
}
</style>
