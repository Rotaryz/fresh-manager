<template>
  <div class="home" @touchmove.prevent>
    <router-view style="z-index: 10"></router-view>
    <tab></tab>
  </div>
</template>

<script type="text/ecmascript-6">
  import Tab from '@components/tab/tab'

  const PAGE_NAME = 'HOME'

  export default {
    name: PAGE_NAME,
    page: {
      title: 'Home',
      meta: [{name: 'description', content: 'description'}]
    },
    components: {
      Tab
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
</style>
