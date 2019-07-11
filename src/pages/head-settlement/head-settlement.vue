<template>
  <div class="head-settlement table">
    <div class="down-content">
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="社区名称/团长名称/团长账号" :infoText="headFitter.keyword" @search="_search"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-order_list2@2x.png" class="identification-icon">
          <p class="identification-name">团长佣金列表</p>
        </div>
        <div class="function-btn">
        </div>
      </div>
      <div class="big-list">
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
              <!--<router-link tag="span" :to="`settlement-detail/${item.shop_id}/${item.name}-${item.mobile}`" append class="list-operation">详情</router-link>-->
              <div class="list-operation" @click="jumpDetail(item)">详情</div>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pages" :pagination="headFitter.page" :pageDetail="pageTotal" @addPage="_getMoreList"></base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {leaderComputed, leaderMethods} from '@state/helpers'

  const PAGE_NAME = 'PURCHASE_MANAGEMENT'
  const TITLE = '团长佣金'
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
      jumpDetail(item) {
        this.resetHeadDetailData()
        this.$router.push(`/home/head-settlement/settlement-detail/${item.shop_id}/${item.name}-${item.mobile}`)
      },
      _search(keyword) {
        this.SET_PARAMS({page: 1, keyword})
        this.getSettlementList({loading: false})
        this.$refs.pages.beginPage()
      },
      _getMoreList(page) {
        this.SET_PARAMS({page})
        this.getSettlementList({loading: false})
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
      &:nth-child(3)
        flex: 1.7
      &:last-child
        max-width: 50px
        padding: 0
        flex: 0.6
</style>
