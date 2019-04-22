<template>
  <div class="procurement-task table">
    <div class="down-content">
      <!--时间选择-->
      <span class="down-tip">建单时间</span>
      <div class="down-item">
        <base-date-select placeHolder="请选择建单时间" @getTime="changeStartTime"></base-date-select>
      </div>
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="入库单号或采购单号" @search="changeKeyword"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-warehousing@2x.png" class="identification-icon">
          <p class="identification-name">入库列表</p>
          <base-status-tab :statusList="dispatchSelect" :infoTabIndex="statusTab" @setStatus="setValue"></base-status-tab>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-if="productEnterList.length">
            <div v-for="(item, index) in productEnterList" :key="index" class="list-content list-box">
              <div class="list-item">{{item.build_time}}</div>
              <div class="list-item">{{item.order_sn}}</div>
              <div class="list-item">{{item.supplier}}</div>
              <router-link tag="a" target="_blank" :to="{path: `purchase-order/purchase-order-detail/${item.source_order_id}`}" class="list-item list-operation">{{item.out_order_sn}}</router-link>
              <div class="list-item">￥{{item.total}}</div>
              <div class="list-item"><span class="list-status" :class="{'list-status-success': item.status === 1}"></span>{{item.status_str}}</div>
              <div class="list-item list-operation-box">
                <router-link v-if="item.status === 1" tag="span" :to="{path: `enter-detail/${item.entry_order_id}`}" append class="list-operation">详情</router-link>
                <div v-if="item.status === 0" class="list-operation" @click="entryOrdersExport(item)">导出</div>
                <router-link v-if="item.status === 0" tag="span" :to="{path: `enter-detail/${item.entry_order_id}`}" append class="list-operation-strong">入库</router-link>
                <div v-if="item.status === 1" class="list-operation" @click="difference(item)">差异报告</div>
              </div>
            </div>
          </div>
          <base-blank v-else></base-blank>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pageDetail="pageTotal" @addPage="addPage"></base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import _ from 'lodash'
  import API from '@api'
  import {productComputed, authComputed} from '@state/helpers'

  const PAGE_NAME = 'PROCUREMENT_TASK'
  const TITLE = '成品入库'
  const COMMODITIES_LIST = ['建单时间', '入库单号', '供应商', '采购单号', '入库金额', '状态', '操作']
  const ENTRY_ORDERS_EXPORT = '/scm/api/backend/warehouse/entry-orders-export/'
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        productEnterList: [],
        pageTotal: {},
        status: 0,
        startTime: '',
        endTime: '',
        keyWord: '',
        goodsPage: 1,
        dispatchSelect: [
          {name: '全部', value: '', key: 'all', num: 0},
          {name: '待入库', value: 0, key: 'wait_submit', num: 0},
          {name: '已完成', value: 1, key: 'success', num: 0}
        ],
        statistic: {
          all: 0,
          wait_submit: 0,
          success: 0
        },
        accurateStart: '',
        accurateEnd: '',
        statusTab: 1,
        time: ['', '']
      }
    },
    computed: {
      ...productComputed,
      ...authComputed
    },
    async created() {
      if (this.$route.query.status) {
        this.statusTab = this.$route.query.status * 1 + 1
        this.status = this.$route.query.status * 1
      }
      this.productEnterList = _.cloneDeep(this.enterList)
      this.pageTotal = _.cloneDeep(this.statePageTotal)
      await this._statistic()
    },
    methods: {
      _setDownUrl(item, excelUrl) {
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
        let url = process.env.VUE_APP_SCM_API + ENTRY_ORDERS_EXPORT + item.id + '?' + search.join('&')
        window.open(url)
      },
      entryOrdersExport(item) {
        this._setDownUrl(item, ENTRY_ORDERS_EXPORT)
      },
      difference(item) {
        // todo 导出差异化链接未设置
        this._setDownUrl(item, '')
      },
      async _statistic() {
        let res = await API.Store.entryOrdersStatistic(
          {
            tart_time: this.time[0],
            end_time: this.time[1],
            keyword: this.keyWord
          }
        )
        this.statistic = res.error === this.$ERR_OK ? res.data : {}
        for (let key in this.statistic) {
          let index = this.dispatchSelect.findIndex((item) => item.key === key)
          this.dispatchSelect[index].num = this.statistic[key]
        }
      },
      getProductListData() {
        let data = {
          status: this.status,
          page: this.goodsPage,
          limit: 10,
          start_time: this.time[0],
          end_time: this.time[1],
          keyword: this.keyWord
        }
        API.Store.getEnterList(data, false).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.productEnterList = res.data
            let statePageTotal = {
              total: res.meta.total,
              per_page: res.meta.per_page,
              total_page: res.meta.last_page
            }
            this.pageTotal = statePageTotal
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      async changeKeyword(keyword) {
        this.keyWord = keyword
        this.goodsPage = 1
        this.getProductListData()
        await this._statistic()
        this.$refs.pagination.beginPage()
      },
      async changeStartTime(value) {
        this.time = value
        this.goodsPage = 1
        this.getProductListData()
        await this._statistic()
        this.$refs.pagination.beginPage()
      },
      setValue(item) {
        this.status = item.value
        this.goodsPage = 1
        this.getProductListData()
        this.$refs.pagination.beginPage()
      },
      addPage(page) {
        this.goodsPage = page
        this.getProductListData()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .procurement-task
    .list-box
      .list-item
        padding-right: 14px
        &:last-child
          max-width: 110px
        &:nth-child(8), &:nth-child(1)
          flex: 1.5
        &:nth-child(4), &:nth-child(2)
          flex: 1.7
  .list-item-progress
    display: flex
    align-items: flex-end
    .progress-content
      .progress-num
        font-size: $font-size-10
        color: $color-text-main
        line-height: 1
        margin-bottom: 5px
        font-family: $font-family-regular
      .progress-bar
        margin: 0
        width: 100px
        height: 5px
        border-radius: 3px
        background: #EBEBEB
        position: relative
        .progress-bar-active
          height: 100%
          position: absolute
          top: 0
          left: 0
          border-radius: 3px
          background: $color-main
          width: 50%
    .progress-percentage
      margin-left: 8px
      line-height: 1
      font-size: $font-size-14

  .tip
    margin: 0 2px
    font-size: $font-size-14
</style>
