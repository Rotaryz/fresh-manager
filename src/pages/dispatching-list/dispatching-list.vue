<template>
  <div class="dispatching-list">
    dispatching-list
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'DISPATCHING_LIST'
  const TITLE = '团长配送单'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {

      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .dispatching-list
    width: 100%
</style>
