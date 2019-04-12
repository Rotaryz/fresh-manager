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
              <p class="number">{{account.remaining}}</p>
              <!--<p class="tip">下次结算: 2019-04-07 自动打款</p>-->
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
                <p class="detail hand" @click="checkTransaction(1)">明细</p>
                <img src="./icon-help_lv@2x.png" alt="" class="detail-icon hand">
                <div class="explain">入账资金（所有状态为已入账的交易明细）金额总和</div>
              </div>
            </div>
            <div class="flex-wrapper">
              <p class="number">{{account.settled}}</p>
            </div>
          </div>
        </div>
        <div class="item-wrapper">
          <div class="icon-wrapper">
            <img src="./icon-pending_entry@2x.png" alt="" class="icon">
          </div>
          <div class="item-content-wrapper">
            <div class="flex-wrapper margin">
              <p class="title">待入账收入(元)</p>
              <div class="flex-wrapper hand" @click="checkTransaction(0)">
                <p class="detail">明细</p>
                <img src="./icon-help_lv@2x.png" alt="" class="detail-icon">
                <div class="explain">入账资金（所有状态为待入账的交易明细）金额总和</div>
              </div>
            </div>
            <div class="flex-wrapper">
              <p class="number">{{account.wait_settle}}</p>
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
          <div v-for="(item, index) in payList" :key="index" class="list-content list-box">
            <div class="list-item list-text">{{item.updated_at}}</div>
            <div class="list-item list-text">{{item.money}}</div>
            <div class="list-item list-text">{{item.user_name}}</div>
            <div class="list-item list-text">{{item.withdrawal_card}}</div>
            <!--<div class="list-item list-text">5</div>-->
            <div class="list-item list-text hand">
              <img v-if="item.image_url"  src="./icon-voucher@2x.png" alt="" class="voucher" @click="showVoucher(item.image_url)">
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pageDetail="payListPageTotal" :pagination="payListPage" @addPage="setPayListPage"></base-pagination>
      </div>
    </div>
    <default-modal ref="voucherModal">
      <div slot="content" class="franchise-img">
        <div class="title-box">
          <div class="title">
            打款凭证
          </div>
          <span class="close hand" @click="cancelImg"></span>
        </div>
        <img :src="voucherImage" class="fran-img">
      </div>
    </default-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  import {financeComputed, financeMethods} from '@state/helpers'

  const PAGE_NAME = 'ACCOUNT_OVERVIEW'
  const TITLE = '账户总览'

  const LIST_TITLE = ['打款时间', '打款金额', '收款人', '银行账户', '打款凭证']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultModal
    },
    data() {
      return {
        listTitle: LIST_TITLE,
        voucherImage: ''
      }
    },
    computed: {
      ...financeComputed
    },
    methods: {
      ...financeMethods,
      checkTransaction(status) {
        this.setSettleLogsStatus({status, isFetch: 0})
        this.$router.push({name: 'transaction-detail'})
      },
      showVoucher(image) {
        this.voucherImage = image
        this.$refs.voucherModal.showModal()
      },
      cancelImg() {
        setTimeout(() => {
          this.voucherImage = ''
        }, 300)
        this.$refs.voucherModal.hideModal()
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

  .franchise-img
    background: $color-white
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
    border-radius: 3px
    box-sizing: border-box
    padding: 0 20px
    background: $color-white
    height: 560px
    width: 1000px
    .fran-img
      object-fit: cover
      margin-top: 7px
      height: 470px
      width: 960px
    .title-box
      display: flex
      box-sizing: border-box
      padding: 22px 0
      align-items: center
      justify-content: space-between
      .title
        font-size: $font-size-16
        font-family: $font-family-medium
        line-height: 1
        color: $color-text-main
      .close
        width: 12px
        height: @width
        icon-image('icon-close')
  .item-wrapper
    position: relative
    .detail-icon:hover ~ .explain
      opacity: .8
      z-index: 111
      visibility: initial
    .explain
      background: #32323A
      opacity: 0
      color: $color-white
      padding: 8px 18px
      border-radius: 2px
      line-height: 16px
      font-family: $font-family-regular
      font-size: $font-size-14
      width: 360px
      white-space: normal
      position: absolute
      left: 45px
      top: 24.5px
      transition: opacity .3s
      visibility: hidden

</style>
