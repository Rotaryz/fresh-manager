<template>
  <div class="operation-data">
    <base-tab-select :infoTabIndex="topTabIndex" :tabStatus="topTab" :lineWidth="64" @getStatusTab="_changeStatusTab"></base-tab-select>
    <section class="content">
      <div class="con-top-bar">
        <div class="title-box">
          <img src="./icon-qundata@3x.png" alt="" class="title-icon">
          <div class="title">{{topTab[topTabIndex].conTitle}}</div>
        </div>
        <base-option-box :arrTitle="dateSelector" :infoTab="2" :tabActive="2" @checkTime="_selectDate"></base-option-box>
      </div>
      <div class="chart-container">
        <template v-if="topTabIndex === 0">
          <chart-line class="chart-box" ref="flowChart" chartId="flowChart"></chart-line>
          <chart-line class="chart-box" ref="businessChart" chartId="businessChart"></chart-line>
          <chart-line class="chart-box" ref="orderChart" chartId="orderChart"></chart-line>
          <chart-line class="chart-box" ref="userChart" chartId="userChart"></chart-line>
          <chart-line class="chart-box" ref="benefitChart" chartId="benefitChart"></chart-line>
          <chart-line class="chart-box" ref="servicesChart" chartId="servicesChart"></chart-line>
        </template>
        <template v-if="topTabIndex === 1">
          <chart-line class="chart-box" ref="merchantChart" chartId="merchantChart"></chart-line>
          <chart-line class="chart-box" ref="procurementChart" chartId="procurementChart"></chart-line>
          <chart-line class="chart-box" ref="warehouseChart" chartId="warehouseChart"></chart-line>
        </template>
        <template v-if="topTabIndex === 2">
          <chart-line class="chart-box" ref="expandChart" chartId="expandChart"></chart-line>
          <chart-line class="chart-box" ref="leaderChart" chartId="leaderChart"></chart-line>
          <chart-line class="chart-box" ref="communityChart" chartId="communityChart"></chart-line>
        </template>
