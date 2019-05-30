<template>
  <div class="goods-data">
    <div class="data-caption data-caption-line">
      <div class="content-title">
        <img src="./icon-qundata@2x.png" alt="" class="title-icon">
        <div class="data-title">商品数据</div>
      </div>
      <base-option-box :arrTitle="arrTitle" :infoTab="0" :tabActive="3" :disabledDate="dateOption" @checkTime="_getData"></base-option-box>
    </div>
    <div class="data-content">
      <left-tab @changeTab="changeTab"></left-tab>
      <div class="right-data">
        <div class="top-sec">

          <!--模块1-->
          <section class="data-sec">
            <div class="sec-title">
              <div class="title-left">
                <p class="text">商品销售</p>
                <status-tab ref="statusTab1" :statusList="configObj[leftTab].sale" @setStatus="changeSale"></status-tab>
              </div>
              <div class="title-right">
                <span v-if="selectMsg.sale.big" :key="1" class="show-big-icon hand" @click="showBigData(selectMsg.sale.type)"></span>
                <span v-if="selectMsg.sale.excel" :key="2" class="export-btn hand" @click="exportExcel()">导出Excel</span>
              </div>
            </div>
            <div v-if="selectMsg.sale.type === 'goodsDetail'" class="name-text hand" @click="showDescription()">
              <p class="item">商品结构 <span class="name">爆品</span> <img src="./icon-help_lv@2x.png" alt="" class="icon"></p>
            </div>

            <div v-if="selectMsg.sale.type !== 'goods' && selectMsg.sale.type !== 'goodsDetail'" class="name-text">
              <p class="item">{{selectMsg.sale.name}}<span class="data">{{allMsg[0].data}}</span></p>
            </div>

            <div v-if="selectMsg.sale.type === 'goodsDetail'" class="goods-structor">
              <div class="goods-msg">
                <img src="./goods.png" alt="" class="goods-image">
                <div class="goods-detail">
                  <p class="title">{{allMsg[0].goods_name}}</p>
                  <p class="price">¥ {{allMsg[0].sale}}</p>
                </div>
              </div>
              <div class="data-list">
                <div class="view">
                  <p class="text">浏览量 <img src="./icon-high@2x.png" alt="" class="icon"></p>
                  <p class="num">{{allMsg[0].view_data}}</p>
                </div>
                <div class="view">
                  <p class="text">销售数量 <img src="./icon-high@2x.png" alt="" class="icon"></p>
                  <p class="num">{{allMsg[0].sale_data}}</p>
                </div>
                <div class="view">
                  <p class="text">销售额(元)</p>
                  <p class="num">{{allMsg[0].sale_price}}</p>
                </div>
              </div>
            </div>
            <goods-list v-if="selectMsg.sale.type === 'goods'" type="sales" :list="secData1" @changeGoodsRank="changeGoodsRank"></goods-list>
            <bar-data v-if="selectMsg.sale.type === 'bar'" ref="bar1" chartId="bar1"></bar-data>
            <line-data v-if="selectMsg.sale.type === 'line'" ref="line1" chartId="line1" class="chart-box"></line-data>

          </section>

          <!--模块2-->
          <section class="data-sec">
            <div class="sec-title">
              <div class="title-left">
                <p class="text">商品售后</p>
                <status-tab ref="statusTab2" :statusList="configObj[leftTab].serve" @setStatus="changeServe"></status-tab>
              </div>
              <div class="title-right">
                <span v-if="selectMsg.serve.big" class="show-big-icon hand" @click="showBigData(selectMsg.serve.type)"></span>
                <span v-if="selectMsg.serve.excel" class="export-btn hand" @click="exportExcel()">导出Excel</span>
              </div>
            </div>
            <div class="name-text">
              <p class="item">{{selectMsg.serve.name}}<span class="data">{{allMsg[1].data}}</span></p>
            </div>
            <bar-data v-if="selectMsg.serve.type === 'bar'" ref="bar2" chartId="bar2"></bar-data>
            <line-data v-if="selectMsg.serve.type === 'line'" ref="line2" chartId="line2" class="chart-box"></line-data>
          </section>
        </div>

        <div class="bottom-sec">

          <!--模块3-->
          <section class="data-sec">
            <div class="sec-title">
              <div class="title-left">
                <p class="text">商品采购</p>
                <status-tab ref="statusTab3" :statusList="configObj[leftTab].purchase" @setStatus="changePurchase"></status-tab>
              </div>
              <div class="title-right">
                <span v-if="selectMsg.purchase.big" class="show-big-icon hand" @click="showBigData(selectMsg.purchase.type)"></span>
                <span v-if="selectMsg.purchase.excel" class="export-btn hand" @click="exportExcel()">导出Excel</span>
              </div>
            </div>
            <div class="name-text">
              <p class="item">{{selectMsg.purchase.name}}<span class="data">{{allMsg[2].data}}</span></p>
            </div>

            <bar-data v-if="selectMsg.purchase.type === 'bar'" :key="1" ref="bar3" chartId="bar3"></bar-data>
            <bar-data v-if="selectMsg.purchase.type === 'bar1'" :key="2" ref="bar3" chartId="bar3"></bar-data>
            <pie-data v-if="selectMsg.purchase.type === 'pie'" ref="pie3" chartId="pie3"></pie-data>
            <line-data v-if="selectMsg.purchase.type === 'line'" ref="line3" class="chart-box" chartId="line3"></line-data>
          </section>

          <!--模块4-->
          <section class="data-sec">
            <div class="sec-title">
              <div class="title-left">
                <p class="text">供应链</p>
                <status-tab ref="statusTab4" :statusList="configObj[leftTab].supply" @setStatus="changeSupply"></status-tab>
              </div>
              <div class="title-right">
                <span v-if="selectMsg.supply.big" :key="1" class="show-big-icon hand" @click="showBigData(selectMsg.supply.type)"></span>
                <span v-if="selectMsg.supply.excel" :key="2" class="export-btn hand" @click="exportExcel()">导出Excel</span>
              </div>
            </div>
            <div v-if="selectMsg.supply.type !== 'goods'" class="name-text">
              <p class="item">{{selectMsg.supply.name}}<span class="data">{{allMsg[3].data}}</span></p>
            </div>
            <goods-list v-if="selectMsg.supply.type === 'goods'" type="stock"></goods-list>
            <bar-data v-if="selectMsg.supply.type === 'bar'" ref="bar4" chartId="bar4"></bar-data>
            <line-data v-if="selectMsg.supply.type === 'line'" ref="line4" chartId="line4" class="chart-box"></line-data>
          </section>
        </div>
      </div>
    </div>

    <description-modal ref="description" :desIndex="0"></description-modal>

    <!--大图表-->
    <div v-if="bigDataShow" class="big-data">
      <div class="big-head">
        <span class="chart-name">商品售后</span>
        <img src="./icon-del_2@2x.png" class="big-close hand" @click="closeBigData">
      </div>
      <p class="big-data-name">退货率 <span class="data">18.9%</span></p>
      <div class="big-chart">
        <big-bar-data ref="bigBar" chartId="big-bar"></big-bar-data>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {goodsDataComputed, goodsDataMethods} from '@state/helpers'
  import StatusTab from './status-tab/status-tab'
  import GoodsList from './goods-list/goods-list'
  import LeftTab from './left-tab/left-tab'
  import BarData from './bar-data/bar-data'
  import LineData from './line-data/line-data'
  import BigBarData from './big-bar-data/big-bar-data'
  import PieData from './pie-data/pie-data'
  import DescriptionModal from './description-modal/description-modal'

  import API from '@api'

  const ARR_TITLE = [
    {title: '7天', status: 'yesterday'},
    {title: '15天', status: '15'},
    {title: '30天', status: 'month'}
    // {title: '自定义', status: 'custom'}
  ]
  const ALL_DATA = {
    all: {
      sale: [
        {name: '商品结构', type: 'bar', excel: true, word: 'goods', code: ''},
        {name: '销量排行榜', type: 'goods', excel: true, code: 'num'},
        {name: '动销率', type: 'bar', big: true, word: 'goods', rate: true},
        {name: '售罄率', type: 'bar', big: true, word: 'goods', rate: true}
      ],
      serve: [
        {name: '退货数', type: 'bar', big: true, word: 'goods', excel: true, code: 'returns_num'},
        {name: '退货率', type: 'bar', big: true, word: 'goods', code: 'rate', rate: true}
      ],
      purchase: [
        {name: '采购匹配度', type: 'bar1', big: true, word: 'goods', excel: true},
        {name: '商品SPU数', type: 'pie', big: true, word: 'goods', excel: true},
        {name: '毛利率', type: 'bar', big: true, word: 'goods', rate: true}
      ],
      supply: [
        {name: '库存排行', type: 'goods', excel: true},
        {name: '库存周转率', type: 'bar', big: true, word: 'goods', rate: true}
      ]
    },
    category: {
      sale: [
        {name: '商品结构', type: 'bar', excel: true, word: 'goods'},
        {name: '销量排行榜', type: 'goods', excel: true, word: 'goods', code: 'num'},
        {name: '动销率', type: 'bar', big: true, word: 'goods', rate: true},
        {name: '售罄率', type: 'bar', big: true, word: 'goods', rate: true}
      ],
      serve: [
        {name: '退货数', type: 'bar', big: true, word: 'goods', excel: true, code: 'returns_num'},
        {name: '退货率', type: 'bar', big: true, word: 'goods', code: 'rate', rate: true}
      ],
      purchase: [
        {name: '采购匹配度', type: 'bar1', big: true, word: 'goods', excel: true},
        {name: '毛利率', type: 'bar', big: true, word: 'goods', rate: true}
      ],
      supply: [
        {name: '库存排行', type: 'goods', excel: true},
        {name: '库存周转率', type: 'bar', big: true, word: 'goods', rate: true}
      ]
    },
    goods: {
      sale: [
        {name: '商品结构', type: 'goodsDetail'},
        {name: '销量排行榜', type: 'line'},
        {name: '动销率', type: 'line', rate: true},
        {name: '售罄率', type: 'line', rate: true}
      ],
      serve: [
        {name: '退货数', type: 'line', code: 'returns_num'},
        {name: '退货率', type: 'line', code: 'rate', rate: true}
      ],
      purchase: [
        {name: '采购匹配度', type: 'line'},
        {name: '毛利率', type: 'line', rate: true}
      ],
      supply: [
        {name: '库存排行', type: 'line'},
        {name: '库存周转率', type: 'line', rate: true}
      ]
    }
  }

  const PAGE_NAME = 'GOODS-DATA'
  const TITLE = '商品数据'
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      LeftTab,
      StatusTab,
      GoodsList,
      BarData,
      PieData,
      BigBarData,
      LineData,
      DescriptionModal
    },
    data() {
      return {
        configObj: ALL_DATA,
        arrTitle: ARR_TITLE,
        // categoryIndex: 0, // 选择类
        // goodsIndex: 0, // 选择商品
        selectType: true, // false类，true商品
        bigDataShow: false,
        requestSale: {
          order_by: '',
          limit: 10
        },
        requestServe: {
          order_by: ''
        },
        requestPurchase: {
          order_by: ''
        },
        requestSupply: {
          order_by: ''
        },
        requestPub: {
          date_type: 'week',
          group_by: 'cate'
        },
        leftTabItem: {},
        allMsg: [
          {
            name: '商品结构',
            data: '2000',
            goods_name: '台湾柑橘',
            sale: '88/箱',
            view_data: 1000,
            sale_data: 400,
            sale_price: '2000.00'
          },{
            name: '退货数',
            data: '2000'
          },{
            name: '毛利率',
            data: '2000'
          },{
            name: '库存周转率',
            data: '2000'
          }
        ],
        selectMsg: {
          sale: {},
          serve: {},
          purchase: {},
          supply: {}
        },
        dateOption: {
          disabledDate(date) {
            // 自定义日期必须小于今天
            return date.valueOf() > Date.now() - 86400000
          }
        },
        leftTab: 'all', // 左侧tab栏 all全部商品 category分类 goods商品
      }
    },
    computed: {
      ...goodsDataComputed
    },
    created() {
      this._initSelect()
      // this.getAllData()
    },
    mounted() {
      this.$refs.bar1 && this.$refs.bar1.drawBar2({x: [], series: []})
      this.$refs.bar2 && this.$refs.bar2.drawBar({x: [], series: []})
      this.$refs.bar3 && this.$refs.bar3.drawBar1({x: [], series: []})
    },
    methods: {
      ...goodsDataMethods,
      _getData(value) {
        if (typeof value === 'string') {
          this.requestPub.date_type = value
        } else {
          this.start_at = value[0]
          this.end_at = value[1]
          console.log(new Date(Number(value[0])) - new Date(Number(value[1])))
          if (new Date(Number(value[0])) - new Date(Number(value[1])) <= 2) {
            this.$toast.show('选择时间范围不能小于两天')
            return
          }
        }
        console.log(value)
        // this.getAllData()
      },
      changeGoodsRank(type) {
        this.requestSale.order_by = type
        let data = Object.assign(this.requestPub, this.requestSale)
        this.getSaleData({data, index: 1})
      },
      showBigData(type) {
        this.bigDataShow = true
        this.$nextTick(() => {
          if (type === 'bar1') {
            this.$refs.bigBar && this.$refs.bigBar.drawBar1({x: [], series: []})
          } else {
            this.$refs.bigBar && this.$refs.bigBar.drawBar({x: [], series: []})
          }
        })
      },
      closeBigData() {
        this.bigDataShow = false
      },
      deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj))
      },
      // 切换左侧tab栏
      changeTab(item, type, code) {
        if (this.leftTab === code) return
        switch (code) {
        case 'all':
          this.requestPub.cate = ''
          this.requestPub.spu = ''
          this.requestPub.group_by = 'cate'
          break
        case 'category':
          this.requestPub.cate = item.id
          this.requestPub.spu = ''
          this.requestPub.group_by = 'spu'
          break
        default:
          this.requestPub.cate = ''
          this.requestPub.spu = item.id
          this.requestPub.group_by = ''
        }
        this.leftTabItem = item
        this.selectType = type
        this.leftTab = code
        this.getGoodsList({goods_category_id: item.id, is_online: 1, keyword: ''})
        this.$nextTick(() => {
          if (code === 'all' || code === 'category') {
            this.$refs.bar1 && this.$refs.bar1.drawBar2({x: [], series: []})
            this.$refs.bar2 && this.$refs.bar2.drawBar({x: [], series: []})
            this.$refs.bar3 && this.$refs.bar3.drawBar1({x: [], series: []})
          } else if (code === 'goods') {
            this.$refs.line2 && this.$refs.line2.drawLine()
            this.$refs.line3 && this.$refs.line3.drawLine()
            this.$refs.line4 && this.$refs.line4.drawLine()
          }
        })
        this._initSelect()
        // this.request.wx_group_id = item.id
        // this.$refs.qualityData.setTab()
        // this.$refs.businessData.setTab()
        // this.$refs.groupData.setTab()
        // this.getAllData()
      },
      _initSelect() {
        this.$set(this.selectMsg, 'sale', this.configObj[this.leftTab].sale[0])
        this.$set(this.selectMsg, 'serve', this.configObj[this.leftTab].serve[0])
        this.$set(this.selectMsg, 'purchase', this.configObj[this.leftTab].purchase[0])
        this.$set(this.selectMsg, 'supply', this.configObj[this.leftTab].supply[0])
        this.$refs.statusTab1 && this.$refs.statusTab1.checkStatus(0, this.configObj[this.leftTab].sale[0])
        this.$refs.statusTab2 && this.$refs.statusTab2.checkStatus(0, this.configObj[this.leftTab].serve[0])
        this.$refs.statusTab3 && this.$refs.statusTab3.checkStatus(0, this.configObj[this.leftTab].purchase[0])
        this.$refs.statusTab4 && this.$refs.statusTab4.checkStatus(0, this.configObj[this.leftTab].supply[0])
      },
      // 切换商品销售模块（模块1）
      async changeSale(obj, index) {
        this.selectMsg.sale = this.deepCopy(obj)
        this.requestSale.order_by = obj.code
        let data = Object.assign(this.requestPub, this.requestSale)
        await this.getSaleData({data, index})
        this.$nextTick(() => {
          if (index === 0) {
            this.$refs.bar1 && this.$refs.bar1.drawBar2({x: [], series: []})
          } else {
            this.$refs.bar1 && this.$refs.bar1.drawBar({x: [], series: []}, obj.rate)
            this.$refs.line1 && this.$refs.line1.drawLine({x: [], series: []}, obj.rate)
          }
        })
      },
      // 切换商品售后模块（模块2）
      async changeServe(obj, index) {
        this.selectMsg.serve = obj
        this.requestServe.order_by = obj.code
        let data = Object.assign(this.requestPub, this.requestServe)
        await this.getServeData({data, index})
        this.$nextTick(() => {
          this.$refs.bar2 && this.$refs.bar2.drawBar({x: [], series: []}, obj.rate)
          this.$refs.line2 && this.$refs.line2.drawLine({x: [], series: []}, obj.rate)
        })
      },
      // 切换商品采购模块（模块3）
      changePurchase(obj, index) {
        this.selectMsg.purchase = obj
        this.requestPurchase.order_by = obj.code
        this.$nextTick(() => {
          if (index === 0) {
            this.$refs.bar3 && this.$refs.bar3.drawBar1({x: [], series: []})
          } else {
            this.$refs.bar3 && this.$refs.bar3.drawBar({x: [], series: []}, obj.rate)
            this.$refs.pie3 && this.$refs.pie3.drawPie({x: [], series: []})
            this.$refs.line3 && this.$refs.line3.drawLine({x: [], series: []}, obj.rate)
          }
        })
      },
      // 切换供应链模块（模块4）
      changeSupply(obj, index) {
        this.selectMsg.supply = obj
        this.requestSupply.order_by = obj.code
        this.$nextTick(() => {
          this.$refs.line4 && this.$refs.line4.drawLine({x: [], series: []}, obj.rate)
          this.$refs.bar4 && this.$refs.bar4.drawBar({x: [], series: []}, obj.rate)
        })
      },
      exportExcel() {
        console.log(222)
      },
      showDescription() {
        this.$refs.description.show()
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
      async getAllData() {
        await this.getSaleData(Object.assign(this.requestPub, this.requestSale))
        await this.getServeData(Object.assign(this.requestPub, this.requestServe))
        await this.getPurchaseData(Object.assign(this.requestPub, this.requestPurchase))
        await this.getSupplyData(Object.assign(this.requestPub, this.requestSupply))
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .goods-data
    overflow: hidden
    position: relative
    flex: 1
    display: flex
    box-sizing: border-box
    flex-direction: column
    background: #FFF
    border: 0.5px solid $color-line
    min-width: 1240px
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
          overflow: hidden
        .title-right
          display: flex
          align-items: center
          .export-btn
            display: block
            width: 80px
            height: 28px
            line-height: 28px
            color: $color-main
            border-radius: 30px
            margin-left: 10px
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
      .name-text
        display: flex
        align-items: center
        padding: 18px 20px 20px
        .item
          font-size: $font-size-12
          font-family: $font-family-regular
          color: $color-text-main
          margin-right: 10px
          .data
            font-family: $font-family-din-bold
            font-size: 18px
            line-height: 18px
            display: inline-block
            margin-left: 6px
            vertical-align: text-bottom
            color: $color-text-main
          .name
            font-family: $font-family-din-bold
            font-size: 18px
            line-height: 18px
            display: inline-block
            margin-left: 2px
            color: $color-text-main
          .icon
            width: 14px
            height: 14px
            margin-left: 10px
            display: inline-block
            vertical-align: text-top

      .goods-structor
        margin-top: 20px
      .goods-msg
        border: 0.5px solid #6081E3
        padding: 20px
        box-sizing: border-box
        height: 110px
        margin: 0 30px 30px 20px
        display: flex
        align-items: center
        .goods-image
          width: 70px
          height: 70px
        .goods-detail
          font-size: $font-size-14
          font-family: $font-family-regular
          color: $color-text-main
          margin-left: 16px
          height: 65px
          display: flex
          flex-direction: column
          justify-content: space-between
          .title
            line-height: 18px
          .price
            line-height: 18px
      .data-list
        display: flex
        align-items: center
        margin: 0 40px 0 40px
        .view
          margin-right: 10%
          &:last-child
            margin-right: 0
        .text
          display: flex
          align-items:center
          font-size: $font-size-14
          font-family: $font-family-regular
          color: #666
        .icon
          width: 16px
          height: 15px
        .num
          font-family: $font-family-din-bold
          color: $color-text-main
          font-size: 30px
          margin-top: 12px
          line-height: 30px
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
