<template>
  <div class="order-list">
    order-list
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'ORDER_LIST'
  const TITLE = '订单列表'

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

  .order-list
    width: 100%
</style>
