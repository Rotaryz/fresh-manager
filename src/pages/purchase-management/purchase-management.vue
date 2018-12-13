<template>
  <div class="purchase-management">
    <div class="tab-header">
      <base-search></base-search>
      <div class="btn-main">导入采购单</div>
    </div>
    <div class="list">
      <div class="list-header list-box">
        
      </div>
      <div class="list-content list-box"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'PURCHASE_MANAGEMENT'
  const TITLE = '采购管理'
  const LIST_TITLE = ['采购单号', '计划交货时间', '总采购项', '已采购项', '收货金额', '操作']
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        listTitle: LIST_TITLE
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .purchase-management
    width: 100%

  .tab-header
    height: 80px
    display: flex
    justify-content: space-between
    align-items: center
    box-sizing: border-box
</style>
