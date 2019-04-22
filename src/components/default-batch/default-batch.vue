<template>
  <div class="default-store">
    <default-modal ref="modal">
      <div slot="content" class="default-input">
        <div class="title-box">
          <div class="title">
            选择出库批次
          </div>
          <span class="close hand" @click="cancel"></span>
        </div>
        <div class="main-input">
          <div class="batch-title">
            <div class="batch-box">出库数：{{curItem.base_num}}{{curItem.base_unit}}</div>
            <div class="batch-box">待分配出库数：<span class="color-active">{{changeNumber}}</span>{{curItem.base_unit}}</div>
          </div>
          <div class="big-list">
            <div class="list-header list-box">
              <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
            </div>
            <div class="list">
              <div v-for="(item, index) in batchList" :key="index" class="list-content list-box">
                <div class="list-item">{{item.entry_time}}</div>
                <div class="list-item">{{item.shelf_life || '--------'}}</div>
                <div class="list-item">{{item.batch_num}}</div>
                <div class="list-item">{{item.warehouse_position || '--------'}}</div>
                <div class="list-item">{{item.usable_stock}}</div>
                <div class="list-item list-item-input-box">
                  <input v-model="item.out_count" type="number" class="edit-input" @input="changeInput(item, index)">
                  <div>{{item.base_unit}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="btn-group">
            <span class="btn cancel" @click="cancel">取消</span>
            <span class="btn confirm" @click="confirm">确定</span>
          </div>
        </div>
      </div>
    </default-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  // import API from '@api'
  const COMPONENT_NAME = 'DEFAULT_STORE'
  const COMMODITIES_LIST = ['入库时间', '保质期', '批次号', '库位号', '剩余库存', '选择出库数']

  export default {
    name: COMPONENT_NAME,
    components: {DefaultModal},
    props: {
      batchList: {
        type: Array,
        default: function () {
          return []
        }
      },
      curItem: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        storeList: [],
        numberBatch: 0,
        changeNumber: 0
      }
    },
    created() {
    },
    methods: {
      show(index, item) {
        let value = item || this.curItem
        this.numberBatch = index.toFixed(2)
        this.changeNumber = ((value.base_num * 10 - this.numberBatch * 10) / 10).toFixed(2)
        this.$refs.modal && this.$refs.modal.showModal()
      },
      cancel() {
        this.$refs.modal && this.$refs.modal.hideModal()
      },
      confirm() {
        if (this.curItem.base_num - this.numberBatch !== 0) {
          this.$toast.show('请分配完出库数')
          return
        }
        let arr = []
        this.batchList.forEach((item1) => {
          if (item1.out_count && item1.out_count > 0) {
            let obj = {
              batch_num: item1.batch_num,
              select_out_num: item1.out_count,
              price: item1.price
            }
            arr.push(obj)
          }
        })
        this.$emit('confirm', arr)
      },
      changeInput(item) {
        let number = 0
        let bigNumber = 0
        this.batchList.forEach((item1) => {
          if (item1.id !== item.id && item1.out_count) {
            bigNumber += item1.out_count * 1
          }
        })
        if (item.out_count > this.curItem.base_num - bigNumber) {
          item.out_count = this.curItem.base_num - bigNumber
          let arr = []
          arr = (item.out_count + '').split('.')
          if (arr.length === 2) {
            if (arr[1].length > 3) {
              item.out_count = (this.curItem.base_num - bigNumber).toFixed(2)
              let storeCount = item.out_count.substr(item.out_count.length - 1, 1)
              if (storeCount * 1 === 0) {
                item.out_count = (this.curItem.base_num - bigNumber).toFixed(1)
              }
            }
          }
        }
        this.batchList.forEach((item1) => {
          if (item1.out_count) {
            number += item1.out_count * 1
          }
        })
        if (item.usable_stock * 1 < item.out_count) {
          item.out_count = item.usable_stock
          number = 0
          this.batchList.forEach((item1) => {
            if (item1.out_count) {
              number += item1.out_count * 1
            }
          })
        }
        this.numberBatch = number.toFixed(2)
        this.changeNumber = ((this.curItem.base_num * 10 - this.numberBatch * 10) / 10).toFixed(2)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .default-input
    background: #fff
    width: 1000px
    border-radius: 2px
    padding: 0 20px 100px
    .title-box
      display: flex
      box-sizing: border-box
      padding: 23px 0
      align-items: center
      justify-content: space-between
      .title
        font-size: $font-size-16
        font-family: $font-family-medium
        line-height: 1
        color: $color-text-main
      .close
        width: 12px
        height: @width
        icon-image('icon-close')
  .select-icon
    width: 16px
    height: 16px
    display: block
    border-radius: 50%
    background: #333
  .select-icon-active
    background: red
  .edit-item
    display: flex
    color: #2A2A2A
    min-height: 40px
    margin-top: 20px
    .edit-title
      margin-top: 7.5px
      font-size: $font-size-14
      font-family: $font-family-regular
      white-space: nowrap
      text-align: left
      margin-right: 20px
      width: 64px
    .start
      display: inline-block
      margin-right: -2px
      color: #F52424
    .edit-input-box
      margin-left: 40.9px
    .edit-input
      font-size: $font-size-14
      padding: 0 14px
      border-radius: 2px
      width: 400px
      height: 40px
      border: 1px solid $color-line
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

  .main-input
    min-height: 180px
    layout()
    justify-content: space-between
  .batch-title
    margin-bottom: 20px
    layout(row)
    .batch-box
      font-size: $font-size-14
      color: $color-text-main
      font-family: $font-family-regular
      margin-right: 58px
      .color-active
        color: $color-negative
  .btn-group
    text-align: center
    display: flex
    justify-content: flex-end
    user-select: none
    .btn
      width: 96px
      height: 40px
      line-height: 40px
      border-radius: 2px
      cursor: pointer
      transition: all 0.3s
    .cancel
      border: 1px solid $color-line
      &:hover
        color: $color-text-sub
        border-color: $color-text-sub
    .confirm
      border: 1px solid $color-main
      background: $color-main
      color: $color-white
      margin-left: 20px
      &:hover
        opacity: 0.8
    .one-btn
      margin-left: 0
  .list-item-input-box
    layout(row)
    align-items: center
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
</style>
