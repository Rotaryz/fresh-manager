<template>
  <div class="login">
    <div class="header-wrapper"></div>
    <div class="login-wrapper">
      <header class="title">登录/Login</header>
      <div class="input-wrapper">
        <input v-model="username" type="text" :placeholder="placeHolders.username" @keyup.enter="tryToLogIn">
      </div>
      <div class="input-wrapper">
        <input v-model="password" type="password" :placeholder="placeHolders.password" @keyup.enter="tryToLogIn">
      </div>
      <button class="login-btn hand" @click="tryToLogIn">登录</button>
      <div class="forget-pw">
        <span class="hand" @click="_modifyPassword">忘记密码？</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {authMethods} from '@state/helpers'
  import API from '@api'
  import storage from 'storage-controller'

  const PAGE_NAME = 'LOGIN'
  const TITLE = '登录'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        username: '',
        password: '',
        tryingToLogIn: false,
        trySocial: false,
        tryScm: false,
        menuList: [],
        permissionsList: {}
      }
    },
    computed: {
      placeHolders() {
        return {
          username: '请输入账号',
          password: '请输入密码'
        }
      }
    },
    methods: {
      ...authMethods,
      tryToLogIn() {
        if (this.tryingToLogIn) {
          return
        }
        this.tryingToLogIn = true
        this.logIn({
          username: this.username,
          password: this.password
        })
          .then((user) => {
            if (!user) {
              return
            }
            this.getSocialData()
            this.getScmData()
          })
          .catch((error) => {
            this.$toast.show(error)
          })
          .finally(() => {
            this.tryingToLogIn = false
          })
      },
      // 请求商城权限
      getSocialData() {
        API.Account.getSocialMenu().then((res) => {
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return
          }
          this.trySocial = true
          this.menuList = this.menuList.concat(res.data.admin_menu)
          this.permissionsList = Object.assign(this.permissionsList, res.data.permissions)
          this.judgeRequest()
        })
      },
      // 请求供应链权限
      getScmData() {
        API.Account.getScmMenu().then((res) => {
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return
          }
          this.tryScm = true
          this.menuList = this.menuList.concat(res.data.admin_menu)
          this.permissionsList = Object.assign(this.permissionsList, res.data.permissions)
          this.judgeRequest()
        })
      },
      judgeRequest() {
        if (this.trySocial && this.tryScm) {
          this.menuList = this.menuList.sort((a, b) => {
            return a.sort - b.sort
          })
          // console.log(this.menuList)
          storage.set('menu', this.menuList)
          storage.set('permissions', this.permissionsList)
          this.$router.push(this.menuList[0].sub_menu[0].sub_menu[0].front_url || 'home')
        }
      },
      _modifyPassword() {
        this.$router.push(`/modify-password`)
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
        border-radius: 2px
        background: $color-white

        input
          padding: 0 14px
          width: 100%
          height: 100%
          font-size: $font-size-14

      button.login-btn
        width: 360px
        height: 43px
        margin-top: 16px
        border-radius: 2px
        line-height: 43px
        font-size: $font-size-14
        color: $color-white
        background: $color-positive
  .forget-pw
    width: 100%
    margin-top: 24px
    text-align: center
    color: $color-white
    font-size: $font-size-14
    font-family: $font-family-regular
    span
      text-decoration: underline
</style>
