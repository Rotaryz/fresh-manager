<template>
  <div class="transaction-record">
    <div class="tab-header">
      <div class="tab-box">
        <base-drop-down :width="152"></base-drop-down>
      </div>
      <div class="tab-box">
        <base-date-select placeHolder="选择支付日期"></base-date-select>
      </div>
      <div class="tab-box">
        <base-search placeHolder="订单号/交易号" @search="_search"></base-search>
      </div>
      <div class="btn-main btn-main-end">导出Excel</div>
    </div>
    <div class="order-detail">
      <div class="order-item">
        <p class="order-text order-title">订单总额：</p>
        <p class="order-text order-money">￥22019.00</p>
      </div>
      <div class="order-item">
        <p class="order-text order-title">退款总额：</p>
        <p class="order-text order-money">￥22019.00</p>
      </div>
      <div class="order-item">
        <p class="order-text order-title">实收总额：</p>
        <p class="order-text order-money">￥22019.00</p>
      </div>
    </div>
    <div class="list-header list-box">
      <div v-for="(item,index) in listTitle" :key="index" class="list-item">{{item}}</div>
    </div>
    <div class="list">
      <div class="list-content list-box">
        <div class="list-item">d</div>
        <div class="list-item">d</div>
        <div class="list-item">d</div>
        <div class="list-item">d</div>
        <div class="list-item">d</div>
      </div>
    </div>
    <div class="pagination-box">
      <!--:pageDetail="pageTotal"-->
      <base-pagination ref="pages" @addPage="_getMoreList"></base-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'TRANSACTION_RECORD'
  const TITLE = '交易记录'
  const LIST_TITLE = ['订单号/订单号', '交易金额', '业务类型', '交易类型', '支付时间']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        listTitle: LIST_TITLE,
        page: 1,
        orderSn: '',
        excelParams: ''
      }
    },
    computed: {},
    created() {},
    methods: {
      _search(text) {
        this.$refs.pages.beginPage()
        this.page = 1
      },
      _getMoreList(page) {}
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .transaction-record
    overflow: hidden
    flex: 1
    display: flex
    flex-direction: column

  .tab-header
    height: 80px
    display: flex
    align-items: center
    box-sizing: border-box
    position: relative
    .tab-box
      margin-right: 10px
    .btn-main-end
      col-center()
      right: 0

  .order-detail
    display: flex
    padding-bottom: 30px
    .order-item
      margin-right: 50px
      display: flex
      .order-text
        font-family: $font-family-regular
        font-size: $font-size-14
      .order-title
        color: $color-text-main
      .order-money
        font-family: $font-family-medium
        color: $color-negative

  .list-header
    height: 50px
    font-size: $font-size-16
    font-family: $font-family-regular
    color: $color-text-main
    background: $color-list-header

  .list-box
    padding-left: 30px
    box-sizing: border-box
    border-bottom: 1px solid $color-line
    display: flex
    align-items: center
    .list-item
      box-sizing: border-box
      padding-right: 10px
      flex: 1

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
        .list-link
          &:hover
            color: $color-sub
      // 双行样式
      .list-double-row
        .item-sub
          no-wrap()
          line-height: 1
          margin-top: 8px
          font-size: $font-size-14
          color: $color-text-assist
        .item-dark
          no-wrap()
          font-size: $font-size-14
          line-height: 1

  .pagination-box
    height: 70px
    align-items: center
    display: flex

  .btn-main
    position: relative
    .file-box
      position: absolute
      top: 0
      left: 0
      width: 84px
      height: 28px
      opacity: 0
</style>
