<template>
  <div class="stock-detail table">
    <div class="down-content">
      <div class="down-item-text down-item-text-big">盘点单号：{{detail.order_sn}}</div>
      <div class="down-item-text down-item-text-center">建单时间：{{detail.created_at}}</div>
      <div class="down-item-text">库存数量：{{detail.system_stock}}</div>
      <div class="down-item-text">盘点数量：{{detail.actual_stock}}</div>
      <div class="down-item-text">差异数量：{{detail.diff_stock}}</div>
      <div class="down-item-text">差异金额：<span class="block">￥{{detail.diff_price}}</span></div>
      <div class="down-item-text">操作人：{{detail.operate}}</div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-stock_detailed@2x.png" class="identification-icon">
          <p class="identification-name">库存明细</p>
        </div>
        <div class="function-btn">
          <div class="btn-main" @click="storeExcel">导出excel</div>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-if="adjustOrderDetail.length">
            <div v-for="(item, index) in adjustOrderDetail" :key="index" class="list-content list-box">
              <div class="list-item">{{index + 1}}</div>
              <div class="list-item list-double-row">
                <div class="item-dark">{{item.goods_name}}</div>
                <div class="item-sub">{{item.goods_sku_encoding}}</div>
              </div>
              <div class="list-item">{{item.goods_category}}</div>
              <div class="list-item">{{item.base_unit}}</div>
              <div class="list-item">{{item.system_stock}}</div>
              <div class="list-item">{{item.actual_stock}}</div>
              <div class="list-item">{{item.diff_stock}}</div>
              <div class="list-item">{{item.diff_price}}</div>
              <div class="list-item"><span class="list-status" :class="{'list-status-success': item.adjust_type === 0, 'list-status-warn': item.adjust_type === 2}"></span>{{item.adjust_type_str}}</div>
            </div>
          </div>
          <!--空白页-->
          <base-blank v-else></base-blank>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pageDetail="adjustDetailPageTotal" @addPage="addPage"></base-pagination>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import {storeComputed, storeMethods, authComputed} from '@state/helpers'
  import API from '@api'

  const PAGE_NAME = 'STOCK_DETAIL'
  const TITLE = '盘点详情'
  const COMMODITIES_LIST = [
    '序号',
    '商品',
    '分类',
    '基本单位',
    '库存数量',
    '盘点数量',
    '差异数量',
    '差异金额(元)',
    '调整类型'
  ]
  const ADJUST_ORDER_DETAIL = '/scm/api/backend/stock/adjust-order-detail-export/'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        page: 1,
        id: this.$route.params.id,
        detail: {}
      }
    },
    computed: {
      ...storeComputed,
      ...authComputed
    },
    async created() {
      await this._getDetail()
    },
    methods: {
      ...storeMethods,
      async _getDetail() {
        let res = await API.Store.adjustOorderMsg(this.id)
        this.detail = res.error === this.$ERR_OK ? res.data : {}
      },
      storeExcel() {
        let currentId = this.getCurrentId()
        let data = {
          current_corp: currentId,
          current_shop: process.env.VUE_APP_CURRENT_SHOP,
          access_token: this.currentUser.access_token
        }
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        let url = process.env.VUE_APP_SCM_API + ADJUST_ORDER_DETAIL + this.id + '?' + search.join('&')
        window.open(url)
      },
      addPage(page) {
        this.page = page
        this.getAdjustOrderDetail({id: this.id, page: this.page})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .down-content
    align-items: flex-start
    padding: 5px 20px 25px
    box-sizing: border-box
  .block
    font-family: $font-family-medium
  .list-box
    .list-item
      align-items: center
      &:nth-child(1)
        flex: 0.4
      &:nth-child(2)
        flex: 1.7
      &:nth-child(3)
        flex: 1.3
      &:last-child
        padding: 0
        max-width: 80px
  .down-item-text
    min-width: 100px
  .down-item-text-center
    min-width: 200px
  .down-item-text-big
    min-width: 242px
</style>
