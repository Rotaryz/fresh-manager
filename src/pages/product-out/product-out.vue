<template>
  <div class="procurement-task table">
    <div class="down-content">
      <!--时间选择-->
      <span class="down-tip">建单时间</span>
      <div class="down-item">
        <base-date-select placeHolder="请选择建单时间" :dateInfo="dateInfo" @getTime="changeStartTime"></base-date-select>
      </div>
      <span class="down-tip">异常状态</span>
      <div class="down-item">
        <base-drop-down :select="errorObj" @setValue="checkErr"></base-drop-down>
      </div>
      <span class="down-tip">出库类型</span>
      <div class="down-item">
        <base-drop-down :select="outType" @setValue="changeType"></base-drop-down>
      </div>
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="出库单号或商户名称" :infoText="outFilter.keyword" @search="changeKeyword"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-warehousing@2x.png" class="identification-icon">
          <p class="identification-name">出库列表</p>
          <!--<base-status-nav-->
          <!--:statusList="dispatchSelect"-->
          <!--:value="status"-->
          <!--valueKey="status"-->
          <!--labelKey="status_str"-->
          <!--numKey="statistic"-->
          <!--@change="setValue"-->
          <!--&gt;</base-status-nav>-->
          <base-status-tab :statusList="dispatchSelect" :infoTabIndex="statusTab" @setStatus="setValue"></base-status-tab>
        </div>
        <div class="function-btn">
          <div v-if="outFilter.status===0" class="btn-main" @click="showBatchOut">批量出库</div>
          <div v-if="outFilter.status===2" class="btn-main" @click="showBatchRecheck">批量复核</div>
          <router-link tag="div" :to="{path: `edit-store`}" append class="btn-main g-btn-item">新建出库单<span class="add-icon"></span></router-link>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-if="outList.length">
            <div v-for="(item, index) in outList" :key="index" :class="{'list-lock': item.show_sorting}" class="list-content list-box">
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
                <div v-if="item.is_exception" class="list-item-error"></div>
              </div>
              <!--出库类型-->
              <div class="list-item">{{item.type}}</div>
              <div class="list-item list-operation-box">
                <router-link v-if="item.status === 1" tag="span" :to="{path: `out-detail/${item.out_order_id}`}" append class="list-operation">详情</router-link>
                <router-link v-if="item.status === 0" tag="span" :to="{path: `out-detail/${item.out_order_id}`}" append class="list-operation-strong">出库</router-link>
                <span v-if="item.status === 2" class="list-operation-strong" @click="goDetail(item)">复核</span>
                <span v-if="item.status === 0" class="list-operation" @click="stopDocument(item)">关闭</span>
              </div>
            </div>
          </div>
          <base-blank v-else></base-blank>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pagination="outFilter.page" :pageDetail="outPageTotal" @addPage="addPage"></base-pagination>
      </div>
    </div>
    <default-confirm ref="confirm" @confirm="sureSubmit"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  // import {DatePicker} from 'iview'
  // import _ from 'lodash'
  import API from '@api'
  import {productComputed, authComputed, productMethods} from '@state/helpers'
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
    '出库类型',
    '操作'
  ]
  let ws = null
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
        startTime: this.$route.query.start_time || '',
        endTime: this.$route.query.end_time || '',
        exceptionStatus: this.$route.query.exception_status || '',
        keyWord: '',
        goodsPage: 1,
        dispatchSelect: [
          {name: '全部', value: '', key: 'all', num: 0},
          {name: '待复核', value: 0, key: 'wait_out', num: 0},
          {name: '待出库', value: 1, key: 'wait_out', num: 0},
          {name: '已完成', value: 2, key: 'success', num: 0},
          {name: '已关闭', value: 3, key: 'success', num: 0}
        ],
        statusTab: 1,
        time: [this.$route.query.start_time || '', this.$route.query.end_time || '',],
        errorObj: {
          check: false,
          show: false,
          content: '全部',
          type: 'default',
          data: [{name: '全部', status: ''}, {name: '正常', status: '0'}, {name: '异常', status: '1'}] // 格式：{name: '55'}
        },
        outType: {
          check: false,
          show: false,
          content: '全部',
          type: 'default',
          data: [{name: '全部', type: ''}, {name: '人工补录', type: '0'}, {name: '系统补货', type: '1'}, {name: '系统销售', type: '2'}] // 格式：{name: '55'}
        }
      }
    },
    computed: {
      ...productComputed,
      dateInfo() {
        return [this.outFilter.start_time, this.outFilter.end_time]
      }
    },
    async created() {
      this._setErrorStatus()
      this.getEntryOutType()
      await this._statistic()
      this.statusTab = this.dispatchSelect.findIndex((item) => item.status === this.outFilter.status)
    },
    destory() {
      ws = null
    },
    methods: {
      ...productMethods,
      ...authComputed,
      webSocketData(apiUrl) {
        let url =  process.env.VUE_APP_WSS + '/sub'
        let prg = apiUrl + process.env.VUE_APP_CURRENT_CORP
        let id = this.currentUser().manager_info.store_id
        let urlPrg = `wss://${url}?id=${id}&prg=${prg}`
        ws = null
        ws = new WebSocket(urlPrg)
        let that = this
        ws.onmessage = function(event) {
          var data = JSON.parse(event.data)
          if (data.status === 'success') {
            ws.close()
            that._updateList({page: 1})
          }
        }
      },
      getEntryOutType() {
        API.Product.getEntryOutType()
          .then(res => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            this.outType.data = res.data.out.map(item => {
              return {
                name: item.type_str,
                type: item.type
              }
            })
          })
      },
      _updateList(params, noUpdataStatus) {
        this.SET_OUT_PARAMS(params)
        this.getOutData({loading: false})
        if (!noUpdataStatus) {
          this._statistic()
        }
        if (params.page === 1) {
          this.$refs.pagination.beginPage()
        }
      },
      async checkErr(item) {
        this._updateList({exception_status: item.status, page: 1})
      },
      _setErrorStatus() {
        let item = this.errorObj.data.find((item) => item.status === this.outFilter.exception_status)
        this.errorObj.content = item.name || '全部'
      },
      changeType(item) {
        this._updateList({out_type: item.type, page: 1})
      },
      stopDocument(item) {
        if (item.show_sorting) {
          return
        }
        console.log(item)
      },
      goDetail(item) {
        if (item.show_sorting) {
          return
        }
        this.$router.push(`/home/product-out/out-detail/${item.out_order_id}`)
      },
      async sureSubmit() {
        let type = 'batchOut'
        let apiUrl = 'scm_batch_out_'
        if (this.outFilter.status === 2) {
          type = 'batchRecheck'
          apiUrl = 'scm_batch_finish_checked_'
        }
        let res = await API.Store[type]()
        this.$toast.show(res.message)
        if (res.error === this.$ERR_OK) {
          this.webSocketData(apiUrl)
        }
      },
      showBatchOut() {
        if (this.outFilter.status !== 0 || (this.outFilter.status === 0 && !this.outList.length)) {
          this.$toast.show('暂无出库单')
          return
        }
        this.$refs.confirm.show('是否确认批量出库？')
      },
      showBatchRecheck() {
        if (!this.outList.length) {
          this.$toast.show('暂无待复核')
          return
        }
        this.$refs.confirm.show('是否确认批量复核？')
      },
      async _statistic() {
        let res = await API.Store.outOrdersStatistic({
          start_time: this.outFilter.start_time,
          end_time: this.outFilter.end_time,
          keyword: this.outFilter.keyword,
          exception_status: this.outFilter.exception_status
        })
        if (res.error === this.$ERR_OK) {
          this.dispatchSelect = res.data.status.map((item) => {
            item.name = item.status_str
            item.num = item.statistic
            item.value = item.status
            return item
          })
        }
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
        this._updateList({keyword, page: 1})
      },
      async changeStartTime(value) {
        this._updateList({start_time: value[0], end_time: value[1], page: 1})
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
      async setValue(item) {
        this._updateList({status: item.value, page: 1})
      },
      async addPage(page) {
        this._updateList({page}, true)
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
          max-width: 98px
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
  .list-item-error
    icon-image('icon-unusual_list')
    width: 16px
    height: 15px
    margin-top: 2px
    margin-left: 1px
    background-size: 16px 15px
</style>
