<template>
  <div class="head-settlement table">
    <div class="tab-header">
      <base-search placeHolder="社区名称/团长名称/团长账号" @search="_search"></base-search>
    </div>
    <div class="list-header list-box">
      <div v-for="(item,index) in listTitle" :key="index" class="list-item">{{item}}</div>
    </div>
    <div class="list">
      <div v-for="(item, index) in settlementList" :key="index" class="list-content list-box">
        <div class="list-item">{{item.mobile}}</div>
        <div class="list-item">{{item.name}}</div>
        <div class="list-item">{{item.social_name}}</div>
        <div class="list-item">{{item.settled_total}}</div>
        <div class="list-item">{{item.settle_total}}</div>
        <div class="list-item list-operation-box">
          <router-link tag="span" :to="`settlement-detail/${item.shop_id}/${item.name}-${item.mobile}`" append class="list-operation">详情</router-link>
        </div>
      </div>
    </div>
    <div class="pagination-box">
      <base-pagination ref="pages" :pageDetail="pageTotal" @addPage="_getMoreList"></base-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {leaderComputed, leaderMethods} from '@state/helpers'

  const PAGE_NAME = 'PURCHASE_MANAGEMENT'
  const TITLE = '团长结算'
  const LIST_TITLE = ['团长账号', '团长名称', '社区名称', '已结算佣金', '待结算佣金', '操作']
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        listTitle: LIST_TITLE,
        page: 1,
        keyword: '',
        excelParams: ''
      }
    },
    computed: {
      ...leaderComputed
    },
    methods: {
      ...leaderMethods,
      _search(text) {
        this.$refs.pages.beginPage()
        this.page = 1
        this.keyword = text
        this.getSettlementList({page: this.page, keyword: this.keyword, loading: false})
      },
      _getMoreList(page) {
        this.page = page
        this.getSettlementList({page: this.page, keyword: this.keyword, loading: false})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .tab-header
    height: 80px
    display: flex
    align-items: center
    box-sizing: border-box
    .tab-item
      margin-right: 10px
  .list-box
    .list-item
      box-sizing: border-box
      padding-right: 10px
      flex: 1
      &:last-child
        flex: 0.6

</style>
