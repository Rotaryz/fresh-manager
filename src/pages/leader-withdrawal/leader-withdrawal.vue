<template>
  <div class="leader-withdrawal">
    <div class="tab-header">
      <base-drop-down :width="152"></base-drop-down>
      <input v-model="orderSn" type="text" class="with-search" placeholder="提现单号">
      <input v-model="keywords" type="text" class="with-search" placeholder="社区名称/团长名称/团长账号">
      <div class="search-icon-box" @click="_search">
        <span class="search-icon hand"></span>
      </div>
      <div class="btn-main btn-main-end">导出Excel</div>
    </div>
    <div class="list-header list-box">
      <div v-for="(item,index) in listTitle" :key="index" class="list-item">{{item}}</div>
    </div>
    <div class="list">
      <div class="list-content list-box">
        <div class="list-item list-double-row">
          <p class="item-dark">DDH20188832770043</p>
          <p class="item-sub">是的</p>
        </div>
        <div class="list-item">发</div>
        <div class="list-item">的</div>
        <div class="list-item">的</div>
        <div class="list-item">的</div>
        <div class="list-item">是</div>
        <div class="list-item">是</div>
        <div class="list-item list-help">
          微信受理失败
          <div class="help-box">
            <img src="./icon-help@2x.png" class="help hand">
            <transition name="fade">
              <div class="help-tip">失败原因：账户余额不足,账户余额不足</div>
            </transition>
          </div>
        </div>
        <div class="list-item list-operation-box">
          <span :to="'settlement-detail?id='" append class="list-operation" @click="checkApply">审核</span>
          <router-link tag="span" :to="'budget-detail?id='" append class="list-operation">收支明细</router-link>
        </div>
      </div>
    </div>
    <div class="pagination-box">
      <!--:pageDetail="pageTotal"-->
      <base-pagination ref="pages" @addPage="_getMoreList"></base-pagination>
    </div>
    <default-modal ref="modal">
      <div slot="content">
        <div class="Auditing">
          <div class="top">
            <div class="title">审核</div>
            <div class="close" @click.stop="hideModal"><img class="close-img" src="./icon-close@2x.png" alt=""></div>
          </div>
          <div class="text-area-box">
            <span class="after"></span>
            <textarea v-model="remark" placeholder="请输入审核意见" class="model-area"></textarea>
            <span class="before"></span>
          </div>
          <div class="btn-group">
            <div class="btn-item" @click.stop="hideModal">取消</div>
            <div class="btn-item" @click.stop="auditing(0)">驳回</div>
            <div class="btn-item" @click.stop="auditing(1)">批准退款</div>
          </div>
        </div>
      </div>
    </default-modal>

  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'

  const PAGE_NAME = 'LEADER_WITHDRAWAL'
  const TITLE = '团长提现'
  const LIST_TITLE = [
    '订单号',
    '团长账号',
    '团长名称',
    '社区名称',
    '提现金额',
    '手续费',
    '预计到账金额',
    '提现状态',
    '操作'
  ]
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
        page: 1,
        orderSn: '',
        excelParams: '',
        keywords: '',
        remark: '',
        checkId: 0
      }
    },
    computed: {},
    created() {},
    methods: {
      checkApply(id) {
        this.checkId = id
        this.$refs.modal.showModal()
      },
      hideModal() {
        this.$refs.modal.hideModal()
      },
      auditing(isAgree) {
        let data = {
          id: this.checkId,
          remark: this.remark,
          is_agree: isAgree
        }
        console.log(data)
      },
      _search() {
        this.$refs.pages.beginPage()
        this.page = 1
        console.log(this.orderSn, this.keywords)
      },
      _getMoreList(page) {}
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .leader-withdrawal
    overflow: hidden
    flex: 1
    display: flex
    flex-direction: column

  .tab-header
    height: 80px
    display: flex
    align-items: center
    box-sizing: border-box
    position: relative
    .with-search
      height: 28px
      width: 244px
      margin-left: 10px
      color: $color-text-main
      font-family: $font-family-regular
      font-size: $font-size-12
      box-sizing: border-box
      border: 1px solid $color-line
      border-radius: 4px
      padding-left: 14px
      transition: all 0.2s
      &:hover
        border: 1px solid #ACACAC
      &::placeholder
        font-family: $font-family-regular
        color: $color-text-assist
      &:focus
        border: 1px solid $color-sub !important
    .search-icon-box
      overflow: hidden
      height: 28px
      width: 47px
      border-radius: 4px
      margin-left: 10px
    .search-icon
      box-sizing: border-box
      height: 28px
      width: 47px
      transition: all 0.3s
      icon-image('icon-search_button')
      &:active
        transform: scale(1.1)
    .btn-main-end
      col-center()
      right: 0

  .list-header
    height: 50px
    font-size: $font-size-16
    font-family: $font-family-regular
    color: $color-text-main
    background: $color-list-header

  .list-box
    padding-left: 30px
    box-sizing: border-box
    border-bottom: 1px solid $color-line
    display: flex
    align-items: center
    .list-item
      box-sizing: border-box
      padding-right: 10px
      flex: 1
      &:first-child
        flex: 1.5
    .list-help
      overflow: visible !important
      display: flex
      align-items: center
      .help-box
        margin-left: 5px
        position: relative
      .help
        width: 14px
        height: 14px
      .help-tip
        background: #32323A
        opacity: .8
        color: $color-white
        padding: 8px 18px
        border-radius: 4px
        line-height: 16px
        font-family: $font-family-regular
        font-size: $font-size-14
        width: 196px
        white-space: normal
        position: absolute
        left: -75px
        top: 24.5px
        &.fade-enter, &.fade-leave-to
          opacity: 0
        &.fade-enter-to, &.fade-leave-to
          transition: opacity .3s ease-in-out
        &:after
          content: ''
          position: absolute
          z-index: 10
          left: 74px
          top: -12px
          border: 8px solid transparent
          border-bottom: 8px solid #32323A

  .list
    flex: 1
    .list-content
      font-family: $font-family-regular
      color: $color-text-main
      height: 70px
      border-bottom: 1px solid $color-line
      .list-item
        no-wrap()
        font-size: $font-size-14
        .list-link
          &:hover
            color: $color-sub
      // 双行样式
      .list-double-row
        .item-sub
          no-wrap()
          line-height: 1
          margin-top: 8px
          font-size: $font-size-14
          color: $color-text-assist
        .item-dark
          no-wrap()
          font-size: $font-size-14
          line-height: 1

  .pagination-box
    height: 70px
    align-items: center
    display: flex

  .btn-main
    position: relative
    .file-box
      position: absolute
      top: 0
      left: 0
      width: 84px
      height: 28px
      opacity: 0

  .Auditing
    width: 534px
    height: 261px
    background: $color-white
    border-radius: 3px
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.6)
    text-align: center
    .top
      height: 59.5px
      border-bottom: 1px solid $color-line
      align-items: center
      justify-content: space-between
      padding: 0 20px
      layout(row)
      .title
        font-family: $font-family-medium
        font-size: $font-size-16
        color: $color-text-main
      .close
        width: 16px
        height: 16px
        cursor: pointer
        .close-img
          width: 16px
          height: 16px
          display: block
          transition: all 0.3s
          &:hover
            transform: scale(1.1)
    .text-area-box
      .model-area
        font-size: $font-size-14
        width: 494px
        resize: none
        height: 80px
        padding: 12px
        margin: 30px auto 30px
        border: 1px solid $color-line
    .btn-group
      layout(row)
      align-items: center
      justify-content: flex-end
      padding-right: 20px
      .btn-item
        width: 96px
        line-height: 40px
        margin-left: 10px
        cursor: pointer
        text-align: center
        border: 1px solid $color-text-assist
        border-radius: 4px
        font-family: $font-family-regular
        font-size: $font-size-16
        color: $color-text-main
        height: 40px
        &:nth-child(2)
          color: $color-positive
          border-color: $color-positive
        &:nth-child(3)
          background: $color-positive
          color: $color-white
          border-color: $color-positive

</style>
