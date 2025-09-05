<!--分类页面 console.log() plus-filled  -->
<template>
  <view class="self">
    <view class="add" @click="addclick"><uni-icons type="plus-filled " size="40"></uni-icons>
      添加</view>

    <view class="content">
      <view class="item" v-for="item in list1" :key="item._id">
        <view class="">
          {{item.sort}} {{item.title}} ￥{{ item.price }}
        </view>

        <view class="info">
          <view @click="updataff(item.title,item._id)"><uni-icons type="compose" size="30"></uni-icons>
          </view>
          <view @click.stop="removeff(item._id)"><uni-icons type="trash" size="30"></uni-icons>
          </view>
        </view>
      </view>
    </view>
    <uni-popup ref="navPopup" type="top">
      <view class="ppcss">
        <view class="row">
          <text class="label">排序号</text>
          <input border="surround" maxlength="20" clearable type="text" v-model="dsobj.sort"></input>
        </view>
        <view class="row-add">
          <text class="label">上门描述</text>
          <input v-model="dsobj.title" class="textarea" type="text"
       >
<view class="row">
          <text class="label">价格</text>
          <input border="surround" maxlength="20" clearable type="text" v-model.number="dsobj.price"></input>
        </view>
          </view>
        
        <view class="tijiao"><button type="primary" @click="nameConfirm">提交</button></view>

      </view>

    </uni-popup>

  </view>
</template>

<script setup>
const db = uniCloud.database();

  const mmbjydx = uniCloud.importObject("goods-backend", {
      customUI: true
    }) 
  const navPopup = ref(null)
  const dsobj = ref({
    title: "",
    detail_id: "", //分类id
    sort: null,
    price: null
  })

  const list1 = ref([]);
  let updatid  //判断是否修改
  const fenleiid = ref([]);

    onLoad(async (e) => {
  console.log(e)
        dsobj.value.detail_id = e.idd
    getnav()
    })
  // 提交事件
  const nameConfirm = async () => {
    let res, errCode
    dsobj.value.sort = Number(dsobj.value.sort)
    if (updatid) {
      let res = await db.collection('detail_price').doc(updatid).update({
        title: dsobj.value.title,
        sort: dsobj.value.sort,
         detail_id: dsobj.value.detail_id,
        price: dsobj.value.price
      })
      errCode = res.result.errCode
    } else {
      let res = await db.collection('detail_price').add({
        title: dsobj.value.title,
        sort: dsobj.value.sort,
         detail_id: dsobj.value.detail_id,
        price: dsobj.value.price
      })
      errCode = res.result.errCode
    }
    if (errCode != 0) return
    dsobj.value.title = ''
    updatid = null
    navPopup.value.close()
    getnav();
  }
  // 获取表格数据
  const getnav = async () => {
    let  {data}= await  mmbjydx.getmmbj(dsobj.value.detail_id)
    console.log(data);
    list1.value = data
  }

  //   新增弹窗

  const addclick = () => {
    navPopup.value.open();
  }
  //  修改分类
  const updataff = (title, id) => {
    navPopup.value.open();
    dsobj.value.title = title
    updatid = id

  }

  // 删除
  const removeff = async (id) => {
    let res = await uni.showModal({
      title: '是否删除'
    });
    if (res.confirm) {
      let res = await db.collection('detail_price').doc(id).remove()
      getnav()
    }
  }
  
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