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
                <span>{{item.name}}</span>
                <span>{{item.goods_sku_code}}</span>
              </div>

              <div class="com-list-item">{{item.goods_category_name}}</div>
              <!--入库数量-->
              <div class="com-list-item">
                <input v-model="item.base_num" :readonly="disable" type="number" class="com-edit" @input="changeNum(item, index)">
                <span>{{item.base_unit}}</span>
              </div>
              <div class="com-list-item">
                <input v-model="item.purchase_num" :readonly="disable" type="number" class="com-edit" @input="changePurchase(item, index)">
                <span>{{item.purchase_unit}}</span>
              </div>
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

    <!-- 选择商品弹窗-->
    <default-modal ref="goodsModel">
      <div slot="content" class="shade-box">
        <div class="title-box">
          <div class="title">选择商品</div>
          <span class="close hand" @click="_cancelGoods"></span>
        </div>
        <div class="shade-tab">
          <div class="tab-item">
            <base-drop-down :width="218" :select="assortment" @setValue="_secondAssortment"></base-drop-down>
          </div>
          <div class="tab-item">
            <base-drop-down :width="140" :select="secondAssortment" @setValue="_choessSecondAssortment"></base-drop-down>
          </div>
          <div class="tab-item">
            <base-search placeHolder="请输入商品名称" @search="_searchGoods"></base-search>
          </div>
        </div>
        <div class="goods-content">
          <div class="rush-goods-list">
            <div v-for="(item, index) in choeesGoods" :key="index" class="goods-item">
              <span class="select-icon hand" :class="{'select-icon-disable': item.selected === 1, 'select-icon-active': item.selected === 2}" @click="_selectGoods(item,index)"></span>
              <div class="goods-img" :style="{'background-image': 'url(\'' + item.goods_cover_image + '\')'}"></div>
              <div class="goods-msg">
                <!--<div class="goods-name">{{item.usable_stock}}</div>-->
                <div class="goods-name">{{item.name}}</div>
                <div class="goods-money">
                  <div class="goods-money-text">{{item.usable_stock}}</div>
                  <div class="goods-money-text">¥{{item.trade_price}}</div>
                </div>
              </div>
              <div class="add-btn btn-main" :class="{'add-btn-disable': item.selected === 1}" @click="_additionOne(item, index)">{{item.selected === 1 ? '已添加' : '添加'}}</div>
            </div>
          </div>
        </div>
        <div class="page-box">
          <base-pagination ref="pagination" :pageDetail="goodsPage" @addPage="_getMoreGoods"></base-pagination>
        </div>
        <div class="back">
          <div class="back-cancel back-btn hand" @click="_cancelGoods">取消</div>
          <div class="back-btn back-submit hand" @click="_batchAddition">批量添加</div>
        </div>
      </div>
    </default-modal>
    <!--确定取消弹窗-->
    <default-confirm ref="confirm" @confirm="_delGoods"></default-confirm>
    <default-store ref="modalBox" @confirm="confirm"></default-store>
    <div class="back">
      <div class="back-cancel back-btn hand" @click="_back">取消</div>
      <div class="back-btn back-submit hand" @click="_saveEntryOrder">保存</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import DefaultStore from '@components/default-store/default-store'
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
    {name: '入库数量(采购单位)', value: 'enter_count', flex: 1, unit: '箱'},
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
      DefaultModal,
      DefaultConfirm,
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
      this._getFirstAssortment()
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
      // 选择商品
      async _getGoodsList() {
        // if (!this.id) return
        let res = await API.Sale.getGoodsList({
          is_online: 1,
          keyword: this.keyword,
          goods_category_id: this.parentId,
          limit: 7,
          page: this.page
        })
        if (res.error !== this.$ERR_OK) {
          return
        }
        this.goodsPage = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        this.choeesGoods = res.data.map((item, index) => {
          item.selected = 0
          let idx = this.selectGoodsId.findIndex((id) => id === item.id)
          let goodsIndex = this.selectGoods.findIndex((items) => items.id === item.id)
          let delIndex = this.selectDelId.findIndex((id) => id === item.id)
          delIndex !== -1 && (item.selected = 0)
          idx !== -1 && (item.selected = 1)
          goodsIndex !== -1 && (item.selected = 2)
          item.price = 0
          item.total = 0
          return item
        })
      },
      // 获取分页商品列表
      async _getMoreGoods(page) {
        this.page = page
        await this._getGoodsList()
      },
      // 选择一级分类
      async _secondAssortment(item) {
        this.parentId = item.id
        if (item.id === '') {
          this.secondAssortment.data = []
        } else {
          let res = await API.Product.getCategory({parent_id: this.parentId, get_goods_count: 1})
          this.$loading.hide()
          this.secondAssortment.data = res.error === this.$ERR_OK ? res.data : []
          this.secondAssortment.data.unshift({name: '全部', id: this.parentId})
        }
        this.secondAssortment.content = '选择二级分类'
        this.page = 1
        this.$refs.pagination.beginPage()
        await this._getGoodsList()
      },
      // 选择二级分类
      async _choessSecondAssortment(item) {
        this.parentId = item.id
        this.page = 1
        this.$refs.pagination.beginPage()
        await this._getGoodsList()
      },
      // 获取一级分类
      async _getFirstAssortment() {
        let res = await API.Product.getCategory({parent_id: this.parentId, get_goods_count: 1})
        this.$loading.hide()
        this.assortment.data = res.error === this.$ERR_OK ? res.data : []
        this.assortment.data.unshift({name: '全部', id: ''})
      },
      // 搜索商品
      async _searchGoods(text) {
        this.keyword = text
        this.page = 1
        this.$refs.pagination.beginPage()
        await this._getGoodsList()
      },
      // 勾选商品
      _selectGoods(item, index) {
        if (item.usable_stock <= 0) {
          this.$toast.show('该商品库存为0，不能选择')
          return
        }
        switch (item.selected) {
        case 0:
          // if (this.selectGoodsId.length === 20) {
          //   this.$toast.show(`选择商品数量不能超过${this.personAllBuyLimit}个`)
          //   return
          // }
          this.choeesGoods[index].selected = 2
          item.all_stock = item.usable_stock
          this.selectGoods.push(item)
          this.selectGoodsId.push(item.id)
          break
        case 2:
          this.choeesGoods[index].selected = 0
          let idx = this.selectGoods.findIndex((items) => items.id === item.id)
          let idIdx = this.selectGoodsId.findIndex((id) => id === item.id)
          if (idx !== -1) {
            this.selectGoods.splice(idx, 1)
          }
          if (idIdx !== -1) {
            this.selectGoodsId.splice(idx, 1)
          }
          break
        }
      },
      // 修改入库数量（基本单位）
      changeNum(item, index) {
        if (item.base_num < 0) {
          item.base_num = item.base_num * -1
        }
        let number = item.base_num / item.base_purchase_rate
        if (number < 0) {
          number = 0
        }
        item.purchase_num = number
        if (item.base_num) {
          this.goodsList[index].total = (item.base_num * item.price).toFixed(2)
        }
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
      },
      // 修改入库单价
      changePrice(item, index) {
        if (item.price < 0) {
          item.price = item.price * -1
        }
        if (item.base_num) {
          this.goodsList[index].total = (item.base_num * item.price).toFixed(2)
        }
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
        this.goodsDelId = item.goods_id
        this.goodsDelIndex = index
        this.$refs.confirm.show('是否确定删除该商品？')
      },
      // 删除商品弹窗
      _delGoods() {
        // let index = this.selectGoodsId.findIndex((item) => item === this.goodsDelId)
        this.selectGoodsId.splice(this.goodsDelIndex, 1)
        this.goodsList.splice(this.goodsDelIndex, 1)
        this.selectDelId.push(this.goodsDelId)
      },
      _cancelGoods() {
        this.selectGoods.forEach((item) => {
          let idx = this.choeesGoods.findIndex((items) => items.goods_id === item.goods_id)
          let delIdx = this.selectGoodsId.findIndex((id) => id === item.goods_id)
          this.choeesGoods[idx].selected = this.choeesGoods[idx].selected === 1 ? 1 : 0
          this.selectGoodsId.splice(delIdx, 1)
        })
        this.selectGoods = []
        this._hideGoods()
      },
      // 单个添加
      _additionOne(item, index) {
        if (item.usable_stock <= 0) {
          this.$toast.show('该商品库存为0，不能选择')
          return
        }
        if (item.selected === 1) {
          return
        }
        // if (this.selectGoodsId.length === this.personAllBuyLimit && item.selected !== 2) {
        //   this.$toast.show(`选择商品数量不能超过${this.personAllBuyLimit}个`)
        //   return
        // }
        if (item.selected !== 2) this.selectGoodsId.push(item.id)
        this.choeesGoods[index].selected = 1
        let goodsItem = objDeepCopy(item)
        goodsItem.all_stock = item.usable_stock
        goodsItem.usable_stock = ''
        goodsItem.trade_price_show = item.trade_price
        if (this.activityTheme !== 'hot_tag') {
          goodsItem.trade_price = ''
        }
        this.goodsList.push(goodsItem)
        this.choeesGoods.forEach((item) => {
          if (item.selected === 1) {
            let idx = this.selectGoods.findIndex((child) => child.id === item.id)
            if (idx !== -1) {
              this.selectGoods.splice(idx, 1)
            }
          }
        })
      },
      // 批量添加
      _batchAddition() {
        // const list = objDeepCopy(this.choeesGoods)
        this.selectGoods = this.selectGoods.map((item) => {
          item.selected = item.selected === 2 ? 1 : item.selected
          item.usable_stock = ''
          item.trade_price_show = item.trade_price
          if (this.activityTheme !== 'hot_tag') {
            item.trade_price = ''
          }
          return item
        })
        this.goodsList = this.goodsList.concat(this.selectGoods)
        this.selectGoods = []
        this._hideGoods()
      },
      async _showGoods() {
        if (this.disable) {
          return
        }
        await this._getGoodsList()
        // 展示添加商品弹窗
        this.$refs.goodsModel && this.$refs.goodsModel.showModal()
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


    //  弹窗
    .shade-box
      box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
      border-radius: 2px
      background: $color-white
      height: 675px
      max-width: 1000px
      width: 1000px
      position: relative
      overflow-x: hidden
      overflow-y: auto
      flex-wrap: wrap
      padding: 0 20px
      box-sizing: border-box
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
      .back
        border-top-1px($color-line)
        position: absolute
        left: 0
        right: 0
        bottom: 0
        background: $color-white
        justify-content: flex-end
        height: 70px
      /*选择商品样式*/
      .shade-tab
        height: 48px
        box-sizing: border-box
        display: flex
        .tab-item
          margin-right: 10px
      .goods-content
        border-radius: 4px
        height: 420px
        .rush-goods-list
          flex-wrap: wrap
          display: flex
        .goods-item
          box-sizing: border-box
          padding: 0 30px 0 20px
          width: 100%
          height: 60px
          display: flex
          align-items: center
          position: relative
          &:last-child
            border-bottom-1px($color-line)
          &:before
            content: ""
            pointer-events: none // 解决iphone上的点击无效Bug
            display: block
            position: absolute
            left: 0
            top: 0
            transform-origin: 0 0
            border-right: 1px solid #E9ECEE
            border-left: 1px solid #E9ECEE
            border-top: 1px solid #E9ECEE
            box-sizing border-box
            width: 200%
            height: 100%
            transform: scaleX(.5) translateZ(0)
            @media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3)
              width: 100%
              height: 300%
              transform: scaleX(1 / 3) translateZ(0)
          &:nth-child(2n - 1)
            background: #f5f7fa
          .select-icon
            margin-right: 20px
            border-radius: 1px
            border: 1px solid #e9ecee
            height: 16px
            width: 16px
            -webkit-transition: all .3s
            transition: all .3s
          .select-icon-active
            border: 1px solid transparent
            display: inline-block
            background-size: 100% 100%
            background-image: url("./icon-check@2x.png")
          .select-icon-disable
            border: 1px solid transparent
            cursor: not-allowed
            display: inline-block
            background-size: 100% 100%
            background-image: url("./icon-check_ash@2x.png")
          .goods-img
            margin-right: 10px
            width: 40px
            height: @width
            overflow: hidden
            background-repeat: no-repeat
            background-size: cover
            background-position: center
            background-color: $color-background
          .goods-msg
            flex: 1
            display: flex
            color: $color-text-main
            font-family: $font-family-regular
            justify-content: space-between
            height: 100%
            align-items: center
            .goods-name
              width: 500px
              no-wrap()
            .goods-name, .goods-money
              line-height: 1
            .goods-money
              flex: 1
              layout(row)
              .goods-money-text
                width: 50%
          .add-btn
            border-radius: 2px
            margin-left: 88px
            padding: 7px 0
            min-width: 54px
            text-align: center
          .add-btn-disable
            border-radius: 2px
            margin-left: 88px
            padding: 7px 0
            box-sizing: border-box
            text-align: center
            font-size: $font-size-14
            line-height: 1
            cursor: not-allowed
            background: $color-line
            color: $color-text-assist
            border: none
      .page-box
        box-sizing: border-box
        height: 76px
        align-items: center
        display: flex


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
