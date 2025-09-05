<template>
  <view class="example">
    <view class="page-editor-container">
      <view class="top">
        <view @click="mypp" class="my-publish-btn">我发布的</view>
        <view>
          <button
            class="mini-btn"
            type="warn"
            size="mini"
            :disabled="!artobj.title.length"
            @click="onSubmit"
          >
            提交
          </button>
        </view>
      </view>
      <view class="title">
        <input
          type="text"
          v-model="artobj.title"
          placeholder="请输入完整的标题"
          placeholder-class="placeholderClass"
        />
      </view>
      <sv-editor
        pasteMode="origin"
        @ready="ready"
        @input="input"
        @overmax="overMax"
        @epaste="epaste"
      ></sv-editor>
    </view>
    <view class="page-editor-toolbar-container">
      <sv-editor-toolbar
        ref="toolbarRef"
        :style-tools="[
          'header',
          'divider',
          'bold',
          'italic',
          'underline',
          'strike',
          'align',
          'color',
          'backgroundColor',
          'removeformat',
        ]"
        @changeTool="changeTool"
        @toolMoreItem="onToolMoreItem"
        @moreItemConfirm="moreItemConfirm"
      >
        <template #at>
          <view class="panel-at">
            <view
              v-for="item in atList"
              :key="item.id"
              class="panel-at-item"
              @click="onAt(item)"
            >
              {{ item.name }}
            </view>
          </view>
        </template>
        <template #topic>
          <view class="panel-topic">
            <view
              v-for="item in topicList"
              :key="item.id"
              class="panel-topic-item"
              @click="onTopic(item)"
            >
              {{ item.name }}
            </view>
          </view>
        </template>
        <template #setting>
          <button size="mini" @click="onExport">导出</button>
        </template>
      </sv-editor-toolbar>
    </view>
  </view>
  <!-- 我发布的 -->
  <uni-popup ref="edipp" type="top">
    <view class="content">
      <view class="item" v-for="item in list1" :key="item._id">
        <view class=""> {{ item.title }} </view>

        <view class="info">
          <view @click="updataff(item)"
            ><uni-icons type="compose" size="30"></uni-icons>
          </view>
          <view @click.stop="removeff(item._id)"
            ><uni-icons type="trash" size="30"></uni-icons>
          </view>
        </view>
      </view>
    </view>
  </uni-popup>
</template>

<script setup>
const db = uniCloud.database(); // 连接云对象整体
const listobj = uniCloud.importObject("goods_item", {
  customUI: true,
});
import { showToast } from "../../utils/common.js";
import SvEditorToolbar from "@/uni_modules/sv-editor/components/sv-editor/sv-editor-toolbar.vue";
import {
  addAt,
  addTopic,
  addAttachment,
  addImage,
  addLink,
  addVideo,
} from "@/uni_modules/sv-editor/components/common/utils.js";
const edipp = ref(null);

const list1 = ref(null);

const atList = ref([
  {
    name: "马什么梅",
    id: 1,
  },
  {
    name: "什么冬梅",
    id: 2,
  },
  {
    name: "马冬什么",
    id: 3,
  },
]);
const topicList = ref([
  {
    name: "今日资讯",
    id: "news",
  },
  {
    name: "热搜",
    id: "hot",
  },
  {
    name: "开心一下",
    id: "happy",
  },
]);
const artobj = ref({
  title: "",
  content: "",
});

const toolbarRef = ref(null);
const editorCtx = ref(null);
let id;
const ready = (e) => {
  console.log("==== ready ==== :", e);
  editorCtx.value = e;
  editorCtx.value.initHtml(
    `
    <p style="text-align: center;">
    
    </p>`,
    async (videoUrl) => {
      let res;
      // #ifdef APP || H5
      // res = await editorCtx.value.createVideoThumbnail(videoUrl)
      // #endif
      const fox =
        "https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg";
      res = await editorCtx.value.createCoverThumbnail(fox);
      return res;
    }
  );
};
// 修改
const updataff = async (e) => {
  id = e._id;
  console.log(e);
  editorCtx.value.setHtml(e.content);
  edipp.value.close();
};

