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
          x: ["时令水果", "应季蔬菜", "肉蛋家禽", "海鲜冻品", "粮油百货", "酒饮冲调", "面包糕点", "网红零食", "粤式早点"],
          series: ["10", "20", "5", "40", "15", "14", "44", "34", "20"],
          x1: ["时令水果", "应季蔬菜", "肉蛋家禽", "海鲜冻品", "粮油百货", "酒饮冲调"],
          series1: ["10", "20", "5", "40", "15", "14"],
          series2: ["12", "18", "10", "50", "10", "20"],
          x2: ['利润品', '引流品', '粘性品', '爆款品', '其他'],
          series3: [20, 50, 30, 60, 10]
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
      // 纵向柱状图
      drawBar(data) {
        this.$nextTick(() => {
          let xAxisData = data.x.length > 0 ? data.x : this.data.x
          let seriesData = data.series.length > 0 ? data.series : this.data.series
          let myChart = this.$echarts.init(document.getElementById(this.chartId))
          myChart.on('click', function (params) {
            console.log(params)
          })
          let color = ['#5681EA', '#5490F3', '#6EB0FF', '#7AB6F5', '#8DC6F6', '#94CFF8', '#9ED6F7', '#A7DFF8', '#AFE5FA']
          myChart.setOption(this.createBar1(xAxisData, seriesData, color))
          window.addEventListener('resize', function() {
            myChart.resize()
          })
        })
      },
      // 横向柱状图
      drawBar1(data) {
        this.$nextTick(() => {
          let xAxisData = data.x.length > 0 ? data.x : this.data.x1
          let seriesData1 = data.series.length > 0 ? data.series : this.data.series1
          let seriesData2 = data.series.length > 0 ? data.series : this.data.series2
          let myChart = this.$echarts.init(document.getElementById(this.chartId))
          myChart.on('click', function (params) {
            console.log(params)
          })
          myChart.setOption(this.createBar2(xAxisData, seriesData1, seriesData2))
          window.addEventListener('resize', function() {
            myChart.resize()
          })
        })
      },
      drawBar2(data) {
        this.$nextTick(() => {
          let xAxisData = data.x.length > 0 ? data.x : this.data.x2
          let seriesData3 = data.series.length > 0 ? data.series : this.data.series3
          let myChart = this.$echarts.init(document.getElementById(this.chartId))
          myChart.on('click', function (params) {
            console.log(params)
          })
          let color = ['#5681EA', '#59C6E8', '#8859E8', '#F78536', '#D9D9D9']
          myChart.setOption(this.createBar1(xAxisData, seriesData3, color))
          window.addEventListener('resize', function() {
            myChart.resize()
          })
        })
      },
      createBar1(xAxisData, seriesData, color) {
        return {
          grid: {
            left: '40',
            right: '30',
            bottom: '30',
            top: '20',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxisData,
            offset: 15,
            nameGap: 20,
            splitLine: {
              show: false,
              lineStyle: {
                color: '#F0F3F5',
                width: 0.5
              }
            },
            axisLabel: {
              color: '#999',
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
              color: '#999'
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
            padding: [5, 10],
            axisPointer: {
              type: 'shadow',
              shadowStyle: {
                opacity: 0
              }
            },
            formatter(prams) {
              return `${prams[0].name}：${prams[0].value}`
            }
          },
          series: [
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
      createBar2(xAxisData, seriesData1, seriesData2) {
        return {
          grid: {
            left: '20',
            right: '30',
            bottom: '30',
            top: '0',
            containLabel: true
          },
          legend: {
            data: ['销售', '采购'],
            icon: "rect", //  这个字段控制形状  类型包括 circle 圆形，rect 正方形，roundRect，triangle，diamond，pin，arrow，none
            itemWidth: 11,
            itemHeight: 11,
            bottom: 10,
            textStyle: {
              color: '#333',
              fontFamily: 'PingFangSC-Regular'
            },
            left: 'center',
            itemGap: 60
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
              color: '#999'
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
            padding: [5, 10],
            axisPointer: {
              type: 'shadow',
              shadowStyle: {
                opacity: 0
              }
            },
            formatter(prams) {
              return `${prams[0].name}：${prams[0].value}<br />${prams[1].name}：${prams[1].value}`
            }
          },
          series: [
            { // For shadow
              type: 'bar',
              name: '销售',
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
                  color: '#999',
                  fontSize: '12',
                }
              },
              barWidth: '10px',
              animation: false,
              zlevel: 11
            },
            {
              type: 'bar',
              name: '采购',
              data: seriesData2,
              barWidth: '10px',
              zlevel: 12,
              label: {
                normal: {
                  show: true,
                  position: 'right',
                  offset: [0, 2],
                  verticalAlign: 'middle',
                  color: '#999',
                  fontSize: '12',
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
      },
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
