<template>
  <div class="purchase-management">
    <div class="tab-list">
      <status-tab :tabStatus="tabStatus" @getStatusTab="checkTab"></status-tab>
    </div>
    <div class="search-warp">
      <div class="ac-tab">
        <base-drop-down :select="select"></base-drop-down>
        <base-data-select :dateINfo="dateINfo" @_getTime="_getTime"></base-data-select>
        <base-search :placeHolder="placeHolder"></base-search>
      </div>
      <a :href="downUrl" class="excel" target="_blank">导出Excel</a>
    </div>
    <div class="list-header list-box">
      <div v-for="(item,index) in listTitle" :key="index" class="list-item">{{item}}</div>
    </div>
    <div class="list">
      <div v-for="(item, index) in orderList" :key="index" class="list-content list-box">
        <div class="list-item list-double-row">
          <p class="item-dark">{{item.refundId}}</p>
          <p class="item-sub">{{item.refund_time}}</p>
        </div>
        <div class="list-item list-text">
          <div class="list-text-name">{{item.member_name}}</div>
        </div>
        <div class="list-item list-text">{{item.shop_name}}</div>
        <div class="list-item list-text">￥{{item.promote_price}}</div>
        <div class="list-item list-text">{{item.orderId}}</div>
        <div class="list-item list-text" :title="item.name">{{item.name}}</div>
        <div class="list-item list-text">{{item.result}}</div>
        <div class="list-item list-text">{{item.status}}</div>
        <div class="list-item list-use">
          <span v-if="item.status_id === 1" class="blue-use hand" @click="_getTime">审核</span>
          <span class="detail-use hand" @click="_getTime">详情</span>
        </div>
      </div>
    </div>
    <div class="pagination-box">
      <base-pagination></base-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import StatusTab from '@components/status-tab/status-tab'
  import BaseDropDown from '@components/_base-drop-down/_base-drop-down'
  import BaseDataSelect from '@components/_base-date-select/_base-date-select'
  const PAGE_NAME = 'ORDER_LIST'
  const TITLE = '退货管理'
  const LIST_TITLE = ['退货单号', '会员名称', '商品', '退货金额', '原订单号', '社区名称', '退货原因', '退货单状态', '操作']
  const ORDERLIST = [
    {
      refundId: 'TD20188832770043',
      refund_time: '2018-08-22 15:00:32',
      member_name: '小白龙',
      shop_name: '口水鸡很好鸡很好吃',
      orderId: 'DYX20188832770043',
      name: '广海花园社区',
      promote_price: 3.5,
      result: '重新拍',
      status: '已退款',
      status_id: 2
    },
    {
      refundId: 'TD20188832770043',
      refund_time: '2018-08-22 15:00:32',
      member_name: '小白龙',
      shop_name: '口水鸡很好鸡很好吃',
      orderId: 'DYX20188832770043',
      name: '广海花园社区',
      promote_price: 3.5,
      result: '重新拍',
      status: '已退款',
      status_id: 2
    },
    {
      refundId: 'TD20188832770043',
      refund_time: '2018-08-22 15:00:32',
      member_name: '小白龙',
      shop_name: '口水鸡很好水很好吃',
      orderId: 'DYX20188832770043',
      name: '广海花园社区',
      promote_price: 3.5,
      result: '重新拍',
      status: '待处理',
      status_id: 1
    },
    {
      refundId: 'TD20188832770043',
      refund_time: '2018-08-22 15:00:32',
      member_name: '小白龙',
      shop_name: '口水鸡很好水鸡很',
      orderId: 'DYX20188832770043',
      name: '广海花园社区',
      promote_price: 3.5,
      result: '重新拍',
      status: '已取消',
      status_id: 3
    },
    {
      refundId: 'TD20188832770043',
      refund_time: '2018-08-22 15:00:32',
      member_name: '小白龙',
      shop_name: '口水鸡很好水鸡很',
      orderId: 'DYX20188832770043',
      name: '广海花园社区',
      promote_price: 3.5,
      result: '重新拍',
      status: '待处理',
      status_id: 1
    }
  ]
  const ORDERSTATUS = [{text: '全部', status: 0}, {text: '待处理', status: 1}]
  const SELECT = {
    check: false,
    show: false,
    content: '全部',
    type: 'default',
    data: [{title: '55'}] // 格式：
  }
  export default {
    name: PAGE_NAME,
    components: {
      StatusTab,
      BaseDataSelect,
      BaseDropDown
      // DefaultConfirm
    },
    page: {
      title: TITLE
    },
    data() {
      return {
        tabStatus: ORDERSTATUS,
        listTitle: LIST_TITLE,
        placeHolder: '订单号/会员名称',
        dateINfo: ['2018-12-01'],
        orderList: ORDERLIST,
        downUrl: '',
        select: SELECT
      }
    },
    methods: {
      checkTab() {},
      _getTime() {},
      goPage() {}
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .purchase-management
    overflow: hidden
    flex: 1
    display: flex
    flex-direction: column
    .tab-list
      wdith: 100%

  .search-warp
    layout(row)
    height: 80px
    align-items: center
    justify-content: space-between
    .ac-tab
      layout(row)
      align-items: center
      .base-date-select
        padding: 0 10px
    .excel
      display: block
      height: 28px
      width: 84px
      line-height: 28px
      background: $color-positive
      border: 1px solid $color-positive
      border-radius: 4px
      font-family: $font-family-regular
      font-size: $font-size-12
      color: $color-white
      text-align: center
  .tab-header
    height: 80px
    display: flex
    justify-content: space-between
    align-items: center
    box-sizing: border-box
  .list-use
    font-family: $font-family-regular
    font-size: $font-size-14
    color: $color-text-assist
  .detail-use
    font-family: $font-family-regular
    font-size: $font-size-14
    color: $color-sub
  .blue-use
    font-family: $font-family-regular
    font-size: $font-size-14
    color: $color-sub
    margin-right: 12px
    position: relative
    &:after
      position: absolute
      top: 2px
      right: -6px
      content: ''
      height: 14px
      width: 1px
      background: #ccc

  .list-header
    height: 50px
    font-size: $font-size-16
    font-family: $font-family-regular
    color: $color-text-main
    background: $color-list-header

  .list-box
    line-height: 1
    padding-left: 30px
    box-sizing: border-box
    border-bottom: 1px solid $color-line
    display: flex
    align-items: center
    .list-item
      box-sizing: border-box
      padding-right: 10px
      flex: 1
      &:first-child, &:nth-child(5), &:nth-child(6)
        flex: 1.1
      &:nth-child(3)
        flex: 1.3
      &:nth-child(4), &:nth-child(2) &:nth-child(7) &:nth-child(8)
        flex: 0.8
      &:last-child
        flex: 0.5

  .list
    flex: 1
    .list-content
      font-family: $font-family-regular
      color: $color-text-main
      height: 70px
      border-bottom: 1px solid $color-line
      .list-item
        no-wrap()
        font-size: $font-size-14
      // 双行样式
      .list-double-row
        .item-sub
          margin-top: 8px
          font-size: $font-size-14
          color: $color-text-assist
        .item-dark
          font-size: $font-size-14

  .pagination-box
    height: 70px
    align-items: center
    display: flex
</style>