// 删除
const removeff = async (id) => {
  let res = await uni.showModal({
    title: "是否删除",
  });
  if (res.confirm) {
    let res = await db.collection("afenlei").doc(id).remove();
    getnav();
  }
};
// 我的列表
const getlist = async () => {
  list1.value = await listobj.mylist();
};
getlist();
// 提交云端
const onSubmit = async () => {
  console.log(artobj.value);
  try {
    uni.showLoading({
      title: "提交中",
    });
    if (artobj.value.content === "")
      return showToast("鸡汤内容不能为空", "none", false);
    let errCode, res;
    // let {soup_type,status,content,from,feedback} = formData.value;
    // let _formData = {soup_type,status,content,from,feedback};
    if (id) {
      if (!isAdminRole()) _formData.status = 0;
      if (isAdminRole()) _formData.review_uid = userStore.userInfo._id;
      res = await db.collection("goods_detail").doc(id).update(_formData);
    } else {
      res = await db.collection("goods_detail").add(artobj.value);
    }
    console.log(res);
    errCode = res.result.errCode;

    if (errCode === 0) {
      showToast("发表成功", "success");
      setTimeout(() => uni.navigateBack(), 1000);
    }
  } catch (e) {
    console.log(e);
    showToast(e.errMsg, "error");
  } finally {
    uni.hideLoading();
  }
};

// 打开弹窗
const mypp = () => {
  edipp.value.open();
};
// 关闭弹窗
const close = () => {};
const input = (e) => {
  console.log("input ==>", e);
  artobj.value.content = e.html;
};
const epaste = (e) => {
  console.log("epaste ==>", e);
};
const overMax = (e) => {
  console.log("overMax ==>", e);
};
const changeTool = (e) => {
  console.log("changeTool ==>", e);
};
const onToolMoreItem = (e) => {
  console.log("onToolMoreItem ==>", e);
  if (e.name == "clear") {
    uni.showModal({
      title: "提示",
      content: "确定要清空内容吗？",
      success: ({ confirm }) => {
        if (confirm) {
          editorCtx.value.clear();
        }
      },
    });
  }
};
const moreItemConfirm = async (e) => {
  console.log("moreItemConfirm ==>", e);
  // 添加图片
  if (e.name == "image") {
    if (!e.file || !e.file.length) {
      uni.showToast({
        title: "请选择图片",
        icon: "none",
      });
      return;
    }
    uni.showLoading({
      title: "上传中",
    });
    try {
      for (let item of e.file) {
        let filePath = "";
        // #ifdef H5
        if (item instanceof File) {
          // H5 端 File 对象，需转成本地 url
          filePath = URL.createObjectURL(item);
        } else if (item.path) {
          filePath = item.path;
        }
        // #endif
        // #ifndef H5
        filePath = item.path;
        // #endif

        if (!filePath) {
          console.error("filePath 获取失败", item);
          continue;
        }

        let suffix = filePath.substring(filePath.lastIndexOf("."));
        let randomName =
          Date.now() + "" + String(Math.random()).substr(3, 6) + suffix;

        // 上传到云存储
        let uploadRes = await uniCloud.uploadFile({
          filePath: filePath,
          cloudPath: item.name || randomName,
        });
        console.log("上传结果", uploadRes);

        if (uploadRes && uploadRes.fileID) {
          // 插入图片到编辑器
          editorCtx.value.insertImage({
            src: uploadRes.fileID,
          });
        } else {
          console.error("上传失败", uploadRes);
        }
      }
      uni.showToast({
        title: "添加图片成功",
        icon: "success",
      });
    } catch (err) {
      console.error("图片上传失败", err);
      uni.showToast({
        title: "添加图片失败",
        icon: "error",
      });
    } finally {
      uni.hideLoading();
    }
    toolbarRef.value?.closeMorePop();
    return;
  }
  // 添加视频
  if (e.name == "video") {
    const videoRes = await addVideo(
      async (editorCtxArg) => {
        return new Promise((resolve) => {
          uni.showLoading({
            title: "上传中",
          });
          setTimeout(async () => {
            uni.hideLoading();
            let videos = [];
            if (e.link) {
              const linkThumbnail = await editorCtx.value.createVideoThumbnail(
                e.link
              );
              videos.push({
                imagePath: linkThumbnail,
                tempFilePath: e.link,
              });
            }
            if (e.file?.tempFilePath) {
              const fileThumbnail = await editorCtx.value.createVideoThumbnail(
                e.file.tempFilePath
              );
              e.file.imagePath = fileThumbnail;
              videos.push(e.file);
            }
            resolve(videos);
          }, 3000);
        });
      },
      {
        imageFiled: "imagePath",
        videoFiled: "tempFilePath",
        width: "100%",
      }
    );
    if (videoRes) {
      uni.showToast({
        title: "添加视频成功",
        icon: "success",
      });
    } else {
      uni.showToast({
        title: "添加视频失败",
        icon: "error",
      });
    }
  }
  // 添加链接
  if (e.name == "link") {
    addLink(
      {
        link: e.link,
        text: e.text,
      },
      () => {
        uni.showToast({
          title: "添加链接成功",
        });
      }
    );
  }
  // 添加附件
  if (e.name == "attachment") {
    const attachmentRes = await addAttachment(async () => {
      return new Promise((resolve) => {
        uni.showLoading({
          title: "上传中",
        });
        setTimeout(() => {
          uni.hideLoading();
          let attachmentObj = e;
          if (e.file?.path) {
            attachmentObj.path = e.file.path;
          } else if (e.link) {
            attachmentObj.path = e.link;
          }
          resolve(attachmentObj);
        }, 3000);
      });
    });
    if (attachmentRes) {
      uni.showToast({
        title: "添加附件成功",
        icon: "success",
      });
    } else {
      uni.showToast({
        title: "添加附件失败",
        icon: "error",
      });
    }
  }
  // 关闭弹窗
  toolbarRef.value?.closeMorePop();
};
const onAt = (e) => {
  addAt(
    {
      username: e.name,
      userid: e.id,
    },
    () => {
      uni.showToast({
        title: "艾特成功",
      });
    }
  );
  toolbarRef.value?.closeMorePop();
};
const onTopic = (e) => {
  addTopic(
    {
      topic: e.name,
      link: e.id,
    },
    () => {
      uni.showToast({
        title: "添加话题成功",
      });
    }
  );
  toolbarRef.value?.closeMorePop();
};
const onExport = async () => {
  const contentRes = await editorCtx.value.getLastContent();
  const htmlHandler = editorCtx.value.exportHtml(contentRes.html);
  uni.navigateTo({
    url: "/pages/out/out",
    success: (res) => {
      res.eventChannel.emit("E_HTML_EXPORT", {
        data: htmlHandler,
      });
    },
  });
};
// 向外暴露
defineExpose({
  open,
  close,
});
</script>

