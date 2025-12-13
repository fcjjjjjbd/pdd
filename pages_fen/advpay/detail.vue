<template>
  <view class="detail-container">
    <template v-if="loading">
      <view class="loading-box">
        <uni-load-more status="loading"></uni-load-more>
      </view>
    </template>

    <template v-else-if="detail._id">
      <!-- 1. 页面头部区域 -->
      <view class="header">
        <view class="user-info">
          <image
            class="avatar"
            :src="
              detail.userInfo &&
              detail.userInfo[0] &&
              detail.userInfo[0].avatar_file
                ? detail.userInfo[0].avatar_file.url
                : '/static/user-default.png'
            "
            mode="aspectFill"
          ></image>
          <view class="info-right">
            <text class="nickname">{{
              detail.userInfo && detail.userInfo[0]
                ? detail.userInfo[0].nickname
                : "匿名用户"
            }}</text>
            <uni-dateformat
              :date="detail.createTime"
              format="yyyy-MM-dd hh:mm"
              class="time"
            ></uni-dateformat>
          </view>
        </view>
      </view>

      <!-- 2. 内容展示区 -->
      <view class="content-area">
        <view class="article-content">
          <rich-text :nodes="detail.content"></rich-text>
        </view>

        <!-- 图片瀑布流 -->
        <view
          class="image-grid"
          v-if="detail.imageValue && detail.imageValue.length > 0"
        >
          <view
            class="grid-item"
            v-for="(img, index) in detail.imageValue"
            :key="index"
            @click="previewImage(index)"
          >
            <image
              :src="img.url || img.fileID"
              mode="aspectFill"
              class="grid-img"
            ></image>
          </view>
        </view>
      </view>

      <!-- 3. 功能操作区 -->
      <view class="action-bar">
        <view class="action-item" @click="toggleFavorite">
          <uni-icons
            :type="isFavorite ? 'star-filled' : 'star'"
            size="24"
            :color="isFavorite ? '#ffca3e' : '#666'"
          ></uni-icons>
          <text>{{ isFavorite ? "已收藏" : "收藏" }}</text>
        </view>

        <view class="action-item" @click="makePhoneCall" v-if="detail.phone">
          <uni-icons type="phone-filled" size="24" color="#007aff"></uni-icons>
          <text>拨打电话</text>
        </view>

        <view class="action-item" @click="copyWechat" v-if="detail.wx_count">
          <uni-icons type="weixin" size="24" color="#4cd964"></uni-icons>
          <text>复制微信</text>
        </view>

        <view class="action-item" @click="handleReport">
          <uni-icons type="info" size="24" color="#dd524d"></uni-icons>
          <text>举报</text>
        </view>
      </view>

      <!-- 分隔条 -->
      <view class="divider"></view>

      <!-- 4. 评论区 -->
      <view class="comment-section">
        <view class="section-title">全部评论 ({{ commentList.length }})</view>

        <view class="comment-list">
          <view
            class="comment-item"
            v-for="(comment, index) in commentList"
            :key="index"
          >
            <image
              class="comment-avatar"
              :src="comment.avatar || '/static/user-default.png'"
              mode="aspectFill"
            ></image>
            <view class="comment-right">
              <view class="comment-header">
                <text class="comment-user">{{ comment.nickname }}</text>
                <text class="comment-time">{{ comment.time }}</text>
              </view>
              <text class="comment-text">{{ comment.content }}</text>
            </view>
          </view>

          <view v-if="commentList.length === 0" class="empty-comment">
            <text>暂无评论，快来抢沙发吧~</text>
          </view>
        </view>
      </view>

      <!-- 底部占位，防止输入框遮挡 -->
      <view class="footer-placeholder"></view>
    </template>

    <template v-else>
      <view class="error-box">
        <text>内容不存在或已被删除</text>
      </view>
    </template>

    <!-- 底部评论输入框 -->
    <view class="footer-input-bar">
      <view class="input-wrapper">
        <uni-easyinput
          v-model="commentContent"
          placeholder="说点什么吧..."
          :inputBorder="false"
          confirmType="send"
          @confirm="submitComment"
        ></uni-easyinput>
      </view>
      <view
        class="send-btn"
        @click="submitComment"
        :class="{ active: commentContent.trim() }"
        >发送</view
      >
    </view>
  </view>
</template>

<script setup>
const db = uniCloud.database();
const dbCmd = db.command;
const $ = dbCmd.aggregate;

const id = ref("");
const detail = ref({});
const loading = ref(true);
const isFavorite = ref(false);

// 评论相关
const commentContent = ref("");
const commentList = ref([
  // 模拟数据
  {
    nickname: "热心网友",
    avatar: "",
    content: "看起来很不错！",
    time: "2023-12-12 10:00",
  },
  {
    nickname: "路人甲",
    avatar: "",
    content: "支持一下楼主",
    time: "2023-12-12 10:30",
  },
]);

onLoad((options) => {
  if (options.id) {
    id.value = options.id;
    getDetail();
  }
});

