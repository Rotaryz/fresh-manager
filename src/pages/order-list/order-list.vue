<template>
  <div class="order-list">
    <div class="tab-list">
      <status-tab :tabStatus="tabStatus" @getStatusTab="checkTab"></status-tab>
    </div>
    <div class="search">
      <base-drop-down></base-drop-down>
      <base-search :placeHolder="placeHolder"></base-search>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import StatusTab from '@components/status-tab/status-tab'
  import BaseSearch from '@components/_base-search/_base-search'
  import BaseDropDown from '@components/_base-drop-down/_base-drop-down'

  const PAGE_NAME = 'ORDER_LIST'
  const TITLE = '订单列表'
  const ORDERSTATUS = [{text: '全部', status: 0}, {text: '待付款', status: 1}, {text: '待提货', status: 2}, {text: '已完成', status: 3}, {text: '已关闭', status: 4}]


  export default {
    name: PAGE_NAME,
    components: {
      StatusTab,
      BaseSearch,
      BaseDropDown
      // DefaultConfirm
    },
    page: {
      title: TITLE
    },
    data() {
      return {
        tabStatus: ORDERSTATUS,
        placeHolder: '订单号/会员名称'
      }
    },
    methods: {
      checkTab() {}
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .order-list
    width: 100%
    .search
      padding: 29px 0 30px 0
      width: 100%
      layout(row)
    .tab-list
      wdith: 100%
</style>
