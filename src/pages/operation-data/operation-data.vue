<template>
  <div class="operation-data">
    <base-tab-select :infoTabIndex="topTabIndex" :tabStatus="topTab" :lineWidth="64"
                     @getStatusTab="_changeStatusTab"
    >
    </base-tab-select>
    <section class="content">
      <div class="con-top-bar">
        <div class="title-box">
          <img src="./icon-qundata@3x.png" alt="" class="title-icon">
          <div class="title">{{topTab[topTabIndex].conTitle}}</div>
        </div>
        <base-option-box :arrTitle="dateSelector" :infoTab="2" :tabActive="2"
                         @checkTime="_selectDate"
        ></base-option-box>
      </div>
      <div class="chart-container">
        <template v-if="topTabIndex === 0">
          <chart-line ref="flowChart" chartId="flowChart" class="chart-box"></chart-line>
          <chart-line ref="businessChart" chartId="businessChart" class="chart-box"></chart-line>
          <chart-line ref="orderChart" chartId="orderChart" class="chart-box"></chart-line>
          <chart-line ref="userChart" chartId="userChart" class="chart-box"></chart-line>
          <chart-line ref="benefitChart" chartId="benefitChart" class="chart-box"></chart-line>
          <chart-line ref="servicesChart" chartId="servicesChart" class="chart-box"></chart-line>
        </template>
        <template v-if="topTabIndex === 1">
          <chart-line ref="merchantChart" chartId="merchantChart" class="chart-box"></chart-line>
          <chart-line ref="procurementChart" chartId="procurementChart" class="chart-box"></chart-line>
          <chart-line ref="warehouseChart" chartId="warehouseChart" class="chart-box"></chart-line>
        </template>
        <template v-if="topTabIndex === 2">
          <chart-line ref="expandChart" chartId="expandChart" class="chart-box"></chart-line>
          <chart-line ref="leaderChart" chartId="leaderChart" class="chart-box"></chart-line>
          <chart-line ref="communityChart" chartId="communityChart" class="chart-box"></chart-line>
        </template>
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
  const TAB_CONFIG = [{text: '运营视窗', status: 0, conTitle: '运营数据'}, {
    text: '管理视窗',
    status: 1,
    conTitle: '管理数据'
  }, {text: '拓展视窗', status: 2, conTitle: '拓展数据'}]
  const DATE_SELECTOR = [{title: '今天', status: 'today'}, {title: '昨天', status: 'yesterday'}, {
    title: '7天',
    status: 'week'
  }, {title: '30天', status: 'month'}]
  // chart配置，id：chart组件id，label：上面部分的数据名称，dataLabel：图表内部、折线的label，data：接口数据，showSecondY：是否显示双Y轴，lineShadow：是否有区域阴影
  // tab：上面的tab切换，tabIndex：tab栏的索引，excel：是否有excel导出功能
  const OPERATION_CONFIG = [
    {
      id: 'flowChart',
      title: '流量',
      label: ['浏览量(PV)', '访客数(UV)', '支付用户'],
      dataLabel: ['浏览量', '访客数', '支付用户'],
      data: [],
      showSecondY: true
    },
    {
      id: 'businessChart',
      title: '交易',
      label: ['交易金额(元)', '销售数量', '客单价(元)'],
      dataLabel: ['交易金额', '销售数量', '客单价'],
      data: [],
      showSecondY: true
    },
    {
      id: 'orderChart',
      title: '订单',
      label: ['订单金额(元)', '订单数量', '笔单价(元)'],
      dataLabel: ['订单金额', '订单数量', '笔单价'],
      data: [],
      showSecondY: true
    },
    {
      id: 'userChart',
      title: '用户',
      label: ['新增率', '转化率', '流失率', '唤醒率'],
      dataLabel: ['新增率', '转化率', '流失率', '唤醒率'],
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
      dataLabel: ['动销率'],
      data: [],
      showSecondY: false
    },
    {
      id: 'servicesChart',
      title: '售后',
      label: ['退货金额(元)', '退货数量', '退货用户数'],
      dataLabel: ['退货金额', '退货数量', '退货用户数'],
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
      label: ['送货金额(元)', '送货数量'],
      dataLabel: ['送货金额', '送货数量'],
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
      label: ['采购金额(元)', '采购数量'],
      dataLabel: ['采购金额', '采购数量'],
      data: [],
      showSecondY: true
    },
    {
      id: 'warehouseChart',
      title: '仓库',
      label: ['库存周转率'],
      dataLabel: ['库存周转率'],
      data: [],
      showSecondY: true
    }
  ]
  const EXPAND_CONFIG = [
    {
      id: 'expandChart',
      title: '拓展',
      label: ['订单数量', '交易金额(元)'],
      dataLabel: ['订单数量', '交易金额'],
      data: [],
      showSecondY: true
    },
    {
      id: 'leaderChart',
      title: '团长',
      label: ['团长数量', '新增团长'],
      dataLabel: ['团长数量', '新增团长'],
      data: [],
      showSecondY: true
    },
    {
      id: 'communityChart',
      title: '社群',
      label: ['社群数量', '新增社群'],
      dataLabel: ['社群数量', '新增社群'],
      data: [],
      showSecondY: true
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
        chartConfig: [OPERATION_CONFIG, MANAGER_CONFIG, EXPAND_CONFIG],
        curChartConfig: [],
        businessData: {},
        chartArr: [],
        getFinish: false
      }
    },
    watch: {
      getFinish(val) {
        if (val) {
          setTimeout(() => {
            this._setResize()
          }, 2000)
        }
      }
    },
    mounted() {
      this.curChartConfig = this.chartConfig[this.topTabIndex]
      this._getData(true)
    },
    methods: {
      _changeStatusTab(item, index) {
        this.topTabIndex = index
        this.curChartConfig = this.chartConfig[index]
        this._getData(true)
      },
      _selectDate(value) {
        this.requestData.day_type = value
        this._getData()
      },
      // _getData(first = false) {
      //   let chartArr = []
      //   API.Community.getBusinessData({wx_group_id: this.requestData.wx_group_id, day_type: this.requestData.day_type})
      //     .then((res) => {
      //       if (res.error !== app.$ERR_OK) {
      //         return false
      //       }
      //       let arr = ['profit', 'e_customer', 'e_order_avg', 'per_order']
      //       let data = this.dataHandle(arr, res.data)
      //       for (let i = 0; i < this.curChartConfig.length; i++) {
      //         // 修改测试数据
      //         let rd = (Math.random()*1000).toFixed(2)
      //         data.data[0].rate[i] = rd
      //         data.totalArr[0] = rd
      //
      //         let curChartConfig = this.curChartConfig[i]
      //         curChartConfig.data = data
      //         chartArr.push(this.$refs[curChartConfig.id]._setChart(curChartConfig,first))
      //       }
      //       this.chartArr = chartArr
      //       if (first) {
      //         setTimeout(() => {
      //           this._setResize()
      //         },2000)
      //       }
      //
      //     })
      // },
      _getData(first = false) {
        this.chartArr = []
        for (let i = 0; i < this.curChartConfig.length; i++) {
          let curChart = this.curChartConfig[i]
          API.Community.getBusinessData({
            wx_group_id: this.requestData.wx_group_id,
            day_type: this.requestData.day_type
          }).then((res) => {
            if (res.error !== app.$ERR_OK) {
              return false
            }
            let arr = ['profit', 'e_customer', 'e_order_avg', 'per_order']
            let data = this.dataHandle(arr, res.data)// 格式化data
            // 测试数据增加随机值
            let rd = (Math.random() * 1000).toFixed(2)
            data.data[0].rate[0] = rd
            data.totalArr[0] = rd
            curChart.data = data// 设值
            // console.log(this.$refs.chartContainer)
            this.chartArr.push(this.$refs[curChart.id]._setChart(curChart, first))// 设chart并把返回的chart对象存起来
            this.getFinish = i === (this.curChartConfig.length - 1)
          })
        }
      },
      _setResize() {
        // 设置chart自适应窗口大小变化
        let _that = this
        window.onresize = function () {
          for (let i = 0; i < _that.chartArr.length; i++) {
            _that.chartArr[i].resize()
          }
        }
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
        return {
          totalArr,
          data: dataArr
        }
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
      /*border-bottom: 0.5px solid #E6EAED*/
      border-bottom-1px(#E6EAED)

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
        width: calc((100% - 40px) / 3)
        margin-top: $padding-left
</style>
