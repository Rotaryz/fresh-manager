<template>
  <div class="edit-store">
    <div class="identification">
      <div class="identification-page">
        <img src="./icon-out_stocknew@2x.png" class="identification-icon">
        <p class="identification-name">新建出库单</p>
      </div>
      <div class="function-btn">
      </div>
    </div>
    <div class="content-header">
      <div class="content-title">基本信息</div>
    </div>
    <div class="leader-box">
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          出库对象
        </div>
        <div class="edit-input-box">
          <input v-model="storeData" type="text" class="edit-input" maxlength="20" @mousewheel.native.prevent>
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          出库类型
        </div>
        <div class="edit-input-box">
          <base-drop-down :width="400" :height="40" :select="outType" @setValue="_selectOutType"></base-drop-down>
        </div>
      </div>
    </div>
    <div class="content-header mt-30">
      <div class="content-title">商品信息</div>
    </div>
    <div class="function-btn btn-box">
      <div class="btn-main" @click="_showGoods()"><span class="add-icon"></span>添加商品</div>
    </div>
    <div class="big-list" :class="storeList.length > 10 ? 'big-list-max' : ''">
      <div class="list-header list-box">
        <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
      </div>
      <div class="list">
        <div v-for="(item, index) in storeList" :key="index" class="list-content list-box">
          <div class="list-item">{{index + 1}}</div>
          <div class="list-item list-double-row">
            <p class="item-dark">{{item.goods_name}}</p>
            <p class="item-sub">{{item.goods_sku_encoding}}</p>
          </div>
          <div class="list-item">{{item.goods_material_category}}</div>
          <div class="list-item">{{item.usable_stock}}{{item.base_unit}}</div>
          <!--<div class="list-item">{{item.usable_stock}}{{item.base_unit}}/{{item.total_stock}}{{item.base_unit}}</div>-->
          <div class="list-item list-item-layout">
            <input v-model="item.base_num" type="number" class="edit-input" :class="{'red': item.is_error}" @input="changeInput(item, index)">
            <div v-if="item.base_unit" class="base-unit">{{item.base_unit}}</div>
          </div>
          <div class="list-item list-operation-box">
            <span class="list-operation" @click="delGoodsBtn(item, index)">删除</span>
          </div>
        </div>
      </div>
    </div>
    <div class="back">
      <div class="back-cancel back-btn hand" @click="_back">返回</div>
      <div class="back-btn back-submit hand" @click="saveOutOrder">保存</div>
    </div>
    <!--<add-goods ref="addg"></add-goods>-->
    <select-store ref="goodsPop" @batchAddition="batchAddition"></select-store>
    <default-batch ref="modalBox" :batchList="batchList" :curItem="curItem" @confirm="confirm"></default-batch>
    <default-confirm ref="confirm"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
