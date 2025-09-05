<!--分类页面 console.log() plus-filled  -->
<template>
  <view class="self">
    <view class="add" @click="addclick"><uni-icons type="plus-filled " size="40"></uni-icons>
      添加</view>

    <view class="content">
      <view class="item" v-for="item in list1" :key="item._id">
        <view class="">
          {{item.sort}} {{item.name}}
        </view>

        <view class="info">
          <view @click="updataff(item.name,item._id)"><uni-icons type="compose" size="30"></uni-icons>
          </view>
          <view @click.stop="removeff(item._id)"><uni-icons type="trash" size="30"></uni-icons>
          </view>
        </view>
      </view>
    </view>
    <uni-popup ref="navPopup" type="top">
      <view class="ppcss">
        <view class="row-add">
          <text class="label">标题</text>
          <textarea class="textarea" v-model="dsobj.name"></textarea>
        </view>
        <view class="row">
          <text class="label">序号</text>
          <input border="surround" maxlength="20" clearable type="text" v-model="dsobj.sort"></input>
        </view>
        <view class="tijiao"><button type="primary" @click="nameConfirm">提交</button></view>

      </view>

    </uni-popup>

  </view>
</template>

<script setup>
  const db = uniCloud.database();
  const navPopup = ref(null)
  const dsobj = ref({
    name: "",
    sort: null
  })

  const list1 = ref([]);
  let updatid
  // 提交事件
  const nameConfirm = async () => {
    let res, errCode
    dsobj.value.sort = Number(dsobj.value.sort)
    if (updatid) {
      let res = await db.collection('ahotsearch').doc(updatid).update({
        name: dsobj.value.name,
        sort: dsobj.value.sort
      })
      errCode = res.result.errCode
    } else {
      let res = await db.collection('ahotsearch').add({
        name: dsobj.value.name,
        sort: dsobj.value.sort
      })
      errCode = res.result.errCode
    }
    if (errCode != 0) return
    dsobj.value.name = ''
    updatid = null
    navPopup.value.close()
    getnav();
  }
  // 获取数据
  const getnav = async () => {
    let {
      result: {
        data
      }
    } = await db.collection('ahotsearch').orderBy("sort", "asc").get()
    list1.value = data
  }

  //   新增弹窗

  const addclick = () => {
    navPopup.value.open();
  }
  //  修改分类
  const updataff = (name, id) => {
    navPopup.value.open();
    dsobj.value.name = name
    updatid = id

  }

  // 删除
  const removeff = async (id) => {
    let res = await uni.showModal({
      title: '是否删除'
    });
    if (res.confirm) {
      let res = await db.collection('ahotsearch').doc(id).remove()
      getnav()
    }
  }
  getnav()
</script>

<style lang="scss" scoped>
  .self {
    padding: 30rpx;

    .add {
      @include flex-box-set();
      font-size: 50rpx;
      padding-bottom: 20rpx
    }

    .content {
      width: 100%;

      background-color: #fff;

      border-radius: 8rpx;

      .item {
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

    .ppcss {
      background: #fff;
      padding: 20rpx;
      border-radius: 30rpx 30rpx 0 0;
      overflow: hidden;
      font-size: 28rpx;

      .row-add {
        display: flex;
        flex-direction: column;
        padding: 20rpx 0;
        font-size: 40rpx;
        font-weight: bold;

      }

      .row {
        display: flex;
        font-size: 40rpx;
        font-weight: bold;

        .label {
          margin-right: 40rpx;
        }
      }
    }
  }
</style>