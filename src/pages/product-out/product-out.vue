<template>
  <div class="procurement-task table">
    <div class="down-content">
      <!--时间选择-->
      <span class="down-tip">建单时间</span>
      <div class="down-item">
        <base-date-select placeHolder="请选择建单时间" @getTime="changeStartTime" :dateInfo="dateInfo"></base-date-select>
      </div>
      <span class="down-tip">异常状态</span>
      <div class="down-item">
        <base-drop-down :select="errorObj" @setValue="checkErr"></base-drop-down>
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
          <base-status-nav :statusList="dispatchSelect" :value="status" valueKey="status" labelKey="status_str" numKey="statistic"
                           @change="setValue"
          ></base-status-nav>
          <!--<base-status-tab :statusList="dispatchSelect" :infoTabIndex="statusTab" @setStatus="setValue"></base-status-tab>-->
        </div>
        <div class="function-btn">
          <div v-if="status===0" class="btn-main" @click="showBatchOut">批量出库</div>
          <div v-if="status===2" class="btn-main" @click="showBatchRecheck">批量复核</div>
          <router-link tag="div" :to="{path: `edit-store`}" append class="btn-main g-btn-item">新建出库单<span class="add-icon"></span></router-link>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-if="productOutList.length">
            <div v-for="(item, index) in productOutList" :key="index" :class="{'list-lock': item.show_sorting}" class="list-content list-box">
              <div class="list-item">{{item.build_time}}</div>
              <div class="list-item">{{item.order_sn}}</div>
              <div class="list-item">
                <router-link tag="a" target="_blank" :to="{path: `merchant-order/merchant-order-detail/${item.source_order_id}`}" class="list-operation">{{item.out_order_sn}}</router-link>
              </div>
              <!--<div class="list-item">{{item.out_order_sn}}</div>-->
              <div class="list-item">{{item.merchant_name}}</div>
              <div class="list-item">{{item.order_num}}</div>
              <div class="list-item">{{item.out_num}}</div>
              <div class="list-item">￥{{item.total}}</div>
              <div class="list-item">
                <span class="list-status" :class="{'list-status-success': item.status === 1,'list-status-warn': item.status === 2 }"></span>
                {{item.status_str}}
                <div v-if="item.show_sorting" class="list-item-img"></div>
              </div>
              <div class="list-item list-operation-box">
                <router-link v-if="item.status === 1" tag="span" :to="{path: `out-detail/${item.out_order_id}`}" append class="list-operation">详情</router-link>
                <router-link v-if="item.status === 0" tag="span" :to="{path: `out-detail/${item.out_order_id}`}" append class="list-operation-strong">出库</router-link>
                <span v-if="item.status === 2" class="list-operation-strong" @click="goDetail(item)">复核</span>
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
    <default-confirm ref="confirm" @confirm="sureSubmit"></default-confirm>
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
  const COMMODITIES_LIST = [
    '建单时间',
    '出库单号',
    '关联订单号',
    '商户名称',
    '订单数量',
    '出库数量',
    '出库金额',
    '状态',
    '操作'
  ]

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
        status: 2,
        startTime: this.$route.query.startTime || '',
        endTime: this.$route.query.endTime || '',
        exceptionStatus: this.$route.query.exception_status || '',
        keyWord: '',
        goodsPage: 1,
        dispatchSelect: [
          {name: '全部', value: '', key: 'all', num: 0},
          {name: '待出库', value: 0, key: 'wait_out', num: 0},
          {name: '已完成', value: 1, key: 'success', num: 0}
        ],
        // statusTab: 1,
        time: ['', ''],
        errorObj: {
          check: false,
          show: false,
          content: '全部',
          type: 'default',
          data: [{name: '全部', status: ''}, {name: '正常', status: '0'}, {name: '异常', status: '1'}] // 格式：{name: '55'}
        }
      }
    },
    computed: {
      ...productComputed,
      dateInfo() {
        return [this.startTime, this.endTime]
      }
    },
    async created() {
      this._setErrorStatus()
      this.productOutList = _.cloneDeep(this.outList)
      this.pageTotal = _.cloneDeep(this.outPageTotal)
      await this._statistic()
      if (this.$route.query.status) {
        this.statusTab = this.dispatchSelect.findIndex((item) => item.status * 1 === this.$route.query.status * 1)
        this.status = this.$route.query.status * 1
      }
    },
    methods: {
      async checkErr(item) {
        this.exceptionStatus = item.status
        this.goodsPage = 1
        this.getProductListData()
        this.$refs.pagination.beginPage()
      },
      _setErrorStatus() {
        let item = this.errorObj.data.find((item) => item.status === this.exceptionStatus)
        this.errorObj.content = item.name || '全部'
      },
      goDetail(item) {
        if (item.show_sorting) {
          return
        }
        this.$router.push(`/home/product-out/out-detail/${item.out_order_id}`)
      },
      async sureSubmit() {
        let type = 'batchOut'
        if (this.status === 2) {
          type = 'batchRecheck'
        }
        let res = await API.Store[type]()
        this.$toast.show(res.message)
        if (res.error === this.$ERR_OK) {
          this.goodsPage = 1
          this.getProductListData()
          await this._statistic()
          this.$refs.pagination.beginPage()
          this.$refs.confirm.hide()
        }
      },
      showBatchOut() {
        if (this.status !== 0 || (this.status === 0 && !this.productOutList.length)) {
          this.$toast.show('暂无出库单')
          return
        }
        this.$refs.confirm.show('是否确认批量出库？')
      },
      showBatchRecheck() {
        if (!this.productOutList.length) {
          this.$toast.show('暂无待复核')
          return
        }
        this.$refs.confirm.show('是否确认批量复核？')
      },
      async _statistic() {
        let res = await API.Store.outOrdersStatistic({
          start_time: this.time[0],
          end_time: this.time[1],
          keyword: this.keyWord,
          exception_status: this.exceptionStatus
        })
        this.dispatchSelect = res.data.status || []
      },
      async getProductListData() {
        let data = {
          status: this.status,
          page: this.goodsPage,
          limit: 10,
          start_time: this.time[0],
          end_time: this.time[1],
          keyword: this.keyWord,
          exception_status: this.exceptionStatus
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
        await this._statistic()
      },
      async changeKeyword(keyword) {
        this.keyWord = keyword
        this.goodsPage = 1
        this.getProductListData()
        this.$refs.pagination.beginPage()
      },
      async changeStartTime(value) {
        this.time = value
        this.goodsPage = 1
        this.getProductListData()
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
        this.$refs.pagination.beginPage()
      },
      async setValue(val) {
        this.status = val
        this.goodsPage = 1
        this.getProductListData()
        this.$refs.pagination.beginPage()
      },
      async addPage(page) {
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
  .list-item-img
    icon-image('icon-lock')
    width: 16px
    height: 15px
    margin-top: 2px
    margin-left: 1px
    background-size: 16px 15px
</style>
