<template>
  <div class="bar-data">
    <div class="data-content">
      <div :id="chartId" style="width: 100%; height: 100%"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'LINE_DATA'

  export default {
    name: COMPONENT_NAME,
    props: {
      chartId: {
        type: String,
        default: 'line'
      }
    },
    data() {
      return {
        tabIndex: 0,
        colorObj: [
          {
            name: '订单数',
            color: '#6081E3',
            colorStops0: 'rgba(89,223,120,0.55)',
            colorStops1: 'rgba(89,223,120,0.05)'
          }
        ],
        op: {
          label: '',
          data: [
            {
              x: ['05/19', '05/20', '05/21', '05/22', '05/23', '05/24', '05/25'],
              rate: ['0', '0', '0', '0', '0', '0', '0']
            }
          ]
        }
      }
    },
    computed: {},
    watch: {},
    mounted() {},
    methods: {
      setTab(num) {
        this.tabIndex = 0
      },
      // 折线图
      drawLine(data, rate) {
        this.$nextTick(() => {
          let myChart = this.$echarts.init(document.getElementById(this.chartId))
          let option = this._setOption(data, rate)
          myChart.setOption(option)
          window.addEventListener('resize', function() {
            myChart.resize()
          })
        })
      },
      _setOption(chartConfig, rate) {
        let option = {
          tooltip: {
            trigger: 'axis',
            // formatter: '{a0}: {c0}',
            formatter: function(params) {
              let result = `<p style="color:#ffffff;font-size:12px">${params[0].axisValue}</p>`
              params.forEach(function(item) {
                result += `<p><span style="display:inline-block;margin-right:5px;margin-bottom:-1px;width:10px;height:10px;border-radius:1px;background-color:${
                  item.color
                }"></span><span style="color:#ffffff;font-size:12px">${item.seriesName}: ${item.value}${
                  rate ? '%' : ''
                }</span></p>`
              })
              return result
            },
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
            padding: [5, 10, 7, 10]
          },
          legend: {
            data: [],
            bottom: 10,
            icon: 'rect', //  这个字段控制形状  类型包括 circle 圆形，rect 正方形，roundRect，triangle，diamond，pin，arrow，none
            itemWidth: 11,
            itemHeight: 11,
            itemGap: 40
          },
          grid: {
            left: '20',
            right: '30',
            bottom: '60',
            top: '20',
            containLabel: true
          },
          xAxis: [],
          yAxis: [],
          series: []
        }

        let data = chartConfig.data
        let legendData = []
        let series = []
        let item = data[0]
        item.name = chartConfig.label
        legendData.push(item.name)
        series.push(this._setSeries(chartConfig, item))
        // chartConfig.showSecondY && (option.grid.right = '20')
        option.legend.data = legendData
        option.series = series
        option.xAxis = this._setXAxis(data[0].x)
        option.yAxis = this._setYAxis()
        return option
      },
      _setSeries(chartConfig, item) {
        let seriesConfig = {
          name: item.name,
          type: 'line',
          data: item.rate,
          yAxisIndex: 0,
          smooth: false,
          hoverAnimation: true,
          symbolSize: 5,
          showSymbol: item.rate.length <= 7,
          itemStyle: {
            normal: {
              color: this.colorObj[0].color,
              borderWidth: 1,
              lineStyle: {
                color: this.colorObj[0].color,
                width: 2
              }
            }
          }
        }
        let color = ['rgba(96,129,227,0.28)', 'rgba(136,89,232,0.28)', 'rgba(247,193,54,0.28)', 'rgba(106,225,255,0.28)']
        seriesConfig.areaStyle = {
          color: {
            type: 'linear',
            x: 0,
            x2: 0,
            y: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: color[0]
              },
              {
                offset: 1,
                color: 'rgba(250,250,250,0)'
              }
            ],
            globalCoord: false
          }
        }
        return seriesConfig
      },
      _setXAxis(data) {
        let xAxis = {
          type: 'category',
          boundaryGap: false,
          data: data,
          offset: 10,
          splitLine: {
            show: true,
            lineStyle: {
              color: '#F0F3F5',
              width: 0.5,
              type: 'doted'
            }
          },
          axisLabel: {
            color: '#999',
            fontSize: 12,
            align: 'center',
            showMinLabel: true,
            showMaxLabel: true
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
      _setYAxis() {
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
        return [yAxis]
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .bar-data
    width: 100%
    flex: 1
    display: flex
    flex-direction: column
  .data-content
    flex: 1
    #barData
      width: 100%
      height: 100%
</style>
