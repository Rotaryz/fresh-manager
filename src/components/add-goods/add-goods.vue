<template>
  <!-- 选择商品弹窗-->
  <default-modal ref="goodsModel">
    <div slot="content" class="shade-box">
      <div class="shade-header">
        <div class="shade-title">选择商品</div>
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
              <div class="goods-name">{{item.name}}</div>
              <div class="goods-money">¥{{item.original_price}}</div>
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
        parentId: 0,
        keyword: '',
        goodsList: []
      }
    },
    async created() {
      await this._getGoodsList()
    // this.$refs.goodsModel.showModal()
    },
    methods: {
      // 删除商品传入商品id
      _delGoods(id) {
        let index = this.selectGoodsId.findIndex((item) => item === id)
        this.selectGoodsId.splice(index, 1)
        this.goodsList.splice(this.goodsDelIndex, 1)
        this.selectDelId.push(id)
        this._getGoodsList()
        this.$refs.goodsModel.showModal()
      },
      _hideGoods() {
        this.$refs.goodsModel.hideModal()
      },
      // 单个添加
      _additionOne(item, index) {
        if (item.selected === 1) {
          return
        }
        this.choeesGoods[index].selected = 1
        this.goodsList.push(item)
        this.selectGoodsId.push(item.id)
        this.choeesGoods.forEach((item) => {
          if (item.selected === 1) {
            let idx = this.selectGoods.findIndex((child) => child.id === item.id)
            if (idx !== -1) {
              this.selectGoods.splice(idx, 1)
            }
          }
        })
        this.$emit('additionOne', item)
      },
      // 批量添加
      _batchAddition() {
        this.choeesGoods = this.choeesGoods.map((item) => {
          item.selected = item.selected === 2 ? 1 : item.selected
          return item
        })
        this.goodsList = this.goodsList.concat(this.selectGoods)
        this.selectGoods = []
        this.$emit('batchAddition', this.goodsList)
        this._hideGoods()
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
      // 选择商品
      async _getGoodsList() {
        let res = await API.Rush.getGoodsList({
          is_online: 1,
          keyword: this.keyword,
          goods_category_id: this.parentId,
          shelf_id: this.id,
          limit: 10,
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
          let idx = this.selectGoodsId.findIndex((id) => id === item.id)
          let goodsIndex = this.selectGoods.findIndex((items) => items.id === item.id)
          let delIndex = this.selectDelId.findIndex((id) => id === item.id)
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
      },
      // 选择二级分类
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
      // 勾选商品
      _selectGoods(item, index) {
        switch (item.selected) {
        case 0:
          this.choeesGoods[index].selected = 2
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
          width: 593px
          no-wrap()
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
