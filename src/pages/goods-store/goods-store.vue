<template>
  <div class="goods-store table">
    <div class="down-content">
      <span class="down-tip">分类筛选</span>
      <div class="down-item-small">
        <base-drop-down :select="oneList" @setValue="selectOneList"></base-drop-down>
      </div>
      <div class="down-item">
        <base-drop-down :select="twoList" @setValue="selectTwoList"></base-drop-down>
      </div>
      <span class="down-tip">搜索</span>
      <div class="">
        <base-search placeHolder="商品名称" :infoText="keyWord" @search="changeKeyword"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-product_list@2x.png" class="identification-icon">
          <p class="identification-name">商品素材列表</p>
        </div>
      </div>
      <div class="goods-list">
        <div v-for="(item, index) in goodsStoreList" :key="index" class="goods-item">
          <div class="goods-item-top">
            <img class="top-pic-box" :src="item.goods_cover_image" alt="">
            <!--<div class="goods-item-model" @click="lookGoodsInfo(item)">
              <div class="look-goods">预览</div>
            </div>-->
          </div>
          <div class="goods-item-bottom">
            <div class="goods-title">{{item.name}}</div>
            <div class="goods-price-box hand" :class="(item.is_selected && !isShowAdd) ? 'goods-price-add' : ''" @click="submitAdd(item)">
              {{(item.is_selected && !isShowAdd) ? '已添加' : '添加'}}
            </div>
          </div>
        </div>
        <div v-if="goodsStoreList.length === 0" class="base-blank-box">
          <base-blank></base-blank>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pageDetail="storePageTotal" @addPage="addPage"></base-pagination>
      </div>
    </div>
    <default-modal ref="storeModal">
      <div slot="content" class="store-box">
        <div class="title-box">
          <div class="title">
            商品预览
          </div>
          <span class="close hand" @click="goodsCancel"></span>
        </div>
        <div class="store-info-box">
          <div class="phone-box">
            <div class="phone">
              <div class="content-box">
                <div class="content-top-box">
                  <img class="content-box-pic" :src="curItem.goods_cover_image" alt="">
                  <div class="content-title">
                    <div class="content-price-text">{{curItem.trade_price}}</div>
                    <div class="content-price-icon">元</div>
                    <div class="price-line-box">
                      <div class="price-line-top"></div>
                      <div class="price-line-bottom">{{curItem.original_price}}元</div>
                    </div>
                  </div>
                </div>
                <div class="content-title-box">
                  {{curItem.name}}
                </div>
                <img class="content-detials-pic" src="./title-icon@2x.png" alt="">
                <img v-for="(item, index) in curItem.goods_main_images" :key="index" class="content-box-pic" :src="item.image_url" alt="">
              </div>
            </div>
          </div>
          <div class="info-main">
            <div class="info-right-box">
              <div class="info-right-title">{{curItem.name}}</div>
              <div class="info-right-price-box">
                <div class="one-right-price">
                  <div class="content-text-box">建议售价：</div>
                  <div class="content-right-box suggest-price">￥{{curItem.trade_price}}</div>
                </div>
                <div class="one-right-price mt-15">
                  <div class="content-text-box">市场价：</div>
                  <div class="content-right-box">￥{{curItem.original_price}}</div>
                </div>
              </div>
              <div class="info-sale-box">
                <div class="one-right-price">
                  <div class="content-text-box">销售规格：</div>
                  <div class="content-right-box">{{curItem.base_sale_rate}}{{curItem.base_unit}}/{{curItem.sale_unit}}</div>
                </div>
              </div>
            </div>
            <div class="back-btn back-submit" :class="curItem.is_selected ? 'none-submit' : ''" @click="submitAdd('')">{{curItem.is_selected ? '已添加' : '添加'}}</div>
          </div>
        </div>
      </div>
    </default-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {scmGoodsComputed, scmGoodsMethods} from '@state/helpers'
  import DefaultModal from '@components/default-modal/default-modal'
  import API from '@api'
  const PAGE_NAME = 'GOODS_STORE'
  const TITLE = '商品素材库'

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
        isOpenOne: false,
        isOpenTwo: false,
        isOpenThr: false,
        keyWord: '',
        materialId: '',
        oneList: {check: false, show: false, content: '一级分类', type: 'default', data: []},
        oneIndex: 0,
        twoList: {check: false, show: false, content: '二级分类', type: 'default', data: []},
        twoIndex: 0,
        thrList: [],
        thrIndex: 0,
        curItem: {},
        isSubmit: false,
        isShowOne: 0,
        isShowTwo: 0,
        isShowThr: 0,
        isShowAdd: false
      }
    },
    computed: {
      ...scmGoodsComputed
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        if (from.name === 'product-categories') {
          vm.isShowAdd = true
          vm.fromPage = from.path
        }
      })
    },
    created() {
      this.getCategoriesData()
    },
    methods: {
      ...scmGoodsMethods,
      // 获取类目列表
      getCategoriesData() {
        API.Product.getScmCategoryList({parent_id: -1}, false).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.oneList.data = res.data
            this.oneList.data.unshift({name: '全部', id: '', list: []})
            this.$nextTick(() => {
              let number = 0
              let oneItem = document.querySelectorAll('.select-one-item')
              oneItem.forEach((item) => {
                number += item.clientWidth + 8
              })
              this.isShowOne = number
            })
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      // 分页
      addPage(page) {
        this.page = page
        this.getReqList()
      },
      // 预览
      lookGoodsInfo(item) {
        this.curItem = item
        this.$refs.storeModal.showModal()
      },
      // 关闭预览
      goodsCancel() {
        this.$refs.storeModal.hideModal()
      },
      // 搜索
      changeKeyword(text) {
        this.keyWord = text
        this.page = 1
        this.$refs.pagination.beginPage()
        this.getReqList()
      },
      // 显示更多
      clickBtn(text) {
        this[`isOpen${text}`] = !this[`isOpen${text}`]
      },
      // 选择一级类目
      selectOneList(item, index) {
        this.materialId = item.id
        this.twoList.data = this.oneList.data[index].list
        this.twoList.content = '二级分类'
        this.page = 1
        this.$refs.pagination.beginPage()
        this.getReqList()
      },
      // 选择二级类目
      selectTwoList(item, index) {
        this.materialId = item.id
        this.page = 1
        this.$refs.pagination.beginPage()
        this.getReqList()
      },
      // 选择三级类目
      selectThrList(item, index) {
        if (!item.is_selected) {
          this.thrList[this.thrIndex].is_selected = false
          this.thrList[index].is_selected = true
          this.thrIndex = index
        }
        this.materialId = item.id
        this.page = 1
        this.$refs.pagination.beginPage()
        this.getReqList()
      },
      // 添加商品
      submitAdd(item) {
        let curItem
        if (item.length !== 0) {
          curItem = item
        } else {
          curItem = this.curItem
        }
        if ((curItem.is_selected * 1 === 1 && !this.isShowAdd) || this.isSubmit) return
        this.isSubmit = true
        if (this.isShowAdd) {
          this.$router.push({path: '/home/product-list/edit-goods', params: {tplId: item.id}})
        } else {
          API.Product.addScmGoods(curItem.id).then((res) => {
            this.isSubmit = false
            if (res.error === this.$ERR_OK) {
              this.getReqList()
              this.curItem.is_selected = 1
              this.$toast.show('商品素材添加成功')
            } else {
              this.$toast.show(res.message)
            }
          })
        }
      },
      // 获取商品列表
      getReqList() {
        this.getScmStoreData({
          keyword: this.keyWord,
          materialId: this.materialId,
          page: this.page,
          limit: 21,
          loading: false
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .table-content
    position: relative
    padding: 0 20px 60px !important
    .pagination-box
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      padding: 0 20px
      box-sizing: border-box
  .goods-store
    width: 100%
  .distribution-down
    display: flex
    align-items: center
  .goods-list
    padding-top: 8px
    layout(row)
    .goods-item
      width: 216px
      border-1px(#D9DEE1, 8px)
      margin-right: 20px
      margin-bottom: 30px
      border-radius: 4px
      .goods-item-top
        width: 216px
        height: @width
        padding-top: 38px
        box-sizing: border-box
        position: relative
        .top-pic-box
          width: 140px
          height: @width
          display: block
          margin: 0 auto
          border-radius: 2px
          object-fit: cover
          background-repeat: no-repeat
          background-size: cover
          background-position: center
        .goods-item-model
          cursor: pointer
          position: absolute
          width: 100%
          height: 100%
          background: rgba(0,0,0,.05)
          left: 0
          top: 0
          z-index: 2
          layout(row)
          align-items: center
          justify-content: center
          border-radius: 2px
          opacity: 0
          .look-goods
            width: 64px
            height: 28px
            line-height: 28px
            border-radius: 14px
            background: rgba(0,0,0,.5)
            text-align: center
            font-size: $font-size-14
            font-family: $font-family-regular
            color: rgba(255,255,255,.7)
        &:hover
          .goods-item-model
            opacity: 1
      .goods-item-bottom
        box-sizing: border-box
        .goods-title
          padding: 10px 14px 16px
          font-family: $font-family-regular
          color: $color-text-main
          font-size: $font-size-14
          no-wrap()
        .goods-price-box
          color: #3E77C3
          background: #F5F7FA
          height: 34px
          line-height: 34px
          text-align: center
          font-family: $font-family-regular
          font-size: $font-size-14
          border-top-1px(#D9DEE1)
        .goods-price-add
          color: #ACACAC
          cursor: auto

      &:nth-child(7n)
        /*margin-right: 0*/
        opacity: 1
  .type-select
    layout(row)
    padding-top: 20px
    position: relative
    z-index: 11
    min-height: 54px
    display: flex
    .select-left
      font-size: $font-size-14
      font-family: $font-family-regular
      color: $color-text-main
      width: 90px
      height: 24px
      line-height: 24px
    .select-right
      layout(row)
      width: 1200px
      max-height: 34px
      overflow: hidden
      .select-item
        height: 24px
        line-height: 24px
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-text-main
        padding: 0 16px
        border-radius: 12px
        margin-bottom: 10px
        margin-right: 8px
        cursor: pointer
      .select-item-select
        background: #4FBD66
        color: $color-white
    .select-open
      layout(row)
      height: 24px
      align-items: center
      cursor: pointer
      .select-open-name
        font-size: $font-size-12
        color: #4D77BD
        font-family: $font-family-regular
      .select-open-icon
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
          top: 1px
          right: 0
          width: 0
          height: 0
          border-left: 4px solid transparent
          border-right: 4px solid transparent
          border-top: 6px solid #4D77BD
    .select-right-active
      max-height: 200px
      transition: all .3s
  .type-select-top
    border-top-1px(#E6EAED, dotted)
  .type-select
    .select-open-active
      .select-open-icon
        transform: translateY(0) rotate(180deg)
  .store-box
    background: $color-white
    width: 1000px
    min-height: 650px
    border-radius: 3px
    padding: 0 20px 24px
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
  .store-info-box
    layout(row)
  // 结构布局
  .phone-box
    margin: 0 41px 0 71px
    box-sizing: border-box
    display: flex
    justify-content: center
    .phone
      icon-image('pic-tel')
      width: 340px
      height: 726.24px
      position: relative
      .content-box
        padding: 0 2px
        box-sizing: border-box
        top: 111px
        left: 20px
        position: absolute
        width: 298px
        height: 505px
        max-height: 532px
        overflow-y: auto
        background: #f7f7f7
        &::-webkit-scrollbar
          width: 0
      .content-top-box
        width: 298px
        height: @width
        position: relative
      .content-title
        position: absolute
        width: 288px
        height: 50px
        background: #ff6d0f
        left: 4px
        border-top-right-radius: 8px
        border-top-left-radius: 8px
        bottom: 0
        z-index: 111
        layout(row)
        padding: 0 15px
        box-sizing: border-box
        align-items: center
        .content-price-text
          font-size: 24px
          color: $color-white
          font-family: $font-family-regular
          margin-right: 2px
        .content-price-icon
          font-size: 20px
          color: $color-white
          font-family: $font-family-regular
          margin-right: 5px
        .price-line-box
          layout()
          .price-line-top
            icon-image('icon')
            width: 36px
            height: 12px
            font-size: 9px
            color: #FF6803
            font-family: $font-family-regular
          .price-line-bottom
            font-size: $font-size-12
            color: $color-white
            line-height: $font-size-12
            margin-top: 1px
            text-decoration:line-through
            font-family: $font-family-regular
      .content-box-pic
        width: 298px
        height: @width
        display: block
        object-fit: cover
        background-repeat: no-repeat
        background-size: cover
        background-position: center
      .content-title-box
        width: 288px
        height: 50px
        line-height: 50px
        no-wrap()
        background: #fff
        border-bottom-left-radius: 8px
        border-bottom-right-radius: 8px
        margin-left: 5px
        font-size: 17px
        font-family: $font-family-medium
        color: #111
        box-sizing: border-box
        padding: 0 10px
        box-shadow: 0 6px 20px 0 rgba(17,17,17,0.06)
    .content-detials-pic
      width: 298px
  .info-right-box
    margin-top: 50px
    width: 477px
    height: 200px
    border-1px($color-line)
    .info-right-title
      font-family: $font-family-medium
      font-size: $font-size-16
      color: $color-text-main
      height: 60px
      line-height: 60px
      background: #F5F7FA
      padding: 0 20px
      box-sizing: border-box
      no-wrap()
    .info-right-price-box
      border-top-1px($color-line)
      height: 80px
      layout()
      justify-content: center
      padding: 0 20px
    .one-right-price
      layout(row)
      align-items: center
      .content-text-box
        width: 70px
        text-align: justify
        height: 14px
        line-height: 14px
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-text-main
        &:after
          content: ''
          display: inline-block
          width: 100%
          height: 0
      .content-right-box
        height: 14px
        line-height: 14px
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-text-main
      .suggest-price
        font-size: $font-size-16
        height: 16px
        line-height: 16px
        color: #ffa71d
    .info-sale-box
      border-top-1px($color-line)
      height: 60px
      layout(row)
      align-items: center
      padding: 0 20px
  .mt-15
    margin-top: 15px
  .down-tip
    font-size: $font-size-12
    color: $color-text-main
    margin-right: 10px
  .base-blank-box
    width: 1200px
    position: relative
    height: 400px
  .back-btn
    box-sizing: border-box
    font-size: $font-size-16
    margin-right: 20px
    height: 40px
    line-height: 40px
    width: 477px
    white-space: nowrap
    transition: all 0.3s
    text-align: center
    margin-top: 30px
    border-radius: 2px
  .back-submit
    background: $color-main
    color: $color-white
    cursor: pointer
    &:hover
      opacity: 0.8
  .none-submit
    background: #cccccc
    color: $color-white
    cursor: auto
    &:hover
      opacity: 1
</style>
