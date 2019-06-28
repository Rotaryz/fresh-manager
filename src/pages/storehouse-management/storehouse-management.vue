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
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="商品名称或商品编码" @search="searchStore"></base-search>
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
              <div class="list-item">{{`${item.total_stock}${item.unit}`}}</div>
              <div class="list-item">{{`${item.blocked_stock}${item.unit}`}}</div>
              <div class="list-item">{{`${item.usable_stock}${item.unit}`}}</div>
              <div class="list-item">￥{{item.stock_value}}</div>
              <div class="list-item">￥{{item.stock_average}}</div>
              <div class="list-item">{{item.warehouse_position}}</div>
              <div class="list-item">
                <router-link
                  tag="div"
                  :to="`storehouse-detail?code=${item.goods_sku_code}`"
                  append
                  class="list-operation"
                >
                  详情
                </router-link>
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
        <!-- @addPage="addPage"-->
        <base-pagination ref="pagination" :pageDetail="warehousePageTotal" @addPage="addPage"></base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import {storeComputed, storeMethods, authComputed} from '@state/helpers'

  const PAGE_NAME = 'STOREHOUSE_MANAGEMENT'
  const TITLE = '库存管理'
  const COMMODITIES_LIST = ['商品', '类目', '总库存', '锁定库存', '可用库存', '总库存货值', '库存均价', '库位', '操作']
  const ENTRY_STORE_EXPORT = '/scm/api/backend/stock/warehouse-stock-export'
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        assortment: {check: false, show: false, content: '一级分类', type: 'default', data: []}, // 格式：{name: '55'
        secondAssortment: {check: false, show: false, content: '二级分类', type: 'default', data: []}, // 格式：{name: '55'}}
        store: {check: false, show: false, content: '库区名', type: 'default', data: []}, // 格式：{name: '55'}}
        secondStore: {check: false, show: false, content: '货架名', type: 'default', data: []}, // 格式：{name: '55'}}
        stairSelect: {check: false, show: false, content: '一级类目', type: 'default', data: []},
        secondSelect: {check: false, show: false, content: '二级类目', type: 'default', data: []},
        thirdlySelect: {check: false, show: false, content: '三级类目', type: 'default', data: []},
        warehousePositionId: '',
        goodsCategoryId: '',
        keyword: '',
        page: 1
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
          goods_material_category_id: this.goodsCategoryId,
          keyword: this.keyword,
          warehouse_position_id: this.warehousePositionId
        }
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        let url = process.env.VUE_APP_SCM_API + ENTRY_STORE_EXPORT + '?' + search.join('&')
        console.log(url)
        return url
      }
    },
    async created() {
      // await this._getFirstAssortment()
      await this._getStoreList()
      this.getCategoriesData()
    },
    methods: {
      ...storeMethods,
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
      _getWarehouseList() {
        this.getWarehouseList({
          page: this.page,
          goodsCategoryId: this.categoryId,
          keyword: this.keyword,
          warehousePositionId: this.warehousePositionId,
          loading: false
        })
      },
      // 选择一级类目
      async setStairValue(data) {
        this.secondSelect.content = '二级类目'
        this.secondSelect.data = data.list
        this.thirdlySelect.content = '三级类目'
        this.thirdlySelect.data = []
        this.goodsCategoryId = data.id
        this.page = 1
        this._getWarehouseList()
        this.$refs.pagination.beginPage()
      },
      // 选择二级类目
      async setSecondValue(data) {
        this.thirdlySelect.content = '三级类目'
        this.thirdlySelect.data = data.list
        this.goodsCategoryId = data.id
        this.page = 1
        this._getWarehouseList()
        this.$refs.pagination.beginPage()
      },
      // 选择三级类目
      async setThirdlyValue(data) {
        this.goodsCategoryId = data.id
        this.page = 1
        this._getWarehouseList()
        this.$refs.pagination.beginPage()
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
        this.store.data = res.error === this.$ERR_OK ? res.data[0].warehouse_positions : []
        this.store.data.unshift({name: '全部', id: ''})
      },
      // 获取库架名
      async getSecondStore(item) {
        this.warehousePositionId = item.id
        if (item.id === '') {
          this.secondStore.data = []
        } else {
          let res = await API.Store.findChild(item.id)
          this.secondStore.data = res.error === this.$ERR_OK ? res.data : []
          this.secondStore.data.unshift({name: '全部', id: this.warehousePositionId})
        }
        this.secondStore.content = '货架名'
        this.page = 1
        this._getWarehouseList()
        this.$refs.pagination.beginPage()
      },
      // 选择库架名
      async selectSecondStore(item) {
        this.warehousePositionId = item.id
        this.page = 1
        this._getWarehouseList()
        this.$refs.pagination.beginPage()
      },
      // 搜索
      searchStore(keyword) {
        this.keyword = keyword
        this.page = 1
        this._getWarehouseList()
        this.$refs.pagination.beginPage()
      },
      // 翻页
      addPage(page) {
        this.page = page
        this._getWarehouseList()
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
</style>
