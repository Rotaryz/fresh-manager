<template>
  <div class="goods-manage table">
    <template>
      <div class="down-content">
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
        <span class="down-tip">资料状态</span>
        <div class="down-item">
          <base-drop-down :select="dataSelect" @setValue="setDataValue"></base-drop-down>
        </div>
        <div class="distribution-down">
          <span class="down-tip">搜索</span>
          <div class="down-item">
            <base-search :infoText="keyWord" placeHolder="商品名称或编码" @search="changeKeyword"></base-search>
          </div>
        </div>
      </div>
      <div class="table-content">
        <div class="identification">
          <div class="identification-page">
            <img src="./icon-product_list@2x.png" class="identification-icon">
            <p class="identification-name">商品列表</p>
          </div>
          <div class="function-btn">
            <div class="btn-main btn-main-end" @click="jumpStore">商品素材中心</div>
            <router-link to="edit-supply-goods" append class="btn-main btn-main-end g-btn-item">
              新建商品<span class="add-icon"></span>
            </router-link>
            <div class="show-more-box g-btn-item" :class="{'show-more-active': showIndex}" @mouseenter="_showTip" @mouseleave="_hideTip">
              <div class="show-more-text">
                <div class="show-text">更多</div>
                <div class="show-icon"></div>
              </div>
              <div v-show="showIndex" class="big-hide-box"></div>
              <transition name="fade">
                <div v-show="showIndex" class="show-hide-box">
                  <div class="show-all-item">
                    <a :href="downUrl" class="show-hide-item" target="_blank">商品导出</a>
                    <router-link to="lead-supply-goods" append class="show-hide-item">
                      批量新建
                    </router-link>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
        <div class="big-list">
          <div class="list-header list-box">
            <div v-for="(item,index) in listTitle" :key="index" class="list-item">{{item}}</div>
          </div>
          <div class="list">
            <div v-if="productList.length">
              <div v-for="(item, index) in productList" :key="index" class="list-content list-box">
                <div class="list-item">
                  <img v-if="item.goods_video_url" class="icon-video" src="./icon-play_list@2x.png" alt="">
                  <img class="pic-box" :src="item.goods_cover_image" alt="">
                </div>
                <div class="list-item list-double-row">
                  <div class="item-dark">{{item.goods_material_name}}</div>
                  <div class="item-dark">{{item.goods_sku_encoding}}</div>
                </div>
                <div class="list-item">{{item.goods_material_category_name}}</div>
                <div class="list-item">{{item.supplier_name}}</div>
                <div class="list-item">{{item.base_unit}}</div>
                <div class="list-item">{{item.base_sale_rate}}{{item.base_unit}}/{{item.sale_unit}}</div>
                <div class="list-item">{{item.base_purchase_rate}}{{item.base_unit}}/{{item.purchase_unit}}</div>
                <div class="list-item">{{item.source * 1 === 1 ? '自建' : '平台'}}</div>
                <div class="list-item list-operation-box">
                  <router-link v-if="item.complete_status * 1 === 0" tag="span" :to="'edit-supply-goods?complete=1&id=' + item.id" append class="list-operation list-operation-all">完善资料</router-link>
                  <router-link v-if="item.complete_status * 1 === 1" tag="span" :to="'edit-supply-goods?id=' + item.id" append class="list-operation">编辑</router-link>
                  <span class="list-operation" @click="delGoods(item)">删除</span>
                </div>
              </div>
            </div>
            <base-blank v-else></base-blank>
          </div>
        </div>
        <div class="pagination-box">
          <base-pagination ref="pagination" :pageDetail="statePageTotal" @addPage="addPage"></base-pagination>
        </div>
      </div>
    </template>
    <default-confirm ref="confirm" :oneBtn="oneBtn" @confirm="delConfirm"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import {scmGoodsComputed, scmGoodsMethods} from '@state/helpers'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import API from '@api'
  const PAGE_NAME = 'GOODS_MANAGE'
  const TITLE = '商品管理'
  const LIST_TITLE = ['图片', '商品名称', '类目', '供应商', '基本单位', '销售规格', '采购规格', '类型', '操作']

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
        listTitle: LIST_TITLE,
        dispatchSelect: [{name: '全部', value: '', key: 'all', num: 0}, {name: '支付', key: 'wait_release', num: 0}, {name: '退款', key: 'wait_purchase', num: 0}],
        showIndex: false,
        stairSelect: {check: false, show: false, content: '一级类目', type: 'default', data: []},
        secondSelect: {check: false, show: false, content: '二级类目', type: 'default', data: []},
        thirdlySelect: {check: false, show: false, content: '三级类目', type: 'default', data: []},
        dataSelect: {check: false, show: false, content: '全部', type: 'default', data: [{name: '全部', id: ''}, {name: '未完成', id: 0}, {name: '完成', id: 1}]},
        keyWord: '',
        oneBtn: false,
        curItem: {},
        downUrl: '',
        completeStatus: '',
        categoryId: ''
      }
    },
    computed: {
      ...scmGoodsComputed
    },
    created() {
      this._getUrl()
      this.getCategoriesData()
    },
    methods: {
      ...scmGoodsMethods,
      // 获取类目列表
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
      // 搜索
      changeKeyword(text) {
        this.keyWord = text
        this.page = 1
        this.$refs.pagination.beginPage()
        this.getReqList()
      },
      // 选择一级类目
      setStairValue(data) {
        this.secondSelect.content = '二级类目'
        this.secondSelect.data = data.list
        this.thirdlySelect.content = '三级类目'
        this.thirdlySelect.data = []
        this.categoryId = data.id
        this.page = 1
        this.$refs.pagination.beginPage()
        this.getReqList()
      },
      // 选择二级类目
      setSecondValue(data) {
        this.thirdlySelect.content = '三级类目'
        this.thirdlySelect.data = data.list
        this.categoryId = data.id
        this.page = 1
        this.$refs.pagination.beginPage()
        this.getReqList()
      },
      // 选择三级类目
      setThirdlyValue(data) {
        this.categoryId = data.id
        this.page = 1
        this.$refs.pagination.beginPage()
        this.getReqList()
      },
      // 分页
      addPage(page) {
        this.page = page
        this.getReqList()
      },
      // 资料类型
      setDataValue(data) {
        this.dataSelect.content = data.name
        this.completeStatus = data.id
        this.page = 1
        this.$refs.pagination.beginPage()
        this.getReqList()
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
            if (this.productList.length === 1 && this.page * 1 !== 1) {
              this.page--
            }
            this.getReqList()
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      // 显示更多
      _showTip() {
        this.showIndex = true
      },
      // 隐藏更多
      _hideTip() {
        this.showIndex = false
      },
      // 跳转素材中心
      jumpStore() {
        this.$router.push('/home/goods-store')
      },
      // 导出
      _getUrl() {
        let currentId = this.getCurrentId()
        let token = this.$storage.get('auth.currentUser', '')
        let params = `access_token=${token.access_token}&current_corp=${currentId}&goods_material_category_id=${this.categoryId}&complete_status=${this.completeStatus}&keyword=${this.keyWord}&show_type=base`
        this.downUrl = process.env.VUE_APP_API + `/social-shopping/api/backend/goods-manage/goods-excel?${params}`
      },
      // 获取列表
      getReqList() {
        this.getProductList({
          materialId: this.categoryId,
          page: this.page,
          keyword: this.keyWord,
          completeStatus: this.completeStatus,
          loading: false
        })
        this._getUrl()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .goods-manage
    width: 100%
  .distribution-down
    display: flex
    align-items: center
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

      &:nth-child(7)
        flex: 0.8

      &:last-child
        padding: 5px
        max-width: 135px
        min-width: 135px
        flex: 1
  .product-list
    width: 100%
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
      line-height: 26px
      color: $color-white
      border: 1px solid $color-main
      border-radius: $radius-main
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

  .list-operation-all
    border: 1px solid #4D77BD
    width: 76px
    height: 28px
    text-align: center
    line-height: 26px
    border-radius: 2px
    &:after
      top: 7px
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
</style>
