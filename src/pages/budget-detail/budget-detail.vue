<template>
  <div class="budget-detail">
    <div class="tab-header">
      <base-drop-down :width="152"></base-drop-down>
    </div>
    <div class="list-header list-box">
      <div v-for="(item,index) in listTitle" :key="index" class="list-item">{{item}}</div>
    </div>
    <div class="list">
      <div class="list-content list-box">
        <div class="list-item">法国队和</div>
        <div class="list-item">发</div>
        <div class="list-item">的</div>
        <div class="list-item">的</div>
        <div class="list-item">的</div>
        <div class="list-item">是</div>
      </div>
    </div>
    <div class="pagination-box">
      <!--:pageDetail="pageTotal"-->
      <base-pagination ref="pages" @addPage="_getMoreList"></base-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'BUDGET_DETAIL'
  const TITLE = '收支明细'

  const LIST_TITLE = ['生成时间', '类型', '收入', '支出', '余额', '关联订单号']
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        listTitle: LIST_TITLE,
        page: 1
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

  .budget-detail
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
