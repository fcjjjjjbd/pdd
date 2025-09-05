<!-- 保存自己看到 -->
<template>
  <view class="brand">
    <uni-forms
      ref="selfRef"
      :model="selfData"
      :rules="Rules"
      :label-width="70"
      label-align="left"
    >
      <uni-forms-item label="接单名字" name="name">
        <uni-easyinput
          type="text"
          v-model="selfData.name"
          placeholder="请输入品牌名称"
        />
      </uni-forms-item>

      <uni-forms-item label="自己电话" name="mobile">
        <uni-easyinput
          type="text"
          v-model="selfData.mobile"
          placeholder="请输入商户电话"
        />
      </uni-forms-item>

      <uni-forms-item label="业务描述" name="about">
        <uni-easyinput
          v-model="selfData.about"
          placeholder="请输入商家介绍"
          type="textarea"
        />
      </uni-forms-item>

      <button type="primary" @click="onSubmit">提交信息</button>
    </uni-forms>
  </view>
</template>

<script setup>
import { usedsmaxStore } from "@/stores/dsmax.js";
const maxStore = ref(usedsmaxStore());

const addcloubobj = uniCloud.importObject("goods-backend");
const selfRef = ref(null);

const selfData = ref({
  name: "", //品牌名称
  mobile: "",
  about: "",
});
const Rules = ref({
  thumb: {
    rules: [
      {
        required: true,
        errorMessage: "品牌招聘需要上传",
      },
    ],
  },
  name: {
    rules: [
      {
        required: true,
        errorMessage: "请输入正确的品牌名称",
      },
      {
        minLength: 1,
        maxLength: 6,
        errorMessage: "长度在{minLength}到{maxLength}的字符",
      },
    ],
  },
  mobile: {
    rules: [
      {
        required: true,
        errorMessage: "请输入正确的品牌电话",
      },
      {
        validateFunction: function (rule, value, data, callback) {
          let res = /^1[3-9]\d{9}$/.test(value);
          if (!res) {
            callback("手机格式不正确");
          }
          return;
        },
      },
    ],
  },
});

//获取数据库中的品牌信息
const getBrand = async () => {
  addcloubobj.getsfinfo().then((res) => {
    if (!res.data.length) return;
    selfData.value = res.data[0];
    maxStore.value.sfselfinfoff(selfData.value);
  });
};
getBrand();
//点击提交按钮
const onSubmit = async () => {
  selfRef.value
    .validate()
    .then((res) => {
      addAndUpdate();
    })
    .catch((err) => {
      console.log(err);
    });
};
//新增或者修改品牌啊信息
const addAndUpdate = async () => {
  let title;
  if (selfData.value._id) {
    let res = await addcloubobj.updatasfinfo(selfData.value);
    title = "修改成功";
  } else {
    //新增
    await addcloubobj.addsfinfo(selfData.value);
    title = "新增成功";
  }
  maxStore.value.sfselfinfoff(selfData.value);
  uni.showToast({
    title,
    mask: true,
  });

  setTimeout(() => {
    uni.navigateBack();
  }, 1500);

  //  修改pinia
};
</script>

<style lang="scss" scoped>
.brand {
  padding: 30rpx;
}
</style>
