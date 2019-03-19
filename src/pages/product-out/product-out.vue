<template>
  <div class="procurement-task table">
    <div class="down-content">
      <!--时间选择-->
      <span class="down-tip">建单时间</span>
      <date-picker
        class="edit-input-box" type="date"
        placeholder="开始时间"
        style="width: 187px;height: 28px;border-radius: 1px"
        @on-change="changeStartTime"
      ></date-picker>
      <!--@on-change="_getStartTime"-->
      <div class="tip">~</div>
      <div class="down-item">
        <date-picker
          class="edit-input-box edit-input-right"
          type="date"
          placeholder="结束时间"
          style="width: 187px;height: 28px;border-radius: 1px"
          @on-change="changeEndTime"
        ></date-picker>
      </div>
      <!--下拉选择-->
      <span class="down-tip">状态</span>
      <div class="down-item">
        <base-drop-down :select="dispatchSelect" @setValue="setValue"></base-drop-down>
      </div>
      <!--搜索-->
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="出库单号或商户名称" @search="changeKeyword"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-warehousing@2x.png" class="identification-icon">
          <p class="identification-name">出库列表</p>
        </div>
        <div class="function-btn">
          <!--<div class="btn-main">新建出库单<span class="add-icon"></span></div>-->
          <router-link tag="div" :to="{path: `edit-store`}" append class="btn-main">新建出库单<span class="add-icon"></span></router-link>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in productOutList" :key="index" class="list-content list-box">
            <div class="list-item">{{item.build_time}}</div>
            <div class="list-item">{{item.order_sn}}</div>
            <div class="list-item">{{item.out_order_sn}}</div>
            <div class="list-item">{{item.merchant_name}}</div>
            <div class="list-item">{{item.total}}</div>
            <div class="list-item"><span class="list-status" :class="{'list-status-success': item.status === 1}"></span>{{item.status_str}}</div>
            <div class="list-item list-operation-box">
              <router-link tag="span" :to="{path: `out-detail/${item.out_order_id}`}" append class="list-operation">详情</router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination":pageDetail="pageTotal" @addPage="addPage"></base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {DatePicker} from 'iview'
  import _ from 'lodash'
  import API from '@api'
  import {productComputed} from '@state/helpers'

  const PAGE_NAME = 'PROCUREMENT_TASK'
  const TITLE = '成品出库'
  const COMMODITIES_LIST = ['建单时间', '出库单号', '关联订单号', '商户名称', '出库金额', '状态', '操作']
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DatePicker
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        productOutList: [],
        pageTotal: {},
        status: '',
        startTime: '',
        endTime: '',
        keyWord: '',
        goodsPage: 1,
        dispatchSelect: {
          check: false,
          show: false,
          content: '全部状态',
          type: 'default',
          data: [{name: '全部', value: ''}, {name: '待提交', value: 0}, {name: '已完成', value: 1}]
        }
      }
    },
    computed: {
      ...productComputed
    },
    created() {
      this.productOutList = _.cloneDeep(this.outList)
      this.pageTotal = _.cloneDeep(this.outPageTotal)
    },
    methods: {
      getProductListData() {
        let data = {
          status: this.status,
          page: this.goodsPage,
          limit: 10,
          start_time: this.startTime,
          end_time: this.endTime,
          keyword: this.keyWord
        }
        API.Store.getOutList(data, false).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.productOutList = res.data
            let statePageTotal = {
              total: res.meta.total,
              per_page: res.meta.per_page,
              total_page: res.meta.last_page
            }
            this.pageTotal = statePageTotal
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      changeKeyword(keyword) {
        this.keyWord = keyword
        this.goodsPage = 1
        this.getProductListData()
        this.$refs.pagination.beginPage()
      },
      changeStartTime(value) {
        this.startTime = value
        this.goodsPage = 1
        this.getProductListData()
        this.$refs.pagination.beginPage()
      },
      changeEndTime(value) {
        this.endTime = value
        this.goodsPage = 1
        this.getProductListData()
        this.$refs.pagination.beginPage()
      },
      setValue(item) {
        this.status = item.value
        this.goodsPage = 1
        this.getProductListData()
        this.$refs.pagination.beginPage()
      },
      addPage(page) {
        this.goodsPage = page
        this.getProductListData()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .procurement-task
    .list-box
      .list-item
        padding-right: 14px
        &:last-child
          flex: 0.4
        &:nth-child(8), &:nth-child(2)
          flex: 1.5

  .list-item-progress
    display: flex
    align-items: flex-end
    .progress-content
      .progress-num
        font-size: $font-size-10
        color: $color-text-main
        line-height: 1
        margin-bottom: 5px
        font-family: $font-family-regular
      .progress-bar
        margin: 0
        width: 100px
        height: 5px
        border-radius: 3px
        background: #EBEBEB
        position: relative
        .progress-bar-active
          height: 100%
          position: absolute
          top: 0
          left: 0
          border-radius: 3px
          background: $color-main
          width: 50%
    .progress-percentage
      margin-left: 8px
      line-height: 1
      font-size: $font-size-14

  .tip
    margin :0 2px
    font-size: $font-size-14
</style>
