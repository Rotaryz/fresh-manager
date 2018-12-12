<template>
  <div class="rush-purchase">
    rush-purchase
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'RUSH_PURCHASE'
  const TITLE = '今日抢购'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {}
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .rush-purchase
    width: 100%
</style>
