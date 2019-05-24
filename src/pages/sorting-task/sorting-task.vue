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
        <base-search placeHolder="商品名称或商品编码" @search="_search"></base-search>
      </div>
    </div>
    <div class="table-content">
      <!--列表tab工具栏-->
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-warehousing@2x.png" class="identification-icon">
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
          <div v-for="(item,index) in commodities" :key="index" class="list-item" :style="{flex:item.flex}" :class="['list-item',item.class]">{{item.tilte}}</div>
        </div>
        <div class="list">
          <template v-if="sortingTask.list.length">
            <div v-for="(row, index) in sortingTask.list" :key="index" class="list-content list-box">
              <div v-for="item in commodities" :key="item.title" :style="{flex:item.flex}" :class="['list-item',item.class]">
                <template v-if="item.type==='operate'">
                  <router-link class="list-operation" :to="{name:'sorting-task-detail',params:{id:row.id,goods_sku_code:row.goods_sku_code}}">{{item.replace}}</router-link>
                </template>

                <template v-else>
                  {{row[item.key]}}
                  <template v-if="item.after">
                    {{row[item.after]}}
                  </template>
                  <div v-if="item.afterBr">
                    {{row[item.afterBr]}}
                  </div>
                </template>
              </div>
            </div>
          </template>
          <base-blank v-else></base-blank>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pageDetail="sortingTask.pageTotal" @addPage="_getMoreList"></base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {authComputed, sortingComputed, sortingMethods} from '@state/helpers'
  import API from '@api'

  const PAGE_NAME = 'PROCUREMENT_TASK'
  const TITLE = '拣货任务列表'
  const COMMODITIES_LIST = [
    {tilte: '生成时间', key: 'created_at', flex: '1.5'},
    {tilte: '商品名称', key: 'goods_name', flex: '2', afterBr: 'goods_sku_encoding'},
    {tilte: '分类', key: 'goods_category', flex: '2'},
    {tilte: '下单数', key: 'sale_num', after: "sale_unit"},
    {tilte: '待拣货数', key: 'sale_wait_pick_num', after: "sale_unit"},
    {tilte: '缺货数', key: 'sale_out_of_num', after: "sale_unit"},
    {tilte: '存放库位', key: 'position_name', flex: '2'},
    {tilte: '待配商户数', key: 'merchant_num'},
    {tilte: '操作', key: 'id', type: "operate", replace: "明细", class: 'operate'}]
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        datePlaceHolder: "选择生成日期",
        commodities: COMMODITIES_LIST,
        filterTaskFrist: {
          check: false,
          show: false,
          content: '一级分类',
          type: 'default',
          data: [{name: '全部', id: ''}]
        },
        filterTaskSecond: {
          check: false,
          show: false,
          content: '二级分类',
          type: 'default',
          data: [{name: '全部', id: ''}]
        },
        // 拣货任务列表
        statusTab: 1,  // 待分拣
        statusList: [
          {name: '全部', value: '', num: 0},
          {name: '待分拣', value: 0, num: 0},
          {name: '已分拣', value: 1, num: 0}
        ],
        activeStatus: '',
        exportUrl: ""
      }
    },
    computed: {
      ...sortingComputed,
      timeArr() {
        return [this.sortingTask.filter.start_time, this.sortingTask.filter.end_time]
      }
    },
    created() {
      this._getFristList()
      this._getStatusData()
    },
    methods: {
      ...authComputed,
      ...sortingMethods,
      // 更新列表
      _updateList(params={}, noUpdataStatus) {
        this.SET_PARAMS(params)
        this.getSortingTaskList()
        if (!noUpdataStatus) {
          this._getStatusData()
        }
        if (params.page === 1) {
          this.$refs.pagination.beginPage()
        }
      },
      //  事件选择器
      changeTime(timeArr) {
        this._updateList({
          start_time: timeArr[0],
          end_time: timeArr[1],
          page: 1
        })
      },
      // 状态栏数据
      _getStatusData() {
        let params = {
          start_time: this.sortingTask.filter.start_time,
          end_time: this.sortingTask.filter.end_time,
          goods_category_id: this.sortingTask.filter.goods_category_id,
          keyword: this.sortingTask.filter.keyword
        }
        API.Sorting.getStausData(params).then(res => {
          if (res.error !== this.$ERR_OK) {
            return false
          }
          let data = res.data
          let resData = data.map(item => {
            return {name: item.status_str, value: item.status, num: item.statistic}
          })
          this.statusList = resData
        })
      },
      // 列表状态栏选择
      _setStatus(item) {
        this._updateList({status: item.value, page: 1}, true)
      },
      // 分类数据
      _getClassifyList(params) {
        return API.Sorting.getClassifyList(params).then(res => {
          if (res.error !== this.$ERR_OK) {
            return false
          }
          return res
        })
      },
      _getFristList() {
        this._getClassifyList().then(res => {
          if(!res) return false
          this.filterTaskFrist.data = [{name: '全部', id: ''},...res.data]
        })
      },
      _setValueFrist(item) {
        this._updateList({goods_category_id: item.id || '', page: 1})
        this._getClassifyList({
          'parent_id': item.id,
        }).then(res => {
          if(!res) return false
          this.filterTaskSecond.content = '全部'
          this.filterTaskSecond.data = [{name: '全部', id: item.id},...res.data]
        })
      },
      _setValueSecond(item) {
        if (!item.id) {
          return
        }
        this._updateList({goods_category_id: item.id, page: 1})
      },
      _search(keyword) {
        this._updateList({keyword, page: 1})
      },
      _getUrl() {
        let obj = this.sortingTask.filter
        let data = {
          current_corp: this.getCurrentId(),
          access_token: this.currentUser().access_token,
          goods_category_id: obj.goods_category_id,
          start_time: obj.start_time,
          end_time: obj.end_time,
          keyword: obj.keyword,
          status: obj.status
        }
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        return '?' + search.join('&')
      },
      // 导出分拣单
      _exportPickingOrder() {
        API.Sorting.exportPickingOrder(this._getUrl())
      },
      // 导出配送单
      async _exportDeliveryOrder() {
        await API.Sorting.exportDeliveryOrder(this._getUrl())
        setTimeout(()=>{
          this._updateList({page:1})
        },500)
      },
      _getMoreList(page) {
        this._updateList({page})
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .operate
    max-width: 50px

  .list-operation
    text-decoration: underline

  .down-content .down-group-item
    margin-right: 10px
</style>