const getDetail = async () => {
   try {
        let {
      result: { errCode, data },
    } = await db
      .collection("pdd-adv")
      .aggregate()
        .match({
        _id: id.value,
      })
      .lookup({
        from: "uni-id-users",
        let: {
          uid: "$user_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$uid"],
              },
            },
          },
          {
            $project: {
              nickname: 1,
              avatar_file: 1,
            },
          },
        ],
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
      // */
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
  

 
  } catch (e) {
    console.error(e);
    uni.showToast({
      title: "获取详情失败",
      icon: "none",
    });
  } finally {
    loading.value = false;
  }
};

const previewImage = (current) => {
  if (!detail.value.imageValue || !Array.isArray(detail.value.imageValue))
    return;
  const urls = detail.value.imageValue.map((item) => item.url || item.fileID);
  uni.previewImage({
    current,
    urls,
  });
};

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
  uni.showToast({
    title: isFavorite.value ? "收藏成功" : "已取消收藏",
    icon: "none",
  });
};

const checkFavorite = () => {
  // 这里应该调用API检查是否收藏，暂时随机模拟
  isFavorite.value = false;
};

const makePhoneCall = () => {
  if (detail.value.phone) {
    uni.makePhoneCall({
      phoneNumber: String(detail.value.phone),
    });
  }
};

const copyWechat = () => {
  if (detail.value.wx_count) {
    uni.setClipboardData({
      data: detail.value.wx_count,
      success: () => {
        uni.showToast({
          title: "微信已复制",
          icon: "none",
        });
      },
    });
  }
};

const handleReport = () => {
  uni.showActionSheet({
    itemList: ["垃圾广告", "违法违规", "涉黄涉暴", "其他"],
    success: (res) => {
      uni.showToast({
        title: "举报已提交",
        icon: "none",
      });
    },
  });
};

const submitComment = () => {
  if (!commentContent.value.trim()) {
    return uni.showToast({ title: "请输入评论内容", icon: "none" });
  }

  // 模拟发送
  uni.showLoading({ title: "发送中" });
  setTimeout(() => {
    uni.hideLoading();
    commentList.value.unshift({
      nickname: "我",
      avatar: "",
      content: commentContent.value,
      time: new Date().toLocaleString(),
    });
    commentContent.value = "";
    uni.showToast({ title: "评论成功", icon: "none" });
  }, 500);
};
</script>

<style lang="scss" scoped>
.detail-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 120rpx; /* 为底部输入框留出空间 */
}

.loading-box,
.error-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  color: #999;
}

/* 1. 头部区域 */
.header {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .user-info {
    display: flex;
    align-items: center;

    .avatar {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      margin-right: 20rpx;
      background-color: #eee;
    }

    .info-right {
      display: flex;
      flex-direction: column;

      .nickname {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 6rpx;
      }

      .time {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}

/* 2. 内容区域 */
.content-area {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .article-content {
    font-size: 30rpx;
    color: #333;
    line-height: 1.6;
    margin-bottom: 30rpx;
  }

  .image-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .grid-item {
      width: 48%; /* 每行2列，留出间隙 */
      height: 300rpx;
      margin-bottom: 20rpx;
      border-radius: 10rpx;
      overflow: hidden;
      background-color: #f0f0f0;

      .grid-img {
        width: 100%;
        height: 100%;
      }
    }
  }
}

/* 3. 功能操作区 */
.action-bar {
  background-color: #fff;
  padding: 20rpx 0;
  display: flex;
  justify-content: space-around;
  margin-bottom: 20rpx;

  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    text {
      font-size: 24rpx;
      color: #666;
      margin-top: 10rpx;
    }
  }
}

.divider {
  height: 1rpx;
  background-color: #eee;
  margin: 0 30rpx;
}

/* 4. 评论区 */
.comment-section {
  background-color: #fff;
  padding: 30rpx;

  .section-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 30rpx;
    border-left: 6rpx solid #007aff;
    padding-left: 16rpx;
  }

  .comment-list {
    .comment-item {
      display: flex;
      margin-bottom: 30rpx;
      border-bottom: 1rpx solid #f5f5f5;
      padding-bottom: 20rpx;

      &:last-child {
        border-bottom: none;
      }

      .comment-avatar {
        width: 70rpx;
        height: 70rpx;
        border-radius: 50%;
        margin-right: 20rpx;
        background-color: #eee;
      }

      .comment-right {
        flex: 1;

        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10rpx;

          .comment-user {
            font-size: 28rpx;
            font-weight: 500;
            color: #333;
          }

          .comment-time {
            font-size: 24rpx;
            color: #999;
          }
        }

        .comment-text {
          font-size: 28rpx;
          color: #666;
          line-height: 1.5;
        }
      }
    }

    .empty-comment {
      text-align: center;
      padding: 40rpx 0;
      color: #999;
      font-size: 26rpx;
    }
  }
}

/* 底部输入框 */
.footer-input-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  border-top: 1rpx solid #eee;
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  z-index: 999;
  box-sizing: border-box;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));

  .input-wrapper {
    flex: 1;
    background-color: #f5f5f5;
    border-radius: 40rpx;
    padding: 0 20rpx;
    margin-right: 20rpx;
  }

  .send-btn {
    font-size: 30rpx;
    color: #999;
    padding: 10rpx 20rpx;

    &.active {
      color: #007aff;
      font-weight: bold;
    }
  }
}
</style>
