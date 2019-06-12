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
            <div @click="_getRealTimeData" class="refresh-btn">
              <div class="refresh-icon"></div>
              刷新
            </div>
          </div>
          <div class="real-time-con">
            <div class="real-time-chart">
              <div class="info-con">
                <img src="./icon-money_more@2x.png" class="info-icon">
                <div class="info-box">
                  <div class="info-title">支付金额(元)</div>
                  <div class="info-val">
                    2380.00<span class="small-text">昨日(元): 6908.00</span>
                  </div>
                </div>
              </div>
              <e-chart-line ref="realTimeChart" chartId="realTimeChart" class="chart-con"></e-chart-line>
            </div>
            <div class="real-time-box">
              <div v-for="(item, index) in realData" :key="index" class="real-list-box">
                <div class="top-box">
                  <div class="real-list-box-icon" :class="item.imgUrl"></div>
                  <div class="real-text">
                    <div class="real-text-title">{{item.title}}</div>
                    <div class="real-text-number">{{item.curr_total}}</div>
                  </div>
                </div>
                <div class="bottom-box">
                  昨日：{{item.total}}
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
      </div>
      <div class="bottom-con">
        <div class="label-con">
          <div class="data-date">2019.05.01~2019.05.12</div>
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
      </div>
      <div class="rank-list-content">
        <div v-for="(list,index) in rankDir" :key="index" class="rank-list-con">
          <div class="title-bar">
            <div class="left-box">
              <p class="title">{{list.title}}</p>
            </div>
            <a target="_blank" class="excel-btn">导出Excel</a>
          </div>
          <div class="big-list">
            <div class="list-header list-box goods-list">
              <div v-for="(th,thIdx) in list.tableHead" :key="thIdx" class="list-item">{{th}}</div>
            </div>
            <div class="list">
              <div v-for="(item, idx) in list.data" :key="idx" class="list-content list-box goods-list">
                <div v-for="(key, keyIdx) in list.dataKey" :key="keyIdx" class="list-item">
                  <template v-if="key==='index'">
                    <div v-if="idx<3" :src="item[key]" :class="'rank-'+(idx+1)" class="rank-icon"></div>
                    <p v-else class="list-rank-num">{{idx+1}}</p>
                  </template>
                  <img v-else-if="key==='image_url'" :src="item[key]" class="data-list-img">
                  <template v-else>{{item[key]}}</template>
                </div>
              </div>
            </div>
            <div class="pager-bar">
              <div @click="_changePage(list,-1)" class="page-btn btn-prev"></div>
              <div class="page-con">{{list.pager.curPage}}/{{list.pager.pageTotal}}</div>
              <div @click="_changePage(list,1)" class="page-btn btn-next"></div>
            </div>
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
  import EChartLine from '@components/e-chart/e-chart-line'

  const PAGE_NAME = 'NEW_DATA'
  const TITLE = '数据'
  const REALDATA = [
    {imgUrl: '', title: '访客数', key: 'visitor', curr_total: 0, total: 0},
    {imgUrl: 'users', title: '支付用户', key: 'order', curr_total: 0, total: 0},
    {imgUrl: 'browse_volume', title: '浏览量', key: 'pay_customer', curr_total: 0, total: 0},
    {imgUrl: 'wallet', title: '支付订单', key: 'customer_price', curr_total: 0, total: 0},
  ]
  const BASELIST = [
    {title: '上架商品', key: 'goods_count', number: 0, url: '/home/product-list?online=1', permissions: 'goods'},
    {title: '进行中活动', key: 'activity_count', number: 0, url: '/home/activity-manage?status=1', permissions: 'activity'},
    {title: '团长', key: 'shop_manage_count', number: 0, url: '/home/leader-list?status=0', permissions: 'shop-manager'},
    {title: '供应商', key: 'supplier_count', number: 0, url: '/home/supplier', permissions: 'supplier'},
    {title: '采购员', key: 'purchase_user_count', number: 0, url: '/home/buyer', permissions: 'purchase-user'},
    {title: '司机', key: 'driver_count', number: 0, url: '/home/dispatching-management', permissions: 'driver'}
  ]
  const RANKTIME = [
    {title: '今天', status: 'today'},
    {title: '昨天', status: 'yesterday'},
    {title: '7天', status: 'week'},
    {title: '30天', status: 'month'}
  ]
  const REAL_TIME = {
    apiFun: 'getOperationOrderData',
    label: [
      {name: '支付用户', key: 'amount_total', total: ''},
      {name: '支付订单', key: 'num_total', total: ''}
    ],
    chartConfig: {
      dataArr: [
        {name: '支付用户', key: 'amount', data: []},
        {name: '支付订单', key: 'num', data: []}
      ],
      xAxleData: [],
      legendOnTop: true,
      lineShadow: 'false'
    }
  }
  const DATA_BOARD = [
    {
      apiFun: 'getOperationFlowData',
      title: '流量',
      label: [
        {name: '浏览量(PV)', key: 'pv_total', total: ''},
        {name: '访客数(UV)', key: 'uv_total', total: ''}
      ],
      chartConfig: {
        dataArr: [
          {name: '浏览量', key: 'pv', data:[]},
          {name: '访客数', key: 'uv', data:[]}
        ],
        xAxleData: [],
        lineShadow: 'false'
      },
    },
    {
      apiFun: 'getOperationBusinessData',
      title: '成交',
      label: [
        {name: '支付金额(元)', key: 'amount_total', total: ''},
        {name: '客单价(元)', key: 'per_customer_price', total: ''},
        {name: '销售数量', key: 'num_total', total: ''}
      ],
      chartConfig: {
        dataArr: [
          {name: '支付金额', key: 'amount', data:[]},
          {name: '客单价', key: 'per_customer_price', data:[]},
          {name: '销售数量', key: 'num', data:[]}
        ],
        xAxleData: [],
        lineShadow: 'false'
      }
    },
    {
      apiFun: 'getOperationOrderData',
      title: '订单',
      label: [
        {name: '支付用户', key: 'amount_total', total: ''},
        {name: '支付订单', key: 'num_total', total: ''},
        {name: '支付转化率', key: 'unit_price', total: '',unit: '%'}
      ],
      chartConfig: {
        dataArr: [
          {name: '支付用户', key: 'amount', data:[]},
          {name: '支付订单', key: 'num', data:[]},
          {name: '支付转化率', key: 'unit_price', data:[]}
        ],
        xAxleData: [],
        lineShadow: 'false'
      }
    },
    {
      id: 'servicesChart',
      apiFun: 'getOperationServicesData',
      title: '售后',
      label: [
        {name: '退货金额(元)', key: 'amount_total', total: ''},
        {name: '退货数量', key: 'num_total', total: ''}
      ],
      chartConfig: {
        dataArr: [
          {name: '退货金额', key: 'amount', data:[]},
          {name: '退货数量', key: 'num', data:[]}
        ],
        xAxleData: [],
        lineShadow: 'false'
      }
    }
  ]
  const RANK_DIR = {
    leader: {
      title: '团长',
      tableHead: ['排名', '团长', '销售额', '佣金'],
      apiFun:'getManagerRank',
      params:{time: 'week', start_time: '', end_time: ''},
      data: [],
      dataKey: ['index','social_name','sale_total_sum','commission_total_sum'],
      pager: {curPage: 1, pageTotal: 10}
    },
    goods: {
      title: '商品',
      tableHead: ['图片', '商品名称', '销量', '销售额'],
      apiFun:'getGoodsRank',
      params:{time: 'week', start_time: '', end_time: ''},
      data: [],
      dataKey: ['image_url','goods_name','sale_count_sum','sale_total_sum'],
      pager: {curPage: 1, pageTotal: 10}
    },
    search: {
      title: '搜索词',
      tableHead: ['排名', '搜索词', '搜索次数'],
      apiFun:'getGoodsRank',
      params:{time: 'week', start_time: '', end_time: ''},
      data: [],
      dataKey: ['index','goods_name','sale_count_sum'],
      pager: {curPage: 1, pageTotal: 10}
    }
  }

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
        realData: REALDATA,
        baseList: BASELIST,
        rankTime: RANKTIME,
        downUrl: '',
        shopDownUrl: '',
        permissions: {},
        disabledDate: {},
        realTimeData: REAL_TIME,
        dataBoard: DATA_BOARD,
        dataBoardIndex: 0,
        rankDir: RANK_DIR
      }
    },
    mounted() {
      let time = this.$route.params.time
      this.disabledDate = {
        disabledDate(date) {
          return date && (date.valueOf() <= time.timestamp - 2592000 * 1000 || date.valueOf() >= time.timestamp)
        }
      }
      this.permissions = storage.get('permissions')
      this.getSurveyTrade('', '', 'week', true)
      this.getScmBaseData()
      this.getShopBaseData()
      this._getDataBoard(true)
      this._getRealTimeData()
      this.getGoodsRank()
      this.getManagerRank()
    },
    methods: {
      ...deliveryMethods,
      // 实时总览
      getSurveyTrade(startTime, endTime, time, loading) {
        API.Data.tradeData({start_time: startTime, end_time: endTime, time: time}, loading).then((res) => {
          if (loading) {
            this.$loading.hide()
          }
          if (res.error === this.$ERR_OK) {
            for (let i = 0; i < this.realData.length; i++) {
              let item = this.realData[i]
              item.curr_total = res.data[item.key].curr_total
              item.total = res.data[item.key].total
            }
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      // 基础功能
      getScmBaseData() {
        API.Data.getBaseData().then((res) => {
          if (res.error === this.$ERR_OK) {
            for (let key in res.data) {
              let index = this.baseList.findIndex((item) => item.key === key)
              this.baseList[index].number = res.data[key]
            }
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      // 基础功能
      getShopBaseData() {
        API.Data.getStatisticsBaseData().then((res) => {
          if (res.error === this.$ERR_OK) {
            for (let key in res.data) {
              let index = this.baseList.findIndex((item) => item.key === key)
              this.baseList[index].number = res.data[key]
            }
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      jumpBase(item) {
        if (!this.permissions[item.permissions]) {
          this.$toast.show('暂无权限!')
          return
        }
        if (this.permissions[item.permissions].index * 1 !== 1) {
          this.$toast.show('暂无权限!')
          return
        }
        if (item.title === '司机') {
          this.setTabIndex(1)
        }
        this.$router.push(item.url)
      },
      // 商品排行
      getGoodsRank(loading=false) {
        API.Data.goodsData(this.rankDir.goods.params, loading).then((res) => {
          if (loading) {
            this.$loading.hide()
          }
          if (res.error === this.$ERR_OK) {
            this.rankDir.goods.data = res.data
            this.rankDir.search.data = res.data
            // this._getShopUrl()
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      _getShopUrl() {
        let currentId = this.getCurrentId()
        let token = this.$storage.get('auth.currentUser', '')
        let params = `access_token=${token.access_token}&start_time=${this.shopStartTime}&end_time=${
          this.shopEndTime
        }&time=${this.shopTime}`
        this.shopDownUrl =
          process.env.VUE_APP_API +
          `/social-shopping/api/backend/statistics-goods-data-export?${params}&current_corp=${currentId}`
      },
      // 社区排行
      getManagerRank(loading=false) {
        API.Data.managerData(this.rankDir.leader.params, loading).then((res) => {
          if (loading) {
            this.$loading.hide()
          }
          if (res.error === this.$ERR_OK) {
            this.rankDir.leader.data = res.data
            // this._getUrl()
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      _getUrl() {
        let currentId = this.getCurrentId()
        let token = this.$storage.get('auth.currentUser', '')
        let params = `access_token=${token.access_token}&start_time=${this.managerStartTime}&end_time=${
          this.managerEndTime
        }&time=${this.managerTime}`
        this.downUrl =
          process.env.VUE_APP_API +
          `/social-shopping/api/backend/statistics-manager-data-export?${params}&current_corp=${currentId}`
      },
      _switchTab(tab, tabIdx) {
        if (this.dataBoardIndex === tabIdx) return
        this.dataBoardIndex = tabIdx
        this._getDataBoard()
      },
      // 实时总览折线图
      _getRealTimeData(loading = false) {
        let curChart = this.realTimeData
        let getSuccess = false
        API.Operation[curChart.apiFun]({date_type: 'week'},loading).then((res) => {
          if (res.error !== this.$ERR_OK) {
            return false
          }
          // 格式化接口返回的数据
          curChart = this.formatResData(res, curChart)
          getSuccess = true
        }).finally(() => {
          this.$refs.realTimeChart._setChart(curChart.chartConfig, loading, getSuccess)
          loading && this.$loading.hide()
        })
      },
      // 数据看板
      _getDataBoard(loading = false) {
        let curChart = this.dataBoard[this.dataBoardIndex]
        let getSuccess = false
        API.Operation[curChart.apiFun]({date_type: 'week'},loading).then((res) => {
          if (res.error !== this.$ERR_OK) {
            return false
          }
          // 格式化接口返回的数据
          curChart = this.formatResData(res, curChart)
          getSuccess = true
        }).finally(() => {
          this.$refs.dataBoardChart._setChart(curChart.chartConfig, true, getSuccess)
          loading && this.$loading.hide()
        })
      },
      formatResData(result, curChart) {
        let chartConfig = curChart.chartConfig
        chartConfig.xAxleData = []// 重置x轴数据
        // 遍历dataArr，通过key生成新的数组
        for (let j = 0; j < chartConfig.dataArr.length; j++) {
          let _chartData = chartConfig.dataArr[j]
          let _key = _chartData.key// 对应接口每个值的key
          let _curLabel = curChart.label[j]
          _curLabel.total = result[_curLabel.key]// 配置的label数组,用于设置每个图表上面的总计
          _chartData.data = []// 重置data
          // 遍历接口的data数组，通过配置的key赋值给当前的数组
          for (let i = 0; i < result.data.length; i++) {
            let _resData = result.data[i]
            // 测试数据
            let rd = (Math.random() * 100).toFixed(2)
            _chartData.data.push(_resData[_key]+rd)
            // 测试数据
            // _chartData.data.push(_resData[_key])// 通过key取出接口返回的值并push进数组
            if (j === 0) {
              // x轴的date指生成一个数组就行了
              let _date = _resData.date
              _date = _date.split('-').slice(1).join('/')
              chartConfig.xAxleData.push(_date)
            }
          }
        }
        return curChart
      },
      _changePage(item,num) {
        let curPage = item.pager.curPage + num
        if (curPage < 1 || curPage > item.pager.pageTotal) return
        item.pager.curPage = curPage
        this[item.apiFun]()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  $margin = 20px
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
            border-right-1px($border-color)
            layout(column)
            .info-con
              layout(row)
              height: 48px
              margin: 25px 20px 0
              .info-icon
                width: 48px
                height: 48px
                margin-right: 14px
              .info-box
                layout(column)
                font-family: $font-family-regular
                color: $color-text-main
                .info-title
                  font-size: $font-size-14
                .info-val
                  line-height: 30px
                  font-size: 28px
                  font-family: $font-family-din-bold
                  .small-text
                    margin-left: 20px
                    font-size: $font-size-12
                    color: #999999
            .chart-con
              width: 100%
              height: 227px
          .real-time-box
            width: 38%
            layout(row)
            .real-list-box
              height: 150px
              width: 50%
              padding: 24px $margin
              box-sizing: border-box
              layout(column)
              justify-content: space-between
              &:nth-child(odd)
                border-right-1px($border-color)
              &:nth-child(-n+2)
                border-bottom-1px($border-color)
              .top-box
                width: 100%
                layout(row)
                .real-list-box-icon
                  width: 48px
                  height: 48px
                  display: block
                  margin-right: 14px
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
                .real-text-title
                  font-size: $font-size-14
                  font-family: $font-family-regular
                  color: $color-text-main
                  /*margin-bottom: 4px*/
                .real-text-number
                  font-size: 28px
                  font-family: $font-family-din-bold
                  color: $color-text-main
                  line-height: 28px
              .bottom-box
                font-size: 12px
                font-family: $font-family-regular
                color: #999
                text-align: center
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
            padding: $margin
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
                font-size: 28px
                color: $color-text-main
                line-height: 28px
                font-family: $font-family-din-bold
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
  .data-middle-box
    layout(row)
    display: flex
    margin-top: $margin
    .data-middle-left
      width: 66.66666%
      height: 260px
      layout(row)
      display: flex
      padding-right: 7px
    .middle-small-left
      width: 50%
      height: 405px
      padding-right: 10px
      .data-list
        width: 100%
        height: 100%
        background: $color-white
    .middle-small-right
      width: 50%
      height: 405px
      padding-left: 10px
      .goods-rank
        width: 100%
        height: 100%
        background: $color-white
    .data-middle-right
      width: 33.33333%
      height: 405px
      padding-left: 13px
      box-sizing: border-box
      .community-rank
        background: $color-white
        width: 100%
        height: 100%
  .data-bottom-box
    layout(row)
    margin-top: $margin
    background: $color-white
    .dispose-matter-box
      layout(row)
      align-items: center
      height: 140px
      width: 100%
      .dispose-list-box
        layout()
        align-items: center
        justify-content: center
        flex: 1
        max-width: 220px
        .dispose-top-item
          width: 50px
          height: @width
          border-1px(#ccc, 500px)
          border-radius: 50px
          position: relative
          .dispose-text
            font-size: $font-size-18
            font-family: $font-family-medium
            color: $color-text-main
            width: 50px
            height: @width
            line-height: @width
            text-align: center
          .dispose-number
            min-width: 22px
            height: 22px
            line-height: 22px
            padding: 0 5px
            position: absolute
            left: 35px
            top: 0
            background: #F84E3C
            border-radius: 50px
            color: $color-white
            font-size: $font-size-13
            text-align: center
            font-family: $font-family-medium
            z-index: 10
          .dispose-img
            width: 22px
            height: @width
            position: absolute
            right: -10px
            top: 0
            border-radius: 50px
            display: block
            font-family: $font-family-medium
            z-index: 11
        .dispose-name
          margin-top: 10px
          font-size: $font-size-14
          font-family: $font-family-regular
          color: $color-text-main
  .goods-list
    .list-item
      box-sizing: border-box
      padding-right: 10px
      flex: 1
      &:nth-child(1)
        max-width: 56px
      &:nth-child(2)
        flex: 1.6
      &:nth-child(3), &:nth-child(4), &:nth-child(5)
        text-align: right
        justify-content: flex-end
      &:last-child
        padding-right: 0
  .community-list
    .list-item
      box-sizing: border-box
      padding-right: 10px
      flex: 1
      &:nth-child(1)
        flex: 1.6
      &:nth-child(3), &:nth-child(4), &:nth-child(2)
        text-align: right
        justify-content: flex-end
      &:last-child
        padding-right: 0
  .new-data
    .list-content
      &:nth-child(2n)
        background: $color-white
      &:hover
        background: #F7FAF5
  .data-list-img
    width: 36px
    height: @width
    display: block
    border-radius: 2px
    border: 0.5px solid $border-color
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
  .list-header
    &:after
      border-top: 0.5px solid #E6E7EB !important
      border-bottom: 0.5px solid #E6E7EB !important
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
          font-family: $font-family-bold

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

    .bottom-con
      layout(row)
      padding: 26px 0 26px $margin
      .label-con
        width: 220px
        layout()
        color: $color-text-main
        font-family: $font-family-regular
        font-size: $font-size-12
        .data-date
          margin-bottom: 20px
          color: #999999
        .label
          width: 100%
          font-size: $font-size-12
          .label-val
            font-size: 32px
            font-family: $font-family-din-bold

      .data-board-chart
        flex: 1
        height: 368px
  .rank-list
    margin-top: $margin
    background: #ffffff
    .rank-list-content
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
        .left-box
          layout(row)
          align-items: center
          .title
            margin-right: 30px
            font-family: $font-family-bold
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
        max-height: 695px
        padding-bottom: 60px
        font-size: $font-size-14
        .list-header
          background: $color-white
          font-family: $font-family-medium
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
          padding-left: 12px
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
</style>
