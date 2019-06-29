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
    </div>
    <div class="content-header mt-30">
      <div class="content-title">商品信息</div>
    </div>
    <div class="function-btn btn-box">
      <div class="btn-main" @click="deleteGoods()"><span class="add-icon"></span>添加商品</div>
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
          <div class="list-item">{{item.usable_stock}}{{item.base_unit}}/{{item.total_stock}}{{item.base_unit}}</div>
          <div class="list-item list-item-layout">
            <input v-model="item.base_num" type="number" class="edit-input" @input="changeInput(item, index)">
            <div v-if="item.base_unit" class="base-unit">{{item.base_unit}}</div>
          </div>
          <div class="list-item list-item-batches" @click="outFn(item, index)" @mouseenter="_showTip(index)" @mouseleave="_hideTip">
            <span class="list-operation">{{item.select_batch.length > 0 ? '查看批次' : '选择批次'}}</span>
            <transition name="fade">
              <div v-show="showIndex === index && item.select_batch.length !== 0" class="batches-box">
                <div v-for="(item1, index1) in item.select_batch" :key="index1">
                  <div v-if="item1.select_out_num * 1 > 0" class="batches-box-item">
                    {{item1.batch_num}}: 出库{{item1.select_out_num}}{{item.base_unit}}
                  </div>
                </div>
              </div>
            </transition>
          </div>
          <div class="list-item"><span v-if="item.price">￥</span>{{item.price || '￥0.00'}}/{{item.base_unit}}</div>
          <div class="list-item"><span v-if="item.all_price">￥</span>{{item.all_price || '￥0.00'}}</div>
          <div class="list-item list-operation-box">
            <span class="list-operation" @click="delGoodsBtn(item, index)">删除</span>
          </div>
        </div>
      </div>
    </div>
    <div class="back">
      <div class="back-cancel back-btn hand" @click="_back">返回</div>
      <div class="back-btn back-submit hand" @click="submitEdit">保存</div>
    </div>
    <!--<add-goods ref="addg"></add-goods>-->
    <select-store ref="addg" @additionOne="additionOne" @batchAddition="batchAddition"></select-store>
    <default-batch ref="modalBox" :batchList="batchList" :curItem="curItem" @confirm="confirm"></default-batch>
  </div>
</template>

<script type="text/ecmascript-6">
// import AddGoods from '@components/add-goods/add-goods'
  import API from '@api'
  import SelectStore from '@components/select-store/select-store'
  import DefaultBatch from '@components/default-batch/default-batch'

  const PAGE_NAME = 'EDIT_STORE'
  const TITLE = '新建出库单'
  const COMMODITIES_LIST = [
    '序号',
    '商品名称',
    '类目',
    '可用库存/总库存',
    '出库数(基本单位)',
    '出库批次',
    '出库单价',
    '出库金额',
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
      DefaultBatch
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        batchList: [],
        storeList: [],
        curIndex: 0,
        curItem: {},
        storeData: '',
        showIndex: null,
        isSubmit: false
      }
    },
    methods: {
      _showTip(index) {
        this.showIndex = index
      },
      _hideTip() {
        this.showIndex = null
      },
      deleteGoods() {
        this.$refs.addg._delGoods(this.storeList)
      },
      _back() {
        this.$router.back()
      },
      additionOne(item) {
        let isExist = false
        let obj = item
        obj.base_num = ''
        obj.select_batch = []
        this.storeList.forEach((item) => {
          if (item.goods_id === obj.goods_id) {
            isExist = true
          }
        })
        if (!isExist) {
          this.storeList.push(obj)
        }
      },
      batchAddition(list) {
        list.forEach((item) => {
          let isExist = false
          this.storeList.forEach((item1) => {
            if (item.goods_id * 1 === item1.goods_id * 1) {
              isExist = true
            }
          })
          if (!isExist) {
            let obj = item
            obj.base_num = ''
            obj.select_batch = []
            this.storeList.push(obj)
          }
        })
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
        if (item.base_num * 1 > item.usable_stock * 1) {
          item.base_num = item.usable_stock
        }
        this.storeList[index].select_batch = []
        this.storeList[index].price = ''
        this.storeList[index].all_price = ''
        this.$forceUpdate()
      },
      submitEdit() {
        if (this.storeData.length === 0 || this.storeData.length > 20) {
          this.$toast.show('请输入出库对象')
          return
        }
        if (this.storeList.length === 0) {
          this.$toast.show('请选择商品')
          return
        }
        let isInputNull = false
        let isStoreNull = false
        this.storeList.forEach((item) => {
          if (item.base_num.length === 0) {
            isInputNull = true
          }
          if (item.select_batch.length === 0) {
            isStoreNull = true
          }
        })
        if (isInputNull) {
          this.$toast.show('请输入商品列表的出库数')
          return
        }
        if (isStoreNull) {
          this.$toast.show('请选择商品的批次')
          return
        }
        if (this.isSubmit) return
        this.isSubmit = true
        API.Store.editOutOrder({type: 8, details: this.storeList, out_object: this.storeData}).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.$toast.show('新建出库单成功')
            this.$router.back()
          } else {
            this.$toast.show(res.message)
            this.isSubmit = false
          }
        })
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
      &:nth-child(3)
        flex: 1.5
      &:nth-child(5)
        flex-wrap: nowrap
        min-width: 150px
      &:nth-child(6)
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

</style>
