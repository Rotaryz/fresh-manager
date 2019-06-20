<template>
  <div class="top-bar">
    <div class="userInfo-content">
      <section class="title-wrapper">
        <span v-for="(item, index) in currentTitles" :key="index" :class="{'active': index === currentTitles.length -1}" class="title-wrapper-item"> {{item}} <span v-if="index !== currentTitles.length -1" class="title-line"> / </span></span>
      </section>
      <section class="userInfo-wrapper" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false">
        <p class="name">你好: {{currentUser && currentUser.manager_info.username}}</p>
        <div class="log-out"></div>
        <transition name="fade">
          <div v-show="showTooltip" class="tooltip-con">
            <div class="show-hide-box">
              <div class="show-all-item hand">
                <div class="show-hide-item" @click="_modifyPassword">
                  修改密码
                </div>
                <div class="show-hide-item" @click="_confirmLogOut">
                  退出登录
                </div>
              </div>
            </div>
          </div>
        </transition>
      </section>
    </div>
    <default-confirm ref="confirm" @confirm="_logOut"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import {globalComputed, authComputed, authMethods} from '@state/helpers'
  import DefaultConfirm from '@components/default-confirm/default-confirm'

  const COMPONENT_NAME = 'TOP_BAR'
  const DEFAULT_AVATAR = `https://zhidian-img.jkweixin.com/2018%2F11%2F23%2F1542945169074-logo.jpg`

  export default {
    name: COMPONENT_NAME,
    components: {
      DefaultConfirm
    },
    data() {
      return {
        showTooltip: false,
        showLogout: false,
        defaultAvatar: DEFAULT_AVATAR
      }
    },
    computed: {
      ...globalComputed,
      ...authComputed
    },
    methods: {
      ...authMethods,
      _modifyPassword() {
        this.$router.push(`/modify-password`)
      },
      _confirmLogOut() {
        this.$refs.confirm.show('确定退出当前系统吗？')
      },
      _logOut() {
        this.logOut()
        // this.$router.replace({name: 'login', query: {redirectFrom: this.$route.fullPath}})
        this.$router.replace({name: 'login'})
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  $common-height = 40px
  $width-triangle = 4px
  $menu-width = 200px

  .top-bar
    background: #fff
    position: fixed
    top: 0
    left: 210px
    right: 0
    z-index: 999
    .userInfo-content
      layout(row)
      align-items: center
      height: $common-height
      padding: 0 20px
      justify-content: space-between
    .userInfo-wrapper
      display: flex
      align-items: center
      position: relative
      height: 40px
      .name
        margin-left: 10px
        font-size: $font-size-14
        color: $color-text-main
      .log-out
        cursor: pointer
        width: 10px
        height: 10px
        margin-left: 8px
        icon-image('./icon-sign_out')
        &:hover
          animation: rotate .75s linear infinite
    .title-wrapper
      color: $color-text-main
      line-height: 12px
      .active
        color: $color-main
    .title-wrapper-item
      font-size: $font-size-12
      line-height: 1
      .title-line
        transform: translateY(2px)
        display: inline-block
        margin: 0 8px
        line-height: 1
        color: #E6EAED

  .tooltip-con
    position: absolute
    width: 106px
    height: 50px
    top: 0
    right: 0
    z-index: 999
  .show-hide-box
    position: absolute
    width: 106px
    top: 50px
    color: $color-text-main
    font-family: $font-family-regular
    font-size: $font-size-14
    background: $color-white
    box-shadow: 0 0 8px 0 #EBEBEB
    border-radius: 4px
    .show-all-item
      position: relative
      &:after
        content: ''
        position: absolute
        z-index: 99
        top: -6px
        right: 16px
        width: 0
        height: 0
        border-left: 5px solid transparent
        border-right: 5px solid transparent
        border-bottom: 6px solid $color-white
      &:before
        content: ''
        position: absolute
        z-index: 99
        top: -8px
        right: 15px
        width: 0
        height: 0
        border-left: 6px solid transparent
        border-right: 6px solid transparent
        border-bottom: 8px solid #EBEBEB
      .show-hide-item
        height: 50px
        line-height: 50px
        color: $color-text-main
        font-family: $font-family-regular
        font-size: $font-size-14
        padding-left: 16px
        display: block
        position: relative
        border-bottom-1px($color-line)
        &:hover
          color: $color-main

  @keyframes rotate
    0%
      transform: translateX(0)
    25%
      transform: translateX(3px)
    50%
      transform: translateX(-3px)
    75%
      ransform: translateX(3px)
    100%
      transform: translateX(0)
</style>
