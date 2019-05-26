<template>
  <div class="community-data">
    <div class="data-caption data-caption-line">
      <div class="content-title">
        <img src="./icon-qundata@2x.png" alt="" class="title-icon">
        <div class="data-title">商品数据</div>
      </div>
      <base-option-box :arrTitle="arrTitle" :infoTab="0" :tabActive="3" @checkTime="_getData"></base-option-box>
    </div>
    <div class="data-content">
      <left-tab @changeCategory="changeTab"></left-tab>
      <div class="right-data">
        <div class="top-sec">
          <section class="data-sec">
            <div class="sec-title">
              <div class="title-left">
                <p class="text">商品销售</p>
                <status-tab :statusList="sale" @setStatus="changeSale"></status-tab>
              </div>
              <div class="title-right">
                <span class="export-btn hand">导出Excel</span>
              </div>
            </div>
            <goods-list v-if="false"></goods-list>
            <line-data class="chart-box" ref="line1" chartId="line1"></line-data>

          </section>
          <section class="data-sec">
            <div class="sec-title">
              <div class="title-left">
                <p class="text">商品售后</p>
                <status-tab :statusList="server" @setStatus="changeServe"></status-tab>
              </div>
              <div class="title-right">
                <span class="show-big-icon hand" @click="showBigData"></span>
              </div>
            </div>
            <bar-data ref="bar1" chartId="bar1"></bar-data>
          </section>
        </div>
        <div class="bottom-sec">
          <section class="data-sec">
            <div class="sec-title">
              <div class="title-left">
                <p class="text">商品采购</p>
                <status-tab :statusList="purchase" @setStatus="changePurchase"></status-tab>
              </div>
              <div class="title-right">
                <span class="show-big-icon hand" @click="showBigData"></span>
              </div>
            </div>
            <pie-data chartId="pie"></pie-data>
          </section>
          <section class="data-sec">
            <div class="sec-title">
              <div class="title-left">
                <p class="text">供应链</p>
                <status-tab :statusList="supply" @setStatus="changeSupply"></status-tab>
              </div>
              <div class="title-right">
                <span class="show-big-icon hand" @click="showBigData"></span>
              </div>
            </div>
            <bar-data ref="bar2" chartId="bar2"></bar-data>
          </section>
        </div>
      </div>
    </div>
    <div v-show="bigDataShow" class="big-data">
      <div class="big-head">
        <span class="chart-name">商品售后</span>
        <img src="./icon-del_2@2x.png" class="big-close hand" @click="closeBigData">
      </div>
      <p class="big-data-name">退货率 <span class="data">18.9%</span></p>
      <div class="big-chart">
        <big-bar-data ref="bigBar" chartId="big-bar"></big-bar-data>
      </div>
    </div>
    <edit-modal ref="editModal" @confirm="confirm"></edit-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {goodsDataComputed, goodsDataMethods} from '@state/helpers'
  import StatusTab from './status-tab/status-tab'
  import GoodsList from './goods-list/goods-list'
  import LeftTab from './left-tab/left-tab'
  import EditModal from './edit-modal/edit-modal'
  import BarData from './bar-data/bar-data'
  import LineData from './line-data/line-data'
  import BigBarData from './big-bar-data/big-bar-data'
  import PieData from './pie-data/pie-data'

  import API from '@api'
  const ARR_TITLE = [
    {title: '7天', status: 'today'},
    {title: '15天', status: 'yesterday'},
    {title: '30天', status: 'month'},
    {title: '自定义', status: 'custom'}
  ]
  const SALE = [
    {name: '商品结构', type: ''},
    {name: '销量排行榜', type: ''},
    {name: '动销率', type: ''},
    {name: '售罄率', type: ''}
  ]
  const SERVER = [
    {name: '退货数', type: ''},
    {name: '退货率', type: ''}
  ]
  const PURCHASE = [
    {name: '采购匹配度', type: ''},
    {name: '毛利率', type: ''}
  ]
  const SUPPLY = [
    {name: '退货数', type: ''},
    {name: '退货率', type: ''}
  ]

  const PAGE_NAME = 'GOODS-DATA'
  const TITLE = '商品数据'
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      LeftTab,
      EditModal,
      StatusTab,
      GoodsList,
      BarData,
      PieData,
      BigBarData,
      LineData
    },
    data() {
      return {
        sale: SALE,
        server: SERVER,
        purchase: PURCHASE,
        supply: SUPPLY,
        arrTitle: ARR_TITLE,
        categoryIndex: 0, // 选择类
        goodsIndex: 0, // 选择商品
        selectType: true, // false类，true商品
        bigDataShow: false,
        request1: {
          day_type: 'week'
        },
        request2: {
          day_type: 'week'
        },
        request3: {
          day_type: 'week'
        },
        request4: {
          day_type: 'week'
        },
        editGroupItem: {},
        leftTabItem: {}
      }
    },
    computed: {
      ...goodsDataComputed
    },
    created() {
      // this.getAllData()
    },
    mounted() {
      this.$refs.bar1.drawBar({x: [], series: []})
      this.$refs.bar2.drawBar1({x: [], series: []})
      this.$refs.line1.drawLine()
    },
    methods: {
      ...goodsDataMethods,
      _getData(value) {
        this.request1.day_type = value
        // this.getAllData()
      },
      showBigData() {
        this.bigDataShow = true
        this.$refs.bigBar.drawBar({x: [], series: []})
      },
      closeBigData() {
        this.bigDataShow = false
      },
      // 切换左侧tab栏
      changeTab(categoryIndex, goodsIndex, type, item) {
        this.leftTabItem = item
        this.categoryIndex = categoryIndex
        this.goodsIndex = goodsIndex
        this.selectType = type
        this.request.wx_group_id = item.id
        // this.$refs.qualityData.setTab()
        // this.$refs.businessData.setTab()
        // this.$refs.groupData.setTab()
        // this.getAllData()
      },
      changeSale(obj) {
        console.log(obj)
      },
      changeServe(obj) {
        console.log(obj)
      },
      changePurchase(obj) {
        console.log(obj)
      },
      changeSupply(obj) {
        console.log(obj)
      },
      showDescription(type) {
        this.$refs.description.show(type)
      },
      async confirm(data) {
        this.name = data.name
        let res = await API.Community.editCommunity(data)
        if (res.error !== this.$ERR_OK) {
          this.$toast.show(res.message)
          return
        }
        this.getCommunityList({page: 1})

      },
      getAllData() {
        this.getSecData1(this.request1)
        this.getSecData2(this.request2)
        this.getSecData3(this.request3)
        this.getSecData4(this.request4)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .community-data
    overflow: hidden
    position: relative
    flex: 1
    display: flex
    box-sizing: border-box
    flex-direction: column
    background: #FFF
    border: 0.5px solid $color-line
  .data-caption
    padding: 20px
    display: flex
    justify-content: space-between
    align-items: center
    box-sizing: border-box
    .content-title
      display: flex
      align-items: center
    .title-icon
      width: 14px
      height: 14px
      margin-right: 5px
    .data-title
      font-family: $font-family-regular
      color: $color-text-main
      font-size: $font-size-16
  .data-caption-line
    border-bottom: 0.5px solid $color-line
  .data-content
    display: flex
    height: 100%
  .right-data
    margin-left: 20px
    margin-bottom: 20px
    flex: 1
    .top-sec
      width: 100%
      display: flex
    .bottom-sec
      width: 100%
      display: flex
    .data-sec
      width: 50%
      margin-right: 20px
      margin-top: 20px
      border-1px($color-line, 0)
      height: 405px
      display: flex
      flex-direction: column
      .sec-title
        height: 60px
        display: flex
        padding: 0 2vh
        justify-content: space-between
        align-items: center
        font-family: $font-family-regular
        border-bottom-1px($color-line)
        .title-left
          display: flex
          align-items: center
        .text
          font-size: $font-size-16
          font-family: $font-family-medium
          color: $color-text-main
        .title-right
          .export-btn
            display: block
            width: 80px
            height: 28px
            line-height: 28px
            color: $color-main
            border-radius: 30px
            border-1px($color-main, 30px)
            text-align: center
            font-size: $font-size-12
            font-family: $font-family-regular
            transition: all 0.3s
            &:hover
              color: #FFF
              background: $color-main
          .show-big-icon
            width: 16px
            height: 16px
            display: block
            background-image: url("./icon-enlarge_default@2x.png")
            background-repeat: no-repeat
            background-size: 100% 100%
            transition: all 0.3s
            &:hover
              background-image: url("./icon-enlarge_hover@2x.png")
    .bottom
      height: 0


  .big-data
    z-index: 10
    position: absolute
    width: 100%
    height: 100%
    background: #FFF
    display: flex
    flex-direction: column
    .big-head
      height: 60px
      display: flex
      align-items: center
      justify-content: space-between
      padding: 0 20px
      border-bottom: 0.5px solid $color-line
    .chart-name
      font-family: $font-family-medium
      color: #333
      font-size: $font-size-16
    .big-close
      width: 30px
      height: 30px
    .big-chart
      flex: 1
      overflow: hidden
      display: flex
    .big-data-name
      padding: 30px 20px 0
      font-family: $font-family-regular
      font-size: $font-size-12
      color: $color-text-main
      .data
        font-family: $font-family-din-bold
        font-size: $font-size-18
        color: $color-text-main
    .chart
      width: 20px;
</style>
