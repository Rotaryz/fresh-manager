<template>
  <div class="procurement-task table">
    <div class="down-content">
      <div class="enter-title">入库单号：{{enterMsg.order_sn}}</div>
      <div class="enter-title">供应商：{{enterMsg.supplier}}</div>
      <div class="enter-title">入库时间：{{enterMsg.entry_time || '--------'}}</div>
      <div class="enter-title">状态：{{enterMsg.status === 0 ? '待入库' : '已完成'}}</div>
      <div class="enter-title">入库金额：<span v-if="enterMsg.status === 1" class="enter-title-money">￥{{enterMsg.total}}</span></div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-inventory@2x.png" class="identification-icon">
          <p class="identification-name">商品明细</p>
        </div>
        <div v-if="enterMsg.status === 0" class="function-btn" @click="submitFn">
          <div class="btn-main">提交入库单<span class="add-icon"></span></div>
        </div>
      </div>
      <div class="big-list" :class="enterDetailList.length > 10 ? 'big-list-max' : ''">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in enterDetailList" :key="index" class="list-content list-box">
            <div class="list-item">{{item.batch_num}}</div>
            <div class="list-item">{{item.goods_name}}</div>
            <div class="list-item">{{item.goods_category}}</div>
            <div class="list-item list-item-layout">
              <input v-if="enterMsg.status === 0" v-model="item.base_num" type="number" class="edit-input" @input="echangInput(item, index)">
              <div v-if="enterMsg.status === 1">{{item.base_num}}</div>
              <div>{{item.base_unit}}</div>
            </div>
            <div class="list-item list-item-layout">
              <input v-if="enterMsg.status === 0" v-model="item.purchase_num" type="number" class="edit-input" @input="echangPurchase(item, index)">
              <div v-if="enterMsg.status === 1">{{item.purchase_num}}</div>
              <div>{{item.purchase_unit}}</div>
            </div>
            <div class="list-item list-item-layout">
              <div>{{item.price}}</div>
              <div>/{{item.base_unit}}</div>
            </div>
            <div class="list-item">￥{{item.total}}</div>
            <div class="list-item time-content">
              <date-picker
                v-if="enterMsg.status === 0"
                class="edit-input-box" type="date"
                placeholder="保质时间"
                style="width: 110px;height: 34px;border-radius: 2px"
                @on-change="changeStartTime($event, index)"
              ></date-picker>
              <div v-if="enterMsg.status === 1">{{item.shelf_life || '--------'}}</div>
            </div>
            <div class="list-item">
              <div v-if="enterMsg.status === 0" class="select-time" @click="setStoreFn(index)">
                <div v-if="item.warehouse_position" class="select-time-name">{{item.warehouse_position}}</div>
                <div v-if="!item.warehouse_position" class="select-time-name">请选择</div>
                <!--<div class="select-time-icon"></div>-->
              </div>
              <div v-if="enterMsg.status === 1">
                {{item.warehouse_position|| '--------'}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <default-store ref="modalBox" @confirm="confirm"></default-store>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {DatePicker} from 'iview'
  import _ from 'lodash'
  import API from '@api'
  import {productComputed} from '@state/helpers'
  import DefaultStore from '@components/default-store/default-store'

  const PAGE_NAME = 'PROCUREMENT_TASK'
  const TITLE = '商品详情'
  const COMMODITIES_LIST = [
    '批次号', '商品', '分类', '入库数量(基本单位)', '入库数量(采购单位) ', '入库单价(基本单位) ', '入库金额', '保质期', '存放库位'
  ]
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DatePicker,
      DefaultStore
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        enterDetailList: [],
        enterMsg: {},
        curIndex: 0,
        id: null
      }
    },
    computed: {
      ...productComputed
    },
    created() {
      this.id = this.$route.params.id || null
      this.enterDetailList = _.cloneDeep(this.enterDetail.data)
      this.enterMsg = _.cloneDeep(this.enterDetail.entry_order)
    },
    methods: {
      submitFn() {
        let arr = []
        this.enterDetailList.forEach(item => {
          let obj = {}
          obj.id = item.id
          obj.base_num = item.base_num
          obj.purchase_num = item.purchase_num
          obj.shelf_life = item.shelf_life
          obj.warehouse_position_id = item.warehouse_position_id || ''
          arr.push(obj)
        })
        API.Store.putEnterSubmit(this.id, {details: arr}).then((res) => {
          this.$loading.hide()
          if (res.error === this.$ERR_OK) {
            this.enterMsg.status = 1
            this.$router.back()
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      changeStartTime(e, index) {
        this.enterDetailList[index].shelf_life = e
      },
      setStoreFn(idnex) {
        this.curIndex = idnex
        this.$refs.modalBox.show()
      },
      confirm(id, text) {
        this.enterDetailList[this.curIndex].warehouse_position_id = id
        this.enterDetailList[this.curIndex].warehouse_position = text
        this.$refs.modalBox.cancel()
      },
      echangInput(item, index) {
        if (item.base_num < 0) {
          item.base_num = item.base_num * -1
        }
        let number = item.base_num / item.base_purchase_rate
        if (number < 0) {
          number = 0
        }
        item.purchase_num = number.toFixed(2)
        if (item.base_num) {
          this.enterDetailList[index].total = (item.base_num * item.price).toFixed(2)
        }
      },
      echangPurchase(item, index) {
        if (item.purchase_num < 0) {
          item.purchase_num = item.purchase_num * -1
        }
        let number = item.purchase_num * item.base_purchase_rate
        if (number < 0) {
          number = 0
        }
        item.base_num = number.toFixed(2)
        if (item.purchase_num) {
          this.enterDetailList[index].total = (item.base_num * item.price).toFixed(2)
        }
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
        align-items: center
        white-space: nowrap
        &:last-child
          flex: 1
        &:nth-child(4), &:nth-child(5), &:nth-child(8), &:nth-child(9)
          min-width: 150px
        &:nth-child(2), &:nth-child(6)
          flex: 1.3
  .list-item-layout
    layout(row)
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

  .edit-input
    font-size: $font-size-14
    padding: 0 14px
    border-radius: 2px
    width: 100px
    height: 34px
    border: 1px solid $color-line
    margin-right: 10px
    transition: all 0.3s
    &::-webkit-inner-spin-button
      appearance: none
    &:hover
      border: 1px solid #ACACAC
    &::placeholder
      font-family: $font-family-regular
      color: $color-text-assist
    &:focus
      border-color: $color-main !important
  .select-time
    layout(row)
    align-items: center
    justify-content: space-between
    width: 100px
    height: 34px
    background: #fff
    border: 1px solid #e1e1e1
    padding: 0 10px
    cursor: pointer
    .select-time-name
      font-size: $font-size-14
      font-family: $font-family-regular
      color: $color-text-main
      width: 100%
      padding-right: 10px
      no-wrap()
    .select-time-icon
      width: 14px
      height: 14px
      icon-image(icon-delete)
  .tip
    margin: 0 2px
    font-size: $font-size-14
</style>
