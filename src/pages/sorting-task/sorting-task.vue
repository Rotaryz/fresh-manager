<template>
  <div class="procurement-task table">
    <div class="empty-50">
      <base-tabs :tabList="tabStatus"
                 :defaultTab="sortingTask.filter.sorting_mode"
                 :isShowMark="false"
                 tabAlign="left"
                 padding="12px 5px"
                 margin="0 10px"
                 defaultColor="#333333"
                 class="tab-top"
                 @tab-change="tabChange"
      ></base-tabs>
    </div>
    <div class="down-content">
      <!--时间选择-->
      <span class="down-tip">生成时间</span>
      <div class="down-item">
        <base-date-select :placeHolder="datePlaceHolder" :dateInfo="timeArr" :editable="false" @getTime="changeTime"></base-date-select>
      </div>
      <span class="down-tip">异常状态</span>
      <div class="down-item">
        <base-drop-down :select="errorObj" @setValue="checkErr"></base-drop-down>
      </div>
      <template v-if="sortingTask.filter.sorting_mode === 0">
        <span class="down-tip">线路筛选</span>
        <div class="down-item">
          <base-drop-down :select="roadList" @setValue="checkRoad"></base-drop-down>
        </div>
      </template>
      <!--下拉选择-->
      <template v-if="sortingTask.filter.sorting_mode === 1">
        <span class="down-tip">类目筛选</span>
        <!--<div class="down-item down-group-item">-->
        <!--<base-drop-down :select="filterTaskFrist" @setValue="setValueFrist"></base-drop-down>-->
        <!--</div>-->
        <!--<div class="down-item">-->
        <!--<base-drop-down :select="filterTaskSecond" @setValue="setValueSecond"></base-drop-down>-->
        <!--</div>-->
        <div class="down-item down-group-item">
          <base-drop-down :select="stairSelect" @setValue="setStairValue"></base-drop-down>
        </div>
        <div class="down-item down-group-item">
          <base-drop-down :select="secondSelect" @setValue="setSecondValue"></base-drop-down>
        </div>
        <!--<div class="down-item">
          <base-drop-down :select="thirdlySelect" @setValue="setThirdlyValue"></base-drop-down>
        </div>-->
      </template>
      <!--搜索-->
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search ref="research" :placeHolder="sortingTask.filter.sorting_mode===0?'团长订单号/社区名称':'商品名称/商品编码'" :infoText="sortingTask.filter.keyword" @search="searchBtn"></base-search>
      </div>
    </div>
    <div class="table-content">
      <!--列表tab工具栏-->
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-warehousing@2x.png" class="identification-icon">
          <p class="identification-name">分拣任务</p>
          <base-status-nav :statusList="statusList" :value="sortingTask.filter.status" valueKey="status" labelKey="status_str" numKey="statistic"
                           @change="setStatus"
          ></base-status-nav>
        </div>
        <div class="function-btn">
          <template v-if="sortingTask.filter.sorting_mode===0 && sortingTask.filter.status===0">
            <div class="btn-main g-btn-item" @click="_exportSortingByOrder">导出拣货单</div>
            <!--<div class="btn-main g-btn-item" @click="_exportByOrder">导出团长订单</div>-->
            <div class="btn-main g-btn-item" @click="_exportByOrder">导出配货单</div>
            <div class="btn-main g-btn-item" @click="orderExcel">导出消费者清单</div>
          </template>
          <template v-if="sortingTask.filter.sorting_mode===1">
            <div class="btn-main g-btn-item" @click="_exportCustomerDetail">导出消费者配送明细</div>
          </template>
          <template v-if="sortingTask.filter.sorting_mode===1 && sortingTask.filter.status===0">
            <div class="btn-main g-btn-item" @click="_exportPickingOrder">导出拣货单</div>
            <div class="btn-main g-btn-item" @click="_exportDeliveryOrder">导出配货单</div>
            <div class="btn-main g-btn-item" @click="_goodsExcel">导出消费者清单</div>
          </template>
          <div v-if="sortingTask.filter.status===0" class="btn-main g-btn-item" @click="_batchFinishSorting">批量完成分拣</div>
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
                  <router-link class="list-operation no-right" :to="getRouterUrl(item,row)">{{item.operateText ? item.operateText :row[item.key]}}</router-link>
                  <router-link v-if="item.afterBtn" class="after-btn" :to="getRouterUrl(item.afterBtn,row)">
                    {{item.afterBtn.operateText}}
                    <!--<button class="">{{item.afterBtn.operateText}}</button>-->
                  </router-link>
                  <span v-if="item.afterBtns" class="list-operation no-right" @click="exportOrderDetail(row)">
                    {{item.afterBtns.operateText}}
                    <!--<button class="">{{item.afterBtn.operateText}}</button>-->
                  </span>
                </template>
                <template v-else>
                  {{row[item.key]}}
                  <template v-if="item.after">
                    {{row[item.after]}}
                  </template>
                  <div v-if="item.afterBr">
                    {{row[item.afterBr]}}
                  </div>
                  <div v-if="item.afterImg && row[item.afterImg.key]" :class="item.afterImg.class">
                  </div>
                </template>

              </div>
            </div>
          </template>
          <base-blank v-else></base-blank>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pagination="sortingTask.filter.page" :pageDetail="sortingTask.pageTotal" @addPage="pageChange"></base-pagination>
      </div>
    </div>
    <default-confirm ref="confirm" :oneBtn="oneBtn" @confirm="successConfirm"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import {authComputed, sortingComputed, sortingMethods} from '@state/helpers'
  import API from '@api'
  import _ from 'lodash'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  const ORDERSTATUS = [{text: '按订单分拣', status: 0, id: 'order'}, {text: '按商品分拣', status: 1, id: 'goods'}]

  const PAGE_NAME = 'PROCUREMENT_TASK'
  const TITLE = '拣货任务列表'
  const COMMODITIES_LIST1 = [
    {tilte: '建单时间', key: 'created_at', flex: '1.5'},
    {
      tilte: '订单号',
      key: 'out_order_sn',
      type: 'operate',
      params: {id: 'out_order_id'},
      routerName: 'merchant-order-detail',
      flex: '2'
    },
    {tilte: '商户名称', key: 'merchant_name', flex: '2'},
    {tilte: '订单数量', key: 'order_num', after: 'sale_unit'},
    {tilte: '建议配货数量', key: 'allocation_num', after: 'sale_unit'},
    {tilte: '状态', key: 'status_str', afterImg: {type: 'img', key: 'is_exception', class: 'list-item-img'}},
    {
      tilte: '操作',
      key: '',
      type: 'operate',
      operateText: '明细',
      flex: 1,
      class: 'operate export',
      params: {id: 'id', order_id: 'order_id'},
      routerName: 'sorting-task-order-detail',
      afterBtns: {
        routerName: '',
        params: {id: 'id'},
        operateText: '导出明细'
      }
    }
  ]
  const COMMODITIES_LIST2 = [
    {tilte: '商品名称', key: 'goods_name', flex: '2', afterBr: 'goods_sku_encoding'},
    {tilte: '类目', key: 'goods_material_category', flex: '2'},
    {tilte: '下单数', key: 'sale_num', after: 'sale_unit'},
    {tilte: '配货数', key: 'sale_wait_pick_num', after: 'sale_unit'},
    {tilte: '缺货数', key: 'sale_out_of_num', after: 'sale_unit'},
    {tilte: '存放库位', key: 'position_name', flex: '2'},
    {tilte: '待配商户数', key: 'merchant_num'},
    {tilte: '状态', key: 'status_str', afterImg: {type: 'img', key: 'is_exception', class: 'list-item-img'}},
    {
      tilte: '操作',
      key: '',
      type: 'operate',
      operateText: '明细',
      flex: 1,
      class: 'operate add-btn',
      params: {id: 'id', goods_sku_code: 'goods_sku_code'},
      routerName: 'sorting-task-detail-by-goods',
      afterBtn: {
        routerName: 'sorting-task-preview',
        params: {id: 'id'},
        operateText: '打印标签'
      }
    }
  ]

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultConfirm
    },
    data() {
      return {
        currentPrint: {},
        tabStatus: ORDERSTATUS,
        datePlaceHolder: '选择生成日期',
        errorObj: {
          check: false,
          show: false,
          content: '全部',
          type: 'default',
          data: [{name: '全部', status: ''}, {name: '正常', status: '0'}, {name: '异常', status: '1'}] // 格式：{name: '55'}
        },
        roadList: {
          check: false,
          show: false,
          content: '全部',
          type: 'default',
          data: [{name: '全部', status: ''}] // 格式：{name: '55'}
        },
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
        statusList: [
          {name: '全部', value: '', num: 0},
          {name: '待分拣', value: 0, num: 0},
          {name: '拣货中', value: 2, num: 0},
          {name: '待配货', value: 3, num: 0},
          {name: '已完成', value: 1, num: 0}
        ],
        oneBtn: false,
        stairSelect: {check: false, show: false, content: '一级类目', type: 'default', data: []},
        secondSelect: {check: false, show: false, content: '二级类目', type: 'default', data: []},
        thirdlySelect: {check: false, show: false, content: '三级类目', type: 'default', data: []},
        exportUrl: ''
      }
    },
    computed: {
      ...sortingComputed,
      commodities() {
        return this.sortingTask.filter.sorting_mode === 1 ? COMMODITIES_LIST2 : COMMODITIES_LIST1
      },
      timeArr() {
        return [this.sortingTask.filter.start_time, this.sortingTask.filter.end_time]
      }
    },
    created() {
      // this.getFristList()
      this._getStatusData()
      this._setErrorStatus()
      this.getCategoriesData()
      this._getRoadList()
      this._setData()
    },
    methods: {
      ...authComputed,
      ...sortingMethods,
      // 重置数据
      _setData() {
        let selectDown = _.cloneDeep(this.taskData)
        this.stairSelect.content = selectDown.oneName
        this.secondSelect.content = selectDown.twoName
        this.thirdlySelect.content = selectDown.thrName
        this.secondSelect.data = selectDown.twoList
        this.thirdlySelect.data = selectDown.thrList
      },
      _getRoadList() {
        API.Sorting.getRoadList().then((res) => {
          if (res.error === this.$ERR_OK) {
            this.roadList.data = res.data.map((item) => {
              return {
                name: item.road_name,
                id: item.id
              }
            })
            this.roadList.data.unshift({name: '全部', id: ''})
            this._setRoadStatus()
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      getCategoriesData() {
        API.Product.getScmCategoryList({parent_id: -1}, false).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.stairSelect.data = res.data
            this.stairSelect.data.unshift({name: '全部', id: '', list: []})
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      // 选择一级类目
      async setStairValue(data) {
        let obj = JSON.parse(JSON.stringify(data))
        this.secondSelect.content = '二级类目'
        this.secondSelect.data = obj.list
        this.secondSelect.data.unshift({name: '全部', id: obj.id, list: []})
        this.thirdlySelect.content = '三级类目'
        this.thirdlySelect.data = []
        this.SET_TASK_DATA({
          oneName: obj.name,
          twoName: '二级类目',
          twoList: obj.list,
          thrName: '三级类目',
          thrList: []
        })
        this._updateData({goods_material_category_id: data.id || '', page: 1})
      },
      // 选择二级类目
      async setSecondValue(data) {
        this.thirdlySelect.content = '三级类目'
        this.thirdlySelect.data = data.list
        this.SET_TASK_DATA({twoName: data.name, thrList: data.list, thrName: '三级类目'})
        this._updateData({goods_material_category_id: data.id || '', page: 1})
      },
      // 选择三级类目
      async setThirdlyValue(data) {
        this.SET_TASK_DATA({thrName: data.name})
        this._updateData({goods_material_category_id: data.id || '', page: 1})
      },
      _setErrorStatus() {
        let item = this.errorObj.data.find((item) => item.status === this.sortingTask.filter.exception_status)
        this.errorObj.content = item.name || '全部'
      },
      _setRoadStatus() {
        let item = this.roadList.data.find(item => item.id === this.sortingTask.filter.road_id)
        this.roadList.content = item.name || '全部'
      },
      webSocketData() {
        let url = process.env.VUE_APP_WSS + '/sub'
        let prg = `scm_batch_finish_sorting_` + process.env.VUE_APP_CURRENT_CORP
        let id = this.currentUser().manager_info.store_id
        let urlPrg = `wss://${url}?id=${id}&prg=${prg}`
        var ws = new WebSocket(urlPrg)
        let that = this
        ws.onmessage = function(event) {
          var data = JSON.parse(event.data)
          if (data.status === 'success') {
            that._updateData({page: 1})
            ws.close()
          }
        }
      },
      async checkErr(item) {
        this._updateData({exception_status: item.status, page: 1})
      },
      async checkRoad(item) {
        this._updateData({road_id: item.id, page: 1})
      },
      initBaseDropDown(first, second) {
        if (first) {
          this.filterTaskFrist.data = [{name: '全部', id: ''}]
          this.filterTaskFrist.content = '一级分类'
        }
        if (second) {
          this.filterTaskSecond.data = [{name: '全部', id: ''}]
          this.filterTaskSecond.content = '二级分类'
        }
      },
      _batchFinishSorting() {
        this.$refs.confirm.show('批量完成分拣后将无法导出左侧单据，确定这样子做吗？')
      },
      successConfirm() {
        API.Sorting.batchFinishSorting(this.sortingTask.filter, true)
          .then((res) => {
            this.$toast.show(res.message)
            this.webSocketData()
          })
          .catch((err) => {
            this.$toast.show(err.message)
          })
          .finally(() => {
            this.$loading.hide()
          })
      },
      // 打印标签按鈕
      printTagBtn(row) {
        this.$router.push({name: 'perview', params: {id: row.id}})
      },
      // 顶部tab切换
      tabChange(val) {
        if (val === 1) {
          this.initBaseDropDown(true, true)
          this.getCategoriesData()
        }
        let params = {
          sorting_mode: val,
          page: 1,
          limit: 10,
          start_time: '',
          end_time: '',
          goods_material_category_id: '',
          status: 0,
          keyword: '',
          exception_status: ''
        }
        this.errorObj.content = '全部'
        this.$refs.research._setText()
        this._updateData(params)
      },
      // 表格跳转路由获取
      getRouterUrl(item, row) {
        let res = {}
        for (let i in item.params) {
          res[i] = row[item.params[i]]
        }
        return {
          name: item.routerName,
          params: res
        }
      },
      // 更新列表
      _updateData({...params}, noUpdataStatus) {
        this.SET_PARAMS(params)
        this.getSortingTaskList({})
        if (!noUpdataStatus) {
          this._getStatusData()
        }
        if (params.page === 1) {
          this.$refs.pagination.beginPage()
        }
      },
      // 时间选择器
      changeTime(timeArr) {
        this._updateData({
          start_time: timeArr[0],
          end_time: timeArr[1],
          page: 1
        })
      },
      // 状态栏数据
      _getStatusData() {
        let obj = this.sortingTask.filter
        let params = {
          start_time: obj.start_time,
          end_time: obj.end_time,
          goods_material_category_id: obj.goods_material_category_id,
          keyword: obj.keyword,
          exception_status: obj.exception_status,
          sorting_mode: obj.sorting_mode,
          road_id: obj.road_id
        }
        // todo
        API.Sorting.getStausData(params)
          .then((res) => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return false
            }
            this.statusList = res.data.status
          })
          .catch((err) => {
            this.$toast.show(err.message)
          })
      },
      // 列表状态栏选择
      setStatus(val) {
        this._updateData({status: val, page: 1})
      },
      // 分类数据
      _getClassifyList(params) {
        return API.Sorting.getClassifyList(params)
          .then((res) => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return false
            }
            return res
          })
          .catch((err) => {
            this.$toast.show(err.message)
          })
      },
      getFristList() {
        this._getClassifyList().then((res) => {
          if (!res) return false
          this.filterTaskFrist.data = [{name: '全部', id: ''}, ...res.data]
        })
      },
      // 分类选择
      setValueFrist(item) {
        this._updateData({goods_category_id: item.id || '', page: 1})
        this._getClassifyList({
          parent_id: item.id
        }).then((res) => {
          if (!res) return false
          this.filterTaskSecond.content = '全部'
          this.filterTaskSecond.data = [{name: '全部', id: item.id}, ...res.data]
        })
      },
      setValueSecond(item) {
        if (!item.id) {
          return
        }
        this._updateData({goods_category_id: item.id, page: 1})
      },
      // 搜索按钮
      searchBtn(keyword) {
        this._updateData({keyword, page: 1})
      },
      // 导出路径
      getUrl() {
        let obj = this.sortingTask.filter
        let data = {
          current_corp: this.getCurrentId(),
          access_token: this.currentUser().access_token,
          goods_material_category_id: obj.goods_material_category_id,
          start_time: obj.start_time,
          end_time: obj.end_time,
          keyword: obj.keyword,
          status: obj.status,
          sorting_mode: obj.sorting_mode,
          road_id: obj.road_id
        }
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        return '?' + search.join('&')
      },
      _getCustomerUrl() {
        let currentId = this.getCurrentId()
        let obj = this.sortingTask.filter
        let data = {
          current_corp: currentId,
          current_shop: process.env.VUE_APP_CURRENT_SHOP,
          access_token: this.currentUser().access_token,
          start_time: obj.start_time,
          end_time: obj.end_time,
          keyword: obj.keyword,
          status: obj.status,
          exception_status: obj.exception_status,
          sorting_mode: obj.sorting_mode,
          road_id: obj.road_id
        }
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        return '?' + search.join('&')
      },
      // 按订单分拣 导出
      _exportByOrder() {
        // todo
        API.Sorting.exportDistributionOrder(this.getUrl())
      },
      // 按订单分拣 导出
      _exportSortingByOrder() {
        // todo
        API.Sorting.exportSortingOrder(this.getUrl())
      },
      // 导出消费者配送明细
      _exportCustomerDetail() {
        let data = {
          current_corp: this.getCurrentId(),
          access_token: this.currentUser().access_token
        }
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        let url = '?' + search.join('&')
        API.Sorting.exportCustomerDetail(url)
        // API.Sorting.exportCustomerDetail()
        //   .then(res => {
        //     if (res.error === this.$ERR_OK) {
        //       window.open(res.data.file_url, '_blank')
        //     } else {
        //       this.$toast.show(res.message)
        //     }
        //   })
      },
      // 导出分拣单
      _exportPickingOrder() {
        API.Sorting.exportPickingOrder(this.getUrl())
      },
      // 按订单分拣导出配货单
      async _exportInvoiceOrder() {
        await API.Sorting.exportInvoiceOrder(this.getUrl())
      // setTimeout(() => {
      //   this._updateData({page: 1})
      // }, 500)
      },
      // 按商品分拣导出配货单
      async _exportDeliveryOrder() {
        await API.Sorting.exportAllocationOrder(this.getUrl())
        setTimeout(() => {
          this._updateData({page: 1})
        }, 500)
      },
      // 导出消费者清单
      orderExcel() {
        API.Sorting.exportCustomerOrder(this._getCustomerUrl())
      },
      // 导出消费者清单
      _goodsExcel() {
        API.Sorting.exportCustomerOrder(this.getUrl())
      },
      // 导出订单明细
      exportOrderDetail(item) {
        let data = {
          current_corp: this.getCurrentId(),
          access_token: this.currentUser().access_token,
          picking_order_id: item.id
        }
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        let url = '?' + search.join('&')
        API.Sorting.exportOrderDetail(url)
      },
      pageChange(page) {
        this._updateData({page})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .list-item-img
    icon-image('icon-unusual_list')
    width: 16px
    height: 15px
    margin-top: 2px
    margin-left: 1px
    background-size: 16px 15px
  .fill-line
    width:28px
    border-top:1px solid #333
  .home .container
    padding: 0px !important
  .tab-top
    position:fixed
    top: 38px
    left: 210px
    z-index: 700
    margin-bottom: 20px
  .empty-50
    height:50px
  .operate
    max-width: 50px
    &.export
      min-width: 126px
    &.add-btn
      min-width 130px
    .after-btn
      display: inline-block
      cursor:pointer
      color:#4D77BD
      border:1px solid #4D77BD
      border-radius: 2px
      width:80px
      text-align: center
      line-height:22px
      &:hover
        border:1px solid #06397e
        color: #06397e
  .list-operation
    text-decoration: underline

  .down-content .down-group-item
    margin-right: 10px


</style>
