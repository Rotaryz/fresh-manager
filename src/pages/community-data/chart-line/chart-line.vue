<template>
  <div class="data-chart-line">
    <div :id="chartId" class="chart-con"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'CHART_LINE'
  const CHART_COLOR = {
    line: ['#6081E3', '#8859E8', '#F7C136', '#6AE1FF'],
    axle: '#F0F3F5', label: '#999999'
  }

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
        tabIndex: 0,
        myChart: '',
        labelArrCount: 0,
        data: {
          dataArr: [
            {name: '潜在客户', data: [0, 0, 0, 0, 0, 0]},
            {name: '新客户', data: [0, 0, 0, 0, 0, 0]}
          ],
          xAxleData: ['5/6', '6/6', '7/6', '8/6', '9/6', '10/6']
        }
      }
    },
    beforeDestroy() {
      this.chartConfig = {}
      this.tabIndex = 0
      this.myChart = ''
      window.removeEventListener('resize', this.resize) // 取消监听
    },
    methods: {
      resize() {
        this.myChart && this.myChart.resize()
      },
      _setChart(chartConfig, initChart = false, hasData = false) {
        window.removeEventListener('resize', this.resize)
        let myChart = this.myChart
        if (initChart || !myChart) {
          let el = document.getElementById(this.chartId)
          this.$echarts.dispose(el)// 销毁之前的实例
          myChart = this.$echarts.init(el)// 初始化chart
          this.myChart = myChart
        }
        window.addEventListener('resize',  this.resize) // 加监听
        this.chartConfig = chartConfig
        if (!hasData) return false// 没有数据不设置option
        let option = this._setOption(chartConfig)
        myChart.setOption(option)
        return myChart
      },
      _setOption(chartConfig) {
        let option = {
          // 浮窗
          tooltip: {
            trigger: 'axis',
            // formatter: '{a0}: {c0}',
            formatter: function (params) {
              let result = `<p style="color:#ffffff;font-size:12px">${params[0].axisValue}</p>`;
              params.forEach(function (item) {
                let hasUnit = item.seriesName.includes('率')?'%':''
                result += `<p><span style="display:inline-block;margin-right:5px;margin-bottom:-1px;width:10px;height:10px;border-radius:1px;background-color:${item.color}"></span><span style="color:#ffffff;font-size:12px">${item.seriesName}: ${item.value}${hasUnit}</span></p>`;
              });
              return result;
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
          // 底部每条折线的label，控制显示隐藏
          legend: {
            data: [],
            bottom: 15,
            icon: "rect", //  这个字段控制形状  类型包括 circle 圆形，rect 正方形，roundRect，triangle，diamond，pin，arrow，none
            itemWidth: 11,
            itemHeight: 11,
            itemGap: 40,
            borderWidth: 0
          },
          // canvas位置
          grid: {
            left: '20',
            right: '38',
            bottom: '62',
            top: '20',
            containLabel: true
          },
          // x轴
          xAxis: [],
          // y轴
          yAxis: [],
          // 图表类型样式,及数据
          series: []
        }
        let legendData = []
        let series = []
        // 遍历label为每条折线图设置series
        let labelArrCount = 0// 代表实际的index，用于设置参照哪个y轴和颜色
        for (let i = 0; i < chartConfig.dataArr.length; i++) {
          let item = chartConfig.dataArr[i]
          legendData.push(item.name)// 设置底部每条折线的label
          series.push(this._setSeries(chartConfig, item, i))
          // 设图表类型样式,及数据
        }
        this.labelArrCount = labelArrCount
        option.legend.data = legendData
        option.series = series
        option.xAxis = this._setXAxis(chartConfig.xAxleData)
        option.yAxis = this._setYAxis(chartConfig.showSecondY, true)// 不显示Y轴
        return option
      },
      _setSeries(chartConfig, item, i) {
        let seriesConfig = {
          name: item.name,
          type: 'line',
          data: item.data,// 每条折线的数据
          // yAxisIndex: item.yAxisIdx||0,// 根据i设置参照哪个y轴，2、3参照第二条y轴
          yAxisIndex: 0,
          smooth: false,
          hoverAnimation: true,
          symbolSize: 5,
          showSymbol: item.data.length <= 15,// 数据量大于15默认不显示圈圈
          itemStyle: {
            normal: {
              color: CHART_COLOR.line[i],
              borderWidth: 1,
              lineStyle: {
                color: CHART_COLOR.line[i],
                width: 2
              }
            }
          }
        }
        // 低于两条或者设置了lineShadow的设置区域阴影
        if (chartConfig.dataArr.length <= 2 || chartConfig.lineShadow) {
          let color = ['rgba(96,129,227,0.28)', 'rgba(136,89,232,0.28)', 'rgba(247,193,54,0.28)', 'rgba(106,225,255,0.28)']
          seriesConfig.areaStyle = {
            color: {
              type: 'linear',
              x: 0, x2: 0, y: 0, y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: color[i]
                },
                {
                  offset: 1,
                  color: 'rgba(250,250,250,0)'
                }
              ],
              globalCoord: false
            }
          }
        }
        return seriesConfig
      },
      _setXAxis(data) {
        // 刻度线：splitLine，坐标刻度：axisTick，坐标值：axisLabel，坐标轴：axisLine
        return {
          type: 'category',
          boundaryGap: false,
          data: data,
          offset: 10,
          max: 'dataMax',
          min: 'dataMin',
          splitLine: {
            show: true,
            lineStyle: {
              color: CHART_COLOR.axle,
              width: 0.5
            }
          },
          axisLabel: {
            color: CHART_COLOR.label,
            fontSize: 12,
            align: 'center',
            showMinLabel: true,
            showMaxLabel: true
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: CHART_COLOR.axle,
              width: 0.5
            }
          }
        }
      },
      _setYAxis(showSecondY = false, show = true) {
        // 刻度线：splitLine，坐标刻度：axisTick，坐标值：axisLabel，坐标轴：axisLine
        // let length = showSecondY ? 2 : 1
        let yAxis = [{
          show: show,
          minInterval: 1,
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              color: CHART_COLOR.axle,
              width: 0.5
            }
          },
          axisTick: {
            show: false,
            lineStyle: {
              color: CHART_COLOR.axle,
              width: 0.5
            }
          },
          axisLabel: {
            show: show,
            formatter: '{value}',
            color: CHART_COLOR.label
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: CHART_COLOR.axle,
              width: 0.5
            }
          }
        }]
        return yAxis
      },
      _setDataZoom() {
        // 设置缩放区域
        return {
          end: 30,// 数据窗口范围的结束百分比
          type: 'slider',
          bottom: '26px',
          show: true,
          height: 8,
          xAxisIndex: [0],
          borderColor: "rgba(250,250,250,0)",
          fillerColor: CHART_COLOR.label,
          borderRadius: 4,
          showDataShadow: false,// 是否显示数据阴影 默认auto
          showDetail: false,// 即拖拽时候是否显示详细数值信息 默认true
          realtime: true, // 是否实时更新
        }
      },
      _switchTab(tab, tabIdx) {
        if (this.tabIndex === tabIdx) return
        this.tabIndex = tabIdx
        this._setChart(this.chartConfig, true, true)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  $border-color = #E6EAED

  .data-chart-line
    width: 100%
    flex: 1
    .chart-con
      width: 100%
      height: 100%
</style>
