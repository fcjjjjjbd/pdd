<!--  import formzj from "./chilre/formzj.vue"
 -->
<template>
  <view class="page-wrapper">
    <view v-for="(item, index) in addressData" :key="item._id" class="address-item">

      <view class="top-area">
        <text class="name">{{ item.username }}</text>
        <text class="phone">
          <!-- <text class="iconfont icon-dianhua" style="margin-right: 5rpx"></text> -->
          {{ item.phone }}</text>
      </view>
      <view class="address-text">{{ item.area_name + item.address }}</view>

      <view class="bottom-area">
        <label>
          <text class="set-def-text" @click.stop="setDefAddress(item)" v-if="!item.selected">设为默认</text>
          <view class="set-def-teet" @click.stop="setDefAddress(item)" v-else><button type="warn"
              size="mini">默认</button></view>
        </label>
        <view class="operation-btns">
          <text class="obtn-text" @click.stop="deleteAddress(item._id, index)">
            <text style="margin-right: 5rpx"></text>删除</text>
          <text class="obtn-text" @click.stop="copyText(item)"><text style="margin-right: 5rpx"></text>复制</text>
        </view>
      </view>
    </view>

    <view class="add-address-btn" @click="openadd">添加地址</view>
    <formzj ref="formzjref"></formzj>
  </view>
</template>

<script setup>
  const emit = defineEmits(["Update"]);
  const addcloubobj = uniCloud.importObject("goods-backend");
  const db = uniCloud.database();

  import formzj from "./chilre/formzj.vue";
  const formzjref = ref(null);
  const addressData = ref([]); //地址列表
  const current = ref("");
  const infoPopup = ref(null);
  // 设置默认地址
  const setDefAddress = async (e) => {
    await addcloubobj.updatamoren(e._id);
    let deliverinfo = {
      ...e,
    };
    console.log(deliverinfo);
    uni.$emit("Update", deliverinfo);
    uni.navigateBack();
  };
  // 删除地址

  const deleteAddress = async (id1, index) => {
    let res = await uni.showModal({
      title: "是否删除",
    });
    if (res.confirm) {
      let res1 = await db.collection("ds-address").doc(id1).remove(); //删除商品
      addressData.value.splice(index, 1);
    }
  };
  // 接受emit
  uni.$on("editdata", () => {
    getdata();
  });
  // 复制地址
  const copyText = (item) => {
    let Address = `${item.area_name}${item.address}`;
    uni.setClipboardData({
      data: Address,
      success: () => {
        uni.showToast({
          title: "复制成功",
          icon: "success",
        });
      },
      fail: () => {
        uni.showToast({
          title: "复制失败",
          icon: "none",
        });
      },
    });
  };

  // 打开新增弹窗
  const openadd = () => {
    formzjref.value.openpp();
  };

  const getdata = async () => {
    let {
      data,
      errCode
    } = await addcloubobj.getressinfo();
    if (errCode !== 0) return;
    console.log(data);
    addressData.value = data;
  };
  onMounted(() => {
    getdata();
  });
</script>

<style lang="scss" scoped>
  $text-color1: #333333;
  $text-color2: #666;

  page {
    background-color: #f4f4f4;
  }

  .page-wrapper {
    padding: 20rpx;
    overflow-y: scroll;
    height: calc(100vh - 200rpx - 110rpx);

    .address-item {
      width: 100%;
      height: 220rpx;
      padding: 15rpx;
      box-sizing: border-box;
      background-color: #fff;
      border-radius: 20rpx;
      margin-bottom: 20rpx;

      .top-area {
        font-weight: bold;
        font-size: 18px;
        margin: 10rpx 0;

        .name {
          margin-right: 20rpx;
        }
      }

      .address-text {
        padding: 0 0 15rpx 0;
        width: 90vw;
        color: $text-color1;
        white-space: nowrap;
        /* 禁止换行 */
        overflow: hidden;
        /* 隐藏溢出部分 */
        text-overflow: ellipsis;
        /* 使用省略号替代溢出部分 */
      }

      .bottom-area {
        display: flex;
        padding-right: 0rpx;
        justify-content: space-between;
        justify-items: center;

        .obtn-text {
          display: inline-block;
          padding: 6rpx 20rpx;
          margin: 0 10rpx;
          border-radius: 30rpx;
          background-color: #f4f4f4;
          color: $text-color1;
        }

        .set-def-text {
          font-size: 14px;
          color: $text-color2;
          border: 1px solid $text-color2;
        }

        .set-def-teet {
          font-size: 14px;
          color: red;
        }
      }
    }

    .add-address-btn {
      position: fixed;
      z-index: 99;
      bottom: 120rpx;
      width: calc(100% - 30rpx);
      margin: auto;
      height: 80rpx;
      border-radius: 15rpx;
      background-color: rgb(255, 8, 0);
      color: #fff;
      font-size: 22px;
      text-align: center;
      line-height: 80rpx;
      letter-spacing: 4rpx;
    }

    .addpp {
      background: #fff;
      padding: 20rpx;
      border-radius: 30rpx 30rpx 0 0;
      overflow: hidden;
      font-size: 28rpx;
    }
  }
</style>