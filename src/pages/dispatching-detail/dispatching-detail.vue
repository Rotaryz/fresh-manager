<template>
  <div class="dispatching-detail">
    <div class="essential-information">
      <div class="content-header">
        <div class="content-title">基本信息</div>
        <div>
          <a class="btn-main excel" target="_blank" :href="deliveryUrl">导出配送单</a>
          <a class="btn-main excel" target="_blank" :href="userUrl">导出消费者订单</a>
        </div>
      </div>
      <div class="essential-information-detail">
        <p class="essential-information-item">配送单号：{{detail.order_sn}}</p>
        <p class="essential-information-item essential-information-time">生成时间：{{detail.created_at}}</p>
        <p class="essential-information-item essential-information-total">配送日期：{{detail.delivery_at}}</p>
        <p class="essential-information-item essential-information-data">社区名称：{{detail.social_name}}</p>
        <p class="essential-information-item essential-information-data">团长名称：{{detail.name}}</p>
        <p class="essential-information-item essential-information-data">团长电话：{{detail.mobile}}</p>
        <p class="essential-information-item essential-information-data">社区地址：{{detail.province}} {{detail.city}} {{detail.district}} {{detail.address}}</p>
      </div>
    </div>
    <div class="list-of-commodities">
      <div class="content-header">
        <div class="content-title">商品清单</div>
      </div>
      <div class="commodities-list">
        <div class="commodities-list-header com-list-box">
          <div v-for="(item, index) in commodities" :key="index" class="com-list-item">{{item}}</div>
        </div>
        <div v-for="(item,index) in detail.detail_list" :key="index" class="com-list-box com-list-content">
          <div class="com-list-item">{{index + 1}}</div>
          <div class="com-list-item">{{item.goods_name}}</div>
          <div class="com-list-item">{{item.goods_units}}</div>
          <div class="com-list-item">{{item.num}}</div>
          <div class="com-list-item">{{item.price}}</div>
          <div class="com-list-item">{{item.total}}</div>
        </div>
        <div class="total-money">预定总金额：￥{{detail.total}}</div>
      </div>
    </div>
    <div class="back">
      <div class="back-btn btn-main" @click="_back">返回</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'DISPATCHING_DETAIL'
  const TITLE = '团长配送单'
  const COMMODITIES_LIST = ['序号', '商品名称', '单位', '预定数量', '预定单价', '预定金额']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    props: {
      detail: {
        type: Object,
        default() {
          return {}
        },
        deliveryUrl: '',
        userUrl: ''
      }
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        id: null
      }
    },
    created() {
      let currentId = this.getCurrentId()
      this.id = this.$route.query.id || null
      let token = this.$storage.get('auth.currentUser', '')
      let excelParams = token
        ? `?access_token=${token.access_token}&current_corp=${currentId}`
        : ''
      this.deliveryUrl = `${process.env.VUE_APP_API}/social-shopping/api/backend/store-delivery-export/${
        this.id
      }${excelParams}`
      this.userUrl = `${process.env.VUE_APP_API}/social-shopping/api/backend/user-order-export/${this.id}${excelParams}`
    },
    methods: {
      _back() {
        this.$router.back()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .dispatching-detail
    line-height: 1
    flex: 1
    padding-bottom: 80px
    position: relative

  /*基本信息类头部盒子样式*/
  .content-header
    border-bottom: 1px solid $color-line
    display: flex
    align-items: center
    justify-content: space-between
    height: 62px
    position: relative
    box-sizing: border-box
    .excel
      margin-left: 20px
      &:hover
        color: $color-white
    &:after
      content: ''
      position: absolute
      width: 34px
      height: 2px
      background: $color-main
      border-radius: 1px
      bottom: -1px
      left: 0
    .content-title
      color: $color-text-main
      font-family: $font-family-medium
      font-size: $font-size-16

  .essential-information
    margin-bottom: 26px
    .essential-information-detail
      display: flex
      margin-top: 30px
      padding: 0 20px
      box-sizing: border-box
      flex-wrap: wrap
      .essential-information-item
        margin-bottom: 24px
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-text-main
        white-space: nowrap
        min-width: 264px

  .commodities-list-header
    margin-top: 28px
    height: 50px
    background: $color-list-header
    .com-list-item
      font-size: $font-size-16

  .com-list-content
    height: 58.5px
    .com-list-item
      font-size: $font-size-14

  .com-list-box
    padding-left: 30px
    box-sizing: border-box
    display: flex
    align-items: center
    border-bottom: 1px solid $color-line
    .com-list-item
      flex: 1
      padding-right: 10px
      box-sizing: border-box
      no-wrap()
      color: $color-text-main
      font-family: $font-family-regular
      &:nth-child(1)
        flex: 0.5

  .commodities-list
    margin-bottom: 85px
    box-sizing: border-box
    padding: 0 20px
    .com-list-box
      .com-list-item
        line-height: 1.2
        &:nth-child(2)
          flex: 1.5
    .total-money
      text-align: right
      margin-top: 21px
      font-family: $font-family-medium
      color: $color-text-main
      font-size: $font-size-14

  .back
    position: fixed
    left: 200px
    right: -0px
    bottom: 0
    z-index: 10
    background: #F9F9F9
    height: 80px
    border-radius: 0 0 6px 6px
    display: flex
    align-items: center
    .back-btn
      font-size: $font-size-16
      margin-left: 40px
      padding: 12px 32px
</style>
