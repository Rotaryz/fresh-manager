<template>
  <div class="community-data">
    <div class="data-caption data-caption-line">
      <div class="content-title">
        <img src="./icon-qundata@2x.png" alt="" class="title-icon">
        <div class="data-title">微信群运营数据概况</div>
      </div>
      <base-date-picker :infoTab="0" :arrTitle="arrTitle" @checkTime="_getData"></base-date-picker>
    </div>
    <div class="data-content">
      <left-tab @editGroup="editGroup" @changeCommunity="changeCommunity"></left-tab>
      <div class="right-data">
        <div class="top-sec">
          <!--群质量-->
          <section class="data-sec quality-data">
            <div class="sec-title">
              <p class="text">
                群质量数据
                <span v-if="+letTab !== 0">(当前等级Lv{{leftTabItem.level || 0}})</span>
                <status-tab ref="statusTab1" :statusList="dataConfig.quality.tab" @setStatus="changeQuality"></status-tab>
              </p>
              <p class="right-text hand" @click="showDescription('quality')">等级说明 <img class="text-icon" src="./icon-help_lv@2x.png" alt=""></p>
            </div>
            <div class="data-view">
              <p v-for="(item, index) in dataConfig.quality.viewData[qualityIndex]" :key="index" class="item">
                <span class="name">{{item.name}}</span>
                <span class="num">{{item.data}}</span>
              </p>
            </div>
            <!--群质量图表-->
            <!--<quality-data ref="qualityData" :time="request.day_type" @changeQuality="changeQuality"></quality-data>-->
            <chart-line ref="qualityChart" chartId="qualityChart"></chart-line>
          </section>

          <!--群运营-->
          <section class="data-sec business-data">
            <div class="sec-title">
              <p class="text">
                群运营数据
                <status-tab ref="statusTab2" :statusList="dataConfig.business.tab" @setStatus="changeBusiness"></status-tab>
              </p>
              <!--<p class="right-text hand" @click="showDescription('business')">数据说明 <img class="text-icon" src="./icon-help_lv@2x.png" alt=""></p>-->
            </div>

            <div class="data-view">
              <p v-for="(item, index) in dataConfig.business.viewData[businessIndex]" :key="index" class="item">
                <span class="name">{{item.name}}</span>
                <span class="num">{{item.data}}</span>
              </p>
            </div>
            <!--群运营图表-->
            <!--<business-data ref="businessData" :time="request.day_type" @changeBusiness="changeBusiness"></business-data>-->
            <chart-line ref="businessChart" chartId="businessChart"></chart-line>
          </section>
        </div>
        <div class="bottom-sec">
          <!--群用户分组-->
          <section class="data-sec group-data">
            <div class="sec-title">
              <p class="text">
                群用户分组
                <span v-if="+letTab !== 0">(群总人数{{leftTabItem.total || 0}})</span>
                <status-tab ref="statusTab3" :statusList="dataConfig.group.tab" @setStatus="changeGroup"></status-tab>
              </p>
            </div>

            <div class="data-view">
              <p v-for="(item, index) in dataConfig.group.viewData[groupIndex]" :key="index" class="item">
                <span class="name">{{item.name}}</span>
                <span class="num">{{item.data}}</span>
              </p>
            </div>
            <!--用户分组图表-->
            <!--<group-data ref="groupData" :time="request.day_type" @changeGroup="changeGroup"></group-data>-->
            <chart-line ref="groupChart" chartId="groupChart"></chart-line>
          </section>

          <!--商品TOP10-->
          <section class="data-sec goods-list">
            <div class="sec-title">
              <p class="text">最受欢迎商品Top10</p>
            </div>
            <!--商品TOP10列表-->
            <goods-list :time="request.day_type"></goods-list>
          </section>
        </div>
      </div>
    </div>
    <description-modal ref="description"></description-modal>
    <edit-modal ref="editModal" @confirm="confirm"></edit-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {communityComputed, communityMethods} from '@state/helpers'
  import ChartLine from './chart-line/chart-line'
  import LeftTab from './left-tab/left-tab'
  import StatusTab from './status-tab/status-tab'
  import GoodsList from './goods-list/goods-list'
  import EditModal from './edit-modal/edit-modal'
  import DescriptionModal from './description-modal/description-modal'

  import API from '@api'
  const ARR_TITLE = [
    {title: '日', status: 'date'},
    {title: '周', status: 'week'},
    {title: '月', status: 'month'},
  ]
  const DATA_CONFIG = {
    quality: {
      tab: [
        {name: '流量'},
        {name: '订单'}
      ],
      viewData: [
        [
          {name: '浏览量(PV)', data: '100', code: 'pv'},
          {name: '访客数(UV)', data: '200', code: 'e_customer'}
        ],
        [
          {name: '支付用户', data: '100', code: 'pv'},
          {name: '支付订单', data: '200', code: 'e_customer'},
          {name: '交易金额', data: '200', code: 'order'}
        ]
      ]
    },
    business: {
      tab: [
        {name: '营收金额'},
        {name: '主力客户'},
        {name: '复购率'},
        {name: '笔单价'}
      ],
      viewData: [
        [
          {name: '营收金额', data: '100', code: 'profit'}
        ],
        [
          {name: '主力客户', data: '200', code: 'e_customer'}
        ],
        [
          {name: '复购率', data: '100', code: 'e_order_avg'}
        ],
        [
          {name: '笔单价', data: '200', code: 'per_order'}
        ]
      ]
    },
    group: {
      tab: [
        {name: '用户数量'},
        {name: '用户效率'}
      ],
      viewData: [
        [
          {name: '潜在客户', data: '500', code: 'p_customer'},
          {name: '新客户', data: '200', code: 'n_customer'},
          {name: '主力客户', data: '200', code: 'e_customer'},
          {name: '沉睡客户', data: '200', code: 's_customer'}
        ],
        [
          {name: '用户效率', data: '100', code: 'n_customer'}
        ]
      ]
    }
  }
  const PAGE_NAME = 'COMMUNITY-DATA'
  const TITLE = '社群数据'
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      LeftTab,
      StatusTab,
      ChartLine,
      GoodsList,
      EditModal,
      DescriptionModal
    },
    data() {
      return {
        dataConfig: DATA_CONFIG,
        arrTitle: ARR_TITLE,
        letTab: 0,
        tabArr: [],
        request: {
          wx_group_id: '',
          day_type: 'day',
          start_date: ''
        },
        editGroupItem: {},
        leftTabItem: {},
        qualityIndex: 0,
        businessIndex: 0,
        groupIndex: 0,
        noDraw: false
      }
    },
    computed: {
      ...communityComputed
    },
    watch: {
      qualityData(value, old) {
        let code = 'quality'
        this.$refs[code + 'Chart']._setChart(this.dataHandle(value.data[this[code + 'Index']], code), true, true)
      },
      businessData(value, old) {
        let code = 'business'
        this.$refs[code + 'Chart']._setChart(this.dataHandle(value.data[this[code + 'Index']], code), true, true)
      },
      groupData(value, old) {
        let code = 'group'
        this.$refs[code + 'Chart']._setChart(this.dataHandle(value.data[this[code + 'Index']], code), true, true)
      }
    },
    created() {
      this.getAllData()
    },
    methods: {
      ...communityMethods,
      _getData(value) {
        this.request.day_type = value
        this.getAllData()
      },
      // 切换质量数据tab栏
      changeQuality(item, index) {
        this.qualityIndex = index
        if (this.noDraw) return
        let code = 'quality'
        this.$refs[code + 'Chart']._setChart(this.dataHandle(this[code + 'Data'].data[index], code), true, true)
      // this.getQualityData(this.request)
      },
      // 切换运营数据tab栏
      changeBusiness(item, index) {
        this.businessIndex = index
        if (this.noDraw) return
        let code = 'business'
        this.$refs[code + 'Chart']._setChart(this.dataHandle(this[code + 'Data'].data[index], code), true, true)
      // this.getBusinessData(this.request)
      },
      // 切换用户分组tab栏
      changeGroup(item, index) {
        this.groupIndex = index
        if (this.noDraw) return
        let code = 'group'
        this.$refs[code + 'Chart']._setChart(this.dataHandle(this[code + 'Data'].data[index], code), true, true)
      // this.getGroupData(this.request)
      },
      // 切换左侧tab栏
      changeCommunity(index, item) {
        this.leftTabItem = item
        this.letTab = index
        this.request.wx_group_id = item.id
        this.noDraw = true
        this.$refs.statusTab1.checkStatus(0, '')
        this.$refs.statusTab2.checkStatus(0, '')
        this.$refs.statusTab3.checkStatus(0, '')
        this.getAllData()
      },
      showDescription(type) {
        this.$refs.description.show(type)
      },
      async editGroup(item) {
        this.editGroupItem = item
        this.$refs.editModal.show(item)
      // groupAccount帐号  groupName群名  personNumber群人数 id//
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
        this.getQualityData(this.request)
        this.getBusinessData(this.request)
        this.getGroupData(this.request)
        this.getGoodsList(this.request)
        this.noDraw = false
      },
      dataHandle(data, type) {
        // data = [
        //   {
        //     rate: [[], []],
        //     x: []
        //   }
        // ]
        // 几个tab栏
        let ind = this[type + 'Index']
        let tab = this.dataConfig[type].viewData[ind]
        // tab栏下对应的数据
        let dataArr = tab.map((item, index) => {
          return {
            name: item.name,
            data: data.rate[index]
          }
        })
        let xAxleData = data.x
        return {
          dataArr,
          xAxleData
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .community-data
    overflow: hidden
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
        padding: 0 20px
        justify-content: space-between
        align-items: center
        font-family: $font-family-regular
        border-bottom-1px($color-line)
        .text
          font-size: $font-size-16
          color: $color-text-main
          display: flex
        .right-text
          display: flex
          align-items: center
          font-size: $font-size-14
          color: #666
          .text-icon
            width: 14px
            height: 14px
            margin-left: 4px
      .data-view
        display: flex
        color: #333
        margin-top: 20px
        .item
          margin-left: 20px
          display: flex
          align-items: center
        .name
          font-size: $font-size-12
          font-family: $font-family-regular
        .num
          margin-left: 4px
          font-family: $font-family-din-bold
          font-size: $font-size-16
          line-height: 16px
    .bottom
      height: 0


</style>
