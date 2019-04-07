<template>
  <div class="upgrade">
    <div class="upgrade-content">
      <img src="./pic-xtsj@2x.png" class="upgrade-content-img">
      <span class="upgrade-title">系统升级</span>
      <button class="upgrade-btn hand" @click="goTargetPath">刷新</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'

  const PAGE_NAME = 'UPGRADE'
  const TITLE = '系统升级'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        path: ''
      }
    },
    created() {
      this.path = this.$storage.get('upgradeRoute') || '/'
    },
    methods: {
      async goTargetPath() {
        // 请求判断升级是否完成
        let res = await API.Global.getSystemStatus()
        if (res.error === this.$ERR_OK && res.data.status === 0) {
          this.$router.replace(this.path)
          this.$storage.remove('upgradeRoute')
          return
        }
        this.$toast.show('系统正在升级中...')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .upgrade
    height: 100vh
    width: 100vw
    overflow: hidden
    display: flex
    justify-content: center
    align-items: center
    .upgrade-content
      margin-top: -9%
      display: flex
      flex-direction: column
      justify-content: center
      align-items: center
    .upgrade-content-img
      width: 114px
    .upgrade-title
      margin-top: 10px
      color: $color-text-assist
    .upgrade-btn
      border: 1px solid $color-main
      color: $color-main
      font-size: $font-size-16
      border-radius: 20px
      margin-top: 30px
      width: 88px
      height: 30px
      line-height: 30px
      transition: all 0.2s
</style>
