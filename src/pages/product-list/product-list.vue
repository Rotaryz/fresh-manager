<template>
  <div class="product-list table">
    <div class="down-content">
      <span class="down-tip">分类筛选</span>
      <div class="down-item-small">
        <base-drop-down :select="stairSelect" @setValue="_setStairValue"></base-drop-down>
      </div>
      <div class="down-item">
        <base-drop-down :select="secondSelect" @setValue="_secondValue"></base-drop-down>
      </div>
      <span class="down-tip">类型</span>
      <div class="down-item">
        <base-drop-down :select="typeSelect" @setValue="_setTypeValue"></base-drop-down>
      </div>
      <span class="down-tip">资料状态</span>
      <div class="down-item">
        <base-drop-down :select="progressSelect" @setValue="_setCompleteValue"></base-drop-down>
      </div>
      <span class="down-tip">库存</span>
      <div class="down-item-small">
        <base-drop-down :select="presaleSelect" @setValue="_setPresaleValue"></base-drop-down>
      </div>
      <div class="down-item">
        <base-drop-down :select="storeSelect" :isUse="isPresale.length !== 0" @setValue="_setStoreValue"></base-drop-down>
      </div>
      <span class="down-tip">搜索</span>
      <div class="">
        <base-search placeHolder="商品名称或编码" :infoText="goodsFitter.keyword" @search="search"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-product_list@2x.png" class="identification-icon">
          <p class="identification-name">商品列表</p>
          <base-status-tab :infoTabIndex="defaultIndex" :statusList="statusTab" @setStatus="changeStatus"></base-status-tab>
        </div>
        <div class="function-btn">
          <div class="btn-main" @click="jumpStore">商品素材中心</div>
          <router-link tag="div" to="edit-goods" append class="btn-main g-btn-item">新建商品<span class="add-icon"></span></router-link>
          <!--<a :href="downUrl" class="btn-main g-btn-item" target="_blank">导出Excel</a>-->
          <div class="show-more-box g-btn-item" :class="{'show-more-active': showIndex}" @mouseenter="_showTip" @mouseleave="_hideTip">
            <div class="show-more-text">
              <div class="show-text">更多</div>
              <div class="show-icon"></div>
            </div>
            <div v-show="showIndex" class="big-hide-box"></div>
            <transition name="fade">
              <div v-show="showIndex" class="show-hide-box">
                <div class="show-all-item">
                  <div class="show-hide-item" @click="exportExcel">商品导出</div>
                  <router-link to="lead-supply-goods" append class="show-hide-item">
                    批量新建
                  </router-link>
                  <!--<div class="show-hide-item">-->
                  <!--批量修改-->
                  <!--<input-->
                  <!--type="file"-->
                  <!--class="stock-file hand"-->
                  <!--@change="importStock($event, 0)"-->
                  <!--&gt;-->
                  <!--</div>-->
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
          <div v-if="productList.length">
            <div v-for="(item, index) in productList" :key="index" class="list-content list-box">
              <div class="list-item">
                <img v-if="item.goods_video_url" class="icon-video" src="./icon-play_list@2x.png" alt="">
                <img class="pic-box" :src="item.goods_cover_image" alt="">
              </div>
              <div class="list-item list-double-row">
                <div class="item-dark">{{item.name}}</div>
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
              <div class="list-item list-item-layout">
                {{item.source * 1 === 1 ? '自建' : '平台'}}
              </div>
              <div class="list-item">
                <div class="list-item-btn" @click="switchBtn(item, index)">
                  <base-switch :status="item.is_online"></base-switch>
                </div>
              </div>
              <div class="list-item list-operation-box">
                <router-link v-if="item.complete_status * 1 === 0" tag="span" :to="'edit-goods?complete=1&id=' + item.id" append class="list-operation ">完善资料</router-link>
                <router-link v-else-if="+item.is_online === 0" tag="span" :to="'edit-goods?isShow=1&id=' + item.id" append class="list-operation">编辑</router-link>
                <span class="list-operation" @click.stop="delGoods(item)">删除</span>
              </div>
            </div>
          </div>
          <base-blank v-else></base-blank>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pagination="goodsFitter.page" :pageDetail="statePageTotal" @addPage="addPage"></base-pagination>
      </div>
    </div>
    <default-confirm ref="confirm" :oneBtn="oneBtn" @confirm="delConfirm"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import {authComputed, goodsComputed, goodsMethods} from '@state/helpers'
  import API from '@api'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import _ from 'lodash'

  const PAGE_NAME = 'PRODUCT_LIST'
  const TITLE = '商品列表'
  const PRODUCT_TITLE_LIST = [
    '图片',
    '商品名称',
    '分类',
    '基本单位',
    '销售规格',
    '销售单价',
    '销售库存',
    '类型',
    '状态',
    '操作'
  ]
  const EXCEL_URL = '/social-shopping/api/backend/goods-manage/goods-excel'

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
        dispatchSelect: {check: false, show: false, content: '全部状态', type: 'default', data: [{name: '全部', value: ''}, {name: '上架', value: 1}, {name: '下架', value: 0}]},
        statusTab: [{name: '全部', num: 0, key: ''}, {name: '已上架', num: 0, key: 1}, {name: '已下架', num: 0, key: 0}],
        stairSelect: {check: false, show: false, content: '一级分类', type: 'default', data: []},
        secondSelect: {check: false, show: false, content: '二级分类', type: 'default', data: []},
        typeSelect: {check: false, show: false, content: '全部', type: 'default', data: [{name: '全部', value: ''}, {name: '自建', value: 1}, {name: '平台', value: 2}]},
        progressSelect: {check: false, show: false, content: '全部', type: 'default', data: [{name: '全部', value: ''}, {name: '未完成', value: 0}, {name: '已完成', value: 1}]},
        presaleSelect: {check: false, show: false, content: '全部', type: 'default', data: [{name: '全部', value: ''}, {name: '仓库', value: 0}, {name: '预售', value: 1}]},
        storeSelect: {check: false, show: false, content: '全部', type: 'default', data: [{name: '全部', value: ''}, {name: '无库存', value: 0}, {name: '有库存', value: 1}]},
        goodsList: [],
        pageTotal: {},
        categoryId: '',
        source: '',
        completeStatus: '',
        isPresale: '',
        hasStock: '',
        keyWord: '',
        isOnline: '',
        goodsPage: 1,
        curItem: '',
        downUrl: '',
        oneBtn: false,
        showIndex: false,
        defaultIndex: 0
      }
    },
    computed: {
      ...authComputed,
      ...goodsComputed,
      _getUrl() {
        let currentId = this.getCurrentId()
        let data = {
          current_corp: currentId,
          current_shop: process.env.VUE_APP_CURRENT_SHOP,
          access_token: this.currentUser.access_token,
          is_online: this.goodsFitter.is_online,
          keyword: this.goodsFitter.keyword,
          goods_category_id: this.goodsFitter.goods_category_id,
          page: this.goodsFitter.page,
          has_stock: this.goodsFitter.has_stock,
          complete_status: this.goodsFitter.complete_status,
          is_presale: this.goodsFitter.is_presale,
          goods_material_category_id: this.goodsFitter.goods_material_category_id,
          source: this.goodsFitter.source
        }
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        return process.env.VUE_APP_API + EXCEL_URL + '?' + search.join('&')
      }
    },
    created() {
      this.defaultIndex = this.dispatchSelect.data.findIndex((item) => item.value === this.goodsFitter.is_online)
      this.getCategoriesData()
      this.getGoodsStatus()
      this._setData()
    },
    methods: {
      ...goodsMethods,
      exportExcel() {
        window.open(this._getUrl, '_blank')
      },
      // 重置数据
      _setData() {
        let selectDown = _.cloneDeep(this.taskData)
        this.stairSelect.content = selectDown.oneName
        this.secondSelect.content = selectDown.twoName
        this.typeSelect.content = selectDown.source
        this.progressSelect.content = selectDown.complete
        this.presaleSelect.content = selectDown.presale
        this.storeSelect.content = selectDown.stock
        this.secondSelect.data = selectDown.twoList
      },
      _showTip() {
        this.showIndex = true
      },
      _hideTip() {
        this.showIndex = false
      },
      // 导出
      // 更新列表数据
      _updateList(params, noUpdataStatus) {
        this.SET_PARAMS(params)
        this.getGoodsData({})
        if (!noUpdataStatus) {
          this.getGoodsStatus()
        }
        if (params.page === 1) {
          this.$refs.pagination.beginPage()
        }
      },
      // 选择一级分类
      _setStairValue(data) {
        this.secondSelect.content = '二级分类'
        this.secondSelect.data = data.list
        this.SET_TASK_DATA({oneName: data.name, twoName: '二级分类', twoList: data.list})
        this._updateList({page: 1, goods_category_id: data.id})
      },
      // 选择二级分类
      _secondValue(data) {
        this.secondSelect.content = data.name
        this.SET_TASK_DATA({twoName: data.name})
        this._updateList({page: 1, goods_category_id: data.id})
      },
      // 选择类型
      _setTypeValue(data) {
        this.source = data.value
        this.SET_TASK_DATA({source: data.name})
        this._updateList({page: 1, source: data.value})
      },
      // 选择资料状态
      _setCompleteValue(data) {
        this.completeStatus = data.value
        this.SET_TASK_DATA({complete: data.name})
        this._updateList({page: 1, complete_status: data.value})
      },
      // 选择库存类型
      _setPresaleValue(data) {
        this.isPresale = data.value
        if (data.value.length === 0) {
          this.hasStock = ''
          this.storeSelect.content = '全部'
          this.SET_TASK_DATA({presale: data.name, stock: '全部'})
          this._updateList({page: 1, is_presale: data.value, has_stock: ''})
        } else {
          this.SET_TASK_DATA({presale: data.name})
          this._updateList({page: 1, is_presale: data.value})
        }
      },
      // 选择库存
      _setStoreValue(data) {
        this.hasStock = data.value
        this._updateList({page: 1, has_stock: data.value})
        this.SET_TASK_DATA({stock: data.name})
      },
      // 搜索
      search(keyword) {
        this._updateList({page: 1, keyword})
      },
      // 切换上下架状态
      changeStatus(selectStatus) {
        this.isOnline = selectStatus.value
        this._updateList({page: 1, is_online: selectStatus.value}, true)
      },
      // 分页
      addPage(page) {
        this.goodsPage = page
        this._updateList({page}, true)
      },
      // 获取列表
      getGoodsListData() {
        let data = {
          goods_category_id: this.categoryId,
          source: this.source,
          complete_status: this.completeStatus,
          is_presale: this.isPresale,
          has_stock: this.hasStock,
          keyword: this.keyWord,
          is_online: this.isOnline,
          page: this.goodsPage,
          limit: 10
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
      // 获取Tab栏状态
      getGoodsStatus() {
        API.Product.getGoodsStatus({
          goods_category_id: this.goodsFitter.goods_category_id,
          source: this.goodsFitter.source,
          complete_status: this.goodsFitter.complete_status,
          is_presale: this.goodsFitter.is_presale,
          has_stock: this.goodsFitter.has_stock,
          keyword: this.goodsFitter.keyword
        }).then((res) => {
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return
          }
          this.statusTab = res.data.map((item, index) => {
            return {
              name: item.status_str,
              value: item.status,
              num: item.statistic
            }
          })
        })
      },
      // 删除商品
      delGoods(item) {
        this.curItem = item
        this.oneBtn = false
        this.$refs.confirm.show('确定要删除该商品？')
      },
      delConfirm() {
        API.Product.delGoodsDetail(this.curItem.id).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.$toast.show('删除成功')
            if (this.productList.length === 1 && this.goodsFitter.page * 1 !== 1) {
              let page = _.cloneDeep(this.goodsFitter.page) - 1
              this.SET_PARAMS({page})
              this.$refs.pagination.beginPage(page)
            }
            this.getGoodsStatus()
            this.getGoodsData({})
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      // 商品上下架
      switchBtn(item, index) {
        if (item.goods_sku_encoding.length === 0 && item.is_online * 1 === 0) {
          this.$toast.show('请先补充商品编码再上架')
          return
        }
        if (item.goods_category_id <= 0 && item.is_online * 1 === 0) {
          this.$toast.show('请先补充分类再上架')
          return
        }
        let data = {
          goods_id: item.id,
          is_online: item.is_online * 1 === 1 ? 0 : 1
        }
        API.Product.upDownGoods(data).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.getGoodsData({})
            this.oneBtn = true
            // this.$refs.confirm.show(item.is_online * 1 === 1 ? '该商品已成功下架' : '该商品已成功上架')
            this.getGoodsStatus()
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      // 获取分类列表
      getCategoriesData() {
        API.Product.getCategoryList({parent_id: -1}, false).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.stairSelect.data = res.data
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      //  导入商品新建模板
      async importStock(e, index) {
        let param = this._infoFile(e.target.files[0])
        this.$loading.show('上传中...')
        let res =
          index === 1
            ? await API.Product.scmGoodsImport(param, true, 60000)
            : await API.Product.scmGoodsImport(param, true, 60000)
        this.$loading.hide()
        this._updateList({page: 1})
        this.$toast.show(res.message)
        e.target.value = ''
      },
      // 格式化文件
      _infoFile(file) {
        let param = new FormData() // 创建form对象
        param.append('file', file, file.name) // 通过append向form对象添加数据
        return param
      },
      // 商品素材中心
      jumpStore() {
        this.$router.push('/home/goods-store')
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
      position: relative

      &:nth-child(1)
        flex: 0.55

      &:nth-child(2)
        flex: 1.5

      &:nth-child(3)
        flex: 1.1

      &:nth-child(8)
        max-width: 120px
      &:last-child
        padding: 5px
        max-width: 78px
        min-width: 78px
        flex: 1

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
      border-1px($color-main)
      layout(row)
      align-items: center
      justify-content: center

      .show-text
        font-size: $font-size-12
        color: $color-main
        font-family: $font-family-regular

      .show-icon
        width: 8px
        height: 6px
        margin-left: 6px
        position: relative
        transform: translateY(-1px) rotate(0deg)
        transition: all 0.4s

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
          border-top: 6px solid $color-main
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
      top: -6px
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
      top: -8px
      right: 32px
      width: 0
      height: 0
      border-left: 4px solid transparent
      border-right: 4px solid transparent
      border-bottom: 8px solid #EBEBEB

  .icon-video
    height: 16px
    width: @width
    position: absolute
    top: 12px
    left: 12px
  .pic-box
    height: 40px
    width: 40px
    border-radius: 2px
    object-fit: cover
    background-repeat: no-repeat
    background-size: cover
    background-position: center

  .show-more-active
    .show-more-text
      background: $color-main
      .show-text
        color: $color-white
      .show-icon
        transform: translateY(-1px) rotate(180deg)
        &:after
          border-top: 6px solid $color-white
  .stock-file
    position: absolute
    top: 0
    left: 0
    font-size: 0
    opacity: 0
    height: 100%
    width: 100%
  .list-operation-all
    border: 1px solid #4D77BD
    width: 76px
    height: 28px
    text-align: center
    line-height: 26px
    border-radius: 2px
    &:after
      top: 7px
</style>
