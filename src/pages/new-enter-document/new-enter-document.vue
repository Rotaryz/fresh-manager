<template>
  <div class="new-enter-document detail-content">
    <div class="identification">
      <div class="identification-page">
        <img src="./icon-out_stocknew@2x.png" class="identification-icon">
        <p class="identification-name">新建入库单</p>
      </div>
    </div>
    <div class="content-header">
      <div class="content-title">基本信息</div>
    </div>
    <div class="rush-time">
      <div class="edit-item">
        <div class="edit-input-title">
          <span class="start">*</span>
          商品提供方
        </div>
        <div class="edit-input-box">
          <input v-model="msg.goods_supplier" type="text" placeholder="请输入" maxlength="20" class="edit-input">
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-input-title">
          <span class="start">*</span>
          入库类型
        </div>
        <div class="edit-input-box">
          <base-drop-down :width="400" :height="40" :select="entryType" @setValue="_selectEntryType"></base-drop-down>
        </div>
      </div>
    </div>

    <div class="content-header">
      <div class="content-title">商品信息</div>
    </div>
    <div class="activity-box">
      <div class="activity-list">
        <div class="activity-tab">
          <div class="add-goods-btn hand" @click="_showGoods">
            <img class="icon" src="./icon-add@2x.png" alt="">
            添加商品
          </div>
          <!--<div class="remind">商品数量一共可添加({{goodsList.length}}/{{personAllBuyLimit}})个</div>-->
        </div>
        <div v-if="goodsList.length" class="rush-list-box">
          <div class="commodities-list-header com-list-box commodities-list-top">
            <div v-for="(item, index) in commodities" :key="index" class="com-list-item">{{item.name}}</div>
          </div>
          <div class="big-box">
            <div v-for="(item, index) in goodsList" :key="index" class="com-list-box com-list-content">
              <div class="com-list-item list-double-row">
                <span>{{item.goods_name}}</span>
                <span>{{item.goods_sku_encoding}}</span>
              </div>

              <div class="com-list-item">{{item.goods_material_category}}</div>
              <!--入库数量-->
              <div class="com-list-item">
                <input v-model="item.base_num" :readonly="disable" type="number" class="com-edit" @input="changeNum(item, index)">
                <span>{{item.base_unit}}</span>
              </div>
              <!--<div class="com-list-item">
                <input v-model="item.purchase_num" :readonly="disable" type="number" class="com-edit" @input="changePurchase(item, index)">
                <span>{{item.purchase_unit}}</span>
              </div>-->
              <!--入库单价-->
              <div class="com-list-item">
                <input v-model="item.price" :readonly="disable" type="number" class="com-edit" @input="changePrice(item, index)">
              </div>
              <div class="com-list-item">¥{{item.total}}</div>
              <!--保质期-->
              <div class="com-list-item">
                <date-picker
                  style="width: 110px; height: 34px"
                  class="date-picker"
                  type="date"
                  :editable="false"
                  placeholder="保质时间"
                  placement="bottom-end"
                  :value="item.shelf_life"
                  @on-change="changeTime($event, index)"
                ></date-picker>
              </div>
              <div class="com-list-item position">
                <!--<input v-model="item.store_house" :readonly="disable" type="text" class="com-edit com-edit-big">-->
                <div class="select-time" @click="setStoreFn(index)">
                  <div v-if="item.warehouse_position" class="select-time-name">{{item.warehouse_position}}</div>
                  <div v-if="!item.warehouse_position" class="select-time-name">请选择</div>
                  <!--<div class="select-time-icon"></div>-->
                </div>
                <span v-if="item.store_house" class="del" @click="deleteStoreHouse(item, index)"></span>
              </div>
              <div class="com-list-item">
                <span :class="{'list-operation-disable': disable}" class="list-operation" @click="_showDelGoods(item, index)">删除</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <!--确定取消弹窗-->
    <default-confirm ref="confirm" @confirm="_delGoods"></default-confirm>
    <default-store ref="modalBox" @confirm="confirm"></default-store>
    <div class="back">
      <div class="back-cancel back-btn hand" @click="_back">取消</div>
      <div class="back-btn back-submit hand" @click="_saveEntryOrder">保存</div>
    </div>
    <select-store ref="goodsPop" :stock="false" @additionOne="additionOne" @batchAddition="batchAddition"></select-store>
  </div>
</template>