<!--        <chart-line v-for="(item, index) in curChart" :key="index" :ref="item.id" :chartId="item.id" class="chart-box"></chart-line>-->
      </div>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import app from '@src/main'
  import ChartLine from '@components/e-chart/chart-line'

  const PAGE_NAME = 'OPERATION_DATA'
  const TITLE = '运营数据'
  const TAB_CONFIG = [{text: '运营视窗', status: 0, conTitle: '运营数据'}, {text: '管理视窗', status: 1, conTitle: '管理数据'}, {text: '拓展视窗', status: 2, conTitle: '拓展数据'}]
  const DATE_SELECTOR = [{title: '今天', status: 'today'}, {title: '昨天', status: 'yesterday'}, {title: '7天', status: 'week'}, {title: '30天', status: 'month'}]
  const OPERATION_CONFIG = [
    {
      id: 'flowChart',
      title: '流量',
      label: ['浏览量(PV)','访客数(UV)','支付用户'],
      data: [],
      showSecondY: true
    },
    {
      id: 'businessChart',
      title: '交易',
      label: ['交易金额(元)','销售数量','客单价(元)'],
      data: [],
      showSecondY: true
    },
    {
      id: 'orderChart',
      title: '订单',
      label: ['订单金额(元)','订单数量','笔单价(元)'],
      data: [],
      showSecondY: true
    },
    {
      id: 'userChart',
      title: '用户',
      label: ['新增率','转化率','流失率','唤醒率'],
      data: [],
      showSecondY: false,
      tab: [
        {name: '用户数量'},
        {name: '用户效率'}
      ],
      tabIndex: 1
    },
    {
      id: 'benefitChart',
      title: '效益',
      label: ['动销率'],
      data: [],
      showSecondY: false
    },
    {
      id: 'servicesChart',
      title: '售后',
      label: ['退货金额(元)','退货数量','退货用户数'],
      data: [],
      showSecondY: true,
      tab: [
        {name: '退货'},
        {name: '退货率'}
      ],
      tabIndex: 0,
      excel: true
    }
  ]
  const MANAGER_CONFIG = [
    {
      id: 'merchantChart',
      title: '供应链',
      label: ['送货金额(元)','送货数量'],
      data: [],
      showSecondY: true,
      lineShadow: true,
      tab: [
        {name: '送货'},
        {name: '订单'}
      ],
      tabIndex: 0
    },
    {
      id: 'procurementChart',
      title: '采购',
      label: ['采购金额(元)','采购数量'],
      data: [],
      showSecondY: true,
      lineShadow: true
    },
    {
      id: 'warehouseChart',
      title: '仓库',
      label: ['库存周转率'],
      data: [],
      showSecondY: true,
      lineShadow: true
    }
  ]
  const EXPAND_CONFIG = [
    {
      id: 'expandChart',
      title: '拓展',
      label: ['订单数量','交易金额(元)'],
      data: [],
      showSecondY: true,
      lineShadow: true
    },
    {
      id: 'leaderChart',
      title: '团长',
      label: ['团长数量','新增团长'],
      data: [],
      showSecondY: true,
      lineShadow: true
    },
    {
      id: 'communityChart',
      title: '社群',
      label: ['社群数量','新增社群'],
      data: [],
      showSecondY: true,
      lineShadow: true
    }
  ]

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      ChartLine
    },
    data() {
      return {
        topTab: TAB_CONFIG,
        topTabIndex: 0,
        dateSelector: DATE_SELECTOR,
        requestData: {
          wx_group_id: '',
          day_type: 'week'
        },
        chartConfig: [OPERATION_CONFIG,MANAGER_CONFIG,EXPAND_CONFIG],
        curChart: [],
        businessData: {}
      }
    },
    mounted() {
      this.curChart = this.chartConfig[this.topTabIndex]
      this._getData()
    },
    methods: {
      _changeStatusTab(item, index) {
        this.topTabIndex = index
        this.curChart = this.chartConfig[index]
        this._getData()
      },
      _selectDate(value) {
        this.requestData.day_type = value
        this._getData()
      },
      _getData() {
        API.Community.getBusinessData({wx_group_id: this.requestData.wx_group_id, day_type: this.requestData.day_type})
          .then((res) => {
            if (res.error !== app.$ERR_OK) {
              return false
            }
            let arr = ['profit', 'e_customer', 'e_order_avg', 'per_order']
            let data = this.dataHandle(arr, res.data)
            for (let i = 0; i < this.curChart.length; i++) {
              // 修改测试数据
              let rd = (Math.random()*1000).toFixed(2)
              data.data[0].rate[i] = rd
              data.totalArr[0] = rd

              let curChart = this.curChart[i]
              curChart.data = data
              this.$refs[curChart.id]._setData(curChart)
            }
          })
          .catch(() => {
          })
          .finally(() => {
            app.$loading.hide()
          })
      },
      dataHandle(arr, data) {
        let totalArr = arr.map(item => {
          return data[item].total
        })
        let dataArr = arr.map(item => {
          let time = []
          time = data[item].data.map(val => {
            return val.at.split('-').slice(1).join('/')
          })
          let valueArr = data[item].data.map(val => {
            if (typeof (val.value) === 'string') {
              return val.value.replace(',', '')
            } else {
              return val.value || 0
            }
          })
          return {
            x: time,
            rate: valueArr
          }
        })
        let resultData = {
          totalArr,
          data: dataArr
        }
        return resultData
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  $padding-left = 20px

  .operation-data
    width: 100%
  .content
    min-height: calc(100vh - 130px)
    background: $color-white
    padding: 0 $padding-left
    .con-top-bar
      height: 58px
      display: flex
      justify-content: space-between
      align-items: center
      box-sizing: border-box
      border-bottom: 0.5px solid $color-line
      .title-box
        display: flex
        align-items: center
        .title-icon
          width: 14px
          height: 14px
          margin-right: 6px
        .title
          font-family: $font-family-regular
          color: $color-text-main
          font-size: $font-size-16
    .chart-container
      padding-bottom: 50px
      layout(row)
      justify-content: space-between
      .chart-box
        width: calc((100% - 40px)/3)
        margin-top: $padding-left
</style>
