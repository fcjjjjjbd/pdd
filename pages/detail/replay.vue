<!--  for()行动 做到 错1改1 转恶为善 至善else-->
<template>
  <view class="self">
    <z-paging ref="paging" v-model="replayList" @query="queryList" :default-page-size="7">

      <view class="out">
        <view class="body">
          <comment-item :isreplay="true" :item="storage_comment" :type="true"></comment-item>
        </view>

        <view class="list">
          <view class="row" v-for="item in replayList" :key="item._id">
            <comment-item :isreplay="true" @replay="replay" :item="item" :morereplay="true"></comment-item>
          </view>
        </view>
      </view>

      <view class="layout">
        <view class="commentpp" @click="commenpopu">
          <view class="input">评伦一下...</view>
          <view class="button">
            <uni-icons type="paperplane" size="30"></uni-icons>
          </view>
        </view>
        <view class="safe-area-bottom"></view>
      </view>
    </z-paging>
  </view>

  <uni-popup ref="commentpp" type="bottom">
    <comment-replay ref="commenREF" :source="source" @success="successff"></comment-replay>
  </uni-popup>

</template>

<script setup>
  import {
    ref,
    computed
  } from "vue";
  import {
    showToast
  } from "@/utils/common.js"
  const db = uniCloud.database();
  const dbCmd = db.command
  const $ = dbCmd.aggregate

  const paging = ref(null)
  const current_id = uniCloud.getCurrentUserInfo().uid; // 当前用户id

  const commenREF = ref(null)
  const replayList = ref([])
  const commentpp = ref(null)
  const storage_comment = ref(uni.getStorageSync("storage_comment") || {}) //每一个1级评论缓存数据
  // 回复item人评论
  const replay = (e) => {
    source.value = {
      ...source.value,
      reply_username: e.userInfo.username,
      reply_user_id: e.userInfo._id,
      reply_comment_id: e._id
    }
    commenpopu()
  }
  // 整合数据传组件,提交db
  const source = ref({
    soup_id: storage_comment.value.soup_id,
    reply_parent_id: storage_comment.value._id,
    comment_type: 1,
    reply_user_id: storage_comment.value._id,
    reply_comment_id: storage_comment.value.userInfo._id,
    reply_username: storage_comment.value.userInfo.username
  })
  // 清除缓存
  onUnload(() => {
    uni.removeStorageSync("storage_comment")
  })
  // 提交成功回调
  const successff = () => {
    showToast("发布评论成功");
    commentpp.value.close();
    paging.value.refresh();

  }
  // 提交评论弹窗 storg_comment
  const commenpopu = async () => {
    await commentpp.value.open();
    commenREF.value.focusFn();
  }
  // 删除立即渲染
  uni.$on("deleter", () => {
    uni.showToast({
      title: '删除了',
      duration: 1000
    });
    nextTick(() => {
      paging.value.refresh();
    })
  })
  // 请求回复数据   
  const queryList = async (pageNo, pageSize) => {
    getgoodsList(pageNo, pageSize);
  }
  const getgoodsList = async (pageNo, pageSize) => {
    let skip = (pageNo - 1) * pageSize
    let {
      result: {
        errCode,
        data
      }
    } = await db.collection("goods_comment").aggregate()
      .match({
        soup_id: storage_comment.value.soup_id,
        comment_type: 1,
        reply_parent_id: storage_comment.value._id
      })
      .lookup({
        from: "uni-id-users",
        let: {
          uid: '$user_id'
        },
        pipeline: $.pipeline().match(dbCmd.expr($.eq(['$_id', '$$uid']))).project({
          username: 1,
          avatar: 1
        }).done(),
        as: "userInfo"
      })
      .lookup({
        from: "goods_comment",
        let: {
          replayinfoid: '$reply_comment_id'
        },
        pipeline: $.pipeline().match(dbCmd.expr($.eq(['$_id', '$$replayinfoid']))).project({
            comment_content: 1,
            user_id: 1
          })
          .lookup({
            from: "uni-id-users",
            let: {
              uid: '$user_id'
            },
            pipeline: $.pipeline().match(dbCmd.expr($.eq(['$_id', '$$uid']))).project({
                username: 1
              })
              .done(),
            as: "username"
          })
          .project({
            comment_content: 1,
            username: $.arrayElemAt(['$username', 0]),
          })
          .done(),
        as: "replayinfo"
      })
      // 当前用户对item评论bool点赞
      .lookup({
        from: "goods_like",
        let: {
          commentid: '$_id'
        },
        pipeline: $.pipeline().match(
            dbCmd.expr(
              $.and([
                $.eq(['$comment_id', '$$commentid']),
                $.eq(['$user_id', current_id]),

              ])
            )).count('length')
          .done(),
        as: "likeInfo"
      })
      .project({
        likeInfo: $.cond({
          if: $.gt([$.arrayElemAt(['$likeInfo.length', 0]), 0]),
          then: true,
          else: false
        }),
        replayinfo: $.arrayElemAt(['$replayinfo', 0]),
        comment_date: 1,
        userInfo: $.arrayElemAt(['$userInfo', 0]),
        bool_remove: 1,
        comment_content: $.cond({
          if: $.eq(['$bool_remove', true]),
          then: '已删除',
          else: '$comment_content'
        }),
        comment_type: 1,
        comment_count: 1,
        like_count: 1,
        soup_id: 1,
        reply_parent_id: 1,
        reply_comment_id: 1,
        reply_user_id: 1
      })
      .sort({
        comment_date: -1
      })
      .skip(skip)
      .limit(pageSize)
      .end()
    console.log(data)
    if (errCode != 0) return;
    paging.value.complete(data);
  }
</script>

<style lang="scss" scoped>
  .self {
    .out {
      .body {
        border-bottom: 14rpx solid $text-font-color-3;
      }

      .list {
        .row {
          border-bottom: 2rpx solid #f7f7f7;

        }
      }
    }

    .layout {
      width: 100%;
      position: fixed;
      bottom: 0;
      left: 0;

      .commentpp {
        background: #fff;
        padding: 30rpx;
        @include flex-box();

        .input {
          flex: 1;
          padding: 0 20rpx;
          font-size: 28rpx;
          background: #f7f7f7;
          height: 80rpx;
        }

        .button {
          width: 80rpx;
          height: 80rpx;
          margin-left: 20rpx;
          border: 1px solid #f7f7f7;
        }
      }
    }
  }
</style>