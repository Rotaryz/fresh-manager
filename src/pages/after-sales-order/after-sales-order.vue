<template>
  <div class="distribution-task table">
    <div class="down-content">
      <span class="down-tip">创建时间</span>
      <div class="down-item">
        <base-date-select :placeHolder="datePlaceHolder" :dateInfo="timeArr" @getTime="_changeTime"></base-date-select>
      </div>
      <span class="down-tip">异常状态</span>
      <div class="down-item">
        <base-drop-down :select="errorObj" @setValue="checkErr"></base-drop-down>
      </div>
      <div class="distribution-down">
        <span class="down-tip">搜索</span>
        <div class="down-item">
          <base-search placeHolder="原订单号" :infoText="afterSalesFilter.keyword" @search="_changeKeyword"></base-search>
        </div>
      </div>

    </div>
    <div class="table-content">
      <!--列表tab工具栏-->
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-order_list2@2x.png" class="identification-icon">
          <p class="identification-name">订单列表</p>
          <base-status-tab :statusList="dispatchSelect" :infoTabIndex="statusTab" @setStatus="_setValue"></base-status-tab>
        </div>
        <div class="btn-main" @click="_showModal">批量处理</div>
      </div>
      <!--列表-->
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item" :style="{flex: item.flex}" :class="['list-item',item.class]">{{item.title}}</div>
        </div>
        <div class="list">
          <template v-if="afterSalesList.length">
            <div v-for="(row, index) in afterSalesList" :key="index" class="list-content list-box">
              <div v-for="item in commodities" :key="item.key" :style="{flex: item.flex}" :class="['list-item',item.class,item.rowClass]">
                <template v-if="item.type==='operate'" name="operation">
                  <router-link class="list-operation" :to="_getRouterUrl(item,row)">{{item.operateText ? item.operateText :row[item.key]}}</router-link>
                </template>
                <template v-else name="name">
                  <span v-if="item.before" :class="[item.beforeClass[0],row[item.before]?item.beforeClass[1]:'']"></span>{{row[item.key]}}
                  <div v-if="item.is_exception & item.before" class="list-item-img"></div>
                </template>
              </div>
            </div>
          </template>
          <base-blank v-else></base-blank>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pagination="afterSalesFilter.page" :pageDetail="pageTotal" @addPage="_getMoreList"></base-pagination>
      </div>
    </div>
    <default-modal ref="modal">
      <div slot="content" class="model-wrap">
        <div class="top">
          <div class="title"> 批量处理</div>
          <div class="close" @click.stop="_hideModal">
          </div>
        </div>
        <div class="model-content">
          <div class="shade-tab">
            <div class="tab-item serch-btn-box">
              <base-search ref="research" placeHolder="供应商" @search="_getBatchList"></base-search>
            </div>
          </div>
          <div>
            <div class="list-header list-box">
              <div v-for="(item,index) in batchCommodities" :key="index" :class="['list-item',item.class]" :style="{flex: item.flex}">
                <template v-if="item.type==='check'">
                  <div class="pro-select-icon hand" :class="{'pro-select-icon-active':checkAllStatus}" @click="_selectAllChange(item, index)">
                    <span class="after"></span>
                  </div>
                </template>
                {{item.title}}
                <template v-if="item.type==='afterHelp'">
                  <div class="icon-help">
                    <div class="help-text">待处理状态下可选择进行线上退款或补货处理，如该商品已进行线下处理，则线上可进行批量关闭处理。</div>
                  </div>
                </template>
              </div>
            </div>
            <div class="list" :class="{'goods-list-border':batchendList.length}">
              <template v-if="batchendList.length">
                <div v-for="(row, index) in batchendList" :key="index" class="list-content list-box">
                  <div v-for="item in batchCommodities" :key="item.key" :style="{flex: item.flex}" :class="['list-item',item.class]">
                    <template v-if="item.type==='check'" name="check">
                      <div class="pro-select-icon hand" :class="{'pro-select-icon-active': _isCheck(row.goods_sku_code)}" @click="_itemCheckChange(row, index)">
                        <span class="after"></span>
                      </div>
                    </template>
                    <template v-else>
                      {{row[item.key]}}
                    </template>
                  </div>
                </div>
              </template>
              <base-blank v-else></base-blank>
            </div>
          </div>
        </div>
        <div class="back btn-group-wrap">
          <div class="back-cancel back-btn hand" @click="_hideModal">取消</div>
          <div :class="['back-btn btn-main hand ',{'disable':!selectIds.length}]" :disable="!selectIds.length" @click="_showConfirm(3)">批量关闭</div>
          <div :class="['back-btn btn-main hand ',{'disable':!selectIds.length}]" :disable="!selectIds.length" @click="_showConfirm(1)">批量补货</div>
          <div :class="['back-btn back-submit hand',{'disable':!selectIds.length}]" :disable="!selectIds.length" @click="_showConfirm(2)">批量退款</div>
        </div>
      </div>
    </default-modal>
    <default-confirm ref="confirm" @confirm="_getConfirmResult"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import {afterSalesOrderComputed, afterSalesOrderMethods} from '@state/helpers'
  import API from '@api'

  const PAGE_NAME = 'MERCHANT_ORDER'
  const TITLE = '商户订单'
  const COMMODITIES_LIST = [
    {title: '创建时间', key: 'created_at', flex: 1.5},
    {title: '售后订单号  ', key: 'order_sn', flex: 2},
    {title: '商户名称', key: 'buyer_name', flex: 1.5},
    {title: '缺货品类数', key: 'type_count', flex: 1, class: 'sale_out_of_num'},
    {
      title: '原订单号 ',
      key: 'source_order_sn',
      flex: 2,
      type: 'operate',
      params: {id: 'source_order_id'},
      routerName: 'merchant-order-detail'
    },
    {
      title: '订单状态',
      key: 'status_str',
      flex: 0.6,
      before: 'status',
      beforeClass: ['list-status', 'list-status-success']
    },
    {
      title: '操作',
      key: '',
      type: 'operate',
      operateText: '详情',
      flex: 1,
      class: 'operate',
      params: {id: 'id'},
      routerName: 'after-sales-detail'
    }
  ]
  const COMMODITIES_LIST2 = [
    {title: '', type: 'check', key: '', flex: 3, class: 'row-check'},
    {title: '商品', key: 'goods_name', flex: 3},
    {title: '供应商', key: 'supplier_name', flex: 3},
    {title: '缺货数量', key: 'sale_out_of_num', flex: 1, class: 'sale_out_of_num'},
    {title: '关联商户数 ', key: 'buyer_count', flex: 1},
    {title: '处理状态', key: 'status_str', flex: 2, class: 'status_str',type:'afterHelp'}
  ]
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultModal,
      DefaultConfirm
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        datePlaceHolder: '选择创建日期',
        dispatchSelect: [
          {name: '全部', value: '', num: 0},
          {name: '待处理', value: 5, num: 0},
          {name: '已处理', value: 0, num: 0}
        ],
        statusTab: 1,
        batchendList: [],
        errorObj: {
          check: false,
          show: false,
          content: '全部',
          type: 'default',
          data: [{name: '全部', status: ''}, {name: '正常', status: '0'}, {name: '异常', status: '1'}] // 格式：{name: '55'}
        },
        batchCommodities: COMMODITIES_LIST2,
        checkAllStatus: false,
        selectIds: [],
        confirmType: 1, // 1  补货，2 退款
        exceptionStatus: this.$route.query.exception_status || ''
      }
    },
    computed: {
      ...afterSalesOrderComputed,
      timeArr() {
        return [this.afterSalesFilter.start_time, this.afterSalesFilter.end_time]
      }
    },
    async created() {
      this._setErrorStatus()
      await this._getStatusData()
      // this.errorObj.content = _.cloneDeep(this.exceptionText)
      console.log(this.afterSalesFilter.status)
      this.statusTab = this.dispatchSelect.findIndex((item) => item.value === this.afterSalesFilter.status)
    },
    methods: {
      ...afterSalesOrderMethods,
      /**
       售后订单
       **/
      _getRouterUrl(item, row) {
        let res = {}
        for (let i in item.params) {
          res[i] = row[item.params[i]]
        }
        return {
          name: item.routerName,
          params: res
        }
      },
      // ------弹框
      _isCheck(id) {
        return this.selectIds.some((item) => item === id)
      },
      // 每行选择
      _itemCheckChange(item) {
        let id = item.goods_sku_code
        let idx = this.selectIds.indexOf(id)
        idx >= 0 ? this.selectIds.splice(idx, 1) : this.selectIds.push(id)
        this.checkAllStatus = this.selectIds.length === this.batchendList.length
      },
      // 批量选择
      _selectAllChange() {
        this.checkAllStatus = !this.checkAllStatus
        this.selectIds = this.checkAllStatus ? this.batchendList.map((item) => item.goods_sku_code) : []
      },
      // 弹框数据
      _getBatchList(val) {
        API.AfterSalesOrder.getBatchList({keyword: val || ''})
          .then((res) => {
            if (res.error !== this.$ERR_OK) {
              return false
            }
            this.batchendList = res.data
          })
          .catch(() => {
            return false
          })
          .finally(() => {
            this.$loading.hide()
          })
      },
      // 弹框显示影藏
      _hideModal() {
        this.checkAllStatus = false
        this.$refs.research.infoTextMethods()
        this.selectIds = []
        this.$refs.modal.hideModal()
      },
      _showModal() {
        this._getBatchList()
        this.$refs.modal.showModal()
      },
      _showConfirm(val) {
        if (this.selectIds.length === 0) return this.$toast.show('请选择批量处理的选项')
        this.confirmType = val
        let content = ''
        switch (val) {
        case 1:
          content = '批量补货'
          break
        case 2:
          content = '批量退款'
          break
        case 3:
          content = '批量关闭'
          break
        }
        let text = `确定对所选商品${content}?`
        this.$refs.confirm.show(text)
      },
      _getConfirmResult() {
        let methodsName = ''
        switch (this.confirmType) {
        case 1:
          methodsName = 'batchReplenishment'
          break
        case 2:
          methodsName = 'batchRefund'
          break
        case 3:
          methodsName = 'batchClose'
          break
        }
        this._setBacth(methodsName)
      },
      _setBacth(method = 'batchReplenishment') {
        API.AfterSalesOrder[method](this.selectIds)
          .then((res) => {
            if (res.error !== this.$ERR_OK) {
              return false
            }
            this.$toast.show('批量处理成功')
            this._hideModal()
            this._getStatusData()
            this.getAfterSalesOrderList()
          })
          .catch(() => {
            return false
          })
          .finally(() => {
            this.$loading.hide()
          })
      },
      // ---------- 列表
      // 更新列表数据
      _updateList(params, noUpdataStatus) {
        this.SET_PARAMS(params)
        this.getAfterSalesOrderList()
        if (!noUpdataStatus) {
          this._getStatusData()
        }
        if (params.page === 1) {
          this.$refs.pagination.beginPage()
        }
      },
      // 状态数据
      async _getStatusData() {
        let defaultParams = {
          start_time: this.afterSalesFilter.start_time,
          end_time: this.afterSalesFilter.end_time,
          keyword: this.afterSalesFilter.keyword,
          exception_status: this.afterSalesFilter.exception_status
        }
        let res = await API.AfterSalesOrder.getStausData(defaultParams)
        this.dispatchSelect = res.data.map((item) => {
          return {
            name: item.status_str,
            value: item.status,
            num: item.statistic
          }
        })
        // API.AfterSalesOrder.getStausData(defaultParams).then((res) => {
        //   this.dispatchSelect = res.data.map((item) => {
        //     return {
        //       name: item.status_str,
        //       value: item.status,
        //       num: item.statistic
        //     }
        //   })
        // })
      },
      // 时间
      _changeTime(timeArr) {
        this._updateList({
          start_time: timeArr[0],
          end_time: timeArr[1],
          page: 1
        })
      },
      // 状态
      _setValue(item) {
        this._updateList({
          status: item.value,
          page: 1
        })
      },
      // 搜索按钮
      _changeKeyword(keyword) {
        this._updateList({
          keyword,
          page: 1
        })
      },
      // 分页
      _getMoreList(page) {
        this._updateList({page}, true)
      },
      checkErr(item) {
        this._updateList({
          exception_status: item.status,
          page: 1
        })
        this.SET_EXCEPTION_TEXT(item.name)
      },
      _setErrorStatus() {
        let item = this.errorObj.data.find((item) => item.status === this.afterSalesFilter.exception_status)
        this.errorObj.content = item.name || '全部'
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  /*@import "@pages/supply-order/after-sales-detail/check/check.styl"*/
  .icon-help
    width:14px
    height:@width
    margin-left:4px
    icon-image(icon-help)
    .help-text
      display: none
      position:absolute
      width:300px
      white-space normal
      z-index:2000
      right:0
      transform translate(0,-120%)
      font-size: $font-size-12
      color: #FFFFFF
      line-height: 19px
      padding:3px 11px
      opacity: 0.8
      background: #333333
      box-shadow: 0 2px 4px 0 rgba(0,0,0,0.11)
      border-radius: 2px 2px 2px 2px
      &:after
        position:absolute
        bottom:-9px
        right:28px
        content: ""
        border-top:6px solid #333
        border-left:4px solid transparent
        border-right:4px solid transparent
        border-bottom:4px solid transparent
    &:hover
      cursor pointer
      .help-text
        display: block

  .source-order-sn
    text-decoration: underline
    color: #4d77bd

  .list-operation
    text-decoration: underline

  .table .table-content
    padding-bottom: 20px;

  .operate
    max-width 50px

  .sale_out_of_num
    max-width 120px

  .pro-select-icon
    border-radius: 2px
    border: 1px solid $color-line
    height: 14px
    width: 14px
    margin-right: 18px
    background: $color-white
    transition: all 0.3s

  .pro-select-icon-disable
    cursor: not-allowed
    background: #eee
    border: 1px solid #e9ecee

  .pro-select-icon-active
    border: 1px solid transparent
    icon-image('icon-check')

  .distribution-down
    display: flex
    align-items: center

  .model-wrap
    height: 80vh
    background: $color-white
    border-radius: 2px
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.6)
    display flex
    flex-direction column

    .top
      height: 59.5px
      align-items: center
      justify-content: space-between
      padding: 0 20px
      flex-shrink 0
      layout(row)

      .title
        font-family: $font-family-regular
        font-size: $font-size-16
        color: $color-text-main

      .close
        width: 12px
        height: 12px
        cursor pointer
        icon-image(icon-close)

    .model-content
      flex: 1
      width: 1000px
      padding: 10px 20px 30px
      overflow auto

      .status_str
        max-width 80px
        padding-right:0px
      .row-check
        max-width 60px

    .btn-group-wrap
      layout(row)
      height: auto
      align-items: center
      justify-content: flex-end
      background: #fff
      position: relative
      left: 0
      padding: 20px

      .back-submit
        margin-right: 0

  /*&:before*/
  /*border-top: 0px solid #e9ecee;*/
  .tab-item.serch-btn-box
    width: 300px
    margin-bottom: 20px

  .list-item-img
    icon-image('icon-unusual_list')
    width: 16px
    height: 15px
    margin-top: 2px
    margin-left: 1px
    background-size: 16px 15px
</style>
