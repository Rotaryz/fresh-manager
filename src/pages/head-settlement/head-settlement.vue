<template>
  <div class="head-settlement">
    <div class="tab-header">
      <base-search placeHolder="社区名称/团长名称/团长账号" @search="_search"></base-search>
    </div>
    <div class="list-header list-box">
      <div v-for="(item,index) in listTitle" :key="index" class="list-item">{{item}}</div>
    </div>
    <div class="list">
      <div class="list-content list-box">
        <div class="list-item">d</div>
        <div class="list-item">d</div>
        <div class="list-item">d</div>
        <div class="list-item">d</div>
        <div class="list-item">d</div>
        <div class="list-item list-operation-box">
          <router-link tag="span" :to="'settlement-detail?id='" append class="list-operation">详情</router-link>
        </div>
      </div>
    </div>
    <div class="pagination-box">
      <!--:pageDetail="pageTotal"-->
      <base-pagination ref="pages" @addPage="_getMoreList"></base-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
// import API from '@api'

  const PAGE_NAME = 'PURCHASE_MANAGEMENT'
  const TITLE = '团长结算'
  const LIST_TITLE = ['团长账号', '团长名称', '社区名称', '已结算金额', '已结算佣金', '操作']
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        listTitle: LIST_TITLE,
        page: 1,
        orderSn: '',
        excelParams: ''
      }
    },
    computed: {},
    created() {},
    methods: {
      _search(text) {
        this.$refs.pages.beginPage()
        this.page = 1
      },
      _getMoreList(page) {}
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .head-settlement
    overflow: hidden
    flex: 1
    display: flex
    flex-direction: column

  .tab-header
    height: 80px
    display: flex
    justify-content: space-between
    align-items: center
    box-sizing: border-box

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
      &:last-child
        flex: 0.6

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
</style>
