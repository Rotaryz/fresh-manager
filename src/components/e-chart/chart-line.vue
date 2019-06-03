<template>
  <div class="chart-line-con">
    <div class="title-bar">
      <div class="left-box">
        <p class="title">{{chartConfig.title}}</p>
        <ul v-if="chartConfig.tab" class="tab">
          <li v-for="(tab, tabIdx) in chartConfig.tab" :key="tabIdx" class="tab-item" @click="_switchTab(tab,tabIdx)">
            {{tab.name}}
          </li>
          <li :style="{'transform':'translateX('+tabIndex*84+'px)'}" class="tab-item tab-active">
            {{chartConfig.tab[tabIndex].name}}
          </li>
        </ul>
      </div>
      <a v-if="chartConfig.excel" :href="chartConfig.excel" target="_blank" class="excel-btn">导出Excel</a>
    </div>
    <div class="label-bar">
      <template v-for="(label, labelIdx) in chartConfig.label">
        <p v-if="!(chartConfig.tab && label.tabIdx !== tabIndex)" :key="labelIdx" :style="{'max-width':100/labelArrCount+'%', 'margin-right':labelArrCount===4?'2%':'5%'}" class="label">
          {{label.name}}
          <span class="label-val" :title="label.total">{{label.total}}<template v-if="label.unit">{{label.unit}}</template></span>
        </p>
      </template>
    </div>
    <div :id="chartId" class="chart-con"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'E_CHART_LINE'
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
        labelArrCount: 0
      }
    },
    beforeDestroy() {
      this.chartConfig = {}
      this.tabIndex = 0
      this.myChart = ''
    },
    methods: {
      _setChart(chartConfig, initChart = false, hasData = false) {
        let myChart = this.myChart
        if (initChart || !myChart) {
          let el = document.getElementById(chartConfig.id)
          this.$echarts.dispose(el)// 销毁之前的实例
          myChart = this.$echarts.init(el)// 初始化chart
          this.myChart = myChart
        }
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
            bottom: 0,
            icon: "rect", //  这个字段控制形状  类型包括 circle 圆形，rect 正方形，roundRect，triangle，diamond，pin，arrow，none
            itemWidth: 11,
            itemHeight: 11,
            itemGap: 40,
            borderWidth: 0
          },
          // canvas位置
          grid: {
            left: '38',
            right: '38',
            bottom: '52',
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
          if (chartConfig.tab && item.tabIdx !== this.tabIndex) {
            continue
          } else {
            labelArrCount++
          }
          legendData.push(item.name)// 设置底部每条折线的label
          series.push(this._setSeries(chartConfig, item, labelArrCount-1))// 设图表类型样式,及数据
          // if (item.yAxisIdx === 1 && chartConfig.showSecondY) {
          //   option.grid.right = '20'// 如果有两条y轴，调整canvas的右边间距
          // }
        }
        this.labelArrCount = labelArrCount
        if (labelArrCount === 1) {
          option.grid.left = '22'// 如果有y轴，调整canvas的左边间距
        }
        option.legend.data = legendData
        option.series = series
        option.xAxis = this._setXAxis(chartConfig.xAxleData)
        option.yAxis = this._setYAxis(chartConfig.showSecondY, labelArrCount === 1)// 只有一条数据的时候才显示Y轴
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
              width: 0.5,
              type: "doted"
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
              width: 0.5,
              type: "doted"
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

  .chart-line-con
    background: #ffffff
    height: 414px
    box-sizing: border-box
    position: relative

    &:after
      content: ""
      pointer-events: none // 解决iphone上的点击无效Bug
      display: block
      position: absolute
      left: 0
      top: 0
      transform-origin: 0 0
      border: 1px solid $border-color
      box-sizing border-box
      width 100%
      height 100%
      @media (-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2)
        width: 200%
        height: 200%
        transform: scale(.5) translateZ(0)
      @media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3)
        width: 300%
        height: 300%
        transform: scale(1 / 3) translateZ(0)

    .title-bar
      padding: 0 20px
      box-sizing: border-box
      height: 60px
      line-height: 60px
      color: $color-text-main
      font-size: $font-size-16
      font-family: $font-family-medium
      border-bottom-1px($border-color)
      layout(row)
      justify-content: space-between
      align-items: center

      .left-box
        layout(row)
        align-items: center

        .title
          margin-right: 30px
          font-family: $font-family-bold

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
      layout(row, '', nowrap)
      overflow: hidden
      color: $color-text-main
      font-family: $font-family-regular

      .label
        max-width: 25%
        margin-right: 5%
        font-size: $font-size-12
        no-wrap-plus(1)

        .label-val
          font-size: $font-size-16
          font-family: $font-family-din-bold

    .chart-con
      width: 100%
      height: 274px
</style>
