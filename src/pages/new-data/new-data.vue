<template>
  <div class="new-data">
    <div class="data-header-box">
      <div class="data-header-left">
        <div class="header-left-box">
          <div class="identification survey-box">
            <div class="identification-page">
              <img src="./icon-real_time@2x.png" class="identification-icon">
              <p class="identification-name">实时总览</p>
            </div>
            <div class="refresh-btn" @click="_getRealTimeData">
              <div class="refresh-icon"></div>
              刷新
            </div>
          </div>
          <div class="real-time-con">
            <div class="real-time-chart">
              <div class="info-con">
                <div class="info-left">
                  <img src="./icon-money_more@2x.png" class="info-icon">
                  <div class="info-box">
                    <div class="info-title">支付金额(元)</div>
                    <div class="info-val">
                      {{realResData.today_pay_amount_total}}
                    </div>
                  </div>
                </div>
                <div class="info-right">
                  <span class="small-text">昨日(元): {{realResData.yestoday_pay_amount_total}}</span>
                  <span class="small-text">总计(元): {{realResData.all_pay_amount_total}}</span>
                </div>
              </div>
              <e-chart-line ref="realTimeChart" chartId="realTimeChart" class="real-time-chart"></e-chart-line>
            </div>
            <div class="real-time-box">
              <div v-for="(item, index) in realData" :key="index" class="real-list-box">
                <div class="top-box">
                  <div class="real-list-box-icon" :class="item.imgUrl"></div>
                  <div class="real-text">
                    <div class="real-text-title">{{item.title}}</div>
                    <div class="real-text-number">{{realResData[item.key[0]]}}</div>
                  </div>
                </div>
                <div class="bottom-box">
                  昨日: {{realResData[item.key[1]]}}
                </div>
                <div class="bottom-box">
                  总计: {{realResData[item.key[2]]}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="data-header-right">
        <div class="base-box">
          <div class="identification survey-box">
            <div class="identification-page">
              <img src="./icon-basics@2x.png" class="identification-icon">
              <p class="identification-name">基础功能</p>
            </div>
          </div>
          <div class="base-function-box">
            <div v-for="(item, index) in baseList" :key="index" class="base-list-item" @click="jumpBase(item)">
              <div class="base-item-title">{{item.title}}</div>
              <div class="base-number-box">
                <div class="number-left">{{item.number}}</div>
              </div>
              <div class="base-list-arrow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="data-board">
      <div class="title-bar">
        <div class="left-box">
          <img src="./icon-7day@2x.png" class="title-icon">
          <p class="title">数据看板</p>
          <ul class="tab">
            <li v-for="(item, idx) in dataBoard" :key="idx" class="tab-item" @click="_switchTab(item,idx)">
              {{item.title}}
            </li>
            <li :style="{'transform':'translateX('+dataBoardIndex*84+'px)'}" class="tab-item tab-active">
              {{dataBoard[dataBoardIndex].title}}
            </li>
          </ul>
        </div>
        <base-date-picker :infoTab="0" :arrTitle="dateArr" @checkTime="_dataBoardChangeDate"></base-date-picker>
      </div>
      <div class="bottom-con">
        <div class="label-con">
          <div class="data-date"></div>
          <div v-for="(label, labelIdx) in dataBoard[dataBoardIndex].label" :key="labelIdx" class="label">
            {{label.name}}
            <p class="label-val" :title="label.total">
              {{label.total}}
              <template v-if="label.unit">{{label.unit}}</template>
            </p>
          </div>
        </div>
        <e-chart-line ref="dataBoardChart" chartId="dataBoardChart" class="data-board-chart"></e-chart-line>
      </div>
    </div>
    <div class="rank-list">
      <div class="identification survey-box">
        <div class="identification-page">
          <img src="./icon-ranking@2x.png" class="identification-icon">
          <p class="identification-name">排行</p>
        </div>
        <base-date-picker :disabledCurDate="false" :infoTab="0" :arrTitle="dateArr" @checkTime="_rankListChangeDate"></base-date-picker>
      </div>
      <div class="rank-list-content">
        <div v-for="(list,index) in rankDir" :key="index" class="rank-list-con">
          <div class="title-bar">
            <div class="left-box">
              <p class="title">{{list.title}}</p>
            </div>
            <a v-if="list.excelUrl&&list.data.length>0" :href="list.excelUrl" target="_blank" class="excel-btn">导出Excel</a>
          </div>
          <div class="big-list">
            <template v-if="list.data&&list.data.length>0">
              <div class="list-head">
                <div v-for="(th,thIdx) in list.tableHead" :key="thIdx" class="list-item">{{th}}</div>
              </div>
              <div class="list">
                <div v-for="(item, idx) in list.data" :key="idx" class="list-content">
                  <div v-for="(key, keyIdx) in list.dataKey" :key="keyIdx" class="list-item">
                    <template v-if="key==='index'">
                      <div v-if="list.pager.curPage===1&&idx<3" :src="item[key]" :class="'rank-'+(idx+1)" class="rank-icon"></div>
                      <p v-else class="list-rank-num">{{(list.pager.curPage-1)*rankLimit+idx+1}}</p>
                    </template>
                    <template v-else-if="Array.isArray(key)">
                      <div class="list-text">{{item[key[0]]}}({{item[key[1]]}})</div>
                    </template>
                    <template v-else>
                      <div v-if="key==='name'&&item.goods_cover_image" class="list-img">
                        <img :src="item.goods_cover_image" class="data-list-img">
                      </div>
                      <div class="list-text">{{item[key]}}</div>
                    </template>
                  </div>
                </div>
              </div>
              <div class="pager-bar">
                <div class="page-btn btn-prev" @click="_changePage(list,-1)"></div>
                <div class="page-con">{{list.pager.curPage}}/{{list.pager.pageTotal}}</div>
                <div class="page-btn btn-next" @click="_changePage(list,1)"></div>
              </div>
            </template>
            <p v-else class="no-data-tips">暂无数据</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import storage from 'storage-controller'
  import {deliveryMethods} from '@state/helpers'

  import API from '@api'
  import moment from 'moment'
  import EChartLine from '@components/e-chart/e-chart-line'
  import {formatNumber} from '@utils/common'

  const PAGE_NAME = 'NEW_DATA'
  const TITLE = '数据'
  const NOW_DATE = moment(Date.now()).format('YYYY-MM-DD')
  const PRE_DATE = moment(Date.now() - 86400000).format('YYYY-MM-DD')
  const REAL_DATA = [
    {
      imgUrl: '',
      title: '访客数',
      key: ['today_page_customer_total', 'yestoday_page_customer_total', 'all_page_customer_total']
    },
    {
      imgUrl: 'users',
      title: '支付用户',
      key: ['today_pay_customer_total', 'yestoday_pay_customer_total', 'all_pay_customer_total']
    },
    {
      imgUrl: 'browse_volume',
      title: '浏览量',
      key: ['today_page_browsing_total', 'yestoday_page_browsing_total', 'all_page_browsing_total']
    },
    {
      imgUrl: 'wallet',
      title: '支付订单',
      key: ['today_pay_order_total', 'yestoday_pay_order_total', 'all_pay_order_total']
    }
  ]
  const BASE_LIST = [
    {title: '上架商品', key: 'goods_count', number: 0, url: '/home/product-list?online=1', permissions: 'goods'},
    {
      title: '进行中活动',
      key: 'activity_count',
      number: 0,
      url: '/home/activity-manage?status=1',
      permissions: 'activity'
    },
    {title: '团长', key: 'shop_manage_count', number: 0, url: '/home/leader-list?status=0', permissions: 'shop-manager'},
    {title: '供应商', key: 'supplier_count', number: 0, url: '/home/basics-set/supplier', permissions: 'supplier'},
    {title: '采购员', key: 'purchase_user_count', number: 0, url: '/home/basics-set/buyer', permissions: 'purchase-user'},
    {title: '司机', key: 'driver_count', number: 0, url: '/home/dispatching-management', permissions: 'driver'}
  ]
  const DATE_ARR = [{title: '日', status: 'day'}, {title: '周', status: 'week'}, {title: '月', status: 'month'}]
  const REAL_TIME = {
    label: [{name: '今日', key: 'amount_total', total: ''}, {name: '昨日', key: 'num_total', total: ''}],
    chartConfig: {
      dataArr: [{name: '今日', key: 'today', data: []}, {name: '昨日', key: 'yestoday', data: []}],
      xAxleData: [],
      legendOnTop: true,
      lineShadow: 'false'
    }
  }
  const DATA_BOARD = [
    {
      apiFun: 'flowData',
      title: '流量',
      label: [{name: '浏览量(PV)', key: 'pv_total', total: ''}, {name: '访客数(UV)', key: 'uv_total', total: ''}],
      chartConfig: {
        dataArr: [{name: '浏览量', key: 'pv', data: []}, {name: '访客数', key: 'uv', data: []}],
        xAxleData: [],
        lineShadow: 'false'
      }
    },
    {
      apiFun: 'businessData',
      title: '成交',
      label: [
        {name: '支付金额(元)', key: 'sales_amount_total', total: ''},
        {name: '客单价(元)', key: 'customer_unit_amount_total', total: ''},
        {name: '销售数量', key: 'sales_num_total', total: ''}
      ],
      chartConfig: {
        dataArr: [
          {name: '支付金额', key: 'sales_amount', data: []},
          {name: '客单价', key: 'customer_unit_amount', data: []},
          {name: '销售数量', key: 'sales_num', data: []}
        ],
        xAxleData: [],
        lineShadow: 'false'
      }
    },
    {
      apiFun: 'orderData',
      title: '订单',
      label: [
        {name: '支付用户', key: 'pay_customer_num_total', total: ''},
        {name: '支付订单', key: 'order_num_total', total: ''},
        {name: '支付转化率', key: 'pay_conversion_rate_total', total: '', unit: '%'}
      ],
      chartConfig: {
        dataArr: [
          {name: '支付用户', key: 'pay_customer_num', data: []},
          {name: '支付订单', key: 'order_num', data: []},
          {name: '支付转化率', key: 'pay_conversion_rate', data: []}
        ],
        xAxleData: [],
        lineShadow: 'false'
      }
    },
    {
      apiFun: 'servicesData',
      title: '售后',
      label: [
        {name: '退货金额(元)', key: 'after_amount_total', total: ''},
        {name: '退货数量', key: 'after_num_total', total: ''}
      ],
      chartConfig: {
        dataArr: [{name: '退货金额', key: 'after_amount', data: []}, {name: '退货数量', key: 'after_num', data: []}],
        xAxleData: [],
        lineShadow: 'false'
      }
    }
  ]
  const RANK_LIMIT = 10

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      EChartLine
    },
    data() {
      return {
        realData: REAL_DATA,
        realResData: {},
        baseList: BASE_LIST,
        dateArr: DATE_ARR,
        downUrl: '',
        shopDownUrl: '',
        permissions: {},
        realTimeData: REAL_TIME,
        dataBoard: DATA_BOARD,
        dataBoardIndex: 0,
        dataBoardParams: {date_type: 'day', start_date: PRE_DATE},
        rankDir: {
          leader: {
            title: '团长',
            tableHead: ['排名', '团长', '销售额', '佣金'],
            apiFun: 'managerData',
            params: {date_type: 'day', start_date: NOW_DATE, page: 1, limit: RANK_LIMIT},
            data: [],
            dataKey: ['index', ['name', 'social_name'], 'total_order_money', 'total_settlement_money'],
            pager: {curPage: 1, pageTotal: 1},
            excelApi: '/social-shopping/api/backend/data-statistics-ranking-shop-excel',
            excelUrl: '',
            dataGetting: false
          },
          goods: {
            title: '商品',
            tableHead: ['排名', '商品', '销量', '销售额'],
            apiFun: 'goodsData',
            params: {date_type: 'day', start_date: NOW_DATE, page: 1, limit: RANK_LIMIT},
            data: [],
            dataKey: ['index', 'name', 'sale_count_sum', 'sale_total_sum'],
            pager: {curPage: 1, pageTotal: 1},
            excelApi: '/social-shopping/api/backend/data-statistics-ranking-goods-excel',
            excelUrl: '',
            dataGetting: false
          },
          search: {
            title: '搜索词',
            tableHead: ['排名', '搜索词', '搜索次数'],
            apiFun: 'searchData',
            params: {date_type: 'day', start_date: NOW_DATE, page: 1, limit: RANK_LIMIT},
            data: [],
            dataKey: ['index', 'keyword', 'times'],
            pager: {curPage: 1, pageTotal: 1},
            excelApi: '/social-shopping/api/backend/data-statistics-ranking-search-keyword-excel',
            excelUrl: '',
            dataGetting: false
          }
        },
        rankLimit: RANK_LIMIT,
        chartArr: [],
        getFinish: false
      }
    },
    watch: {
      getFinish(val) {
        if (val) {
          // 请求完设置eChart自适应窗口变化
          setTimeout(() => {
            this._setResize()
          }, 2000)
        }
      }
    },
    mounted() {
      this.$loading.show()
      this.permissions = storage.get('permissions')
      this._getRealTimeData(true)
      this._getShopBaseData()
      this._getDataBoard()
      this._getAllRankList()
    },
    methods: {
      ...deliveryMethods,
      // 实时总览
      _getRealTimeData(loading = false) {
        this._getSurveyTrade()
        this._getRealTimeChart(loading)
      },
      // 实时总览-数据
      _getSurveyTrade() {
        API.Data.tradeData().then((res) => {
          if (res.error === this.$ERR_OK) {
            this.realResData = res.data
          } else {
            this.$toast.show(res.message)
          }
          this.$loading.hide()
        })
      },
      // 实时总览-折线图
      _getRealTimeChart(loading = false) {
        let curChart = this.realTimeData
        let getSuccess = false
        API.Data.tradeDayData({}, loading)
          .then((res) => {
            if (res.error !== this.$ERR_OK) {
              return false
            }
            // 格式化接口返回的数据
            curChart = this.realTimeDataFormat(res.data, curChart)
            getSuccess = true
          })
          .finally(() => {
            this.chartArr[0] = this.$refs.realTimeChart._setChart(curChart.chartConfig, loading, getSuccess)
            this.getFinish = this.chartArr.length === 2
            loading && this.$loading.hide()
          })
      },
      realTimeDataFormat(result, curChart) {
        let chartConfig = curChart.chartConfig
        chartConfig.xAxleData = [] // 重置x轴数据
        // 遍历dataArr，通过key生成新的数组
        for (let j = 0; j < chartConfig.dataArr.length; j++) {
          let _chartData = chartConfig.dataArr[j]
          let _key = _chartData.key // 对应接口每个值的key
          _chartData.data = [] // 重置data
          // 遍历接口的data数组，通过配置的key赋值给当前的数组
          for (let i = 0; i < result[_key].length; i++) {
            let _resData = result[_key][i]
            _chartData.data.push(_resData.total_money)
            if (j === 0) {
              // x轴的date指生成一次就行了
              chartConfig.xAxleData.push(_resData.hour + 'h')
            }
          }
        }
        return curChart
      },
      // 基础功能
      _getShopBaseData() {
        let baseApi = ['getBaseData', 'getStatisticsBaseData']
        baseApi.forEach((apiName) => {
          API.Data[apiName]().then((res) => {
            if (res.error === this.$ERR_OK) {
              for (let idx in this.baseList) {
                let item = this.baseList[idx]
                let key = item.key
                if (res.data[key]) {
                  item.number = res.data[key]
                }
              }
            } else {
              this.$toast.show(res.message)
            }
          })
        })
      },
      // 数据看板
      _getDataBoard(loading = false) {
        let curChart = this.dataBoard[this.dataBoardIndex]
        let getSuccess = false
        API.Data[curChart.apiFun](this.dataBoardParams, loading)
          .then((res) => {
            if (res.error !== this.$ERR_OK) {
              return false
            }
            // 格式化接口返回的数据
            curChart = this.dataBoardFormat(res.data, curChart)
            getSuccess = true
          })
          .finally(() => {
            this.chartArr[1] = this.$refs.dataBoardChart._setChart(curChart.chartConfig, true, getSuccess)
            this.getFinish = this.chartArr.length === 2
            loading && this.$loading.hide()
          })
      },
      dataBoardFormat(result, curChart) {
        let chartConfig = curChart.chartConfig
        chartConfig.xAxleData = [] // 重置x轴数据
        // 遍历dataArr，通过key生成新的数组
        for (let j = 0; j < chartConfig.dataArr.length; j++) {
          let _chartData = chartConfig.dataArr[j]
          let _key = _chartData.key // 对应接口每个值的key
          let _curLabel = curChart.label[j]
          _curLabel.total = result[_curLabel.key] // 配置的label数组,用于设置每个图表上面的总计
          _chartData.data = [] // 重置data
          // 遍历接口的data数组，通过配置的key赋值给当前的数组
          for (let i = 0; i < result.list.length; i++) {
            let _resData = result.list[i]
            _chartData.data.push(_resData[_key]) // 通过key取出接口返回的值并push进数组
            if (j === 0) {
              // x轴的date指生成一个数组就行了
              let _date = ''
              switch (this.dataBoardParams.date_type) {
              case 'day':
                if (result.list[0].year < result.list[29].year) {
                  _date = _resData.month
                    ? _resData.year + '-' + formatNumber(_resData.month) + '-' + formatNumber(_resData.day)
                    : ''
                } else {
                  _date = _resData.month ? formatNumber(_resData.month) + '/' + formatNumber(_resData.day) : ''
                }
                break
              case 'week':
                _date = _resData.week ? _resData.year.toString().slice(2) + '年第' + _resData.week + '周' : ''
                break
              default:
                _date = _resData.month ? _resData.year.toString().slice(2) + '年' + _resData.month + '月' : ''
                break
              }
              chartConfig.xAxleData.push(_date)
            }
          }
        }
        return curChart
      },
      _getAllRankList() {
        for (let key in this.rankDir) {
          this._getRankList(this.rankDir[key])
        }
      },
      // 获取排行每个表格的数据
      _getRankList(obj) {
        API.Data[obj.apiFun](obj.params)
          .then((res) => {
            if (res.error === this.$ERR_OK) {
              obj.data = res.data
              obj.pager = {
                curPage: res.meta.current_page,
                pageTotal: res.meta.last_page
              }
              obj.dataGetting = false
              let currentId = this.getCurrentId()
              let token = (this.$storage.get('auth.currentUser', '') || {}).access_token
              let currentShop = process.env.VUE_APP_CURRENT_SHOP
              this._getExcelUrl(obj, `access_token=${token}&current_shop=${currentShop}&current_corp=${currentId}`)
            } else {
              this.$toast.show(res.message)
            }
          })
          .finally(() => {
            obj.dataGetting = false
          })
      },
      _getExcelUrl(obj, excelHeader) {
        let params = ``
        for (let key in obj.params) {
          params += `&${key}=${obj.params[key]}`
        }
        obj.excelUrl = `${process.env.VUE_APP_API}${obj.excelApi}?${excelHeader}${params}`
      },
      // 数据看板tab切换
      _switchTab(tab, tabIdx) {
        if (this.dataBoardIndex === tabIdx) return
        this.dataBoardIndex = tabIdx
        this._getDataBoard()
      },
      // 排行的分页切换
      _changePage(item, num) {
        let curPage = item.pager.curPage + num
        if (this.dataGetting || curPage < 1 || curPage > item.pager.pageTotal) return
        item.dataGetting = true
        item.params.page = curPage // 传给接口用
        this._getRankList(item)
      },
      _setResize() {
        // 设置chart自适应窗口大小变化
        let _that = this
        window.onresize = function() {
          for (let i = 0; i < _that.chartArr.length; i++) {
            _that.chartArr[i] && _that.chartArr[i].resize()
          }
        }
      },
      // 数据看板日期切换
      _dataBoardChangeDate(value, type) {
        this.dataBoardParams = {date_type: type, start_date: value}
        this._getDataBoard()
      },
      // 排行日期切换
      _rankListChangeDate(value, type) {
        for (let key in this.rankDir) {
          let obj = this.rankDir[key]
          obj.params.date_type = type
          obj.params.start_date = value
          obj.params.page = 1
        }
        this._getAllRankList()
      },
      jumpBase(item) {
        if (!this.permissions[item.permissions] || this.permissions[item.permissions].index * 1 !== 1) {
          this.$toast.show('暂无权限!')
          return
        }
        if (item.title === '司机') {
          this.setTabIndex(1)
        }
        this.$router.push(item.url)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  $margin = 20px
  $margin-left = 1.04vw
  $border-color = #E9ECEE

  .new-data
    overflow: hidden
    flex: 1
    display: flex
    box-sizing: border-box
    flex-direction: column
    min-width: 1380px
    .identification .identification-name
      font-family: $font-family-medium
  .data-header-box
    layout(row)
    display: flex
    .data-header-left
      width: 68%
      height: 360px
      padding-right: $margin
      box-sizing: border-box
      .header-left-box
        width: 100%
        height: 360px
        background: $color-white
        .real-time-con
          layout(row)
          .real-time-chart
            width: 62%
            height: 300px
            padding-bottom: 5px
            border-right-1px($border-color)
            layout(column)
            .info-con
              position: absolute
              top: 20px
              width: 100%
              padding: 0 60px 0 20px
              left: 0
              z-index: 9
              layout(row)
              height: 48px
              display: flex
              justify-content: space-between
              align-items: center
              .info-left
                display: flex
                align-items: center
              .info-right
                display: flex
                flex-direction: column
                .small-text
                  margin-left: $margin-left
                  font-size: $font-size-12
                  line-height: 1
                  font-family: $font-family-regular
                  color: #999999
                  &:last-child
                    margin-top: 8px
              .info-icon
                width: 48px
                height: 48px
                margin-right: 14px
              .info-box
                font-family: $font-family-regular
                color: $color-text-main
                .info-title
                  font-size: $font-size-14
                .info-val
                  line-height: 30px
                  font-size: 28px
                  font-family: $font-family-din-bold
            .real-time-chart
              width: 100%
              height: 246px
              margin-top: 54px
          .real-time-box
            width: 38%
            layout(row)
            .real-list-box
              height: 150px
              width: 50%
              padding: 24px .6vw 24px $margin-left
              box-sizing: border-box
              layout(column)
              &:nth-child(odd)
                border-right-1px($border-color)
              &:nth-child(-n+2)
                border-bottom-1px($border-color)
              .top-box
                width: 100%
                height: 50px
                layout(row)
                align-items: center
                flex-wrap: nowrap
                .real-list-box-icon
                  width: 48px
                  height: 48px
                  display: block
                  margin-right: 8px
                  icon-image(icon-visitor_number)
                .users
                  icon-image(icon-paying_users)
                .browse_volume
                  icon-image(icon-browse_volume)
                .wallet
                  icon-image(icon-wallet)
              .real-text
                layout()
                display: flex
                flex: 1
                no-wrap()
                .real-text-title
                  width: 100%
                  font-size: $font-size-14
                  font-family: $font-family-regular
                  color: $color-text-main
                .real-text-number
                  width: 100%
                  font-size: 28px
                  font-family: $font-family-din-bold
                  color: $color-text-main
                  line-height: 28px
                  no-wrap()
              .bottom-box
                width: 100%
                margin-top: 8px
                font-size: 12px
                padding-left: 56px
                line-height: 1
                font-family: $font-family-regular
                color: #999
                no-wrap()
            .real-list-box:nth-of-type(3n)
              border-right: 0 solid $border-color
            .real-list-box:nth-of-type(4), .real-list-box:nth-of-type(5), .real-list-box:nth-of-type(6)
              border-bottom: 0 solid $border-color
    .data-header-right
      width: 32%
      height: 360px
      box-sizing: border-box
      .base-box
        width: 100%
        height: 360px
        background: $color-white
        .base-function-box
          layout(row)
          .base-list-item
            position: relative
            width: 33.3333%
            height: 150px
            padding: $margin .6vw $margin $margin-left
            cursor: pointer
            &:nth-child(3n+2),&:nth-child(3n+1)
              border-right-1px($border-color)
            &:nth-child(-n+3)
              border-bottom-1px($border-color)
            .base-item-title
              font-size: $font-size-14
              line-height: $font-size-14
              color: $color-text-main
              font-family: $font-family-regular
              margin-bottom: 10px
            .base-number-box
              layout(row)
              align-items: center
              justify-content: space-between
              .number-left
                width: 100%
                font-size: 28px
                color: $color-text-main
                line-height: 28px
                font-family: $font-family-din-bold
                no-wrap()
            .base-list-arrow
              position: absolute
              bottom: $margin
              right: $margin
              width: 20px
              height: 20px
              icon-image(icon-rightward_1)
          .base-list-item:hover
            .base-list-arrow
              icon-image(icon-rightward_2)
  .survey-box
    padding: 0 $margin
    border-bottom-1px($border-color)
  .educe-btn
    font-size: $font-size-12
    color: $color-main
    font-family: $font-family-regular
    width: 47px
    height: 24px
    line-height: 23px
    text-align: center
    border: 1px solid $color-main
    border-radius: 12px
    background: $color-white
    margin-left: $margin
    cursor: pointer
  .identification
    width: 100%
  .refresh-btn
    height: 14px
    line-height: 14px
    layout(row)
    color: #666666
    font-size: $font-size-14
    font-family: $font-family-regular
    cursor: pointer
    .refresh-icon
      width: 14px
      height: 14px
      margin-right: 6px
      icon-image(icon-renovate_1)
    &:hover
      color: #6EBA6E
      .refresh-icon
        icon-image(icon-renovate_2)
  .trend-box
    #trend
      height: 345px
      width: 100%
  .survey-box-none
    border-none()

  .data-board
    background: #ffffff
    height: 480px
    position: relative
    margin-top: $margin

    .title-bar
      padding: 0 $margin
      height: 60px
      line-height: 60px
      color: $color-text-main
      font-size: $font-size-16
      font-family: $font-family-medium
      border-bottom-1px($border-color)
      layout(row)
      justify-content: space-between
      align-items: center

      .left-box
        layout(row)
        align-items: center

        .title-icon
          width: 14px
          height: 14px
          margin-right: 5px
        .title
          margin-right: 30px
          font-family: $font-family-medium
          color: $color-text-main
          font-size: $font-size-16
        .tab
          position: relative
          height: 24px
          background: #F6F6F6
          layout(row)
          border-radius: 12px
          font-family: $font-family-regular
          cursor: pointer

          .tab-item
            box-sizing: border-box
            padding: 0 18px
            min-width: 84px
            height: 24px
            line-height: @height
            color: #666666
            text-align: center
            font-size: $font-size-12

          .tab-active
            position: absolute
            top: 0
            left: 0
            z-index: 0
            background: #6EBA6E
            color: $color-white
            border-radius: 12px
            transition: all 0.3s
      .data-date-picker
        color: #666

    .bottom-con
      layout(row,block,no-wrap)
      padding: $margin 0 $margin $margin
      .label-con
        padding-top: 6px
        width: 11.46vw
        min-width: 190px
        layout()
        .data-date
          margin-bottom: 20px
          color: #999999
          font-size: $font-size-12
          font-family: $font-family-regular
        .label
          width: 100%
          margin-bottom: 30px
          no-wrap()
          font-size: $font-size-12
          font-family: $font-family-regular
          color: $color-text-main
          .label-val
            width: 100%
            line-height: 32px
            margin-top: 6px
            no-wrap()
            font-size: 32px
            font-family: $font-family-din-bold

      .data-board-chart
        flex: 1
        height: 370px
        margin-top: 10px
  .rank-list
    width: 100%
    overflow-x: hidden
    margin-top: $margin
    background: #ffffff
    .rank-list-content
      width: 100%
      overflow-x: hidden
      padding: $margin 0 $margin $margin
      layout(row)
      .rank-list-con
        flex: 1
        margin-right: $margin
        position: relative
        &:after
          content: ""
          pointer-events: none // 解决iphone上的点击无效Bug
          display: block
          position: absolute
          left: 0
          top: 0
          transform-origin: 0 0
          border: 1px solid $border-color
          box-sizing border-box
          width 100%
          height 100%
          @media (-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2)
            width: 200%
            height: 200%
            transform: scale(.5) translateZ(0)
          @media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3)
            width: 300%
            height: 300%
            transform: scale(1 / 3) translateZ(0)
      .title-bar
        padding: 0 20px
        box-sizing: border-box
        height: 60px
        line-height: 60px
        color: $color-text-main
        font-size: $font-size-16
        font-family: $font-family-medium
        layout(row)
        justify-content: space-between
        align-items: center
        border-bottom-1px(#E9ECEE)
        .left-box
          layout(row)
          align-items: center
          .title
            margin-right: 30px
            color: $color-text-main
            font-size: $font-size-16
            font-family: $font-family-medium
        .excel-btn
          display: block
          width: 80px
          height: 28px
          line-height: 28px
          text-align: center
          color: $color-main
          font-size: $font-size-12
          font-family: $font-family-regular
          border: .5px solid $color-main
          border-radius: 14px
          transition: all .3s
          &:hover
            color: $color-white
            background: $color-main
      .big-list
        width: 100%
        overflow-x: hidden
        height: 700px
        max-height: 700px
        padding-bottom: 60px
        font-size: $font-size-14
        .list-head
          height: 45px
          padding: 0 20px
          box-sizing: border-box
          border-bottom-1px(#E9ECEE)
          display: flex
          align-items: center
          background: $color-white
          color: $color-text-main
          font-family: $font-family-medium
        .list-content
          width: 100%
          overflow-x: hidden
          padding: 0 20px
          box-sizing: border-box
          border-bottom-1px($border-color)
          display: flex
          align-items: center
          &:nth-child(2n)
            background: $color-white
          &:hover
            background: $color-white
          .list-img
            width: 36px
            min-width: 36px
            height: @width
            margin-right: 8px
            border-1px($border-color,2px)
            .data-list-img
              width: 100%
              min-width: 36px
              height: @width
              display: block
          .list-text
            width: 100%
            no-wrap()
        .list-item
          width: 100%
          overflow-x: hidden
          height: 40px
          layout(row, block, no-warp)
          align-items: center
          box-sizing: border-box
          margin-right: 10px
          flex: 1
          &:nth-child(1)
            max-width: 42px
          &:nth-child(2)
            flex: 3
            width: 12.5vw
            min-width: 12.5vw
            max-width: 12.5vw
          &:nth-child(3), &:nth-child(4), &:nth-child(5)
            text-align: right
            justify-content: flex-end
          &:last-child
            margin-right: 0

        .rank-icon
          width: 30px
          height: 36px
          &.rank-1
            icon-image(icon-one)
          &.rank-2
            icon-image(icon-two)
          &.rank-3
            icon-image(icon-three)
        .list-rank-num
          min-width: 30px
          max-width: 100%
          text-align: center
          font-family: $font-family-medium
        .pager-bar
          position: absolute
          left: 0
          bottom: 0
          width: 100%
          height: 60px
          layout(row)
          justify-content: center
          align-items: center
          .page-con
            margin: 0 14px
          .page-btn
            width: 24px
            height: 24px
            transition: all .3s
            &.btn-prev
              icon-image(icon-left_ash)
              &:hover
                icon-image(icon-left_green)
            &.btn-next
              icon-image(icon-right_ash)
              &:hover
                icon-image(icon-right_green)

  .no-data-tips
    width: 100%
    height: 100%
    layout()
    justify-content: center
    align-items: center
    font-size: $font-size-14
    font-family: $font-family-regular
    color: #666666
</style>
