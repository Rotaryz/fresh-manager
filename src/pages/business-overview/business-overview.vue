<template>
  <div class="business-overview normal-box">
    <div class="identification">
      <div class="identification-page">
        <img src="./icon-revenue@2x.png" class="identification-icon">
        <p class="identification-name">营收概况</p>
      </div>
      <div class="function-btn">
        <base-option-box :arrTitle="tabOptions" :tabActive="3" @checkTime="changeTab"></base-option-box>
      </div>
    </div>
    <div class="content-header">
      <div class="content-title">营收概况</div>
    </div>
    <div class="survey">
      <div class="survey-item">
        <div class="survey-money">{{detail.get_total}}</div>
        <div class="survey-title">净利润(元)</div>
      </div>
      <div class="survey-item">
        <div class="survey-money">{{detail.sale_total}}</div>
        <div class="survey-title">
          商品销售收入(元)
          <router-link tag="span" to="/home/transaction-record" append class="detail hand">明细</router-link>
        </div>
      </div>
      <div class="survey-item">
        <div class="survey-money">{{detail.cost_total}}</div>
        <div class="survey-title">营业成本(元)</div>
      </div>
    </div>
    <div class="content-header">
      <div class="content-title">营收趋势</div>
    </div>
    <div class="customer-box">
      <div id="customer"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'

  const PAGE_NAME = 'BUSINESS_OVERVIEW'
  const TITLE = '营业概况'

  const TAB_OPTIONS = [
    {title: '昨天', status: '1'},
    {title: '7天', status: '7'},
    {title: '30天', status: '30'},
    {title: '自定义', status: 'custom'}
  ]

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        detail: {},
        tabOptions: TAB_OPTIONS,
        date: 1
      }
    },
    mounted() {
      this._getRevenueDetail()
      this._getRevenueTrend()
    },
    methods: {
      changeTab(value) {
        this.date = value.toString()
        this._getRevenueTrend()
        this._getRevenueDetail()
      },
      async _getRevenueDetail() {
        let data = {date: this.date}
        let res = await API.Revenue.getRevenueDetail(data)
        if (res.error !== this.$ERR_OK) {
          console.warn('获取营收概况数据失败')
          return
        }
        this.detail = res.data
      },
      async _getRevenueTrend() {
        let data = {date: this.date}
        let res = await API.Revenue.getRevenueTrend(data)
        if (res.error !== this.$ERR_OK) {
          console.warn('获取营收趋势数据失败')
          return
        }
        this.drawTotalLine(res.data)
      },
      drawTotalLine(data) {
        let xAxis = data.x
        let series = data.series
        let myChart = this.$echarts.init(document.getElementById('customer'))
        myChart.setOption({
          legend: {
            itemWidth: 14,
            itemHeight: 14,
            borderRadius: 0,
            bottom: 10,
            align: 'auto',
            data: [{name: '净利润', icon: 'rect'}, {name: '商品销售收入', icon: 'rect'}, {name: '营业成本', icon: 'rect'}]
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '63',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxis,
            splitLine: {
              show: false,
              lineStyle: {
                color: '#E6E6E6',
                width: 0.5
              }
            },
            axisLabel: {
              color: '#666',
              fontSize: 12,
              align: 'center'
            },
            axisTick: {
              lineStyle: {
                color: '#ccc',
                width: 0.5
              }
            },
            axisLine: {
              lineStyle: {
                color: '#ccc',
                width: 0.5
              }
            }
          },
          tooltip: {
            trigger: 'axis',
            textStyle: {
              align: 'left'
            },
            axisPointer: {
              lineStyle: {
                color: '#ccc',
                width: 0.5
              }
            },
            padding: [10, 50, 10, 20]
          },
          yAxis: {
            minInterval: 1,
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                color: '#EFEFEF',
                width: 0.5,
                type: 'dotted'
              }
            },
            axisTick: {
              show: false,
              lineStyle: {
                color: '#c4c4c4',
                width: 0.5
              }
            },
            axisLabel: {
              formatter: '{value}',
              color: '#666'
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#c4c4c4',
                width: 0.5
              }
            }
          },
          series: [
            {
              name: '净利润',
              data: series.get_total,
              type: 'line',
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  x2: 0,
                  y: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(104,212,165,0.28)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(104,212,165,0.28)'
                    }
                  ],
                  globalCoord: false
                }
              },
              itemStyle: {
                normal: {
                  color: 'rgba(79,209,102,1)',
                  borderWidth: 1,
                  // borderColor: '#fff',
                  // shadowColor: 'rgba(73,133,252,1)',
                  // shadowOffsetY: 0,
                  // shadowOffsetX: 0,
                  // shadowBlur: 10,
                  lineStyle: {
                    color: 'rgba(79,209,102,1)',
                    width: 3
                  }
                }
              }
            },
            {
              name: '商品销售收入',
              data: series.sale_total,
              type: 'line',
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  x2: 0,
                  y: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(169,129,255,0.3)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(169,129,255,0.3)'
                    }
                  ],
                  globalCoord: false
                }
              },
              itemStyle: {
                normal: {
                  color: 'rgba(169,129,255,1)',
                  borderWidth: 1,
                  // borderColor: '#fff',
                  // shadowColor: 'rgba(73,133,252,1)',
                  // shadowOffsetY: 0,
                  // shadowOffsetX: 0,
                  // shadowBlur: 10,
                  lineStyle: {
                    color: 'rgba(169,129,255,1)',
                    width: 3
                  }
                }
              }
            },
            {
              name: '营业成本',
              data: series.cost_total,
              type: 'line',
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  x2: 0,
                  y: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(73,133,252, 0.55)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(73,133,252, 0.05)'
                    }
                  ],
                  globalCoord: false
                }
              },
              itemStyle: {
                normal: {
                  color: 'rgba(73,133,252,1)',
                  borderWidth: 1,
                  // borderColor: '#fff',
                  // shadowColor: 'rgba(73,133,252,1)',
                  // shadowOffsetY: 0,
                  // shadowOffsetX: 0,
                  // shadowBlur: 10,
                  lineStyle: {
                    color: 'rgba(73,133,252,1)',
                    width: 3
                  }
                }
              }
            }
          ]
        })
        myChart.resize()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .business-overview
    overflow: hidden
    flex: 1
    display: flex
    flex-direction: column

  .tab-header
    height: 80px
    display: flex
    align-items: center
    box-sizing: border-box
    position: relative
    .tab-box
      margin-right: 10px

  /*基本信息类头部盒子样式*/
  .content-header
    border-bottom: 0.5px solid $color-line
    display: flex
    align-items: center
    justify-content: space-between
    padding-bottom: 15px
    position: relative
    box-sizing: border-box
    &:after
      content: ''
      position: absolute
      width: 34px
      height: 2px
      background: $color-main
      border-radius: 1px
      bottom: -1px
      left: 0
    .content-title
      color: $color-text-main
      font-family: $font-family-regular
      font-size: $font-size-16

  .survey
    height: 182px
    box-sizing: border-box
    display: flex
    align-items: center
    justify-content: space-around
    .survey-item
      .survey-money
        font-family: $font-family-bold
        font-size: 36px
        color: $color-text-main
      .survey-title
        color: #82899C
        font-family: $font-family-regular
        font-size: $font-size-14
        .detail
          color: $color-main
          display: inline-block
          margin-left: 10px
          text-decoration: underline
          font-family: $font-family-regular
          font-size: $font-size-14

  .customer-box
    #customer
      height: 480px
      width: 100%
</style>
