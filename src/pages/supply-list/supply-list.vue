<template>
  <div class="supplier table">
    <div class="down-content">
      <!--时间选择-->
      <span class="down-tip">下单时间</span>
      <date-picker
        class="edit-input-box"
        type="datetime"
        placeholder="开始时间"
        style="width: 187px;height: 28px;border-radius: 1px"
        :value="startTime"
        @on-ok="changeStartTime"
      ></date-picker>
      <div class="time-tip">~</div>
      <div class="down-item">
        <date-picker
          class="edit-input-box edit-input-right"
          type="datetime"
          placeholder="结束时间"
          style="width: 187px;height: 28px;border-radius: 1px"
          :value="endTime"
          @on-change="changeEndTime"
        ></date-picker>
      </div>
      <!--下拉选择-->
      <span class="down-tip">状态</span>
      <div class="down-item">
        <base-drop-down :select="statusSelect" @setValue="changeStatus"></base-drop-down>
      </div>
      <!--搜索-->
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search :infoText="keyword" placeHolder="订单号或商户名称" @search="changeKeyword"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-order_list2@2x.png" class="identification-icon">
          <p class="identification-name">订单列表</p>
        </div>
      </div>
      <div class="order-detail">
        <div class="order-item">
          <p class="order-text order-title">全部：</p>
          <p class="order-text order-money">{{statistic.all}}</p>
        </div>
        <div class="order-item">
          <p class="order-text order-title">待调度：</p>
          <p class="order-text order-money">{{statistic.wait_dispatch}}</p>
        </div>
        <div class="order-item">
          <p class="order-text order-title">待分拣：</p>
          <p class="order-text order-money">{{statistic.wait_sorting}}</p>
        </div>
        <div class="order-item">
          <p class="order-text order-title">待配送：</p>
          <p class="order-text order-money">{{statistic.wait_delivery}}</p>
        </div>
        <div class="order-item">
          <p class="order-text order-title">已完成：</p>
          <p class="order-text order-money">{{statistic.success}}</p>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in orders" :key="index" class="list-content list-box">
            <div class="list-item">{{item.merge_at}}</div>
            <div class="list-item">{{item.order_sn}}</div>
            <div class="list-item">{{item.buyer_name}}</div>
            <div class="list-item">{{item.total ? '￥' : ''}}{{item.total}}</div>
            <div class="list-item">{{item.status_str}}</div>
            <div class="list-item">
              <router-link tag="div" :to="`supply-detail/${item.id}`" append class="list-operation">详情</router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pageDetail="pageTotal" :pagination="page" @addPage="setPage"></base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import {DatePicker} from 'iview'
  import {omsComputed, omsMethods} from '@state/helpers'

  const PAGE_NAME = 'SUPPLIER'
  const TITLE = '订单列表'
  const COMMODITIES_LIST = ['下单时间', '订单号', '商户名称', '销售金额', '状态', '操作']
  const SELECT = {
    check: false,
    show: false,
    content: '全部',
    type: 'default',
    data: []
  }
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
        commodities: COMMODITIES_LIST,
        statusSelect: SELECT,
        statistic: {
          all: 0,
          wait_dispatch: 0,
          wait_sorting: 0,
          wait_delivery: 0,
          success: 0
        },
        startTime1: ''
      }
    },
    computed: {
      ...omsComputed
    },
    async created() {
      this._getOmsOrderStatus()
      await this._outOrdersStatistic()
    },
    methods: {
      ...omsMethods,
      async _outOrdersStatistic() {
        let res = await API.Oms.outOrdersStatistic({start_time: this.startTime, end_time: this.endTime})
        this.statistic = res.error === this.$ERR_OK ? res.data : {}
      },
      _getOmsOrderStatus() {
        API.Oms.getOmsOrderStatus().then((res) => {
          if (res.error !== this.$ERR_OK) {
            return
          }
          let selectData = res.data.map((item) => {
            return {
              name: item.status_str,
              status: item.status
            }
          })
          selectData.unshift({name: '全部', status: ''})
          this.statusSelect.data = selectData
        })
      },
      changeStatus(selectStatus) {
        this.setStatus(selectStatus)
        this.$refs.pagination.beginPage()
      },
      changeKeyword(keyword) {
        this.setKeyword(keyword)
        this.$refs.pagination.beginPage()
      },
      async changeStartTime(value) {
        this.setStartTime(value)
        await this._outOrdersStatistic()
        this.$refs.pagination.beginPage()
      },
      async changeEndTime(value) {
        this.setEndTime(value)
        await this._outOrdersStatistic()
        this.$refs.pagination.beginPage()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .supplier
    .list-box
      .list-item
        padding-right: 14px
        &:last-child
          flex: 0.3
</style>
