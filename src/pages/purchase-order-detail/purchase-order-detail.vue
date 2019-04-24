<template>
  <div class="purchase-order-detail table">
    <div class="down-content purchase-down">
      <div class="down-item-text">
        <span class="header-text">采购单号：{{purchaseDetail.order_sn}}</span>
      </div>
      <div class="down-item-text">
        <span class="header-text">采购商品数：{{purchaseDetail.task_num}}</span>
      </div>
      <div class="down-item-text">
        <span class="header-text">预采购金额：￥{{purchaseDetail.per_amount}}</span>
      </div>
      <div class="down-item-text">
        <span class="header-text">供应商：{{purchaseDetail.supply_name}}</span>
      </div>
      <div class="down-item-text">
        <span class="header-text">状态：{{purchaseDetail.status_str}}</span>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-inventory@2x.png" class="identification-icon">
          <p class="identification-name">商品明细</p>
        </div>
        <div class="function-btn">
          <a :href="downUrl" target="_blank" class="btn-main">导出采购单</a>
        </div>
      </div>
      <div class="purchase-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in purchaseDetail.details" :key="index" class="list-content list-box">
            <div class="list-item list-double-row">
              <div class="item-dark">{{item.goods_name}}</div>
              <div class="item-dark">{{item.goods_sku_encoding}}</div>
            </div>
            <div class="list-item">{{item.goods_category}}</div>
            <div class="list-item">{{item.purchase_num}}{{item.purchase_unit}}</div>
            <div class="list-item">{{item.base_num}}{{item.base_unit}}</div>
            <div class="list-item">{{item.purchase_price ? '￥' : ''}}{{item.purchase_price}}/{{item.purchase_unit}}</div>
            <div class="list-item">{{item.purchase_amount ? '￥' : ''}}{{item.purchase_amount}}</div>
          </div>
        </div>
      </div>
      <!--<div class="pagination-box">-->
      <!--<base-pagination ref="pages"></base-pagination>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {supplyComputed, supplyMethods} from '@state/helpers'

  const PAGE_NAME = 'PURCHASE_ORDER_DETAIL'
  const TITLE = '采购单详情'
  const COMMODITIES_LIST = ['商品', '分类', '采购数量(采购单位)', '采购数量(基本单位)', '采购单价', '采购金额']
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        downUrl: ''
      }
    },
    computed: {
      ...supplyComputed
    },
    created() {
      let currentId = this.getCurrentId()
      let token = this.$storage.get('auth.currentUser', '')
      let params = `${this.$route.params.id}?access_token=${token.access_token}&current_corp=${currentId}`
      this.downUrl = process.env.VUE_APP_SCM_API + `/scm/api/backend/purchase/purchase-order-export/${params}`
    },
    methods: {
      ...supplyMethods,
      _importFile(e) {}
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .purchase-order-detail
    .header-text
      font-size: 14px
    .list-box
      .list-item
        padding-right: 14px
        &:nth-child(1)
          flex: 1.5
        &:nth-child(6)
          flex: 0.5

  .purchase-list
    padding-bottom: 20px

  .purchase-down
    padding:5px 20px 25px
    box-sizing: border-box
    align-items: flex-start
</style>
