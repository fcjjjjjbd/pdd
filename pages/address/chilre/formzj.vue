<!-- console.log()  {知}1行动做到 1 错1改1 转0为1 不1则0 -->
<template>
  <uni-popup ref="infoPopup" type="bottom" :is-mask-click="true">
    <view class="infoPopup">
      <uni-forms ref="formall" :model="formData" :rules="rules" label-align="right">
        <uni-forms-item label="收货人" name="job">
          <uni-easyinput type="text" maxlength="13" v-model="formData.username" placeholder="输入姓名" />
        </uni-forms-item>
        <uni-forms-item label="手机号">
          <uni-easyinput type="number" maxlength="13" v-model.number="formData.phone" placeholder="请输入手机号" />
        </uni-forms-item>
        <uni-forms-item label="选择地区" name="">
          <uni-data-picker v-model="formData.area_code" placeholder="请选择地址" popup-title="请选择所在地区"
            collection="opendb-city-china" field="code as value, name as text" orderby="value asc" self-field="code"
            parent-field="parent_code" @change="pickerChange">
          </uni-data-picker>
        </uni-forms-item>
        <uni-forms-item label="详细地址" name="job">
          <uni-easyinput type="text" maxlength="18" v-model="formData.address" placeholder="不要写单元门牌号" />
        </uni-forms-item>
        <uni-forms-item label="是否默认">
          <switch checked @change="switchChange" />
        </uni-forms-item>
      </uni-forms>
      <view class="butt">
        <button type="primary" @click="submitForm">保存</button>
      </view>
    </view>
  </uni-popup>
</template>

<script setup>
  import {
    showToast
  } from "../../../utils/common";
  const addcloubobj = uniCloud.importObject("goods-backend");
  const emit = defineEmits(["Update"]); // 声明引入

  const formall = ref(null); //表单名称
  const infoPopup = ref(null);
  const formData = ref({
    username: "",
    phone: null,
    area_code: "",
    area_name: "",
    address: "",
    selected: true,
  });
  const rules = ref({
    job: {
      rules: [{
        required: true,
        errorMessage: "干什么工作的",
      }, ],
    },
  });
  // 打开弹窗
  const openpp = async () => {
    infoPopup.value.open();
  };
  //关闭弹窗
  const closepp = async () => {
    infoPopup.value.close();
  };
  // 提交
  const submitForm = async () => {
    try {
      uni.showLoading({
        mask: true,
      });
      let {
        errCode
      } = await addcloubobj.addressinfo(formData.value);
      if (errCode !== 0) return;
      showToast({
        title: "新增成功",
      });
      uni.$emit("Update", formData.value);
      uni.navigateTo({
        url: "/pages/order/edit",
      });
    } catch (err) {
      showToast({
        title: err,
      });
    } finally {
      uni.hideLoading();
      closepp();
    }
  };
  // 开关
  const switchChange = async (e) => {
    formData.value.selected = e.detail.value;
  };
  // 选择城市
  const pickerChange = async (e) => {
    let names = e.detail.value.map((item) => item.text);
    const result = names.join("");
    formData.value.area_name = result;
  };
  defineExpose({
    openpp,
  });
</script>

<style lang="scss" scoped>
  .infoPopup {
    background: #fff;
    width: 100%;
    height: 70vh;

    .butt {
      width: calc(100% - 30rpx);
      margin: auto;
      height: 80rpx;
      border-radius: 15rpx;
      color: #fff;
      font-size: 22px;
      text-align: center;
      line-height: 80rpx;
      letter-spacing: 4rpx;
    }
  }
</style>