<template>
  <div class="pie-data">
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
        default: 'pie'
      }
    },
    data() {
      return {
        tabIndex: 0,
        data: [
          {name: '时令水果', value: 0},
          {name: '应季蔬菜', value: 0},
          {name: '肉蛋家禽', value: 0},
          {name: '海鲜冻品', value: 0},
          {name: '粮油百货', value: 0},
          {name: '酒饮冲调', value: 0},
          {name: '面包糕点', value: 0},
          {name: '网红零食', value: 0}
        ]
      }
    },
    mounted() {
      // this.drawPie(this.data)
    },
    methods: {
      setTab(num) {
        this.tabIndex = 0
      },
      drawPie(data) {
        let seriesData = data.length > 0 ? data : this.data
        let myChart = this.$echarts.init(document.getElementById(this.chartId))
        myChart.setOption(this.createPieData(seriesData))
        window.addEventListener('resize', function() {
          myChart.resize()
        })
      },
      createPieData(seriesData) {
        return {
          legend: {
            show: false,
            itemWidth: 8,
            itemHeight: 8,
            borderRadius: 0,
            bottom: 12,
            itemGap: 28,
            padding: [0, 25, 0, 25],
            textStyle: {
              color: '#333',
              fontSize: '12',
              fontFamily: 'PingFangSC-Regular'
            },
            data: seriesData
          },
          tooltip: {
            trigger: 'item',
            padding: [5, 10],
            formatter: '{b} : {c}'
          },
          color: function(params) {
            let min = 129
            let maxOpacity = 110
            min = min + 5*params.dataIndex
            maxOpacity = maxOpacity - 10*params.dataIndex
            if (maxOpacity <= 30) maxOpacity = 30
            if (min >= 254) min = 254
            return `rgba(87, ${min}, 235, ${maxOpacity})`
          },
          series: [
            {
              name: '',
              type: 'pie',
              radius: ['35%', '55%'],
              center: ['50%', '45%'],
              avoidLabelOverlap: true, // 防止标签覆盖
              minAngle: 10, // 最小扇区的最小值，0-360
              data: seriesData,
              label: {
                normal: {
                  textStyle: {
                    fontSize: 12,
                    color: '#333'
                  }
                }
              },
              labelLine: {
                normal: {
                  lineStyle: {
                    // color: '#235894'
                  }
                }
              },
              itemStyle: {
                normal: {
                  borderWidth: 1,
                  borderColor: '#ffffff'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '15',
                    fontWeight: 'normal'
                  }
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

  .pie-data
    width: 100%
    flex: 1
    display: flex
    flex-direction: column
  .data-content
    flex: 1
    #pieData
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