// import AddGoods from '@components/add-goods/add-goods'
  import API from '@api'
  import SelectStore from '@components/select-store/select-store'
  import DefaultBatch from '@components/default-batch/default-batch'
  import DefaultConfirm from '@components/default-confirm/default-confirm'

  const PAGE_NAME = 'EDIT_STORE'
  const TITLE = '新建出库单'
  const COMMODITIES_LIST = [
    '序号',
    '商品',
    '类目',
    '可用库存',
    '出库数量(基本单位)',
    // '出库批次',
    // '出库单价',
    // '出库金额',
    '操作'
  ]

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      // AddGoods,
      SelectStore,
      DefaultBatch,
      DefaultConfirm
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        batchList: [],
        storeList: [],
        curIndex: 0,
        curItem: {},
        outType: {
          check: false,
          show: false,
          content: '选择出库类型',
          type: 'default',
          data: [{name: '采购退货', type: 1}, {name: '拓展出库', type: 2}, {name: '其它调拨', type: 3}] // 格式：{title: '55'}}
        },
        storeData: '',
        storeType: '',
        showIndex: null,
        isSubmit: false
      }
    },
    created() {
      this.getEntryOutType()
    },
    methods: {
      _showTip(index) {
        this.showIndex = index
      },
      _hideTip() {
        this.showIndex = null
      },
      getEntryOutType() {
        API.Store.getEntryOutType({method: 'create'}).then((res) => {
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return
          }
          this.outType.data = res.data.out.map((item) => {
            return {
              name: item.type_str,
              type: item.type
            }
          })
        })
      },
      _selectOutType(item) {
        this.storeType = item.type
      },
      _showGoods() {
        this.$refs.goodsPop && this.$refs.goodsPop.showModal(this.storeList)
      },
      _back() {
        this.$router.back()
      },
      batchAddition(list) {
        let arr = JSON.parse(JSON.stringify(list))
        let newArr = arr.map((item) => {
          let isExist = false
          this.storeList.forEach((goods) => {
            if (item.goods_id * 1 === goods.goods_id * 1) {
              isExist = true
            }
          })
          if (!isExist) {
            item.base_num = ''
            item.select_batch = []
          }
          return item
        })
        this.storeList = newArr
      },
      outFn(item, index) {
        if (item.base_num.length === 0) {
          this.$toast.show('请输入出库数')
          return
        }
        this.curItem = item
        this.curIndex = index
        this.getOutBatchList(index)
      },
      getOutBatchList(index) {
        API.Store.outBatchList({goods_sku_code: this.storeList[index].goods_sku_code}).then((res) => {
          if (res.error === this.$ERR_OK) {
            let number = 0
            this.batchList = res.data
            if (this.storeList[index].select_batch.length) {
              this.storeList[index].select_batch.forEach((item) => {
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
      confirm(arr) {
        this.storeList[this.curIndex].select_batch = arr
        let allprice = 0
        let number = 0
        arr.forEach((item) => {
          if (item.select_out_num > 0) {
            number += item.select_out_num * 1
            allprice += item.select_out_num * item.price
          }
        })
        if (number * 1 === 0) {
          this.storeList[this.curIndex].price = ''
        } else {
          this.storeList[this.curIndex].price = (allprice / number).toFixed(2)
        }
        this.storeList[this.curIndex].all_price = allprice.toFixed(2)
        this.$forceUpdate()
        this.$refs.modalBox.cancel()
      },
      delGoodsBtn(item, index) {
        this.storeList.splice(index, 1)
      },
      changeInput(item, index) {
        if (item.base_num < 0) {
          item.base_num = item.base_num * -1
        }
        if (item.base_num * 1 > item.usable_stock * 1) {
          item.base_num = item.usable_stock
        }
        item.is_error = 0
        // this.storeList[index].select_batch = []
        // this.storeList[index].price = ''
        // this.storeList[index].all_price = ''
        this.$forceUpdate()
      },
      saveOutOrder() {
        if (this.storeData.length === 0 || this.storeData.length > 20) {
          this.$toast.show('请输入出库对象')
          return
        }
        if (!this.storeType) {
          this.$toast.show('请选择出库类型')
          return
        }
        if (this.storeList.length === 0) {
          this.$toast.show('请选择商品')
          return
        }
        let isInputNull = false
        // let isStoreNull = false
        this.storeList.forEach((item) => {
          if (item.base_num.length === 0 || +item.base_num === 0) {
            isInputNull = true
          }
        })
        if (isInputNull) {
          this.$toast.show('请输入大于0的出库数')
          return
        }
        if (this.isSubmit) return
        this.isSubmit = true
        API.Store.editOutOrder({type: this.storeType, details: this.storeList, out_object: this.storeData}).then(
          (res) => {
            if (res.error === this.$ERR_OK) {
              if (res.data) {
                this.isSubmit = false
                this.storeList = res.data.details
                this.$refs.confirm.show('可用库存不足，请重新输入出库数量')
              } else {
                this.$toast.show('新建出库单成功')
                this.$router.back()
              }
            } else {
              this.$toast.show(res.message)
              this.isSubmit = false
            }
          }
        )
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/detail"
  .base-unit
    no-wrap()
    width: 38px
  .list-box
    .list-item
      box-sizing: border-box
      padding-right: 10px
      flex: 1
      &:nth-child(1)
        flex: 0.4
      &:nth-child(2)
        flex: 1.5
      &:nth-child(5)
        flex-wrap: nowrap
      &:nth-child(6)
        min-width: 60px
        .list-operation
          &:after
            display: none
      &:last-child
        flex: 0.6
  .edit-store
    position: relative
    flex: 1
    background: $color-white
    padding: 0 20px 80px
    box-sizing: border-box
  .mt-30
    margin-top: 30px
  .btn-box
    padding: 24px 0
  .leader-box
    padding: 0 20px
    box-sizing: border-box
    .edit-item
      display: flex
      color: #2A2A2A
      min-height: 40px
      margin-top: 24px
      .edit-title
        margin-top: 7.5px
        font-size: $font-size-14
        font-family: $font-family-regular
        white-space: nowrap
        text-align: left
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
  .list-item-layout
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
  .list-item-batches
    position: relative
    overflow: inherit !important
    .batches-box
      position: absolute
      top: 21px
      left: 0
      box-sizing: border-box
      padding: 12px 37px 0 12px
      background: rgba(51, 51, 51, .8)
      font-size: $font-size-14
      font-family: $font-family-regular
      color: $color-white
      z-index: 99
      margin-bottom: 8px
      max-height: 300px
      overflow: auto
      &::-webkit-scrollbar
        width: 0
        height: 0
        transition: all 0.2s

      &::-webkit-scrollbar-thumb
        background-color: rgba(255, 255, 255, .5)
        border-radius: 10px

      &::-webkit-scrollbar-thumb:hover
        background-color: rgba(255, 255, 255, .8)

      &::-webkit-scrollbar-track
        box-shadow: inset 0 0 6px rgba(255, 255, 255, .5)
        border-radius: 10px
      &.fade-enter, &.fade-leave-to
        opacity: 0
      &.fade-enter-to, &.fade-leave-to
        transition: all .3s ease-in-out
      &:last-child
        margin-bottom: 0
      &::-webkit-scrollbar
        transition: all 0.2s
        width: 6px
        height: 8px
      .batches-box-item
        margin-bottom: 12px
        height: 15px
        line-height: 15px
  .red
    color: #F53737

</style>
