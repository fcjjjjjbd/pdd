<script setup>
import { ref, computed, unref } from "vue";
import {
  routerTo,
  showModal,
  showLoading,
  showToast,
  isAdminRole,
} from "@/utils/common.js";
import { removeHtmlTags, convertImageToWebP } from "@/utils/tools.js";
import dayjs from "dayjs";
import { useNavlistStore } from "@/stores/navlistStore.js";

const useNavlist = useNavlistStore();
const db = uniCloud.database();
const goods_yundx = uniCloud.importObject("goods-backend");

const opencloubobj = uniCloud.importObject("client-aopen", {
  customUI: true,
});

// 页面模式控制
const pageMode = ref("list"); // 'list' 或 'edit'
const editId = ref(null);
const current_id = ref("");

// 原有列表功能
const dataList = ref([]);
const getmy = async () => {
  let { errCode, errMsg, count, data } = await opencloubobj.myopen();
  if (errCode !== 0) return showToast("获取失败");
  console.log(data);
  dataList.value = data;
};
getmy();

// 删除
const delTable = async (id) => {
  try {
    if (!(await showModal({ content: "是否确认删除?" }))) return;
    showLoading("执行中..");
    let { errCode, errMsg, data } = await opencloubobj.remove(id);
    if (errCode !== 0) return showToast("删除失败");
    showToast("删除成功");
    dataList.value = dataList.value.filter((item) => item._id !== id);
    getmy();
  } catch (err) {
    showModal(err);
    console.log(err);
  } finally {
    uni.hideLoading();
  }
};

// 编辑功能相关
const dataobj = ref({
  name: "",
  content: "",
  phone: "", // 用户电话号码
  imageValue: [],
  temparr: [],
  goods_thumb: "",
});

const pageType = computed(() => (unref(editId) ? "修改" : "新增"));

// 电话号码验证
const validatePhone = (phone) => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// 进入编辑模式
const enterEditMode = async (id = null) => {
  editId.value = id;
  pageMode.value = "edit";

  if (id) {
    // 编辑模式，获取详情
    await getDetail();
  } else {
    // 新增模式，重置数据
    init();
  }

  // 设置导航标题
  uni.setNavigationBarTitle({ title: unref(pageType) });
};

// 返回列表模式
const backToList = () => {
  pageMode.value = "list";
  editId.value = null;
  init();
  uni.setNavigationBarTitle({ title: "我发布的" });
};

const getDetail = async () => {
  let { errCode, data } = await opencloubobj.detailxg(unref(editId));
  dataobj.value = data;
  console.log(data);
};

// 选择好图片
const addpic = async () => {
  const res = await new Promise((resolve) => {
    uni.chooseImage({
      count: 8,
      success: resolve,
      fail: () => resolve(null),
    });
  });

  if (!res || !res.tempFilePaths.length) return;

  dataobj.value.temparr = res.tempFilePaths;

  // 上传云端图片
  for (let item of dataobj.value.temparr) {
    let yspic = await convertImageToWebP(item);
    let res = await uniCloud.uploadFile({
      filePath: yspic,
      cloudPathAsRealPath: true,
      cloudPath:
        "dspic/" + dayjs().format("YYYY-MM-DD") + "/" + Date.now() + ".webp",
    });
    console.log(res);
    dataobj.value.imageValue.push(res);
  }
  dataobj.value.goods_thumb = dataobj.value.imageValue[0].fileID;
  dataobj.value.temparr = [];
};

// 提交
const tijiao = async () => {
  // 验证电话号码
  if (!validatePhone(dataobj.value.phone)) {
    return showToast("请输入正确的手机号码");
  }
  return;
  dataobj.value.content = removeHtmlTags(dataobj.value.content);
  console.log(dataobj.value);
  dataobj.value.name = dataobj.value.content.slice(0, 20);

  goodsff();
};

