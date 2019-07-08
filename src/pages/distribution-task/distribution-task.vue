<template>
  <div class="distribution-task table">
    <base-tab-select :infoTabIndex="tabIndex" :tabStatus="tabStatus" :lineWidth="104" @getStatusTab="changeStatus"></base-tab-select>
    <div class="down-content">
      <span class="down-tip">建单时间</span>
      <div class="down-item">
        <base-date-select
          placeHolder="请选择建单时间"
          :dateInfo="tabIndex === 0 ? orderTime : driverTime"
          @getTime="changeStartTime"
        >
        </base-date-select>
      </div>
      <div v-if="tabIndex === 0" class="distribution-down">
        <span class="down-tip">异常状态</span>
        <div class="down-item">
          <base-drop-down :select="errorObj" @setValue="checkErr"></base-drop-down>
        </div>
        <span class="down-tip">搜索</span>
        <div class="down-item">
          <base-search :infoText="orderKeyword" placeHolder="配送单号或商户名称" @search="changeKeyword"></base-search>
        </div>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-driver@2x.png" class="identification-icon">
          <p class="identification-name">{{tabStatus[tabIndex].text}}</p>
          <base-status-tab :show="tabIndex === 0" :statusList="dispatchSelect" :infoTabIndex="statusTab" @setStatus="setValue"></base-status-tab>
        </div>
        <div v-if="tabIndex === 0" class="function-btn">
          <div class="btn-main" @click="deliveryExcel">导出配送单</div>
          <div class="btn-main g-btn-item" @click="orderExcel">导出消费者清单</div>
          <div
            class="btn-main g-btn-item"
            :class="{'btn-disable-store': (orderStatus !==1 && orderStatus !==3) || (orderStatus === 3 && !orderList.length) || (orderStatus === 1 && !orderList.length)}"
            @click="signIn('all')"
          >
            批量签收
          </div>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item" :style="{flex: item.flex}">{{item.title}}</div>
        </div>
        <div class="list">
          <div v-if="tabIndex === 0">
            <div v-if="orderList.length">
              <div v-for="(item, index) in orderList" :key="index" class="list-content list-box" :class="{'list-lock': item.is_blocked}">
                <div class="list-item" :style="{flex: commodities[0].flex}">{{item.created_at}}</div>
                <div class="list-item" :style="{flex: commodities[1].flex}">{{item.order_sn}}</div>
                <div class="list-item" :style="{flex: commodities[2].flex}">
                  <router-link tag="a" target="_blank" :to="{path: `merchant-order/merchant-order-detail/${item.source_order_id}`}" class="list-operation">{{item.sale_order_sn}}</router-link>
                </div>
                <div class="list-item" :style="{flex: commodities[3].flex}">{{item.road_name}}</div>
                <div class="list-item" :style="{flex: commodities[4].flex}">{{item.receiver}}</div>
                <div class="list-item" :style="{flex: commodities[5].flex}">{{item.receive_address}}</div>
                <div class="list-item" :style="{flex: commodities[6].flex}">{{item.delivery_date}}</div>
                <div class="list-item" :style="{flex: commodities[7].flex}">{{item.driver_name}}</div>
                <div class="list-item" :style="{flex: commodities[8].flex}">
                  {{item.status_str}}
                  <div v-if="item.is_blocked" class="list-item-img"></div>
                  <div v-if="item.is_exception" class="list-item-img-unusual"></div>
                </div>
                <div class="list-item" :style="{flex: commodities[9].flex}">
                  <span class="list-operation list-ok" @click="handleOperation(item)">导出</span>
                  <span v-if="(item.status === 1 && !item.is_blocked) || item.status === 3" class="list-operation list-ok" @click="signIn(item)">签收</span>
                </div>
              </div>
            </div>
            <base-blank v-else></base-blank>
          </div>
          <div v-else-if="tabIndex === 1">
            <div v-if="orderList.length">
              <div v-for="(driver, key) in driverList" :key="key" class="list-content list-box">
                <div v-for="(item,index) in commodities" :key="index" class="list-item" :style="{flex: item.flex}">
                  {{item.operation ? '' : driver[item.key]}}
                  <div v-if="item.operation" class="list-operation" @click="handleOperation(driver)">{{item.operation}}</div>
                </div>
              </div>
            </div>
            <base-blank v-else></base-blank>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pageDetail="tabIndex === 0 ? orderPageDetail : driverPageDetail" :pagination="tabIndex === 0 ? orderPage : driverPage" @addPage="setOrderPage"></base-pagination>
      </div>
    </div>
    <default-confirm ref="confirm" @confirm="confirmSign"></default-confirm>
    <default-confirm ref="signMore" @confirm="signMore"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import {authComputed, distributionComputed, distributionMethods} from '@state/helpers'
  import API from '@api'
  import DefaultConfirm from '@components/default-confirm/default-confirm'

  const PAGE_NAME = 'DISTRIBUTION_TASK'
  const TITLE = '配送任务'
  const COMMODITIES_LIST = [
    {title: '建单时间', key: 'created_at', flex: 1},
    {title: '配送单号', key: 'order_sn', flex: 1},
    {title: '关联订单号', key: 'sale_order_sn', flex: 1.3},
    {title: '路线', key: 'road_name', flex: 0.6},
    {title: '商户名称', key: 'receiver', flex: 1},
    {title: '配送地址', key: 'receive_address', flex: 1.3},
    {title: '收货时间', key: 'delivery_date', flex: 0.8},
    {title: '司机', key: 'driver_name', flex: 0.6},
    {title: '状态', key: 'status_str', flex: 0.6},
    {title: '操作', key: '', operation: '导出', flex: 1}
  ]
  const COMMODITIES_LIST2 = [
    {title: '司机', key: 'driver_name', flex: 1},
    {title: '线路名称', key: 'road_name', flex: 1},
    {title: '配送商户数', key: 'buyer_count', flex: 1},
    {title: '订单数', key: 'order_count', flex: 1},
    {title: '操作', key: '', operation: '导出', flex: 0.36}
  ]
  const ORDERSTATUS = [{text: '订单任务列表', status: ''}, {text: '司机任务列表', status: 0}]
  const ORDER_EXCEL_URL = '/scm/api/backend/delivery/delivery-export/'
  const USER_ORDER_EXCEL_URL = '/scm/api/backend/delivery/download-order-excel/'
  const DRIVER_EXCEL_URL = '/scm/api/backend/delivery/delivery-driver-tasks-export/'
  const DOWNLOAD_ORDER_EXCEL = '/scm/api/backend/delivery/download-order-excels'
  const DELIVERY_ORDER_EXCEL = '/scm/api/backend/delivery/delivery-exports'
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
        tabStatus: ORDERSTATUS,
        commodities: COMMODITIES_LIST,
        exportOrderId: '',
        exportDriverId: '',
        statistic: {all: 0, wait_delivery: 0, success_delivery: 0},
        signItem: {},
        startTime: '',
        endTime: '',
        dispatchSelect: [
          {name: '全部', value: '', key: 'all', num: 0},
          {name: '待配送', value: 1, key: 'wait_delivery', num: 0},
          {name: '待签收', value: 3, key: 'wait_sign', num: 0},
          {name: '已完成', value: 2, key: 'success_delivery', num: 0}
        ],
        accurateStart: '',
        accurateEnd: '',
        statusTab: 1,
        errorObj: {
          check: false,
          show: false,
          content: '全部',
          type: 'default',
          data: [{name: '全部', status: ''}, {name: '正常', status: '0'}, {name: '异常', status: '1'}] // 格式：{name: '55'}
        },
        exceptionStatus: this.$route.query.exception_status || ''
      }
    },
    computed: {
      ...authComputed,
      ...distributionComputed,
      orderTime() {
        return [this.orderStartTime, this.orderEndTime]
      },
      driverTime() {
        return [this.driverStartTime, this.driverEndTime]
      },
      orderExportUrl() {
        let currentId = this.getCurrentId()
        let data = {
          current_corp: currentId,
          current_shop: process.env.VUE_APP_CURRENT_SHOP,
          access_token: this.currentUser.access_token,
          start_time: this.orderStartTime || '',
          end_time: this.orderEndTime || '',
          keyword: this.orderKeyword
        }
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        return process.env.VUE_APP_SCM_API + ORDER_EXCEL_URL + this.exportOrderId + '?' + search.join('&')
      },
      userOrderExportUrl() {
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
        return process.env.VUE_APP_SCM_API + USER_ORDER_EXCEL_URL + this.exportOrderId + '?' + search.join('&')
      },
      driverExportUrl() {
        let currentId = this.getCurrentId()
        let data = {
          current_corp: currentId,
          current_shop: process.env.VUE_APP_CURRENT_SHOP,
          access_token: this.currentUser.access_token,
          start_time: this.driverStartTime || '',
          end_time: this.driverEndTime || '',
          exception_status: this.exceptionStatus
        }
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        return process.env.VUE_APP_SCM_API + DRIVER_EXCEL_URL + this.exportDriverId + '?' + search.join('&')
      }
    },
    async created() {
      this._setErrorStatus()
      this.commodities = this.tabIndex === 0 ? COMMODITIES_LIST : COMMODITIES_LIST2
      await this._statistic()
      if (this.$route.query.status) {
        this.statusTab = this.dispatchSelect.findIndex((item) => item.value === this.$route.query.status * 1)
        this.status = this.$route.query.status * 1
      }
    },
    methods: {
      ...distributionMethods,
      _setErrorStatus() {
        let item = this.errorObj.data.find((item) => item.status === this.exceptionStatus)
        this.errorObj.content = item.name || '全部'
      },
      orderExcel() {
        window.open(this._getUrl(DOWNLOAD_ORDER_EXCEL))
      },
      deliveryExcel() {
        window.open(this._getUrl(DELIVERY_ORDER_EXCEL))
      },
      _getUrl(url) {
        let currentId = this.getCurrentId()
        let data = {
          current_corp: currentId,
          current_shop: process.env.VUE_APP_CURRENT_SHOP,
          access_token: this.currentUser.access_token,
          start_time: this.orderStartTime || '',
          end_time: this.orderEndTime || '',
          keyword: this.orderKeyword,
          status: this.orderStatus,
          exception_status: this.exceptionStatus
        }
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        return process.env.VUE_APP_SCM_API + url + '?' + search.join('&')
      },
      async signMore() {
        let res = await API.Delivery.batchDeliverySign({status: this.orderStatus})
        this.$loading.hide()
        this.$toast.show(res.message)
        if (res.error === this.$ERR_OK) {
          await this._statistic()
          this.getOrderList()
        }
      },
      signIn(item) {
        if (item === 'all') {
          if ((this.orderList.length && this.orderStatus === 1) || (this.orderList.length && this.orderStatus === 3)) {
            this.$refs.signMore.show('确定批量签收配送单？')
          }
          return
        }
        this.signItem = item
        this.$refs.confirm.show('确定签收该配送单？')
      },
      async confirmSign() {
        let res = await API.Delivery.deliverySign(this.signItem.id)
        this.$toast.show(res.message)
        if (res.error === this.$ERR_OK) {
          await this._statistic()
          this.getOrderList()
        }
      },
      async _statistic() {
        let res = await API.Delivery.getSeliveryStatistic({
          start_time: this.orderStartTime,
          end_time: this.orderEndTime,
          keyword: this.orderKeyword,
          exception_status: this.exceptionStatus
        })
        this.statistic = res.error === this.$ERR_OK ? res.data : {all: 0, wait_delivery: 0, success_delivery: 0}
        for (let key in this.statistic) {
          let index = this.dispatchSelect.findIndex((item) => item.key === key)
          this.dispatchSelect[index].num = this.statistic[key]
        }
      },
      async setValue(item, index) {
        this.statusTab = index
        this.setOrderStatus(item.value)
        await this._statistic(false)
        this.$refs.pagination.beginPage()
      },
      async changeStatus(item, index) {
        this.commodities = index === 0 ? COMMODITIES_LIST : COMMODITIES_LIST2
        if (index === 1) {
          this.statusTab = 1
        }
        this.setTabIndex(index)
        if (index === 0) {
          this.errorObj.content = '全部'
          this.exceptionStatus = ''
          this.statusTab = 1
          this.$forceUpdate()
          await this._statistic(false)
        }
        this.$refs.pagination.beginPage()
      },
      async changeKeyword(keyword) {
        this.setOrderKeyword(keyword)
        await this._statistic()
        this.$refs.pagination.beginPage()
      },
      async changeStartTime(value) {
        if (this.tabIndex === 0) {
          this.setOrderTime(value)
          await this._statistic()
        } else if (this.tabIndex === 1) {
          this.setDriverTime(value)
        }
        this.$refs.pagination.beginPage()
      },
      handleOperation(data) {
        if (this.tabIndex === 0) {
          this.exportOrderId = data.id
          window.open(this.orderExportUrl, '_blank')
          window.open(this.userOrderExportUrl, '_blank')
        } else if (this.tabIndex === 1) {
          this.exportDriverId = data.id
          window.open(this.driverExportUrl, '_blank')
        }
      },
      async checkErr(item) {
        this.exceptionStatus = item.status
        this.setExceptionStatus(item.status)
        await this._statistic()
        this.$refs.pagination.beginPage()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .distribution-down
    display: flex
    align-items: center
  .list-box
    .list-item
      padding-right: 14px
      &:nth-child(1)
        min-width: 160px
      &:nth-child(2)
        min-width: 200px
      &:nth-child(3)
        min-width: 200px
      &:last-child
        padding: 0
        min-width: 80px
        max-width: 80px
  .list-lock
    .list-item
      .list-ok
        color: #4d77bd !important
  .list-item-img
    icon-image('icon-lock')
    width: 16px
    height: 15px
    margin-top: 2px
    margin-left: 1px
    background-size: 16px 15px
  .list-item-img-unusual
    icon-image('icon-unusual_list')
    width: 16px
    height: 15px
    margin-top: 2px
    margin-left: 1px
    background-size: 16px 15px
</style>
