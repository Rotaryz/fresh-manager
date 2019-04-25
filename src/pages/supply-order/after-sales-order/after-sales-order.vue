<template>
  <div class="distribution-task table">
    <div class="down-content">
      <span class="down-tip">创建时间</span>
      <div class="down-item">
        <base-date-select :placeHolder="datePlaceHolder" :dateInfo="timeArr" @getTime="_changeTime"></base-date-select>
      </div>
      <div class="distribution-down">
        <span class="down-tip">搜索</span>
        <div class="down-item">
          <base-search placeHolder="原订单号" @search="_changeKeyword"></base-search>
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
          <div v-for="(row, index) in afterSalesList" :key="index" class="list-content list-box">
            <div v-for="item in commodities" :key="item.key" :style="{flex: item.flex}" :class="['list-item',item.class]">
              <template v-if="item.key" name="name">
                {{row[item.key]}}
              </template>
              <template v-else name="operation">
                <router-link class="list-operation" :to="{name:'after-sales-detail',params:{id:row.id}}">{{item.operation}}</router-link>
              </template>
            </div>
          </div>
        </div>
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
              <base-search placeHolder="供应商" @search="_getBatchList"></base-search>
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
              </div>
            </div>
            <div class="list" :class="{'goods-list-border':batchendList.length}">
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
            </div>
          </div>
        </div>
        <div class="back btn-group-wrap">
          <div class="back-cancel back-btn hand" @click="_hideModal">返回</div>
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
    {title: '售后订单号  ', key: 'order_sn', flex: 1},
    {title: '商户名称', key: 'buyer_name', flex: 1.5},
    {title: '缺货品类数', key: 'type_count', flex:1},
    {title: '原订单号 ', key: 'source_order_sn', flex: 2},
    {title: '状态', key: 'status_str', flex: 0.6},
    {title: '操作', key: '', operation: '详情', flex: 1,class:"operate"}
  ]
  const COMMODITIES_LIST2 = [
    {title: '', type: 'check', key: '', flex: 3,class:'row-check'},
    {title: '商品', key: 'goods_name', flex: 3},
    {title: '供应商', key: 'supplier_name', flex: 3},
    {title: '缺货数量', key: 'sale_out_of_num', flex: 1},
    {title: '关联商户数 ', key: 'buyer_count', flex: 1},
    {title: '处理状态', key: 'status_str', flex: 2,class:'status_str'},
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
        datePlaceHolder: "选择创建 日期",
        dispatchSelect: [
          {name: '全部', value: '', num: 0},
          {name: '待处理', value: 5, num: 0},
          {name: '已处理', value: 0, num: 0}
        ],
        statusTab: 1,
        batchendList: [],
        batchCommodities: COMMODITIES_LIST2,
        checkAllStatus: false,
        selectIds: [],
        confirmType: 1,// 1  补货，2 退款
      }
    },
    computed: {
      ...afterSalesOrderComputed,
      timeArr() {
        return [this.afterSalesFilter.start_time, this.afterSalesFilter.end_time]
      }
    },
    async created() {
      if (this.$route.query.status) {
        this.statusTab = this.$route.query.status * 1
      }
      this._getStatusData()
    },
    methods: {
      ...afterSalesOrderMethods,
      /**
       售后订单
       **/
      // ------弹框
      _isCheck(id) {
        return this.selectIds.some(item => item === id)
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
        this.selectIds = this.checkAllStatus ? this.batchendList.map(item => item.goods_sku_code) : []
      },
      // 弹框数据
      _getBatchList(val) {
        API.AfterSalesOrder.getBatchList({keyword: val}).then((res) => {
          if (res.error !== this.$ERR_OK) {
            return false
          }
          this.batchendList = res.data
        }).catch(() => {
          return false
        })
          .finally(() => {
            this.$loading.hide()
          })
      },
      // 弹框显示影藏
      _hideModal() {
        this.$refs.modal.hideModal()
      },
      _showModal() {
        this._getBatchList()
        this.$refs.modal.showModal()
        this.checkAllStatus= false
        this.selectIds= []

      },
      _showConfirm(val) {
        if (this.selectIds.length === 0) return
        this.confirmType = val
        let text = `确定对所选商品${this.confirmType === 1 ? '批量补货' : '批量退款'}?`
        this.$refs.confirm.show(text)
      },
      _getConfirmResult() {
        if (this.confirmType === 1) {
          // 补货
          this._setBatchReplenishment()
        } else {
          // 退款
          this._setBatchRefund()
        }
      },
      // 补货
      _setBatchReplenishment() {
        API.AfterSalesOrder.batchReplenishment(this.selectIds).then((res) => {
          if (res.error !== this.$ERR_OK) {
            return false
          }
          this._hideModal()
          this.getAfterSalesOrderList()
        }).catch(() => {
          return false
        })
          .finally(() => {
            this.$loading.hide()
          })
      },
      // 退款
      _setBatchRefund() {
        API.AfterSalesOrder.batchRefund(this.selectIds).then((res) => {
          if (res.error !== this.$ERR_OK) {
            return false
          }
          this._hideModal()
          this.getAfterSalesOrderList()
        }).catch(() => {
          return false
        })
          .finally(() => {
            this.$loading.hide()
          })
      },
      // ---------- 列表
      // 更新列表数据
      _updateList(params) {
        this.SET_PARAMS(params)
        this.getAfterSalesOrderList()
      },
      // 状态数据
      _getStatusData() {
        let defaultParams = {
          start_time: this.afterSalesFilter.start_time,
          end_time: this.afterSalesFilter.end_time,
          keyword: this.afterSalesFilter.keyword
        }
        API.AfterSalesOrder.getStausData(defaultParams).then(res => {
          this.dispatchSelect = res.data.map(item => {
            return {
              name: item.status_str,
              value: item.status,
              num: item.statistic
            }
          })
        })
      },

      // 时间
      _changeTime(timeArr) {
        this._updateList({
          start_time: timeArr[0],
          end_time: timeArr[1],
          page: 1
        })
        this._getStatusData()

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
        this._getStatusData()
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  /*@import "@pages/supply-order/after-sales-detail/check/check.styl"*/
  .table .table-content
    padding-bottom: 20px;
  .operate
    max-width 50px
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
    height:80vh
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
      flex:1
      width: 1000px
      padding: 10px 20px 30px
      overflow auto
      .status_str
        max-width 65px
      .row-check
        max-width 60px
    .btn-group-wrap
      layout(row)
      height:auto
      align-items: center
      justify-content: flex-end
      background: #fff
      position: relative
      left: 0
      padding:20px
      .back-submit
        margin-right:0
  /*&:before*/
          /*border-top: 0px solid #e9ecee;*/
  .tab-item.serch-btn-box
    width: 300px
    margin-bottom: 20px

</style>
