<template>
  <div class="procurement-task table">
    <div class="down-content">
      <div class="enter-title">出库单号：{{outMsg.order_sn}}</div>
      <div class="enter-title">关联订单号：{{outMsg.out_order_sn}}</div>
      <div class="enter-title">商户名称：{{outMsg.merchant_name}}</div>
      <div class="enter-title">出库时间：{{outMsg.out_time}}</div>
      <div class="enter-title">状态：{{outMsg.status === 0 ? '待出库' : '已完成'}}</div>
      <div class="enter-title">入库金额：<span class="enter-title-money">￥{{outMsg.total}}</span></div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-inventory@2x.png" class="identification-icon">
          <p class="identification-name">商品明细</p>
        </div>
        <div v-if="outMsg.status === 0" class="function-btn" @click="outFn">
          <div class="btn-main">确定出库<span class="add-icon"></span></div>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in outDetailList" :key="index" class="list-content list-box">
            <div class="list-item">{{item.sale_num}}</div>
            <div class="list-item">{{item.goods_name}}</div>
            <div class="list-item">{{item.goods_category}}</div>
            <div class="list-item">{{item.sale_num}}{{item.sale_unit}}</div>
            <div class="list-item">{{item.base_num}}{{item.base_unit}}</div>
            <div class="list-item hand" @click="outFn(item, index)">{{item.out_batches.length > 0 ? '查看批次' : '选择批次'}}</div>
            <div class="list-item">{{item.out_cost_price}}</div>
            <div class="list-item">{{item.cost_total}}</div>
          </div>
        </div>
      </div>
    </div>
    <default-batch ref="modalBox" :batchList="batchList" :curItem="curItem" @confirm="confirm"></default-batch>
  </div>
</template>

<script type="text/ecmascript-6">
  import _ from 'lodash'
  import API from '@api'
  import {productComputed} from '@state/helpers'
  import DefaultBatch from '@components/default-batch/default-batch'
  const PAGE_NAME = 'PROCUREMENT_TASK'
  const TITLE = '商品详情'
  const COMMODITIES_LIST = ['批次号', '商品', '分类', '出库数量(销售单位)', '出库数量(基本单位)', '出库批次', '出库单价', '出库金额']
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
        curItem: {}
      }
    },
    computed: {
      ...productComputed
    },
    created() {
      console.log(_, API)
      this.id = this.$route.params.id || null
      this.outDetailList = _.cloneDeep(this.outDetail.data)
      this.outMsg = _.cloneDeep(this.outDetail.out_order)
    },
    methods: {
      getOutBatchList(index) {
        API.Store.outBatchList({goods_sku_code: this.outDetailList[index].goods_sku_code}).then((res) => {
          if (res.error === this.$ERR_OK) {
            console.log(res.data)
            this.batchList = res.data
            if (this.outDetailList[index].out_batches.length) {
              this.outDetailList[index].out_batches.forEach(item => {
                this.batchList.forEach(item1 => {
                  if(item1.batch_num === item.batch_num) {
                    item1.out_count = item.select_out_num
                  }
                })
              })
            }
            this.$refs.modalBox.show()
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      outFn(item, index) {
        this.curItem = item
        this.curIndex = index
        this.getOutBatchList(index)
      },
      confirm(arr) {
        console.log(arr)
        this.outDetailList[this.curIndex].out_batches = arr
        console.log(this.outDetailList)
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
        &:last-child
          flex: 0.4
        &:nth-child(4), &:nth-child(2), &:nth-child(5), &:nth-child(6)
          flex: 1.5
  .enter-title
    font-size: $font-size-14
    font-family: $font-family-regular
    color: $color-text-main
    margin-right: 130px
    .enter-title-money
      color: #F84E3C
  .tip
    margin :0 2px
    font-size: $font-size-14
</style>
