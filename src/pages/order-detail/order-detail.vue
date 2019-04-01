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
        <div class="info-item">取货时间：{{detail.address && detail.address.delivery_at}}</div>
        <div class="info-item">提货单号：{{detail.address && detail.code}}</div>
        <div class="info-item">提货地址：{{detail.address && detail.address.shop_address}}</div>
      </div>
    </div>
    <div class="detail-item">
      <div class="top">
        <div class="title">商品清单</div>
        <div class="line"></div>
      </div>
      <div v-if="detail.goods" class="bot goods-list">
        <div class="ro-order-list-header">
          <div v-for="(item, index) in titleList" :key="index" class="ro-order-list-item">
            {{item}}
          </div>
        </div>
        <div class="ro-order-list">
          <div v-for="(item, index) in detail.goods" :key="index" class="ro-order-list-box">
            <div class="ro-order-list-item ro-order-list-text">{{item.goods_name}}</div>
            <div class="ro-order-list-item ro-order-list-text">{{item.goods_units}}</div>
            <div class="ro-order-list-item ro-order-list-text">{{item.num}}</div>
            <div class="ro-order-list-item ro-order-list-text">{{item.price && `¥ ${item.price}`}}</div>
            <div class="ro-order-list-item ro-order-list-text">{{item.total && `¥ ${item.total}`}}</div>
            <div class="ro-order-list-item ro-order-list-text">{{item.after_sale_status_text}}</div>
          </div>
        </div>
      </div>
      <div class="ro-order-list-footer">
        <div class="ro-order-list-foot-box">
          <div class="foot-item">订单总价：<span class="block">{{detail.price && `¥ ${detail.price}`}}</span></div>
          <div class="foot-item">优惠金额：<span class="block">{{detail.promote_price && `¥ ${detail.promote_price}`}}</span></div>
          <div class="foot-item">应付金额：<span class="block">{{detail.total && `¥ ${detail.total}`}}</span></div>
          <div class="foot-item">实付金额：<span class="block">{{detail.total && `¥ ${detail.actual_total}`}}</span></div>
          <div class="foot-item">退款金额：<span class="block">{{detail.refund_price && `¥ ${detail.refund_price}`}}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {orderComputed} from '@state/helpers'

  const PAGE_NAME = 'ORDER_DETAIL'
  const TITLE = '订单详情'
  const TITLELIST = ['商品名称', '下单单位', '下单数量', '下单单价', '下单金额', '退款状态']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        titleList: TITLELIST
      }
    },
    computed: {
      ...orderComputed
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
    &:nth-child(1)
      flex: 1.5
      no-wrap()
      padding-right: 30px
    &:nth-child(2), &:nth-child(3), &:nth-child(4)
      flex: 1
      white-space: normal !important
      word-break: break-all
    &:nth-child(5), &:nth-child(7)
      flex: 1
    &:last-child
      flex: 0.5

  .block
    font-family: $font-family-medium
</style>
