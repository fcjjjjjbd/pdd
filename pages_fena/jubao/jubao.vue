<template>
  <view class="addressForm">

    <view class="copy" @click="copyid">
      复制举报的ID:
      <view class="copyid">
        {{ idd }}
      </view>
    </view>

    <view>
      投诉分类<uni-data-select v-model="current" :localdata="range" />
    </view>

    <view class="title">投诉原因内容 </view>
    <textarea v-model="obj.content" placeholder="内容" style="width: 100%;min-height: 400rpx;"
      class=" font-30"></textarea>

    <view class="row-add">
      <text class="label">微信号</text>
      <up-input placeholder="输入自己的微信号" border="surround" maxlength="20" clearable type="text" v-model="obj.weixi"
        autoBlur></up-input>
    </view>


    <view class="tijiao"><button type="primary" @click="onSubmit">提交</button></view>


  </view>
</template>

<script setup>
  import {
    showToast
  } from "@/utils/common.js"
  const db = uniCloud.database();
  const current = ref(0)
  const range = ref([{
      value: 0,
      text: "不存在"
    },
    {
      value: 1,
      text: "被骗钱"
    },
    {
      value: 2,
      text: "电话号或地址错误"
    },
    {
      value: 3,
      text: "其他"
    }
  ])
  const idd = ref(null) //举报的id
  const obj = ref({
    content: "",
    weixi: "",
    fenlei: ""
  })
  onLoad(async (e) => {
    let {
      id = null
    } = e;
    idd.value = id

  })
  // 提交表单
  const onSubmit = async () => {
    obj.value.fenlei = range.value[current.value].text
    console.log(obj.value)
    await db.collection("jubao_item").add({
      ...obj.value,
      goodsid: idd.value
    })
    showToast("举报成功")
    setTimeout(() => {
      uni.navigateBack()
    }, 1000)
  }
  //  复制id
  function copyid() {
    uni.setClipboardData({
      data: idd.value,
      success: res => {
        console.log(res);
      },
      fail: err => {
        console.log(err);
      }
    })
  }
</script>

<style lang="scss">
  .addressForm {
    padding: 30rpx;

    .copy {
      border: 1rpx solid $text-font-color-2;
      padding-bottom: 20rpx;
      ;
    }
  }
</style>