<style lang="scss">
.example {
  box-sizing: border-box;
  height: calc(100vh - var(--window-top) - env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  background: #fff;

  .page-editor-container {
    flex: 1;
    overflow-y: auto;
    border: 10px solid #66ccff;
    box-sizing: border-box;

    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
    }
  }

  .page-editor-toolbar-container {
    position: sticky;
    bottom: 0;
    width: 100%;

    :deep(.sv-editor-toolbar) {
    }
  }
}

.panel-at,
.panel-topic {
  display: flex;
  flex-direction: column;

  .panel-at-item,
  .panel-topic-item {
    padding: 10px;
    margin: 10px 0;
    box-sizing: border-box;
    border-radius: 20rpx;
    box-shadow: 0 0 8px 6px rgba(0, 0, 0, 0.08);
  }
}

.content {
  width: 100%;

  background-color: #fff;

  border-radius: 8rpx;

  .item {
    @include flex-box();
    letter-spacing: 4rpx;
    font-size: 34rpx;
    font-weight: bold;
    border-bottom: 1rpx solid $text-font-color-3;
    padding-bottom: 28rpx;

    .info {
      display: flex;
    }
  }
}

.my-publish-btn {
  margin: 30rpx auto;
  width: 300rpx;
  height: 70rpx;
  line-height: 70rpx;
  text-align: center;
  border: 2rpx solid #409eff;
  border-radius: 35rpx;
  color: #409eff;
  font-size: 32rpx;
  background: #fff;
  box-shadow: 0 2rpx 8rpx rgba(64, 158, 255, 0.08);
  cursor: pointer;
}
</style>
