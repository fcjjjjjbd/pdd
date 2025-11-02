<template>
  <view class="home" v-if="item">
    <z-paging
      ref="paging"
      v-model="commentarr"
      @query="queryList"
      :default-page-size="6"
    >

      <template #loading>
        <uni-load-more status="loading"></uni-load-more>
      </template>

      <view class="main">
        {{}}
        <mp-html :content="item.content" />
      </view>

      <!-- 评论区 -->
      <view>
        <view class="comment" v-if="commentarr.length">
          <view class="list" v-for="item in commentarr" :key="item._id">
            <view class="row">
              <comment-item :item="item"></comment-item>
            </view>
          </view>
        </view>

        <view v-if="!nodata && !commentarr.length" style="padding: 60rpx">
          <uni-load-more status="loading"></uni-load-more>
        </view>
      </view>
      <!-- 底部图标栏 -->
      <template #bottom>
        <interactive-bar
          :item="item"
          @commentinfo="handelComment"
        ></interactive-bar>
      </template>
      <view class="safe-area-bottom"></view>
    </z-paging>

    <!-- 评论输入框弹窗 -->
    <uni-popup type="bottom" ref="commentpp">
      <comment-replay
        ref="child"
        :source="source"
        @success="replySuccess"
      ></comment-replay>
    </uni-popup>
  </view>
</template>

<script setup>
import { showToast, isAdminRole } from "@/utils/common.js";
const db = uniCloud.database();
const dbCmd = db.command;
const $ = dbCmd.aggregate;
const item = ref();
const nodata = ref(false);
const goodsydx = uniCloud.importObject("goods_item");
const current_id = uniCloud.getCurrentUserInfo().uid; // 当前用户id

const commentpp = ref(null);
const child = ref(null);
const source = ref({});
const commentcs = ref({});
const paging = ref(null);
const commentarr = ref([]); // 评论数组

const jgPopup = ref(null); //crud价格弹窗
// 详情页id
let detailid;
onLoad((e) => {
  detailid = e.id;
  console.log(detailid);
  getdata();
});

// 举报页面
const tousu = (idd) => {
  uni.navigateTo({
    url: "/pages_fena/jubao/jubao?id=" + idd,
  });
};

//  提交评论后事件
const replySuccess = () => {
  showToast("发布评论成功");
  commentpp.value.close();
  paging.value.refresh();
};

