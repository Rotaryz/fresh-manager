<template>
  <div class="supplier table">
    <div class="down-content">
      <!--时间选择-->
      <span class="down-tip">下单时间</span>
      <div class="down-time-box">
        <date-picker
          class="edit-input-box" type="date"
          placeholder="开始时间"
          style="width: 187px;height: 28px;border-radius: 1px"
          :value="startTime"
          @on-change="changeStartTime"
        ></date-picker>
        <div v-if="startTime" class="down-time-text">{{timeStart}}</div>
      </div>
      <!--@on-change="_getStartTime"-->
      <div class="time-tip">~</div>
      <div class="down-item">
        <div class="down-time-box">
          <date-picker
            class="edit-input-box edit-input-right"
            type="date"
            placeholder="结束时间"
            style="width: 187px;height: 28px;border-radius: 1px"
            :value="endTime"
            @on-change="changeEndTime"
          ></date-picker>
          <div v-if="endTime" class="down-time-text">{{timeEnd}}</div>
        </div>
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
          <base-status-tab :statusList="dispatchSelect" @setStatus="changeStatus"></base-status-tab>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in orders" :key="index" class="list-content list-box">
            <div class="list-item">{{item.created_at}}</div>
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
  const COMMODITIES_LIST = ['创建时间', '订单号', '商户名称', '销售金额', '状态', '操作']
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
        dispatchSelect: [{name: '全部', value: '', key: 'all', num: 0}, {name: '待发布', value: 1, key: 'wait_submit', num: 0}, {name: '待采购', value: 2, key: 'success', num: 0}, {name: '已完成', value: 3, key: 'success', num: 0}],
      }
    },
    computed: {
      ...omsComputed
    },
    created() {
      this._getOutOrdersStatistic()
    },
    methods: {
      ...omsMethods,
      _getOutOrdersStatistic() {
        API.Oms.outOrdersStatistic({start_time: this.startTime ? this.startTime + ' ' + this.timeStart : '', end_time: this.endTime ? this.endTime + ' ' + this.timeEnd : '', keyword: this.keyword}).then((res) => {
          if (res.error !== this.$ERR_OK) {
            return
          }
          let selectData = res.data.map((item) => {
            return {
              name: item.status_str,
              status: item.status,
              num: item.statistic
            }
          })
          this.dispatchSelect = selectData
        })
      },
      changeStatus(selectStatus) {
        this.setStatus(selectStatus)
        this.$refs.pagination.beginPage()
      },
      changeKeyword(keyword) {
        this.setKeyword(keyword)
        this.$refs.pagination.beginPage()
        this._getOutOrdersStatistic()
      },
      changeStartTime(value) {
        if (Date.parse(value) > Date.parse(this.endTime)) {
          this.$toast.show('开始时间不能大于结束时间')
          return
        }
        this.setStartTime(value)
        this.$refs.pagination.beginPage()
        this._getOutOrdersStatistic()
      },
      changeEndTime(value) {
        if (Date.parse(this.startTime) > Date.parse(value)) {
          this.$toast.show('开始时间不能大于结束时间')
          return
        }
        this.setEndTime(value)
        this.$refs.pagination.beginPage()
        this._getOutOrdersStatistic()
      },
      _setStatus(item) {
        this.setStatus(item)
        this.$refs.pagination.beginPage()
        this._getOutOrdersStatistic()
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
