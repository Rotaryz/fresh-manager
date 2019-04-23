<template>
  <div class="distribution-task table">
    <base-tab-select :infoTabIndex="tabIndex" :tabStatus="tabStatus" :lineWidth="104" @getStatusTab="changeStatusTab"></base-tab-select>
    <template v-if="tabIndex===0">
      <div class="down-content">
        <span class="down-tip">建单时间</span>
        <div class="down-item">
          <base-date-select :placeHolder="datePlaceHolder" :dateInfo="timeArr" @getTime="changeTime"></base-date-select>
        </div>
        <span class="down-tip">类型</span>
        <div class="down-item down-group-item">
          <base-drop-down :select="typeFilter" @setValue="_setTypeFilter"></base-drop-down>
        </div>
        <div class="distribution-down">
          <span class="down-tip">搜索</span>
          <div class="down-item">
            <base-search placeHolder="配送单号/商户名称" @search="changeKeyword"></base-search>
          </div>
        </div>

      </div>
      <div class="table-content">
        <div class="identification">
          <div class="identification-page">
            <img :src="tabStatus[0].img" class="identification-icon">
            <p class="identification-name">{{tabStatus[0].text}}</p>
            <base-status-tab :statusList="dispatchSelect" :infoTabIndex="statusTab" @setStatus="setValue"></base-status-tab>
          </div>
        </div>
        <div class="big-list">
          <div class="list-header list-box">
            <div v-for="(item,index) in commodities" :key="index" class="list-item" :style="{flex: item.flex}">{{item.title}}</div>
          </div>
          <div class="list">
            <div v-if="tabIndex === 0">
              <div v-for="(item, index) in orderList" :key="index" class="list-content list-box">
                <div v-for="row in commodities" :key="row.key" :style="{flex: row.flex}" class="list-item">
                  <template v-if="row.key" name="name">
                    {{item[row.key]}}
                  </template>
                  <template v-else name="operation">
                    <router-link class="list-operation" :to="{name:'merchant-order-detail',params:{id:item.id}}">{{row.operation}}</router-link>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="pagination-box">
          <base-pagination ref="pagination" :pageDetail="pageTotal" @addPage="setOrderPage"></base-pagination>
        </div>
      </div>
    </template>
    <!--汇总订单表-->
    <template v-if="tabIndex===1">
      <div class="down-content">
        <span class="down-tip">建单时间</span>
        <div class="down-item">
          <base-date-select :placeHolder="datePlaceHolderMerger" :dateInfo="timeArrMerger" @getTime="changeTimeMerger"></base-date-select>
        </div>
      </div>
      <div class="table-content">
        <div class="identification">
          <div class="identification-page">
            <img :src="tabStatus[1].img" class="identification-icon">
            <p class="identification-name">{{tabStatus[1].text}}</p>
          </div>
        </div>
        <div class="big-list">
          <div class="list-header list-box">
            <div v-for="(item,index) in commodities" :key="index" class="list-item" :style="{flex: item.flex}">{{item.title}}</div>
          </div>
          <div class="list">
            <div v-for="(item, index) in mergeOrderslist" :key="index" class="list-content list-box">
              <div v-for="row in commodities" :key="row.key" :style="{flex: row.flex}" class="list-item">
                <template v-if="row.key" name="name">
                  {{item[row.key]}}
                </template>
                <template v-else name="operation">
                  <router-link :to="{name:'merger-order-detail',params:{id:item.merge_order_id}}" class="list-operation">{{row.operation}}</router-link>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="pagination-box">
          <base-pagination :pageDetail="pageTotalMerger" @addPage="setMergerPage"></base-pagination>
        </div>
      </div>
    </template>
  </div>
</template>

