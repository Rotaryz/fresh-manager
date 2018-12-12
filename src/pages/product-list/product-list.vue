<template>
  <div class="product-list">
    product-list
    <base-edit-image></base-edit-image>
    <base-switch></base-switch>
    <base-search></base-search>
    <base-date-select></base-date-select>
    <base-drop-down></base-drop-down>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'PRODUCT_LIST'
  const TITLE = '商品列表'

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

  .product-list
    width: 100%
</style>
