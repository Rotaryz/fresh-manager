<template>
  <div id="app">
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
  import appConfig from '@src/app.config'

  export default {
    page: {
      titleTemplate(title) {
        title = typeof title === 'function' ? title(this.$store) : title
        return title || appConfig.title
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./design/_globals.styl"
  @import "~nprogress/nprogress.css"

  #nprogress .bar
    background: red !important

  #nprogress .peg
    box-shadow: 0 0 10px red, 0 0 5px red !important
</style>
