<template>
  <div class="chart-line-con">
    <div class="title-bar">
      <div class="left-box">
        <p class="title">{{chartConfig.title}}</p>
        <ul v-if="chartConfig.tab" class="tab">
          <li v-for="(tab, tabIdx) in chartConfig.tab" :key="tabIdx" class="tab-item" @click="_switchTab(tab,tabIdx)">{{tab.name}}</li>
          <li class="tab-item tab-active" :style="{'transform':'translateX('+tabIndex*84+'px)'}">{{chartConfig.tab[tabIndex].name}}</li>
        </ul>
      </div>
      <a v-if="chartConfig.excel" class="excel-btn">导出Excel</a>
    </div>
    <div class="label-bar">
      <p v-for="(label, labelIdx) in chartConfig.label" :key="labelIdx" class="label" :style="{'max-width':100/chartConfig.label.length+'%'}">{{label}} <span class="label-val">{{chartData.totalArr[labelIdx]}}</span></p>
    </div>
    <div :id="chartId" class="chart-con"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'E_CHART_LINE'
  const COLOR_ARR = ['#6081E3', '#8859E8', '#F7C136', '#6AE1FF']

  export default {
    name: COMPONENT_NAME,
    props: {
      chartId: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        chartConfig: {},
        chartData: {},
        tabIndex: 0
      }
    },
    methods: {
      _setData(chartConfig) {
        // console.log(JSON.stringify(chartConfig))
        this.chartConfig = chartConfig
        this.tabIndex = chartConfig.tabIndex
        this.chartData = chartConfig.data
        let option = this._setOption(chartConfig)
        let myChart = this.$echarts.init(document.getElementById(chartConfig.id));
        myChart.setOption(option);
      },
      _setOption(chartConfig) {
        let option = {
          tooltip: {
            trigger: 'axis',
            // formatter: '{a0}: {c0}',
            backgroundColor: 'rgba(51,51,51,0.8)',
            textStyle: {
              color: '#ffffff',
              align: 'left',
              fontSize: '12',
              fontFamily: 'PingFangSC-Regular'
            },
            axisPointer: {
              lineStyle: {
                color: '#ccc',
                width: 0.5
              }
            },
            padding: [5, 10, 5, 10]
          },
          legend: {
            data: [],
            bottom: 0,
            icon: "rect", //  这个字段控制形状  类型包括 circle 圆形，rect 正方形，roundRect，triangle，diamond，pin，arrow，none
            itemWidth: 11,
            itemHeight: 11,
            itemGap: 40
          },
          grid: {
            left: '20',
            right: '30',
            bottom: '36',
            top: '20',
            containLabel: true
          },
          xAxis: [],
          yAxis: [],
          series: []
        }

        let data = chartConfig.data.data
        let legendData = []
        let series = []
        let length = chartConfig.label.length
        for (let i = 0; i < length; i++) {
          let item = data[i]
          item.name = chartConfig.label[i]
          legendData.push(item.name)
          series.push(this._setSeries(chartConfig,item,i))
        }
        chartConfig.showSecondY && (option.grid.right = '20')
        option.legend.data = legendData
        option.series = series
        option.xAxis = this._setXAxis(data[0].x)
        option.yAxis = this._setYAxis(chartConfig.showSecondY)
        return option
      },
      _setSeries(chartConfig,item,i) {
        let seriesConfig = {
          name: item.name,
          type: 'line',
          data: item.rate,
          yAxisIndex: chartConfig.showSecondY && i > 1 ? 1 : 0,
          smooth: false,
          hoverAnimation: true,
          symbolSize: 5,
          showSymbol: item.rate.length <= 7,
          itemStyle: {
            normal: {
              color: COLOR_ARR[i],
              borderWidth: 1,
              lineStyle: {
                color: COLOR_ARR[i],
                width: 2
              }
            }
          }
        }
        if (chartConfig.lineShadow) {
          seriesConfig.areaStyle = {
            color: {
              type: 'linear',
              x: 0, x2: 0, y: 0, y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(96,129,227,0.28)'
                },
                {
                  offset: 1,
                  color: 'rgba(96,129,227,0)'
                }
              ],
              globalCoord: false
            }
          }
        }
        return seriesConfig
      },
      _setXAxis(data) {
        let xAxis = {
          type: 'category',
          boundaryGap: false,
          data: data,
          splitLine: {
            show: true,
            lineStyle: {
              color: '#F0F3F5',
              width: 0.5,
              type: "doted"
            }
          },
          axisLabel: {
            color: '#666',
            fontSize: 12,
            align: 'center'
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        }
        return xAxis
      },
      _setYAxis(showSecondY) {
        let yAxis = {
          minInterval: 1,
          type: 'value',
          // 刻度线
          splitLine: {
            show: true,
            lineStyle: {
              color: '#F0F3F5',
              width: 0.5
            }
          },
          // 坐标刻度
          axisTick: {
            show: false,
            lineStyle: {
              color: '#F0F3F5',
              width: 0.5
            }
          },
          // 坐标值
          axisLabel: {
            formatter: '{value}',
            color: '#666'
          },
          // 坐标轴
          axisLine: {
            show: true,
            lineStyle: {
              color: '#F0F3F5',
              width: 0.5
            }
          }
        }
        if (showSecondY) {
          let secondY = {
            minInterval: 1,
            type: 'value',
            // 刻度线
            splitLine: {
              show: false
            },
            // 坐标刻度
            axisTick: {
              show: false,
              lineStyle: {
                color: '#F0F3F5',
                width: 0.5
              }
            },
            // 坐标值
            axisLabel: {
              formatter: '{value}',
              color: '#666'
            },
            // 坐标轴
            axisLine: {
              show: true,
              lineStyle: {
                color: '#F0F3F5',
                width: 0.5
              }
            }
          }
          return [yAxis, secondY]
        }
        return [yAxis]
      },
      _switchTab(tab,tabIdx) {
        this.tabIndex = tabIdx
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .chart-line-con
    background: #ffffff
    /*width: 530px*/
    height: 414px
    box-sizing: border-box
    /*border: 0.5px solid #E6EAED*/
    border-1px(#E6EAED, 0)
    .title-bar
      padding: 0 20px
      box-sizing: border-box
      height: 60px
      line-height: 60px
      color: $color-text-main
      font-size: $font-size-16
      font-family: $font-family-medium
      border-bottom-1px(#E6EAED)
      layout(row)
      justify-content: space-between
      align-items: center
      .left-box
        layout(row)
        align-items: center
        .title
          margin-right: 30px
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
    .label-bar
      padding: 0 10px 0 20px
      width: 100%
      height: 60px
      line-height: 60px
      layout(row,'',nowrap)
      overflow: hidden
      color: $color-text-main
      font-family: $font-family-regular
      .label
        max-width: 25%
        margin-right: 5%
        font-size: $font-size-12
        no-wrap-plus(1)
        .label-val
          font-size: $font-size-18
          font-family: $font-family-bold

    .chart-con
      width: 100%
      height: 274px
</style>
