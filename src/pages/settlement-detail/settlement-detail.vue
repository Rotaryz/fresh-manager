<template>
  <div class="settlement-detail">
    <div class="tab-header">
      <div class="tab-box">
        <base-drop-down :select="statusObj" @setValue="_setStatus"></base-drop-down>
      </div>
      <div class="tab-box">
        <base-drop-down :select="settlementObj" @setValue="_settlementType"></base-drop-down>
      </div>
      <base-search placeHolder="订单号" @search="_search"></base-search>
    </div>
    <div class="list-header list-box">
      <div v-for="(item,index) in listTitle" :key="index" class="list-item">{{item}}</div>
    </div>
    <div class="list">
      <div v-for="(item, index) in settlementDetail" :key="index" class="list-content list-box">
        <div class="list-item">{{item.order_sn}}</div>
        <div class="list-item">{{item.total}}</div>
        <div class="list-item">{{item.refuse_total}}</div>
        <div class="list-item">{{item.money}}</div>
        <div class="list-item">{{item.type_str}}</div>
        <div class="list-item">{{item.status_str}}</div>
        <div class="list-item">{{item.created_at}}</div>
        <div class="list-item list-operation-box">
          <span class="list-operation" @click="_goDetail(item)">详情</span>
        </div>
      </div>
    </div>
    <div class="pagination-box">
      <base-pagination ref="pages" :pageDetail="pageTotal" @addPage="_getMoreList"></base-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {leaderComputed, leaderMethods} from '@state/helpers'

  const PAGE_NAME = 'SETTLEMENT_DETAIL'
  const TITLE = '团长结算详情'
  const LIST_TITLE = ['订单号', '订单实付', '退款金额', '应结算金额', '结算类型', '结算状态', '结算时间', '操作']

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
        excelParams: '',
        statusObj: {
          check: false,
          show: false,
          content: '全部状态',
          type: 'default',
          data: [
            {name: '全部', status: ''},
            {name: '未结算', status: 0},
            {name: '已结算', status: 1},
            {name: '已退款', status: 2}
          ]
        },
        settlementObj: {
          check: false,
          show: false,
          content: '结算类型',
          type: 'default',
          data: [{name: '全部', status: ''}, {name: '佣金收益', status: 0}, {name: '退款补偿', status: 1}]
        },
        id: 0,
        settlementType: '',
        status: ''
      }
    },
    computed: {
      ...leaderComputed
    },
    created() {
      this.id = this.$route.params.id
    },
    methods: {
      ...leaderMethods,
      _goDetail(item) {
        // 退货详情id未对 todo
        let url = '/home/order-detail/' + item.order_id
        this.$router.push(url)
      },
      _getSettlementDetail() {
        this.getSettlementDetail({
          page: this.page,
          shopId: this.id,
          orderSn: this.orderSn,
          status: this.status,
          settlementType: this.settlementType,
          loading: false
        })
      },
      _search(text) {
        this.$refs.pages.beginPage()
        this.page = 1
        this.orderSn = text
        this._getSettlementDetail()
      },
      _setStatus(item) {
        this.status = item.status
        this.$refs.pages.beginPage()
        this._getSettlementDetail()
      },
      _settlementType(item) {
        this.settlementType = item.status
        this.$refs.pages.beginPage()
        this._getSettlementDetail()
      },
      _getMoreList(page) {
        this.page = page
        this._getSettlementDetail()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .settlement-detail
    overflow: hidden
    flex: 1
    display: flex
    flex-direction: column

  .tab-header
    height: 80px
    display: flex
    align-items: center
    box-sizing: border-box
    .tab-box
      margin-right: 10px

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
      &:first-child, &:nth-child(8)
        flex: 1.5
      &:last-child
        flex: 0.6

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
