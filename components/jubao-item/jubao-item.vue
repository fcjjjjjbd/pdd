<template>
  <view>
    <view class="comment-item">
      <view class="avatar">
        <up-avatar src="item.userInfo.avatar.url  || '../../static/images/logo.png'" size="26">
        </up-avatar>
      </view>

      <view class="wrap">
        <view class="manag">
          <view class="username">

            {{item.userInfo.username}}
          </view>
          <view class="info">
            <view v-if="item.userInfo._id == current_id || isAdminRole()" class="delet" @click="del(item._id)">
              <uni-icons type="trash" size="25"></uni-icons>
            </view>
            <view class="gai" v-if="isAdminRole()" >
              <uni-icons type="folder-add" size="25"></uni-icons>
            </view>
          </view>
        </view>

        <view class="comment-content">	
          {{ item.comment_content }}</view>
        <view class="info">
          <view class="reply-btn" @click="capyy(item.comment_content)">复制 </view>
          <view>
            <uni-dateformat :date="item.comment_date" :threshold="[60000,3600000*24*30]">
            </uni-dateformat>
          </view>

        </view>
      </view>
    </view>

  </view>
</template>

<script setup>
  const emit = defineEmits(['deleter']) // 声明引入 
  const db = uniCloud.database()
  const current_id = uniCloud.getCurrentUserInfo().uid // 当前用户id

  import {
    isAdminRole
  } from "@/utils/common"
  const props = defineProps({
    item: Object
  })
  function capyy(value) {
    uni.setClipboardData({
      data: value,
      success: res => {
        console.log(res);
      },
      fail: err => {
        console.log(err);
      }
    })
  }
  const del = async () => {

    if (props.item.userInfo._id == current_id || isAdminRole()) {

      let res1 = await uni.showModal({
        title: '删除',
        content: '是否删除评论',
      });
      if (!res1.confirm) return;

      let {
        result: {
          errCode
        }
      } = await db.collection("jubao_item").doc(props.item._id).remove();
      if (errCode == 0) emit("deleter", {
        id: props.item._id
      });
      return;
    }
    uni.showToast({
      title: "没有权限"
    })
  }
</script>

<style lang="scss" scoped>
  .comment-item {
    display: flex;

    .wrap {
      flex: 1;
      padding-left: 20rpx;
      padding-bottom: 20rpx;

      .manag {
        @include flex-box();

        .username {
          font-size: 26rpx;
          color: #666;
          padding: 10rpx 0;
        }

      }

      .comment-content {
        font-size: 34rpx;
        color: #111;
        line-height: 1.8em;
      }

      .info {
        font-size: 26rpx;
        color: #666;
        display: flex;
        padding: 10rpx 0;
        align-items: center;

        view {
          margin-right: 25rpx;
        }

        .reply-btn {
          padding: 6rpx 18rpx;
          background: #e4e4e4;
          border-radius: 30rpx;
        }
      }
    }
  }
</style>