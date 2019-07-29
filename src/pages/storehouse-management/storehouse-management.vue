<template>
  <div class="storehouse-management table">
    <div class="down-content">
      <!--时间选择-->
      <span class="down-tip">类目筛选</span>
      <div class="down-item-small">
        <base-drop-down :select="stairSelect" @setValue="setStairValue"></base-drop-down>
      </div>
      <div class="down-item-small">
        <base-drop-down :select="secondSelect" @setValue="setSecondValue"></base-drop-down>
      </div>
      <div class="down-item">
        <base-drop-down :select="thirdlySelect" @setValue="setThirdlyValue"></base-drop-down>
      </div>
      <span class="down-tip">库区筛选</span>
      <div class="down-item-small">
        <base-drop-down :select="store" @setValue="getSecondStore"></base-drop-down>
      </div>
      <div class="down-item">
        <base-drop-down :select="secondStore" @setValue="selectSecondStore"></base-drop-down>
      </div>
      <span class="down-tip">售卖类型筛选</span>
      <div class="down-item">
        <base-drop-down :select="saleStore" @setValue="selectSaleStore"></base-drop-down>
      </div>
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="商品名称或商品编码" :infoText="warehouseFilter.keyword" @search="searchStore"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-inventory_list@2x.png" class="identification-icon">
          <p class="identification-name">库存列表</p>
        </div>
        <div class="function-btn">
          <a target="_blank" :href="storeExcel" class="btn-main">清单导出</a>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">
            {{item}}
            <div v-if="item === '可用库存' || item === '总库存货值'" class="help hand">
              <span class="help-icon"></span>
              <div class="static-explain">
                <div class="explain">{{item === '可用库存' ? '当前可用于销售的库存' : '当前该商品所有批次货值汇总'}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="list">
          <div v-if="warehouseList.length">
            <div v-for="(item, index) in warehouseList" :key="index" class="list-content list-box">
              <div class="list-item list-double-row">
                <p class="item-dark">{{item.goods_name}}</p>
                <p class="item-sub">{{item.goods_sku_encoding}}</p>
              </div>
              <div class="list-item">{{item.goods_material_category}}</div>
              <div class="list-item flex">
                <span>{{`${item.total_stock}${item.unit}`}}</span>
                <span class="edit-icon hand" @click="showEdit(item)"></span>
              </div>
              <div class="list-item">{{`${item.blocked_stock}${item.unit}`}}</div>
              <div class="list-item">{{`${item.usable_stock}${item.unit}`}}</div>
              <div class="list-item">￥{{item.stock_value}}</div>
              <div class="list-item">￥{{item.stock_average}}</div>
              <div class="list-item">{{item.warehouse_position}}</div>
              <div class="list-item">
                <div class="list-operation" @click="jumpDetail(item)">详情</div>
                <router-link
                  tag="div"
                  :to="`batch?code=${item.goods_sku_code}`"
                  append
                  class="list-operation"
                >
                  批次
                </router-link>
              </div>
            </div>
          </div>
          <base-blank v-else></base-blank>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pagination="warehouseFilter.page" :pageDetail="warehousePageTotal" @addPage="addPage"></base-pagination>
      </div>
    </div>
    <default-modal ref="defaultModal">
      <div slot="content" class="modal-contain">
        <div class="title-box">
          <div class="title">编辑库存</div>
          <span class="close hand" @click="cancel"></span>
        </div>
        <div class="modal-context">
          <div class="context-item">
            <span class="label">商品名称</span>
            <span class="context-value">{{currentItem.goods_name}}</span>
          </div>
          <div class="context-item">
            <span class="label">商品编码</span>
            <span class="context-value">{{currentItem.goods_sku_encoding}}</span>
          </div>
          <div class="context-item">
            <span class="label">商品类目</span>
            <span class="context-value">{{currentItem.goods_material_category}}</span>
          </div>
          <div class="context-item">
            <span class="label">总库存</span>
            <span class="context-value"><span class="black-text">{{currentItem.usable_stock}} {{currentItem.unit}}</span><span class="text">账面库存数</span></span>

          </div>
          <div class="context-item">
            <span class="label"><span class="star">*</span>实盘数</span>
            <div class="context-value">
              <input v-model="editNum" type="text" class="edit-input" @input="changeNum">{{currentItem.unit}}
            </div>
          </div>
          <div class="context-item">
            <span class="label">备注</span>
            <div class="context-value">
              <input v-model="editText" type="text" class="edit-input long">
            </div>
          </div>
        </div>
        <div class="btn-group">
          <span class="btn cancel" @click="cancel">取消</span>
          <span class="btn confirm" @click="confirm">确定</span>
        </div>
      </div>
    </default-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import {storeComputed, storeMethods, authComputed} from '@state/helpers'
  import DefaultModal from '@components/default-modal/default-modal'
  import _ from 'lodash'

  const PAGE_NAME = 'STOREHOUSE_MANAGEMENT'
  const TITLE = '库存管理'
  const COMMODITIES_LIST = ['商品', '类目', '总库存', '锁定库存', '可用库存', '总库存货值', '库存均价', '库位', '操作']
  const ENTRY_STORE_EXPORT = '/scm/api/backend/stock/warehouse-stock-export'
  const MONEYREG = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultModal
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        assortment: {check: false, show: false, content: '一级分类', type: 'default', data: []}, // 格式：{name: '55'
        secondAssortment: {check: false, show: false, content: '二级分类', type: 'default', data: []}, // 格式：{name: '55'}}
        store: {check: false, show: false, content: '库区名', type: 'default', data: []}, // 格式：{name: '55'}}
        secondStore: {check: false, show: false, content: '货架名', type: 'default', data: []}, // 格式：{name: '55'}}
        saleStore: {check: false, show: false, content: '全部', type: 'default', data: [{name: '全部', value: ''}, {name: '仓库库存', value: 0}, {name: '预售库存', value: 1}]}, // 格式：{name: '55'}}
        isPresale: '',
        stairSelect: {check: false, show: false, content: '一级类目', type: 'default', data: []},
        secondSelect: {check: false, show: false, content: '二级类目', type: 'default', data: []},
        thirdlySelect: {check: false, show: false, content: '三级类目', type: 'default', data: []},
        warehousePositionId: '',
        goodsCategoryId: '',
        keyword: '',
        page: 1,
        editNum: '',
        editText: '',
        currentItem: {}
      }
    },
    computed: {
      ...storeComputed,
      ...authComputed,
      storeExcel() {
        let currentId = this.getCurrentId()
        let data = {
          current_corp: currentId,
          current_shop: process.env.VUE_APP_CURRENT_SHOP,
          access_token: this.currentUser.access_token,
          goods_material_category_id: this.warehouseFilter.goods_material_category_id,
          keyword: this.warehouseFilter.keyword,
          is_presale: this.warehouseFilter.is_presale,
          warehouse_position_id: this.warehouseFilter.warehouse_position_id
        }
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        let url = process.env.VUE_APP_SCM_API + ENTRY_STORE_EXPORT + '?' + search.join('&')
        return url
      },
      testEditNum() {
        return this.editNum
      },
      testEditNumReg() {
        return MONEYREG.test(this.editNum)
      }
    },
    async created() {
      await this._getStoreList()
      this.getCategoriesData()
      this._setData()
    },
    methods: {
      ...storeMethods,
      jumpDetail(item) {
        this.resetWarehouseDetail()
        this.$router.push(`/home/storehouse-management/storehouse-detail?code=${item.goods_sku_code}`)
      },
      // 重置数据
      _setData() {
        let selectDown = _.cloneDeep(this.selectData)
        this.saleStore.content = selectDown.saleName
        this.store.content = selectDown.storeName
        this.secondStore.content = selectDown.shelfName
        this.secondStore.data = selectDown.shelfList
        this.stairSelect.content = selectDown.oneName
        this.secondSelect.content = selectDown.twoName
        this.thirdlySelect.content = selectDown.thrName
        this.secondSelect.data = selectDown.twoList
        this.thirdlySelect.data = selectDown.thrList
      },
      getCategoriesData() {
        API.Product.getScmCategoryList({parent_id: -1}, false).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.stairSelect.data = res.data
            this.stairSelect.data.unshift({name: '全部', id: '', list: []})
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      // 获取列表
      _getWarehouseList(params) {
        this.SET_WAREHOUSE_PARAMS(params)
        this.getWarehouseList({loading: false})
        if (params.page === 1) {
          this.$refs.pagination.beginPage()
        }
      },
      // 选择一级类目
      async setStairValue(data) {
        this.secondSelect.content = '二级类目'
        this.secondSelect.data = data.list
        this.thirdlySelect.content = '三级类目'
        this.thirdlySelect.data = []
        this.SET_SELECT_PARAMS({oneName: data.name, twoName: '二级类目', twoList: data.list, thrName: '三级类目', thrList: []})
        this._getWarehouseList({goods_material_category_id: data.id, page: 1})
      },
      // 选择二级类目
      async setSecondValue(data) {
        this.thirdlySelect.content = '三级类目'
        this.thirdlySelect.data = data.list
        this.SET_SELECT_PARAMS({twoName: data.name, thrList: data.list, thrName: '三级类目'})
        this._getWarehouseList({goods_material_category_id: data.id, page: 1})
      },
      // 选择三级类目
      async setThirdlyValue(data) {
        this.SET_SELECT_PARAMS({thrName: data.name})
        this._getWarehouseList({goods_material_category_id: data.id, page: 1})
      },
      // 选择一级分类
      async setSecondAssortment(item) {
        this.goodsCategoryId = item.id
        if (item.id === '') {
          this.secondAssortment.data = []
        } else {
          let res = await API.Store.goodsCategory({parent_id: this.goodsCategoryId})
          this.secondAssortment.data = res.error === this.$ERR_OK ? res.data : []
          this.secondAssortment.data.unshift({name: '全部', id: this.goodsCategoryId})
        }
        this.secondAssortment.content = '二级分类'
        this.page = 1
        this._getWarehouseList()
        this.$refs.pagination.beginPage()
      },
      // 获取一级分类
      async _getFirstAssortment() {
        let res = await API.Store.goodsCategory({parent_id: this.goodsCategoryId})
        this.assortment.data = res.error === this.$ERR_OK ? res.data : []
        this.assortment.data.unshift({name: '全部', id: ''})
      },
      // 选择二级分类
      async choessSecondAssortment(item) {
        this.goodsCategoryId = item.id
        this.page = 1
        this._getWarehouseList()
        this.$refs.pagination.beginPage()
      },
      //  获取一级库位
      async _getStoreList() {
        let res = await API.Store.getStoreList(false, false)
        this.store.data = res.error === this.$ERR_OK && res.data[0] ? res.data[0].warehouse_positions : []
        this.store.data.unshift({name: '全部', id: ''})
      },
      // 获取库架名
      async getSecondStore(item) {
        if (item.id === '') {
          this.secondStore.data = []
          this.SET_SELECT_PARAMS({shelfList: []})
        } else {
          let res = await API.Store.findChild(item.id)
          this.secondStore.data = res.error === this.$ERR_OK ? res.data : []
          this.secondStore.data.unshift({name: '全部', id: this.warehousePositionId})
          this.SET_SELECT_PARAMS({shelfList: this.secondStore.data})
        }
        this.secondStore.content = '货架名'
        this.SET_SELECT_PARAMS({storeName: item.name})
        this.SET_SELECT_PARAMS({shelfName: '货架名'})
        this._getWarehouseList({warehouse_position_id: item.id, page: 1})
      },
      // 选择库架名
      async selectSecondStore(item) {
        this.warehousePositionId = item.id
        this.SET_SELECT_PARAMS({shelfName: item.name})
        this._getWarehouseList({warehouse_position_id: item.id, page: 1})
      },
      // 选择预售类型
      async selectSaleStore(item) {
        this.SET_SELECT_PARAMS({saleName: item.name})
        this._getWarehouseList({is_presale: item.value, page: 1})
      },
      // 搜索
      searchStore(keyword) {
        this._getWarehouseList({keyword, page: 1})
      },
      // 翻页
      addPage(page) {
        this._getWarehouseList({page})
      },
      changeNum() {
        if (this.editNum < 0) {
          this.editNum = this.editNum * -1
        }
      },
      showEdit(item) {
        this.currentItem = item
        this.$refs.defaultModal.showModal()
      },
      cancel() {
        this.$refs.defaultModal.hideModal()
      },
      confirm() {
        if (!this.testEditNum) {
          this.$toast.show('请输入实盘数')
          return
        }
        // if (!this.testEditNumReg) {
        //   this.$toast.show('实盘数为最多两位小数的非负数')
        //   return
        // }
        API.Store.checkStock({id: this.currentItem.id, actual_stock: this.editNum, note: this.editText, goods_name: this.currentItem.goods_name})
          .then(res => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            this.editText = ''
            this.editNum = ''
            this.$toast.show('盘点成功')
            this.$refs.defaultModal.hideModal()
            this.getWarehouseList({})
          })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .storehouse-management
    width: 100%
  .list-box
    .list-item
      align-items: center
      &:nth-child(1)
        flex: 1.7
      &:nth-child(2)
        flex: 1.3
      &:last-child
        padding: 0
        max-width: 80px
      .item-dark
        no-wrap()
      .edit-icon
        width: 14px
        height: 14px
        margin-top: 3px
        display: inline-block
        margin-left: 5px
        background: url("./icon-edit_stock@2x.png")
        background-size: 100% 100%
    .flex
      display: flex
  .help
    display: flex
    align-items: center
    margin-left: 5px
    position: relative
    &:hover .static-explain
      opacity: .8
      visibility: initial
    .help-icon
      icon-image('icon-help')
      width: 14px
      height: @width
  .static-explain
    position: absolute
    display: flex
    justify-content: center
    top: 23px
    width: 200px
    left: -(@width/ 2 - 7)
    visibility: hidden
    opacity: 0
    background: #32323A
    transition: opacity .3s
    z-index: 100
    border-radius: 2px
    &:after
      position: absolute
      top: -6px
      display: block
      content: ''
      width: 0
      height: 0
      border-left: 5px solid transparent
      border-right: 5px solid transparent
      border-bottom: 6px solid #32323A
    .explain
      padding: 8px
      border-radius: 4px
      line-height: 20px
      font-family: $font-family-regular
      font-size: $font-size-14
      white-space: normal
      transition: opacity .3s
      color: $color-white
      background: #32323A
      z-index: 111

  .modal-contain
    width: 530px
    background: #fff
    border-radius: 3px
    box-shadow: 0 8px 14px 0 rgba(12, 6, 14, 0.08)
    text-align: center
    padding: 0 20px 20px
    box-sizing: border-box
    position: relative
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
    .modal-context
      .context-item
        display: flex
        align-items: center
        color: $color-text-main
        font-family: $font-family-regular
        font-size: $font-size-14
        margin-bottom: 24px
      .label
        width: 60px
        text-align: right
      .context-value
        margin-left: 20px
        display: flex
        align-items: center
        color: #222
        flex: 1
        overflow: hidden
      .text
        color: #999
        margin-left: 12px
      .black-text
        font-family: $font-family-medium
      .star
        color: #F53737
      .edit-input
        width: 180px
        height: 40px
        line-height: 40px
        margin-right: 10px
        border: 1px solid $color-line
        border-radius: 1px
        font-family: $font-family-regular
        color: $color-text-main
        font-size: $font-size-14
        padding-left: 14px
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
      .long
        width: 100%
    .btn-group
      position: relative
      left: 0
      top: 0
      padding: 0
      margin-top: 20px
</style>
