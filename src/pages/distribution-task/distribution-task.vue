<template>
  <div class="distribution-task table">
    <base-tab-select :infoTabIndex="tabIndex" :tabStatus="tabStatus" :lineWidth="104" @getStatusTab="changeStatus"></base-tab-select>
    <div class="down-content">
      <span class="down-tip">建单时间</span>
      <div class="down-time-box">
        <date-picker
          class="edit-input-box" type="date"
          placeholder="选择下单日期"
          style="width: 187px;height: 28px;border-radius: 1px"
          :value="tabIndex === 0 ? orderStartTime : driverStartTime"
          @on-change="changeStartTime"
        ></date-picker>
        <div v-if="orderStartTime && tabIndex === 0" class="down-time-text">23:00:01</div>
        <div v-if="driverStartTime && tabIndex === 1" class="down-time-text">23:00:01</div>
      </div>
      <!--@on-change="_getStartTime"-->
      <div class="time-tip">~</div>
      <div class="down-item down-time-box">
        <date-picker
          class="edit-input-box edit-input-right"
          type="date"
          placeholder="选择下单日期"
          style="width: 187px;height: 28px;border-radius: 1px"
          :value="tabIndex === 0 ? orderEndTime : driverEndTime"
          @on-change="changeEndTime"
        ></date-picker>
        <div v-if="orderEndTime && tabIndex === 0" class="down-time-text">23:00:00</div>
        <div v-if="driverEndTime && tabIndex === 1" class="down-time-text">23:00:00</div>
      </div>
      <div v-if="tabIndex === 0" class="distribution-down">
        <span class="down-tip">搜索</span>
        <div class="down-item">
          <base-search :infoText="orderKeyword" placeHolder="订单号或商户名称" @search="changeKeyword"></base-search>
        </div>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-driver@2x.png" class="identification-icon">
          <p class="identification-name">{{tabStatus[tabIndex].text}}</p>
          <base-status-tab v-show="tabIndex === 0" :statusList="dispatchSelect" @setStatus="setValue"></base-status-tab>
        </div>
        <div class="function-btn">
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item" :style="{flex: item.flex}">{{item.title}}</div>
        </div>
        <div class="list">
          <div v-if="tabIndex === 0">
            <div v-for="(item, index) in orderList" :key="index" class="list-content list-box">
              <div class="list-item" :style="{flex: commodities[0].flex}">{{item.created_at}}</div>
              <div class="list-item" :style="{flex: commodities[1].flex}">{{item.order_sn}}</div>
              <div class="list-item" :style="{flex: commodities[2].flex}">
                <router-link tag="a" target="_blank" :to="{path: `supply-list/supply-detail/${item.source_order_id}`}" class="list-operation">{{item.sale_order_sn}}</router-link>
              </div>
              <div class="list-item" :style="{flex: commodities[3].flex}">{{item.road_name}}</div>
              <div class="list-item" :style="{flex: commodities[4].flex}">{{item.receiver}}</div>
              <div class="list-item" :style="{flex: commodities[5].flex}">{{item.receive_address}}</div>
              <div class="list-item" :style="{flex: commodities[6].flex}">{{item.delivery_date}}</div>
              <div class="list-item" :style="{flex: commodities[7].flex}">{{item.driver_name}}</div>
              <div class="list-item" :style="{flex: commodities[8].flex}">{{item.status_str}}</div>
              <div class="list-item" :style="{flex: commodities[9].flex}">
                <span class="list-operation" @click="handleOperation(item)">操作</span>
                <span v-if="item.status === 1" class="list-operation" @click="signIn(item)">签收</span>
              </div>
            </div>
            <!--<div v-for="(order, key) in orderList" :key="key" class="list-content list-box">-->
            <!--<div v-for="(item,index) in commodities" :key="index" class="list-item" :style="{flex: item.flex}">-->
            <!--{{item.operation ? '' : order[item.key]}}-->
            <!--<div v-if="item.operation">-->
            <!--</div>-->
            <!--</div>-->
            <!--</div>-->
          </div>
          <div v-else-if="tabIndex === 1">
            <div v-for="(driver, key) in driverList" :key="key" class="list-content list-box">
              <div v-for="(item,index) in commodities" :key="index" class="list-item" :style="{flex: item.flex}">
                {{item.operation ? '' : driver[item.key]}}
                <div v-if="item.operation" class="list-operation" @click="handleOperation(driver)">{{item.operation}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pageDetail="tabIndex === 0 ? orderPageDetail : driverPageDetail" :pagination="tabIndex === 0 ? orderPage : driverPage" @addPage="setOrderPage"></base-pagination>
      </div>
    </div>
    <default-confirm ref="confirm" @confirm="confirmSign"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import {authComputed, distributionComputed, distributionMethods} from '@state/helpers'
  import {DatePicker} from 'iview'
  import API from '@api'
  import DefaultConfirm from '@components/default-confirm/default-confirm'

  const PAGE_NAME = 'DISTRIBUTION_TASK'
  const TITLE = '配送任务'
  const COMMODITIES_LIST = [
    {title: '建单时间', key: 'created_at', flex: 1},
    {title: '配送单号', key: 'order_sn', flex: 1},
    {title: '关联订单号', key: 'sale_order_sn', flex: 1.3},
    {title: '路线', key: 'road_name', flex: 1},
    {title: '商户名称', key: 'receiver', flex: 1},
    {title: '配送地址', key: 'receive_address', flex: 1.3},
    {title: '收货时间', key: 'delivery_date', flex: 0.6},
    {title: '司机', key: 'driver_name', flex: 0.6},
    {title: '状态', key: 'status_str', flex: 0.6},
    {title: '操作', key: '', operation: '导出', flex: 0.7}
  ]
  const COMMODITIES_LIST2 = [
    {title: '司机', key: 'driver_name', flex: 1},
    {title: '线路名称', key: 'road_name', flex: 1},
    {title: '配送商户数', key: 'buyer_count', flex: 1},
    {title: '订单数', key: 'order_count', flex: 1},
    {title: '操作', key: '', operation: '导出', flex: 0.32}
  ]
  const ORDERSTATUS = [{text: '订单任务列表', status: ''}, {text: '司机任务列表', status: 0}]
  const ORDER_EXCEL_URL = '/scm/api/backend/delivery/delivery-export/'
  const USER_ORDER_EXCEL_URL = '/scm/api/backend/delivery/download-order-excel/'
  const DRIVER_EXCEL_URL = '/scm/api/backend/delivery/delivery-driver-tasks-export/'
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DatePicker,
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
        dispatchSelect: [{name: '全部', value: '', key: 'all', num: 0}, {name: '待配送', value: 1, key: 'wait_delivery', num: 0}, {name: '配送完成', value: 2, key: 'success_delivery', num: 0}]
      }
    },
    computed: {
      ...authComputed,
      ...distributionComputed,
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
          end_time: this.driverEndTime || ''
        }
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        return process.env.VUE_APP_SCM_API + DRIVER_EXCEL_URL + this.exportDriverId + '?' + search.join('&')
      }
    },
    async created() {
      this.commodities = this.tabIndex === 0 ? COMMODITIES_LIST : COMMODITIES_LIST2
      await this._statistic()
    },
    methods: {
      ...distributionMethods,
      signIn(item) {
        this.signItem = item
        this.$refs.confirm.show('确定签收该配送单？')
      },
      async confirmSign() {
        let res = await API.Delivery.deliverySign(this.signItem.id)
        this.$toast.show(res.message)
        if (res.error === this.$ERR_OK) {
          this.getOrderList()
        }
      },
      async _statistic() {
        let res = await API.Delivery.getSeliveryStatistic({start_time: this.orderStartTime, end_time: this.orderEndTime, keyword: this.orderKeyword})
        this.statistic = res.error === this.$ERR_OK ? res.data : {all: 0, wait_delivery: 0, success_delivery: 0}
        for (let key in this.statistic) {
          let index = this.dispatchSelect.findIndex((item) => item.key === key)
          this.dispatchSelect[index].num = this.statistic[key]
        }
      },
      setValue(item) {
        this.setOrderStatus(item.value)
        this.$refs.pagination.beginPage()
      },
      changeStatus(item, index) {
        this.commodities = index === 0 ? COMMODITIES_LIST : COMMODITIES_LIST2
        this.setTabIndex(index)
      },
      async changeKeyword(keyword) {
        this.setOrderKeyword(keyword)
        await this._statistic()
        this.$refs.pagination.beginPage()
      },
      async changeStartTime(value) {
        if (this.tabIndex === 0) {
          this.setOrderStartTime(value)
          await this._statistic()
        } else if (this.tabIndex === 1) {
          this.setDriverStartTime(value)
        }
        this.$refs.pagination.beginPage()
      },
      async changeEndTime(value) {
        if (this.tabIndex === 0) {
          this.setOrderEndTime(value)
          await this._statistic()
        } else if (this.tabIndex === 1) {
          this.setDriverEndTime(value)
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
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .distribution-down
    display: flex
    align-items: center
</style>
