<template>
  <div class="new-data">
    <div class="data-header-box">
      <div class="data-header-left">
        <div class="header-left-box">
          <div class="identification survey-box">
            <div class="identification-page">
              <img src="./icon-real_time@2x.png" class="identification-icon">
              <p class="identification-name">实时总览</p>
            </div>
            <div class="function-btn">
              <base-option-box :infoTab="2" :arrTitle="rankTime" @checkTime="_orderMore"></base-option-box>
            </div>
          </div>
          <div class="real-time-box">
            <div v-for="(item, index) in realData" :key="index" class="real-list-box">
              <div class="real-list-box-icon" :class="item.imgUrl"></div>
              <div class="real-text-box">
                <div class="real-text-top">{{item.title}}</div>
                <div class="real-text-bottom">
                  <div class="real-text-number">{{item.curr_total}}</div>
                  <div class="real-text-sale">{{item.subTitle}} {{item.total}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="data-header-right">
        <div class="base-box">
          <div class="identification survey-box">
            <div class="identification-page">
              <img src="./icon-basics@2x.png" class="identification-icon">
              <p class="identification-name">基础功能</p>
            </div>
          </div>
          <div class="base-function-box">
            <div v-for="(item, index) in baseList" :key="index" class="base-list-item" @click="jumpBase(item)">
              <div class="base-item-title">{{item.title}}</div>
              <div class="base-number-box">
                <div class="number-left">{{item.number}}</div>
                <div class="number-right"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="data-middle-box">
      <div class="data-middle-left">
        <div class="middle-small-left">
          <div class="data-list">
            <div class="identification survey-box">
              <div class="identification-page">
                <img src="./icon-7day@2x.png" class="identification-icon">
                <p class="identification-name">7日趋势</p>
              </div>
              <div class="function-btn">
                <base-option-box :infoTab="0" :arrTitle="chartTime" @checkTime="_echartMore"></base-option-box>
              </div>
            </div>
            <div class="trend-box">
              <div id="trend"></div>
            </div>
          </div>
        </div>
        <div class="middle-small-right">
          <div class="goods-rank">
            <div class="identification survey-box">
              <div class="identification-page">
                <img src="./icon-ranking@2x.png" class="identification-icon">
                <p class="identification-name">商品排行</p>
              </div>
              <div class="function-btn">
                <base-option-box :infoTab="2" :arrTitle="rankTime" @checkTime="_shopMore"></base-option-box>
                <a class="educe-btn" :href="shopDownUrl" target="_blank">导出</a>
              </div>
            </div>
            <div class="big-list">
              <div class="list-header list-box goods-list">
                <div v-for="(item,index) in rankList" :key="index" class="list-item">{{item}}</div>
              </div>
              <div class="list">
                <div v-for="(item, index) in goodsList" :key="index" class="list-content list-box goods-list">
                  <div class="list-item">
                    <img :src="item.image_url" class="data-list-img">
                  </div>
                  <div class="list-item">{{item.goods_name}}</div>
                  <div class="list-item">{{item.sale_count_sum}}</div>
                  <div class="list-item">￥{{item.sale_total_sum}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="data-middle-right">
        <div class="community-rank">
          <div class="identification survey-box">
            <div class="identification-page">
              <img src="./icon-ranking@2x.png" class="identification-icon">
              <p class="identification-name">社区排行</p>
            </div>
            <div class="function-btn">
              <base-option-box :infoTab="2" :arrTitle="rankTime" @checkTime="_managerMore"></base-option-box>
              <a class="educe-btn" :href="downUrl" target="_blank">导出</a>
            </div>
          </div>
          <div class="big-list">
            <div class="list-header list-box community-list">
              <div v-for="(item,index) in communityList" :key="index" class="list-item">{{item}}</div>
            </div>
            <div class="list">
              <div v-for="(item,index) in managerList" :key="index" class="list-content list-box community-list">
                <div class="list-item">{{item.social_name}}</div>
                <div class="list-item">{{item.sale_total_sum}}</div>
                <div class="list-item">{{item.order_count_sum}}</div>
                <div class="list-item">{{item.commission_total_sum}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="data-bottom-box">
      <div class="identification survey-box">
        <div class="identification-page">
          <img src="./icon-backlog@2x.png" class="identification-icon">
          <p class="identification-name">待处理事项</p>
        </div>
      </div>
      <div class="dispose-matter-box">
        <div v-for="(item, index) in disposeList" :key="index" class="dispose-list-box">
          <div class="dispose-top-item hand" @click="jumpDispose(item)">
            <div class="dispose-text">{{item.text}}</div>
            <div v-if="item.number !== 0 && shopShow && srmShow" class="dispose-number">{{item.number}}</div>
            <img v-if="item.number === 0 && shopShow && srmShow" src="./icon-complete@2x.png" alt="" class="dispose-img">
          </div>
          <div class="dispose-name">{{item.subText}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {deliveryMethods} from '@state/helpers'

  import API from '@api'

  const PAGE_NAME = 'NEW_DATA'
  const TITLE = '数据'
  const RANKLIST = ['图片', '商品名称', '销售数量', '销售额']
  const COMMUNITYLIST = ['社区', '销售额', '支付订单数', '佣金收益']
  const REALDATA = [{imgUrl: '', title: '销售额', subTitle: '总销售额:', key: 'order', curr_total: 0, total: 0}, {imgUrl: 'subscriber', title: '访客数', subTitle: '总访客数:', key: 'visitor', curr_total: 0, total: 0}, {imgUrl: 'wallet', title: '支付转化率', subTitle: '平均支付转化率:', key: 'pay_rate', curr_total: 0, total: 0}, {imgUrl: 'subscriber', title: '买家数', subTitle: '总买家数:', key: 'pay_customer', curr_total: 0, total: 0}, {imgUrl: '', title: '客单价', subTitle: '平均客单价:', key: 'customer_price', curr_total: 0, total: 0}, {imgUrl: 'card', title: '复购率', subTitle: '平均复购率:', key: 'repeat_consume_rate', curr_total: 0, total: 0}]
  const BASELIST = [{title: '上架商品', key: 'goods_count', number: 0, url: '/home/product-list'}, {title: '进行中活动', key: 'activity_count', number: 0, url: '/home/flash-sale'}, {title: '团长', key: 'shop_manage_count', number: 0, url: '/home/leader-list'}, {title: '供应商', key: 'supplier_count', number: 0, url: '/home/supplier'}, {title: '采购员', key: 'purchase_user_count', number: 0, url: '/home/buyer'}, {title: '司机', key: 'driver_count', number: 0, url: '/home/dispatching-management'}]
  const DISPOSELIST = [{text: '发', subText: '待发布采购任务', key: 'publish_task_count', number: 0, url: '/home/procurement-task?status=1&timeNull=1'}, {text: '采', subText: '待采购任务', key: 'purchase_task_count', number: 0, url: '/home/procurement-task?status=2&timeNull=1'}, {text: '入', subText: '待入库任务', key: 'entry_order_count', number: 0, url: '/home/product-enter?status=0&timeNull=1'}, {text: '出', subText: '待出库任务', key: 'out_order_count', number: 0, url: '/home/product-out?status=0&timeNull=1'}, {text: '配', subText: '待配送任务', key: 'delivery_count', number: 0, url: '/home/distribution-task?status=1&timeNull=1'}, {text: '运', subText: '待售后订单', key: 'after_sale_count', number: 0, url: '/home/returns-management?status=0'}, {text: '财', subText: '待审核提现', key: 'withdraw_count', number: 0, url: '/home/leader-withdrawal?status=0'}]
  const RANKTIME = [{title: '今天', status: 'today'}, {title: '昨天', status: 'yesterday'}, {title: '7天', status: 'week'}, {title: '30天', status: 'month'}]
  const CHARTTIME = [{title: '销售额', status: '1'}, {title: '访客数', status: '2'}, {title: '买家数', status: '3'}, {title: '客单价', status: '4'}]
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        rankList: RANKLIST,
        communityList: COMMUNITYLIST,
        realData: REALDATA,
        baseList: BASELIST,
        disposeList: DISPOSELIST,
        shopShow: false,
        srmShow: false,
        rankTime: RANKTIME,
        chartTime: CHARTTIME,
        goodsList: [],
        managerList: [],
        time: 'week',
        shopTime: 'week',
        downUrl: '',
        shopDownUrl: ''
      }
    },
    mounted() {
      this.getSurveyTrade('', '', 'week', true)
      this.getScmBaseData()
      this.getShopBaseData()
      this.getScmTaskData()
      this.getShopTaskData()
      this.getEchartData()
      this.getGoodsRank('week', false)
      this.getManagerRank('week', false)
      this._getUrl()
      this._getShopUrl()
    },
    methods: {
      ...deliveryMethods,
      // 实时总览
      _orderMore(value) {
        if (typeof value === 'string') {
          this.getSurveyTrade('', '', value, true)
          return
        }
        this.getSurveyTrade(value[0], value[1], '', true)
      },
      getSurveyTrade(startTime, endTime, time, loading) {
        API.Data.tradeData({start_time: startTime, end_time: endTime, time: time}, loading).then((res) => {
          if (loading) {
            this.$loading.hide()
          }
          if (res.error === this.$ERR_OK) {
            for (let key in res.data) {
              let index = this.realData.findIndex((item) => item.key === key)
              this.realData[index].curr_total = res.data[key].curr_total
              this.realData[index].total = res.data[key].total
            }
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      // 基础功能
      getScmBaseData() {
        API.Data.getBaseData().then((res) => {
          if (res.error === this.$ERR_OK) {
            for (let key in res.data) {
              let index = this.baseList.findIndex((item) => item.key === key)
              this.baseList[index].number = res.data[key]
            }
          } else {
            this.$toast(res.message)
          }
        })
      },
      getShopBaseData() {
        API.Data.getStatisticsBaseData().then((res) => {
          if (res.error === this.$ERR_OK) {
            for (let key in res.data) {
              let index = this.baseList.findIndex((item) => item.key === key)
              this.baseList[index].number = res.data[key]
            }
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      jumpBase(item) {
        if (item.title === '司机') {
          this.setTabIndex(1)
        }
        this.$router.push(item.url)
      },
      //  7日趋势
      getEchartData(type = 1, loading = false) {
        API.Data.echartData({data: 7, type: type}, loading).then((res) => {
          if (loading) {
            this.$loading.hide()
          }
          if (res.error === this.$ERR_OK) {
            this.drawEcharLine(res.data)
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      drawEcharLine(data) {
        let xAxis = data.x
        let yAxis = data.y
        let title = data.title
        let myChart = this.$echarts.init(document.getElementById('trend'))
        myChart.setOption({
          grid: {
            top: '45',
            left: '25',
            right: '20',
            bottom: '22',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxis,
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
              lineStyle: {
                color: '#ccc',
                width: 0.5
              }
            },
            axisLine: {
              lineStyle: {
                color: '#ccc',
                width: 0.5
              }
            }
          },
          tooltip: {
            trigger: 'axis',
            textStyle: {
              align: 'left'
            },
            axisPointer: {
              lineStyle: {
                color: '#ccc',
                width: 0.5
              }
            },
            padding: [10, 50, 10, 20]
          },
          yAxis: {
            minInterval: 1,
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                color: '#EFEFEF',
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
              lineStyle: {
                color: '#c4c4c4',
                width: 0.5
              }
            }
          },
          series: [
            {
              name: title,
              data: yAxis,
              type: 'line',
              smooth: true,
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  x2: 0,
                  y: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(242,242,255,1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(255,255,255,1)'
                    }
                  ],
                  globalCoord: false
                }
              },
              itemStyle: {
                normal: {
                  color: 'rgba(130,131,255,1)',
                  borderWidth: 1,
                  lineStyle: {
                    color: 'rgba(130,131,255,1)',
                    width: 3
                  }
                }
              }
            }
          ]
        })
        myChart.resize()
      },
      _echartMore(value) {
        this.getEchartData(value, true)
      },
      // 商品排行
      getGoodsRank(time, loading) {
        API.Data.goodsData({time: time, start_time: '', end_time: ''}, loading).then((res) => {
          if (loading) {
            this.$loading.hide()
          }
          if (res.error === this.$ERR_OK) {
            this.goodsList = res.data
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      _shopMore(value) {
        this.shopTime = value
        this._getShopUrl()
        this.getGoodsRank(value, true)
      },
      _getShopUrl() {
        let currentId = this.getCurrentId()
        let token = this.$storage.get('auth.currentUser', '')
        let params = `access_token=${token.access_token}&start_time=&end_time=&time=${this.shopTime}`
        this.shopDownUrl =
          process.env.VUE_APP_API +
          `/social-shopping/api/backend/statistics-goods-data-export?${params}&current_corp=${currentId}`
      },
      // 社区排行
      getManagerRank(time, loading) {
        API.Data.managerData({time: time, start_time: '', end_time: ''}, loading).then((res) => {
          if (loading) {
            this.$loading.hide()
          }
          if (res.error === this.$ERR_OK) {
            this.managerList = res.data
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      _managerMore(value) {
        this.time = value
        this._getUrl()
        this.getManagerRank(value, true)
      },
      _getUrl() {
        let currentId = this.getCurrentId()
        let token = this.$storage.get('auth.currentUser', '')
        let params = `access_token=${token.access_token}&start_time=&end_time=&time=${this.time}`
        this.downUrl =
          process.env.VUE_APP_API +
          `/social-shopping/api/backend/statistics-manager-data-export?${params}&current_corp=${currentId}`
      },
      // 待处理事项
      getScmTaskData() {
        API.Data.getTaskData().then((res) => {
          if (res.error === this.$ERR_OK) {
            this.srmShow = true
            for (let key in res.data) {
              let index = this.disposeList.findIndex((item) => item.key === key)
              this.disposeList[index].number = res.data[key]
            }
          } else {
            this.$toast(res.message)
          }
        })
      },
      getShopTaskData() {
        API.Data.getStatisticsTaskData().then((res) => {
          if (res.error === this.$ERR_OK) {
            this.shopShow = true
            for (let key in res.data) {
              let index = this.disposeList.findIndex((item) => item.key === key)
              this.disposeList[index].number = res.data[key]
            }
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      jumpDispose(item) {
        this.$router.push(item.url)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .new-data
    overflow: hidden
    flex: 1
    display: flex
    box-sizing: border-box
    flex-direction: column
    min-width: 1280px
  .data-header-box
    layout(row)
    display: flex
    .data-header-left
      width: 66.66666%
      height: 260px
      padding-right: 7px
      box-sizing: border-box
      .header-left-box
        width: 100%
        height: 260px
        background: $color-white
        .real-time-box
          layout(row)
          .real-list-box
            height: 100px
            width: 33.33333%
            border-right: 0.5px solid #E9ECEE
            border-bottom: 0.5px solid #E9ECEE
            padding: 0 20px 0 20px
            box-sizing: border-box
            layout(row)
            align-items: center
            .real-list-box-icon
              width: 48px
              height: 48px
              display: block
              margin-right: 20px
              icon-image(icon-money_more)
            .card
              icon-image(icon-Repeat_purchase)
            .subscriber
              icon-image(icon-subscriber)
            .wallet
              icon-image(icon-wallet)
            .real-text-box
              layout()
              display: flex
              flex: 1
              .real-text-top
                font-size: $font-size-14
                font-family: $font-family-regular
                color: $color-text-main
                margin-bottom: 10px
              .real-text-bottom
                layout(row)
                align-items: center
                justify-content: space-between
                .real-text-number
                  font-size: 26px
                  font-family: $font-family-din-bold
                  color: $color-text-main
                  line-height: 28px
                .real-text-sale
                  font-size: 12px
                  font-family: $font-family-regular
                  color: #999
          .real-list-box:nth-of-type(3n)
            border-right: 0 solid #E9ECEE
          .real-list-box:nth-of-type(4), .real-list-box:nth-of-type(5), .real-list-box:nth-of-type(6)
            border-bottom: 0 solid #E9ECEE
    .data-header-right
      width: 33.33333%
      height: 260px
      padding-left: 13px
      box-sizing: border-box
      .base-box
        width: 100%
        height: 260px
        background: $color-white
        .base-function-box
          layout(row)
          .base-list-item
            width: 33.3333%
            height: 100px
            border-right: 0.5px solid #E9ECEE
            border-bottom: 0.5px solid #E9ECEE
            padding: 17px 20px 0
            cursor: pointer
            .base-item-title
              font-size: $font-size-14
              line-height: $font-size-14
              color: $color-text-main
              font-family: $font-family-regular
              margin-bottom: 17px
            .base-number-box
              layout(row)
              align-items: center
              justify-content: space-between
              .number-left
                font-size: 28px
                color: $color-text-main
                line-height: 28px
                font-family: $font-family-din-bold
              .number-right
                width: 20px
                height: 20px
                icon-image(icon-rightward_1)
          .base-list-item:hover
            .number-right
              icon-image(icon-rightward_2)
  .data-middle-box
    layout(row)
    display: flex
    margin-top: 20px
    .data-middle-left
      width: 66.66666%
      height: 260px
      layout(row)
      display: flex
      padding-right: 7px
    .middle-small-left
      width: 50%
      height: 405px
      padding-right: 10px
      .data-list
        width: 100%
        height: 100%
        background: $color-white
    .middle-small-right
      width: 50%
      height: 405px
      padding-left: 10px
      .goods-rank
        width: 100%
        height: 100%
        background: $color-white
    .data-middle-right
      width: 33.33333%
      height: 405px
      padding-left: 13px
      box-sizing: border-box
      .community-rank
        background: $color-white
        width: 100%
        height: 100%
  .data-bottom-box
    layout(row)
    margin-top: 20px
    background: $color-white
    .dispose-matter-box
      layout(row)
      align-items: center
      height: 120px
      width: 100%
      .dispose-list-box
        layout()
        align-items: center
        justify-content: center
        width: 180px
        .dispose-top-item
          width: 50px
          height: @width
          border: 0.5px solid #ccc
          border-radius: 50px
          position: relative
          .dispose-text
            font-size: $font-size-18
            font-family: $font-family-medium
            color: $color-text-main
            width: 50px
            height: @width
            line-height: @width
            text-align: center
          .dispose-number
            min-width: 22px
            height: 22px
            line-height: 22px
            padding: 0 5px
            position: absolute
            left: 35px
            top: 0
            background: #F84E3C
            border-radius: 50px
            color: $color-white
            font-size: $font-size-13
            text-align: center
            font-family: $font-family-medium
          .dispose-img
            width: 22px
            height: @width
            position: absolute
            right: -10px
            top: 0
            border-radius: 50px
            display: block
            font-family: $font-family-medium
        .dispose-name
          margin-top: 10px
          font-size: $font-size-14
          font-family: $font-family-regular
          color: $color-text-main
  .goods-list
    .list-item
      box-sizing: border-box
      padding-right: 10px
      flex: 1
      &:nth-child(1)
        max-width: 46px
      &:nth-child(2)
        flex: 1.6
      &:nth-child(3), &:nth-child(4), &:nth-child(5)
        text-align: right
        justify-content: flex-end
      &:last-child
        padding-right: 20px
  .community-list
    .list-item
      box-sizing: border-box
      padding-right: 10px
      flex: 1
      &:nth-child(1)
        flex: 1.6
      &:nth-child(3), &:nth-child(4), &:nth-child(2)
        text-align: right
        justify-content: flex-end
      &:last-child
        padding-right: 20px
  .new-data
    .list-content
      &:nth-child(2n)
        background: $color-white
      &:hover
        background: #F7FAF5
  .data-list-img
    width: 36px
    height: @width
    display: block
    border-radius: 2px
    border: 0.5px solid #E9ECEE
  .survey-box
    padding: 0 20px
    border-bottom-1px(#E9ECEE)
  .educe-btn
    font-size: $font-size-12
    color: $color-main
    font-family: $font-family-regular
    width: 47px
    height: 24px
    line-height: 23px
    text-align: center
    border: 1px solid $color-main
    border-radius: 12px
    background: $color-white
    margin-left: 20px
    cursor: pointer
  .identification
    width: 100%
  .function-btn
    layout(row)
    align-items: center
  .trend-box
    #trend
      height: 345px
      width: 100%
</style>
