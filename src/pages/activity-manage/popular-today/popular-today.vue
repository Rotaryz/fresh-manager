<template>
  <div class="data-content">
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-today_rob@2x.png" class="identification-icon">
          <p class="identification-name">今日爆款</p>
        </div>
        <div class="function-btn">
          <div class="btn-main" @click="_showGoods">添加商品<span class="add-icon"></span></div>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in saleTitle" :key="index" class="list-item" :style="{flex: item.flex}">{{item.name}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in saleList" :key="index" class="list-content list-box">
            <div v-for="(val, ind) in saleTitle" :key="ind" :style="{flex: val.flex}" class="list-item">
              <div v-if="+val.type === 1 || +val.type === 3" :style="{flex: val.flex}" class="item">
                {{+val.type === 3 ? '¥' : ''}}{{item[val.value] || '0'}}
              </div>
              <div v-if="+val.type === 2" :style="{flex: val.flex}" class="list-double-row item">
                <p class="item-dark">{{item.start_at}}</p>
                <p class="item-sub">{{item.end_at}}</p>
              </div>

              <!--状态-->
              <div v-if="+val.type === 4" :style="{flex: val.flex}" class="status-item item" :class="item.status === 1 ? 'status-success' : item.status === 2 ? 'status-fail' : ''">{{item.status === 0 ? '未开始' : item.status === 1 ? '进行中' : item.status === 2 ? '已结束' : ''}}</div>

              <div v-if="+val.type === 5" :style="{flex: val.flex}" class="list-operation-box item">
                <span class="list-operation" @click="_deleteActivity(item.id)">删除</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pages" :pageDetail="salePage" @addPage="addPage"></base-pagination>
      </div>
    </div>

    <!-- 选择商品弹窗-->
    <default-modal ref="goodsModel">
      <div slot="content" class="shade-box">
        <div class="title-box">
          <div class="title">选择商品</div>
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
                <!--<div class="goods-name">{{item.usable_stock}}</div>-->
                <div class="goods-name">{{item.name}}</div>
                <div class="goods-money">
                  <div class="goods-money-text">{{item.usable_stock}}</div>
                  <div class="goods-money-text">¥{{item.original_price}}</div>
                </div>
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

    <default-confirm ref="confirm" @confirm="_sureConfirm"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  import {saleComputed, saleMethods} from '@state/helpers'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import API from '@api'

  const SALE_TITLE = [
    {name: '商品图片', flex: 1.5, value: 'activity_name', type: 1},
    {name: '商品名称', flex: 1.5, value: 'start_at', type: 2},
    {name: '商品编码', flex: 1.2, value: 'goods_count', type: 1},
    {name: '商品分类', flex: 1, value: 'sale_count', type: 1},
    {name: '基本单位', flex: 1, value: 'pay_amount', type: 3},
    {name: '销售规格', flex: 1, value: 'status', type: 4},
    {name: '销售单价', flex: 1, value: '', type: 5},
    {name: '销售库存', flex: 1, value: '', type: 5},
    {name: '活动库存', flex: 1, value: '', type: 5},
    {name: '操作', flex: 1, value: '', type: 5}
  ]
  export default {
    components: {
      DefaultConfirm,
      DefaultModal
    },
    data() {
      return {
        saleTitle: SALE_TITLE,
        startTime: '',
        endTime: '',
        page: 1,
        delId: 0,
        classifyIndex: 0,
        choeesGoods: [],
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
        goodsPage: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        parentId: 0,
        keyword: '',
        selectGoods: [], // 单次选择的商品
        selectGoodsId: [], // 所有选择的商品id
        goodsDelId: 0,
        goodsDelIndex: 0,
        selectDelId: [],
        goodsList: []
      }
    },
    computed: {
      ...saleComputed,
    },
    created() {
      this._getFirstAssortment()
    },
    methods: {
      ...saleMethods,
      addPage(page) {
        this.page = page
        this.getSaleList({
          page: this.page,
          startTime: this.startTime,
          endTime: this.endTime,
          status: this.status,
          loading: false
        })
      },
      _deleteActivity(id) {
        this.delId = id
        this.$refs.confirm.show('确定删除该活动？')
      },
      async _sureConfirm() {
        let res = await API.Sale.saleDelete(this.delId)

        if (res.error !== this.$ERR_OK) {
          this.$toast.show(res.message)
          return
        } else {
          this.$toast.show('删除成功')
        }
        this.getSaleStatus()
        this.getSaleList({
          page: this.page,
          startTime: this.startTime,
          endTime: this.endTime,
          status: this.status,
          loading: false
        })
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
        this.choeesGoods = res.data.map((item, index) => {
          item.selected = 0
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
          item.trade_price = ''
          item.sort = 0
          return item
        })
      },
      // 获取分页商品列表
      async _getMoreGoods(page) {
        this.page = page
        await this._getGoodsList()
      },
      // 选择一级分类
      async _secondAssortment(item) {
        this.parentId = item.id
        if (item.id === '') {
          this.secondAssortment.data = []
        } else {
          let res = await API.Product.getCategory({parent_id: this.parentId, get_goods_count: 1})
          this.$loading.hide()
          this.secondAssortment.data = res.error === this.$ERR_OK ? res.data : []
          this.secondAssortment.data.unshift({name: '全部', id: this.parentId})
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
        let res = await API.Product.getCategory({parent_id: this.parentId, get_goods_count: 1})
        this.$loading.hide()
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
        if (item.usable_stock <= 0) {
          this.$toast.show('该商品库存为0，不能选择')
          return
        }
        switch (item.selected) {
        case 0:
          if (this.selectGoodsId.length === 10) {
            this.$toast.show('选择商品数量不能超过10个')
            return
          }
          this.choeesGoods[index].selected = 2
          item.all_stock = item.usable_stock
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
      // 单个添加
      _additionOne(item, index) {
        if (item.usable_stock <= 0) {
          this.$toast.show('该商品库存为0，不能选择')
          return
        }
        if (item.selected === 1) {
          return
        }
        if (this.selectGoodsId.length === 10 && item.selected !== 2) {
          this.$toast.show('选择商品数量不能超过10个')
          return
        }
        if (item.selected !== 2) this.selectGoodsId.push(item.id)
        this.choeesGoods[index].selected = 1
        item.all_stock = item.usable_stock
        this.goodsList.push(item)
        this.choeesGoods.forEach((item) => {
          if (item.selected === 1) {
            let idx = this.selectGoods.findIndex((child) => child.id === item.id)
            if (idx !== -1) {
              this.selectGoods.splice(idx, 1)
            }
          }
        })
      },
      // 批量添加
      _batchAddition() {
        this.choeesGoods = this.choeesGoods.map((item) => {
          item.selected = item.selected === 2 ? 1 : item.selected
          return item
        })
        this.goodsList = this.goodsList.concat(this.selectGoods)
        this.selectGoods = []
        this._hideGoods()
      },
      async _showGoods() {
        await this._getGoodsList()
        // 展示添加商品弹窗
        this.$refs.goodsModel.showModal()
      },
      _hideGoods() {
        this.$refs.goodsModel.hideModal()
      },
      // 切换分类
      _setClassify(index, item) {
        this.classifyIndex = index
      },
    }
  }
</script>

<style scoped lang="stylus"  rel="stylesheet/stylus">
  @import "~@design"
  .data-content
    flex: 1
    display: flex
    flex-direction: column
  .list-box
    .list-item:last-child
      max-width: 30px
      padding-right: 0
  .list
    flex: 1
    .list-item
      font-size: $font-size-14
      &:last-child
        max-width: 30px
        padding-right: 0
      .item
        text-overflow: ellipsis
        overflow: hidden
        white-space: nowrap
        font-size: 14px
      .status-item:before
        content: ""
        display: inline-block
        width: 9px
        height: 9px
        border-radius: 50%
        margin-right: 6px
        background: $color-negative
      .status-fail:before
        background: #E1E1E1
      .status-success:before
        background: $color-positive
      .list-double-row
        .item-sub
          color: #333
  .btn-main
    margin-right: 10px
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
    .shade-tab
      height: 48px
      box-sizing: border-box
      display: flex
      .tab-item
        margin-right: 10px
    .goods-content
      border-radius: 4px
      height: 420px
      .rush-goods-list
        flex-wrap: wrap
        display: flex
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
          flex: 1
          display: flex
          color: $color-text-main
          font-family: $font-family-regular
          justify-content: space-between
          height: 100%
          align-items: center
          .goods-name
            width: 500px
            no-wrap()
          .goods-name, .goods-money
            line-height: 1
          .goods-money
            flex: 1
            layout(row)
            .goods-money-text
              width: 50%
        .add-btn
          border-radius: 2px
          margin-left: 88px
          padding: 7px 0
          min-width: 54px
          text-align: center
        .add-btn-disable
          border-radius: 2px
          margin-left: 88px
          padding: 7px 0
          box-sizing: border-box
          text-align: center
          font-size: $font-size-14
          line-height: 1
          cursor: not-allowed
          background: $color-line
          color: $color-text-assist
          border: none
    .page-box
      box-sizing: border-box
      height: 76px
      align-items: center
      display: flex
</style>
