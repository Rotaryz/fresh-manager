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
            <base-search placeHolder="订单号或商户名称" :infoText="merchantFilter.keyword" @search="changeMerchantKeyword"></base-search>
          </div>
        </div>
      </div>
      <div class="table-content">
        <div class="identification">
          <div class="identification-page">
            <img :src="tabStatus[0].img" class="identification-icon">
            <p class="identification-name">{{tabStatus[0].text}}</p>
            <base-status-nav :statusList="dispatchSelect" :value="merchantFilter.status" valueKey="status" labelKey="status_str" numKey="statistic"
                             @change="setValue"
            ></base-status-nav>
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
          <base-pagination ref="paginationMerchant" :pageDetail="pageTotal" :pagination="merchantFilter.page" @addPage="setOrderPage"></base-pagination>
        </div>
      </div>
    </template>

    <!--消费者订单-->
    <template v-if="tabIndex === 1">
      <div class="down-content">
        <span class="down-tip">下单时间</span>
        <div class="down-item">
          <base-date-select :placeHolder="datePlaceHolder" :dateInfo="timeArr" @getTime="changeTime"></base-date-select>
        </div>
        <span class="down-tip">异常状态</span>
        <div class="down-item">
          <base-drop-down :select="unusualSelect" @setValue="_selectUnusual"></base-drop-down>
        </div>
        <div class="distribution-down">
          <span class="down-tip">搜索</span>
          <div class="down-item">
            <base-search placeHolder="订单号、商户名称货会议名称" :infoText="merchantFilter.keyword" @search="changeMerchantKeyword"></base-search>
          </div>
        </div>
      </div>
      <div class="table-content">
        <div class="identification">
          <div class="identification-page">
            <img :src="tabStatus[1].img" class="identification-icon">
            <p class="identification-name">{{tabStatus[1].text}}</p>
            <base-status-nav :statusList="consumerStatusTab" :value="merchantFilter.status" valueKey="status" labelKey="status_str" numKey="statistic"
                             @change="setValue"
            ></base-status-nav>
          </div>
          <router-link tag="a" to="consumer-order-detail" append class="btn-main">补录订单</router-link>
        </div>
        <div class="big-list">
          <div class="list-header list-box">
            <div v-for="(item,index) in commodities" :key="index" class="list-item" :style="{flex: item.flex}" :class="['list-item',item.class]">{{item.title}}</div>
          </div>
          <div class="list">
            <template v-if="orderList.length">
              <div v-for="(row, index) in orderData" :key="index" class="list-content list-box">
                <div v-for="item in commodities" :key="item.key" :style="{flex: item.flex}" :class="['list-item',item.class]">
                  <template v-if="item.key" name="name">
                    {{row[item.key]}}
                    <div v-if="item.key ==='type_count'" class="lack-icon">
                    </div>
                  </template>
                  <template v-else name="operation">
                    <router-link class="list-operation" :to="{name:'consumer-order-detail', params:{id:row.id}}">{{item.operation}}</router-link>
                  </template>
                </div>
              </div>
            </template>
            <base-blank v-else></base-blank>
          </div>
        </div>
        <div class="pagination-box">
          <base-pagination
            ref="paginationMerchant"
            :pageDetail="pageTotal"
            :pagination="merchantFilter.page"
            @addPage="setOrderPage"
          ></base-pagination>
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
    {title: '操作', key: '', operation: '详情', flex: 1, class: 'operate'}
  ]
  const COMMODITIES_LIST2 = [
    {title: '订单号', key: 'order_sn', flex: 1},
    {title: '会员名称', key: 'order_name', flex: 1},
    {title: '会员手机号', key: 'mobile', flex: 1},
    {title: '商品', key: 'goods_name', flex: 1},
    {title: '下单数量', key: 'type_count', flex: 1},
    {title: '商户名称', key: 'buyer_name', flex: 1},
    {title: '状态', key: 'status', flex: 1},
    {title: '订单来源', key: 'order_resource', flex: 1},
    {title: '操作', key: '', operation: '详情', flex: 1, class: 'operate'}
  ]

  const ORDER_DATA = [
    {
      order_sn: '123123',
      order_name: '小李',
      mobile: '13584260103',
      goods_name: '苹果',
      type_count: '2份',
      buyer_name: '广海花园社区',
      status: '待分拣',
      order_resource: '人工补录'
    },
    {
      order_sn: '123123',
      order_name: '小李',
      mobile: '13584260103',
      goods_name: '苹果',
      type_count: '2份',
      buyer_name: '广海花园社区',
      status: '待分拣',
      order_resource: '人工补录'
    },
    {
      order_sn: '123123',
      order_name: '小李',
      mobile: '13584260103',
      goods_name: '苹果',
      type_count: '2份',
      buyer_name: '广海花园社区',
      status: '待分拣',
      order_resource: '人工补录'
    }
  ]
  const ORDERSTATUS = [
    {text: '商户订单', status: 0, img: require('./icon-order_list2@2x.png')},
    {text: '消费者订单', status: 1, img: require('./pic-zanwu@2x.png')}
    // {text: '商品汇总单', status: 1, img: require('./pic-zanwu@2x.png')}
  ]
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        tabStatus: ORDERSTATUS,
        commodities: COMMODITIES_LIST,
        orderData: ORDER_DATA,
        datePlaceHolder: '选择下单日期',
        orderKeyword: '',
        signItem: {},
        unusualSelect: {
          check: false,
          show: false,
          content: '全部',
          type: 'default',
          data: [{name: '全部', status: ''}, {name: '正常', status: '0'}, {name: '异常', status: '1'}]},
        dispatchSelect: [
          {name: '全部', value: '', num: 0},
          {name: '待调度', value: 0, num: 0},
          {name: '待出库', value: 1, num: 0},
          {name: '待配送', value: 2, num: 0},
          {name: '已完成', value: 3, num: 0}
        ],
        consumerStatusTab: [
          {status_str: '全部', status: '', statistic: 0},
          {status_str: '待分拣', status: 0, statistic: 0},
          {status_str: '待出库', status: 1, statistic: 0},
          {status_str: '代配送', status: 2, statistic: 0},
          {status_str: '已完成', status: 3, statistic: 0}
        ]
      }
    },
    computed: {
      ...merchantOrderComputed,
      timeArr() {
        return [this.merchantFilter.start_time, this.merchantFilter.end_time]
      },
      timeArrConsumer() {
        return [this.consumerFilter.start_time, this.consumerFilter.end_time]
      }
    },
    async created() {
      this.commodities = this.tabIndex === 0 ? COMMODITIES_LIST : COMMODITIES_LIST2
      this._getStatusData()
    },
    methods: {
      ...merchantOrderMethods,
      // 顶部 切换
      _changeStatusTab(item, index) {
        this.SET_TAB_INDEX(index)
        this.commodities = index === 0 ? COMMODITIES_LIST : COMMODITIES_LIST2
        if (!this.tabIndex) {
          // 待调度
          this._updateMerchantOrderList({
            page: 1,
            limit: 10,
            start_time: '',
            end_time: '',
            type: '',
            status: 0,
            keyword: ''
          })
        } else {
          this._updateMerchantOrderList({
            page: 1,
            limit: 10,
            start_time: '',
            end_time: '',
            status: 0,
            keyword: '',
            type: '',
            usual: ''
          })
        }
      },
      _selectUnusual(item) {
        console.log(item)
      },
      // 获取订单列表
      _updateMerchantOrderList(params, noUpdateStatus) {
        this.SET_PARAMS(params)
        if (!noUpdateStatus) {
          this._getStatusData()
        }
        // this.getMerchantOrderList()
        if (params.page === 1) {
          this.$nextTick(function() {
            this.$refs.paginationMerchant.beginPage()
          })
        }
      },
      // 状态数据
      _getStatusData() {
        // let params = {start_time, end_time, keyword, type} = this.merchantFilter
        let params = {
          start_time: this.merchantFilter.start_time,
          end_time: this.merchantFilter.end_time,
          keyword: this.merchantFilter.keyword,
          type: this.merchantFilter.type
        }
        API.MerchantOrder.getStausData(params).then((res) => {
          if (res.error !== this.$ERR_OK) {
            return false
          }
          this.dispatchSelect = res.data
        })
      },
      // 翻页
      setOrderPage(page) {
        this._updateMerchantOrderList({page}, true)
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
          status: item,
          page: 1
        })
      },
      // 商户订单搜索
      changeMerchantKeyword(keyword) {
        this._updateMerchantOrderList({
          keyword,
          page: 1
        })
      }
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
