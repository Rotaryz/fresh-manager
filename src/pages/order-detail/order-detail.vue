<template>
  <div class="order-detail">
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
        <div v-for="(item, index) in detail.goods" :key="index" class="ro-order-list">
          <div class="ro-order-list-box">
            <div class="ro-order-list-item ro-order-list-text">{{item.goods_name}}</div>
            <div class="ro-order-list-item ro-order-list-text">{{item.goods_units}}</div>
            <div class="ro-order-list-item ro-order-list-text">{{item.num}}</div>
            <div class="ro-order-list-item ro-order-list-text">{{item.price && `¥ ${item.price}`}}</div>
            <div class="ro-order-list-item ro-order-list-text">{{item.price && `¥ ${item.price}`}}</div>
            <div class="ro-order-list-item ro-order-list-text">{{item.after_sale_status_text}}</div>
          </div>
        </div>
        <div class="ro-order-list-footer">
          <div class="ro-order-list-foot-box">
            <div class="foot-item">订单总价：{{detail.price && `¥ ${detail.price}`}}</div>
            <div class="foot-item">优惠金额：{{detail.promote_price && `¥ ${detail.promote_price}`}}</div>
            <div class="foot-item">应付金额：{{detail.total && `¥ ${detail.total}`}}</div>
            <div class="foot-item">实付金额：{{detail.total && `¥ ${detail.actual_total}`}}</div>
            <div class="foot-item">退款金额：{{detail.refund_price && `¥ ${detail.refund_price}`}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="back">
      <div class="back-btn btn-main" @click="_back">返回</div>
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

  .order-detail
    width: 100%
    padding-bottom: 80px

  .detail-item
    layout()
    .top
      height: 62px
      border-bottom: 1px solid $color-line
      layout(row)
      position: relative
      .title
        padding-top: 30px
        padding-bottom: 16px
        height: 62px
        box-sizing: border-box
        font-family: $font-family-medium
        font-size: $font-size-16
        color: $color-text-main
      .line
        transition: all .3s
        background: $color-positive
        height: 2px
        width: 34px
        position: absolute
        left: 0
        bottom: 0
    .bot
      layout(row)
      align-items: center
      flex-wrap: warp
      .info-item
        word-break: break-all
        font-family: $font-family-regular
        font-size: $font-size-14
        color: $color-text-main
        line-height: 18px
        width: 209px
        padding-bottom: 20px
        margin-right: 80px
        &:last-child
          width: 320px
          margin-right: 0
    .sobot
      padding: 30px 0 0px 15px
      width: 1280px
      box-sizing: border-box
    .goods-list
      margin: 28px 0px 0px
      width: 100%
      padding: 0 15px
      box-sizing: border-box
      .ro-order-list-footer
        background: $color-white
        layout(row)
        align-items: center
        justify-content: flex-end
        width: 100%
        padding-top: 20px
        .ro-order-list-foot-box
          layout(row)
          justify-content: flex-end
        .foot-item
          font-family: $font-family-medium
          font-size: $font-size-14
          color: $color-text-main
          margin-left: 48px
          &:first-child
            margin-left: 0
      .ro-order-list
        width: 100%
        background: $color-white
        .ro-order-list-box
          width: 100%
          padding-left: 30px
          layout(row)
          white-space: nowrap
          height: 60px
          box-sizing: border-box
          align-items: center
          background: $color-white
          border-bottom: 1px solid $color-line
          .ro-order-list-item
            font-family: $font-family-regular
            font-size: $font-size-14
            color: $color-text-main
      .ro-order-list-header
        width: 100%
        layout(row)
        padding-left: 30px
        white-space: nowrap
        box-sizing: border-box
        align-items: center
        height: 50px
        background: #F9F9F9
        border-bottom: 1px solid $color-line
        .ro-order-list-item
          font-family: $font-family-regular
          font-size: $font-size-16
          color: $color-text-main
          line-height: 16px

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

  .back
    position: fixed
    left: 200px
    right: 0px
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
