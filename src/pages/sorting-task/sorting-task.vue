<template>
  <div class="procurement-task table">
    <base-tab-select v-model="tabIndex" :tabStatus="tabStatus" :lineWidth="104" @getStatusTab="_changeStatusTab"></base-tab-select>
    <div class="down-content">
      <!--时间选择-->
      <span class="down-tip">生成时间</span>
      <div class="down-item">
        <base-date-select :placeHolder="datePlaceHolder" :dateInfo="timeArr" @getTime="changeTime"></base-date-select>
      </div>
      <!--下拉选择-->
      <template v-if="tabIndex===1">
        <span class="down-tip">分类筛选</span>
        <div class="down-item down-group-item">
          <base-drop-down :select="filterTaskFrist" @setValue="_setValueFrist"></base-drop-down>
        </div>
        <div class="down-item">
          <base-drop-down :select="filterTaskSecond" @setValue="_setValueSecond"></base-drop-down>
        </div>
      </template>
      <!--搜索-->
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search ref="research" :placeHolder="tabIndex?'商品名称或商品编码':'按订单号/团长点'" @search="_search"></base-search>
      </div>
    </div>
    <div class="table-content">
      <!--列表tab工具栏-->
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-warehousing@2x.png" class="identification-icon">
          <p class="identification-name">拣货任务列表</p>
          <base-status-nav :statusList="statusList" :value="sortingTask.filter.status"
                           valueKey="status" labelKey="status_str" numKey="statistic" @change="_setStatus"></base-status-nav>
        </div>
        <div class="function-btn">
          <template v-if="!tabIndex">
            <div class="btn-main" @click="_exportByOrder">导出</div>
          </template>
          <template v-else>
            <div class="btn-main" @click="_exportPickingOrder">导出拣货单</div>
            <div class="btn-main g-btn-item" @click="_exportDeliveryOrder">导出配货单</div>
          </template>

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
              <div v-for="item in commodities" :key="item.title" :style="{flex:item.flex}" :title="row[item.key]" :class="['list-item',item.class]">
                <template v-if="item.type==='operate'" name="operation">
                  <router-link class="list-operation no-right" :to="_getRouterUrl(item,row)">{{item.operateText ? item.operateText :row[item.key]}}</router-link>
                  <button v-if="item.afterBtn" class="after-btn" @click="printTag(row)">{{item.afterBtn}}</button>
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
    <default-modal ref="modal">
      <div slot="content" class="model-wrap">
        <div class="top">
          <div class="title"> 设置打印标签</div>
          <div class="close" @click.stop="_hideModal">
          </div>
        </div>
        <div class="model-content">
          <div v-for="item in setting" :key="item.id" class="form-item">
            <label class="right">{{item.label}}</label>
            <input v-if="item.type==='input'" v-model="item.value" :label="item.label" class="ivu-input" type="text">
            <date-picker
              v-else-if="item.type==='date'"
              type="date"
              class="large"
              :value="item.value"
              :clearable="false"
              size="large"
              @on-change="handleDateChange"
            ></date-picker>
            <div v-else>{{item.value}}</div>
          </div>
        </div>
        <div class="back btn-group-wrap">
          <div class="back-cancel back-btn hand" @click="_hideModal">取消</div>
          <div class="back-btn back-submit hand" @click="sureBtn">确认</div>
        </div>
      </div>
    </default-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {DatePicker} from 'iview'
  import DefaultModal from '@components/default-modal/default-modal'
  import {authComputed, sortingComputed, sortingMethods} from '@state/helpers'
  import API from '@api'
  const ORDERSTATUS = [{text: '按订单分拣', status: 0,id:'order'}, {text: '按商品分拣', status: 1,id:'goods'}]

  const PAGE_NAME = 'PROCUREMENT_TASK'
  const TITLE = '拣货任务列表'
  const COMMODITIES_LIST1 = [
    {tilte: '建单时间', key: 'created_at', flex: '2',},
    {tilte: '关联订单号', key: 'goods_category',type: "operate", params: {id: 'id','goods_sku_code':'goods_sku_code'}, routerName: 'merchant-order-detail', flex: '2'},
    {tilte: '商戶名称', key: 'sale_num'},
    {tilte: '配货数量', key: 'sale_wait_pick_num', after: "sale_unit"},
    {tilte: '订单数量 ', key: 'sale_wait_pick_num', after: "sale_unit"},
    {tilte: '状态', key: 'sale_out_of_num'},
    {tilte: '操作', key: '', type: 'operate', operateText: '明细', flex: 1, class: "operate", params: {id: 'id'}, routerName: 'sorting-task-detail-by-order'}]
  const COMMODITIES_LIST = [
    {tilte: '生成时间', key: 'created_at', flex: '1.5'},
    {tilte: '商品名称', key: 'goods_name', flex: '2', afterBr: 'goods_sku_encoding'},
    {tilte: '分类', key: 'goods_category', flex: '2'},
    {tilte: '下单数', key: 'sale_num', after: "sale_unit"},
    {tilte: '待拣货数', key: 'sale_wait_pick_num', after: "sale_unit"},
    {tilte: '缺货数', key: 'sale_out_of_num', after: "sale_unit"},
    {tilte: '存放库位', key: 'position_name', flex: '2'},
    {tilte: '待配商户数', key: 'merchant_num'},
    {tilte: '操作', key: '', type: 'operate', operateText: '明细', flex: 1, class: "operate add-btn", params: {id: 'id','goods_sku_code':'goods_sku_code'}, routerName: 'sorting-task-detail-by-goods',afterBtn:'打印标签'}]
  function getDateNow(){
    let nowDate = new Date()
    let year = nowDate.getFullYear()
    let month = nowDate.getMonth()+1
    let date = nowDate.getDate()
    return `${year}-${month}-${date}`
  }
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DatePicker,
      DefaultModal
    },
    data() {
      return {
        currentPrint:{

        },
        setting:[{
          label:'商品名称',
          type:'text',
          id:'goods_name',
          value:'1111111111'
        },{
          label:'保质期',
          type:'input',
          id:'goods_date',
          value:''
        },{
          label:'包装日期',
          type:'date',
          id:'page_time',
          value:getDateNow()
        },{
          label:'重量',
          type:'input',
          id:'zl',
          value:''
        },{
          label:'打印数量',
          type:'input',
          id:'num',
          test:/^[1-9]{1}[\d]*$/,
          value:'1'
        }],
        tabStatus: ORDERSTATUS,
        tabIndex: 1,
        datePlaceHolder: "选择生成日期",
        // commodities: COMMODITIES_LIST,
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
          {name:'拣货中', value: 2, num: 0},
          {name:'待配货', value: 3, num: 0},
          {name: '已完成', value: 1, num: 0}
        ],
        activeStatus: '',
        exportUrl: ""
      }
    },
    computed: {
      ...sortingComputed,
      commodities(){
        return this.tabIndex ? COMMODITIES_LIST :COMMODITIES_LIST1
      },
      timeArr() {
        return [this.sortingTask.filter.start_time, this.sortingTask.filter.end_time]
      }
    },
    created() {
      this.tabIndex =  this.$route.params.tabIndex || 0
      this._getFristList()
      this._getStatusData()
    },
    methods: {
      ...authComputed,
      ...sortingMethods,
      // 打印彈框   日期選擇
      handleDateChange(val){
        console.log(this.setting[2].value)
        this.setting[2].value=val
      },
      _hideModal(){
        this.$refs.modal.hideModal()
      },
      sureBtn(){
        console.log(this.setting[4].value)
        if(!this.setting[4].value){
          return this.$toast.show('请输入打印数量')
        }else if(!this.setting[4].test.test(this.setting[4].value)){
          return this.$toast.show('请输入正确的打印数量')
        }
        this.$router.push({name:"sorting-task-print-list",params:{id:this.currentPrint.id}})
      },
      // 打印标签按鈕
      printTag(row){
        this.$refs.modal.showModal()
        this.currentPrint = row
      },
      // 顶部tab切换
      _changeStatusTab(item, index) {
        this.tabIndex = index
        let params ={
          page: 1,
          limit: 10,
          start_time: '',
          end_time: '',
          goods_category_id: "",
          status: 0,
          keyword: "",
        }
        this.statusTab = 1
        this._updateList(params)
      },
      _getRouterUrl(item, row){
        let res = {}
        for (let i in item.params) {
          res[i] = row [item.params[i]]
        }
        return {
          name: item.routerName,
          params: res
        }
      },
      // 更新列表
      _updateList({...params}, noUpdataStatus) {
        this.SET_PARAMS(params)
        this.getSortingTaskList(this.tabStatus[this.tabIndex].id)
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
        // todo
        let type= this.tabIndex ? 'getStausData' : 'getStausData'
        API.Sorting[type](params).then(res => {
          if (res.error !== this.$ERR_OK) {
            return false
          }
          let data = res.data
          this.statusList = data
        })
      },
      // 列表状态栏选择
      _setStatus(val) {
        this._updateList({status: val, page: 1}, true)
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
      // 按订单分拣 导出
      _exportByOrder(){
        // todo
        API.Sorting.exportPickingOrder(this._getUrl())
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
    &.add-btn
      min-width 125px
    .after-btn
      cursor:pointer
      color:#4D77BD
      border:1px solid #4D77BD
      border-radius: 2px
      width:76px
      text-align: center
      line-height:22px
      &:hover
        border:1px solid #06397e
        color: #06397e
  .list-operation
    text-decoration: underline

  .down-content .down-group-item
    margin-right: 10px
  .model-wrap
    position:relative
    /*width:534px*/
    background-color #fff
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.6)
    .top
      height: 59.5px
      align-items: center
      justify-content: space-between
      padding: 0 20px
      flex-shrink 0
      layout(row)

      .title
        font-family: $font-family-medium
        font-size: $font-size-16
        color: $color-text-main

      .close
        width: 12px
        height: 12px
        cursor pointer
        icon-image(icon-close)

    .model-content
      padding: 10px 20px 6px
    .btn-group-wrap
      layout(row)
      height: auto
      align-items: center
      justify-content: flex-end
      background: #fff
      position: relative
      left: 0
      padding: 20px
      &::before
        border-top-width:0px
  .form-item
    display: flex
    align-items: center
    font-size :14px
    margin-bottom:24px
    height:40px
    label
      font-family:$font-family-regular
      margin-right:20px
      width:84px
      flex-shrink: 0
      &.right
        text-align right
    .ivu-date-picker
      flex:1
    input
      height: 40px
      width:410px
      border:1px solid #D3D8DC
      border-radius: 2px
      padding:20px
      color:#333

</style>
