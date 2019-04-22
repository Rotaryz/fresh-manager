<template>
  <div class="procurement-task table">
    <div class="down-content">
      <div class="enter-title">出库单号：{{outMsg.order_sn}}</div>
      <div class="enter-title">关联订单号：{{outMsg.out_order_sn}}</div>
      <div class="enter-title">商户名称：{{outMsg.merchant_name}}</div>
      <div class="enter-title">出库时间：{{outMsg.out_time || '--------'}}</div>
      <div class="enter-title">状态：{{outMsg.status === 0 ? '待出库' : '已完成'}}</div>
      <div class="enter-title">出库金额：<span class="enter-title-money">￥{{outMsg.total}}</span></div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-inventory@2x.png" class="identification-icon">
          <p class="identification-name">商品明细</p>
        </div>
        <!--<div v-if="outMsg.status === 0" class="function-btn" @click="submitOutFn">-->
        <!--<div class="btn-main">确定出库<span class="add-icon"></span></div>-->
        <!--</div>-->
      </div>
      <div class="big-list" :class="outDetailList.length > 10 ? 'big-list-max' : ''">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in outDetailList" :key="index" class="list-content list-box">
            <div class="list-item">{{index + 1}}</div>
            <div class="list-item list-double-row">
              <p class="item-dark">{{item.goods_name}}</p>
              <p class="item-sub">{{item.goods_sku_encoding}}</p>
            </div>
            <div class="list-item">{{item.goods_category}}</div>
            <div class="list-item">{{item.sale_num}}{{item.sale_unit}}</div>
            <div class="list-item">{{item.base_num}}{{item.base_unit}}</div>
            <div class="list-item list-item-batches hand" @click="outFn(item, index)" @mouseenter="_showTip(index)" @mouseleave="_hideTip">
              <transition name="fade">
                <div v-show="showIndex === index && item.status !== 0" class="batches-box">
                  <div v-for="(item1, index1) in item.out_batches" :key="index1">
                    {{item1.batch_num}}: 出库{{item1.select_out_num}}{{item.base_unit}}
                  </div>
                </div>
              </transition>
              <transition name="fade">
                <div v-show="showIndex === index && item.status === 0" class="batches-box">
                  <div v-for="(item1, index1) in item.select_batch" :key="index1">
                    {{item1.batch_num}}: 出库{{item1.select_out_num}}{{item.base_unit}}
                  </div>
                </div>
              </transition>
              <span class="list-operation">{{item.status !== 0 ? '查看批次' : '默认批次'}}</span>
            </div>
            <div class="list-item">{{item.out_cost_price ? '￥' + item.out_cost_price : '￥0.00'}}/{{item.base_unit}}</div>
            <div class="list-item">{{item.cost_total ? '￥' + item.cost_total : '￥0.00'}}</div>
          </div>
        </div>
      </div>
    </div>
    <default-batch ref="modalBox" :batchList="batchList" :curItem.sync="curItem" @confirm="confirm"></default-batch>
    <div v-if="outMsg.status === 0" class="back">
      <div class="back-cancel back-btn hand" @click="cancel">取消</div>
      <div class="back-btn back-submit hand" @click="submitOutFn">确认提交</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import _ from 'lodash'
  import API from '@api'
  import {productComputed} from '@state/helpers'
  import DefaultBatch from '@components/default-batch/default-batch'

  const PAGE_NAME = 'PROCUREMENT_TASK'
  const TITLE = '商品详情'
  const COMMODITIES_LIST = [
    '序号',
    '商品',
    '分类',
    '出库数量(销售单位)',
    '出库数量(基本单位)',
    '出库批次',
    '出库单价',
    '出库金额'
  ]
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultBatch
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        outDetailList: [],
        outMsg: {},
        id: '',
        batchList: [],
        curIndex: 0,
        curItem: {},
        showIndex: null,
        isSubmit: false
      }
    },
    computed: {
      ...productComputed
    },
    created() {
      this.id = this.$route.params.id || null
      this.outDetailList = _.cloneDeep(this.outDetail.data)
      this.outMsg = _.cloneDeep(this.outDetail.out_order)
    },
    methods: {
      cancel() {
        this.$router.back()
      },
      _showTip(index) {
        this.showIndex = index
      },
      _hideTip() {
        this.showIndex = null
      },
      getOutBatchList(index) {
        API.Store.outBatchList({goods_sku_code: this.outDetailList[index].goods_sku_code}).then((res) => {
          if (res.error === this.$ERR_OK) {
            let number = 0
            this.batchList = res.data
            if (this.outDetailList[index].out_batches.length) {
              this.outDetailList[index].out_batches.forEach((item) => {
                number += item.select_out_num * 1
                this.batchList.forEach((item1) => {
                  if (item1.batch_num === item.batch_num) {
                    item1.out_count = item.select_out_num
                  }
                })
              })
            }
            this.$refs.modalBox.show(number)
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      submitOutFn() {
        let arr = []
        let isTure = false
        let number = 1
        this.outDetailList.forEach((item, index) => {
          let obj = {
            id: item.id,
            select_batch: item.out_batches,
            type: 5
          }
          if (item.out_batches.length === 0) {
            isTure = true
            number = index + 1
          }
          arr.push(obj)
        })
        if (isTure) {
          this.$toast.show(`序号${number}请选择批次`)
          return false
        }
        if (this.isSubmit) return
        this.isSubmit = true
        API.Store.putOutSubmit(this.id, {details: arr}).then((res) => {
          this.$loading.hide()
          if (res.error === this.$ERR_OK) {
            this.$toast.show('出库成功')
            this.outMsg.status = 1
            this.$router.back()
          } else {
            this.$toast.show(res.message)
            this.isSubmit = false
          }
        })
      },
      outFn(item, index) {
        if (this.outMsg.status * 1 === 1) return
        this.curItem = item
        this.curIndex = index
        this.batchList = item.select_batch
        let number = 0
        this.batchList = this.batchList.map((item) => {
          item.out_count = !item.out_count ? item.select_out_num : item.out_count
          number += (item.out_count * 1)
          return item
        })
        this.$refs.modalBox.show(number, item)
      },
      confirm(arr) {
        let allprice = 0
        let number = 0
        arr.forEach((item) => {
          if (item.select_out_num > 0) {
            number += item.select_out_num * 1
            allprice += item.select_out_num * item.price
          }
        })
        this.outDetailList[this.curIndex].out_cost_price = (allprice / number).toFixed(2)
        this.outDetailList[this.curIndex].cost_total = allprice.toFixed(2)
        this.outDetailList[this.curIndex].out_batches = arr
        this.$refs.modalBox.cancel()
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
        &:last-child, &:nth-child(1)
          flex: 0.5
        &:nth-child(4), &:nth-child(2), &:nth-child(5), &:nth-child(6)
          flex: 1.5

  .down-content
    align-items: flex-start
    padding: 5px 20px 25px
    box-sizing: border-box

  .enter-title
    font-size: $font-size-14
    font-family: $font-family-regular
    color: $color-text-main
    white-space: nowrap
    margin: 20px 80px 0 0
    .enter-title-money
      color: #F84E3C

  .list-item-batches
    position: relative
    overflow: inherit !important
    .batches-box
      position: absolute
      top: 21px
      left: 0
      box-sizing: border-box
      padding: 12px 37px 12px 12px
      background: rgba(51, 51, 51, .8)
      font-size: $font-size-14
      font-family: $font-family-regular
      color: $color-white
      z-index: 99
      margin-bottom: 8px
      &.fade-enter, &.fade-leave-to
        opacity: 0
      &.fade-enter-to, &.fade-leave-to
        transition: all .3s ease-in-out
      &:last-child
        margin-bottom: 0

  .tip
    margin: 0 2px
    font-size: $font-size-14
</style>
