<template>
  <div class="quality-data">
    <!--<div class="tab">
      <div
        v-for="(item, index) in tabArr"
        :key="index"
        :class="['tab-item', 'hand', {'active': +tabIndex === index}, {'no-after': tabIndex-1 === index}]"
        @click="changeTab(item, index)"
      >
        <span class="num">{{qualityData.titleData[index] || 0}}</span>
        <span class="text">{{item}}{{index === 0 ? '(PV)' : ''}}</span>
      </div>
    </div>-->
    <div class="data-content">
      <div v-show="time !== 'today' && time !== 'yesterday'" id="quality"></div>
      <div v-show="time === 'today' || time === 'yesterday'" class="alone-data">
        <span class="num">{{qualityData.titleData[tabIndex] || 0}}</span>
        <span class="text">{{tabArr[tabIndex]}}{{tabIndex === 0 ? '(PV)' : ''}}</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {communityComputed} from '@state/helpers'
  const COMPONENT_NAME = 'QUALITY_DATA'
  const TAB_ARR = ['浏览数', '主力客户', '支付订单']

  export default {
    name: COMPONENT_NAME,
    props: {
      time: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        tabArr: TAB_ARR,
        color: ['#6081E3', '#8859E8', '#F7C136', '#6AE1FF'],
        tabIndex: 0,
        data: {
          x: ['04/03', '04/04', '04/05', '04/06', '04/07', '04/08', '04/09'],
          series: ['0', '0', '0', '0', '0', '0', '0', '0', '0']
        }
      }
    },
    computed: {
      ...communityComputed
    },
    watch: {
      qualityData(value, old) {
        if (this.time !== 'today' && this.time !== 'yesterday') {
          this.drawLine(value.data[this.tabIndex], this.tabArr[this.tabIndex])
        }
      }
    },
    methods: {
      setTab(num) {
        this.tabIndex = 0
      },
      changeTab(item, index) {
        this.tabIndex = index
        this.$emit('changeQuality', item)
        if (this.time !== 'today' && this.time !== 'yesterday') {
          this.drawLine(this.qualityData.data[index], this.tabArr[index])
        }
      },
      drawLine(data, name) {
        let xAxis = data.x.length > 0 ? data.x : this.data.x
        let series = data.rate.length > 0 ? data.rate : this.data.series
        let myChart = this.$echarts.init(document.getElementById('quality'))
        myChart.setOption({
          legend: {
            itemWidth: 14,
            itemHeight: 14,
            borderRadius: 0,
            bottom: 10,
            align: 'auto',
            data: []
          },
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
            offset: 12,
            data: xAxis,
            splitLine: {
              show: false,
              lineStyle: {
                color: '#F0F3F5',
                width: 0.5,
                type: 'doted'
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
          tooltip: {
            trigger: 'axis',
            formatter: '{a0}: {c0}',
            textStyle: {
              align: 'left'
            },
            axisPointer: {
              lineStyle: {
                color: '#ccc',
                width: 0.5
              }
            },
            padding: [5, 10, 5, 10]
          },
          yAxis: [
            {
              minInterval: 1,
              position: 'left',
              name: '',
              type: 'value',
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
                lineStyle: {
                  color: '#c4c4c4',
                  width: 0.5
                }
              }
            }
          ],
          series: [
            {
              name: name,
              data: series,
              type: 'line',
              smooth: false,
              hoverAnimation: true,
              symbolSize: 2,
              showSymbol: false,
              itemStyle: {
                normal: {
                  color: '#5681EA',
                  borderWidth: 1,
                  lineStyle: {
                    color: '#5681EA',
                    width: 2
                  }
                }
              }
            }
          ]
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .quality-data
    width: 100%
    flex: 1
    display: flex
    flex-direction: column
  .tab
    height: 60px
    background: #F5F7FA
    display: flex
    .tab-item
      flex: 1
      display: flex
      flex-direction: column
      justify-content: center
      align-items: center
      transition: all 0.3s
      position: relative
      color: $color-text-main
      border: 0.5px solid #E6EAED
      border-right: 0.5px solid transparent
      border-left: 0.5px solid transparent
      &:after
        content: ""
        position: absolute
        height: 27px
        width: 1px
        border-right: 0.5px solid #E6EAED
        right: 0
        col-center()
      &:before
        content: ""
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 3px
        background-color: transparent
        transition: all 0.3s
      .num
        font-family: $font-family-din-bold
        font-size: $font-size-20
        line-height: 20px
      .text
        font-family: $font-family-regular
        font-size: $font-size-12
        line-height: 12px
        margin-top: 5px
    .tab-item:last-child:after
      border-right: 0
    .active
      background: #FFF
      border-right: 0.5px solid #E6EAED
      border-left: 0.5px solid #E6EAED
      border-bottom: 0.5px solid transparent
      &:before
        background-color: $color-positive
      &:after
        border-right: 0.5px solid transparent
    .active:first-child
      border-left: 0.5px solid transparent
    .active:last-child
      border-right: 0.5px solid transparent
    .no-after:after
      border-right: 0.5px solid transparent
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
