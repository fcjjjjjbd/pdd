<!-- console.log()  {知}1行动做到 1 错1改1 转0为1 不1则0 -->
<template>
  <uni-popup ref="infoPopup" type="bottom" :is-mask-click="true">
    <view class="infoPopup">
      <uni-forms ref="formall" :model="formData" :rules="rules" label-align="right">
        <uni-forms-item required name="city" label="城市">
          <uni-data-select collection="city_area" field="_id as value, name as text,sort" orderby="sort asc"
            label="城市选择" v-model="formData.city" :clear="false" />
        </uni-forms-item>
        <uni-forms-item label="职业" name="job">
          <uni-easyinput type="text" v-model="formData.job" placeholder="干什么活" />
        </uni-forms-item>
        <uni-forms-item label="电话或微信" name="phone">
          <uni-easyinput type="text" v-model="formData.phone" placeholder="请输入电话或微信" />
        </uni-forms-item>
      </uni-forms>
      <button type="primary" @click="submitForm">提交</button>
    </view>
  </uni-popup>
</template>

<script setup>
  import {
    showToast
  } from "../../../utils/common";
  const tjcloubobj = uniCloud.importObject("admin-tuijian")

  const formall = ref(null) //表单名称
  const infoPopup = ref(null)

  const formData = ref({
    city: "",
    job: "",
    phone: null
  })
  const rules = ref({
    job: {
      rules: [{
        required: true,
        errorMessage: '干什么工作的'
      }, {
        minLength: 2,
        maxLength: 12,
        errorMessage: '文字长度在 {minLength} 到 {maxLength} 个字符',
      }]
    },
    phone: {
      rules: [{
        required: true,
        errorMessage: '请输入电话或微信'
      }, {
        minLength: 2,
        maxLength: 15,
        errorMessage: '文字长度在 {minLength} 到 {maxLength} 个字符',
      }]
    },
    city: {
      rules: [{
        required: true,
        errorMessage: '哪个城市'
      }]
    }
  })
  // 打开弹窗
  const openpp = async () => {
    infoPopup.value.open();
  }
  //关闭弹窗
  const closepp = async () => {
    infoPopup.value.close();
  }
  // 提交
  const submitForm = async () => {
    try {
      uni.showLoading({
        mask: true
      });
      await formall.value.validate();
      let {
        errCode,
        errMsg
      } = await tjcloubobj.addtj(formData.value);
      if (errCode !== 0) return showToast({
        title: errMsg
      });
      showToast({
        title: "新增成功"
      });
    } catch (err) {
      showToast({
        title: err
      });
    } finally {
      uni.hideLoading();
      closepp();
    }
  }
  defineExpose({
    openpp
  });
</script>

<style lang="scss" scoped>
  .infoPopup {
    background: #fff;
    width: 100%;
  }
</style>