// 删除立即渲染
uni.$on("deleter", () => {
  uni.showToast({
    title: "删除了",
    duration: 1000,
  });
  nextTick(() => {
    paging.value.refresh();
  });
});
// 获取item评论
const queryList = async (pageNo, pageSize) => {
  getcomment(pageNo, pageSize);
};
const getcomment = async (pageNo, pageSize) => {
  let skip = (pageNo - 1) * pageSize;
  let {
    result: { errCode, data },
  } = await db
    .collection("goods_comment")
    .aggregate()
    .match({
      soup_id: detailid,
      comment_type: 0,
    })
    //  每个评论头像昵称
    .lookup({
      from: "uni-id-users",
      let: {
        uid: "$user_id",
      },
      pipeline: $.pipeline()
        .match(dbCmd.expr($.eq(["$_id", "$$uid"])))
        .project({
          username: 1,
          avatar: 1,
        })
        .done(),
      as: "userInfo",
    })
    //  每个评论回复的个数
    .lookup({
      from: "goods_comment",
      let: {
        uuid: "$_id",
      },
      pipeline: $.pipeline()
        .match(dbCmd.expr($.eq(["$reply_parent_id", "$$uuid"])))
        .count("length")
        .done(),
      as: "childcount",
    })
    //  每个评论的回复的2个信息
    .lookup({
      from: "goods_comment",
      let: {
        uuid: "$_id",
      },
      pipeline: $.pipeline()
        .match(dbCmd.expr($.eq(["$reply_parent_id", "$$uuid"])))
        .project({
          comment_content: 1,
          user_id: 1,
        })
        .lookup({
          from: "uni-id-users",
          let: {
            uid: "$user_id",
          },
          pipeline: $.pipeline()
            .match(dbCmd.expr($.eq(["$_id", "$$uid"])))
            .project({
              username: 1,
            })
            .done(),
          as: "userInfo",
        })
        .sort({
          like_count: -1,
        })
        .limit(2)
        .project({
          username: $.arrayElemAt(["$userInfo.username", 0]),
          comment_content: 1,
        })
        .done(),
      as: "child2info",
    })
    // 当前用户对item评论bool点赞
    .lookup({
      from: "goods_like",
      let: {
        commentid: "$_id",
      },
      pipeline: $.pipeline()
        .match(
          dbCmd.expr(
            $.and([
              $.eq(["$comment_id", "$$commentid"]),
              $.eq(["$user_id", current_id]),
            ])
          )
        )
        .count("length")
        .done(),
      as: "likeInfo",
    })

    .project({
      likeInfo: $.cond({
        if: $.gt([$.arrayElemAt(["$likeInfo.length", 0]), 0]),
        then: true,
        else: false,
      }),
      childcount: $.arrayElemAt(["$childcount.length", 0]),
      child2info: 1,
      comment_date: 1,
      userInfo: $.arrayElemAt(["$userInfo", 0]),
      bool_remove: 1,
      comment_content: 1,
      comment_type: 1,
      comment_count: 1,
      like_count: 1,
      soup_id: 1,
    })
    .sort({
      comment_date: -1,
    })
    .skip(skip)
    .limit(pageSize)
    .end();
  if (data.length == 0) nodata.value = true;
  if (errCode != 0) return;
  console.log(data);
  paging.value.complete(data);
};
// 接受回复页面点赞事件
uni.$on("like", (e) => {
  let index = commentarr.value.findIndex((item) => item._id == e._id);
  if (index < 0) return;
  commentarr.value[index] = {
    ...commentarr.value[index],
    ...e,
  };
});
// 詳情頁
const getdata = async () => {
  let {
    result: { errCode, data },
  } = await db
    .collection("goods_detail")
    .aggregate()
    .match({
      _id: detailid,
    })
    .lookup({
      from: "uni-id-users",
      let: {
        uid: "$user_id",
      },
      pipeline: $.pipeline()
        .match(dbCmd.expr($.eq(["$_id", "$$uid"])))
        .project({
          username: 1,
          avatar: 1,
        })
        .done(),
      as: "userInfo",
    })
    // 判断当前用户对当前详情页是否点赞 结果boole
    .lookup({
      from: "goods_like",
      let: {
        goodsid: "$_id",
      },
      pipeline: $.pipeline()
        .match(
          dbCmd.expr(
            $.and([
              $.eq(["$like_type", 0]),
              $.eq(["$user_id", current_id]),
              $.eq(["$soup_id", "$$goodsid"]),
            ])
          )
        )
        .count("length")
        .done(),
      as: "likeInfo",
    })
    // 收藏
    .lookup({
      from: "collect_g",
      let: {
        goodsid: "$_id",
      },
      pipeline: $.pipeline()
        .match(
          dbCmd.expr(
            $.and([
              $.eq(["$user_id", current_id]),
              $.eq(["$goods_id", "$$goodsid"]),
            ])
          )
        )
        .count("length")
        .done(),
      as: "collectbool",
    })
    // 每个详细价格
    .lookup({
      from: "detail_price",
      let: {
        pric: "$Category",
      },
      pipeline: $.pipeline()
        .match(dbCmd.expr($.eq(["$detail_id", "$$pric"])))
        .done(),
      as: "priceInfo",
    })

    .project({
      collectbool: $.cond({
        if: $.gt([$.arrayElemAt(["$collectbool.length", 0]), 0]),
        then: true,
        else: false,
      }),
      likeInfo: $.cond({
        if: $.gt([$.arrayElemAt(["$likeInfo.length", 0]), 0]),
        then: true,
        else: false,
      }),
      name: 1,
      content: 1,
      pifacontent: 1,
      imageValue: 1,
      collect_count: 1,
      comment_count: 1,
      like_count: 1,
      userInfo: $.arrayElemAt(["$userInfo", 0]),
      priceInfo: 1,
    })

    .end();
  if (errCode != 0) return showToast("信息有误，请重新刷新", "none");

  console.log(data);
  if (data.length > 0) {
    item.value = data[0];
    source.value = {
      soup_id: data[0]._id,
      comment_type: 0,
    };
  }
};

// 显示提交评论弹窗
const handelComment = async () => {
  await commentpp.value.open();
  child.value.focusFn();
};
</script>

<style lang="scss" scoped>
.home {
  padding: 30rpx;
}

.main {
  text {
    line-height: 1.2;
    font-size: 40rpx;
  }
}
</style>
