<template>
  <div class="chart">
    <div :id="chartId" class="chart-con"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'E_CHART_FUNNEL'

  export default {
    name: COMPONENT_NAME,
    props: {
      chartId: {
        type: String,
        default: ''
      },
      chartData: {
        type: Array,
        default: () => {
          return [
            {
              value: 2,
              name: '优惠券总数'
            },
            {
              value: 1,
              name: '已发放'
            },
            {
              value: 1,
              name: '已使用'
            }
          ]
        }
      }
    },
    data() {
      return {
        myChart: ''
      }
    },
    created() {
      // this._setChart()
    },
    beforeDestroy() {
      this.myChart = ''
      window.removeEventListener('resize', this.resize) // 取消监听
    },
    methods: {
      resize() {
        this.myChart && this.myChart.resize()
      },
      _setChart(data) {
        this.$nextTick(() => {
          // let xAxisData = data.xAx.length > 0 ? data.xAx : []
          // let seriesData = data.series.length > 0 ? data.series : []

          let el = document.getElementById(this.chartId)
          this.$echarts.dispose(el) // 销毁之前的实例
          let myChart = this.$echarts.init(el) // 初始化chart

          this.myChart = myChart
          window.addEventListener('resize',  this.resize) // 加监听

          let options = this.createFunnel()
          myChart.setOption(options)
        })
      },
      createFunnel() {
        let colors = ['#FFC582','#C79FD5','#9FAAD5']
        return {
          color: colors,
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              label: {
                backgroundColor: "#6a7985"
              },
              lineStyle: {
                color: "#9eb2cb"
              }
            }
          },
          legend: {
            show: false,
            top: "bottom",
            left: "2%",
            textStyle: {
              color: "#000"
            },
            itemHeight: 10,
            data:  ['优惠券总数', '已发放', '已使用']
          },
          grid: {
            top: 24,
            left: "2%",
            right: 20,
            bottom: 30,
            containLabel: true,
            borderWidth: 0.5
          },
          series: [
            {
              top: 40,
              name: '',
              type: 'funnel',
              left: '10%',
              width: '80%',
              gap: 10,
              minSize: 114,
              maxSize: 550,
              label: {
                normal: {
                  show: false,
                  color: '#353535',
                  position: 'right',
                  fontSize: 14
                }
              },
              emphasis: {
                label: {
                  show: false,
                  fontSize: 14
                }
              },
              labelLine: {
                normal: {
                  show: false,
                  length: 60,
                  position: 'left',
                  lineStyle: {
                    width: 1

                  }
                }
              },
              itemStyle: {
                normal: {
                  show: false
                }
              },
              data: this.chartData
            },
            {
              name: '',
              type: 'funnel',
              top: 40,
              gap: 10,
              label: this.label(),
              labelLine: {
                normal: {
                }
              },
              emphasis: {
              },
              itemStyle: {
                normal: {
                  color: 'transparent',
                  borderWidth:0,
                  opacity: 0
                }
              },
              data: this.chartData
            }
          ]
        }
      },
      label() {
        let dataColor = [
          {color:'#5F3300', data: 'oneData', title: 'oneTitle'},
          {color: '#3c0051', data: 'twoData', title: 'twoTitle'},
          {color: '#00125A', data: 'threeData', title: 'threeTitle'}
        ]
        let rich = {}
        dataColor.map(item => {
          rich[item.title] = {
            fontSize: 14,
            color: item.color,
            lineHeight: 20,
            fontFamily: 'PingFangSC-Regular'
          }
          rich[item.data] = {
            fontSize: 24,
            color: item.color,
            lineHeight: 30,
            fontFamily: 'PingFangSC-Medium'
          }
        })
        return {
          normal: {
            position: 'inside',
            formatter: function (data) {
              return ['{' + dataColor[data.dataIndex].title + '|' + data.name + '}', '{' + dataColor[data.dataIndex].data + '|' + data.value + '}'].join('\n')
            },
            textStyle: {
              color: '#FFF'
            },
            rich,
          }
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .chart
    width: 100%
    height: 100%
  .chart-con
    background: #ffffff
    width: 100%
    height: 100%
</style>
