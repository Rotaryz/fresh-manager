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
          x1: ["时令水果", "应季蔬菜", "肉蛋家禽", "海鲜冻品", "粮油百货", "酒饮冲调"],
          series: [0, 0, 0, 0, 0, 0],
          x2: ['利润品', '引流品', '粘性品', '爆款品', '其他']
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
      random(itemNumber, max) {
        return new Array(itemNumber).fill(1).map((item, index) => {
          return Math.ceil(Math.random() * (max))
        })
      },
      // 纵向柱状图
      drawBar(data, rate) {
        this.$nextTick(() => {
          let xAxisData = data.xAx.length > 0 ? data.xAx : this.data.x1
          let seriesData = data.series.length > 0 ? data.series : this.data.series
          let myChart = this.$echarts.init(document.getElementById(this.chartId))
          let that = this
          myChart.on('click', function (params) {
            that.$emit('clickChart', params.dataIndex)
          })
          let axisLabel = {
            formatter: '{value}' + (rate ? '%' : ''),
            color: '#999'
          }
          let color = ['#5681EA', '#5490F3', '#6EB0FF', '#7AB6F5', '#8DC6F6', '#94CFF8', '#9ED6F7', '#A7DFF8', '#AFE5FA']
          myChart.setOption(this.createBar1(xAxisData, seriesData, color, axisLabel))
          window.addEventListener('resize', function() {
            myChart.resize()
          })
        })
      },
      // 横向柱状图
      drawBar1(data) {
        let msg = {
          xAxisData: data.xAx.length ? data.xAx : this.data.x1,
          seriesData1: data.salesNum.length ? data.salesNum : this.data.series,
          seriesData2: data.purchaseNum.length ? data.purchaseNum : this.data.series,
          salesNumAll: data.salesNumAll,
          purchaseNumAll: data.purchaseNumAll
        }
        let myChart = this.$echarts.init(document.getElementById(this.chartId))
        let that = this
        myChart.on('click', function (params) {
          that.$emit('clickChart', params.dataIndex)
        })
        myChart.setOption(this.createBar2(msg))
        window.addEventListener('resize', function() {
          myChart.resize()
        })
      },
      // 纵向柱状图
      drawBar2(data) {
        this.$nextTick(() => {
          let xAxisData = data.xAx.length > 0 ? data.xAx : this.data.x2
          let seriesData3 = data.series.length > 0 ? data.series : this.data.series
          let myChart = this.$echarts.init(document.getElementById(this.chartId))
          // myChart.on('click', function (params) {
          //   console.log(params)
          // })
          let axisLabel = {
            formatter: '{value}',
            color: '#999'
          }
          let color = ['#5681EA', '#59C6E8', '#8859E8', '#F78536', '#D9D9D9']
          myChart.setOption(this.createBar1(xAxisData, seriesData3, color, axisLabel))
          window.addEventListener('resize', function() {
            myChart.resize()
          })
        })
      },
      // 纵向柱状图
      createBar1(xAxisData, seriesData, color, axisLabel) {
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
              align: 'center',
              formatter: function(value) {
                return value.slice(0, 4)
              }
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
            axisLabel,
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
      // 横向柱状图
      createBar2(series) {
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
            inverse: true,
            minInterval: 1,
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
              formatter: function(value) {
                return value.slice(0, 4)
              },
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
              return `${prams[0].name}<br />销售数：${prams[0].value}<br />采购数：${prams[1].value}`
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
                    if (series.salesNumAll === 0) {
                      return '0%'
                    }
                    return (data.value/series.salesNumAll).toFixed(2)+ '%'
                  },
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
              data: series.seriesData2,
              barWidth: '10px',
              zlevel: 12,
              label: {
                normal: {
                  show: true,
                  position: 'right',
                  formatter: function(data) {
                    if (series.purchaseNumAll === 0) {
                      return '0%'
                    }
                    return (data.value/series.purchaseNumAll).toFixed(2)+ '%'
                  },
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
