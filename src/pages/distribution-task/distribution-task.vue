<template>
  <div class="distribution-task table">
    <base-tab-select :infoTabIndex="tabIndex" :tabStatus="tabStatus" :lineWidth="104" @getStatusTab="changeStatus"></base-tab-select>
    <div class="down-content">
      <span class="down-tip">建单时间</span>
      <date-picker
        class="edit-input-box" type="date"
        placeholder="选择下单日期"
        style="width: 187px;height: 28px;border-radius: 1px"
        :value="tabIndex === 0 ? orderStartTime : driverStartTime"
        @on-change="changeStartTime"
      ></date-picker>
      <!--@on-change="_getStartTime"-->
      <div class="time-tip">~</div>
      <div class="down-item">
        <date-picker
          class="edit-input-box edit-input-right"
          type="date"
          placeholder="选择下单日期"
          style="width: 187px;height: 28px;border-radius: 1px"
          :value="tabIndex === 0 ? orderEndTime : driverEndTime"
          @on-change="changeEndTime"
        ></date-picker>
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
            <div v-for="(order, key) in orderList" :key="key" class="list-content list-box">
              <div v-for="(item,index) in commodities" :key="index" class="list-item" :style="{flex: item.flex}">
                {{item.operation ? '' : order[item.key]}}
                <div v-if="item.operation" class="list-operation" @click="handleOperation(order)">{{item.operation}}</div>
              </div>
            </div>
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
  </div>
</template>

<script type="text/ecmascript-6">
  import {authComputed, distributionComputed, distributionMethods} from '@state/helpers'
  import {DatePicker} from 'iview'

  const PAGE_NAME = 'DISTRIBUTION_TASK'
  const TITLE = '配送任务'
  const COMMODITIES_LIST = [
    {title: '建单时间', key: 'created_at', flex: 1},
    {title: '配送单号', key: 'order_sn', flex: 1},
    {title: '关联订单号', key: 'sale_order_sn', flex: 1},
    {title: '路线', key: 'road_name', flex: 1},
    {title: '商户名称', key: 'receiver', flex: 1},
    {title: '配送地址', key: 'receive_address', flex: 1},
    {title: '收货时间', key: 'delivery_date', flex: 1},
    {title: '司机', key: 'driver_name', flex: 1},
    {title: '操作', key: '', operation: '导出', flex: 0.3}
  ]
  const COMMODITIES_LIST2 = [
    {title: '司机', key: 'driver_name', flex: 1},
    {title: '线路名称', key: 'road_name', flex: 1},
    {title: '配送商户数', key: 'buyer_count', flex: 1},
    {title: '订单数', key: 'order_count', flex: 1},
    {title: '操作', key: '', operation: '导出', flex: 0.145}
  ]
  const ORDERSTATUS = [{text: '订单任务列表', status: ''}, {text: '司机任务列表', status: 0}]
  const ORDER_EXCEL_URL = '/scm/api/backend/delivery/delivery-export/'
  // const USER_ORDER_EXCEL_URL = '/social-shopping/api/backend/user-order-export/'
  const DRIVER_EXCEL_URL = '/scm/api/backend/delivery/delivery-driver-tasks-export/'
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DatePicker
    },
    data() {
      return {
        tabStatus: ORDERSTATUS,
        commodities: COMMODITIES_LIST,
        exportOrderId: '',
        exportShopId: '',
        exportDriverId: ''
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
      // userOrderExportUrl() {
      //   let currentId = this.getCurrentId()
      //   let data = {
      //     current_corp: currentId,
      //     current_shop: process.env.VUE_APP_CURRENT_SHOP,
      //     access_token: this.currentUser.access_token
      //   }
      //   let search = []
      //   for (let key in data) {
      //     search.push(`${key}=${data[key]}`)
      //   }
      //   return process.env.VUE_APP_API + USER_ORDER_EXCEL_URL + this.exportShopId + '?' + search.join('&')
      // },
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
    created() {
      this.commodities = this.tabIndex === 0 ? COMMODITIES_LIST : COMMODITIES_LIST2
    },
    methods: {
      ...distributionMethods,
      changeStatus(item, index) {
        this.commodities = index === 0 ? COMMODITIES_LIST : COMMODITIES_LIST2
        this.setTabIndex(index)
      },
      changeKeyword(keyword) {
        this.setOrderKeyword(keyword)
        this.$refs.pagination.beginPage()
      },
      changeStartTime(value) {
        if (this.tabIndex === 0) {
          this.setOrderStartTime(value)
        } else if (this.tabIndex === 1) {
          this.setDriverStartTime(value)
        }
        this.$refs.pagination.beginPage()
      },
      changeEndTime(value) {
        if (this.tabIndex === 0) {
          this.setOrderEndTime(value)
        } else if (this.tabIndex === 1) {
          this.setDriverEndTime(value)
        }
        this.$refs.pagination.beginPage()
      },
      handleOperation(data) {
        if (this.tabIndex === 0) {
          this.exportOrderId = data.id
          this.exportShopId = data.shop_id
          window.open(this.orderExportUrl, '_blank')
          // window.open(this.userOrderExportUrl, '_blank')
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
