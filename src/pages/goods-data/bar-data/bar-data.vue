<template>
  <div class="bar-data">
    <div class="data-content">
      <div :id="chartId" style="width: 100%; height: 100%" @click="clickChart"></div>
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
          x: ["时令水果", "应季蔬菜", "肉蛋家禽", "海鲜冻品", "粮油百货", "酒饮冲调", "面包糕点", "网红零食", "粤式早点"],
          series: ["10", "20", "5", "40", "15", "14", "44", "34", "20"],
          x1: ["时令水果", "应季蔬菜", "肉蛋家禽", "海鲜冻品", "粮油百货", "酒饮冲调"],
          series1: ["10", "20", "5", "40", "15", "14"],
          series2: ["12", "18", "10", "50", "10", "20"]
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
      clickChart(e) {
        console.log(e, 111)
      },
      setTab(num) {
        this.tabIndex = 0
      },
      changeTab(data) {
        this.drawBar(data)
      },
      // 纵向柱状图
      drawBar(data) {
        this.$nextTick(() => {
          let xAxisData = data.x.length > 0 ? data.x : this.data.x
          let seriesData = data.series.length > 0 ? data.series : this.data.series
          let myChart = this.$echarts.init(document.getElementById(this.chartId))
          myChart.setOption(this.createBarData(xAxisData, seriesData))
        })
      },
      // 横向柱状图
      drawBar1(data) {
        this.$nextTick(() => {
          let xAxisData = data.x.length > 0 ? data.x : this.data.x1
          let seriesData1 = data.series.length > 0 ? data.series : this.data.series1
          let seriesData2 = data.series.length > 0 ? data.series : this.data.series2
          let myChart = this.$echarts.init(document.getElementById(this.chartId))
          myChart.setOption(this.createBar(xAxisData, seriesData1, seriesData2))
        })
      },
      createBarData(xAxisData, seriesData) {
        let dataShadow = new Array(9).fill(1000)
        dataShadow = dataShadow.map((item, index) => {
          return Math.max(seriesData[0], 1)
        })
        let color = ['#5681EA', '#5490F3', '#6EB0FF', '#7AB6F5', '#8DC6F6', '#94CFF8', '#9ED6F7', '#A7DFF8', '#AFE5FA']
        return {
          grid: {
            left: '20',
            right: '30',
            bottom: '25',
            top: '20',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxisData,
            offset: 12,
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
            type: 'value',
            offset: 10.5,
            splitLine: {
              show: true,
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
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              shadowStyle: {
                opacity: 0
              }
            },
            formatter(prams) {
              return `${prams[1].name}：${prams[1].value}`
            }
          },
          series: [
            { // For shadow
              type: 'bar',
              itemStyle: {
                normal: {
                  barBorderRadius: 0,
                  color: 'rgba(0,0,0,0)'
                }
              },
              emphasis: {
                itemStyle: {
                  color: '#F5F6F9'
                }
              },
              barGap: '-100%',
              // barCategoryGap: '80%',
              barWidth: '20px',
              data: dataShadow,
              animation: false,
              zlevel: 11
            },
            {
              type: 'bar',
              data: seriesData,
              barWidth: '20px',
              zlevel: 12,
              itemStyle: {
                normal: {
                  barBorderRadius: 0,
                  // color: '#8DC6F6',
                  color: function(params) {
                    var num = color.length;
                    return color[params.dataIndex % num]
                  }
                  // color: new this.$echarts.graphic.LinearGradient(
                  //   0, 0, 0, 1,
                  //   [
                  //     {offset: 1, color: '#BE85FD'},
                  //     {offset: 0, color: '#A08FF6'}
                  //   ]
                  // )
                }
              }
            }
          ]
        }
      },
      createBar(xAxisData, seriesData1, seriesData2) {
        return {
          grid: {
            left: '20',
            right: '30',
            bottom: '25',
            top: '0',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: false,
            data: xAxisData,
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
            type: 'category',
            data: xAxisData,
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
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              shadowStyle: {
                opacity: 0
              }
            },
            formatter(prams) {
              return `${prams[1].name}：${prams[1].value}`
            }
          },
          series: [
            { // For shadow
              type: 'bar',
              data: seriesData1,
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
                  verticalAlign: 'middle',
                  color: '#333',
                  fontSize: '12px',
                }
              },
              barWidth: '10px',
              animation: false,
              zlevel: 11
            },
            {
              type: 'bar',
              data: seriesData2,
              barWidth: '10px',
              zlevel: 12,
              label: {
                normal: {
                  show: true,
                  position: 'right',
                  offset: [0, 2],
                  verticalAlign: 'middle',
                  color: '#333',
                  fontSize: '12px',
                }
              },
              itemStyle: {
                normal: {
                  barBorderRadius: 0,
                  color: '#59C6E8'
                  // color: new this.$echarts.graphic.LinearGradient(
                  //   0, 0, 0, 1,
                  //   [
                  //     {offset: 1, color: '#BE85FD'},
                  //     {offset: 0, color: '#A08FF6'}
                  //   ]
                  // )
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
