<!-- console.log()  <view class=""> </view> {知}1行动做到 1 错1改1 转0为1 不1则0,     v-if="newItem.user_id == isAdminRole()"
      -->
<script setup>
import debounce from "lodash.debounce";
const db = uniCloud.database();
import { showToast, isAdminRole, routerTo } from "@/utils/common.js";
const emit = defineEmits(["openpp", "clickPic", "deleteItem", "editItem"]); // 声明引入
const current_id = uniCloud.getCurrentUserInfo().uid; // 当前用户id

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
});
const newItem = ref(props.item); //不能直接修改父组件数据
//点击id复制内容
function copyy(value) {
  if (!value) return;
  uni.setClipboardData({
    data: value,
    success: (res) => {
      console.log(res);
    },
    fail: (err) => {
      console.log(err);
    },
  });
}
// 点击拨通电话
const cliphone = (value) => {
  uni.makePhoneCall({
    phoneNumber: value,
  });
};
// 删除
const delets = async (id) => {
  const res = await uni.showModal({
    title: "提示",
    content: "确定要删除此项吗？",
    confirmText: "删除",
    cancelText: "取消",
  });

  if (res.confirm) {
    try {
      await db.collection("pdd-adv").doc(id).remove();
      showToast("删除成功");
      emit("deleteItem", id); // 通知父组件删除成功
    } catch (error) {
      console.error("删除失败", error);
      showToast("删除失败");
    }
  }
};

const edit = (id) => {
  emit("editItem", id); // 通知父组件进行编辑
};
// 收藏功能
const clickLike = debounce(handleLike, 1000, {
  leading: true,
  trailing: false,
});

async function handleLike() {
  if (newItem.value.isLike) {
    newItem.value.like_count--;
    db.collection("soup-like")
      .where({
        soup_id: newItem.value._id,
        user_id: current_id,
        like_type: 0,
      })
      .remove();
  } else {
    newItem.value.like_count++;
    db.collection("soup-like").add({
      soup_id: newItem.value._id,
      like_type: 0,
    });
  }
  newItem.value.isLike = !newItem.value.isLike;
}

//
const comments = () => {
  emit("openpp");
};

// 图片点击事件
const handleImageClick = () => {
  emit("clickPic");
};

const demoo = async () => {};
</script>
<template>
  <view class="adv-card-container">
    <view class="adv-card-left">
      <image
        class="adv-card-image"
        :src="newItem.imageValue?.[0]?.fileID || '/static/images/notPic.png'"
        mode="aspectFill"
        @click="handleImageClick"
      ></image>
    </view>
    <view class="adv-card-right">
      <view class="adv-card-title">
        {{ newItem.content }}
      </view>

      <view class="adv-card-bottom">
        <view class="adv-card-actions">
          <view class="adv-card-icons">
            <!-- 收藏 -->
            <view class="icon-item" @click.stop="clickLike()">
              <uni-icons
                v-if="newItem.isLike"
                type="star-filled"
                size="22"
                color="#ff4d4f"
              ></uni-icons>
              <uni-icons
                v-else
                type="star"
                size="22"
                color="#bfbfbf"
              ></uni-icons>
              <text
                v-if="newItem.like_count > 0"
                class="count-text"
                :class="{ active: newItem.isLike }"
                >{{ newItem.like_count }}</text
              >
            </view>

            <!-- 评论 -->
            <view class="icon-item" @click.stop="comments">
              <uni-icons type="chat" size="22" color="#bfbfbf"></uni-icons>
            </view>
          </view>

          <view class="adv-card-buttons">
            <view
              v-if="newItem.phone"
              class="action-btn phone"
              @click.stop="cliphone(newItem.phone)"
            >
              <text>电话</text>
            </view>
            <view
              v-if="newItem.wx_count"
              class="action-btn wechat"
              @click.stop="copyy(newItem.wx_count)"
            >
              <text>微信</text>
            </view>
          </view>
        </view>

        <!-- 管理员区域 -->
        <view class="admin-area" v-if="isAdminRole()">
          <view class="admin-btn delete" @click.stop="delets(newItem._id)">
            删除
          </view>
          <view
            class="admin-btn edit"
            @click.stop="routerTo('/pages_fen/advpay/edit?id=' + newItem._id)"
          >
            修改
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.adv-card-container {
  display: flex;
  padding: 24rpx;
  background-color: #fff;
  border-radius: 20rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.99);
  }

  .adv-card-left {
    width: 220rpx;
    height: 220rpx;
    margin-right: 24rpx;
    flex-shrink: 0;
    border-radius: 16rpx;
    overflow: hidden;
    background-color: #f8f8f8;
    box-shadow: inset 0 0 10rpx rgba(0, 0, 0, 0.02);

    .adv-card-image {
      width: 100%;
      height: 100%;
      transition: transform 0.3s;
    }
  }

  .adv-card-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden; // 防止内容溢出

    .adv-card-title {
      font-size: 30rpx;
      line-height: 1.5;
      font-weight: 600;
      color: #333;
      margin-bottom: 16rpx;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .adv-card-bottom {
      margin-top: auto;
    }

    .adv-card-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10rpx;

      .adv-card-icons {
        display: flex;
        align-items: center;
        gap: 24rpx;

        .icon-item {
          display: flex;
          align-items: center;
          padding: 8rpx 0;

          .count-text {
            font-size: 24rpx;
            color: #999;
            margin-left: 6rpx;
            font-weight: 500;

            &.active {
              color: #ff4d4f;
            }
          }
        }
      }

      .adv-card-buttons {
        display: flex;
        gap: 16rpx;

        .action-btn {
          padding: 0 24rpx;
          height: 56rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 28rpx;
          font-size: 24rpx;
          font-weight: 500;
          color: #fff;
          box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);

          &.phone {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            box-shadow: 0 4rpx 12rpx rgba(79, 172, 254, 0.3);
          }

          &.wechat {
            background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
            box-shadow: 0 4rpx 12rpx rgba(67, 233, 123, 0.3);
          }

          &:active {
            opacity: 0.9;
            transform: translateY(2rpx);
          }
        }
      }
    }

    .admin-area {
      margin-top: 20rpx;
      padding-top: 16rpx;
      border-top: 1rpx dashed #eee;
      display: flex;
      justify-content: flex-end;
      gap: 16rpx;

      .admin-btn {
        padding: 8rpx 24rpx;
        border-radius: 8rpx;
        font-size: 22rpx;
        cursor: pointer;

        &.delete {
          background-color: #fff1f0;
          color: #ff4d4f;
          border: 1rpx solid #ffa39e;
        }

        &.edit {
          background-color: #e6f7ff;
          color: #1890ff;
          border: 1rpx solid #91d5ff;
        }
      }
    }
  }
}
</style>
