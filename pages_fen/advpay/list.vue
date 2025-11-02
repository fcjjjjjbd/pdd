<!-- console.log() 居安思死-->
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
          <adv-card :item="item"  @clickPic="() => clickPic(index)" @openpp="handleOpenComments"></adv-card>
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
            <view class="header-title">消息列表</view>
            <view class="close-btn" @click="closeMessageBoard">
              <uni-icons type="close" size="20" color="#666"></uni-icons>
            </view>
          </view>
          
          <!-- 消息列表 -->
          <scroll-view class="message-list" scroll-y="true">
            <view class="message-item" v-for="(item, index) in messageList" :key="index">
              <view class="nickname-tag">
                {{ item.nickname }}:
              </view>
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
            <view class="send-btn" @click="submitMessage" :class="{ active: messageInput.trim() }">
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
import { showToast, isAdminRole } from "@/utils/common.js";
import { priceFormat } from "@/utils/tools.js";
import Myedit from "./child/mynews.vue";
const db = uniCloud.database(); // 连接云对象整体

const pddCloudObj = uniCloud.importObject("client-adv");
const dbCmd = db.command;
const query = ref({
  pageSize: 10,
  pageCurrent: 1,
  category_id: "",
});

const comment_content = ref("");

// 消息板相关数据
const messageInput = ref('');
const messageList = ref([
  {
    nickname: '张三',
    content: '科技一全链APP软件工程师在哪里'
  },
  {
    nickname: '李四',
    content: '科技一全链APP软件工程师哈哈哈😄😄'
  }
]);

const paging = ref(null);
const Paylist = ref([]); //列表
const usePopup = ref(null);
const payPopup = ref(null);

const current_id = ref(uniCloud.getCurrentUserInfo().uid); // 当前用户id
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
    let { errCode, data } = await pddCloudObj.categorylist(unref(query));
    if (errCode !== 0) return paging.value.complete(false);
    console.log(data);
    paging.value.complete(data);
  } catch (err) {
    paging.value.complete(false);
  }
};
// 图片点击预览功能

const clickPic = ( index ) => {
  console.log('图片点击事件触发，index:', index);
  console.log('当前项目数据:', Paylist.value[index]);
  
  if (!Paylist.value[index] || !Paylist.value[index].imageValue || Paylist.value[index].imageValue.length === 0) {
    uni.showToast({
      title: '没有可预览的图片',
      icon: 'none'
    });
    return;
  }
  
  uni.previewImage({
    urls: Paylist.value[ index ].imageValue.map(item => item.fileID),
    current: 0 ,
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

const loadMessages = async () => {
  try {
    // 这里可以添加从数据库加载消息的逻辑
    // const result = await db.collection('messages').get();
    // messageList.value = result.data;
  } catch (error) {
    console.error('加载消息失败:', error);
  }
};

// 删除
const removeid = async (id, index) => {
  let res = await uni.showModal({
    title: "是否删除",
  });
  if (res.confirm) {
    await db.collection("pay-order").doc(id).remove(); //删除商品
    Paylist.value.splice(index, 1);
  }
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

      .left {
        display: flex;
        align-items: center;
        font-size: 24rpx;
        color: $text-font-color-2;
      }

      .right {
        display: flex;
        flex-direction: column;
        width: 100%;

        .info {
          @include flex-box();

          .rights {
            display: flex;

            .item {
              display: flex;
              align-items: center;

              margin-right: 5rpx;
              .wen {
              }
            }
          }
        }
      }
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

        .status-tag {
          flex-shrink: 0;
          padding: 8rpx 16rpx;
          border-radius: 8rpx;
          font-size: 24rpx;
          font-weight: 500;
          margin-right: 20rpx;
          min-width: 80rpx;
          text-align: center;

          &.pending {
            background: #e3f2fd;
            color: #1976d2;
          }

          &.completed {
            background: #e8f5e8;
            color: #2e7d32;
          }

          &.processing {
            background: #fff3e0;
            color: #f57c00;
          }

          &.cancelled {
            background: #ffebee;
            color: #d32f2f;
          }
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
