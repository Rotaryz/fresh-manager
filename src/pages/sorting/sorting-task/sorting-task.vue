<template>
  <div class="procurement-task table">
    <div class="down-content">
      <!--时间选择-->
      <span class="down-tip">生成时间</span>
      <div class="down-item">
        <base-date-select :placeHolder="datePlaceHolder" :dateInfo="timeArr" @getTime="changeTime"></base-date-select>
      </div>
      <!--下拉选择-->
      <span class="down-tip">分类筛选</span>
      <div class="down-item down-group-item">
        <base-drop-down :select="filterTaskFrist" @setValue="_setValueFrist"></base-drop-down>
      </div>
      <div class="down-item">
        <base-drop-down :select="filterTaskSecond" @setValue="_setValueSecond"></base-drop-down>
      </div>
      <!--搜索-->
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="商品名称或编码" @search="_search"></base-search>
      </div>
    </div>
    <div class="table-content">
      <!--列表tab工具栏-->
      <div class="identification">
        <div class="identification-page">
          <img src="icon-warehousing@2x.png" class="identification-icon">
          <p class="identification-name">拣货任务列表</p>
          <base-status-tab :statusList="statusList" :infoTabIndex="statusTab" @setStatus="_setStatus"></base-status-tab>
        </div>
        <div class="function-btn">
          <div class="btn-main" @click="_exportPickingOrder">导出拣货单</div>
          <div class="btn-main g-btn-item" @click="_exportDeliveryOrder">导出配货单</div>
        </div>
      </div>
      <!--列表部分-->
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in sortingTask.list" :key="index" class="list-content list-box">
            <div class="list-item">{{item.goods_name}}</div>
            <div class="list-item">{{item.goods_category}}</div>
            <div class="list-item">{{item.base_num}}</div>
            <div class="list-item">{{item.base_wait_pick_num}}</div>
            <div class="list-item">{{item.base_out_of_num}}</div>
            <div class="list-item">{{item.position_name}}</div>
            <div class="list-item">{{item.merchant_num}}</div>
            <div class="list-item">
              <router-link class="list-operation" :to="{name:'sorting-task-detail',params:{id:item.id,goodsSkuCode:item.goods_sku_code}}">明细</router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pageDetail="sortingTask.pageTotal" @addPage="_getMoreList"></base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {sortingComputed, sortingMethods} from '@state/helpers'
  import API from '@api'

  const PAGE_NAME = 'PROCUREMENT_TASK'
  const TITLE = '拣货任务列表'
  const COMMODITIES_LIST = ['商品名称',  '分类', '下单数','待拣货数','缺货数','存放库位','待配商户数','操作']
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        datePlaceHolder:"选择下单日期",
        commodities: COMMODITIES_LIST,
        filterTaskFrist: {
          check: false,
          show: false,
          content: '全部',
          type: 'default',
          data: [{name: '全部', id: ''}]
        },
        filterTaskSecond: {
          check: false,
          show: false,
          content: '全部',
          type: 'default',
          data: [{name: '全部', id: ''}]
        },
        // 拣货任务列表
        statusTab:0,
        statusList: [
          {name: '全部', value: '', num: 0},
          {name: '待分拣', value: 0, num: 0},
          {name: '已分拣', value: 1, num: 0}
        ],
        activeStatus:''
      }
    },
    computed: {
      ...sortingComputed,
      timeArr(){
        return [ this.sortingTask.filter.timeStart, this.sortingTask.filter.timeEnd]
      }
    },
    created() {
      this._getClassifyList()
      this._getStausData()
    },
    methods: {
      ...sortingMethods,
      // goToDetail
      //  事件选择器
      changeTime(timeArr) {
        this.SET_TIME({timeArr})
        this.SET_PAGE({page:1})
        this.getSortingTaskList()
      },
      // 状态栏数据
      _getStausData(){
        API.Sorting.getStausData().then(res=>{
          console.log(res,'getStausData')
          let data = res.data
          let resData =data.map(item=>{
            return {name: item.status_str, value: item.status, num: item.statistic}
          })
          this.statusList = resData
        })
      },
      // 列表状态栏选择
      _setStatus(item) {
        this.SET_STATUS({status:item.value})
        this.SET_PAGE({page:1})
        this.getSortingTaskList()
      },
      // 分类数据
      _getClassifyList(){
        API.Sorting.getClassifyList().then(res=>{
          console.log(res,'getClassifyList')
          this.filterTaskFrist.data = res.data
        })
      },
      _setValueFrist(item) {
        this.SET_FILTER({value:item.value})
        this.SET_PAGE({page:1})
        this.getSortingTaskList()
        this.filterTaskSecond.data = item.children
        console.log(this.filterTaskFrist,'filterTaskFrist')
      },
      _setValueSecond(item) {
        this.SET_FILTER({value:item.value})
        this.SET_PAGE({page:1})
        this.getSortingTaskList()
      },
      _search(keyword) {
        this.SET_KEYWORD({keyword})
        this.SET_PAGE({page:1})
        this.getSortingTaskList()
      },
      // 导出分拣单
      _exportPickingOrder() {

      },
      // 导出配送单
      _exportDeliveryOrder() {

      },
      _getMoreList(page) {
        this.SET_PAGE({page})
        this.getSortingTaskList()
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .list-operation
    text-decoration: underline
</style>
