<template>
  <div class="bar-data">
    <div class="data-content">
      <div :id="chartId" style="width: 100%; height: 100%"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'BAR_DATA'

  export default{
    name: COMPONENT_NAME,
    props: {
      chartId: {
        type: String,
        default: 'bar'
      }
    },
    data() {
      return {
        tabIndex: 0,
        data: {
          x: ["时令水果", "应季蔬菜", "肉蛋家禽", "海鲜冻品", "粮油百货", "酒饮冲调"],
          series: [0, 0, 0, 0, 0, 0],
          x1: ["时令水果", "应季蔬菜", "肉蛋家禽", "海鲜冻品", "粮油百货", "酒饮冲调"],
          series1: [0, 0, 0, 0, 0, 0],
          series2: [0, 0, 0, 0, 0, 0]
        }
      }
    },
    computed: {
    },
    watch: {
    },
    mounted() {
      // this.drawBar(this.data, '退货数')
    },
    methods: {
      setTab(num) {
        this.tabIndex = 0
      },
      changeTab(data) {
        this.drawBar(data)
      },
      countNum(length, ratio) {
        return 100 / length * ratio
      },
      countNum1(length) {
        return 100 / length * 9
      },
      // 纵向柱状图
      drawBar(data, rate) {
        this.$nextTick(() => {
          let xAxisData = data.xAx.length > 0 ? data.xAx : this.data.x
          let seriesData = data.series.length > 0 ? data.series : this.data.series
          let myChart = this.$echarts.init(document.getElementById(this.chartId))
          let that = this
          myChart.on('click', function(params) {
            that.$emit('clickBigChart', params.dataIndex)
          })
          // let x = new Array(15).fill(1)
          // let y = new Array(15).fill(81)
          let ratio = Math.floor((window.innerWidth - 230) / 85)
          myChart.setOption(this.createBarData(xAxisData, seriesData, ratio, rate))
          window.addEventListener('resize', function() {
            myChart.resize()
          })
        })
      },

      // 横向柱状图
      drawBar1(data) {
        this.$nextTick(() => {
          let msg = {
            xAxisData: data.xAx.length ? data.xAx : this.data.x1,
            seriesData1: data.salesNum.length ? data.salesNum : this.data.series,
            seriesData2: data.purchaseNum.length ? data.purchaseNum : this.data.series,
            salesNumAll: data.salesNumAll,
            purchaseNumAll: data.purchaseNumAll
          }
          let myChart = this.$echarts.init(document.getElementById(this.chartId))
          let that = this
          myChart.on('click', function(params) {
            that.$emit('clickBigChart', params.dataIndex)
          })
          // let x = new Array(200).fill(1)
          // let y1 = new Array(200).fill(81)
          // let y2 = new Array(200).fill(81)
          myChart.setOption(this.createBar(msg))
          window.addEventListener('resize', function() {
            myChart.resize()
          })
        })
      },
      createBarData(xAxisData, seriesData, ratio, rate) {
        // let color = ['#5681EA', '#5490F3', '#6EB0FF', '#7AB6F5', '#8DC6F6', '#94CFF8', '#9ED6F7', '#A7DFF8', '#AFE5FA']
        return {
          grid: {
            left: '50',
            right: '60',
            bottom: '80',
            top: '35',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxisData,
            offset: 12,
            splitLine: {
              show: false
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
          },
          yAxis: {
            minInterval: 1,
            type: 'value',
            offset: 0,
            splitLine: {
              show: true,
              lineStyle: {
                color: '#F0F3F5',
                width: 0.5
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              formatter: '{value}',
              color: '#666',
              margin: 40
            },
            axisLine: {
              show: false
            }
          },
          tooltip: {
            trigger: 'axis',
            padding: [5, 10],
            axisPointer: {
              type: 'shadow',
              shadowStyle: {
                opacity: 0
              }
            },
            formatter(prams) {
              return `${prams[0].name}：${prams[0].value}${rate ? '%': ''}`
            }
          },
          dataZoom: [{
            end: this.countNum(xAxisData.length, ratio),// 数据窗口范围的结束百分比
            type: 'slider',
            bottom: '26px',
            show: true,
            height: 8,
            xAxisIndex: [0],
            borderColor: "rgba(250,250,250,0)",
            fillerColor: '#999999',
            borderRadius: 4,
            showDataShadow: false,// 是否显示数据阴影 默认auto
            showDetail: false,// 即拖拽时候是否显示详细数值信息 默认true
            realtime: true, // 是否实时更新
          }],
          series: [
            {
              type: 'bar',
              data: seriesData,
              barWidth: '40px',
              zlevel: 12,
              itemStyle: {
                normal: {
                  barBorderRadius: 0,
                  // color: '#8DC6F6',
                  // color: function(params) {
                  //   var num = color.length;
                  //   return color[params.dataIndex % num]
                  // }
                  color: function(params) {
                    let min = 129
                    let maxOpacity = 110
                    min = min + 5*params.dataIndex
                    maxOpacity = maxOpacity - 10*params.dataIndex
                    if (maxOpacity <= 30) maxOpacity = 30
                    if (min >= 254) min = 254
                    return `rgba(87, ${min}, 235, ${maxOpacity})`
                  }
                }
              }
            }
          ]
        }
      },
      createBar(series, ratio) {
        return {
          grid: {
            left: '50',
            right: '60',
            bottom: '80',
            top: '35',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: false,
            data: series.xAxisData,
            offset: 12,
            splitLine: {
              show: false,
              lineStyle: {
                color: '#E6E6E6',
                width: 0.5
              }
            },
            axisLabel: {
              show: false,
              formatter: '{value}',
              color: '#666'
            },
            axisTick: {
              show: false,
              lineStyle: {
                color: '#ccc',
                width: 0.5
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#ccc',
                width: 0.5
              }
            }
          },
          yAxis: {
            minInterval: 1,
            inverse: true,
            type: 'category',
            data: series.xAxisData,
            splitLine: {
              show: false,
              lineStyle: {
                color: '#F0F3F5',
                width: 0.5
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
              show: true,
              formatter: '{value}',
              color: '#666'
            },
            axisLine: {
              show: false,
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            }
          },
          dataZoom: [{
            end: this.countNum1(series.xAxisData.length),// 数据窗口范围的结束百分比
            type: 'slider',
            left: '30px',
            show: true,
            width: 8,
            yAxisIndex: [0],
            borderColor: "rgba(250,250,250,0)",
            fillerColor: '#999',
            showDataShadow: false,// 是否显示数据阴影 默认auto
            showDetail: false,// 即拖拽时候是否显示详细数值信息 默认true
            realtime: true // 是否实时更新
          }],
          tooltip: {
            trigger: 'axis',
            padding: [5, 10],
            axisPointer: {
              type: 'shadow',
              shadowStyle: {
                opacity: 0
              }
            },
            formatter(prams) {
              return `${prams[0].name}<br />销售额占比：${prams[0].value}%<br />采购额占比：${prams[1].value}%`
            }
          },
          series: [
            { // For shadow
              type: 'bar',
              name: '销售',
              data: series.seriesData1,
              barGap: 0,
              itemStyle: {
                normal: {
                  barBorderRadius: 0,
                  color: '#5681EA'
                }
              },
              emphasis: {
                itemStyle: {
                  // color: '#F5F6F9'
                }
              },
              label: {
                normal: {
                  show: true,
                  position: 'right',
                  formatter: function(data) {
                    return data.value + '%'
                  },
                  verticalAlign: 'middle',
                  color: '#333',
                  fontSize: '14',
                }
              },
              barWidth: '20px',
              animation: false,
              zlevel: 11
            },
            {
              type: 'bar',
              name: '采购',
              data: series.seriesData2,
              barWidth: '20px',
              zlevel: 12,
              label: {
                normal: {
                  show: true,
                  position: 'right',
                  formatter: function(data) {
                    return data.value + '%'
                  },
                  offset: [0, 2],
                  verticalAlign: 'middle',
                  color: '#333',
                  fontSize: '14',
                }
              },
              itemStyle: {
                normal: {
                  barBorderRadius: 0,
                  color: '#59C6E8'
                }
              }
            }
          ]
        }
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
