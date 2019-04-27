<template>
  <div class="distribution-task table">
    <base-tab-select :infoTabIndex="tabIndex" :tabStatus="tabStatus" :lineWidth="104" @getStatusTab="_changeStatusTab"></base-tab-select>
    <template v-if="tabIndex===0">
      <div class="down-content">
        <span class="down-tip">下单时间</span>
        <div class="down-item">
          <base-date-select :placeHolder="datePlaceHolder" :dateInfo="timeArr" @getTime="changeTime"></base-date-select>
        </div>
        <div class="distribution-down">
          <span class="down-tip">搜索</span>
          <div class="down-item">
            <base-search placeHolder="订单号或商户名称" @search="changeKeyword"></base-search>
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
            <div v-for="(item,index) in commodities" :key="index" class="list-item" :style="{flex: item.flex}" :class="['list-item',item.class]">{{item.title}}</div>
          </div>
          <div class="list">
            <template v-if="orderList.length">
              <div v-for="(row, index) in orderList" :key="index" class="list-content list-box">
                <div v-for="item in commodities" :key="item.key" :style="{flex: item.flex}" :class="['list-item',item.class]">
                  <template v-if="item.key" name="name">
                    {{row[item.key]}}
                    <div v-if="item.key ==='type_count' && row[item.after]" class="lack-icon">
                    </div>
                  </template>
                  <template v-else name="operation">
                    <router-link class="list-operation" :to="{name:'merchant-order-detail',params:{id:row.id}}">{{item.operation}}</router-link>
                  </template>
                </div>
              </div>
            </template>
            <base-blank v-else></base-blank>
          </div>
        </div>
        <div class="pagination-box">
          <base-pagination ref="paginationMerchant" :pageDetail="pageTotal" @addPage="setOrderPage"></base-pagination>
        </div>
      </div>
    </template>
    <!--汇总订单表-->
    <template v-if="tabIndex===1">
      <div class="down-content">
        <span class="down-tip">建单时间</span>
        <div class="down-item">
          <base-date-select :placeHolder="datePlaceHolderMerger" :dateInfo="timeArrMerger" @getTime="_changeTimeMerger"></base-date-select>
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
            <div v-for="(item,index) in commodities" :key="index" class="list-item" :style="{flex: item.flex}" :class="['list-item',item.class]">{{item.title}}</div>
          </div>
          <div class="list">
            <template v-if="merger.list.length">
              <div v-for="(row, index) in merger.list" :key="index" class="list-content list-box">
                <div v-for="item in commodities" :key="item.key" :style="{flex: item.flex}" class="list-item" :class="['list-item',item.class]">
                  <template v-if="item.key" name="name">
                    {{row[item.key]}}
                  </template>
                  <template v-else name="operation">
                    <router-link :to="{name:'merger-order-detail',params:{mergeOrderId:row.merge_order_id}}" class="list-operation">{{item.operation}}</router-link>
                  </template>
                </div>
              </div>
            </template>
            <base-blank v-else></base-blank>
          </div>
        </div>
        <div class="pagination-box">
          <base-pagination ref="paginationMerger" :pageDetail="merger.pageTotal" @addPage="_setMergerPage"></base-pagination>
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
    {title: '下单时间', key: 'created_at', flex: 1.5},
    {title: '订单号 ', key: 'order_sn', flex: 1.5},
    {title: '商户名称', key: 'buyer_name', flex: 1},
    {title: '品类数', key: 'type_count', flex: 0.6, after: 'is_lack'},
    {title: '状态', key: 'status_str', flex: 0.6},
    // {title: '类型', key: 'type_str', flex: 0.8},
    {title: '操作', key: '', operation: '详情', flex: 1, class: "operate"}
  ]
  const COMMODITIES_LIST2 = [
    {title: '下单时间', key: 'created_at', flex: 3},
    {title: '汇总订单号', key: 'order_sn', flex: 3},
    {title: '品类数', key: 'type_count', flex: 1},
    {title: '操作', key: '', operation: '详情', flex: 1, class: "operate"}
  ]
  const ORDERSTATUS = [{text: '商户订单', status: 0, img: require('./icon-order_list2@2x.png')}, {text: '商品汇总单', status: 1, img: require('./pic-zanwu@2x.png')}]
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        tabStatus: ORDERSTATUS,
        commodities: COMMODITIES_LIST,
        datePlaceHolder: "选择下单日期",
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
        statusTab: 2,// 待调度
        datePlaceHolderMerger: "选择下单日期",
        merger: {
          pageTotal: {
            // 页码详情
            total: 1,
            per_page: 10,
            total_page: 1
          },
          list: [],
          filter: {
            start_time: "",
            end_time: ""
          }
        }
      }
    },
    computed: {
      ...merchantOrderComputed,
      timeArr() {
        return [this.merchantFilter.start_time, this.merchantFilter.end_time]
      },
      timeArrMerger() {
        return [this.merchantFilter.start_time, this.merchantFilter.end_time]
      }
    },
    async created() {
      this.commodities = this.tabIndex === 0 ? COMMODITIES_LIST : COMMODITIES_LIST2
      if (this.$route.query.status) {
        this.statusTab = this.$route.query.status * 1
      }
      this._getStatusData()
    },
    methods: {
      ...merchantOrderMethods,
      // 顶部 切换
      _changeStatusTab(item, index) {
        this.tabIndex = index
        this.commodities = index === 0 ? COMMODITIES_LIST : COMMODITIES_LIST2
        if (!this.tabIndex) {
          // 待调度
          this.statusTab = 2
          this._updateMerchantOrderList({
            page: 1,
            limit: 10,
            start_time: '',
            end_time: '',
            type: "",
            status: 0,
            keyword: ""
          })
        } else {
          this._updateMergerList()
        }
      },
      _updateMergerList(params = {}) {
        let defautFilter = {
          start_time: "",
          end_time: ""
        }
        params = {...defautFilter, ...params}
        this.merger.filter = {...this.merger.filter, ...params}
        this._getMergeOrderslist()
        if (params.page === 1) {
          this.$refs.paginationMerger.beginPage()
        }
      },
      _getMergeOrderslist() {
        API.MerchantOrder.getMergeOrderslist(this.merger.filter).then(res => {
          this.merger.list = res.data
        }).catch(() => {
          return false
        })
          .finally(() => {
            this.$loading.hide()
          })
      },
      // 时间选择器
      _changeTimeMerger(timeArr) {
        this._updateMergerList({start_time: timeArr[0], end_time: timeArr[1]})
      },
      // 页面更改
      _setMergerPage(page) {
        this._updateMergerList({page})
      },
      /**
       商户订单
       **/
      // 更新商户订单
      _updateMerchantOrderList(params, noUpdateStatus) {
        this.SET_PARAMS(params)
        if (!noUpdateStatus) {
          this._getStatusData()
        }
        this.getMerchantOrderList()
        if (params.page === 1) {
          this.$refs.paginationMerchant.beginPage()
        }
      },
      // 状态数据
      _getStatusData() {
        // let params = {start_time, end_time, keyword, type} = this.merchantFilter
        let params = {
          start_time: this.merchantFilter.start_time,
          end_time: this.merchantFilter.end_time,
          keyword: this.merchantFilter.keyword,
          type: this.merchantFilter.type,
        }
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
      // 翻页
      setOrderPage(page) {
        this._updateMerchantOrderList({
          page
        }, true)
      },
      // 时间
      changeTime(timeArr = ['', '']) {
        this._updateMerchantOrderList({
          start_time: timeArr[0],
          end_time: timeArr[1],
          page: 1
        })
      },
      // 状态
      setValue(item) {
        this._updateMerchantOrderList({
          status: item.value,
          page: 1
        }, true)
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
  .list-operation
    text-decoration: underline

  .operate
    max-width: 50px

  .lack-icon
    width: 16px
    height: 16px
    icon-image(icon-lack)

  .distribution-down
    display: flex
    align-items: center
</style>
