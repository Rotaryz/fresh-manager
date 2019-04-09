<template>
  <div class="account-overview table">
    <div class="big-top-content">
      <div class="header-wrapper">
        <img class="icon" src="./icon-trading_outlook@2x.png">
        <p class="title">交易概览</p>
      </div>
      <div class="content-wrapper">
        <div class="item-wrapper">
          <div class="icon-wrapper">
            <img src="./icon-account_balance@2x.png" alt="" class="icon">
          </div>
          <div class="item-content-wrapper">
            <div class="flex-wrapper margin">账户余额(元)</div>
            <div class="flex-wrapper end">
              <p class="number">645.00</p>
              <p class="tip">下次结算: 2019-04-07 自动打款</p>
            </div>
          </div>
        </div>
        <div class="item-wrapper">
          <div class="icon-wrapper">
            <img src="./icon-entered_account@2x.png" alt="" class="icon">
          </div>
          <div class="item-content-wrapper">
            <div class="flex-wrapper margin">
              <p class="title">已入账收入(元)</p>
              <div class="flex-wrapper hand">
                <p class="detail">明细</p>
                <img src="./icon-help_lv@2x.png" alt="" class="detail-icon">
              </div>
            </div>
            <div class="flex-wrapper">
              <p class="number">645.00</p>
            </div>
          </div>
        </div>
        <div class="item-wrapper">
          <div class="icon-wrapper">
            <img src="./icon-pending_entry@2x.png" alt="" class="icon">
          </div>
          <div class="item-content-wrapper">
            <div class="flex-wrapper margin">
              <p>待入账收入(元)</p>
              <div class="flex-wrapper hand">
                <p class="detail">明细</p>
                <img src="./icon-help_lv@2x.png" alt="" class="detail-icon">
              </div>
            </div>
            <div class="flex-wrapper">
              <p class="number">645.00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-make_money@2x.png" class="identification-icon">
          <p class="identification-name">打款记录</p>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in listTitle" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in list" :key="index" class="list-content list-box">
            <div class="list-item list-text">1</div>
            <div class="list-item list-text">2</div>
            <div class="list-item list-text">3</div>
            <div class="list-item list-text">4</div>
            <div class="list-item list-text">5</div>
            <div class="list-item list-text hand">
              <img src="./icon-voucher@2x.png" alt="" class="voucher">
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pageDetail="pageDetail" :pagination="page" @addPage="setPage"></base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'ACCOUNT_OVERVIEW'
  const TITLE = '账户总览'

  const LIST_TITLE = ['打款时间', '打款金额', '收款人', '银行账户', '结算周期', '打印凭证']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        listTitle: LIST_TITLE,
        list: [{}]
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .account-overview
    width: 100%
    .list-box
      .list-item
        padding-right: 14px
        &:last-child
          flex: 0.4
          .voucher
            display: block
            width: 21px
            height: 17px
            margin: 0 auto
</style>
