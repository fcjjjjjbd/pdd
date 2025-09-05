<!-- h5登录 -->
<template>
  <view class="">
    <button @click="login">一键登录{{name}}</button>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        name: "演员"
      }
    },
    methods: {
      login() {
        //在这里写一键登录的代码
        uni.preLogin({
          provider: 'univerify',
          success() { //预登录成功
            // 显示一键登录选项
            uni.login({
              provider: 'univerify',
              univerifyStyle: {
                // 自定义登录框样式
                //参考`univerifyStyle 数据结构`
                //具体样式设计请去uni-app文档查看
                //不填写任何自定义登录框样式的话就会采取默认样式
              },
              success(res) { // 登录成功
                console.log(res.authResult.access_token);
                console.log(res.authResult.openid);
                // 此处获取了openid和access_token
                // {openid:'登录授权唯一标识',access_token:'接口返回的 token'}
                // 通过uniCloud.callFunction函数实现前端获取手机号
                uniCloud.callFunction({
                    name: "testLogin", // 填写你自己的云函数名称
                    //传入上面获取的openid和access_token获取手机号
                    data: {
                      access_token: res.authResult.access_token, // 客户端一键登录接口返回的access_token
                      openid: res.authResult.openid // 客户端一键登录接口返回的openid
                    }
                  })
                  .then((dataRes) => {
                    //此处已经成功获取手机号等信息
                    console.log("云函数返回的参数", dataRes)
                    let phone = dataRes.result.data.phoneNumber
                    // 获取手机号后根据自己的需求做后面的登录操作即可
                    //...
                  })
                  .catch((err) => {
                    console.log(err);
                    console.log("云函数报错", err)
                    uni.showToast({
                      title: err.errMsg,
                      icon: "none"
                    })
                    this_ = this
                    setTimeout(() => {
                      uni.closeAuthView() //关闭一键登录弹出窗口
                      this_.onClickMsgLogin()
                    }, 500)
                  })
              },
              fail(res) { // 登录失败
                console.log(res.errCode)
                console.log(res.errMsg)
              }
            })
          },
          fail(res) {
            // 预登录失败
            // 不显示一键登录选项（或置灰）
            // 根据错误信息判断失败原因，如有需要可将错误提交给统计服务器
            console.log(res.errCode)
            console.log(res.errMsg)
          }
        })

      }
    }
  }
</script>

<style>
</style>