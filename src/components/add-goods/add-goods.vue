<template>
  <!-- 选择商品弹窗-->
  <default-modal ref="goodsModal">
    <div slot="content" class="shade-box">
      <div class="title-box">
        <div class="title">选择商品</div>
        <span class="close hand" @click="_cancelModal"></span>
      </div>
      <div class="shade-tab">
        <div class="tab-item">
          <base-drop-down :width="218" :select="assortment" @setValue="_secondAssortment"></base-drop-down>
        </div>
        <div class="tab-item">
          <base-drop-down :width="140" :select="secondAssortment" @setValue="_choessSecondAssortment"></base-drop-down>
        </div>
        <div class="tab-item">
          <base-search ref="goodsSearch" placeHolder="请输入商品名称" @search="_searchGoods"></base-search>
        </div>
      </div>
      <div class="goods-content">
        <div class="goods-title">
          <div v-for="(item, index) in goodsTitle" :key="index" class="title-item" :style="{flex: item.flex}">{{item.name}}</div>
        </div>
        <div class="goods-list">
          <div v-for="(item, index) in chooseGoods" :key="index" class="goods-item">
            <div v-for="(title, ind) in goodsTitle" :key="ind" class="item-content hand" :style="{flex: title.flex}" @click="_selectGoods(item,index)">
              <span v-if="title.value === 'name'" class="select-icon" :class="{'select-icon-disable': item.selected === 1, 'select-icon-active': item.selected === 2}"></span>
              <img v-if="title.value === 'name'" class="goods-img" :src="item.goods_cover_image">
              <div class="value">{{title.value === 'trade_price' ? '¥' : ''}}{{item[title.value]}}</div>
            </div>
            <!--<div class="add-btn btn-main" :class="{'add-btn-disable': item.selected === 1}" @click="_additionOne(item, index)">{{item.selected === 1 ? '已添加' : '添加'}}</div>-->
          </div>
        </div>
      </div>
      <div class="page-box">
        <p class="select-all hand" @click="_selectAllGoods()"><span class="select-icon" :class="{'select-icon-active': selectAll}"></span>全选</p>
        <base-pagination ref="pagination" :pageDetail="goodsPage" @addPage="_getMoreGoods"></base-pagination>
      </div>
      <div class="back">
        <div class="back-cancel back-btn hand" @click="_cancelModal">取消</div>
        <div class="back-btn back-submit hand" @click="_batchAddition">批量添加</div>
      </div>
    </div>
  </default-modal>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  import API from '@api'

  const COMPONENT_NAME = 'ADD_GOODS'
  const GOODS_POP_TITLE = [
    {name: '商品名称', flex: 2, value: 'name'},
    {name: '库存', flex: 1, value: 'usable_stock'},
    {name: '销售价格', flex: 1, value: 'trade_price'}
  ]

  export default {
    name: COMPONENT_NAME,
    components: {
      DefaultModal
    },
    data() {
      return {
        goodsTitle: GOODS_POP_TITLE,
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
        goodsDelId: 0,
        goodsDelIndex: 0,
        // selectDelId: [],
        chooseGoods: [],
        goodsPage: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        page: 1,
        parentId: '',
        keyword: '',
        goodsList: [],
        parentGoodsList: [],
        selectAll: false
      }
    },
    async created() {
      // await this._getGoodsList()
      this._getFirstAssortment()
    // this.$refs.goodsModal.showModal()
    },
    methods: {
      // 删除商品传入商品id
      _delGoods(id) {
        let index = this.selectGoodsId.findIndex((item) => item === id)
        this.selectGoodsId.splice(index, 1)
        this.goodsList.splice(this.goodsDelIndex, 1)
        this.selectDelId.push(id)
        this._getGoodsList()
        this.$refs.goodsModal.showModal()
      },
      showModal(list) {
        this.parentGoodsList = list
        this._getGoodsList()
        this.$refs.goodsModal.showModal()
      },
      _hideGoods() {
        this.selectAll = false
        this.$refs.goodsModal.hideModal()
      },
      // 单个添加
      _additionOne(item, index) {
        if (item.selected === 1) {
          return
        }
        this.chooseGoods[index].selected = 1
        this.goodsList.push(item)
        this.chooseGoods.forEach((item) => {
          if (item.selected === 1) {
            let idx = this.selectGoods.findIndex((child) => child.id === item.id)
            if (idx !== -1) {
              this.selectGoods.splice(idx, 1)
            }
          }
        })
        this.$emit('additionOne', item)
      },
      // 勾选商品
      _selectGoods(item, index) {
        if (item.usable_stock <= 0) {
          this.$toast.show('该商品库存为0，不能选择')
          return
        }
        switch (item.selected) {
        case 0:
          this.chooseGoods[index].selected = 2
          this.selectGoods.push(item)
          // this.selectGoodsId.push(item.id)
          break
        case 2:
          this.selectAll = false
          this.chooseGoods[index].selected = 0
          let idx = this.selectGoods.findIndex((items) => items.id === item.id)
          // let idIdx = this.selectGoodsId.findIndex((id) => id === item.id)
          if (idx !== -1) {
            this.selectGoods.splice(idx, 1)
          }
          // if (idIdx !== -1) {
          //   this.selectGoodsId.splice(idx, 1)
          // }
          break
        }
      },
      _selectAllGoods() {
        this.selectAll = !this.selectAll
        this.selectGoods = []
        // this.selectGoodsId = []
        if (this.selectAll) {
          this.chooseGoods.map(item => {
            +item.selected === 0 && (item.selected = 2);
            +item.selected === 2 && this.selectGoods.push(item)
            // this.selectGoodsId.push(item.id)
            return item
          })
        } else {
          this.chooseGoods.map(item => {
            if (+item.selected === 2) {
              item.selected = 0
            }
            if (+item.selected === 1) {
              // this.selectGoods.push(item)
              // this.selectGoodsId.push(item.id)
            }
            return item
          })
        }

      },
      // 批量添加
      _batchAddition() {
        this.chooseGoods = this.chooseGoods.map((item) => {
          item.selected = item.selected === 2 ? 1 : item.selected
          return item
        })
        this.goodsList = this.goodsList.concat(this.selectGoods)
        this.selectGoods = []
        this.$emit('batchAddition', this.goodsList)
        this._hideGoods()
      },
      _cancelModal() {
        this.selectGoods.forEach((item) => {
          let idx = this.chooseGoods.findIndex((items) => items.goods_id === item.goods_id)
          idx > -1 && (this.chooseGoods[idx].selected = this.chooseGoods[idx].selected === 1 ? 1 : 0)
        })
        this.selectGoods = []
        this._hideGoods()
      },
      // 选择商品
      async _getGoodsList() {
        let res = await API.Sale.getGoodsList({
          is_online: 1,
          keyword: this.keyword,
          goods_category_id: this.parentId,
          shelf_id: this.id,
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
        this.chooseGoods = []
        this.goodsList = []
        this.chooseGoods = res.data.map((item) => {
          let ischecked = false
          this.parentGoodsList.forEach((item1) => {
            if (item1.id * 1 === item.id * 1) {
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
        this.chooseGoods = res.data.map((item, index) => {
          let idx = this.goodsList.findIndex((id) => id === item.id)
          let goodsIndex = this.selectGoods.findIndex((items) => items.id === item.id)
          // let delIndex = this.selectDelId.findIndex((id) => id === item.id)
          // if (delIndex !== -1) {
          //   item.selected = 0
          // }
          if (idx !== -1) {
            item.selected = 1
          }
          if (goodsIndex !== -1) {
            item.selected = 2
          }
          return item
        })
      },
      // 选择一级分类
      async _secondAssortment(item) {
        this.parentId = item.id
        let res = await API.Rush.goodsCategory({parent_id: this.parentId})
        this.secondAssortment.data = res.error === this.$ERR_OK ? res.data : []
        this.secondAssortment.data.unshift({name: '全部', id: this.parentId})
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
        let res = await API.Rush.goodsCategory({parent_id: this.parentId})
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
    height: 720px
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
    margin-bottom: 20px
    align-items: center
    box-sizing: border-box
    display: flex
    .tab-item
      margin-right: 10px

  .goods-content
    border-radius: 4px
    height: 465px
    .goods-title
      display: flex
      height: 45px
      background: #F5F7FA
      position: relative
      align-items: center
      padding: 0 30px 0 20px
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
      .title-item
        padding-right: 20px
      .title-item:first-child
        text-indent: 36px
        box-sizing: border-box
    .goods-list
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
        .item-content
          padding-right: 20px
          display: flex
          align-items: center
        .goods-img
          margin-right: 10px
          width: 40px
          object-fit: cover
          height: @width
          overflow: hidden
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
        .value
          white-space: nowrap
          text-overflow: ellipsis
          overflow: hidden
          max-width: 320px

  .page-box
    padding: 0 20px
    box-sizing: border-box
    height: 77px
    align-items: center
    display: flex
    .select-all
      width: 100px
      display: flex
      align-items: center
      -webkit-user-select: none
      -moz-user-select: none
      -ms-user-select: none
      -khtml-user-select: none
      user-select: none
    .select-icon
      margin-right: 20px
      border-radius: 1px
      border: 1px solid #e9ecee
      height: 16px
      width: 16px
      display: inline-block
      -webkit-transition: all .3s
      transition: all .3s
    .select-icon-active
      border: 1px solid transparent
      display: inline-block
      background-size: 100% 100%
      background-image: url("./icon-check@2x.png")
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
