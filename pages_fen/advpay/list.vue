<template>
  <view class="self">
    <z-paging
      ref="paging"
      v-model="Paylist"
      @query="queryList"
      :default-page-size="6"
      :auto="false"
    >
      <view class="notice">
        <scroll-notice></scroll-notice>
      </view>

      <template #loading>
        <uni-load-more status="loading"></uni-load-more>
      </template>

      <view class="content">
        <view class="item" v-for="(item, index) in Paylist" :key="item._id">
          <adv-card
            :item="item"
            @click="toDetail(item._id)"
            @clickPic="clickPicc(index)"
            @deleteItem="handleDeleteItem"
            @editItem="handleEditItem"
          ></adv-card>
        </view>
      </view>
      <view class="bottom">
        <view class="btn" @click="addpp">上传</view>
      </view>
      <uni-popup ref="payPopup" type="bottom">
        <Myedit :category-id="query.category_id" />
      </uni-popup>
    </z-paging>
  </view>
</template>

<script setup>
import Myedit from "./child/mynews.vue";
const db = uniCloud.database();
const dbCmd = db.command;
const $ = dbCmd.aggregate;
const query = ref({
  pageSize: 10,
  pageCurrent: 1,
  category_id: "",
});

const paging = ref(null);

const Paylist = ref([]); //列表
const payPopup = ref(null);

onLoad((e) => {
  let { id = null } = e;
  query.value.category_id = id;
  console.log(e);
  nextTick(() => {
    paging.value.reload();
  });
});

const queryList = async (pageNo, pageSize) => {
  try {
    const queryData = unref(query);
    queryData.pageSize = Math.min(10, queryData.pageSize);
    queryData.pageCurrent = (pageNo - 1) * queryData.pageSize;
    let {
      result: { errCode, data },
    } = await db
      .collection("pdd-adv")
      .aggregate()
      .match(`category_id=='${unref(query).category_id}' && order_status != 0 `)
      /*
      .lookup({
        from: "uni-id-users",
        let: {
          uid: "$user_id",
        },
        pipeline: $.pipeline()
          .project({
            username: 1,
          })
          .done(),
        as: "userInfo",
      })
     
      .lookup({
        from: "soup-like",
        let: {
          soupID: "$_id",
        },
        pipeline: $.pipeline()
          .match(
            dbCmd.expr(
              $.and([
                $.eq(["$like_type", 0]),
                $.eq(["$$soupID", "$soup_id"]),
                $.eq(["$user_id", current_id.value]),
              ])
            )
          )
          .count("length")
          .done(),
        as: "likeState",
      })
      */
      .project({
        isLike: $.cond({
          if: $.gt([$.arrayElemAt(["$likeState.length", 0]), 0]),
          then: true,
          else: false,
        }),
        like_count: 1,
        wx_count: 1,
        comment_count: 1,
        content: 1,
        imageValue: 1,
        order_no: 1,
        phone: 1,
        order_status: 1,
        userInfo: $.arrayElemAt(["$userInfo", 0]),
        hotstatus: 1,
      })
      .sort({
        hotstatus: -1,
        like_count: -1,
      })
      .skip(queryData.pageCurrent)
      .limit(queryData.pageSize)
      .end();

    if (errCode !== 0) return paging.value.complete(false);
    paging.value.complete(data);

    console.log(data);
  } catch (err) {
    paging.value.complete(false);
  }
};
// 跳转详情页
const toDetail = (id) => {
  uni.navigateTo({
    url: `/pages_fen/advpay/detail?id=${id}`,
  });
};

// 图片点击预览功能

const clickPicc = (index) => {
  uni.previewImage({
    urls: Paylist.value[index].imageValue.map((item) => item.fileID),
    current: 0,
  });
};
// 提交评论

const addpp = () => {
  payPopup.value.open();
};

const handleDeleteItem = (deletedId) => {
  const index = Paylist.value.findIndex((item) => item._id === deletedId);
  if (index !== -1) {
    Paylist.value.splice(index, 1);
  }
};

const handleEditItem = (editId) => {
  routerTo(`/pages_fen/advpay/edit?id=${editId}`);
};
</script>

<style lang="scss" scoped>
.self {
  width: 100vw;

  .content {
    width: 100%;
    height: 100%;
    background-color: #fff;
    padding: 10rpx;
    border-radius: 8rpx;

    .item {
      display: flex;
      letter-spacing: 4rpx;
      font-size: 34rpx;
      font-weight: bold;
      border-bottom: 1rpx solid $text-font-color-3;
      padding-bottom: 10rpx;
    }
  }

  .bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 180rpx;
    @include flex-box();
    align-items: center;
    padding: 0 25rpx;
    border-top: 1px solid black;
    background: white;
    z-index: 10;

    .btn {
      width: 50%;
      background-color: rgb(0, 123, 255);
      /* 背景蓝色 */
      color: white;
      /* 字体白色 */
      border-radius: 10rpx;
      /* 圆角 */
      @include flex-box-set();
      height: 100rpx;
      /* 根据需要调整高度 */
      font-size: 32rpx;
      margin-left: 190rpx;
    }
  }
}
</style>
