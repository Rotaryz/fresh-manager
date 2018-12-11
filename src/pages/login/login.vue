<template>
  <div class="login">
    <div class="header-wrapper"></div>
    <div class="login-wrapper">
      <header class="title">登录/Login</header>
      <div class="input-wrapper">
        <input type="text" :placeholder="placeHolders.username">
      </div>
      <div class="input-wrapper">
        <input type="text" :placeholder="placeHolders.password">
      </div>
      <button class="login-btn">登录</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'LOGIN'

  export default {
    name: PAGE_NAME,
    data() {
      return {}
    },
    computed: {
      placeHolders() {
        return {
          username: '请输入账号',
          password: '请输入密码'
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .login
    position: absolute
    width: 100%
    height: 100%
    background: url("./pic-login_background.jpg") no-repeat
    background-size: cover
    background-position: center center
    .header-wrapper
      position: absolute
      top: 40px
      left: 100px
      width: 150px
      height: 48px
      bg-image('./pic-login_logo')
      background-size: 150px 48px
    .login-wrapper
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, -60%)
      .title
        margin-bottom: 40px
        font-size: $font-size-20
        color: $color-white
      .input-wrapper
        width: 360px
        height: 44px
        box-sizing: border-box
        margin-bottom: 24px
        padding: 0 14px
        border-radius: 4px
        background: $color-white
        input
          width: 100%
          height: 100%
          font-size: $font-size-14
      button.login-btn
        width: 360px
        height: 43px
        margin-top: 16px
        border-radius: 4px
        line-height: 43px
        font-size: $font-size-14
        color: $color-white
        background: $color-positive
</style>
