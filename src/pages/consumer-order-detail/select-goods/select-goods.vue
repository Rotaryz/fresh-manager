<template>
  <!-- 选择商品弹窗-->
  <default-modal ref="goodsModel">
    <div slot="content" class="shade-box">
      <div class="title-box">
        <div class="title">
          选择商品
        </div>
        <span class="close hand" @click="_cancelGoods"></span>
      </div>
      <div class="shade-tab">
        <!--<div class="tab-item">-->
        <!--<base-drop-down :width="218" :select="assortment" @setValue="_secondAssortment"></base-drop-down>-->
        <!--</div>-->
        <!--<div class="tab-item">-->
        <!--<base-drop-down :width="140" :select="secondAssortment" @setValue="_choessSecondAssortment"></base-drop-down>-->
        <!--</div>-->
        <div class="tab-item">
          <base-drop-down :select="stairSelect" @setValue="setStairValue"></base-drop-down>
        </div>
        <div class="tab-item">
          <base-drop-down :select="secondSelect" @setValue="setSecondValue"></base-drop-down>
        </div>
        <div class="tab-item">
          <base-drop-down :select="thirdlySelect" @setValue="setThirdlyValue"></base-drop-down>
        </div>
        <div class="tab-item">
          <base-search placeHolder="请输入商品名称或商品编码" @search="_searchGoods"></base-search>
        </div>
      </div>
      <div class="goods-content">
        <div class="rush-goods-list">
          <div v-for="(item, index) in choeesGoods" :key="index" class="goods-item">
            <span class="select-icon hand" :class="{'select-icon-disable': item.selected === 1, 'select-icon-active': item.selected === 2}" @click="_selectGoods(item,index)"></span>
            <div class="goods-img" :style="{'background-image': 'url(\'' +item.goods_cover_image+ '\')'}"></div>
            <div class="goods-msg">
              <div class="goods-name">
                <p class="text">{{item.goods_name}}</p>
                <p class="text">{{item.goods_sku_encoding}}</p>
              </div>
              <!--<div class="goods-money">{{item.goods_sku_encoding}}</div>-->
              <div v-if="!item.is_presale" class="goods-stock">可用库存 {{item.sale_usable_stock}}{{item.sale_unit}}</div>
            </div>
            <div class="add-btn btn-main" :class="{'add-btn-disable': item.selected === 1}" @click="_additionOne(item, index)">{{item.selected === 1 ? '已添加' : '添加'}}</div>
          </div>
          <div v-if="choeesGoods.length === 0" class="rush-null-text">暂无商品</div>
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
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  import API from '@api'

  const COMPONENT_NAME = 'ADD_GOODS'

  export default {
    name: COMPONENT_NAME,
    components: {
      DefaultModal
    },
    props: {
      stock: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
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
        selectGoods: [], // 单次选择的商品
        selectGoodsId: [], // 所有选择的商品id
        goodsDelId: 0,
        goodsDelIndex: 0,
        selectDelId: [],
        choeesGoods: [],
        goodsPage: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        parentId: '',
        keyword: '',
        goodsList: [],
        stairSelect: {
          check: false,
          show: false,
          content: '一级类目',
          type: 'default',
          data: []
        },
        secondSelect: {
          check: false,
          show: false,
          content: '二级类目',
          type: 'default',
          data: []
        },
        thirdlySelect: {
          check: false,
          show: false,
          content: '三级类目',
          type: 'default',
          data: []
        },
        categoryId: '',
        selectStoreList: []
      }
    },
    async created() {
      await this._getGoodsList()
      // await this._getFirstAssortment()
      this.getCategoriesData()
    // this.$refs.goodsModel.showModal()
    },
    methods: {
      // 删除商品传入商品id
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
      async setStairValue(data) {
        this.secondSelect.content = '二级类目'
        this.secondSelect.data = data.list
        this.thirdlySelect.content = '三级类目'
        this.thirdlySelect.data = []
        this.categoryId = data.id
        this.page = 1
        this.$refs.pagination.beginPage()
        await this._getGoodsList()
      },
      async setSecondValue(data) {
        this.thirdlySelect.content = '三级类目'
        this.thirdlySelect.data = data.list
        this.categoryId = data.id
        this.page = 1
        this.$refs.pagination.beginPage()
        await this._getGoodsList()
      },
      async setThirdlyValue(data) {
        this.categoryId = data.id
        this.page = 1
        this.$refs.pagination.beginPage()
        await this._getGoodsList()
      },
      _delGoods(list) {
        this.selectStoreList = list
        this._getGoodsList()
        this.$refs.goodsModel.showModal()
      },
      _hideGoods() {
        this.$refs.goodsModel.hideModal()
      },
      // 单个添加
      _additionOne(item, index) {
        if (item.sale_usable_stock <= 0 && this.stock && !item.is_presale) {
          this.$toast.show('该商品库存为0，不能选择')
          return
        }
        if (item.selected === 1) {
          return
        }
        this.choeesGoods[index].selected = 1
        this.goodsList.push(item)
        this.selectGoodsId.push(item.goods_id)
        this.choeesGoods.forEach((item) => {
          if (item.selected === 1) {
            let idx = this.selectGoods.findIndex((child) => child.goods_id === item.goods_id)
            if (idx !== -1) {
              this.selectGoods.splice(idx, 1)
            }
          }
        })
        this.$forceUpdate()
        this.$emit('additionOne', item)
      },
      // 批量添加
      _batchAddition() {
        let arr = []
        this.choeesGoods = this.choeesGoods.map((item) => {
          item.selected = item.selected === 2 ? 1 : item.selected
          return item
        })
        // this.choeesGoods.forEach((item) => {
        //   if (item.selected * 1 === 1) {
        //     arr.push(item)
        //   }
        // })
        this.selectGoods.forEach(item => {
          arr.push(item)
        })
        this.goodsList = this.goodsList.concat(this.selectGoods)
        this.selectGoods = []
        this.$emit('batchAddition', arr)
        this._hideGoods()
      },
      _cancelGoods() {
        this.selectGoods.forEach((item) => {
          let idx = this.choeesGoods.findIndex((items) => items.goods_id === item.goods_id)
          let delIdx = this.selectGoodsId.findIndex((id) => id === item.goods_id)
          idx > -1 && (this.choeesGoods[idx].selected = this.choeesGoods[idx].selected === 1 ? 1 : 0)
          this.selectGoodsId.splice(delIdx, 1)
        })
        this.selectGoods = []
        this._hideGoods()
      },
      // 选择商品
      async _getGoodsList() {
        let res = await API.Store.getGoodsList({
          keyword: this.keyword,
          goods_material_category_id: this.categoryId,
          limit: 7,
          page: this.page || 1
        })
        if (res.error !== this.$ERR_OK) {
          return
        }
        this.goodsPage = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        this.choeesGoods = []
        this.goodsList = []
        this.selectGoodsId = this.selectStoreList.map(item => {
          return item.goods_id
        })
        this.choeesGoods = res.data.map((item) => {
          let ischecked = false
          this.selectStoreList.forEach((item1) => {
            if (item1.goods_id * 1 === item.goods_id * 1) {
              ischecked = true
            }
          })
          if (ischecked) {
            item.selected = 1
          } else {
            item.selected = 0
          }
          return item
        })
        this.choeesGoods = this.choeesGoods.map((item, index) => {
          let idx = this.selectGoodsId.findIndex((id) => id === item.goods_id)
          let goodsIndex = this.selectGoods.findIndex((items) => items.goods_id === item.goods_id)
          let delIndex = this.selectDelId.findIndex((id) => id === item.goods_id)
          if (delIndex !== -1) {
            item.selected = 0
          }
          if (idx !== -1) {
            item.selected = 1
          }
          if (goodsIndex !== -1) {
            item.selected = 2
          }
          return item
        })
        this.$forceUpdate()
      },
      // 选择一级分类
      async _secondAssortment(item) {
        this.parentId = item.id
        if (item.id === '') {
          this.secondAssortment.data = []
        } else {
          let res = await API.Store.goodsCategory({parent_id: this.parentId})
          this.secondAssortment.data = res.error === this.$ERR_OK ? res.data : []
          this.secondAssortment.data.uns_delGoodshift({name: '全部', id: this.parentId})
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
        let res = await API.Store.goodsCategory({parent_id: this.parentId})
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
        if (item.sale_usable_stock <= 0 && this.stock && !item.is_presale) {
          this.$toast.show('该商品库存为0，不能选择')
          return
        }
        switch (item.selected) {
        case 0:
          this.choeesGoods[index].selected = 2
          this.selectGoods.push(item)
          this.selectGoodsId.push(item.goods_id)
          break
        case 2:
          this.choeesGoods[index].selected = 0
          let idx = this.selectGoods.findIndex((items) => items.goods_id === item.goods_id)
          let idIdx = this.selectGoodsId.findIndex((id) => id === item.goods_id)
          if (idx !== -1) {
            this.selectGoods.splice(idx, 1)
          }
          if (idIdx !== -1) {
            this.selectGoodsId.splice(idx, 1)
          }
          break
        }
        this.$forceUpdate()
      },
      // 获取分页商品列表
      async _getMoreGoods(page) {
        this.page = page
        await this._getGoodsList()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
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
    // 分类编辑新建
    .auxiliary-box
      padding: 0 20px
      box-sizing: border-box
      margin-top: 32px
      layout(row)
      flex-wrap: wrap
      .auxiliary-item
        min-width: 80px
        height: 32px
        border-1px(#333, 4px)
        text-align: center
        position: relative
        margin-right: 10px
        margin-bottom: 20px
        .text
          font-size: $font-size-14
          color: $color-text-main
          line-height: 32px
          font-family: $font-family-regular
        .auxiliary-model
          opacity: 0
          position: absolute
          width: 100%
          height: 100%
          border-radius: 2px
          background: rgba(51, 51, 51, 0.9)
          left: 0
          top: 0
          padding: 0 11px
          box-sizing: border-box
          layout(row)
          align-items: center
          justify-content: space-between
          transition: all 0.4s
          .img-box
            width: 22px
            height: 22px
            border-radius: 50%
            background: #fff
            cursor: pointer
            background-size: 22px
            bg-image('icon-quit_round')
          .del
            bg-image('icon-delete_round')
          &:hover
            opacity: 1
      .auxiliary-add
        font-size: $font-size-14
        padding: 9px 12px
        margin-bottom: 20px
        min-width: 80px
        text-align: center
    .back
      background: $color-white
      justify-content: flex-end
      position: absolute
      left: 0
      right: 0
      bottom: 0
    /*小弹窗盒子*/
    .default-modal-small
      position: absolute
      width: 100%
      height: 100%
      background: rgba(0, 0, 0, 0.50)
      top: 0
      bottom: 0
      right: 0
      z-index: 10
      layout()
      justify-content: center
      align-items: center
      .model-active
        animation: layerFadeIn .3s
      .model-un-active
        animation: hideFadeIn .4s

    /*分类弹窗*/
    .default-input
      box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
      background: #fff
      border-radius: 2px
      .title-input
        height: 60px
        layout(row)
        align-items: center
        justify-content: space-between
        border-bottom: 0.5px solid $color-line
        padding-left: 20px
        .title
          color: $color-text-main
          font-size: $font-size-16
          font-family: $font-family-medium
        .close-box
          padding: 17px
          .close
            width: 16px
            height: 16px
            border-radius: 50%
            background-size: 22px
            icon-image('icon-close')
            transition: all 0.3s
            &:hover
              transform: scale(1.3)

      .main-input
        padding: 42px 20px 30px 20px
        .main-input-box
          width: 310px
          height: 44px
          border-radius: 2px
          font-family: $font-family-regular
          color: $color-text-main
          font-size: $font-size-14
          padding-left: 14px
          border: 1px solid $color-line
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

    .btn-group
      text-align: center
      display: flex
      justify-content: flex-end
      user-select: none
      .btn
        width: 96px
        height: 40px
        line-height: 40px
        border-radius: 2px
        cursor: pointer
        transition: all 0.3s
      .cancel
        border: 1px solid $color-line
        &:hover
          color: $color-text-sub
          border-color: $color-text-sub
      .confirm
        border: 1px solid $color-main
        background: $color-main
        color: $color-white
        margin-left: 20px
        &:hover
          background: #44AB67
        &:active
          opacity: 0.8
      .one-btn
        margin-left: 0

    .main-model-box
      layout(row)
      align-items: center
      margin-bottom: 24px
      .text
        color: #666
        font-size: $font-size-14
        font-family: $font-family-regular
        width: 60px
        margin-right: 36px

  /*新建编辑内部的确定弹窗*/
  .default-confirm
    width: 329.6px
    height: 200px
    background: #fff
    border-radius: 2px
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.6)
    text-align: center
    .btn-group-confirm
      text-align: center
      display: flex
      justify-content: center
      user-select: none
      .btn
        width: 96px
        height: 40px
        line-height: 40px
        border-radius: 2px
        border: 1px solid $color-text-D9
        cursor: pointer
        transition: all 0.3s
      .cancel
        border: 1px solid $color-line
        &:hover
          color: $color-text-sub
          border-color: $color-text-sub
      .confirm
        border: 1px solid $color-main
        background: $color-main
        color: $color-white
        margin-left: 20px
        &:hover
          background: #44AB67
        &:active
          opacity: 0.8
      .one-btn
        margin-left: 0
    .title
      font-size: $font-size-16
      font-family: $font-family-medium
      height: 44px
      line-height: 44px
      padding: 0 15px
    .text
      font-size: $font-size-16
      color: $color-text-main
      height: 120px
      display: flex
      align-items: center
      justify-content: center
      margin: 10px 15px
      overflow-y: auto
      text-align: justify
      word-break: break-all
      line-height: 1.4

  /*选择商品样式*/
  .shade-tab
    margin-bottom: 20px
    align-items: center
    box-sizing: border-box
    display: flex
    .tab-item
      margin-right: 10px

  .page-box
    box-sizing: border-box
    height: 66px
    align-items: center
    display: flex

  .goods-content
    border-radius: 2px
    .rush-goods-list
      height: 420px
    .goods-item
      box-sizing: border-box
      padding: 0 20px
      width: 100%
      height: 60px
      display: flex
      align-items: center
      border-bottom: 0.5px solid $color-line
      border-right: 0.5px solid $color-line
      border-left: 0.5px solid $color-line
      position: relative
      &:nth-child(2n+1)
        background: #f5f7fa
      &:first-child
        border-top: 0.5px solid $color-line
      .select-icon
        margin-right: 20px
        border-radius: 2px
        border: 1px solid $color-line
        height: 16px
        width: 16px
        transition: all 0.3s
      .select-icon-disable
        border: 1px solid transparent
        cursor: not-allowed
        icon-image('icon-check_ash')
      .select-icon-active
        border: 1px solid transparent
        icon-image('icon-check')
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
        display: flex
        color: $color-text-main
        font-family: $font-family-regular
        height: 40px
        align-items: center
        margin-right: 130px
        flex: 1
        .goods-name
          width: 500px
          padding-right: 20px
          no-wrap()
          .text
            width: 100%
            text-overflow: ellipsis
            overflow: hidden
            line-height: 1.4
        .goods-stock
          flex: 1
        .goods-name, .goods-money
          line-height: 1
          font-size: $font-size-14
      .add-btn
        col-center()
        right: 20px
        border-radius: 2px
        margin-left: 88px
        padding: 7px 0
        min-width: 56px
        text-align: center
      .add-btn-disable
        border-radius: 2px
        padding: 7px 0
        width: 56px
        box-sizing: border-box
        text-align: center
        font-size: $font-size-14
        line-height: 1
        cursor: not-allowed
        background: $color-line
        color: $color-text-assist
        border: none

  .rush-null-text
    width: 100%
    text-align: center
    padding-top: 150px
    font-size: $font-size-16
    color: $color-text-main
    font-family: $font-family-regular
  /*弹窗动画*/
  @keyframes layerFadeIn {
    0% {
      opacity: 0
      transform: scale(.5)
    }
    100% {
      opacity: 1
      transform: scale(1)
    }
  }

  @keyframes hideFadeIn {
    0% {
      opacity: 1
      transform: scale(1)
    }
    100% {
      transform: scale(.5)
      opacity: 0
    }
  }

</style>