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
        <base-option-box :arrTitle="dateSelector" :infoTab="0"
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
  const TAB_CONFIG = [
    {text: '运营视窗', status: 0, conTitle: '运营数据'},
    {text: '管理视窗', status: 1, conTitle: '管理数据'},
    {text: '拓展视窗', status: 2, conTitle: '拓展数据'}
  ]
  const DATE_SELECTOR = [
    {title: '7天', status: 'week'},
    {title: '15天', status: 'half_month'},
    {title: '30天', status: 'month'}
  ]
  /** chart配置，id：chart组件id，label：上面部分的数据名称，dataArr-name：图表内部、折线的label, dataArr-key：接口key，dataArr-data：接口数据
   * xAxleData：日期数组用于X轴，showSecondY：是否显示双Y轴，lineShadow：是否有区域阴影， tab：上面的tab切换，tabIndex：tab栏的索引，excel：是否有excel导出功能
   * yAxisIdx：参照哪一条y轴（有两条y轴才用设，不传默认0）, apiFun：接口方法名， tabIdx：表示在哪个tab中显示，用于有tab的图表（不传默认0）
  **/
  const OPERATION_CONFIG = [
    {
      id: 'flowChart',
      apiFun: 'getOperationFlowData',
      title: '流量',
      label: [
        {name: '浏览量(PV)', key: 'pv_total', total: ''},
        {name: '访客数(UV)', key: 'uv_total', total: ''},
        {name: '支付用户', key: 'pay_user_num_total', total: ''}
      ],
      dataArr: [
        {name: '浏览量', key: 'pv', data:[]},
        {name: '访客数', key: 'uv', data:[]},
        {name: '支付用户', key: 'pay_user_num_total', data:[], yAxisIdx: 1}
      ],
      xAxleData: [],
      showSecondY: true
    },
    {
      id: 'businessChart',
      apiFun: 'getOperationBusinessData',
      title: '交易',
      label: [
        {name: '交易金额(元)', key: 'amount_total', total: ''},
        {name: '销售数量', key: 'num_total', total: ''},
        {name: '客单价(元)', key: 'per_customer_price', total: ''}
      ],
      dataArr: [
        {name: '交易金额', key: 'amount', data:[]},
        {name: '销售数量', key: 'num', data:[], yAxisIdx: 1},
        {name: '客单价', key: 'per_customer_price', data:[]}
      ],
      xAxleData: [],
      showSecondY: true
    },
    {
      id: 'orderChart',
      apiFun: 'getOperationOrderData',
      title: '订单',
      label: [
        {name: '订单金额(元)', key: 'amount_total', total: ''},
        {name: '订单数量', key: 'num_total', total: ''},
        {name: '笔单价(元)', key: 'unit_price', total: ''}
      ],
      dataArr: [
        {name: '订单金额', key: 'amount', data:[]},
        {name: '订单数量', key: 'num', data:[], yAxisIdx: 1},
        {name: '笔单价', key: 'unit_price', data:[]}
      ],
      xAxleData: [],
      showSecondY: true
    },
    {
      id: 'userChart',
      apiFun: 'getOperationUserData',
      title: '用户',
      label: [
        {name: '潜在客户', key: 'p_customer', total: ''},
        {name: '新客户', key: 'n_customer', total: ''},
        {name: '主力客户', key: 'e_customer', total: ''},
        {name: '沉睡客户', key: 's_customer', total: ''}
      ],
      dataArr: [
        {name: '潜在客户', key: 'p_customer', data:[]},
        {name: '新客户', key: 'n_customer', data:[]},
        {name: '主力客户', key: 'e_customer', data:[]},
        {name: '沉睡客户', key: 's_customer', data:[]}
      ],
      xAxleData: [],
      showSecondY: false,
      tabIndex: 1
    },
    {
      id: 'benefitChart',
      apiFun: 'getOperationBenefitData',
      title: '效益',
      label: [
        {name: '动销率', key: 'rate', total: ''}
      ],
      dataArr: [
        {name: '动销率', key: 'rate', data:[]}
      ],
      xAxleData: [],
      showSecondY: false
    },
    {
      id: 'servicesChart',
      apiFun: 'getOperationServicesData',
      title: '售后',
      label: [
        {name: '退货金额(元)', key: 'amount_total', total: '', tabIdx: 0},
        {name: '退货数量', key: 'num_total', total: '', tabIdx: 0},
        {name: '退货用户数', key: 'user_count_total', total: '', tabIdx: 0},
        {name: '退货率', key: 'rate', total: '', tabIdx: 1}
      ],
      dataArr: [
        {name: '退货金额', key: 'amount', data:[], tabIdx: 0},
        {name: '退货数量', key: 'num', data:[], tabIdx: 0, yAxisIdx: 1},
        {name: '退货用户数', key: 'user_count', data:[], tabIdx: 0, yAxisIdx: 1},
        {name: '退货率', key: 'rate', data:[], tabIdx: 1}
      ],
      xAxleData: [],
      showSecondY: true,
      tab: [
        {name: '退货'},
        {name: '退货率'}
      ],
      tabIndex: 0,
      excel: 'https://www.baidu.com'
    }
  ]
  const MANAGER_CONFIG = [
    {
      id: 'merchantChart',
      apiFun: 'getMerchantData',
      title: '供应链',
      label: [
        {name: '送货金额(元)', key: 'amount_total', total: '', tabIdx: 0},
        {name: '送货数量', key: 'delivery_num_total', total: '', tabIdx: 0, yAxisIdx: 1},
        {name: '订单满足率', key: 'rate', total: '', tabIdx: 1},
        {name: '准时交货率', key: 'sale_num_total', total: '', tabIdx: 1}
      ],
      dataArr: [
        {name: '送货金额', key: 'amount', data:[], tabIdx: 0},
        {name: '送货数量', key: 'delivery_num', data:[], tabIdx: 0, yAxisIdx: 1},
        {name: '订单满足率', key: 'rate', data:[], tabIdx: 1},
        {name: '准时交货率', key: 'sale_num', data:[], tabIdx: 1}
      ],
      xAxleData: [],
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
      apiFun: 'getPurchaseData',
      title: '采购',
      label: [
        {name: '采购金额(元)', key: 'amount_total', total: ''},
        {name: '采购数量', key: 'num_total', total: ''}
      ],
      dataArr: [
        {name: '采购金额', key: 'amount', data:[]},
        {name: '采购数量', key: 'num', data:[], yAxisIdx: 1}
      ],
      xAxleData: [],
      showSecondY: true
    },
    {
      id: 'warehouseChart',
      apiFun: 'getWarehouseData',
      title: '仓库',
      label: [
        {name: '库存周转率', key: 'rate', total: ''}
      ],
      dataArr: [
        {name: '库存周转率', key: 'rate', data:[]}
      ],
      xAxleData: [],
      showSecondY: true
    }
  ]
  const EXPAND_CONFIG = [
    {
      id: 'expandChart',
      apiFun: 'getExpandData',
      title: '拓展',
      label: [
        {name: '订单数量', key: 'num_total', total: ''},
        {name: '交易金额(元)', key: 'amount', total: ''}
      ],
      dataArr: [
        {name: '订单数量', key: 'num', data:[], yAxisIdx: 0},
        {name: '交易金额', key: 'amount', data:[], yAxisIdx: 1}
      ],
      xAxleData: [],
      showSecondY: true
    },
    {
      id: 'leaderChart',
      apiFun: 'getExpandLeaderData',
      title: '团长',
      label: [
        {name: '团长数量', key: 'total', total: ''},
        {name: '新增团长', key: 'add_num_total', total: ''}
      ],
      dataArr: [
        {name: '团长数量', key: 'current_num', data:[]},
        {name: '新增团长', key: 'add_num', data:[]}
      ],
      xAxleData: [],
      showSecondY: true
    },
    {
      id: 'communityChart',
      apiFun: 'getExpandCommunityData',
      title: '社群',
      label: [
        {name: '社群数量', key: 'total', total: ''},
        {name: '新增社群', key: 'add_num_total', total: ''}
      ],
      dataArr: [
        {name: '社群数量', key: 'current_num', data:[]},
        {name: '新增社群', key: 'add_num', data:[]}
      ],
      xAxleData: [],
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
        chartConfig: [OPERATION_CONFIG, MANAGER_CONFIG, EXPAND_CONFIG],
        curChartConfig: [],// 当前tab的所有chart
        chartArr: [],// 存储chart对象数组
        getFinish: false,
        disabledDate: {},
        requestParam: {date_type: 'week'}
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
      this.curChartConfig = this.chartConfig[this.topTabIndex]
      this._getData(true)
    },
    methods: {
      // handleChangeTab(tab, tabIndex) {
      //   console.log(tab, tabIndex)
      // },
      // exportExcel(type) {
      //   this.excelType = type
      //   window.open(this.exportUrl(), '_blank')
      // },
      // firstUppercase(str) {
      //   let first = str[0].toUpperCase()
      //   return first+str.slice(1)
      // },
      // exportUrl() {
      //   // todo
      //   let currentId = this.getCurrentId()
      //   let token = this.$storage.get('auth.currentUser', '')
      //   let msg = {
      //     current_corp: currentId,
      //     current_shop: process.env.VUE_APP_CURRENT_SHOP,
      //     access_token: token.access_token
      //   }
      //   // this[this.excelType[0].toUpperCase()]
      //   let data = Object.assign(msg, this.requestPub, this['request' + this.firstUppercase(this.excelType)])
      //   let search = []
      //   for (let key in data) {
      //     search.push(`${key}=${data[key]}`)
      //   }
      //   let url = this.exportUrlArr[this.excelType][this.tabIndexControl[this.excelType]]
      //   console.log(url)
      //   return process.env.VUE_APP_API + '/social-shopping/api/backend/data-center/goods/' + url + '?' + search.join('&')
      // },
      _formatExcelData(index = 0) {
        // todo
        let currentId = this.getCurrentId()
        let token = this.$storage.get('auth.currentUser', '')
        let currentShop = process.env.VUE_APP_CURRENT_SHOP
        let _dType = this.requestParam.date_type === 'half_month' ? 'month' : this.requestParam.date_type
        // let msg = {
        //   current_corp: currentId,
        //   current_shop: process.env.VUE_APP_CURRENT_SHOP,
        //   access_token: token.access_token
        // }
        return `${process.env.VUE_APP_API}/social-shopping/api/backend/data-center/goods/todo?access_token=${token}&current_shop=${currentShop}&current_corp=${currentId}&day_type=${_dType}`
      },
      _changeStatusTab(item, index) {
        if (this.topTabIndex === index) return
        this.curChartConfig = this.chartConfig[index]
        this.topTabIndex = index
        this._getData(true)
      },
      _selectDate(value) {
        this.requestParam = {date_type: value}
        this._getData()
      },
      _getData(first = false) {
        this.chartArr = []
        for (let i = 0; i < this.curChartConfig.length; i++) {
          let loading = first && i === 0
          let getSuccess = false
          let curChart = this.curChartConfig[i]
          // 用户接口的传参字段和别的不一样
          let _param = {}
          if (curChart.id === 'userChart') {
            let _dType = this.requestParam.date_type === 'half_month' ? 'month' : this.requestParam.date_type
            _param = {day_type: _dType}
          } else {
            _param = this.requestParam
          }
          API.Operation[curChart.apiFun](_param, loading).then((res) => {
            if (res.error !== app.$ERR_OK) {
              return false
            }
            if (curChart.id === 'servicesChart') {
              // console.log(111) todo
              curChart.excel = this._formatExcelData()
            }
            // 格式化接口返回的数据
            if (curChart.id === 'userChart') {
              // 用户接口的格式化和别的不一样
              curChart = this.formatUserResData(res, curChart)
            } else {
              curChart = this.formatResData(res, curChart)
            }
            getSuccess = true
          }).finally(() => {
            let currentChart = this.$refs[curChart.id]
            if (currentChart) {
              this.chartArr.push(currentChart._setChart(curChart, first, getSuccess))// 设chart并把返回的chart对象存起来
            }
            // this.chartArr.push(this.$refs[curChart.id]._setChart(curChart, first, getSuccess))// 设chart并把返回的chart对象存起来
            this.getFinish = i === (this.curChartConfig.length - 1)// 设置请求完
            loading && this.$loading.hide()
          })
        }
      },
      _setResize() {
        // 设置chart自适应窗口大小变化
        let _that = this
        window.onresize = function () {
          for (let i = 0; i < _that.chartArr.length; i++) {
            _that.chartArr[i] && _that.chartArr[i].resize()
          }
        }
      },
      formatResData(result, curChart) {
        curChart.xAxleData = []// 重置x轴数据
        // 遍历dataArr，通过key生成新的数组
        for (let j = 0; j < curChart.dataArr.length; j++) {
          let _chartData = curChart.dataArr[j]
          let _key = _chartData.key// 对应接口每个值的key
          let _curLabel = curChart.label[j]
          _curLabel.total = result[_curLabel.key]// 配置的label数组,用于设置每个图表上面的总计
          _chartData.data = []// 重置data
          // 遍历接口的data数组，通过配置的key赋值给当前的数组
          for (let i = 0; i < result.data.length; i++) {
            let _resData = result.data[i]
            // 测试数据
            // let rd = (Math.random() * 1000).toFixed(2)
            // _chartData.data.push(_resData[_key]+rd)
            // 测试数据
            _chartData.data.push(_resData[_key])// 通过key取出接口返回的值并push进数组
            if (j === 0) {
              // x轴的date指生成一个数组就行了
              let _date = _resData.date
              _date = _date.split('-').slice(1).join('/')
              curChart.xAxleData.push(_date)
            }
          }
        }
        return curChart
      },
      formatUserResData(result, curChart) {
        curChart.xAxleData = []// 重置x轴数据
        for (let j = 0; j < curChart.dataArr.length; j++) {
          let _chartData = curChart.dataArr[j]
          let _key = _chartData.key// 对应接口每个值的key
          let _curLabel = curChart.label[j]
          let _item = result.data[_key]
          _curLabel.total = _item.total// 配置的label数组,用于设置每个图表上面的总计
          _chartData.data = []// 重置data
          for (let i = 0; i < _item.data.length; i++) {
            let _resData = _item.data[i]
            _chartData.data.push(_resData.value)// 通过key取出接口返回的值并push进数组
            if (j === 0) {
              // x轴的date指生成一个数组就行了
              let _date = _resData.at.split('-').slice(1).join('/')
              curChart.xAxleData.push(_date)
            }
          }
        }
        return curChart
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
