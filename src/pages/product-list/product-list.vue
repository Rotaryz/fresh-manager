<template>
  <div class="product-list table">
    <div class="down-content">
      <span class="down-tip">分类筛选</span>
      <div class="down-item-small">
        <base-drop-down :select="stairSelect" @setValue="setStairValue"></base-drop-down>
      </div>
      <div class="down-item">
        <base-drop-down :select="secondSelect" @setValue="secondValue"></base-drop-down>
      </div>
      <span class="down-tip">状态</span>
      <div class="down-item">
        <base-drop-down :select="dispatchSelect" @setValue="setValue"></base-drop-down>
      </div>
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="商品名称或编码" @search="search"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-product_list@2x.png" class="identification-icon">
          <p class="identification-name">商品列表</p>
        </div>
        <div class="function-btn">
          <router-link tag="div" to="edit-goods" append class="btn-main">新建商品<span class="add-icon"></span></router-link>
          <!--<a :href="downUrl" class="btn-main g-btn-item" target="_blank">导出Excel</a>-->
          <div class="show-more-box g-btn-item" @mouseenter="_showTip" @mouseleave="_hideTip">
            <div class="show-more-text">
              <div class="show-text">更多</div>
              <div class="show-icon"></div>
            </div>
            <div v-show="showIndex" class="big-hide-box"></div>
            <transition name="fade">
              <div v-show="showIndex" class="show-hide-box">
                <div class="show-all-item">
                  <a :href="downUrl" class="show-hide-item" target="_blank">商品导出</a>
                  <div class="show-hide-item">
                    批量新建
                    <input
                      type="file"
                      class="stock-file hand"
                      @change="importStock($event, 1)"
                    >
                  </div>
                  <div class="show-hide-item">
                    批量修改
                    <input
                      type="file"
                      class="stock-file hand"
                      @change="importStock($event, 0)"
                    >
                  </div>
                </div>
              </div>
            </transition>
          </div>
          <!--<div class="btn-main g-btn-item" @click="_syncGoods">同步</div>-->
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item, index) in productTitleList" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in goodsList" :key="index" class="list-content list-box">
            <div class="list-item">
              <div class="pic-box" :style="{'background-image': 'url(' + item.goods_cover_image + ')'}"></div>
            </div>
            <div class="list-item list-double-row">
              <div class="item-dark">{{item.name}}{{item.name}}</div>
              <div class="item-dark">{{item.goods_sku_encoding}}</div>
            </div>
            <!--<div class="list-item">{{item.goods_sku_code}}</div>-->
            <div class="list-item">{{item.goods_category_name}}</div>
            <div class="list-item">{{item.base_unit}}</div>
            <div class="list-item">{{item.base_sale_rate}}{{item.base_unit}}/{{item.sale_unit}}</div>
            <div class="list-item">￥{{item.trade_price}}/{{item.sale_unit}}</div>
            <div class="list-item list-item-layout">
              {{item.usable_stock}}{{item.sale_unit}}
              <div class="list-item-img" :class="item.is_presale * 1 === 1? 'icon-pre' : 'icon-libray'"></div>
            </div>
            <div class="list-item">
              <div class="list-item-btn" @click="switchBtn(item, index)">
                <base-switch :status="item.is_online"></base-switch>
              </div>
            </div>
            <div class="list-item list-operation-box">
              <router-link tag="span" :to="'edit-goods?id=' + item.id" append class="list-operation">编辑</router-link>
              <span class="list-operation" @click.stop="delGoods(item)">删除</span>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pageDetail="pageTotal" @addPage="addPage"></base-pagination>
      </div>
    </div>
    <default-confirm ref="confirm" :oneBtn="oneBtn" @confirm="delConfirm"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import {goodsComputed} from '@state/helpers'
  import API from '@api'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import _ from 'lodash'

  const PAGE_NAME = 'PRODUCT_LIST'
  const TITLE = '商品列表'
  const PRODUCT_TITLE_LIST = [
    '图片',
    '商品名称',
    // '商品编码',
    '分类',
    '基本单位',
    '销售规格',
    '销售单价',
    '销售库存',
    '状态',
    '操作'
  ]

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultConfirm
    },
    data() {
      return {
        productTitleList: PRODUCT_TITLE_LIST,
        dispatchSelect: {
          check: false,
          show: false,
          content: '全部状态',
          type: 'default',
          data: [{name: '全部', value: ''}, {name: '上架', value: 1}, {name: '下架', value: 0}]
        },
        stairSelect: {
          check: false,
          show: false,
          content: '一级分类',
          type: 'default',
          data: []
        },
        secondSelect: {
          check: false,
          show: false,
          content: '二级分类',
          type: 'default',
          data: []
        },
        goodsList: [],
        pageTotal: {},
        isOnline: '',
        keyWord: '',
        goodsPage: 1,
        curItem: '',
        downUrl: '',
        oneBtn: false,
        categoryId: '',
        showIndex: false
      }
    },
    computed: {
      ...goodsComputed
    },
    created() {
      this._getUrl()
      this.goodsList = _.cloneDeep(this.productList)
      this.pageTotal = _.cloneDeep(this.statePageTotal)
      if (this.$route.query.online * 1 === 1) {
        this.dispatchSelect.content = '上架'
      }
      this.getCategoriesData()
    },
    methods: {
      _showTip() {
        this.showIndex = true
      },
      _hideTip() {
        this.showIndex = false
      },
      async _syncGoods() {
        let res = await API.Product.syncGoodsInfo()
        this.$loading.hide()
        if (res.error === this.$ERR_OK) {
          this.$toast.show('同步成功')
          this.isOnline = ''
          this.dispatchSelect.content = '全部状态'
          this.goodsPage = 1
          this.keyWord = ''
          this.$refs.pagination.beginPage()
          this.getGoodsListData()
        }
      },
      _getUrl() {
        let currentId = this.getCurrentId()
        let token = this.$storage.get('auth.currentUser', '')
        let params = `access_token=${token.access_token}&is_online=${this.isOnline}&keyword=${
          this.keyWord
        }&current_corp=${currentId}`
        this.downUrl = process.env.VUE_APP_API + `/social-shopping/api/backend/goods-manage/goods-excel?${params}`
      },
      getGoodsListData() {
        let data = {
          is_online: this.isOnline,
          page: this.goodsPage,
          limit: 10,
          keyword: this.keyWord,
          goods_category_id: this.categoryId
        }
        API.Product.getGoodsList(data, false).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.goodsList = res.data
            let statePageTotal = {
              total: res.meta.total,
              per_page: res.meta.per_page,
              total_page: res.meta.last_page
            }
            this.pageTotal = statePageTotal
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      setValue(item) {
        this.$refs.pagination.beginPage()
        this.isOnline = item.value
        this.goodsPage = 1
        this._getUrl()
        this.getGoodsListData()
      },
      search(text) {
        this.$refs.pagination.beginPage()
        this.keyWord = text
        this.goodsPage = 1
        this._getUrl()
        this.getGoodsListData()
      },
      addPage(page) {
        this.goodsPage = page
        this.getGoodsListData()
      },
      delGoods(item) {
        this.curItem = item
        this.oneBtn = false
        this.$refs.confirm.show('确定要删除该商品？')
      },
      delConfirm() {
        API.Product.delGoodsDetail(this.curItem.id).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.$toast.show('删除成功')
            if (this.goodsList.length === 1 && this.goodsPage * 1 !== 1) {
              this.goodsPage--
            }
            this.getGoodsListData()
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      switchBtn(item, index) {
        let data = {
          goods_id: item.id,
          is_online: item.is_online * 1 === 1 ? 0 : 1
        }
        API.Product.upDownGoods(data).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.goodsList[index].is_online = item.is_online * 1 === 1 ? 0 : 1
            this.oneBtn = true
            this.$refs.confirm.show(item.is_online * 1 === 1 ? '该商品已成功上架' : '该商品已成功下架')
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      getCategoriesData() {
        API.Product.getCategoryList({parent_id: -1}, false).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.stairSelect.data = res.data
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      setStairValue(data) {
        this.secondSelect.content = '二级分类'
        this.secondSelect.data = data.list
        this.$refs.pagination.beginPage()
        this.categoryId = data.id
        this.goodsPage = 1
        this._getUrl()
        this.getGoodsListData()
      },
      secondValue(data) {
        this.secondSelect.content = data.name
        this.$refs.pagination.beginPage()
        this.categoryId = data.id
        this.goodsPage = 1
        this._getUrl()
        this.getGoodsListData()
      },
      //  导入商品新建模板
      async importStock(e, index) {
        let param = this._infoFile(e.target.files[0])
        this.$loading.show('上传中...')
        let res = index === 1 ? await API.Product.goodsNewInto(param) : await API.Product.goodsNewEdit(param)
        this.$loading.hide()
        this.$toast.show(res.message)
        e.target.value = ''
      },
      // 格式化文件
      _infoFile(file) {
        let param = new FormData() // 创建form对象
        param.append('file', file, file.name)// 通过append向form对象添加数据
        return param
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .product-top
    layout(row)
    align-items: center
    justify-content: space-between
    height: 80px
    .product-left
      layout(row)
      align-items: center
    .btn-main
      margin-right: 10px
      &:hover
        color: $color-white
    .search-left
      margin-left: 10px

  .list-box
    .list-item
      box-sizing: border-box
      flex: 1
      &:nth-child(1)
        flex: 0.55
      &:nth-child(2)
        flex: 1.5
      &:nth-child(3)
        flex: 1.1
      &:last-child
        padding: 5px
        max-width: 80px
        flex: 0.8

  .list-item-btn
    display: inline-block
  .list-item-img
    width: 16px
    height: 15px
    margin-top: 2px
    margin-left: 1px
    background-size: 16px 15px
    &.icon-libray
      bg-image(icon-library)
    &.icon-pre
      bg-image(icon-pre)
  .show-more-box
    position: relative
    cursor: pointer
    .big-hide-box
      position: absolute
      z-index: 1
      width: 106px
      height: 20px
      right: 0
    .show-more-text
      width: 80px
      height: 28px
      line-height: 28px
      color: $color-white
      background: $color-main
      layout(row)
      align-items: center
      justify-content: center
      .show-text
        font-size: $font-size-12
        color: $color-white
        font-family: $font-family-regular
      .show-icon
        width: 8px
        height: 6px
        margin-left: 6px
        position: relative
        &:after
          content: ''
          position: absolute
          z-index: 99
          top: 0
          right: 0
          width: 0
          height: 0
          border-left: 4px solid transparent
          border-right: 4px solid transparent
          border-top: 6px solid $color-white
    .show-hide-box
      position: absolute
      width: 106px
      top: 38px
      right: 0
      z-index: 11
      color: $color-text-main
      font-family: $font-family-regular
      font-size: $font-size-14
      background: $color-white
      box-shadow: 0 0 8px 0 #EBEBEB
      border-radius: 4px
      .show-hide-item
        height: 50px
        line-height: 50px
        color: $color-text-main
        font-family: $font-family-regular
        font-size: $font-size-14
        padding-left: 16px
        display: block
        position: relative
        border-bottom-1px($color-line)
    .show-hide-item:hover
      color: $color-main
  .show-all-item
    position: relative
    &:after
      content: ''
      position: absolute
      z-index: 99
      top:-6px
      right: 33px
      width: 0
      height: 0
      border-left: 3px solid transparent
      border-right: 3px solid transparent
      border-bottom: 6px solid $color-white
    &:before
      content: ''
      position: absolute
      z-index: 99
      top:-8px
      right: 32px
      width: 0
      height: 0
      border-left: 4px solid transparent
      border-right: 4px solid transparent
      border-bottom: 8px solid #EBEBEB
  .pic-box
    height: 40px
    width: 40px
    overflow: hidden
    border-radius: 2px
    background-repeat: no-repeat
    background-size: cover
    background-position: center
  .stock-file
    position: absolute
    top: 0
    left: 0
    font-size: 0
    opacity: 0
    height: 100%
    width: 100%
</style>