<script type="text/ecmascript-6">
  // import DefaultModal from '@components/default-modal/default-modal'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import DefaultStore from '@components/default-store/default-store'
  import SelectStore from '@components/select-store/select-store'
  import {merchantOrderComputed, merchantOrderMethods} from '@state/helpers'
  import API from '@api'
  import {objDeepCopy} from '@utils/common'
  import {DatePicker} from 'iview'

  const PAGE_NAME = 'CONSUMER_ORDER_DETAIL'
  const TITLE = '新建入库单'

  const COMMODITIES_LIST = [
    {name: '商品', value: 'name', flex: 1,},
    {name: '分类', value: 'goods_category_name', flex: 1},
    {name: '入库数量(基本单位)', value: 'enter_count', flex: 1, unit: 'kg'},
    // {name: '入库数量(采购单位)', value: 'enter_count', flex: 1, unit: '箱'},
    {name: '入库单价(基本单位)', value: 'enter_price', flex: 1, unit: '元/kg'},
    {name: '入库金额', value: 'enter_price', flex: 1},
    {name: '保质期', value: '', flex: 1},
    {name: '存放库位', value: 'store_house', flex: 1, unit: ''},
    {name: '操作', value: '', flex: 1},
  ]

  const RATE = /^[0-9]\d*$/

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      // DefaultModal,
      DefaultConfirm,
      SelectStore,
      DefaultStore,
      DatePicker
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        classifyIndex: 0,
        id: null,
        page: 1,
        choeesGoods: [],
        assortment: {
          check: false,
          show: false,
          content: '选择分类',
          type: 'default',
          data: [] // 格式：{title: '55'}}
        },
        secondAssortment: {
          check: false,
          show: false,
          content: '选择二级分类',
          type: 'default',
          data: [] // 格式：{title: '55'}}
        },
        goodsPage: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        entryType: {
          check: false,
          show: false,
          content: '选择入库类型',
          type: 'default',
          data: [{name: '退货入库', type: 1}, {name: '其它入库', type: 2}] // 格式：{title: '55'}}
        },
        parentId: '',
        keyword: '',
        selectGoods: [], // 单次选择的商品
        selectGoodsId: [], // 所有选择的商品id
        goodsDelId: 0,
        goodsDelIndex: 0,
        selectDelId: [],
        disable: false,
        goodsList: [],
        msg: {
          goods_supplier: '',
          type: ''
        },
        isSubmit: false,
        activityTheme: '',
        pageConfig: {},
        curIndex: ''
      }
    },

    computed: {
      ...merchantOrderComputed,
      testProvider() {
        return this.msg.goods_supplier
      },
      testEntryType() {
        return this.msg.type
      },
      testGoods() {
        return this.goodsList.length
      },
      testGoodsCount() {
        let result = this.goodsList.every(item => {
          !item.base_num && this.$toast.show(`请输入“${item.name}”入库数量`)
          if (item.base_num < 1 || RATE.test(item.base_num)) {
            this.$toast.show(`入库数量应为大于0的整数`)
          }
          return item.base_num > 0 && RATE.test(item.base_num)
        })
        return result
      }
    },
    created() {
      this.getEntryOutType()
    },
    methods: {
      ...merchantOrderMethods,
      _selectEntryType(item) {
        this.msg.type = item.type
      },
      fixPosition() {
        if (!this.testMobile) return
        API.merchantOrder.fixPosition({mobile: this.msg.mobile})
          .then(res => {
            if (res.error !== this.ERR_OK) {
              this.$tost.show(res.message)
              return
            }
            this.community.data = res.data
          })
      },
      getEntryOutType() {
        API.Store.getEntryOutType({method: 'create'})
          .then(res => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            this.entryType.data = res.data.entry.map(item => {
              return {
                name: item.type_str,
                type: item.type
              }
            })
          })
      },
      // 修改入库数量（基本单位）
      changeNum(item, index) {
        if (item.base_num < 0) {
          item.base_num = item.base_num * -1
        }
        // let number = item.base_num / item.base_purchase_rate
        // if (number < 0) {
        //   number = 0
        // }
        // item.purchase_num = number
        if (item.base_num) {
          this.goodsList[index].total = (item.base_num * item.price).toFixed(2)
        }
        this.$forceUpdate()
      },
      // 修改入库数量（采购单位）
      changePurchase(item, index) {
        if (item.purchase_num < 0) {
          item.purchase_num = item.purchase_num * -1
        }
        let number = item.purchase_num * item.base_purchase_rate
        if (number < 0) {
          number = 0
        }
        item.base_num = number
        if (item.purchase_num) {
          this.goodsList[index].total = (item.base_num * item.price).toFixed(2)
        }
        this.$forceUpdate()
      },
      // 修改入库单价
      changePrice(item, index) {
        if (item.price < 0) {
          item.price = item.price * -1
        }
        if (item.base_num) {
          this.goodsList[index].total = (item.base_num * item.price).toFixed(2)
        }
        this.$forceUpdate()
      },
      changeTime(e, index) {
        this.goodsList[index].shelf_life = e
      },
      setStoreFn(index) {
        this.curIndex = index
        this.$refs.modalBox.getStoreList()
        this.$refs.modalBox.show()
      },
      confirm(id, text) {
        this.$set(this.goodsList[this.curIndex], 'warehouse_position_id', id)
        this.$set(this.goodsList[this.curIndex], 'warehouse_position', text)
        // this.goodsList[this.curIndex].warehouse_position_id = id
        // this.goodsList[this.curIndex].warehouse_position = text
        this.$refs.modalBox.cancel()
      },
      deleteStoreHouse(item, index) {
        this.goodsList = this.goodsList.map((goods, ind) => {
          if (ind === index) {
            goods.store_house = ''
          }
          return goods
        })
      },
      // 删除商品
      _showDelGoods(item, index) {
        if (this.disable) {
          return
        }
        // this.goodsDelId = item.goods_id
        this.goodsDelIndex = index
        this.$refs.confirm.show('是否确定删除该商品？')
      },
      // 删除商品弹窗
      _delGoods() {
        // let index = this.selectGoodsId.findIndex((item) => item === this.goodsDelId)

        // this.selectGoodsId.splice(this.goodsDelIndex, 1)
        this.goodsList.splice(this.goodsDelIndex, 1)
        // this.selectDelId.push(this.goodsDelId)
      },
      // 单个添加
      additionOne(item, index) {
        let isExist = false
        let obj =
          (item)
        obj.price = 0
        obj.total = 0
        this.goodsList.forEach((item) => {
          if (item.goods_id === obj.goods_id) {
            isExist = true
          }
        })
        if (!isExist) {
          this.goodsList.push(obj)
        }
      },
      batchAddition(list) {
        list.forEach((item) => {
          let isExist = false
          this.goodsList.forEach((item1) => {
            if (item.goods_id * 1 === item1.goods_id * 1) {
              isExist = true
            }
          })
          if (!isExist) {
            let obj = objDeepCopy(item)
            obj.price = 0
            obj.total = 0
            obj.base_num = ''
            this.goodsList.push(obj)
          }
        })
      },
      async _showGoods() {
        // if (this.disable) {
        //   return
        // }
        // await this._getGoodsList()
        // // 展示添加商品弹窗
        // this.$refs.goodsModel && this.$refs.goodsModel.showModal()
        this.$refs.goodsPop._delGoods(this.goodsList)
      },
      _hideGoods() {
        this.$refs.goodsModel.hideModal()
      },
      // 切换分类
      _setClassify(index, item) {
        this.classifyIndex = index
      },
      _back() {
        this.$router.back()
      },
      //  保存
      async _saveEntryOrder() {
        if (this.isSubmit) return
        let checkForm = this.checkForm()
        if (!checkForm) return
        let checkGoods = this.checkGoods()
        if (!checkGoods) return
        let data = Object.assign({}, this.msg, {details: this.goodsList})
        let res = null
        this.isSubmit = true
        res = await API.Store.saveEntryOrder(data, true)
        this.$loading.hide()
        this.$toast.show(res.message)
        if (res.error !== this.$ERR_OK) {
          this.isSubmit = false
          return
        }
        this.$toast.show('新建入库单成功')
        this._back()
      },
      checkForm() {
        let arr = [
          {value: this.testProvider, txt: '请输入商品提供方'},
          {value: this.testEntryType, txt: '请选择入库类型'},
          {value: this.testGoods, txt: '请选择商品'}
          // {value: this.testGoodsCount, txt: ''},
        ]
        for (let i = 0, j = arr.length; i < j; i++) {
          if (!arr[i].value) {
            this.$toast.show(arr[i].txt)
            return false
          }
          if (i === j - 1 && arr[i].value) {
            return true
          }
        }
      },
      checkGoods() {
        let result = this.goodsList.every(item => {
          !item.base_num && this.$toast.show(`请输入“${item.name}”入库数量`)
          if (item.base_num < 1 || !RATE.test(item.base_num)) {
            this.$toast.show(`入库数量应为大于0的整数`)
          }
          return item.base_num > 0 && RATE.test(item.base_num)
        })
        return result
      },
      echangBase(item, index) {
        if (item.usable_stock > item.all_stock && !this.disable) {
          item.usable_stock = item.all_stock
          this.$forceUpdate()
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/detail"

  .new-enter-document
    padding-bottom: 20px
    position: relative
    flex: 1
    font-family: $font-family-regular
    font-size: $font-size-14
    min-width: 1360px
    .rush-time
      margin-bottom: 27px
    .edit-item
      display: flex
      color: #2A2A2A
      margin-top: 24px
      align-items: center
      position: relative
      .edit-input-title
        font-size: $font-size-14
        font-family: $font-family-regular
        white-space: nowrap
        text-align: right
        min-width: 84px
      .start
        display: inline-block
        margin-right: -2px
        color: #F52424
      .edit-input-box
        margin: 0 14px 0 40px
        &:nth-child(4)
          margin: 0 14px
        .edit-input
          font-size: $font-size-12
          border-radius: 2px
          padding: 0 14px
          width: 400px
          height: 40px
          display: flex
          align-items: center
          justify-content: space-between
          font-family: $font-family-regular
          color: $color-text-main
          border: 1px solid $color-line
          transition: all 0.3s
          &:hover
            border-color: #ACACAC
          &:focus
            border-color: $color-main
          .edit-time
            color: $color-text-assist
            font-family: $font-family-regular
            font-size: $font-size-12
        .disable-input
          background: #F5F5F5
          color: #ACACAC
      .edit-input-right
        margin-left: 14px
      .tip
        line-height: 40px
        font-size: $font-size-12
        font-family: $font-family-regular
        color: $color-text-main
      .tip-text
        margin-left: 2px
        line-height: 40px
        font-size: $font-size-12
        font-family: $font-family-regular
        color: $color-text-assist
      .btn-text
        color: #4D77BD
        font-family: $font-family-regular
        font-size: $font-size-14


    .activity-tab
      margin: 24px 0
      display: flex
      align-items: center
      box-sizing: border-box
      .add-goods-btn
        box-sizing: border-box
        height: 32px
        line-height: 32px
        width: 108px
        color: #4DBD65
        font-size: $font-size-14
        font-family: $font-family-regular
        transition: all 0.3s
        text-align: center
        border-radius: 2px
        border: 1px solid #4DBD65
        display: flex
        align-items: center
        justify-content: center
      .icon
        width: 10px
        height: 10px
        margin-right: 5px
        object-fit: cover
      .remind
        margin-left: 10px
        color: $color-text-assist
      .disable
        cursor: not-allowed
    .com-edit
      height: 34px
      width: 80px
      border-radius: 2px
      box-sizing: border-box
      border: 1px solid $color-line
      padding-left: 10px
      transition: all 0.3s
      &::-webkit-inner-spin-button
        appearance: none
      &:hover
        border: 0.5px solid #ACACAC
      &::placeholder
        font-family: $font-family-regular
        color: $color-text-assist
      &:focus
        border-color: $color-main !important

    .com-edit-big
      width: 110px
    .com-list-item.position
      position: relative
    .com-list-box .com-list-item
      .list-operation
        margin-left: 0
      .del
        width: 16px
        height: 16px
        position: absolute
        right: 38px
        top: 9px
        cursor: pointer
        background: url("./icon-close_content1@2x.png")
        background-size: 100% 100%
        transition: all 0.3s
        &:hover
          background: url("./icon-close_content2@2x.png")
          background-size: 100% 100%
      span
        margin-left: 10px
      &:first-child
        flex: 2
      &:last-child
        max-width: 53px
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
    .big-box
      .list-double-row
        flex-direction: column
        display: flex
        span
          text-overflow: ellipsis
          overflow: hidden
          white-space: nowrap
    .ivu-date-picker
      .ivu-input-type
        height: 100%
      .ivu-input-icon
        height: 34px
        line-height: 34px
      .ivu-input
        height: 100%
</style>
