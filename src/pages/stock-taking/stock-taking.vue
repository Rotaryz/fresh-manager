<template>
  <div class="stock-taking table">
    <div class="down-content">
      <!--时间选择-->
      <span class="down-tip">建单时间</span>
      <div class="down-item">
        <base-date-select placeHolder="请选择建单时间" :dateInfo="timeArr" @getTime="setTime"></base-date-select>
      </div>
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="盘点单号" :infoText="stockFilter.keyword" @search="searchOrderSn"></base-search>
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
        <base-pagination ref="pagination" :pagination="stockFilter.page" :pageDetail="adjustPageTotal" @addPage="addPage"></base-pagination>
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
      ...storeComputed,
      timeArr() {
        return [this.stockFilter.start_time, this.stockFilter.end_time]
      }
    },
    methods: {
      ...storeMethods,
      _getAdjustOrder(params) {
        this.SET_STOCK_PARAMS(params)
        this.getAdjustOrder({loading: false})
        if (params.page === 1) {
          this.$refs.pagination.beginPage()
        }
      },
      setTime(value) {
        this._getAdjustOrder({page: 1, start_time: value[0], end_time: value[1]})
      },
      searchOrderSn(value) {
        this._getAdjustOrder({keyword: value, page: 1})
      },
      addPage(page) {
        this._getAdjustOrder({page})
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
