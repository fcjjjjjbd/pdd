<template>
  <view class="content">
    <!--  -->
    <view class="topnav" v-if="false">
      <view class="topinfo">
        我的历史
        <view class="sacu">
          <uni-icons type="trash" size="30"></uni-icons>
        </view>
      </view>
      <view class="list">
        <view class="item" @tap="goNext" v-for="(item, index) in 6">
          <view class="topname"> 空调 </view>
          <view class="text"> 2个</view>
        </view>
      </view>
    </view>

    <!-- 左边分类 -->
    <view class="left-v">
      <view
        :class="index === isActive ? 'active' : ''"
        @click="clickFun(item._id, index)"
        v-for="(item, index) in navlistStore.leftList"
        :key="item._id"
      >
        {{ item.name }}
      </view>
    </view>
    <view class="right-v">
      <view class="three-v">
        <view
          @click="clickChlidBtn(rew)"
          class="item"
          v-for="(rew, index) in rights"
          :key="rew._id"
        >
          {{ rew.name }}
          <view>0个</view>
        </view>
      </view>
    </view>
    
  </view>
</template>

<script setup>
const db = uniCloud.database();
const dbCmd = db.command;
const $ = dbCmd.aggregate;

import { useNavlistStore } from "@/stores/navlistStore";

const navlistStore = useNavlistStore();

const isActive = ref(0); //选中的左分类index
const rights = ref([]); //选中的分类右数据

// 分类跳转
const clickChlidBtn = (e) => {
  console.log(e);
  let params = encodeURI(JSON.stringify(e));
  uni.navigateTo({
    url: "/pages/shifu/fenleilist?obj=" + params,
  });
};
// click历史记录
const goNext = (index) => {};
// 点击左边分类
const toSelectOne = (index) => {
  activeIndex.value = index;
};

const toDetail = (name) => {
  console.log(`点击了项目: ${name}`);
};
const clickFun = (id, index) => {
  rights.value = navlistStore.rightList.filter((item) => {
    return item.category_id == id;
  });
  isActive.value = index;
  console.log(rights.value);
};

onMounted(async () => {
  await navlistStore.fetchLeftList();
  await navlistStore.fetchRightList();

  if (navlistStore.leftList.length > 0) {
    rights.value = navlistStore.rightList.filter((item) => {
      return item.category_id === navlistStore.leftList[0]._id;
    });
  }
});
// 订单数量
const geicount = async () => {
  let res = await db
    .collection("afenleilist")
    .aggregate()
    .lookup({
      from: "order-detail",
      let: {
        uid: "$_id",
      },
      pipeline: $.pipeline()
        .match(dbCmd.expr($.eq(["$category_id", "$$uid"])))
        .count("length")
        .done(),
      as: "ORDERlength",
    })
    .end();
  console.log(res);
};
</script>

<style lang="scss" scoped>
.content {
  .left-v {
    width: 200rpx;
    background-color: #f5f5f5;
    height: 100vh;
    float: left;
    border-right: 1rpx solid black;

    view {
      @extend .baseClass;

      &.active {
        background-color: black;
        font-size: 36rpx;
        font-weight: 800;
        border-left: 8rpx solid #e98f36;
        color: #fff;
      }
    }
  }

  .right-v {
    width: 550rpx;
    background-color: #fff;
    height: 100vh;
    float: right;
    overflow: scroll;

    .three-v {
      padding: 10rpx;
      height: calc(100vh - 200rpx);
      overflow: scroll;

      .item {
        background-color: #fff;
        padding: 10rpx;
        border-radius: 15rpx;
        font-size: 39rpx;
        color: black;
        margin-left: 15rpx;
        margin-top: 20rpx;
        text-align: center;
        float: left;
        width: 250rpx;
        overflow: hidden;
        line-height: 1.5;
      }
    }
  }

  .baseClass {
    padding: 20rpx 0;
    text-align: center;
  }
}
</style>
