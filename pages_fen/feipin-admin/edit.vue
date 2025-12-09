<!-- ritharr,1500  {知}1行动做到 1 错1改1 转0为1 不1则0 -->
<template>
  <view class="Layout">
    <view class="row-add">
      <text class="label">排序</text>
      <up-input
        border="surround"
        maxlength="20"
        clearable
        type="number"
        v-model.number="dsobj.sort"
      ></up-input>
    </view>
    <view>
      1极分类<uni-data-select
        collection="afenlei"
        field="_id as value, title as text"
        label="分类选择"
        v-model="dsobj.category_id"
        :clear="false"
      />
    </view>
    <view class="row-add">
      <text class="label">2极分类</text>
      <up-input
        border="surround"
        clearable
        type="text"
        v-model="dsobj.name"
        autoBlur
      ></up-input>
    </view>

    <view class="row-add">
      <text class="label">展示用户售价</text>
      <textarea
        v-model="dsobj.jinjia"
        class="textareas"
        auto-height
        maxlength="200"
        placeholder-style="color:#a7a7a7"
        placeholder="1"
      />
      
    </view>
    <view class="row-add">
      <text class="label">进价渠道</text>
      <textarea
        v-model="dsobj.shoujia"
        class="textareas"
        auto-height
        maxlength="200"
        placeholder-style="color:#a7a7a7"
        placeholder="1"
      />
    </view>
    <view class="row-add">
      <text class="label">区长电话</text>
      <up-input
        border="surround"
        maxlength="12"
        clearable
        type="number"
        v-model.number="dsobj.phone"
      ></up-input>
    </view>
    <view class="tijiao"
      ><button type="primary" @click="tijiao">提交商品</button></view
    >
  </view>
</template>

<script setup>
const dsyunobj = uniCloud.importObject("goods-backend");
const emit = defineEmits(["getdb"]);
const dsobj = ref({
  category_id: "",
  name: "",
  sort: null,
  jinjia: "",
  shoujia: "",
  phone: null,
});
onLoad(async (obj) => {
  if (obj.item) {
    // 解码并解析传递的参数
    dsobj.value = JSON.parse(decodeURIComponent(obj.item));
    console.log(dsobj.value);
  }
});
// 提交
const tijiao = async () => {
  if (dsobj.value._id) {
    await dsyunobj.updatafeipin(dsobj.value);
    uni.showToast({
      title: "修改成功",
    });
    setTimeout(() => uni.navigateBack(), 1000);
  } else {
    let { errCode } = await dsyunobj.addfeipinlist(dsobj.value);
    if (errCode != 0)
      return uni.showToast({
        title: "新增失败",
      });
    uni.showToast({
      title: "新增成功",
    });
  }
  resetForm();
  emit("getdb");
};
const resetForm = () => {
  Object.assign(dsobj, {
    category_id: "",
    name: "",
    sort: null,
    jinjia: "",
    shoujia: "",
  });
};
</script>

<style lang="scss" scoped>
.Layout {
  padding: 20rpx;

  .row-add {
    display: flex;
    flex-direction: column;
    padding: 20rpx 0;
    font-size: 30rpx;
    font-weight: bold;

    .label {
      width: 300rpx;
      padding-right: 20rpx;
    }
    .textareas {
      background: #fcfcfc;
      height: 300rpx;
      width: 100%;
      border: 1px solid black;
      padding: 20rpx;
      font-size: 26rpx;
      border-radius: 15rpx;
    }
  }
}
</style>