<script type="text/ecmascript-6">
  import {merchantOrderComputed, merchantOrderMethods} from '@state/helpers'
  import API from '@api'

  const PAGE_NAME = 'MERCHANT_ORDER'
  const TITLE = '商户订单'
  const COMMODITIES_LIST = [
    {title: '下单时间', key: 'created_at', flex: 1},
    {title: '订单号 ', key: 'order_sn', flex: 1},
    {title: '商户名称', key: 'buyer_name', flex: 1.3},
    {title: '品类数', key: 'type_count', flex: 0.6},
    {title: '状态', key: 'status', flex: 1},
    {title: '类型', key: 'type_str', flex: 1.3},
    {title: '操作', key: '', operation: '详情', flex: 0.7}
  ]
  const COMMODITIES_LIST2 = [
    {title: '下单时间', key: 'created_at', flex: 1},
    {title: '汇总订单号', key: 'merge_order_id', flex: 1},
    {title: '品类数', key: 'type_count', flex: 1},
    {title: '操作', key: '', operation: '详情', flex: 0.32}
  ]
  const ORDERSTATUS = [{text: '订单列表', status: 0, img: require('./icon-order_list2@2x.png')}, {text: '汇总单列表', status: 1, img: require('./pic-zanwu@2x.png')}]
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        tabStatus: ORDERSTATUS,
        commodities: COMMODITIES_LIST,
        datePlaceHolder: "选择建单日期",
        timeArr: [],
        typeFilter: {
          check: false,
          show: false,
          content: '全部',
          type: 'default',
          data: [{name: '全部', id: ''}]
        },
        tabIndex: 0,
        orderKeyword: "",
        signItem: {},
        dispatchSelect: [
          {name: '全部', value: '', num: 0},
          {name: '锁定中', value: 5, num: 0},
          {name: '待调度', value: 0, num: 0},
          {name: '待配送', value: 2, num: 0},
          {name: '已完成', value: 3, num: 0}
        ],
        statusTab: 0,
        mergeOrderslist: [],
        datePlaceHolderMerger: "选择下单日期",
        timeArrMerger: ["", ""],
        pageTotalMerger: {
          // 页码详情
          total: 1,
          per_page: 10,
          total_page: 1
        },
        filterMerger: {
          page: 1,
          time_start: "",
          time_end: ""
        }
      }
    },
    computed: {
      ...merchantOrderComputed,
    },
    async created() {
      console.log(this.orderList, 'orderList')
      this.commodities = this.tabIndex === 0 ? COMMODITIES_LIST : COMMODITIES_LIST2
      if (this.$route.query.status) {
        this.statusTab = this.$route.query.status * 1
      }
      this.getTypeList()
      this.getStatusData()
    },
    methods: {
      ...merchantOrderMethods,
      // 顶部 切换
      changeStatusTab(item, index) {
        console.log(item, index)
        this.tabIndex = index
        this.commodities = index === 0 ? COMMODITIES_LIST : COMMODITIES_LIST2
        if(!this.tabIndex){
          this._updateMerchantOrderList({
            page: 1,
            limit: 10,
            start_time: '',
            end_time: '',
            type: "",
            status: "",
            keyword: ""
          })
        }else{
          this.clearEmptyMerger()
        }
      },
      _updateMerchantOrderList(params) {
        this.SET_PARAMS(params)
        this.getMerchantOrderList()
      },
      _updateMergerList(params){
        this.filterMerger = {...this.filterMerger,...params}
        this.getMergeOrderslist()
      },
      clearEmptyMerger(params) {
        this.timeArrMerger = ["", ""]
        this._updateMergerList({
          page: 1,
          time_start: "",
          time_end: ""
        })
      },
      getMergeOrderslist() {
        API.MerchantOrder.getMergeOrderslist(this.filterMerger).then(res => {
          this.mergeOrderslist = res.data
        })
      },
      // 时间选择器
      changeTimeMerger(timeArr) {
        this.timeArrMerger = timeArr
        this._updateMergerList({time_start:this.timeArrMerger[0],time_end:this.timeArrMerger[1]})
      },
      // 页面更改
      setMergerPage(page) {
        this._updateMergerList({page})
      },
      /**
       商户订单
       **/
      // 状态数据
      getStatusData(params) {
        API.MerchantOrder.getStausData(params).then(res => {
          this.dispatchSelect = res.data.map(item => {
            return {
              name: item.status_str,
              value: item.status,
              num: item.statistic
            }
          })
        })
      },
      // 类型列表
      getTypeList() {
        API.MerchantOrder.getTypeList().then(res => {
          this.typeFilter.data = res.data.map(item => {
            return {
              name: item.type_str,
              value: item.type
            }
          })
        })
      },
      // 翻页
      setOrderPage(page) {
        this._updateMerchantOrderList({
          page
        })
      },
      // 时间
      changeTime(timeArr = ['', '']) {
        this._updateMerchantOrderList({
          start_time: timeArr[0],
          end_time: timeArr[1],
          page: 1
        })
        this.getStatusData({
          start_time: timeArr[0],
          end_time: timeArr[1]
        })
      },
      // 类型
      _setTypeFilter(item) {
        this._updateMerchantOrderList({
          type: item.value,
          page: 1
        })
        this.getStatusData({
          keyword: item.name
        })
      },
      // 状态
      setValue(item) {
        this._updateMerchantOrderList({
          status: item.value,
          page: 1
        })
      },
      // 搜索按钮
      changeKeyword(keyword) {
        this._updateMerchantOrderList({
          keyword,
          page: 1
        })
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .distribution-down
    display: flex
    align-items: center
</style>
