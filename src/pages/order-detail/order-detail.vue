<template>
  <div class="order-detail detail-content">
    <div class="identification">
      <div class="identification-page">
        <img src="./icon-order_list@2x.png" class="identification-icon">
        <p class="identification-name">订单详情</p>
      </div>
      <div class="function-btn">
      </div>
    </div>
    <div class="detail-item">
      <div class="top">
        <div class="title">基本信息</div>
        <div class="line"></div>
      </div>
      <div class="bot sobot">
        <div class="info-item">订单号：{{detail.order_sn}}</div>
        <div class="info-item">下单时间：{{detail.created_at}}</div>
        <div class="info-item">支付时间：{{detail.pay_at}}</div>
        <div class="info-item">订单状态：{{detail.status_text}}</div>
        <div v-if="freeShipping*1===1" class="info-item">关联订单号：{{detail.market_order_sn}}</div>
      </div>
    </div>
    <div class="detail-item">
      <div class="top">
        <div class="title">收货信息</div>
        <div class="line"></div>
      </div>
      <div class="bot sobot">
        <div class="info-item">会员名称：{{detail.address && detail.address.nickname}}</div>
        <div class="info-item">会员手机：{{detail.address && detail.address.mobile}}</div>
        <div class="info-item">团长名称：{{detail.address && detail.address.shop_name}}</div>
        <div class="info-item">团长手机：{{detail.address && detail.address.shop_mobile}}</div>
        <!--<div class="info-item">取货时间：{{detail.address && detail.address.delivery_at}}</div>-->
        <div v-if="freeShipping*1!==1" class="info-item">提货单号：{{detail.address && detail.code}}</div>
        <div class="info-item">{{freeShipping*1===1?'收':'提'}}货地址：{{detail.address && detail.address.shop_address}}</div>
      </div>
    </div>
    <div class="detail-item">
      <div class="top">
        <div class="title">商品清单</div>
        <div class="line"></div>
      </div>
      <div v-if="detail.goods" :class="[freeShipping*1===1?'free-shipping':'']" class="bot goods-list">
        <div class="ro-order-list-header">
          <div v-for="(item, index) in titleList" :key="index" class="ro-order-list-item">
            {{item}}
          </div>
        </div>
        <div class="ro-order-list">
          <div v-for="(item, index) in detail.goods" :key="index" class="ro-order-list-box">
            <div class="ro-order-list-item ro-order-list-text ro-order-list-item-double">{{item.goods_name}}</div>
            <div class="ro-order-list-item ro-order-list-text">{{item.goods_units}}</div>
            <div class="ro-order-list-item ro-order-list-text">{{item.num}}</div>
            <div class="ro-order-list-item ro-order-list-text">{{item.price && `¥ ${item.price}`}}</div>
            <div class="ro-order-list-item ro-order-list-text">{{item.total && `¥ ${item.total}`}}</div>
            <div v-if="freeShipping*1!==1" class="ro-order-list-item ro-order-list-text">{{item.delivery_at}}</div>
            <div class="ro-order-list-item ro-order-list-text">{{item.after_sale_status_text}}</div>
            <div v-if="freeShipping*1===1" class="ro-order-list-item ro-order-list-text">{{item.express_company?item.express_company:'——'}}</div>
            <div v-if="freeShipping*1===1" class="ro-order-list-item ro-order-list-text">{{item.express_sn?item.express_sn:'——'}}</div>
          </div>
        </div>
      </div>
      <div class="ro-order-list-footer">
        <div class="ro-order-list-foot-box">
          <div class="foot-item">订单总价：<span class="block">{{detail.price && `¥ ${detail.price}`}}</span></div>
          <div v-if="freeShipping*1!==1" class="foot-item">优惠金额：<span class="block">{{detail.promote_price && `¥ ${detail.promote_price}`}}</span></div>
          <div v-if="freeShipping*1!==1" class="foot-item">应付金额：<span class="block">{{detail.total && `¥ ${detail.total}`}}</span></div>
          <div class="foot-item">实付金额：<span class="block">{{detail.total && `¥ ${detail.actual_total}`}}</span></div>
          <div v-if="freeShipping*1!==1" class="foot-item">退款金额：<span class="block">{{detail.refund_price && `¥ ${detail.refund_price}`}}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {orderComputed} from '@state/helpers'

  const PAGE_NAME = 'ORDER_DETAIL'
  const TITLE = '订单详情'
  const TITLELIST = ['商品名称', '下单单位', '下单数量', '下单单价', '下单金额', '发货日期', '退款状态']
  const FS_TITLE_LIST = ['商品名称', '下单单位', '下单数量', '下单单价', '下单金额', '退款状态', '快递公司', '快递单号']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        titleList: TITLELIST,
        freeShipping: this.$route.query.freeShipping || 0
      }
    },
    computed: {
      ...orderComputed
    },
    mounted() {
      if (this.freeShipping*1===1) {
        this.titleList = FS_TITLE_LIST
      }
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
  @import "~@style/detail"
  .order-detail
    flex-direction: column
    width: 100%
    padding-bottom: 80px

  .ro-order-list-item
    flex: 1
    &:nth-child(1)
      flex: 2
      max-width: 340px
      no-wrap()
      padding-right: 30px
    &:nth-child(2), &:nth-child(3), &:nth-child(4)
      white-space: normal !important
      word-break: break-all
  .free-shipping .ro-order-list-item
    &:nth-child(1)
      flex: 2
      max-width: 300px
    &:nth-child(8)
      flex: 1.6
      max-width: 200px
  .block
    font-family: $font-family-medium
</style>
