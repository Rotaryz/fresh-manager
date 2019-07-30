<template>
  <div class="settlement-detail table">
    <div class="down-content">
      <span class="down-tip">筛选</span>
      <div class="down-item-small">
        <base-drop-down :select="statusObj" @setValue="_setStatus"></base-drop-down>
      </div>
      <span class="down-tip">结算类型</span>
      <div class="down-item">
        <base-drop-down :select="settlementObj" @setValue="_settlementType"></base-drop-down>
      </div>
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="订单号" :infoText="headDetailFitter.order_sn" @search="_search"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-bandit_list@2x.png" class="identification-icon">
          <p class="identification-name">团长结算详情</p>
        </div>
        <div class="function-btn">
        </div>
      </div>
      <div class="big-list">
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
            <div class="list-item">{{item.status===0?'——':item.updated_at}}</div>
            <div class="list-item list-operation-box">
              <span class="list-operation" @click="_goDetail(item)">详情</span>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pages" :pageDetail="pageTotal" :pagination="headDetailFitter.page" @addPage="_getMoreList"></base-pagination>
      </div>
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
          content: '全部',
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
          content: '全部',
          type: 'default',
          data: [{name: '全部', status: ''}, {name: '佣金收益-自提商品', status: 0}, {name: '佣金收益-全国包邮', status: 0}, {name: '退款补偿', status: 1}]
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
      let item = this.statusObj.data.find((item) => item.status === this.headDetailFitter.status)
      this.statusObj.content = item.name || '全部'
      let statusObj = this.settlementObj.data.find((item) => item.status === this.headDetailFitter.type)
      this.settlementObj.content = statusObj.name || '全部'
    },
    methods: {
      ...leaderMethods,
      _goDetail(item) {
        // 退货详情id未对 todo
        let url = '/home/order-list/order-detail/' + item.order_id
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
      // 更新列表数据
      _updateList(params) {
        this.SET_DETAIL_PARAMS(params)
        this.getSettlementDetail({})
        if (params.page === 1) {
          this.$refs.pages.beginPage()
        }
      },
      _search(text) {
        this._updateList({page: 1, order_sn: text})
      },
      _setStatus(item) {
        this._updateList({page: 1, status: item.status})
      },
      _settlementType(item) {
        let params = {page: 1, type: item.status}
        // source_type=2代表全国包邮
        params.source_type = item.name === '佣金收益-全国包邮' ? 2 : ''
        this._updateList(params)
      },
      _getMoreList(page) {
        // this.page = page
        this._updateList({page})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .tab-header
    height: 80px
    display: flex
    align-items: center
    box-sizing: border-box
    .tab-box
      margin-right: 10px

  .list-box
    .list-item
      box-sizing: border-box
      padding-right: 10px
      flex: 1
      &:first-child
        flex: 1.5
      &:nth-child(7)
        flex: 1.2
      &:last-child
        padding: 0
        max-width: 50px
</style>
