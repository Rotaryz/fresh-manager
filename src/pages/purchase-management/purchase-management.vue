<template>
  <div class="purchase-management">
    <div class="pur-header">
      <base-search></base-search>
      <div class="btn-main">导入采购单</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'PURCHASE_MANAGEMENT'
  const TITLE = '采购管理'

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

  .purchase-management
    width: 100%

  .pur-header
    height: 80px
    border-bottom: 1px solid $color-line
    display: flex
    justify-content: space-between
    align-items: center
    box-sizing: border-box
</style>
