<template>
  <transition name="fade">
    <div @touchmove.prevent>
      <navigation></navigation>
      <div class="home">
        <top-bar></top-bar>
        <div class="container">
          <keep-alive>
            <router-view :key="$route.fullPath"></router-view>
          </keep-alive>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Navigation from './navigation/navigation'
  import TopBar from './top-bar/top-bar'
  import {globalComputed} from '@state/helpers'

  const PAGE_NAME = 'HOME'

  export default {
    name: PAGE_NAME,
    page: {
      title: 'home'
    },
    components: {
      Navigation,
      TopBar
    },
    data() {
      return {
        title: ''
      }
    },
    computed: {
      ...globalComputed
    },
    created() {
      // console.log(this.$route)
      // console.log(this.$store.dispatch('auth/validate'))
      this.title = this.currentTitles.length ? this.currentTitles[this.currentTitles.length - 1] : ''
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .home
    layout()
    min-width: 1410px
    min-height: 100vh
    padding-left: 200px
    background: $color-background
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
    .container
      display: flex
      flex: 1
      margin: 14px
      padding: 0 20px
      user-select: text
      border-radius: 6px
      box-shadow: 0 1px 5px 0 rgba(0, 8, 39, 0.06)
      background: $color-white
</style>