// 提交云端
const goodsff = async () => {
  try {
    uni.showLoading({
      mask: true,
    });

    let { errCode, errMsg } = unref(editId)
      ? await opencloubobj.update(dataobj.value)
      : await opencloubobj.add(dataobj.value);
    if (errCode !== 0) {
      return showToast({
        title: errMsg,
      });
    }
    showToast({
      title: unref(editId) ? "修改成功" : "新增成功",
    });
  } catch (err) {
    showToast({
      title: err,
    });
  } finally {
    uni.hideLoading();
    // 返回列表并刷新
    backToList();
    getmy();
  }
};

// 删除本地图片
const delepic = async (index) => {
  await goods_yundx.deletimg(dataobj.value.imageValue[index].fileID);
  dataobj.value.imageValue.splice(index, 1);
};

//恢复默认
const init = () => {
  dataobj.value = {
    name: "",
    content: "",
    phone: "",
    imageValue: [],
    temparr: [],
    goods_thumb: "",
  };
};

// 修改原有的编辑按钮点击事件
const editItem = (id) => {
  enterEditMode(id);
};

// 新增文章
const addNewArticle = () => {
  enterEditMode();
};
</script>

<template>
  <view class="home">
    <!-- 列表模式 -->
    <view v-if="pageMode === 'list'">
      我发布的

      <view class="list-wrap">
        <view
          class="item-wrap"
          v-for="item in dataList"
          :key="item._id"
          @click="routerTo('/pages_fen/open/open-newsdetail?id=' + item._id)"
        >
          <view class="left-wrap">
            <view class="title">
              {{ item.name }}
            </view>
            <view class="info">
              <view @click.stop="editItem(item._id)">
                <uni-icons type="compose" size="30"></uni-icons>
                修改
              </view>
              <view @click.stop="delTable(item._id)">
                <uni-icons type="trash" size="30"></uni-icons>
                删除
              </view>
            </view>
          </view>
          <view class="right-wrap" v-if="item.goods_thumb">
            <image
              class="img"
              :src="item.goods_thumb"
              mode="aspectFill"
            ></image>
          </view>
        </view>
      </view>

      <!-- 新增文章按钮 -->
      <view class="add-article-btn">
        <button @click="addNewArticle">新增文章</button>
      </view>
    </view>

    <!-- 编辑模式 -->
    <view v-else-if="pageMode === 'edit'" class="edit-container">
      <!-- 返回按钮 -->
      <view class="back-btn" @click="backToList">
        <uni-icons type="back" size="30"></uni-icons>
        返回列表
      </view>

      <!-- 用户电话号码输入 -->
      <view class="phone-row">
        <view class="label">用户电话:</view>
        <uni-easyinput
          v-model="dataobj.phone"
          type="number"
          placeholder="请输入11位手机号码"
          maxlength="11"
          :clearable="true"
          :styles="{
            color: '#333',
            fontSize: '30rpx',
            borderColor:
              validatePhone(dataobj.phone) || !dataobj.phone
                ? '#e5e5e5'
                : '#ff4757',
          }"
        />
        <view
          v-if="dataobj.phone && !validatePhone(dataobj.phone)"
          class="error-tip"
        >
          请输入正确的手机号码格式
        </view>
      </view>

      <!-- 添加学博客图片 -->
      <view class="picarr">
        <view
          class="box add"
          @click="addpic"
          v-if="dataobj.imageValue.length < 8"
        >
          <uni-icons type="plus" size="39"></uni-icons>
        </view>

        <view
          class="box pic"
          v-for="(item, index) in dataobj.imageValue"
          :key="index"
        >
          <image class="img" :src="item.fileID" mode="aspectFit"></image>
          <view class="mask">
            <view class="icon"> </view>
            <view class="icon" @click="delepic(index)">
              <uni-icons type="trash" size="30"></uni-icons>
            </view>
          </view>
        </view>
      </view>

      <textarea
        v-model="dataobj.content"
        auto-height
        placeholder="分享技术文章"
        style="width: 100%; min-height: 400rpx"
        class="font-30"
        maxlength="999"
      ></textarea>

      <view class="tijiao">
        <button type="primary" @click="tijiao">提交</button>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.home {
  padding: 20rpx;
  background-color: #f5f5f5;
  height: 1100rpx;
  width: 100%;

  .list-wrap {
    padding: 12rpx 0;

    .item-wrap {
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      align-items: stretch;
      justify-content: space-between;
      padding: 24rpx 32rpx;
      gap: 24rpx;
      height: 200rpx;

      .left-wrap {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .title {
          font-size: 30rpx;
          color: #333;
          @include text-ellipsis(2);
        }

        .info {
          display: flex;
          font-size: 26rpx;
          color: #aaa;
          gap: 12rpx;
        }
      }

      .right-wrap {
        flex-shrink: 0;
        height: 100%;
        aspect-ratio: 16 / 10;
        border-radius: 8rpx;
        overflow: hidden;

        .img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  /* 新增文章按钮样式 */
  .add-article-btn {
    position: fixed;
    bottom: 60rpx;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;

    button {
      background-color: #007aff;
      color: white;
      border-radius: 50rpx;
      padding: 20rpx 40rpx;
      font-size: 32rpx;
    }
  }

  /* 编辑模式样式 */
  .edit-container {
    padding: 20rpx;
    background-color: #fff;
    min-height: 100vh;

    .back-btn {
      display: flex;
      align-items: center;
      gap: 10rpx;
      padding: 20rpx 0;
      font-size: 30rpx;
      color: #007aff;
      cursor: pointer;
      border-bottom: 1px solid #f0f0f0;
      margin-bottom: 20rpx;
    }

    .phone-row {
      padding: 20rpx 0;
      border-bottom: 1px solid #f0f0f0;
      margin-bottom: 20rpx;

      .label {
        font-size: 30rpx;
        font-weight: bold;
        margin-bottom: 15rpx;
        color: #333;
      }

      .error-tip {
        font-size: 24rpx;
        color: #ff4757;
        margin-top: 10rpx;
        padding-left: 10rpx;
      }
    }

    .picarr {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 3px;
      margin-bottom: 30rpx;

      .box {
        width: 240rpx;
        aspect-ratio: 13 / 16;
        border: 1px solid #ddd;
        border-radius: 8rpx;
        overflow: hidden;

        &.add {
          @include flex-box-set();
          cursor: pointer;
          background-color: #f8f8f8;

          &:hover {
            background-color: #f0f0f0;
          }
        }

        &.pic {
          position: relative;

          .img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .mask {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            background: rgba(0, 0, 0, 0.6);
            height: 60rpx;

            .icon {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              cursor: pointer;

              &:hover {
                background-color: rgba(255, 255, 255, 0.2);
              }
            }
          }
        }
      }
    }

    textarea {
      width: 100%;
      min-height: 400rpx;
      padding: 20rpx;
      border: 1px solid #ddd;
      border-radius: 8rpx;
      font-size: 30rpx;
      line-height: 1.5;
      resize: vertical;
      margin-bottom: 30rpx;

      &:focus {
        border-color: #007aff;
        outline: none;
      }
    }

    .tijiao {
      padding-top: 50rpx;
      width: 100%;

      button {
        width: 100%;
        height: 88rpx;
        font-size: 32rpx;
        border-radius: 8rpx;
      }
    }
  }
}

/* 全局字体样式 */
.font-30 {
  font-size: 30rpx;
}

/* Flex 布局混合器 */
@mixin flex-box-set($direction: row, $justify: center, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}

/* 文本省略混合器 */
@mixin text-ellipsis($lines: 1) {
  @if $lines == 1 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  } @else {
    display: -webkit-box;
    -webkit-line-clamp: $lines;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
