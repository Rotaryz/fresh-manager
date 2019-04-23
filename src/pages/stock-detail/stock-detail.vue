<template>
  <div class="stock-detail table">
    <div class="down-content">
      <div class="down-item-text">盘点单号：T27218-JHD56</div>
      <div class="down-item-text">建单时间：2018-12-07 15:00:50</div>
      <div class="down-item-text">库存数量：344</div>
      <div class="down-item-text">盘点数量：333</div>
      <div class="down-item-text">差异数量：-1</div>
      <div class="down-item-text">差异金额：<span class="block">-￥30.00</span></div>
      <div class="down-item-text">操作人：nanbokai</div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-stock_detailed@2x.png" class="identification-icon">
          <p class="identification-name">库存明细</p>
        </div>
        <div class="function-btn">
          <div class="btn-main">导出excel</div>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div>
            <div class="list-content list-box">
              <div class="list-item">666</div>
              <div class="list-item">666</div>
              <div class="list-item">666</div>
              <div class="list-item">666</div>
              <div class="list-item">666</div>
              <div class="list-item">666</div>
              <div class="list-item">666</div>
              <div class="list-item">666</div>
              <!--:class="{'list-status-success': item.status === 3, 'list-status-warn': item.status === 2}"-->
              <div class="list-item"><span class="list-status"></span>报损</div>
            </div>
          </div>
          <!--空白页-->
          <!--<base-blank v-else></base-blank>-->
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination"></base-pagination>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'STOCK_DETAIL'
  const TITLE = '盘点详情'
  const COMMODITIES_LIST = ['序号', '商品', '分类', '基本单位', '库存数量', '盘点数量', '差异数量', '差异金额(元)', '调整类型']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        commodities: COMMODITIES_LIST
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .down-content
    align-items: flex-start
    padding: 5px 20px 25px
    box-sizing: border-box
  .block
    font-family: $font-family-medium
  .list-box
    .list-item
      align-items: center
      &:nth-child(1)
        flex: 0.4
      &:nth-child(2)
        flex: 1.7
      &:nth-child(3)
        flex: 1.3
      &:last-child
        padding: 0
        max-width: 80px
</style>
