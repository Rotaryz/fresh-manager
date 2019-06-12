<template>
  <div class="procurement-suggest table">
    <div class="down-content">
      <!--下拉选择-->
      <span class="down-tip">供应商</span>
      <div class="down-item">
        <base-drop-down :select="supplyTask" @setValue="_setValue"></base-drop-down>
      </div>
      <!--搜索-->
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="商品名称搜索" @search="_search"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-order_list2@2x.png" class="identification-icon">
          <p class="identification-name">预采建议单</p>
          <div class="identification-text">{{timeDay}}({{pageTotal.total}})</div>
        </div>
        <div class="function-btn">
          <div class="btn-main g-btn-item" @click="_sendPublish">查询</div>
          <a :href="downUrl" class="btn-main g-btn-item" target="_blank">导出</a>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box list-box-goods">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-if="purchaseTaskList.length">
            <div v-for="(item, index) in purchaseTaskList" :key="index" class="list-content list-box list-box-goods">
              <div class="list-item list-double-row">
                <div class="item-dark">{{item.goods_name}}</div>
                <div class="item-dark">{{item.goods_sku_encoding}}</div>
              </div>
              <div class="list-item">{{item.goods_category}}</div>
              <div class="list-item">{{item.supplier}}</div>
              <div class="list-item">{{item.purchase_user}}</div>
              <div class="list-item">{{item.sale_purchase_num}}{{item.purchase_unit}}({{item.sale_base_num}}{{item.base_unit}})</div>
              <div class="list-item">{{item.usable_stock_purchase_num}}{{item.purchase_unit}}({{item.usable_stock}}{{item.base_unit}})</div>
              <div class="list-item">{{item.plan_num}}{{item.purchase_unit}}({{item.plan_base_num}}{{item.base_unit}})</div>
              <div class="list-item">{{item.created_at}}</div>
            </div>
          </div>
          <base-blank v-else></base-blank>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pages" :pageDetail="pageTotal" @addPage="_getMoreList"></base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import {proTaskComputed, proTaskMethods} from '@state/helpers'
  const PAGE_NAME = 'PROCUREMENT_SUGGEST'
  const TITLE = '预采建议'
  const COMMODITIES_LIST = ['商品', '分类', '供应商', '采购员', '商品销售数', '库存数', '建议采购数', '创建时间']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        supplyTask: {
          check: false,
          show: false,
          content: '全部',
          type: 'default',
          data: [{name: '全部', id: ''}]
        },
        page: 1,
        startTime: '',
        endTime: '',
        keyword: '',
        time: 'today',
        status: '',
        supplyId: '',
        downUrl: ''
      }
    },
    computed: {
      ...proTaskComputed
    },
    async created() {
      this._getUrl()
      await this._getSupplierList()
    },
    methods: {
      ...proTaskMethods,
      // 获取供应商列表
      _getUrl() {
        let currentId = this.getCurrentId()
        let token = this.$storage.get('auth.currentUser', '')
        let params = `access_token=${token.access_token}&start_time=${this.startTime}&end_time=${this.endTime}&status=${
          this.status}&keyword=${this.keyword}&supplier_id=${this.supplyId}&is_blocked=1&current_corp=${currentId}`
        this.downUrl = process.env.VUE_APP_SCM_API + `/scm/api/backend/purchase/purchase-task-export?${params}`
      },
      async _getSupplierList() {
        let res = await API.Supply.getSupplier({
          keyword: ''
        })
        if (res.error !== this.$ERR_OK) {
          return
        }
        res.data.forEach((item) => {
          item.name = item.supplier_name
        })
        this.supplyTask.data = this.supplyTask.data.concat(res.data)
      },
      async _setValue(item) {
        this.supplyId = item.id
        this.page = 1
        this.$refs.pages.beginPage()
        this.getPurchaseTaskList({
          time: this.time,
          startTime: this.startTime,
          endTime: this.endTime,
          keyword: this.keyword,
          status: this.status,
          page: this.page,
          supplyId: this.supplyId,
          isBlocked: 1,
          loading: false
        })
        this._getUrl()
      },
      async _search(word) {
        this.keyword = word
        this.page = 1
        this.$refs.pages.beginPage()
        this.getPurchaseTaskList({
          time: this.time,
          startTime: this.startTime,
          endTime: this.endTime,
          keyword: this.keyword,
          status: this.status,
          page: this.page,
          supplyId: this.supplyId,
          isBlocked: 1,
          loading: false
        })
        this._getUrl()
      },
      async _getMoreList(page) {
        if (this.page === page) {
          return
        }
        this.page = page
        await this.getPurchaseTaskList({
          time: this.time,
          startTime: this.startTime,
          endTime: this.endTime,
          keyword: this.keyword,
          status: this.status,
          page: this.page,
          supplyId: this.supplyId,
          loading: false
        })
      },
      async _sendPublish() {
        let supplyRes = await API.Supply.autoPurchaseTask()
        this.$loading.hide()
        if (supplyRes.error !== this.$ERR_OK) {
          this.$toast.show(supplyRes.message)
          return
        }
        this.page = 1
        this.$refs.pages.beginPage()
        this.getPurchaseTaskList({
          time: this.time,
          startTime: this.startTime,
          endTime: this.endTime,
          keyword: this.keyword,
          status: this.status,
          page: this.page,
          supplyId: this.supplyId,
          isBlocked: 1,
          loading: false
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .procurement-suggest
    width: 100%
  .identification-text
    font-size: $font-size-16
    color: $color-text-main
    font-family: $font-family-regular
    margin-left: 30px
</style>
