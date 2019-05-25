<template>
  <transition name="fade">
    <div @touchmove.prevent>
      <navigation></navigation>
      <div class="home">
        <top-bar></top-bar>
        <div :class="{'container-routine': isRoutine}" class="container" :style="{'margin-bottom': marginBottom + 'px'}">
          <div class="container-small">
            <router-view :key="$route.fullPath" @setRoutine="setRoutine"></router-view>
          </div>
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
        title: '',
        isRoutine: false
      }
    },
    computed: {
      ...globalComputed
    },
    created() {
      // console.log(this.$route)
      // console.log(this.$store.dispatch('auth/validate'))
      this.title = this.currentTitles.length ? this.currentTitles[this.currentTitles.length - 1] : ''
    },
    methods: {
      setRoutine(status) {
        this.isRoutine = status
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .home
    layout()
    min-width: 1366px
    min-height: 100vh
    padding-left: 210px
    box-sizing: border-box
    background: $color-background
    .container
      display: flex
      flex: 1
      user-select: text
      box-sizing: border-box
      padding: 20px
      margin-top: 40px
      .container-small
        border-radius: 2px
        flex: 1
        display: flex
    .container-routine
      padding: 0
      box-shadow: 0 0 0 0 transparent
      background: transparent
</style>
