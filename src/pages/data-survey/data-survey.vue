<template>
  <div class="data-survey">
    <div class="data-header">
      <div class="data-caption data-caption-line">
        <div class="data-title">交易数据</div>
        <base-option-box @checkTime="_orderMore"></base-option-box>
      </div>
      <div class="data-order">
        <div v-if="orderDetail.order" class="order-item">
          <div class="order-title">销售额</div>
          <div class="order-money">{{orderDetail.order.curr_total}}</div>
          <div class="order-total">总销售额: {{orderDetail.order.total}}</div>
        </div>
        <div v-if="orderDetail.visitor" class="order-item">
          <div class="order-title">访客数</div>
          <div class="order-money">{{orderDetail.visitor.curr_total}}</div>
          <div class="order-total">总访客数: {{orderDetail.visitor.total}}</div>
        </div>
        <div v-if="orderDetail.pay_rate" class="order-item">
          <div class="order-title">支付转化率</div>
          <div class="order-money">{{orderDetail.pay_rate.curr_total}}</div>
          <div class="order-total">平均支付转化率: {{orderDetail.pay_rate.total}}</div>
        </div>
        <div v-if="orderDetail.pay_customer" class="order-item">
          <div class="order-title">支付客户数</div>
          <div class="order-money">{{orderDetail.pay_customer.curr_total}}</div>
          <div class="order-total">总支付客户数: {{orderDetail.pay_customer.total}}</div>
        </div>
        <div v-if="orderDetail.customer_price" class="order-item">
          <div class="order-title">客单价</div>
          <div class="order-money">{{orderDetail.customer_price.curr_total}}</div>
          <div class="order-total">平均客单价: {{orderDetail.customer_price.total}}</div>
        </div>
      </div>
    </div>
    <div class="data-content">
      <div class="date-leader">
        <div class="data-caption">
          <div class="data-title">团长销售排行榜</div>
        </div>
        <div class="data-down">
          <base-option-box :infoTab="1" @checkTime="_leaderMore"></base-option-box>
          <a class="btn-main" :href="downUrl" target="_blank">导出excel</a>
        </div>
        <div class="list-header list-box">
          <div v-for="(item,index) in leaderTitle" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in leaderDetail" :key="index" class="list-content list-box list-content-data">
            <div class="list-item">{{item.name}}</div>
            <div class="list-item">{{item.social_name}}</div>
            <div class="list-item">{{item.sale_total_sum}}</div>
            <div class="list-item">{{item.order_count_sum}}</div>
            <div class="list-item">{{item.commission_total_sum}}</div>
          </div>
        </div>
        <div class="pagination-box data-page">
          <base-pagination ref="pagination" :pageDetail="pageDetail" @addPage="_leaderPage"></base-pagination>
        </div>
      </div>
      <div class="date-shop">
        <div class="data-caption">
          <div class="data-title">商品销售排行榜</div>
        </div>
        <div class="data-down">
          <base-option-box :infoTab="1" @checkTime="_shopMore"></base-option-box>
          <a class="btn-main" :href="shopDownUrl" target="_blank">导出excel</a>
        </div>
        <div class="list-header list-box">
          <div v-for="(item,index) in shopTitle" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in shopDetail" :key="index" class="list-content list-box list-content-data">
            <div class="list-item">{{item.goods_name}}</div>
            <div class="list-item">{{item.browse_count_sum}}</div>
            <!--<div class="list-item">{{item.order_count_sum}}</div>-->
            <div class="list-item">{{item.sale_count_sum}}</div>
            <div class="list-item">{{item.sale_total_sum}}</div>
          </div>
        </div>
        <div class="pagination-box data-page">
          <base-pagination ref="shopPage" :pageDetail="goodsPageDetail" @addPage="_shopPage"></base-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {dataComputed, dataMethods} from '@state/helpers'

  const PAGE_NAME = 'DATA_SURVEY'
  const TITLE = '数据概况'
  const LEADER_TITLE = ['团长名称', '社区名称', '销售额', '支付订单数', '佣金收益']
  const SHOP_TITLE = ['商品名称', '被浏览次数', '销售件数', '销售额']
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        leaderTitle: LEADER_TITLE,
        shopTitle: SHOP_TITLE,
        LeaderPage: 1,
        shopPage: 1,
        time: 'yesterday',
        shopTime: 'yesterday',
        downUrl: '',
        shopDownUrl: ''
      }
    },
    computed: {
      ...dataComputed
    },
    created() {
      this.$emit('setRoutine', true)
      this.getLeaderDetail({startTime: '', endTime: '', time: 'yesterday', page: this.LeaderPage, loading: false})
      this.getShopDetail({startTime: '', endTime: '', time: 'yesterday', page: this.shopPage, loading: false})
      this._getUrl()
      this._getShopUrl()
    },
    destroyed() {
      this.$emit('setRoutine', false)
    },
    methods: {
      ...dataMethods,
      _getUrl() {
        let currentId = this.getCurrentId()
        let token = this.$storage.get('auth.currentUser', '')
        let params =
          typeof this.time === 'string'
            ? `access_token=${token.access_token}&start_time=&end_time=&time=${this.time}&page=${this.LeaderPage}`
            : `access_token=${token.access_token}&startTime=${this.time[0]}&endTime=${this.time[1]}&time=&page=${
              this.LeaderPage
            }`
        this.downUrl =
          process.env.VUE_APP_API +
          `/social-shopping/api/backend/statistics-manager-data-export?${params}&current_corp=${currentId}`
      },
      _getShopUrl() {
        let currentId = this.getCurrentId()
        let token = this.$storage.get('auth.currentUser', '')
        let params =
          typeof this.shopTime === 'string'
            ? `access_token=${token.access_token}&start_time=&end_time=&time=${this.shopTime}&page=${this.LeaderPage}`
            : `access_token=${token.access_token}&startTime=${this.shopTime[0]}&endTime=${this.shopTime[1]}&time=&page=${
              this.LeaderPage
            }`
        this.shopDownUrl =
          process.env.VUE_APP_API +
          `/social-shopping/api/backend/statistics-goods-data-export?${params}&current_corp=${currentId}`
      },
      _orderMore(value) {
        if (typeof value === 'string') {
          this.getOrderDetail({startTime: '', endTime: '', time: value, loading: true})
          return
        }
        this.getOrderDetail({startTime: value[0], endTime: value[1], time: '', loading: true})
      },
      _leaderMore(value) {
        this.$refs.pagination.beginPage()
        this.LeaderPage = 1
        this.time = value
        this._getUrl()
        if (typeof value === 'string') {
          this.getLeaderDetail({startTime: '', endTime: '', time: value, page: this.LeaderPage, loading: true})
          return
        }
        this.getLeaderDetail({startTime: value[0], endTime: value[1], time: '', page: this.LeaderPage, loading: true})
      },
      _leaderPage(page) {
        this.LeaderPage = page
        this._getUrl()
        if (typeof this.time === 'string') {
          this.getLeaderDetail({startTime: '', endTime: '', time: this.time, page: this.LeaderPage, loading: true})
          return
        }
        this.getLeaderDetail({
          startTime: this.time[0],
          endTime: this.time[1],
          time: '',
          page: this.LeaderPage,
          loading: true
        })
      },
      _shopPage(page) {
        this.shopPage = page
        this._getShopUrl()
        if (typeof this.shopTime === 'string') {
          this.getShopDetail({startTime: '', endTime: '', time: this.shopTime, page: this.shopPage, loading: true})
          return
        }
        this.getShopDetail({
          startTime: this.shopTime[0],
          endTime: this.shopTime[1],
          time: '',
          page: this.shopPage,
          loading: true
        })
      },
      _shopMore(value) {
        this.shopTime = value
        this.$refs.shopPage.beginPage()
        this.shopPage = 1
        this._getShopUrl()
        if (typeof value === 'string') {
          this.getShopDetail({startTime: '', endTime: '', time: value, page: this.shopPage, loading: true})
          return
        }
        this.getShopDetail({startTime: value[0], endTime: value[1], time: '', page: this.shopPage, loading: true})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .data-survey
    overflow: hidden
    flex: 1
    display: flex
    box-sizing: border-box
    padding: 20px
    flex-direction: column
    padding: 20px

  .data-header
    height: 260px
    border-radius: 2px
    background: $color-white
    box-sizing: border-box

  .data-caption
    padding: 20px
    display: flex
    justify-content: space-between
    align-items: center
    box-sizing: border-box
    .data-title
      font-family: $font-family-regular
      color: $color-text-main
      font-size: $font-size-16
  .data-caption-line
    border-bottom-1px($color-line)

  .data-down
    display: flex
    padding: 0 20px 20px
    justify-content: space-between

  .data-order
    display: flex
    padding: 0 20px
    box-sizing: border-box
    .order-item
      flex: 1
      margin-top: 39.5px
      .order-title
        color: $color-text-main
        font-family: $font-family-regular
        text-indent: 10px
        font-size: $font-size-16
        position: relative
        line-height: 16px
        &:after
          content: ''
          position: absolute
          left: 0
          top: 0
          background: #3E77C3
          height: 16px
          width: 4px
      .order-money
        line-height: 1
        margin-top: 24px
        font-family: $font-family-bold
        color: $color-text-main
        font-size: 36px
      .order-total
        line-height: 1
        margin-top: 24px
        font-family: $font-family-regular
        color: $color-text-assist
        font-size: $font-size-16

  .data-content
    margin-top: 20px
    display: flex

  .date-shop, .date-leader
    background: $color-white
    width: 50%
    box-sizing: border-box
    border-radius: 2px

  .date-shop
    margin-left: 20px

  .list-box
    padding-left: 20px
    box-sizing: border-box
    border-bottom-1px($color-line)
    display: flex
    align-items: center
    .list-item
      box-sizing: border-box
      padding-right: 10px
      flex: 1

  .list
    min-height: 600px

  .date-shop .list-box .list-item
    &:nth-child(1)
      flex: 1.5

  .date-leader .list-box .list-item
    &:nth-child(2)
      flex: 1.5

  .date-shop, .date-leader
    .list-content-data
      height: 60px

  .data-page
    height: 60px
    padding: 0 20px
</style>
