<template>
  <div class="product-list table">
    <div class="down-content">
      <span class="down-tip">筛选</span>
      <div class="down-item">
        <base-drop-down :select="dispatchSelect" @setValue="setValue"></base-drop-down>
      </div>
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="商品名称" @search="search"></base-search>
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
          <a :href="downUrl" class="btn-main g-btn-item" target="_blank">导出Excel</a>
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
            <div class="list-item">{{item.name}}</div>
            <div class="list-item">{{item.goods_units}}</div>
            <div class="list-item">{{item.trade_price}}</div>
            <div class="list-item">
              <div class="list-item-btn" @click="switchBtn(item, index)">
                <base-switch :status="item.is_online"></base-switch>
              </div>
            </div>
            <div class="list-item">{{item.usable_stock}}</div>
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
  const PRODUCT_TITLE_LIST = ['商品图片', '商品名称', '售卖单位', '售价', '状态', '库存', '操作']

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
        goodsList: [],
        pageTotal: {},
        isOnline: '',
        keyWord: '',
        goodsPage: 1,
        curItem: '',
        downUrl: '',
        oneBtn: false
      }
    },
    computed: {
      ...goodsComputed
    },
    created() {
      this._getUrl()
      this.goodsList = _.cloneDeep(this.productList)
      this.pageTotal = _.cloneDeep(this.statePageTotal)
    },
    methods: {
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
          goods_category_id: ''
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
      padding-right: 10px
      flex: 1
      &:nth-child(1)
        flex: 0.6
      &:nth-child(2)
        flex: 1.5
      &:last-child
        flex: 0.8

  .list-item-btn
    display: inline-block

  .pic-box
    height: 40px
    width: 40px
    overflow: hidden
    background-repeat: no-repeat
    background-size: cover
    background-position: center
</style>
