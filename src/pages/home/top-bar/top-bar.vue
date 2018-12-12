<template>
  <div class="top-bar">
    <section class="userInfo-wrapper">
      <div class="avatar-wrapper">
        <img :src="defaultAvatar" alt="" width="40" height="40">
      </div>
      <p class="name">码器齐全</p>
      <div class="log-out"></div>
    </section>
    <section class="title-wrapper">
      <span v-for="(item, index) in currentTitles" :key="index" :class="{'active': index === currentTitles.length -1}"> {{item}} <span v-if="index !== currentTitles.length -1"> / </span></span>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import {globalComputed} from '@state/helpers'

  const COMPONENT_NAME = 'TOP_BAR'
  const DEFAULT_AVATAR = `https://zhidian-img.jkweixin.com/2018%2F11%2F23%2F1542945169074-logo.jpg`

  export default {
    name: COMPONENT_NAME,
    data() {
      return {
        showLogout: false,
        userInfo: this.$storage.get('info', {}),
        defaultAvatar: DEFAULT_AVATAR
      }
    },
    computed: {
      ...globalComputed
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  $common-height = 80px
  $width-triangle = 4px
  $menu-width = 200px

  .top-bar

    z-index: 1000
    box-shadow: 0 1px 5px 0 rgba(0,8,39,0.06)
    background: #fff
    .userInfo-wrapper
      layout(row)
      align-items: center
      justify-content: flex-end
      height: $common-height
      padding-right: 12px
      border-bottom: 1px solid $color-line
      .name
        margin-left: 10px
        font-size: $font-size-16
        color: $color-text-sub
      .log-out
        cursor: pointer
        width: 44px
        height: 44px
        margin-left: 8px
        bg-image('./icon-quit')
        background-repeat: no-repeat
        background-size: 20px 20px
        background-position: center
        &:hover
          animation: rotate .75s linear infinite
    .title-wrapper
      height: 60px
      padding-left: 16px
      line-height: 60px
      color: $color-text-sub
      .active
        color: $color-text-main

  @keyframes rotate
    0%
      transform: translateX(0)
    25%
      transform: translateX(5px)
    50%
      transform: translateX(-5px)
    75%
      ransform: translateX(5px)
    100%
      transform: translateX(0)
</style>
