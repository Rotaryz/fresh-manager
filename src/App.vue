<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import appConfig from '@utils/app-config'

  export default {
    page: {
      titleTemplate(title) {
        title = typeof title === 'function' ? title(this.$store) : title
        return title ? `${title} | ${appConfig.title}` : appConfig.title
      }
    },
    created() {
    // console.log(this.$route)
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "./design/_globals.styl"
  @import "~nprogress/nprogress.css"
  #app
    &::-webkit-scrollbar
      width: 8px
      height: 10px

    &::-webkit-scrollbar-thumb
      background-color: rgba(0, 0, 0, .15)
      border-radius: 10px

    &::-webkit-scrollbar-thumb:hover
      background-color: rgba(0, 0, 0, .3)

    &::-webkit-scrollbar-track
      box-shadow: inset 0 0 6px rgba(0, 0, 0, .15)
      border-radius: 10px

  #nprogress .bar
    background: $color-main !important

  #nprogress .peg
    box-shadow: 0 0 10px $color-main, 0 0 5px $color-main !important
</style>
