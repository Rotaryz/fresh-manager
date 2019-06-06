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
      <left-tab ref="goodsTab" @changeTab="changeTab"></left-tab>
      <div class="right-data">
        <div class="top-sec">

          <!--模块1-->
          <section class="data-sec" @click="setClickChart('sale')">
            <div class="sec-title">
              <div class="title-left">
                <p class="text">商品销售</p>
                <status-tab ref="statusTab1" :statusList="configObj[leftTab].sale" @setStatus="changeSale"></status-tab>
              </div>
              <div class="title-right">
                <span v-if="selectMsg.sale.big" :key="1" class="show-big-icon hand" @click.stop="showBigData(selectMsg.sale.type, 'sale', )"></span>
                <span v-if="selectMsg.sale.excel" :key="2" class="export-btn hand" @click.stop="exportExcel('sale')">导出Excel</span>
              </div>
            </div>
            <div v-if="selectMsg.sale.type === 'goodsDetail'" class="name-text">
              <p class="item hand" @click.stop="showDescription(saleData.data.type_name)">商品结构 <span class="name">{{saleData.data.type_name}}</span> <img src="./icon-help_lv@2x.png" alt="" class="icon"></p>
            </div>

            <div v-if="selectMsg.sale.type !== 'goods' && selectMsg.sale.type !== 'goodsDetail' && hideText[0]" class="name-text">
              <p class="item">{{selectMsg.sale.name}}<span class="data">{{saleData[selectMsg.sale.code + '_total'] || saleData[selectMsg.sale.code] || 0}}{{selectMsg.sale.rate && '%'}}</span></p>
            </div>

            <div v-if="selectMsg.sale.type === 'goodsDetail'" class="goods-structor">
              <div class="goods-msg">
                <img :src="saleData.data.image_url" alt="" class="goods-image">
                <div class="goods-detail">
                  <p class="title">{{saleData.data.name}}</p>
                  <p class="price">¥ {{saleData.data.trade_price}}/{{saleData.data.goods_units}}</p>
                </div>
              </div>
              <div class="data-list">
                <div class="view">
                  <p class="text">浏览量 <img v-if="saleData.data.views_rate > 20" src="./icon-high@2x.png" alt="" class="icon"></p>
                  <p class="num">{{saleData.data.views}}</p>
                </div>
                <div class="view">
                  <p class="text">销售数量 <img v-if="saleData.data.num_rate > 20" src="./icon-high@2x.png" alt="" class="icon"></p>
                  <p class="num">{{saleData.data.sales_num}}</p>
                </div>
                <div class="view">
                  <p class="text">销售额(元) <img v-if="saleData.data.amount_rate > 10" src="./icon-high@2x.png" alt="" class="icon"></p>
                  <p class="num">{{saleData.data.sales_amount}}</p>
                </div>
              </div>
            </div>
            <goods-list v-if="selectMsg.sale.type === 'goods'" type="sales" :list="saleRankList" :loaded="loaded" @changeGoodsRank="changeGoodsRank"></goods-list>
            <bar-data v-if="selectMsg.sale.type === 'bar'"
                      ref="bar1" chartId="bar1"
                      @clickChart="clickChart"
                      @noData="noData"
                      @hasData="hasData"
            ></bar-data>
            <line-data v-if="selectMsg.sale.type === 'line'" ref="line1" chartId="line1" class="chart-box"></line-data>
          </section>

          <!--模块2-->
          <section class="data-sec" @click="setClickChart('serve')">
            <div class="sec-title">
              <div class="title-left">
                <p class="text">商品售后</p>
                <status-tab ref="statusTab2" :statusList="configObj[leftTab].serve" @setStatus="changeServe"></status-tab>
              </div>
              <div class="title-right">
                <span v-if="selectMsg.serve.big" class="show-big-icon hand" @click.stop="showBigData(selectMsg.serve.type, 'serve')"></span>
                <span v-if="selectMsg.serve.excel" class="export-btn hand" @click.stop="exportExcel('serve')">导出Excel</span>
              </div>
            </div>
            <div v-if="hideText[1]" class="name-text">
              <p class="item">{{selectMsg.serve.name}}<span class="data">{{serveData[selectMsg.serve.code + '_total'] || serveData[selectMsg.serve.code] || 0}}{{selectMsg.serve.rate && '%'}}</span></p>
            </div>
            <bar-data v-if="selectMsg.serve.type === 'bar'"
                      ref="bar2"
                      chartId="bar2"
                      @clickChart="clickChart"
                      @noData="noData"
                      @hasData="hasData"
            ></bar-data>
            <line-data v-if="selectMsg.serve.type === 'line'" ref="line2" chartId="line2" class="chart-box"></line-data>
          </section>
        </div>

        <div class="bottom-sec">

          <!--模块3-->
          <section class="data-sec" @click="setClickChart('purchase')">
            <div class="sec-title">
              <div class="title-left">
                <p class="text">商品采购</p>
                <status-tab ref="statusTab3" :statusList="configObj[leftTab].purchase" @setStatus="changePurchase"></status-tab>
              </div>
              <div class="title-right">
                <span v-if="selectMsg.purchase.big" :key="1" class="show-big-icon hand" @click.stop="showBigData(selectMsg.purchase.type, 'purchase')"></span>
                <span v-if="selectMsg.purchase.excel" key="2" class="export-btn hand" @click.stop="exportExcel('purchase')">导出Excel</span>
              </div>
            </div>
            <div v-if="hideText[2]" class="name-text">
              <p class="item">{{selectMsg.purchase.name}}<span class="data">{{purchaseData[selectMsg.purchase.word] || 0}}{{selectMsg.purchase.rate && '%'}}</span></p>
            </div>

            <bar-data v-if="selectMsg.purchase.type === 'bar'"
                      :key="1"
                      ref="bar3"
                      chartId="bar3"
                      @clickChart="clickChart"
                      @noData="noData"
                      @hasData="hasData"
            ></bar-data>
            <bar-data v-if="selectMsg.purchase.type === 'bar1'"
                      :key="2" ref="bar3"
                      chartId="bar3"
                      @clickChart="clickChart"
                      @noData="noData"
                      @hasData="hasData"
            ></bar-data>
            <pie-data v-if="selectMsg.purchase.type === 'pie'"
                      ref="pie3"
                      chartId="pie3"
                      @clickChart="clickChart"
                      @noData="noData"
                      @hasData="hasData"
            ></pie-data>
            <line-data v-if="selectMsg.purchase.type === 'line'" ref="line3" class="chart-box" chartId="line3"></line-data>
          </section>

          <!--模块4-->
          <section class="data-sec" @click="setClickChart('supply')">
            <div class="sec-title">
              <div class="title-left">
                <p class="text">供应链</p>
                <status-tab ref="statusTab4" :statusList="configObj[leftTab].supply" @setStatus="changeSupply"></status-tab>
              </div>
              <div class="title-right">
                <span v-if="selectMsg.supply.big" :key="1" class="show-big-icon hand" @click.stop="showBigData(selectMsg.supply.type, 'supply')"></span>
                <span v-if="selectMsg.supply.excel" :key="2" class="export-btn hand" @click.stop="exportExcel('supply')">导出Excel</span>
              </div>
            </div>
            <div v-if="selectMsg.supply.type !== 'goods' && hideText[3]" class="name-text">
              <p class="item">{{selectMsg.supply.name}}<span class="data">{{supplyData[selectMsg.supply.code + '_total'] || supplyData[selectMsg.supply.code] || 0}}{{selectMsg.supply.rate && '%'}}</span></p>
            </div>
            <goods-list v-if="selectMsg.supply.type === 'goods'" type="stock" :list="stockRankList" :loaded="loaded"></goods-list>
            <bar-data v-if="selectMsg.supply.type === 'bar'"
                      ref="bar4" chartId="bar4"
                      @clickChart="clickChart"
                      @noData="noData"
                      @hasData="hasData"
            ></bar-data>
            <line-data v-if="selectMsg.supply.type === 'line'" ref="line4" chartId="line4" class="chart-box"></line-data>
          </section>
        </div>
      </div>
    </div>

    <description-modal ref="description"></description-modal>

    <!--大图表-->
    <div v-if="bigDataShow" class="big-data">
      <div class="big-head">
        <span class="chart-name">{{allName[bigBarIndex]}}</span>
        <img src="./icon-del_2@2x.png" class="big-close hand" @click="closeBigData">
      </div>
      <p v-if="hideText[secName[bigBarType]]" class="big-data-name">{{selectMsg[bigBarType].name}} <span class="data">{{bigChartData[selectMsg[bigBarType].word + '_total'] || bigChartData[selectMsg[bigBarType].word] || bigChartData[selectMsg[bigBarType].code + '_total'] || bigChartData[selectMsg[bigBarType].code] || 0}}{{selectMsg[bigBarType].rate ? '%' : ''}}</span></p>
      <div class="big-chart">
        <big-bar-data ref="bigBar" chartId="big-bar" @clickBigChart="clickBigChart"></big-bar-data>
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
    {title: '7天', status: 'week'},
    {title: '15天', status: 'half_month'},
    {title: '30天', status: 'month'},
    {title: '自定义', status: 'custom'}
  ]
  // 导出接口
  const EXPORT_URL = {
    sale: ['goods-structure-excel', 'sale-rank-excel'],
    serve: ['after-server-excel'],
    purchase: ['purchase-data-excel', 'purchase-data-sku-excel'],
    supply: ['sku-stock-data-excel']
  }
  const ALL_DATA = {
    all: {
      sale: [
        {name: '商品结构', type: 'bar', excel: true, code: 't'},
        {name: '销量排行', type: 'goods', excel: true, code: 'num', limit: 10},
        {name: '动销率', type: 'bar', big: true, rate: true, code: 'pin_rate', limit: 8},
        // {name: '售罄率', type: 'bar', big: true, rate: true, code: 'out_rate', limit: 8}
      ],
      serve: [
        {name: '退货数', type: 'bar', big: true, excel: true, code: 'returns_num', limit: 8},
        {name: '退货率', type: 'bar', big: true, code: 'rate', rate: true, limit: 8}
      ],
      purchase: [
        {name: '采销匹配度', type: 'bar1', big: true, excel: true, code: 'purchase_num', word: 'cate_num_total', limit: 6},
        {name: '商品SPU数', type: 'pie', excel: true, code: 'all_count', word: 'all_count'},
        {name: '毛利率', type: 'bar', big: true, rate: true, code: 'rate', word: 'rate', limit: 8}
      ],
      supply: [
        {name: '库存排行', type: 'goods', excel: true, code: 'num', limit: 10},
        {name: '库存周转率', type: 'bar', big: true, rate: true, code: 'rate', limit: 8}
      ]
    },
    category: {
      sale: [
        {name: '商品结构', type: 'bar', excel: true, code: 't'},
        {name: '销量排行', type: 'goods', excel: true, code: 'num', limit: 10},
        {name: '动销率', type: 'bar', big: true, rate: true, code: 'pin_rate', limit: 8},
        // {name: '售罄率', type: 'bar', big: true, rate: true, code: 'out_rate', limit: 8}
      ],
      serve: [
        {name: '退货数', type: 'bar', big: true, excel: true, code: 'returns_num'},
        {name: '退货率', type: 'bar', big: true, code: 'rate', rate: true}
      ],
      purchase: [
        {name: '采销匹配度', type: 'bar1', big: true, excel: true, code: 'purchase_num', word: 'sku_num_total', limit: 6},
        {name: '毛利率', type: 'bar', big: true, rate: true, code: 'rate', word: 'rate', limit: 8}
      ],
      supply: [
        {name: '库存排行', type: 'goods', excel: true, code: 'num', limit: 10},
        {name: '库存周转率', type: 'bar', big: true, rate: true, code: 'rate', limit: 8}
      ]
    },
    goods: {
      sale: [
        {name: '商品结构', type: 'goodsDetail'},
        {name: '销量', type: 'line', code: 'num', limit: 8},
        {name: '动销率', type: 'line', rate: true, code: 'pin_rate', limit: 8},
        // {name: '售罄率', type: 'line', rate: true, code: 'out_rate', limit: 8}
      ],
      serve: [
        {name: '退货数', type: 'line', code: 'returns_num'},
        {name: '退货率', type: 'line', code: 'rate', rate: true}
      ],
      purchase: [
        {name: '采购数量', type: 'line', code: 'purchase_num', word: 'purchase_num', limit: 6},
        {name: '毛利率', type: 'line', rate: true, code: 'rate', word: 'rate', limit: 8}
      ],
      supply: [
        {name: '库存', type: 'line', code: 'num', limit: 8},
        {name: '库存周转率', type: 'line', rate: true, code: 'rate', limit: 8}
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
        bigDataShow: false,
        requestSale: {},
        requestServe: {
          order_by: 'returns_num',
          limit: 8
        },
        requestPurchase: {
          order_by: 'purchase_num',
          limit: 6
        },
        requestSupply: {
          order_by: 'purchase_num',
          limit: 10
        },
        requestPub: {
          date_type: 'week',
          start_date: '',
          end_date: '',
          group_by: 'cate',
          cate: '',
          spu: ''
        },
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
        tabIndexControl: {
          sale: 0,
          serve: 0,
          purchase: 0,
          supply: 0
        },
        leftTabItem: '', // 左侧被选中tab栏id
        leftTab: 'all', // 左侧tab栏 all全部商品 category分类 goods商品,
        exportUrlArr: EXPORT_URL,
        excelType: '', // excel表格类型
        clickSec: '', // 被点击图表的块名称sale serve purchase supply
        clickChartIndex: '', // 点击的柱状图下标值
        allName: ['商品销售', '商品售后', '商品采购', '供应链'], // 每个块的名称
        secName: {sale: 0, serve: 1, purchase: 2, supply: 3},
        bigBarIndex: 0, // 大图表所属第几块下标
        bigBarType: '', // 大图表所属第几块名称
        loaded: false,
        hideText: [true, true, true, true]
      }
    },
    computed: {
      ...goodsDataComputed
    },
    created() {
      this._initSelect()
      // this.getAllData()
    },
    async mounted() {
      // 商品销售模块
      let dataSale = Object.assign({}, this.requestSale, this.requestPub)
      await this.getSaleData({dataSale, index: 0})
      // this.$refs.bar1 && this.$refs.bar1.drawBar2(this.saleHandle(this.saleData.data))
      // 商品售后模块
      let dataServe = Object.assign({}, this.requestServe, this.requestPub)
      await this.getServeData(dataServe)
      // this.$refs.bar2 && this.$refs.bar2.drawBar(this.dataHandle(this.serveData.data, 'name', this.selectMsg.serve.code))
      // 商品采购模块
      let dataPurchase = Object.assign({}, this.requestPurchase, this.requestPub)
      await this.getPurchaseData(dataPurchase)
      // this.$refs.bar3 && this.$refs.bar3.drawBar1(this.purchaseHandle(this.purchaseData))
      this._initDraw() // 初始绘图
      // 供应链模块
      let dataSupply = Object.assign({}, this.requestSupply, this.requestPub)
      this.getSupplyData({dataSupply, index: 0})
    },
    methods: {
      ...goodsDataMethods,
      _getData(value) {
        if (typeof value === 'string') {
          this.requestPub.date_type = value
        } else {
          // this.start_at = value[0]
          // this.end_at = value[1]
          this.requestPub.date_type = 'cust-date'
          this.requestPub.start_date = value[0]
          this.requestPub.end_date = value[1]
          if (new Date(Number(value[0])) - new Date(Number(value[1])) <= 2) {
            this.$toast.show('选择时间范围不能小于两天')
            return
          }
        }
        this.getAllData()
      },
      changeGoodsRank(type) {
        this.requestSale.order_by = type
        let dataSale = Object.assign({}, this.requestSale, this.requestPub)
        this.getSaleData({dataSale, index: 1})
      },
      setClickChart(type) {
        this.clickSec = type
      },
      clickChart(index) {
        this.clickChartIndex = index
        // this.$refs.goodsTab.selectList('', 3507)
        setTimeout(() => {
          if (!this[this.clickSec + 'Data'].data || !this[this.clickSec + 'Data'].data.length) return
          // 找到分类ID 或商品ID
          if (this.leftTab === 'all') {
            let chartCateId =  this[this.clickSec + 'Data'].data[index].cate || this[this.clickSec + 'Data'].data[index].id
            this.$refs.goodsTab.selectList(chartCateId)
          } else {

            let chartGoodsId = this[this.clickSec + 'Data'].data[index].spu
            this.$refs.goodsTab.selectList('', chartGoodsId)
          }
        })
      },
      clickBigChart(index) {
        this.clickChartIndex = index
        this.bigDataShow = false
        // this.$refs.goodsTab.selectList('', 42624)
        if (!this.bigChartData.data || !this.bigChartData.data.length) return
        // 找到分类ID 或商品ID
        if (this.leftTab === 'all') {
          let chartCateId =  this.bigChartData.data[index].cate
          this.$refs.goodsTab.selectList(chartCateId)
        } else {
          let chartGoodsId = this.bigChartData.data[index].spu
          this.$refs.goodsTab.selectList('', chartGoodsId)
        }
      },
      async showBigData(type, sec) {
        this.bigDataShow = true
        this.bigBarType = sec
        let index = this.tabIndexControl[sec]
        switch (sec) {
        case 'sale':
          this.bigBarIndex = 0
          let dataSale = Object.assign({}, this.requestSale, this.requestPub)
          dataSale.limit = 0
          await this.getSaleData({dataSale, index: index})
          break
        case 'serve':
          this.bigBarIndex = 1
          let dataServe = Object.assign({}, this.requestServe, this.requestPub)
          dataServe.limit = 0
          await this.getServeData(dataServe)
          break
        case 'purchase':
          this.bigBarIndex = 2
          let dataPurchase = Object.assign({}, this.requestPurchase, this.requestPub)
          dataPurchase.limit = 0
          await this.getPurchaseData(dataPurchase)
          break
        case 'supply':
          this.bigBarIndex = 3
          let dataSupply = Object.assign({}, this.requestSupply, this.requestPub)
          dataSupply.limit = 0
          await this.getSupplyData({dataSupply, index})
        }
        if (type === 'bar1') {
          this.$refs.bigBar && this.$refs.bigBar.drawBar1(this.purchaseHandle(this.bigChartData))
        } else {
          if (sec === 'serve') {
            this.$refs.bigBar && this.$refs.bigBar.drawBar(this.data2Handle(this.bigChartData.data, this.selectMsg[sec].code), this.selectMsg[sec].rate)
          } else {
            this.$refs.bigBar && this.$refs.bigBar.drawBar(this.dataHandle(this.bigChartData.data, this.selectMsg[sec].code), this.selectMsg[sec].rate)
          }
        }
      },
      closeBigData() {
        this.bigDataShow = false
      },
      noData(secIndex) {
        this.hideText = this.hideText.map((item, index) => {
          if (index === +secIndex) {
            item = false
          }
          return item
        })
      },
      hasData(secIndex) {
        this.hideText = this.hideText.map((item, index) => {
          if (index === +secIndex) {
            item = true
          }
          return item
        })
      },
      deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj))
      },
      // 切换左侧tab栏
      async changeTab(itemId, code) {
        if (this.leftTabItem === itemId) return
        switch (code) {
        case 'all':
          this.requestPub.cate = ''
          this.requestPub.spu = ''
          this.requestPub.group_by = 'cate'
          break
        case 'category':
          this.requestPub.cate = itemId
          this.requestPub.spu = ''
          this.requestPub.group_by = 'spu'
          break
        default:
          this.requestPub.cate = ''
          this.requestPub.spu = itemId
          this.requestPub.group_by = ''
        }
        this.leftTabItem = itemId
        this.leftTab = code
        if (code !== 'goods') {
          this.getGoodsList({goods_category_id: itemId, is_online: 1, keyword: '',  is_page: 0})
          // delete data.order_by
        }
        this._initSelect()
        this.hideText = [true, true, true, true]
        // let data = Object.assign({}, this.requestPurchase, this.requestPub)
        // await this.getPurchaseData(data)
        // if (code === 'all' || code === 'category') {
        //   this._initDraw()
        // } else if (code === 'goods') {
        //   this.$refs.line2 && this.$refs.line2.drawLine(this.lineHandle(this.serveData.data, this.selectMsg.serve.code, this.selectMsg.serve.name))
        //   this.$refs.line3 && this.$refs.line3.drawLine(this.lineHandle(this.purchaseData.data, this.selectMsg.purchase.code, this.selectMsg.purchase.name))
        //   this.$refs.line4 && this.$refs.line4.drawLine(this.lineHandle(this.supplyData.data, this.selectMsg.supply.code, this.selectMsg.supply.name))
        // }
      },
      // 初始绘制图表
      _initDraw() {
        this.$refs.bar1 && this.$refs.bar1.drawBar2(this.saleHandle(this.saleData.data))
        this.$refs.bar2 && this.$refs.bar2.drawBar(this.data2Handle(this.serveData.data,  this.selectMsg.serve.code))
        this.$refs.bar3 && this.$refs.bar3.drawBar1(this.purchaseHandle(this.purchaseData))
      },
      // 初始选择项
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
        this.loaded = false
        this.$set(this.selectMsg, 'sale', this.deepCopy(obj))
        this.$set(this.tabIndexControl, 'sale', index)
        obj.code ? this.$set(this.requestSale, 'order_by', obj.code) : this.$delete(this.requestSale, 'order_by')
        obj.limit ? this.$set(this.requestSale, 'limit', obj.limit) : this.$delete(this.requestSale, 'limit')
        if (index === 0) {
          this.$delete(this.requestSale, 'order_by')
        } else if (index === 1) {
          this.initSaleRankList()
        }
        let dataSale = Object.assign({}, this.requestSale, this.requestPub)
        await this.getSaleData({dataSale, index})
        this.loaded = true
        if (this.leftTab !== 'goods') {
          if (index === 0) {
            this.$refs.bar1 && this.$refs.bar1.drawBar2(this.saleHandle(this.saleData.data))
          } else {
            this.$refs.bar1 && this.$refs.bar1.drawBar(this.dataHandle(this.saleData.data, obj.code), obj.rate)
          }
        }
        this.$refs.line1 && this.$refs.line1.drawLine(this.lineHandle(this.saleData.data, obj.code, obj.name), obj.rate)
      },
      // 切换商品售后模块（模块2）
      async changeServe(obj, index) {
        // this.selectMsg.serve = obj
        this.$set(this.selectMsg, 'serve', obj)
        this.$set(this.tabIndexControl, 'serve', index)
        this.requestServe.order_by = obj.code
        let data = Object.assign({}, this.requestPub, this.requestServe)
        await this.getServeData(data)
        this.$refs.bar2 && this.$refs.bar2.drawBar(this.data2Handle(this.serveData.data, obj.code), obj.rate)
        this.$refs.line2 && this.$refs.line2.drawLine(this.lineHandle(this.serveData.data, obj.code, obj.name), obj.rate)
      },
      // 切换商品采购模块（模块3）
      async changePurchase(obj, index) {
        this.$set(this.selectMsg, 'purchase', obj)
        this.$set(this.tabIndexControl, 'purchase', index)
        obj.code ? this.$set(this.requestPurchase, 'order_by', obj.code) : this.$delete(this.requestPurchase, 'order_by')
        obj.limit ? this.$set(this.requestPurchase, 'limit', obj.limit) : this.$delete(this.requestPurchase, 'limit')
        // this.requestPurchase.order_by = obj.code
        if (index === 1 && this.leftTab === 'all') {
          await this.getCategoryList({parent_id: 0, get_goods_count: 1, get_goods_online_count: 1})
        } else {
          let data = Object.assign({}, this.requestPub, this.requestPurchase)
          await this.getPurchaseData(data)
        }
        if (index === 0) {
          this.$refs.bar3 && this.$refs.bar3.drawBar1(this.purchaseHandle(this.purchaseData))
        } else {
          this.$refs.bar3 && this.$refs.bar3.drawBar(this.purchaseHandle(this.purchaseData), obj.rate)
        }
        this.$refs.pie3 && this.$refs.pie3.drawPie(this.pieHandle(this.purchaseData.data))
        this.$refs.line3 && this.$refs.line3.drawLine(this.lineHandle(this.purchaseData.data, obj.code, obj.name), obj.rate)
      },
      // 切换供应链模块（模块4）
      async changeSupply(obj, index) {
        this.loaded = false
        this.$set(this.selectMsg, 'supply', obj)
        this.$set(this.tabIndexControl, 'supply', index)
        obj.code ? this.$set(this.requestSupply, 'order_by', obj.code) : this.$delete(this.requestSupply, 'order_by')
        obj.limit ? this.$set(this.requestSupply, 'limit', obj.limit) : this.$delete(this.requestSupply, 'limit')
        if (index === 0) {
          this.initStockRankList()
        }
        let dataSupply = Object.assign({}, this.requestPub, this.requestSupply)
        await this.getSupplyData({dataSupply, index})
        this.loaded = true
        this.$refs.line4 && this.$refs.line4.drawLine(this.lineHandle(this.supplyData.data, obj.code, obj.name), obj.rate)
        this.$refs.bar4 && this.$refs.bar4.drawBar(this.dataHandle(this.supplyData.data, obj.code), obj.rate)
      },
      exportExcel(type) {
        this.excelType = type
        window.open(this.exportUrl(), '_blank')
      },
      exportUrl() {
        let currentId = this.getCurrentId()
        let token = this.$storage.get('auth.currentUser', '')
        let msg = {
          current_corp: currentId,
          current_shop: process.env.VUE_APP_CURRENT_SHOP,
          access_token: token.access_token
        }
        let word = JSON.parse(JSON.stringify(this['request' + this.firstUppercase(this.excelType)]))
        word.limit = 0
        let data = Object.assign({}, msg, this.requestPub, word)
        if (this.excelType.type === 'sale' && +this.tabIndexControl['sale'] === 0){
          delete data.order_by
        }
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        let url = this.exportUrlArr[this.excelType][this.tabIndexControl[this.excelType]]
        return process.env.VUE_APP_API + '/social-shopping/api/backend/data-center/goods/' + url + '?' + search.join('&')
      },
      firstUppercase(str) {
        let first = str[0].toUpperCase()
        return first+str.slice(1)
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
      // 切换时间时，通过改变每个块顶部tab栏的方式，获取当前所有模块的数据，并且重绘图表
      async getAllData() {
        this.$refs.statusTab1 && this.$refs.statusTab1.checkStatus(this.tabIndexControl['sale'], this.configObj[this.leftTab].sale[this.tabIndexControl['sale']])
        this.$refs.statusTab2 && this.$refs.statusTab2.checkStatus(this.tabIndexControl['serve'], this.configObj[this.leftTab].serve[this.tabIndexControl['serve']])
        this.$refs.statusTab3 && this.$refs.statusTab3.checkStatus(this.tabIndexControl['purchase'], this.configObj[this.leftTab].purchase[this.tabIndexControl['purchase']])
        this.$refs.statusTab4 && this.$refs.statusTab4.checkStatus(this.tabIndexControl['supply'], this.configObj[this.leftTab].supply[this.tabIndexControl['supply']])
      },
      saleHandle(data) {
        // if (!data || !data.length) return {xAx: [], series: []}
        let arr = [
          {
            name: '利润品',
            type: 'l'
          },
          {
            name: '引流品',
            type: 'y'
          },
          {
            name: '粘性品',
            type: 'n'
          },
          {
            name: '爆款品',
            type: 'b'
          },
          {
            name: '其他',
            type: 'o'
          }
        ]
        let newArr = arr.some(item => {
          return data[item.type]
        })
        if (!newArr) {
          return {
            xAx: [],
            series: []
          }
        }
        let xAx = arr.map(item => {
          return item.name
        })
        let series = arr.map(item => {
          return data[item.type]
        })
        return {
          xAx,
          series
        }
      },
      dataHandle(data, y1) {
        let newData = data.filter(item => {
          return item[y1] > 0
        })
        if (!data || !data.length || !newData.length) return {xAx: [], series: []}
        let xAx = data.map(val => {
          return val.name
        })
        let series = data.map(val => {
          return val[y1]
        })
        return {
          xAx,
          series
        }
      },
      data2Handle(data, y1) {
        if (!data || !data.length) return {xAx: [], series: []}
        let newData = data.filter(item => {
          return item[y1] > 0
        })
        let xAx = newData.map(val => {
          return val.name
        })
        let series = newData.map(val => {
          return val[y1]
        })
        return {
          xAx,
          series
        }
      },
      purchaseHandle(data) {
        let dataArr = data.data
        if (!dataArr.length) {
          return {
            xAx: [],
            series: [],
            salesNum: [],
            purchaseNum: [],
            salesNumAll: 0,
            purchaseNumAll: 0
          }
        }
        let xAx = dataArr.map(item => {
          return item.name
        })
        // 毛利率
        let series = dataArr.map(item => {
          return item.rate
        })
        // 销售数
        let salesNum = dataArr.map(item => {
          let num = (item.sales_num / data.sales_num * 100).toFixed(2)
          return Number.isFinite(Number(num))?num:'0.00'
        })
        // 采购数
        let purchaseNum = dataArr.map(item => {
          let num = (item.purchase_num / data.purchase_num * 100).toFixed(2)
          return Number.isFinite(Number(num)) ? num : '0.00'
        })
        let salesNumAll = data.sales_num
        let purchaseNumAll = data.purchase_num
        return {
          xAx,
          series,
          salesNum,
          purchaseNum,
          salesNumAll,
          purchaseNumAll
        }
      },
      pieHandle(data) {
        if (!data || !data.length) return []
        let series = data.map(item => {
          return {
            name: item.name,
            value: item.goods_count
          }
        })
        return series
      },
      lineHandle(data, code, type) {
        if (!data.length) return {
          label: '',
          data: [
            {
              x: [],
              rate: []
            }
          ]
        }
        let label = type
        let x = data.map(item => {
          return item.date ? item.date.split('-').slice(1).join('/') : ''
        })
        let rate = data.map(item => {
          return item[code]
        })
        return {
          label,
          data: [
            {
              x,
              rate
            }
          ]
        }
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
      overflow: hidden
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
          object-fit: cover
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
