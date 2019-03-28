<template>
  <div class="purchase-order table">
    <div class="down-content">
      <!--时间选择-->
      <span class="down-tip">生成时间</span>
      <div class="down-time-box">
        <date-picker
          :value="startTime"
          class="edit-input-box" type="date"
          placeholder="开始时间"
          style="width: 187px;height: 28px;border-radius: 1px"
          @on-change="_getStartTime"
        ></date-picker>
        <div v-if="startTime" class="down-time-text">23:00:01</div>
      </div>
      <!---->
      <div class="time-tip">~</div>
      <div class="down-item">
        <div class="down-time-box">
          <date-picker
            :value="endTime"
            class="edit-input-box edit-input-right"
            type="date"
            placeholder="结束时间"
            style="width: 187px;height: 28px;border-radius: 1px"
            @on-change="_getEndTime"
          ></date-picker>
          <div v-if="endTime" class="down-time-text">23:00:00</div>
        </div>
      </div>
      <!--搜索-->
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="采购单号" @search="_search"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-purchase_list@2x.png" class="identification-icon">
          <p class="identification-name">采购单列表</p>
          <base-status-tab :statusList="dispatchSelect" @setStatus="_setStatus"></base-status-tab>
        </div>
        <div class="function-btn">
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-for="(item,index) in purchaseList" :key="index" class="list-content list-box">
            <div class="list-item">{{item.create_day}}</div>
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
      </div>
      <div class="pagination-box">
        <base-pagination ref="pages" :pageDetail="pageTotal" @addPage="_getMoreList"></base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import {DatePicker} from 'iview'
  import {supplyComputed, supplyMethods} from '@state/helpers'

  const PAGE_NAME = 'PURCHASE_ORDER'
  const TITLE = '采购单列表'
  const COMMODITIES_LIST = ['生成时间', '采购订单号', '采购品类数', '预采购金额', '供应商', '采购员', '状态', '操作']
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
        page: 1,
        startTime: '',
        endTime: '',
        keyword: '',
        time: '',
        status: '',
        dispatchSelect: [{name: '全部', value: '', key: 'all', num: 0}, {name: '待入库', value: 1, key: 'wait_entry', num: 0}, {name: '已完成', value: 2, key: 'success', num: 0}]
      }
    },
    computed: {
      ...supplyComputed
    },
    async created() {
      let yesterdayTime = new Date() - (86400 * 1000 * 1)
      yesterdayTime = new Date(yesterdayTime)
      yesterdayTime = yesterdayTime.toLocaleDateString().replace(/\//g, '-')
      let time = new Date()
      time = time.toLocaleDateString().replace(/\//g, '-')
      this.startTime = yesterdayTime
      this.endTime = time
      await this._statistic()
    },
    methods: {
      ...supplyMethods,
      async _setStatus(item) {
        this.status = item.value
        this.page = 1
        this.$refs.pages.beginPage()
        this.getPurchaseList({
          time: this.time,
          startTime: this.startTime,
          endTime: this.endTime,
          keyword: this.keyword,
          page: this.page,
          status: this.status,
          loading: false
        })
      },
      async _getStartTime(time) {
        this.startTime = time
        if (Date.parse(this.startTime) > Date.parse(this.endTime)) {
          this.$toast.show('开始时间不能大于结束时间')
          return
        }
        this.page = 1
        this.$refs.pages.beginPage()
        this.getPurchaseList({
          time: this.time,
          startTime: this.startTime,
          endTime: this.endTime,
          keyword: this.keyword,
          page: this.page,
          status: this.status,
          loading: false
        })
        await this._statistic()
      },
      async _search(word) {
        this.keyword = word
        this.page = 1
        this.$refs.pages.beginPage()
        this.getPurchaseList({
          time: this.time,
          startTime: this.startTime,
          endTime: this.endTime,
          keyword: this.keyword,
          page: this.page,
          status: this.status,
          loading: false
        })
        await this._statistic()
      },
      async _getEndTime(time) {
        this.endTime = time
        if (Date.parse(this.startTime) > Date.parse(this.endTime)) {
          this.$toast.show('结束时间不能小于开始时间')
          return
        }
        this.page = 1
        this.$refs.pages.beginPage()
        this.getPurchaseList({
          time: this.time,
          startTime: this.startTime,
          endTime: this.endTime,
          keyword: this.keyword,
          page: this.page,
          status: this.status,
          loading: false
        })
        await this._statistic()
      },
      async _getMoreList(page) {
        this.page = page
        this.getPurchaseList({
          time: this.time,
          startTime: this.startTime,
          endTime: this.endTime,
          keyword: this.keyword,
          page: this.page,
          status: this.status,
          loading: false
        })
        await this._statistic()
      },
      async _statistic() {
        let res = await API.Supply.getPurchaseOrderStatistic({start_time: this.startTime, end_time: this.endTime, keyword: this.keyword})
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
          flex: 0.4
        &:nth-child(2)
          flex: 2
        &:nth-child(1)
          flex: 1.5
</style>
