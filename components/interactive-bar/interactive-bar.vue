<!-- 我号不要了,号qwerty6204大写密码w右边连续6个+11皮肤很多,排位1900分 -->
<template>
  <view class="self">
    <view class="left">
      <view class="item" @click="clickComm">
        <view class="inputt">写评论</view>
      </view>

      <view class="item" @click="likeclick">
        <view>
          <uni-icons
            v-if="!newitem.likeInfo"
            type="heart"
            size="30"
          ></uni-icons>
          <uni-icons
            v-else
            type="heart-filled"
            size="28"
            color="#ff0000"
          ></uni-icons>
          <text v-if="newitem.like_count > 0">{{
            newitem.like_count
          }}</text></view
        >
        <view>收藏</view>
      </view>
    </view>

    <view class="right" v-if="true" @click="gozhifu"> </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import debounce from "lodash.debounce";
const emit = defineEmits(["commentinfo", "like", "paydata"]);
const db = uniCloud.database();
const current_id = uniCloud.getCurrentUserInfo().uid;

const props = defineProps({
  item: {
    type: Object,
    default() {
      return {};
    },
  },
});
console.log(props.item);
const newitem = ref(props.item);
// 评论
const clickComm = () => {
  emit("commentinfo");
};
// 防抖点赞
const likeclick = debounce(likeFn, 1500, {
  leading: true,
  trailing: false,
});

function likeFn() {
  if (newitem.value.likeInfo) {
    newitem.value.like_count--;
    db.collection("goods_like")
      .where({
        soup_id: newitem.value._id,
        like_type: 0,
      })
      .remove();
  } else {
    newitem.value.like_count++;
    db.collection("goods_like").add({
      soup_id: newitem.value._id,
      like_type: 0,
    });
  }
  newitem.value.likeInfo = !newitem.value.likeInfo;
}
// 收藏
const collectclick = debounce(collectFn, 1000, {
  leading: true,
  trailing: false,
});

function collectFn() {
  if (newitem.value.collectbool) {
    newitem.value.collect_count--;
    db.collection("collect_g")
      .where({
        goods_id: newitem.value._id,
        user_id: current_id,
      })
      .remove();
  } else {
    newitem.value.collect_count++;
    db.collection("collect_g").add({
      goods_id: newitem.value._id,
    });
  }
  newitem.value.collectbool = !newitem.value.collectbool;
}

// 支付
const gozhifu = () => {
  uni.navigateTo({
    url: "/pages/payorder/payorder",
  });
  let { _id, title, userInfo } = newitem.value;
  let obj = {
    _id,
    title,
    userInfo,
  };
  uni.setStorageSync("orderobj", obj);
};
// 师傅列表
const gosf = () => {
  uni.navigateTo({
    url: "/pages_fen/advpay/list?id=" + props.item.priceInfo[0].detail_id,
  });
};
</script>

<style lang="scss" scoped>
.self {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  height: 110rpx;

  @include flex-box();

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10rpx 10rpx;
  }

  .left {
    display: flex;

    .inputt {
      width: 100%;
      height: 70rpx;
      background: #f7f7f7;
      border: 1px solid $text-font-color-2;
      border-radius: 70rpx;
      display: flex;
      align-items: center;
      padding: 0 30rpx;
    }
  }

  .right {
    padding: 15rpx 15rpx;

    .btn {
      width: 210rpx;
      height: 75rpx;
      background: red;
      @include flex-box-set();
      color: #fff;
      border-radius: 10rpx;
    }
  }
}
</style>
