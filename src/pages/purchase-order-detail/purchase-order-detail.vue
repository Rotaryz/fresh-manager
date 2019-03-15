<template>
  <div class="purchase-order-detail table">
    <div class="down-content">
      <div class="down-item-text">
        <span class="down-text">采购单号：{{purchaseDetail.order_sn}}</span>
      </div>
      <div class="down-item-text">
        <span class="down-text">采购商品数：{{purchaseDetail.task_num}}</span>
      </div>
      <div class="down-item-text">
        <span class="down-text">预采购金额：￥{{purchaseDetail.per_amount}}</span>
      </div>
      <div class="down-item-text">
        <span class="down-text">供应商：{{purchaseDetail.supply_name}}</span>
      </div>
      <div class="down-item-text">
        <span class="down-text">状态：{{purchaseDetail.status_str}}</span>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-inventory@2x.png" class="identification-icon">
          <p class="identification-name">采购单详情</p>
        </div>
        <div class="function-btn">
          <a :href="downUrl" target="_blank" class="btn-main">导出采购单</a>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in purchaseDetail.detail_list" :key="index" class="list-content list-box">
            <div class="list-item">{{item.goods_name}}</div>
            <div class="list-item">{{item.goods_category}}</div>
            <div class="list-item">{{item.purchase_unit}}</div>
            <div class="list-item">{{item.base_unit}}</div>
            <div class="list-item">{{item.purchase_price}}</div>
            <div class="list-item">{{item.purchase_amount ? '￥' : ''}}{{item.purchase_amount}}</div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pages"></base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {supplyComputed, supplyMethods} from '@state/helpers'

  const PAGE_NAME = 'PURCHASE_ORDER_DETAIL'
  const TITLE = '采购单详情'
  const COMMODITIES_LIST = ['商品', '分类', '采购数量(采购单位)', '采购数量(销售单位)', '采购单价', '采购金额']
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
      console.log(this.downUrl)
    },
    methods: {
      ...supplyMethods,
      _importFile(e) {
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .purchase-order-detail
    .list-box
      .list-item
        padding-right: 14px
        &:nth-child(1)
          flex: 2
</style>
