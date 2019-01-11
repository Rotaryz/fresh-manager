<template>
  <div class="transaction-record">
    <div class="tab-header">
      <div class="tab-box">
        <base-drop-down :width="152" :select="tradeSelect" @setValue="changeTradeType"></base-drop-down>
      </div>
      <div class="tab-box">
        <base-date-select placeHolder="选择支付日期" :dateInfo="date" @getTime="changeDate"></base-date-select>
      </div>
      <div class="tab-box">
        <base-search placeHolder="订单号/交易号" :infoText="keyword" @search="changeKeyword"></base-search>
      </div>
      <div class="btn-main btn-main-end" @click="exportExcel">导出Excel</div>
    </div>
    <div class="order-detail">
      <div class="order-item">
        <p class="order-text order-title">订单总额：</p>
        <p class="order-text order-money">{{tradeDetail.total && `￥${tradeDetail.total}`}}</p>
      </div>
      <div class="order-item">
        <p class="order-text order-title">退款总额：</p>
        <p class="order-text order-money">{{tradeDetail.refund && `￥${tradeDetail.refund}`}}</p>
      </div>
      <div class="order-item">
        <p class="order-text order-title">实收总额：</p>
        <p class="order-text order-money">{{tradeDetail.amount && `￥${tradeDetail.amount}`}}</p>
      </div>
    </div>
    <div class="list-header list-box">
      <div v-for="(item,index) in listTitle" :key="index" class="list-item">{{item}}</div>
    </div>
    <div class="list">
      <div v-for="(item, index) in trades" :key="index" class="list-content list-box">
        <div class="list-item list-double-row">
          <p class="item-dark">{{item.order_sn}}</p>
          <p class="item-dark">{{item.out_trade_sn}}</p>
        </div>
        <div class="list-item">{{item.total}}</div>
        <div class="list-item">{{item.business_type}}</div>
        <div class="list-item">{{item.trade_type}}</div>
        <div class="list-item">{{item.created_at}}</div>
      </div>
    </div>
    <div class="pagination-box">
      <!--:pageDetail="pageTotal"-->
      <base-pagination ref="pagination" :pageDetail="pageDetail" :pagination="page" @addPage="setPage"></base-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import {authComputed, tradeComputed, tradeMethods} from '@state/helpers'

  const PAGE_NAME = 'TRANSACTION_RECORD'
  const TITLE = '交易记录'
  const LIST_TITLE = ['订单号/交易号', '交易金额', '业务类型', '交易类型', '支付时间']
  const TRADE_SELECT = {
    check: false,
    show: false,
    content: '全部类型',
    type: 'default',
    data: []
  }
  const EXCEL_URL = '/social-shopping/api/backend/finance/trade-excel'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        listTitle: LIST_TITLE,
        tradeSelect: TRADE_SELECT,
        tradeDetail: {}
      }
    },
    computed: {
      ...authComputed,
      ...tradeComputed,
      tradeExportUrl() {
        let data = {
          current_corp: process.env.VUE_APP_CURRENT_CORP,
          current_shop: process.env.VUE_APP_CURRENT_SHOP,
          access_token: this.currentUser.access_token,
          type: this.type,
          keyword: this.keyword,
          date: this.date[0] && this.date[1] ? `${this.date[0]},${this.date[1]}` : ''
        }
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        return process.env.VUE_APP_API + EXCEL_URL + '?' + search.join('&')
      }
    },
    created() {
      this._getTradeOrderType()
      this._getTradeDetail()
    },
    methods: {
      ...tradeMethods,
      async _getTradeOrderType() {
        let res = await API.Trade.getTradeOrderType()
        if (res.error !== this.$ERR_OK) {
          console.warn('获取交易状态类型失败')
          return
        }
        let selectData = res.data
        selectData.unshift({name: '全部类型', id: ''})
        this.tradeSelect.data = selectData
      },
      async _getTradeDetail() {
        let res = await API.Trade.getTradeDetail()
        if (res.error !== this.$ERR_OK) {
          console.warn('获取交易概况失败')
          return
        }
        this.tradeDetail = res.data
      },
      changeTradeType(select) {
        this.setTradeType(select)
        this.$refs.pagination.beginPage()
      },
      changeDate(date) {
        this.setDate(date)
        this.$refs.pagination.beginPage()
      },
      changeKeyword(keyword) {
        this.setKeyword(keyword)
        this.$refs.pagination.beginPage()
      },
      exportExcel() {
        window.open(this.tradeExportUrl, '_blank')
      },
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
          &:last-child
            margin-top: 8px

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
