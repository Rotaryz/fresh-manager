<template>
  <div class="purchase-detail">
    <div class="essential-information">
      <div class="content-header">
        <div class="content-title">基本信息</div>
        <div class="btn-main">导出Excel</div>
      </div>
      <div class="essential-information-detail">
        <p class="essential-information-item">采购单号：DDH20188832770043</p>
        <p class="essential-information-item">生成时间：2018-12-08 15:34:00</p>
        <p class="essential-information-item">采购商品总数：209</p>
        <p class="essential-information-item">数据来源：系统生成</p>
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
        <div class="com-list-box com-list-content">
          <div class="com-list-item">1</div>
          <div class="com-list-item">口水鸭先鸡不知口水鸭先鸡不知口水鸭先鸡不知口水鸭先鸡不知</div>
          <div class="com-list-item">斤</div>
          <div class="com-list-item">91</div>
          <div class="com-list-item">91</div>
          <div class="com-list-item">91</div>
          <div class="com-list-item">12</div>
          <div class="com-list-item">￥45.32</div>
          <div class="com-list-item">￥45.32</div>
        </div>
      </div>
    </div>
    <div class="history-record">
      <div class="content-header">
        <div class="content-title">历史记录</div>
      </div>
      <div class="commodities-list">
        <div class="commodities-list-header com-list-box">
          <div v-for="(item, index) in historyRecord" :key="index" class="com-list-item">{{item}}</div>
        </div>
        <div class="com-list-box com-list-content">
          <div class="com-list-item">1</div>
          <div class="com-list-item">乔布斯乔布斯乔布斯乔布斯乔布斯乔布斯乔布斯乔布斯乔布斯乔布斯乔布斯</div>
          <div class="com-list-item">2018-12-08 15:34:00</div>
          <div class="com-list-item">生成采购单</div>
        </div>
        <div class="com-list-box com-list-content">
          <div class="com-list-item">1</div>
          <div class="com-list-item">乔布斯</div>
          <div class="com-list-item">2018-12-08 15:34:00</div>
          <div class="com-list-item">生成采购单</div>
        </div>
        <div class="com-list-box com-list-content">
          <div class="com-list-item">1</div>
          <div class="com-list-item">乔布斯</div>
          <div class="com-list-item">2018-12-08 15:34:00</div>
          <div class="com-list-item">生成采购单</div>
        </div>
        <div class="com-list-box com-list-content">
          <div class="com-list-item">1</div>
          <div class="com-list-item">乔布斯</div>
          <div class="com-list-item">2018-12-08 15:34:00</div>
          <div class="com-list-item">生成采购单</div>
        </div>
      </div>
    </div>
    <div class="back">
      <div class="back-btn btn-main" @click="_back">返回</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'PURCHASE_DETAIL'
  const TITLE = '采购详情'
  const COMMODITIES_LIST = [
    '序号',
    '商品名称',
    '单位',
    '待采购量',
    '库存',
    '收货数量',
    '未收数量',
    '收货单价',
    '收货金额'
  ]
  const HISTORY_RECORD = ['序号', '操作人', '时间', '操作记录']
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        historyRecord: HISTORY_RECORD
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

  .purchase-detail
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
        width: 264px

  .list-of-commodities
    margin-bottom: 85px
    box-sizing: border-box
    padding: 0 20px
    .com-list-box
      .com-list-item
        &:nth-child(2)
          flex: 2

  .history-record
    box-sizing: border-box
    padding: 0 20px
    padding-bottom: 80px

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

  .back
    position: absolute
    left: -20px
    right: -20px
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
