<template>
  <div class="stock-taking table">
    <div class="down-content">
      <!--时间选择-->
      <span class="down-tip">建单时间</span>
      <div class="down-item">
        <base-date-select placeHolder="请选择建单时间" @getTime="setTime"></base-date-select>
      </div>
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="盘点单号" @search="searchOrderSn"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-inventory_list@2x.png" class="identification-icon">
          <p class="identification-name">盘点单列表</p>
        </div>
        <div class="function-btn">
          <router-link to="edit-stock" append class="btn-main">新建盘点<span class="add-icon"></span></router-link>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-if="adjustOrder.length">
            <div v-for="(item, index) in adjustOrder" :key="index" class="list-content list-box">
              <div class="list-item">{{item.created_at}}</div>
              <div class="list-item">{{item.order_sn}}</div>
              <div class="list-item">{{item.system_stock}}</div>
              <div class="list-item">{{item.actual_stock}}</div>
              <div class="list-item">{{item.diff_stock}}</div>
              <div class="list-item">{{item.diff_price}}</div>
              <div class="list-item">{{item.operate}}</div>
              <div class="list-item">
                <router-link :to="`stock-detail/${item.id}`" append class="list-operation">详情</router-link>
              </div>
            </div>
          </div>
          <base-blank v-else></base-blank>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pageDetail="adjustPageTotal" @addPage="addPage"></base-pagination>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import {storeComputed, storeMethods} from '@state/helpers'

  const PAGE_NAME = 'STOCK_TAKING'
  const TITLE = '库存盘点'
  const COMMODITIES_LIST = ['建单时间', '盘点单号', '库存数量', '盘点数量', '差异数量', '差异金额(元)', '操作人', '操作']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        startTime: '',
        endTime: '',
        keyword: '',
        page: 1
      }
    },
    computed: {
      ...storeComputed
    },
    methods: {
      ...storeMethods,
      _getAdjustOrder() {
        this.getAdjustOrder({page: this.page, startTime: this.startTime, endTime: this.endTime, keyword: this.keyword, loading: false})
      },
      setTime(value) {
        this.startTime = value[0]
        this.endTime = value[1]
        this.page = 1
        this.$refs.pagination.beginPage()
        this._getAdjustOrder()
      },
      searchOrderSn(value) {
        this.keyword = value
        this.page = 1
        this.$refs.pagination.beginPage()
        this._getAdjustOrder()
      },
      addPage(page) {
        this.page = page
        this._getAdjustOrder()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .list-box
    .list-item
      align-items: center
      &:nth-child(1)
        flex: 1.4
      &:nth-child(2)
        flex: 2
      &:last-child
        padding: 0
        max-width: 50px
</style>
