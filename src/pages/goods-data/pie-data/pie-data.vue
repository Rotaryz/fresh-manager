<template>
  <div class="pie-data">
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
        default: 'pie'
      }
    },
    data() {
      return {
        tabIndex: 0,
        data: {
          x: ["时令水果", "应季蔬菜", "肉蛋家禽", "海鲜冻品", "粮油百货", "酒饮冲调", "面包糕点", "网红零食", "粤式早点"],
          series: [
            {name: '时令水果', value: 10},
            {name: '应季蔬菜', value: 20},
            {name: '肉蛋家禽', value: 5},
            {name: '海鲜冻品', value: 40},
            {name: '粮油百货', value: 15},
            {name: '酒饮冲调', value: 14},
            {name: '面包糕点', value: 44},
            {name: '网红零食', value: 34},
            {name: '粤式早点', value: 20}
          ]
        }
      }
    },
    computed: {
    },
    watch: {
    },
    mounted() {
      this.drawPie(this.data)
    },
    methods: {
      clickChart(e) {
        console.log(e, 111)
      },
      setTab(num) {
        this.tabIndex = 0
      },
      changeTab(data) {
        this.drawPie(data)
      },
      drawPie(data) {
        let seriesData = data.series.length > 0 ? data.series : this.data.series
        let myChart = this.$echarts.init(document.getElementById(this.chartId))
        myChart.setOption(this.createPieData(seriesData))
      },
      createPieData(seriesData) {
        const colorObj = ['#5681EA', '#5490F3', '#6EB0FF', '#7AB6F5', '#8DC6F6', '#94CFF8', '#9ED6F7', '#A7DFF8', '#AFE5FA']
        let colorArr = seriesData.map((item, index) => {
          return colorObj[index]
        })
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
            formatter: '{b} : {c} ({d}%)'
          },
          color: colorArr,
          series: [
            {
              name: '',
              type: 'pie',
              radius: ['30%', '50%'],
              center: ['50%', '45%'],
              avoidLabelOverlap: false,
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
                  borderWidth: 3,
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
