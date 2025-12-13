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
            @openpp="handleOpenComments"
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
      <!--留言板-->
      <uni-popup ref="usePopup" type="bottom">
        <view class="message-board">
          <!-- 头部 -->
          <view class="message-header">
            <view class="header-title">对师傅评价</view>
            <view class="close-btn" @click="closeMessageBoard">
              <uni-icons type="close" size="20" color="#666"></uni-icons>
            </view>
          </view>

          <!-- 消息列表 -->
          <scroll-view class="message-list" scroll-y="true">
            <view
              class="message-item"
              v-for="(item, index) in messageList"
              :key="index"
            >
              <view class="nickname-tag"> {{ item.nickname }}: </view>
              <view class="message-content">
                {{ item.content }}
              </view>
            </view>

            <!-- 空状态 -->
            <view class="empty-state" v-if="messageList.length === 0">
              <text class="empty-text">暂无消息</text>
            </view>
          </scroll-view>

          <!-- 输入区域 -->
          <view class="input-area">
            <view class="input-wrapper">
              <uni-easyinput
                v-model="messageInput"
                placeholder="请输入消息内容..."
                :maxlength="100"
                :auto-height="true"
                class="message-input"
              ></uni-easyinput>
              <view class="char-count">{{ messageInput.length }}/100</view>
            </view>
            <view
              class="send-btn"
              @click="submitMessage"
              :class="{ active: messageInput.trim() }"
            >
              发送
            </view>
          </view>
        </view>
        <view class="safe-area-bottom"></view>
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

const messageInput = ref("");
const messageList = ref([
  {
    nickname: "张三",
    content: "科技一全链APP软件工程师在哪里",
  },
  {
    nickname: "李四",
    content: "科技一全链APP软件工程师哈哈哈",
  },
]);

const paging = ref(null);

const Paylist = ref([]); //列表
const usePopup = ref(null);
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

const submitMessage = () => {};
const addpp = () => {
  payPopup.value.open();
};

const handleOpenComments = () => {
  usePopup.value.open();
};

// 消息板相关方法
const closeMessageBoard = () => {
  usePopup.value.close();
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

  // 消息板样式
  .message-board {
    background: #fff;
    border-radius: 20rpx 20rpx 0 0;
    max-height: 80vh;
    display: flex;
    flex-direction: column;

    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx 40rpx 20rpx;
      border-bottom: 1rpx solid #f0f0f0;

      .header-title {
        font-size: 36rpx;
        font-weight: 600;
        color: #333;
      }

      .close-btn {
        padding: 10rpx;
        border-radius: 50%;
        background: #f8f8f8;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .message-list {
      flex: 1;
      padding: 20rpx 40rpx;
      max-height: 60vh;

      .message-item {
        display: flex;
        align-items: flex-start;
        padding: 24rpx 0;
        border-bottom: 1rpx solid #f5f5f5;

        &:last-child {
          border-bottom: none;
        }

        .message-content {
          flex: 1;
          font-size: 28rpx;
          color: #333;
          line-height: 1.6;
          word-break: break-all;
        }
      }

      .empty-state {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 300rpx;

        .empty-text {
          font-size: 28rpx;
          color: #999;
        }
      }
    }

    .input-area {
      display: flex;
      align-items: flex-end;
      padding: 20rpx 40rpx 40rpx;
      border-top: 1rpx solid #f0f0f0;
      background: #fff;

      .input-wrapper {
        flex: 1;
        margin-right: 20rpx;
        position: relative;

        .message-input {
          background: #f8f8f8;
          border-radius: 20rpx;
          padding: 20rpx 24rpx;
          font-size: 28rpx;
          min-height: 80rpx;
          max-height: 200rpx;
        }

        .char-count {
          position: absolute;
          bottom: -30rpx;
          right: 10rpx;
          font-size: 22rpx;
          color: #999;
        }
      }

      .send-btn {
        padding: 20rpx 32rpx;
        background: #e0e0e0;
        color: #999;
        border-radius: 20rpx;
        font-size: 28rpx;
        font-weight: 500;
        transition: all 0.3s ease;

        &.active {
          background: #007aff;
          color: #fff;
        }
      }
    }
  }

  .safe-area-bottom {
    height: env(safe-area-inset-bottom);
    background: #fff;
  }
}
</style>
