<template>
  <div class="top-bar">
    <div class="userInfo-content">
      <section class="title-wrapper">
        <span v-for="(item, index) in currentTitles" :key="index" :class="{'active': index === currentTitles.length -1}" class="title-wrapper-item"> {{item}} <span v-if="index !== currentTitles.length -1" class="title-line"> / </span></span>
      </section>
      <section class="userInfo-wrapper">
        <p class="name">你好: {{currentUser && currentUser.manager_info.username}}</p>
        <div class="log-out" @click="tryToLogOut"></div>
      </section>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {globalComputed, authComputed, authMethods} from '@state/helpers'

  const COMPONENT_NAME = 'TOP_BAR'
  const DEFAULT_AVATAR = `https://zhidian-img.jkweixin.com/2018%2F11%2F23%2F1542945169074-logo.jpg`

  export default {
    name: COMPONENT_NAME,
    data() {
      return {
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
      tryToLogOut() {
        this.logOut()
        // this.$router.replace({name: 'login', query: {redirectFrom: this.$route.fullPath}})
        this.$router.replace({name: 'login'})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  $common-height = 40px
  $width-triangle = 4px
  $menu-width = 200px

  .top-bar
    z-index: 600
    background: #fff
    position: fixed
    top: 0
    left: 210px
    right: 0
    border-bottom-1px($color-line)
    .userInfo-content
      layout(row)
      align-items: center
      height: $common-height
      padding: 0 20px
      justify-content: space-between
    .userInfo-wrapper
      display: flex
      align-items: center
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
