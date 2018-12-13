<template>
  <div class="order-list">
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
    <div class="form-list">
      <div class="list-header">
        <div v-for="(item, index) in titleList" :key="index" class="list-item">
          {{item}}
        </div>
      </div>
      <div class="list">
        <div v-for="(item, index) in orderList" :key="index" class="list-box">
          <div class="list-item list-text">
            <div class="list-text-name">{{item.orderId}}</div>
            <div class="list-text-des">{{item.order_time}}</div>
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
            <span class="blue-use hand" @click="_getTime">查看</span>
          </div>
        </div>
        <div class="list-box">
          <div class="list-item list-text">
            <div class="list-text-name">DYXH20188832770043</div>
            <div class="list-text-des">2018-08-27 15:00:32</div>
          </div>
          <div class="list-item list-text">
            <div class="list-text-name">张三丰</div>
          </div>
          <div class="list-item list-text">￥3.50</div>
          <div class="list-item list-text">￥3.50</div>
          <div class="list-item list-text">2018-08-27 </div>
          <div class="list-item list-text">广海花园社区</div>
          <div class="list-item list-text">已完成</div>
          <div class="list-item list-use">
            <span class="blue-use hand">查看</span>
          </div>
        </div>
      </div>
      <div class="page">
        <page-detail ref="page" :pageDtail="goodsPage" @addPage="goPage"></page-detail>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import StatusTab from '@components/status-tab/status-tab'
  import BaseSearch from '@components/_base-search/_base-search'
  import BaseDropDown from '@components/_base-drop-down/_base-drop-down'
  import BaseDataSelect from '@components/_base-date-select/_base-date-select'
  import PageDetail from '@components/page-detail/page-detail'

  const PAGE_NAME = 'ORDER_LIST'
  const TITLE = '订单列表'
  const ORDERSTATUS = [{text: '全部', status: 0}, {text: '待付款', status: 1}, {text: '待提货', status: 2}, {text: '已完成', status: 3}, {text: '已关闭', status: 4}]
  const SELECT = {
    check: false,
    show: false,
    content: '全部',
    type: 'default',
    data: [{title: '55'}] // 格式：
  }
  const TITLELIST = {
    default: ['订单号', '会员名称', '订单总价', '实付金额', '发货日期', '社区名称', '订单状态', '操作']
  }
  const ORDERLIST = [
    {orderId: 'DYXH20188832770043', order_time: '2018-08-24 15:00:32', member_name: '小白龙', total: 3.5, promote_price: 3.5, dateTime: '2018-08-27', name: '广海花园社区', status: '已完成', status_id: 1},
    {orderId: 'DYXH20188832770013', order_time: '2018-08-21 15:00:32', member_name: 'STJY', total: 3.5, promote_price: 3.5, dateTime: '2018-08-27', name: '广海花园社区', status: '已完成', status_id: 1},
    {orderId: 'DYXH20188832770033', order_time: '2018-08-22 15:00:32', member_name: '西游小白龙', total: 3.5, promote_price: 3.5, dateTime: '2018-08-27', name: '广海勇于中层美丽苏苏花园社区', status: '已完成', status_id: 3},
    {orderId: 'DYXH20188832770023', order_time: '2018-08-25 15:00:32', member_name: '期待', total: 3.5, promote_price: 3.5, dateTime: '2018-08-27', name: '广海花园社区', status: '已完成', status_id: 2},
    {orderId: 'DYXH20188832770063', order_time: '2018-08-27 15:00:32', member_name: '守候', total: 3.5, promote_price: 3.5, dateTime: '2018-08-27', name: '广海花园社区', status: '已完成', status_id: 1}
  ]
  export default {
    name: PAGE_NAME,
    components: {
      StatusTab,
      BaseSearch,
      BaseDataSelect,
      PageDetail,
      BaseDropDown
      // DefaultConfirm
    },
    page: {
      title: TITLE
    },
    data() {
      return {
        tabStatus: ORDERSTATUS,
        titleList: TITLELIST['default'],
        placeHolder: '订单号/会员名称',
        dateINfo: ['2018-12-01'],
        orderList: ORDERLIST,
        downUrl: '',
        goodsPage: {
          total: 0, // 总数量
          per_page: 10, // 一页条数
          total_page: 1 // 总页数
        },
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

  .order-list
    width: 100%
    height: 100%
    flex: 1
    .search
      padding: 29px 0 30px 0
      width: 100%
      layout(row)
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
      border: 1px solid #40AD58
      border-radius: 4px
      font-family: $font-family-regular
      font-size: $font-size-12
      color: $color-white
      text-align: center
  .form-list
    position: relative
    font-size: $font-size-14
    font-family: $font-family-regular
  .list-header
    width: 100%
    height: 50px
    white-space: nowrap
    border-bottom: 1px solid #e6e6e6
    background: #F9F9F9
    layout(row)
    align-items: center
    justify-content: space-around
    padding: 0 1.5vw
  .list-header, .list-box
    width: 100%
    display: flex
    align-items: center
    box-sizing: border-box
    padding: 0 1.5vw

  .list-header
    width: 100%
    height: 50px
    white-space: nowrap
    border-bottom: 1px solid $color-line
    background: $color-background
    .list-item
      display: flex
      align-items: center
      font-size: $font-size-14
      font-family: $font-family-medium
      color: $color-text-main
  .list
    display: flex
    flex-direction: column
    .list-box
      background: $color-white
      height: 70px
      overflow: hidden
      border-bottom: 1px solid $color-line
      &:last-child
        margin-bottom: 60px
      .list-use
        display: flex
      .list-item
        box-sizing: border-box
        line-height: 16px
        color: $color-text-main
        font-size: $font-size-14
        .pic-box
          height: 40px
          width: 40px
          overflow: hidden
          .pic
            width: 40px
      .list-item-tap
        font-size: $font-size-12
        color: rgba(0, 0, 0, .1)
      .list-text
        no-wrap()
        width: 90%
        font-size: $font-size-14
        &:nth-child(2)
          overflow: hidden
          display: -webkit-box
          -webkit-line-clamp: 3
          -webkit-box-orient: vertical
          word-break: break-all
        .express
          no-wrap()
        .express-disable
          color: $color-text-main
        .list-text-des
          color:  #ACACAC
          margin-top: 8px
      .blue
        color: $color-4985FC

  .list-item-img
    width: 60px
    height: 40px
    border: none
    display: block

  .list-item
    color: $color-text-main
    flex: 1
    position: relative
    text-align: left
    overflow: hidden
    padding: 0 10px
    box-sizing: border-box
    .list-text-name, .list-text-des
      font-size: $font-size-14
    .sort
      display: flex
      flex-direction: column
      justify-content: space-between
      height: 19px
      margin-left: 10px
      .sort-item
        border: 4px solid $color-text99
        transition: all 0.4s
      .sort-top
        border-top: 4px solid transparent
        border-left: 4px solid transparent
        border-right: 4px solid transparent
      .sort-end
        border-bottom: 4px solid transparent
        border-left: 4px solid transparent
        border-right: 4px solid transparent
      .sort-top-active
        border: 4px solid $color-4985FC
        border-top: 4px solid transparent
        border-left: 4px solid transparent
        border-right: 4px solid transparent
        transition: all 0.4s
      .sort-end-active
        border: 4px solid $color-4985FC
        border-bottom: 4px solid transparent
        border-left: 4px solid transparent
        border-right: 4px solid transparent
        transition: all 0.4s
    .showDetail
      cursor: pointer
      font-size: $font-size-small
      color: $color-nomal
      border-radius: 3px
      .audit-disable
        color: $color-text-little
      .audit
        color: $color-nomal
    &:nth-child(1)
      flex: 1.8
    &:nth-child(2)
      flex: 1
      white-space: normal !important
      word-break: break-all
    &:nth-child(5), &:nth-child(7)
      flex: 1
    &:nth-child(6)
      flex: 1.8
    &:nth-child(3), &:nth-child(4), &:last-child
      flex: 1
  .list-box-active
    background: $color-background
</style>
