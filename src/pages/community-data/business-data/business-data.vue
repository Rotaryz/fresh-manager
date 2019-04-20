<template>
  <div class="quality-data">
    <div class="tab">
      <div
        v-for="(item, index) in tabArr"
        :key="index"
        :class="['tab-item', {'active': +tabIndex === index}, {'no-after': tabIndex-1 === index}]"
        @click="changeTab(item, index)"
      >
        <img v-if="item === 'equal'" src="./icon-equal@2x.png" alt="" class="tag">
        <img v-else-if="item === 'multiply'" src="./icon-ride@2x.png" alt="" class="tag">
        <div v-else class="content hand">
          <span class="num">{{businessData.titleData[arr[index]] || 0}}</span>
          <span class="text">{{item}}</span>
        </div>
      </div>
    </div>
    <div class="data-content">
      <div v-show="time !== 'today' && time !== 'yesterday'" id="business"></div>
      <div v-show="time === 'today' || time === 'yesterday'" class="alone-data">
        <span class="num">{{businessData.data[tabIndex] && businessData.data[tabIndex].rate[0] || 0}}</span>
        <span class="text">{{tabArr[tabIndex]}}</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {communityComputed} from '@state/helpers'
  const COMPONENT_NAME = 'BUSINESS_DATA'
  const TAB_ARR = ['营收金额', 'equal', '主力客户', 'multiply', '复购数', 'multiply', '客单价']
  export default{
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
        tabIndex: 0,
        rate: ["10", "20", "30", "40", "50", "60", "70", "80", "90", "100"],
        data: {
          x: ["04/03", "04/04", "04/05", "04/06", "04/07", "04/08", "04/09"],
          series: ["0", "0", "0", "0", "0", "0", "0", "0", "0"]
        },
        arr : [0, 0, 1, 0, 2, 0, 3]
      }
    },
    computed: {
      ...communityComputed
    },
    watch: {
      businessData(value, old) {
        if (this.time !== 'today' && this.time !== 'yesterday') {
          this.drawLine(value.data[this.arr[this.tabIndex]], this.tabArr[this.tabIndex])
        }
      }
    },
    methods: {
      setTab(num) {
        this.tabIndex = 0
      },
      changeTab(item, index) {
        if (+index === 1 || +index === 3 || +index === 5) return
        this.tabIndex = index
        this.$emit('changeBusiness', item)
        if (this.time !== 'today' && this.time !== 'yesterday') {
          this.drawLine(this.businessData.data[this.arr[index]], this.tabArr[index])
        }
      },
      drawLine(data, name) {
        let xAxis = (data.x && data.x.length) > 0 ? data.x : this.data.x
        let series = data.rate.length > 0 ? data.rate : this.data.series
        let myChart = this.$echarts.init(document.getElementById('business'))
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
            right: '20',
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
                type: "doted"
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
              hoverAnimation: true,
              symbolSize: 2,
              showSymbol: false,
              smooth: false,
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
      border: 0.5px solid #E6EAED
      border-right: 0.5px solid transparent
      border-left: 0.5px solid transparent
      &:before
        content: ""
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 2px
        background-color: transparent
        transition: all 0.3s
      .tag
        width: 14px
        height: 14px
      .num
        font-family: $font-family-din-bold
        font-size: $font-size-20
        color: $color-text-main
        line-height: 20px
      .text
        font-family: $font-family-regular
        font-size: $font-size-12
        color: $color-text-main
        line-height: 12px
        margin-top: 5px
      .content
        display: flex
        flex-direction: column
        justify-content: center
        align-items: center
    .tab-item:nth-child(2n)
      flex: 0.5
    .tab-item:last-child:after
      border-right: 0
    .active
      background: #FFF
      border-right: 0.5px solid #E6EAED
      border-left: 0.5px solid #E6EAED
      border-bottom: 0.5px solid transparent
      &:before
        background-color: $color-positive
    .active:first-child
      border-left: 0.5px solid transparent
    .active:last-child
      border-right: 0.5px solid transparent
  .data-content
    flex: 1
    #business
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
