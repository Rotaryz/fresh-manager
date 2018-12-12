<template>
  <div class="product-list">
    product-list
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'PRODUCT_LIST'
  const TITLE = '商品管理'

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

  .product-list
    width: 100%
</style>
