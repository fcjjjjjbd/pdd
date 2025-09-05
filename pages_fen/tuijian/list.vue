<template>
  <view class="self">
    <z-paging
      ref="paging"
      v-model="dataList"
      @query="queryList"
      :default-page-size="13"
    >
      <view class="title"> 希望多推荐商家,我们会联系商家入驻平台的 </view>
      <view class="scrollNav">
        <scroll-view scroll-x>
          <view class="item">
            <view class="pic">
              <uni-icons type="cart" size="60"></uni-icons>
            </view>
            <view class="text"> 排行 </view>
          </view>
        </scroll-view>
      </view>
      我发布的
      <view class="content">
        <view class="item" v-for="(item, index) in myarr" :key="item._id">
          {{ item.user_id[0].nickname }}-{{ item.job }}-{{ item.phone }}

          <view class="info">
            <view class="status">
              {{ item.status }}
            </view>
            <view class="status" @click="removeid(item._id, index)">删除 </view>
          </view>
        </view>
      </view>

      <view class="content">
        <view class="item" v-for="row in dataList">
          {{ row.user_id[0].nickname }}--{{ row.job }}
          <view class="info">
            <view class="status" @click="adminsh(row._id)" v-if="booladmin"
              >修改
            </view>
          </view>
        </view>
      </view>
      <formzj ref="formzjref"></formzj>
      <view class="bottom">
        <view class="btn" @click="addsj">上传</view>
      </view>
    </z-paging>
    <uni-popup ref="genderPopup" type="dialog">
      <uni-popup-dialog @confirm="genderConfirm" title="修改审核" mode="input">
        <view class="genderForm">
          <radio-group @change="genderChange">
            <label class="radio" v-for="item in stateLists" :key="item.value">
              <view>
                <radio
                  :value="item.value"
                  :checked="genderValue == item.value"
                  style="transform: scale(0.7)"
                />
                {{ item.text }}
              </view>
            </label>
          </radio-group>
        </view>
      </uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script setup>
import formzj from "./chilren/formzj.vue";
const tjcloubobj = uniCloud.importObject("admin-tuijian");
import { isAdminRole, stateLists } from "../../utils/common";
const db = uniCloud.database();
const paging = ref(null);
const formzjref = ref(null);
const dataList = ref([]); //全部数据
const myarr = ref([]); //我的数据
const booladmin = computed(() => isAdminRole());
const genderPopup = ref(null);
const genderValue = ref(0); // 审核弹窗选项默认值
const updateid = ref(""); // 修改审核方法的id

// 请求数组
const queryList = async (pageNo, pageSize) => {
  getgoodsList(pageNo, pageSize);
};
const getgoodsList = async (pageNo, pageSize) => {
  let skip = (pageNo - 1) * pageSize;
};

// 我发布的
const mydataff = async () => {
  let { errCode, errMsg, data } = await tjcloubobj.mytjff();
  console.log(data);
  myarr.value = data;
};
mydataff();
// 添加商家addsj
const addsj = () => {
  formzjref.value.openpp();
};
// 删除
const removeid = async (id, index) => {
  let res = await uni.showModal({
    title: "是否删除",
  });
  if (res.confirm) {
    let res = await db.collection("user-tuijian").doc(id).remove();
    myarr.value.splice(index, 1);
  }
};
// 审核
const adminsh = async (id) => {
  updateid.value = id;
  genderPopup.value.open();
};
//  修改审核弹窗确认事件
const genderConfirm = async (e) => {
  genderValue.value = Number(genderValue.value);
  let res = await db
    .collection("user-tuijian")
    .where(` _id=="${updateid.value}" `)
    .update({
      status: genderValue.value,
    });

  genderPopup.value.close();
};
//  修改审核单选框Change 事件
const genderChange = (e) => {
  genderValue.value = e.detail.value;
};
</script>

<style lang="scss" scoped>
.self {
  padding: 20rpx;
  .title {
    font-size: 34rpx;
    font-weight: bold;
  }

  .scrollNav {
    padding: 30rpx;

    scroll-view {
      white-space: nowrap;

      .item {
        display: inline-block;
        padding: 0 30rpx;
        text-align: center;

        .pic {
          width: 105rpx;
          height: 105rpx;
        }

        .text {
          font-size: 32rpx;
          color: var(--globalColor);
          padding-top: 10rpx;
        }
      }

      .item:first-child {
        padding-left: 0;
      }

      .item:last-child {
        padding-right: 0;
      }
    }
  }

  .content {
    width: 100%;

    background-color: #fff;
    padding: 20rpx;
    border-radius: 8rpx;

    .item {
      letter-spacing: 4rpx;
      font-size: 34rpx;
      font-weight: bold;
      padding-bottom: 28rpx;

      .info {
        display: flex;

        .status {
          width: fit-content;
          margin-right: 30rpx;
          border: 1px solid black;
          padding: 5rpx;
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
}
</style>
