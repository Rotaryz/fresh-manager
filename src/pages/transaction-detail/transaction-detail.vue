<template>
  <div class="transaction-detail table">
    <base-tab-select :infoTabIndex="infoTabIndex" :tabStatus="tabStatusList" @getStatusTab="changeTabStatus"></base-tab-select>
    <div class="down-content">
      <span class="down-tip">支付时间</span>
      <div class="down-item">
        <base-date-select :dateInfo="settleLogsDate" placeHolder="选择支付日期" @getTime="changeDate"></base-date-select>
      </div>
      <!--搜索-->
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search :infoText="settleLogsKeyword" placeHolder="订单号" @search="changeKeyword"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-order_list2@2x.png" class="identification-icon">
          <p class="identification-name">交易明细</p>
          <base-status-tab :statusList="settleStatus" :infoTabIndex="statusTabIndex" @setStatus="changeStatus"></base-status-tab>
        </div>
        <div class="function-btn">
          <div class="btn-main" @click="exportExcel">导出</div>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in listTitle" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in settleLogs" :key="index" class="list-content list-box">
            <div class="list-item list-text">{{item.created_at}}</div>
            <div class="list-item list-use">
              <router-link tag="a" :to="{path: `/home/order-list/order-detail/${item.order_id}?freeShipping=${infoTabIndex}`}" target="_blank" append class="list-operation">{{item.order_sn}}</router-link>
            </div>
            <div class="list-item list-text">{{item.goods_name}}</div>
            <div class="list-item list-text">{{item.num}}</div>
            <div class="list-item list-text">{{item.total}}</div>
            <div class="list-item list-text">{{item.service_charge}}</div>
            <div v-if="infoTabIndex === 1" class="list-item list-text">{{item.commission_rate}}</div>
            <div v-else class="list-item list-text">{{item.commission}}</div>
            <div class="list-item list-text">{{item.money}}</div>
            <div class="list-item list-text">{{item.status === 0?'——':item.updated_at}}</div>
            <div class="list-item list-text"><span class="list-status" :class="{'list-status-success': item.status === 1, 'list-status-warn': item.status === 0}"></span>{{item.status_str}}</div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pageDetail="settleLogsPageTotal" :pagination="settleLogsPage" @addPage="setSettleLogsPage"></base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {authComputed, financeComputed, financeMethods} from '@state/helpers'

  const PAGE_NAME = 'TRANSACTION_DETAIL'
  const TITLE = '交易明细'

  const LIST_TITLE = [
    '支付时间',
    '关联订单号',
    '商品',
    '数量',
    '交易金额',
    '服务费',
    '团长佣金',
    '入账资金',
    '入账时间',
    '状态'
  ]
  const FS_LIST_TITLE = [
    '支付时间',
    '关联订单号',
    '商品',
    '数量',
    '交易金额',
    '服务费',
    '佣金比例',
    '入账佣金',
    '入账时间',
    '状态'
  ]
  const EXCEL_URL = '/social-shopping/api/backend/finance/settle-logs-excel'
  const TAB_STATUS = [{text: '自提商品', status: 0}, {text: '全国包邮', status: 1}]

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        tabStatusList: TAB_STATUS,
        infoTabIndex: 0,
        listTitle: LIST_TITLE
      }
    },
    computed: {
      ...financeComputed,
      ...authComputed,
      exportUrl() {
        let currentId = this.getCurrentId()
        let data = {
          current_corp: currentId,
          current_shop: process.env.VUE_APP_CURRENT_SHOP,
          access_token: this.currentUser.access_token,
          date: this.settleLogsDate.join(','),
          keyword: this.settleLogsKeyword,
          status: this.settleLogsStatus,
          source_type: this.tabStatus + 1 // source_type：1 自提，2 代表全国包邮
        }
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        return process.env.VUE_APP_API + EXCEL_URL + '?' + search.join('&')
      }
    },
    methods: {
      ...financeMethods,
      changeDate(date) {
        if (!date[0] && !date[1]) {
          date = []
        }
        this.setSettleDate(date)
        this.$refs.pagination.beginPage()
      },
      changeKeyword(keyword) {
        this.setSettleKeyword(keyword)
        this.$refs.pagination.beginPage()
      },
      changeStatus(status) {
        this.setSettleLogsStatus({status: status.value, isFetch: 1})
        this.$refs.pagination.beginPage()
      },
      changeTabStatus(status) {
        // 头部tab切换
        this.infoTabIndex = status.status
        const titleArr = [LIST_TITLE, FS_LIST_TITLE]
        this.listTitle = titleArr[this.infoTabIndex]
        this.$refs.pagination.beginPage()
        this.setTabStatus(status.status)
      },
      exportExcel() {
        window.open(this.exportUrl, '_blank')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .transaction-detail
    .list-box
      .list-item
        padding-right: 14px
        &:nth-child(1), &:nth-child(2), &:nth-child(9)
          flex: 1.3
        &:nth-child(3)
          flex: 1.7
        &:nth-child(4)
          flex: 0.5
        &:last-child
          max-width: 80px
          flex: 0.6
</style>
