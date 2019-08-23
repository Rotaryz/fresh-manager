<template>
  <div class="purchase-order table">
    <div class="down-content">
      <!--时间选择-->
      <span class="down-tip">生成时间</span>
      <div class="down-item">
        <base-date-select placeHolder="请选择时间" :dateInfo="dateInfo" @getTime="changeStartTime"></base-date-select>
      </div>
      <!--搜索-->
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="采购单号" :infoText="keyword" @search="_search"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-purchase_list@2x.png" class="identification-icon">
          <p class="identification-name">采购单列表</p>
          <base-status-tab :statusList="dispatchSelect" :infoTabIndex="statusTab" @setStatus="_setStatus"></base-status-tab>
        </div>
        <div class="function-btn">
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-if="purchaseList.length">
            <div v-for="(item,index) in purchaseList" :key="index" class="list-content list-box">
              <div class="list-item">{{item.create_day}}</div>
              <div class="list-item">{{item.last_arrival_time}}</div>
              <div class="list-item">{{item.order_sn}}</div>
              <div class="list-item">{{item.task_num}}</div>
              <div class="list-item">{{item.per_amount ? '￥' : ''}}{{item.per_amount}}</div>
              <div class="list-item">{{item.supply_name}}</div>
              <div class="list-item">{{item.purchase_user_name}}</div>
              <div class="list-item">{{item.status_str}}</div>
              <div class="list-item">
                <router-link tag="div" :to="'purchase-order-detail/'+ item.id" append class="list-operation">详情</router-link>
              </div>
            </div>
          </div>
          <base-blank v-else></base-blank>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pages" :pageDetail="pageTotal" :pagination="page" @addPage="_getMoreList"></base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import {supplyComputed, supplyMethods} from '@state/helpers'

  const PAGE_NAME = 'PURCHASE_ORDER'
  const TITLE = '采购单列表'
  const COMMODITIES_LIST = ['生成时间', '最晚到货时间', '采购单号', '采购商品数', '预采购金额', '供应商', '采购员', '状态', '操作']
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        dispatchSelect: [
          {name: '全部', value: '', key: 'all', num: 0},
          {name: '待入库', value: 1, key: 'wait_entry', num: 0},
          {name: '已完成', value: 2, key: 'success', num: 0}
        ],
        taskTime: ['', ''],
        statusTab: 0
      }
    },
    computed: {
      ...supplyComputed,
      dateInfo() {
        return [this.timeStart, this.timeEnd]
      }
    },
    async created() {
      await this._statistic()
      let status = JSON.parse(JSON.stringify(this.status))
      this.statusTab = this.dispatchSelect.findIndex((item) => item.value * 1 === status * 1)
    },
    methods: {
      ...supplyMethods,
      async _setStatus(item) {
        this.setStatus(item.value)
        this.$refs.pages.beginPage()
      },
      async _search(word) {
        this.setKeyword(word)
        this.$refs.pages.beginPage()
        await this._statistic()
      },
      async changeStartTime(value) {
        this.taskTime = value
        this.infoPurchaseTime({start: value[0], end: value[1]})
        this.$refs.pages.beginPage()
        await this._statistic()
      },
      async _getMoreList(page) {
        this.setPage(page)
      },
      async _statistic() {
        let res = await API.Supply.getPurchaseOrderStatistic({
          start_time: this.timeStart,
          end_time: this.timeEnd,
          keyword: this.keyword
        })
        this.statistic = res.error === this.$ERR_OK ? res.data : {}
        for (let key in this.statistic) {
          let index = this.dispatchSelect.findIndex((item) => item.key === key)
          this.dispatchSelect[index].num = this.statistic[key]
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .purchase-order
    .list-box
      .list-item
        padding-right: 14px
        &:last-child
          max-width :50px
          padding: 0
        &:nth-child(3)
          flex: 2.2
        &:nth-child(1)
          flex: 1.1
</style>
