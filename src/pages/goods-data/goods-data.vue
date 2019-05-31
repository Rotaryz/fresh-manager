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
          <section class="data-sec">
            <div class="sec-title">
              <div class="title-left">
                <p class="text">商品销售</p>
                <status-tab ref="statusTab1" :statusList="configObj[leftTab].sale" @setStatus="changeSale"></status-tab>
              </div>
              <div class="title-right">
                <span v-if="selectMsg.sale.big" :key="1" class="show-big-icon hand" @click="showBigData(selectMsg.sale.type)"></span>
                <span v-if="selectMsg.sale.excel" :key="2" class="export-btn hand" @click="exportExcel('sale')">导出Excel</span>
              </div>
            </div>
            <div v-if="selectMsg.sale.type === 'goodsDetail'" class="name-text hand" @click="showDescription(saleData.data.type_name)">
              <p class="item">商品结构 <span class="name">{{saleData.data.type_name}}</span> <img src="./icon-help_lv@2x.png" alt="" class="icon"></p>
            </div>

            <div v-if="selectMsg.sale.type !== 'goods' && selectMsg.sale.type !== 'goodsDetail'" class="name-text">
              <p class="item">{{selectMsg.sale.name}}<span class="data">{{saleData[selectMsg.sale.code + '_total'] || saleData[selectMsg.sale.code] || 0}}{{selectMsg.sale.rate && '%'}}</span></p>
            </div>

            <div v-if="selectMsg.sale.type === 'goodsDetail'" class="goods-structor">
              <div class="goods-msg">
                <img :src="saleData.data.image_url" alt="" class="goods-image">
                <div class="goods-detail">
                  <p class="title">{{saleData.data.name}}</p>
                  <p class="price">¥ {{saleData.data.sales_num}}</p>
                </div>
              </div>
              <div class="data-list">
                <div class="view">
                  <p class="text">浏览量 <img src="./icon-high@2x.png" alt="" class="icon"></p>
                  <p class="num">{{saleData.data.views}}</p>
                </div>
                <div class="view">
                  <p class="text">销售数量 <img src="./icon-high@2x.png" alt="" class="icon"></p>
                  <p class="num">{{saleData.data.sales_num}}</p>
                </div>
                <div class="view">
                  <p class="text">销售额(元)</p>
                  <p class="num">{{saleData.data.sales_amount}}</p>
                </div>
              </div>
            </div>
            <goods-list v-if="selectMsg.sale.type === 'goods'" type="sales" :list="saleRankList" @changeGoodsRank="changeGoodsRank"></goods-list>
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
                <span v-if="selectMsg.serve.excel" class="export-btn hand" @click="exportExcel('serve')">导出Excel</span>
              </div>
            </div>
            <div class="name-text">
              <p class="item">{{selectMsg.serve.name}}<span class="data">{{serveData[selectMsg.serve.code + '_total'] || serveData[selectMsg.serve.code] || 0}}{{selectMsg.serve.rate && '%'}}</span></p>
            </div>
            <bar-data v-if="selectMsg.serve.type === 'bar'" ref="bar2" chartId="bar2" @click="setClickChart('purchase')" @clickChart="clickChart"></bar-data>
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
                <span v-if="selectMsg.purchase.excel" class="export-btn hand" @click="exportExcel('purchase')">导出Excel</span>
              </div>
            </div>
            <div class="name-text">
              <p class="item">{{selectMsg.purchase.name}}<span class="data">{{purchaseData[selectMsg.purchase.code + '_total'] || purchaseData[selectMsg.purchase.code] || 0}}{{selectMsg.purchase.rate && '%'}}</span></p>
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
                <span v-if="selectMsg.supply.excel" :key="2" class="export-btn hand" @click="exportExcel('supply')">导出Excel</span>
              </div>
            </div>
            <div v-if="selectMsg.supply.type !== 'goods'" class="name-text">
              <p class="item">{{selectMsg.supply.name}}<span class="data">{{supplyData[selectMsg.supply.code + '_total'] || supplyData[selectMsg.supply.code] || 0}}{{selectMsg.supply.rate && '%'}}</span></p>
            </div>
            <goods-list v-if="selectMsg.supply.type === 'goods'" type="stock" :list="stockRankList"></goods-list>
            <bar-data v-if="selectMsg.supply.type === 'bar'" ref="bar4" chartId="bar4"></bar-data>
            <line-data v-if="selectMsg.supply.type === 'line'" ref="line4" chartId="line4" class="chart-box"></line-data>
          </section>
        </div>
      </div>
    </div>

    <description-modal ref="description"></description-modal>

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
    {title: '30天', status: 'month'},
    {title: '自定义', status: 'custom'}
  ]
  // 导出接口
  const EXPORT_URL = {
    sale: ['goods-structure-excel', 'sale-rank-excel'],
    serve: ['after-server-excel'],
    purchase: ['purchase-data-excel', 'purchase-data-sku-excel'],
    aupply: ['sale-rank-excel']
  }
  const ALL_DATA = {
    all: {
      sale: [
        {name: '商品结构', type: 'bar', excel: true, code: 't'},
        {name: '销量排行榜', type: 'goods', excel: true, code: 'num'},
        {name: '动销率', type: 'bar', big: true, rate: true, code: 'pin_rate'},
        {name: '售罄率', type: 'bar', big: true, rate: true, code: 'out_rate'}
      ],
      serve: [
        {name: '退货数', type: 'bar', big: true, excel: true, code: 'returns_num'},
        {name: '退货率', type: 'bar', big: true, code: 'rate', rate: true}
      ],
      purchase: [
        {name: '采购匹配度', type: 'bar1', big: true, excel: true, code: 'purchase_num'},
        {name: '商品SPU数', type: 'pie', big: true, excel: true, code: 'sku_num'},
        {name: '毛利率', type: 'bar', big: true, rate: true, code: 'rate'}
      ],
      supply: [
        {name: '库存排行', type: 'goods', excel: true, code: 'num'},
        {name: '库存周转率', type: 'bar', big: true, rate: true, code: 'rate'}
      ]
    },
    category: {
      sale: [
        {name: '商品结构', type: 'bar', excel: true },
        {name: '销量排行榜', type: 'goods', excel: true, code: 'num'},
        {name: '动销率', type: 'bar', big: true, rate: true, code: 'pin_rate'},
        {name: '售罄率', type: 'bar', big: true, rate: true, code: 'out_rate'}
      ],
      serve: [
        {name: '退货数', type: 'bar', big: true, excel: true, code: 'returns_num'},
        {name: '退货率', type: 'bar', big: true, code: 'rate', rate: true}
      ],
      purchase: [
        {name: '采购匹配度', type: 'bar1', big: true, excel: true, code: 'purchase_num'},
        {name: '毛利率', type: 'bar', big: true, rate: true, code: 'rate'}
      ],
      supply: [
        {name: '库存排行', type: 'goods', excel: true, code: 'num'},
        {name: '库存周转率', type: 'bar', big: true, rate: true, code: 'rate'}
      ]
    },
    goods: {
      sale: [
        {name: '商品结构', type: 'goodsDetail'},
        {name: '销量', type: 'line'},
        {name: '动销率', type: 'line', rate: true, code: 'pin_rate'},
        {name: '售罄率', type: 'line', rate: true, code: 'out_rate'}
      ],
      serve: [
        {name: '退货数', type: 'line', code: 'returns_num'},
        {name: '退货率', type: 'line', code: 'rate', rate: true}
      ],
      purchase: [
        {name: '采购数量', type: 'line', code: 'purchase_num'},
        {name: '毛利率', type: 'line', rate: true, code: 'rate'}
      ],
      supply: [
        {name: '库存', type: 'line', code: 'num'},
        {name: '库存周转率', type: 'line', rate: true, code: 'rate'}
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
          limit: 6
        },
        requestServe: {
          order_by: 'returns_num',
          limit: 6
        },
        requestPurchase: {
          order_by: 'purchase_num',
          limit: 6
        },
        requestSupply: {
          order_by: 'purchase_num',
          limit: 6
        },
        requestPub: {
          date_type: 'week',
          group_by: 'cate'
        },
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
        tabIndexControl: {
          sale: 0,
          serve: 0,
          purchase: 0,
          supply: 0
        },
        leftTabItem: {},
        leftTab: 'all', // 左侧tab栏 all全部商品 category分类 goods商品,
        exportUrlArr: EXPORT_URL,
        excelType: '',
        clickSec: '',
        clickChartIndex: ''
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
      let dataSale = Object.assign(this.requestPub, this.requestSupply)
      await this.getSaleData({dataSale, index: 0})
      // this.$refs.bar1 && this.$refs.bar1.drawBar2(this.saleHandle(this.saleData.data))
      // 商品售后模块
      let dataServe = Object.assign(this.requestPub, this.requestServe)
      await this.getServeData(dataServe)
      // this.$refs.bar2 && this.$refs.bar2.drawBar(this.dataHandle(this.serveData.data, 'name', this.selectMsg.serve.code))
      // 商品采购模块
      let dataPurchase = Object.assign(this.requestPub, this.requestPurchase)
      await this.getPurchaseData(dataPurchase)
      // this.$refs.bar3 && this.$refs.bar3.drawBar1(this.purchaseHandle(this.purchaseData))
      this._initDraw()
      // 供应链模块
      let dataSupply = Object.assign(this.requestPub, this.requestSupply)
      this.getSupplyData({dataSupply, index: 0})
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
      setClickChart(index) {
        console.log(index)
        this.clickSec = index
      },
      clickChart(index) {
        console.log(12)
        this.clickChartIndex = index
        // let arr = ['sale', 'serve', 'purchase', 'supply']
        // let id = this.selectMsg
        // if (this.leftType === 'all') {
        //   // this.$refs.goodsTab.selectList(index, goodsIndex)
        // }
      },
      showBigData(type) {
        this.bigDataShow = true
        this.$nextTick(() => {
          if (type === 'bar1') {
            this.$refs.bigBar && this.$refs.bigBar.drawBar1(this.purchaseHandle(this.purchaseData))
          } else {
            this.$refs.bigBar && this.$refs.bigBar.drawBar({xAx: [], series: []})
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
      async changeTab(item, type, code) {
        if (this.leftTabItem.id === item.id) return
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
        this._initSelect()
        this.getGoodsList({goods_category_id: item.id, is_online: 1, keyword: ''})
        let data = Object.assign(this.requestPub, this.requestPurchase)
        await this.getPurchaseData(data)
        this.$nextTick(() => {
          if (code === 'all' || code === 'category') {
            this._initDraw()
          } else if (code === 'goods') {
            this.$refs.line2 && this.$refs.line2.drawLine(this.lineHandle(this.serveData.data, this.selectMsg.serve.code, this.selectMsg.serve.name))
            this.$refs.line3 && this.$refs.line3.drawLine(this.lineHandle(this.purchaseData.data, this.selectMsg.purchase.code, this.selectMsg.purchase.name))
            this.$refs.line4 && this.$refs.line4.drawLine(this.lineHandle(this.supplyData.data, this.selectMsg.supply.code, this.selectMsg.supply.name))
          }
        })
      },
      _initDraw() {
        this.$refs.bar1 && this.$refs.bar1.drawBar2(this.saleHandle(this.saleData.data))
        this.$refs.bar2 && this.$refs.bar2.drawBar(this.dataHandle(this.serveData.data,  this.selectMsg.serve.code))
        this.$refs.bar3 && this.$refs.bar3.drawBar1(this.purchaseHandle(this.purchaseData))
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
        this.$set(this.tabIndexControl, 'sale', index)
        this.requestSale.order_by = obj.code
        let dataSale = Object.assign(this.requestPub, this.requestSale)
        if (index === 1) {
          dataSale.limit = 10
        }
        await this.getSaleData({dataSale, index})
        this.$nextTick(() => {
          if (index === 0) {
            this.$refs.bar1 && this.$refs.bar1.drawBar2(this.saleHandle(this.saleData.data))
          } else {
            this.$refs.bar1 && this.$refs.bar1.drawBar(this.dataHandle(this.saleData.data, obj.code), obj.rate)
            this.$refs.line1 && this.$refs.line1.drawLine(this.lineHandle(this.saleData.data, obj.code, obj.name), obj.rate)
          }
        })
      },
      // 切换商品售后模块（模块2）
      async changeServe(obj, index) {
        this.selectMsg.serve = obj
        this.$set(this.tabIndexControl, 'serve', index)
        this.requestServe.order_by = obj.code
        let data = Object.assign(this.requestPub, this.requestServe)
        await this.getServeData(data)
        this.$nextTick(() => {
          this.$refs.bar2 && this.$refs.bar2.drawBar(this.dataHandle(this.serveData.data, obj.code), obj.rate)
          this.$refs.line2 && this.$refs.line2.drawLine(this.lineHandle(this.serveData.data, obj.code, obj.name), obj.rate)
        })
      },
      // 切换商品采购模块（模块3）
      async changePurchase(obj, index) {
        this.selectMsg.purchase = obj
        this.$set(this.tabIndexControl, 'purchase', index)
        this.requestPurchase.order_by = obj.code
        let data = Object.assign(this.requestPub, this.requestPurchase)
        await this.getPurchaseData(data)
        this.$nextTick(() => {
          if (index === 0) {
            this.$refs.bar3 && this.$refs.bar3.drawBar1(this.purchaseHandle(this.purchaseData))
          } else {
            this.$refs.bar3 && this.$refs.bar3.drawBar(this.purchaseHandle(this.purchaseData), obj.rate)
            this.$refs.pie3 && this.$refs.pie3.drawPie(this.pieHandle(this.purchaseData))
            this.$refs.line3 && this.$refs.line3.drawLine(this.lineHandle(this.purchaseData.data, obj.code, obj.name), obj.rate)
          }
        })
      },
      // 切换供应链模块（模块4）
      async changeSupply(obj, index) {
        this.selectMsg.supply = obj
        this.$set(this.tabIndexControl, 'supply', index)
        this.requestSupply.order_by = obj.code
        let dataSupply = Object.assign(this.requestPub, this.requestSupply)
        await this.getSupplyData({dataSupply, index})
        this.$nextTick(() => {
          console.log(this.supplyData, 1123)
          this.$refs.line4 && this.$refs.line4.drawLine(this.lineHandle(this.supplyData.data, obj.code, obj.name), obj.rate)
          this.$refs.bar4 && this.$refs.bar4.drawBar(this.dataHandle(this.supplyData.data, obj.code), obj.rate)
        })
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
        // this[this.excelType[0].toUpperCase()]
        let data = Object.assign(msg, this.requestPub, this['request' + this.firstUppercase(this.excelType)])
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        let url = this.exportUrlArr[this.excelType][this.tabIndexControl[this.excelType]]
        console.log(url)
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
      async getAllData() {
        await this.getSaleData(Object.assign(this.requestPub, this.requestSale))
        await this.getServeData(Object.assign(this.requestPub, this.requestServe))
        await this.getPurchaseData(Object.assign(this.requestPub, this.requestPurchase))
        await this.getSupplyData(Object.assign(this.requestPub, this.requestSupply))
      },
      saleHandle(data) {
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
            type: 'q'
          }
        ]
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
        console.log(data)
        if (!data.length) return {xAx: [], series: []}
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
          return item.sales_num
        })
        // 采购数
        let purchaseNum = dataArr.map(item => {
          return item.purchase_num
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
        if (!data.length) return {
          name: '',
          value: ''
        }
        let series = data.map(item => {
          return {
            name: item.name,
            value: item.sku_num
          }
        })
        return series
      },
      lineHandle(data, code, type) {
        let label = type
        let x = data.map(item => {
          return item.date.split('-').slice(1).join('/')
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
