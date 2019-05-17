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
        <base-search placeHolder="出库单号或商户名称" @search="changeKeyword"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-warehousing@2x.png" class="identification-icon">
          <p class="identification-name">出库列表</p>
          <base-status-tab :statusList="dispatchSelect" :infoTabIndex="statusTab" @setStatus="setValue"></base-status-tab>
        </div>
        <div class="function-btn">
          <div class="btn-main" @click="showBatchOut">批量出库</div>
          <router-link tag="div" :to="{path: `edit-store`}" append class="btn-main g-btn-item">新建出库单<span class="add-icon"></span></router-link>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-if="productOutList.length">
            <div v-for="(item, index) in productOutList" :key="index" class="list-content list-box">
              <div class="list-item">{{item.build_time}}</div>
              <div class="list-item">{{item.order_sn}}</div>
              <div class="list-item">
                <router-link tag="a" target="_blank" :to="{path: `merchant-order/merchant-order-detail/${item.source_order_id}`}" class="list-operation">{{item.out_order_sn}}</router-link>
              </div>
              <!--<div class="list-item">{{item.out_order_sn}}</div>-->
              <div class="list-item">{{item.merchant_name}}</div>
              <div class="list-item">￥{{item.total}}</div>
              <div class="list-item"><span class="list-status" :class="{'list-status-success': item.status === 1}"></span>{{item.status_str}}</div>
              <div class="list-item list-operation-box">
                <router-link v-if="item.status === 1" tag="span" :to="{path: `out-detail/${item.out_order_id}`}" append class="list-operation">详情</router-link>
                <router-link v-if="item.status === 0" tag="span" :to="{path: `out-detail/${item.out_order_id}`}" append class="list-operation-strong">出库</router-link>
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
    <default-confirm ref="confirm" @confirm="batchOut"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
// import {DatePicker} from 'iview'
  import _ from 'lodash'
  import API from '@api'
  import {productComputed} from '@state/helpers'
  import DefaultConfirm from '@components/default-confirm/default-confirm'

  const PAGE_NAME = 'PROCUREMENT_TASK'
  const TITLE = '成品出库'
  const COMMODITIES_LIST = ['建单时间', '出库单号', '关联订单号', '商户名称', '出库金额', '状态', '操作']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultConfirm
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        productOutList: [],
        pageTotal: {},
        status: 0,
        startTime: '',
        endTime: '',
        keyWord: '',
        goodsPage: 1,
        dispatchSelect: [
          {name: '全部', value: '', key: 'all', num: 0},
          {name: '待出库', value: 0, key: 'wait_out', num: 0},
          {name: '已完成', value: 1, key: 'success', num: 0}
        ],
        statistic: {
          all: 0,
          wait_out: 0,
          success: 0
        },
        statusTab: 1,
        time: ['', '']
      }
    },
    computed: {
      ...productComputed
    },
    async created() {
      if (this.$route.query.status) {
        this.statusTab = this.$route.query.status * 1 + 1
        this.status = this.$route.query.status * 1
      }
      this.productOutList = _.cloneDeep(this.outList)
      this.pageTotal = _.cloneDeep(this.outPageTotal)
      await this._statistic()
    },
    methods: {
      // 批量出库
      async batchOut() {
        let res = await API.Store.batchOut()
        this.$toast.show(res.message)
        if (res.error === this.$ERR_OK) {
          this.goodsPage = 1
          this.getProductListData()
          await this._statistic()
          this.$refs.pagination.beginPage()
        }
      },
      showBatchOut() {
        if (this.status !== 0 || (this.status === 0 && !this.productOutList.length)) {
          this.$toast.show('暂无出库单')
          return
        }
        this.$refs.confirm.show('是否确认批量出库？')
      },
      async _statistic() {
        let res = await API.Store.outOrdersStatistic({
          start_time: this.time[0],
          end_time: this.time[1],
          keyword: this.keyWord
        })
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
        API.Store.getOutList(data, false).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.productOutList = res.data
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
      async changeEndTime(value) {
        this.endTime = value
        if (Date.parse(this.startTime) > Date.parse(this.endTime)) {
          this.$toast.show('结束时间不能小于开始时间')
          return
        }
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
          max-width: 70px
        &:nth-child(1)
          flex: 1.1
        &:nth-child(5), &:nth-child(6)
          flex: 0.7
        &:nth-child(2), &:nth-child(3)
          flex: 1.5

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
