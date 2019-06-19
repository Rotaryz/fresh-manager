<template>
  <div class="login">
    <div class="header-wrapper"></div>
    <div class="login-wrapper">
      <header class="title">修改密码/Change Password</header>
      <div class="input-wrapper">
        <input v-model="formParams.username" type="text" :placeholder="placeHolders.username" @keyup.enter="_modifyPassword">
      </div>
      <div class="input-wrapper">
        <input v-model="formParams.verifyCode" type="text" :placeholder="placeHolders.verifyCode" @keyup.enter="_modifyPassword">
        <button v-if="codeGetting" class="code-btn hand" @click="_getVerifyCode">{{countdown}}</button>
        <button v-else class="code-btn hand" @click="_getVerifyCode">{{getCodeText}}</button>
      </div>
      <div class="input-wrapper">
        <input v-model="formParams.password" type="password" :placeholder="placeHolders.password" @keyup.enter="_modifyPassword">
      </div>
      <button class="login-btn hand" @click="_modifyPassword">确认修改</button>
      <div class="back-con">
        <span class="hand" @click="goBack">返回</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {authMethods} from '@state/helpers'
  import API from '@api'

  const PAGE_NAME = 'MODIFY_PASSWORD'
  const TITLE = '修改密码'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        formParams: {
          username: '',
          verifyCode: '',
          password: ''
        },
        getCodeText: '获取短信验证码',
        countdown: 30,
        codeGetting: false,
        tryingToLogIn: false,
      }
    },
    computed: {
      placeHolders() {
        return {
          username: '请输入用户账号',
          verifyCode: '请输入验证码',
          password: '请输入6~18位登录密码'
        }
      }
    },
    methods: {
      ...authMethods,
      _getVerifyCode() {
        if (this.formParams.username === '') {
          this.$toast.show(this.placeHolders.username)
          return
        }
        this.codeGetting = true
        API.Auth.getVerifyCode({mobile: this.formParams.username})
          .then((res) => {
            this.$toast.show(res.message)
            if (res.error !== this.$ERR_OK) {
              this.codeGetting = false
              return
            }
            this.countdown = 30
            this._setCountdown()
          })
          .catch((error) => {
            this.codeGetting = false
            this.$toast.show(error)
          })
      },
      _setCountdown() {
        let that = this
        let cdTimer = setInterval(function () {
          if(that.countdown>0) {
            that.countdown--
          } else {
            that.getCodeText = '再次获取验证码'
            that.codeGetting = false
            clearInterval(cdTimer)
          }
        },1000)
      },
      _modifyPassword() {
        if (this.tryingToLogIn || !this.checkForm()) {
          return
        }
        this.tryingToLogIn = true
        API.Auth.modifyPassword({
          username: this.formParams.username,
          password: this.formParams.password,
          auth_code: this.formParams.verifyCode
        })
          .then((res) => {
            if (res.error !== this.$ERR_OK) {
              this.tryingToLogIn = false
              this.$toast.show(res.message)
              return
            }
            this.$toast.show('修改密码成功！')
            this.logOut()
            let that = this
            setTimeout(function () {
              that.$router.replace({name: 'login'})
            },3000)
          })
          .catch((error) => {
            this.$toast.show(error)
          })
          .finally(() => {
            this.tryingToLogIn = false
          })
      },
      checkForm() {
        for (let key in this.formParams) {
          if (this.formParams[key] === '') {
            this.$toast.show(this.placeHolders[key])
            return false
          }
        }
        return true
      },
      goBack() {
        this.$router.back()
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
        font-family: $font-family-regular

      .input-wrapper
        width: 360px
        height: 44px
        box-sizing: border-box
        margin-bottom: 24px
        layout(row)
        justify-content: space-between

        input
          padding: 0 14px
          flex: 1
          width: 100%
          height: 100%
          background: $color-white
          font-size: $font-size-14
          font-family: $font-family-regular
          border-radius: 2px
        .code-btn
          margin-left: 10px
          width: 118px
          height: 44px
          line-height: 44px
          text-align: center
          border-radius: 2px
          font-size: $font-size-14
          color: $color-positive
          background: transparent
          border-1px($color-positive)
          font-family: $font-family-regular

      button.login-btn
        width: 360px
        height: 43px
        margin-top: 16px
        border-radius: 2px
        line-height: 43px
        font-size: $font-size-14
        color: $color-white
        background: $color-positive
        font-family: $font-family-regular
    .back-con
      width: 100%
      margin-top: 24px
      text-align: center
      color: $color-white
      font-size: $font-size-14
      font-family: $font-family-regular
      span
        text-decoration: underline

</style>
