<template>
  <div class="product-list">
    <div class="product-top">
      <div class="product-left">
        <div class="btn-main">新建商品+</div>
        <base-drop-down></base-drop-down>
        <div class="search-left">
          <base-search></base-search>
        </div>
      </div>
      <div class="product-right">
        <div class="btn-main">导出Excel</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BaseDropDown from '@components/_base-drop-down/_base-drop-down'
  import BaseSearch from '@components/_base-search/_base-search'
  const PAGE_NAME = 'PRODUCT_LIST'
  const TITLE = '商品列表'
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      BaseDropDown,
      BaseSearch
    },
    data() {
      return {}
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .product-top
    layout(row)
    align-items: center
    justify-content: space-between
    height: 80px
    .product-left
      layout(row)
      align-items: center
    .btn-main
      margin-right: 10px
    .search-left
      margin-left: 10px
  .product-list
    width: 100%
</style>
