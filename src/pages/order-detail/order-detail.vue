<template>
  <div class="order-detail">
    <div class="detail-item">
      <div class="top">
        <div class="title">基本信息</div>
        <div class="line"></div>
      </div>
      <div class="bot sobot">
        <div class="info-item">订单号：DDH20188832770043</div>
        <div class="info-item">下单时间：2018-12-08 15:34:00</div>
        <div class="info-item">支付时间：2018-12-08 15:34:00</div>
        <div class="info-item">订单状态：已完成</div>
      </div>
    </div>
    <div class="detail-item">
      <div class="top">
        <div class="title">收货信息</div>
        <div class="line"></div>
      </div>
      <div class="bot sobot">
        <div class="info-item">会员名称：雷布斯</div>
        <div class="info-item">会员手机：13316241009</div>
        <div class="info-item">团长名称：乔布斯</div>
        <div class="info-item">团长手机：13316241009</div>
        <div class="info-item">取货时间：2018-12-08 15:34:00</div>
        <div class="info-item">提货单号：38</div>
        <div class="info-item">提货地址：广东 广州 白云区 国际单位二期A5四楼</div>
      </div>
    </div>
    <div class="detail-item">
      <div class="top">
        <div class="title">商品清单</div>
        <div class="line"></div>
      </div>
      <div class="bot goods-list">
        <div class="list-header">
          <div v-for="(item, index) in titleList" :key="index" class="list-item">
            {{item}}
          </div>
        </div>
        <div v-for="(item, index) in [1,2,3,4]" :key="index" class="list">
          <div class="list-box">
            <div class="list-item list-text">口水鸭先鸡不知口水鸭先鸡不知</div>
            <div class="list-item list-text">斤</div>
            <div class="list-item list-text">91</div>
            <div class="list-item list-text">￥5.98</div>
            <div class="list-item list-text">453.2 </div>
            <div class="list-item list-text">未退款</div>
          </div>
        </div>
        <div class="list-footer">
          <div class="list-foot-box">
            <div class="foot-item">订单总价：￥79.28</div>
            <div class="foot-item">优惠金额：￥6.37</div>
            <div class="foot-item">应付金额：￥73.98</div>
            <div class="foot-item">实付金额：￥73.98</div>
            <div class="foot-item">退款金额：￥73.98</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'ORDER_DETAIL'
  const TITLE = '订单详情'
  const TITLELIST =['商品名称', '下单单位', '下单数量', '下单单价', '下单金额', '退款状态']


  export default {
    name: PAGE_NAME,
    components: {
      // DefaultConfirm
    },
    page: {
      title: TITLE
    },
    data() {
      return {
        titleList: TITLELIST
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .order-detail
    width: 100%
  .detail-item
    layout()
    .top
      height: 62px
      border-bottom:1px solid $color-line
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
        font-family: $font-family-regular
        font-size: $font-size-14
        color: $color-text-main
        line-height: 14px
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
      min-width: 1316px
      padding: 0 15px
      box-sizing: border-box
      .list-footer
        background: $color-white
        layout(row)
        align-items: center
        justify-content: flex-end
        width: 100%
        padding: 20px 0 102px
        .list-foot-box
          width: 786px
          layout(row)
        .foot-item
          font-family: $font-family-regular
          font-size: $font-size-14
          color: $color-text-main
          margin-left: 48px
          &:first-child
            margin-left: 0
      .list
        width: 100%
        background: $color-white
        .list-box
          width: 100%
          padding-left: 30px
          layout(row)
          white-space: nowrap
          height: 60px
          box-sizing: border-box
          align-items: center
          background: $color-white
          border-bottom: 1px solid $color-line
          .list-item
            font-family: $font-family-regular
            font-size: $font-size-14
            color: $color-text-main
      .list-header
        width: 100%
        layout(row)
        padding-left: 30px
        white-space: nowrap
        box-sizing: border-box
        align-items: center
        height: 50px
        background: #F9F9F9
        border-bottom: 1px solid $color-line
        .list-item
          font-family: $font-family-regular
          font-size: $font-size-16
          color: $color-text-main
          line-height: 16px
  .list-item
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

  .txts
    height:10px
</style>
