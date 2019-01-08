<template>
  <div class="business-overview">
    <div class="tab-header">
      <base-option-box></base-option-box>
    </div>
    <div class="content-header">
      <div class="content-title">营收概况</div>
    </div>
    <div class="survey">
      <div class="survey-item">
        <div class="survey-money">3255</div>
        <div class="survey-title">净利润(元)</div>
      </div>
      <div class="survey-item">
        <div class="survey-money">3255</div>
        <div class="survey-title">
          商品销售收入(元)
          <router-link tag="span" to="operating-cost" append class="detail hand">明细</router-link>
        </div>
      </div>
      <div class="survey-item">
        <div class="survey-money">3255</div>
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
  const PAGE_NAME = 'BUSINESS_OVERVIEW'
  const TITLE = '营业概况'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {}
    },
    mounted() {
      console.log(this.$echarts)
      this.drawTotalLine()
    },
    methods: {
      drawTotalLine(data, arr, between) {
        data = data || ['2:00', '4:00', '6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00']
        arr = arr || {refund_num: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], pay_num: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], submit_num: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
        let myChart = this.$echarts.init(document.getElementById('customer'))
        myChart.setOption({
          legend: {
            itemWidth: 14,
            itemHeight: 14,
            borderRadius: 0,
            bottom: 10,
            align: 'auto',
            data: [
              {name: '净利润', icon: 'rect'},
              {name: '商品销售收入', icon: 'rect'},
              {name: '营业成本', icon: 'rect'}
            ]
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
            data: data,
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
          series: [{
            name: '净利润',
            data: arr.refund_num,
            type: 'line',
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                x2: 0,
                y: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(104,212,165,0.28)'
                }, {
                  offset: 1, color: 'rgba(104,212,165,0.28)'
                }],
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
          }, {
            name: '商品销售收入',
            data: arr.submit_num,
            type: 'line',
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                x2: 0,
                y: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(169,129,255,0.3)'
                }, {
                  offset: 1, color: 'rgba(169,129,255,0.3)'
                }],
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
          }, {
            name: '营业成本',
            data: arr.pay_num,
            type: 'line',
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                x2: 0,
                y: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(73,133,252, 0.55)'
                }, {
                  offset: 1, color: 'rgba(73,133,252, 0.05)'
                }],
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
          }]
        })
        myChart.resize()
      },

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
    border-bottom: 1px solid $color-line
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
      font-family: $font-family-medium
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
          color: $color-sub
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
