<template>
  <div class="product-categories">
    product-categories
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'PRODUCT_CATEGORIES'
  const TITLE = '商品分类'

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

  .product-categories
    width: 100%
</style>
