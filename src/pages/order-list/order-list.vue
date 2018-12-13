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
          <p class="item-dark">{{item.orderId}}</p>
          <p class="item-sub">{{item.order_time}}</p>
        </div>
        <div class="list-item list-text">
          <div class="list-text-name">{{item.member_name}}</div>
        </div>
        <div class="list-item list-text">￥{{item.total}}</div>
        <div class="list-item list-text">￥{{item.promote_price}}</div>
        <div class="list-item list-text">{{item.dateTime}}</div>
        <div class="list-item list-text" :title="item.name">{{item.name}}</div>
        <div class="list-item list-text">{{item.status}}</div>
        <div class="list-item list-use">
          <router-link tag="span" to="/home/refund-detail" append class="blue-use hand">详情</router-link>
        </div>
      </div>
    </div>
    <div class="pagination-box">
      <base-pagination></base-pagination>
    </div>
    <default-confirm ref="msg" :oneBtn="true"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import StatusTab from '@components/status-tab/status-tab'
  import BaseDropDown from '@components/_base-drop-down/_base-drop-down'
  import BaseDataSelect from '@components/_base-date-select/_base-date-select'
  import DefaultConfirm from '@components/default-confirm/default-confirm'

  const PAGE_NAME = 'ORDER_LIST'
  const TITLE = '订单列表'
  const LIST_TITLE = ['订单号', '会员名称', '订单总价', '实付金额', '发货日期', '社区名称', '订单状态', '操作']
  const ORDERLIST = [
    {
      orderId: 'DYXH20188832770043',
      order_time: '2018-08-24 15:00:32',
      member_name: '小白龙',
      total: 3.5,
      promote_price: 3.5,
      dateTime: '2018-08-27',
      name: '广海花园社区',
      status: '已完成',
      status_id: 1
    },
    {
      orderId: 'DYXH20188832770013',
      order_time: '2018-08-21 15:00:32',
      member_name: 'STJY',
      total: 3.5,
      promote_price: 3.5,
      dateTime: '2018-08-27',
      name: '广海花园社区',
      status: '已完成',
      status_id: 1
    },
    {
      orderId: 'DYXH20188832770033',
      order_time: '2018-08-22 15:00:32',
      member_name: '西游小白龙',
      total: 3.5,
      promote_price: 3.5,
      dateTime: '2018-08-27',
      name: '广苏苏花园社区',
      status: '已完成',
      status_id: 3
    },
    {
      orderId: 'DYXH20188832770023',
      order_time: '2018-08-25 15:00:32',
      member_name: '期待',
      total: 3.5,
      promote_price: 3.5,
      dateTime: '2018-08-27',
      name: '广海花园社区',
      status: '已完成',
      status_id: 2
    },
    {
      orderId: 'DYXH20188832770063',
      order_time: '2018-08-27 15:00:32',
      member_name: '守候',
      total: 3.5,
      promote_price: 3.5,
      dateTime: '2018-08-27',
      name: '广海花园社区',
      status: '已完成',
      status_id: 1
    }
  ]
  const ORDERSTATUS = [{text: '全部', status: 0}, {text: '待付款', status: 1}, {text: '待提货', status: 2}, {text: '已完成', status: 3}, {text: '已关闭', status: 4}]
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
      BaseDropDown,
      DefaultConfirm
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
    created() {
      setTimeout(() =>{
        // this.$refs.msg.show('一次只能导出一个社区的消费者订单，请先选择社区')
      },0)
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

  .blue-use
    font-family: $font-family-regular
    font-size: $font-size-14
    color: $color-sub

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
      &:first-child, &:nth-child(6)
        flex: 1.2
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
