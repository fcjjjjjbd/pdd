<template>
  <view class="soupLayout">
    <view class="self">
      <z-paging ref="paging" v-model="dataList" @query="queryList" :default-page-size="6">
        <template #top>
          <view class="headTop">
            <view class="title">商品审核中</view>
          </view>
        </template>

        <template #loading>
          <view class="">
            <uni-load-more status="loading"></uni-load-more>
          </view>
        </template>
        <view class="list">
          <view class="item" v-for="item in dataList" :key="item._id">
            <goods-item :item="item">
              <template #reviewed>
                <view class="btn" @click.stop="gaireviewed( item._id)">审核</view>
              </template>
            </goods-item>

          </view>
        </view>
      </z-paging>
      <!-- -->
      <uni-popup ref="genderPopup" type="dialog">
        <uni-popup-dialog @confirm="genderConfirm" title="修改审核" mode="input">
          <view class="genderForm">
            <radio-group @change="genderChange">

              <label class="radio" v-for="item in stateLists" :key="item.value">
                <view>
                  <radio :value="item.value" :checked="genderValue == item.value" style="transform:scale(0.7)" />
                  {{item.text}}
                </view>
              </label>

            </radio-group>
          </view>
        </uni-popup-dialog>
      </uni-popup>
    </view>
  </view>
</template>

<script setup>
  import {
    ref
  } from 'vue';
  import {
    stateLists
  } from "../../utils/common.js"
  const db = uniCloud.database();
  const paging = ref(null)
  const dataList = ref([])
  const genderPopup = ref(null)
 
  const genderValue = ref(0)  // 审核弹窗选项默认值 
  const updateid = ref("") // 修改审核方法的id
  // 请求数据  
  function queryList(pageNo, pageSize) {
    getgoodsList(pageNo, pageSize)
  }
  const getgoodsList = async (pageNo, pageSize) => {
    let skip = (pageNo - 1) * pageSize
    let {
      result: {
        data,
        errCode
      }
    } = await db.collection("goods_detail")
      .where(` status==0 `)
       .field("address,collect_count,goods_thumb,like_count,title,user_id,publish_date")
      .orderBy("publish_date", "desc")
      .skip(skip)
      .limit(pageSize)
      .get();
 
    if (errCode != 0) return;
    paging.value.complete(data);
  }

  // 修改审核云数据
  const updatereviewed = async () => {
    const statusValue = parseInt(genderValue.value, 10);

    let res = await db.collection("goods_detail")
      .where(` _id=="${updateid.value}" `)
      .update({
        status: statusValue
      });
    console.log(res)
    paging.value.refresh();
  }

  // 修改审核按钮
  const gaireviewed = async (id) => {

    updateid.value = id
    genderPopup.value.open();
  }
  //  修改审核弹窗确认事件
  const genderConfirm = (e) => {
    updatereviewed()
    genderPopup.value.close();
  }
  //  修改审核单选框Change 事件
  const genderChange = (e) => {
    genderValue.value = e.detail.value
  }
</script>

<style lang="scss" scoped>
  .soupLayout {
    .headTop {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      padding: 30rpx 30rpx 10rpx;
      color: #000;

      .title {
        font-size: 40rpx
      }

      .btn {
        border: 1px solid #000;
        padding: 8rpx 15rpx;
        border-radius: 100rpx;
      }
    }

    .list {
      padding: 30rpx 30rpx 0;
    }

    .genderForm {}
  }
</style>