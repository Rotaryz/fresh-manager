<template>
  <div class="bar-data">
    <div class="data-content">
      <div id="data" @click="clickChart"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'BAR_DATA'

  export default{
    name: COMPONENT_NAME,
    props: {
    },
    data() {
      return {
        tabIndex: 0,
        data: {
          x: ["时令水果", "应季蔬菜", "肉蛋家禽", "海鲜冻品", "粮油百货", "酒饮冲调", "面包糕点", "网红零食", "粤式早点"],
          series: ["10", "20", "5", "40", "15", "14", "44", "34", "20"]
        }
      }
    },
    computed: {
    },
    watch: {
    },
    mounted() {
      this.drawBar(this.data, '退货数')
    },
    methods: {
      clickChart() {
        console.log(111)
      },
      setTab(num) {
        this.tabIndex = 0
      },
      changeTab(data, name) {
        this.drawBar(data, name)
      },
      drawBar(data, name) {
        let xAxisData = data.x.length > 0 ? data.x : this.data.x
        let seriesData = data.series.length > 0 ? data.series : this.data.series
        let myChart = this.$echarts.init(document.getElementById('data'))
        myChart.setOption(this.createBarData(xAxisData, seriesData))
      },
      createBarData(xAxisData, seriesData) {
        let dataShadow = new Array(9).fill(1000)
        dataShadow = dataShadow.map((item, index) => {
          return Math.max(seriesData[0], 1)
        })
        return {
          grid: {
            left: '20',
            right: '30',
            bottom: '25',
            top: '35',
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
              show: false,
              lineStyle: {
                color: '#F0F3F5',
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
                  barBorderRadius: 30,
                  color: '#F5F6F9'
                }
              },
              emphasis: {
                itemStyle: {
                  color: '#F5F6F9'
                }
              },
              barGap: '-100%',
              // barCategoryGap: '80%',
              barWidth: '12px',
              data: dataShadow,
              animation: false,
              zlevel: 11
            },
            {
              type: 'bar',
              data: seriesData,
              barWidth: '12px',
              zlevel: 12,
              itemStyle: {
                normal: {
                  barBorderRadius: 30,
                  color: new this.$echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      {offset: 1, color: '#BE85FD'},
                      {offset: 0, color: '#A08FF6'}
                    ]
                  )
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
    #data
      width: 100%
      height: 100%
    .alone-data
      width: 100%
      height: 100%
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center
      color: $color-text-main
      .num
        font-size: 60px
        line-height: 60px
        font-family: $font-family-din-bold
      .text
        margin-top: 10px
        font-size: $font-size-14
        font-family: $font-family-regular
</style>
