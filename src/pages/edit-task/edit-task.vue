<template>
  <div class="procurement-task table">
    <div class="down-content">
      <div class="enter-title">采购单号：--------</div>
      <div class="enter-title">采购商品数：{{taskList.length}}</div>
      <div class="enter-title">总采购金额：<span class="enter-title-money">￥{{taskTotal}}</span></div>
      <div class="enter-title">供应商：{{supplier_name || '--------'}}</div>
      <div class="enter-title">状态：--------</div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-inventory@2x.png" class="identification-icon">
          <p class="identification-name">商品明细</p>
        </div>
      </div>
      <div class="big-list" :class="taskList.length > 10 ? 'big-list-max' : ''">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in taskList" :key="index" class="list-content list-box">
            <div class="list-item list-double-row">
              <div class="item-dark">{{item.goods_name}}</div>
              <div class="item-dark">{{item.goods_sku_encoding}}</div>
            </div>
            <div class="list-item">{{item.goods_material_category}}</div>
            <div class="list-item list-item-layout">
              <input v-model="item.sale_num" type="number" class="edit-input" @input="changeSale(item, index)">
              <div class="base-unit">{{item.sale_unit}}</div>
            </div>
            <div class="list-item list-item-layout">
              <input v-model="item.base_num" type="number" class="edit-input" @input="changeBase(item, index)">
              <div class="base-unit">{{item.base_unit}}</div>
            </div>
            <div class="list-item list-item-layout">
              <input v-model="item.purchase_num" type="number" class="edit-input" @input="changePurchase(item, index)">
              <div class="base-unit">{{item.purchase_unit}}</div>
            </div>
            <div class="list-item list-item-layout">
              <input v-model="item.purchase_price" type="number" class="edit-input" @input="changePrice(item, index)">
              <div class="base-big-unit">元/{{item.purchase_unit}}</div>
            </div>
            <div class="list-item">{{item.total ? '￥' + item.total : '￥0.00'}}</div>
          </div>
        </div>
      </div>
      <div class="back">
        <div class="back-cancel back-btn hand" @click="_back">返回</div>
        <div class="back-btn back-submit hand" @click="submitSure">确认提交</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import {proTaskComputed, proTaskMethods} from '@state/helpers'

  const PAGE_NAME = 'PROCUREMENT_TASK'
  const TITLE = '商品详情'
  const COMMODITIES_LIST = [
    '商品',
    '类目',
    '采购数量(销售单位)',
    '采购数量(基本单位)',
    '采购数量(采购单位)',
    '采购单价',
    '采购金额'
  ]
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        taskList: [],
        outMsg: {},
        supplier_id: '',
        supplier_name: '',
        isSubmit: false,
        taskTotal: 0
      }
    },
    computed: {
      ...proTaskComputed
    },
    created() {
      this.taskList = JSON.parse(JSON.stringify(this.editTaskList))
      this.supplier_name = this.taskList[0] ? this.taskList[0].supplier : ''
      this.supplier_id = this.taskList[0] ? this.taskList[0].supplier_id : ''
      this.taskList.forEach((item) => {
        item.purchase_num = item.plan_num - item.finish_num > 0 ? (item.plan_num - item.finish_num).toFixed(2) : 0
        item.base_num =
          item.plan_base_num - item.finish_base_num > 0 ? (item.plan_base_num - item.finish_base_num).toFixed(2) : 0
        item.sale_num = (item.base_num / item.base_sale_rate).toFixed(2)
        item.total = (item.purchase_num * item.purchase_price).toFixed(2)
      })
      this.calculateTotal()
    },
    methods: {
      ...proTaskMethods,
      async submitSure() {
        for (let i = 0; i < this.taskList.length; i++) {
          if (!this.taskList[i].purchase_num) {
            this.$toast.show(`请输入第${i + 1}行的采购数量`)
            return
          }
          if (!this.taskList[i].base_num) {
            this.$toast.show(`请输入第${i + 1}行的基本数量`)
            return
          }
          if (this.taskList[i].purchase_price < 0 || this.taskList[i].purchase_price === '') {
            this.$toast.show(`请输入第${i + 1}行的采购单价`)
            return
          }
        }
        let arr = []
        this.taskList.forEach((item) => {
          let obj = {
            purchase_num: item.purchase_num,
            purchase_price: item.purchase_price,
            goods_sku_code: item.goods_sku_code,
            id: item.id
          }
          arr.push(obj)
        })
        if (this.isSubmit) return
        this.isSubmit = true
        let res = await API.Supply.submitPurchaseOrder({
          supplier_id: this.supplier_id,
          tasks: arr
        })
        this.$toast.show(res.message)
        this.$loading.hide()
        if (res.error !== this.$ERR_OK) {
          this.isSubmit = false
          return
        }
        this.setGoBackNumberSub()
        if (this.goBackNumber > 0) {
          this.$router.back()
        } else {
          this.$router.push('/home/purchase-order')
        }
      },
      // 修改基本单位采购数量
      changeBase(item, index) {
        if (item.base_num < 0) {
          item.base_num = item.base_num * -1
        }
        let number = item.base_num / item.purchase_base_rate
        if (number < 0) {
          number = 0
        }
        item.purchase_num = number.toFixed(2)
        item.sale_num = (item.base_num / item.base_sale_rate).toFixed(2)
        if (!(!item.purchase_price || item.purchase_price < 0) && item.base_num) {
          this.taskList[index].total = (item.purchase_num * item.purchase_price).toFixed(2)
          this.calculateTotal()
        }
        this.$forceUpdate()
      },
      // 修改销售单位采购数量
      changeSale(item, index) {
        if (item.sale_num < 0) {
          item.sale_num = item.sale_num * -1
        }
        let number = item.sale_num * item.base_sale_rate
        if (number < 0) {
          number = 0
        }
        item.base_num = number.toFixed(2)
        item.purchase_num = item.base_num / item.purchase_base_rate
        if (!(!item.purchase_price || item.purchase_price < 0) && item.base_num) {
          this.taskList[index].total = (item.purchase_num * item.purchase_price).toFixed(2)
          this.calculateTotal()
        }
        this.$forceUpdate()
      },
      // 修改采购单位采购数量
      changePurchase(item, index) {
        if (item.purchase_num < 0) {
          item.purchase_num = item.purchase_num * -1
        }
        let number = item.purchase_num * item.purchase_base_rate
        if (number < 0) {
          number = 0
        }
        item.base_num = number.toFixed(2)
        item.sale_num = (item.base_num / item.base_sale_rate).toFixed(2)
        if (!(!item.purchase_price || item.purchase_price < 0) && item.base_num) {
          this.taskList[index].total = (item.purchase_num * item.purchase_price).toFixed(2)
          this.calculateTotal()
        }
        this.$forceUpdate()
      },
      _back() {
        this.$router.back()
      },
      changePrice(item, index) {
        if (item.purchase_price < 0) {
          item.purchase_price = item.purchase_price * -1
        }
        if (!item.purchase_price || item.purchase_price < 0) return
        if (item.purchase_num) {
          this.taskList[index].total = (item.purchase_num * item.purchase_price).toFixed(2)
          this.calculateTotal()
        }
        this.$forceUpdate()
      },
      calculateTotal() {
        this.taskTotal = this.taskList.reduce((total, current) => {
          if (!current.total < 0) return 0
          let money = total * 1 + current.total * 1
          money = money.toFixed(2)
          return money
        }, 0)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .base-unit
    no-wrap()
    width: 32px
  .base-big-unit
    no-wrap()
    width: 60px
  .procurement-task
    .list-box
      .list-item
        padding-right: 14px
        &:nth-child(1)
          flex: 1.2
        &:nth-child(3), &:nth-child(4), &:nth-child(5), &:nth-child(6)
          flex-wrap: nowrap
        &:nth-child(7)
          max-width: 110px

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


  .list-item-layout
    layout(row)
    align-items: center
  .edit-input
    font-size: $font-size-14
    padding: 0 14px
    border-radius: 1px
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
  .tip
    margin: 0 2px
    font-size: $font-size-14
  .procurement-task
    padding-bottom: 80px
</style>
