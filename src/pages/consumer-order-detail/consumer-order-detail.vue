<template>
  <div class="consumer-order-detail detail-content">
    <div class="identification">
      <div class="identification-page">
        <img src="./icon-order_repair@2x.png" class="identification-icon">
        <p class="identification-name">补录订单</p>
      </div>
    </div>
    <div class="content-header">
      <div class="content-title">基本信息</div>
    </div>
    <div class="rush-time">
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          补货对象
        </div>
        <div class="edit-input-box">
          <base-drop-down :width="400" :height="40" :select="consumer" @setValue="_selectConsumer"></base-drop-down>
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          会员手机号
        </div>
        <div class="edit-input-box">
          <input v-model="msg.mobile" type="text" placeholder="请输入" class="edit-input" :class="{'disable-input': disable}">
          <span class="btn-text">定位社区</span>
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          微信昵称
        </div>
        <div class="edit-input-box">
          <span class="tip" :class="{'tip-text': true}">输入会员手机点击定位社区</span>
          <input v-model="msg.wechat_name" type="text" placeholder="请输入" class="edit-input" :class="{'disable-input': disable}">
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          所属社区
        </div>
        <div class="edit-input-box">
          <base-drop-down :width="400" :height="40" :select="community" @setValue="_selectConsumer"></base-drop-down>
        </div>
      </div>
    </div>

    <div class="content-header">
      <div class="content-title">商品信息</div>
    </div>
    <div class="activity-box">
      <div class="activity-list">
        <div class="activity-tab">
          <div :class="{'disable': disable}" class="add-goods-btn hand" @click="_showGoods">
            <img class="icon" src="./icon-add@2x.png" alt="">
            添加商品
          </div>
          <!--<div class="remind">商品数量一共可添加({{goodsList.length}}/{{personAllBuyLimit}})个</div>-->
        </div>
        <div v-if="goodsList.length" class="rush-list-box">
          <div class="commodities-list-header com-list-box commodities-list-top">
            <div v-for="(item, index) in commodities" :key="index" class="com-list-item">{{item}}</div>
          </div>
          <div class="big-box">
            <div v-for="(item, index) in goodsList" :key="index" class="com-list-box com-list-content">
              <div class="com-list-item">{{item.name}}</div>

              <div class="com-list-item">
                <input v-model="item.usable_stock" :readonly="disable" type="number" class="com-edit com-edit-small" @input="echangBase(item, index)">
              </div>
              <div class="com-list-item">
                <span :class="{'list-operation-disable': disable}" class="list-operation" @click="_showDelGoods(item, index)">删除</span>
              </div>
            </div>
          </div>
        </div>

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
                  <div class="goods-money-text">¥{{item.trade_price}}</div>
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
    <!--确定取消弹窗-->
    <default-confirm ref="confirm" @confirm="_delGoods"></default-confirm>
    <div class="back">
      <div class="back-cancel back-btn hand" @click="_back">取消</div>
      <div :class="{'btn-disable': disable}" class="back-btn back-submit hand" @click="_saveActivity">保存</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import {merchantOrderComputed, merchantOrderMethods} from '@state/helpers'
  import API from '@api'
  import {objDeepCopy} from '@utils/common'

  const PAGE_NAME = 'CONSUMER_ORDER_DETAIL'
  const TITLE = '新建补录订单'

  const COMMODITIES_LIST = [
    '商品名称',
    '单位',
    '销售价(元)',
    '销量',
    '抢购价(元)',
    '每人限购',
    '商品库存',
    '活动库存',
    '排序',
    '操作'
  ]

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultModal,
      DefaultConfirm
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        classifyIndex: 0,
        id: null,
        page: 1,
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
        consumer: {
          check: false,
          show: false,
          content: '全部商品',
          type: 'default',
          data: [{name: '选择补货对象', id: 1}, {name: '指定消费者', id: 2}, {name: '给团长分配', id: 3}] // 格式：{title: '55'}}
        },
        community: {
          check: false,
          show: false,
          content: '全部商品',
          type: 'default',
          data: [{name: '广海花园社区', id: 1}] // 格式：{title: '55'}}
        },
        parentId: '',
        keyword: '',
        selectGoods: [], // 单次选择的商品
        selectGoodsId: [], // 所有选择的商品id
        goodsDelId: 0,
        goodsDelIndex: 0,
        selectDelId: [],
        disable: false,
        goodsList: [],
        msg: {

        },
        isSubmit: false,
        activityTheme: '',
        pageConfig: {}
      }
    },

    computed: {
      ...merchantOrderComputed,
      testName() {
        return this.msg.activity_name
      },
      testStartTime() {
        return this.msg.start_at
      },
      testStartDate() {
        // 开始时间规则判断
        return Date.parse('' + this.msg.start_at.replace(/-/g, '/')) > new Date() - 360000
      },
      testEndTime() {
        return this.msg.end_at
      },
      testEndTimeReg() {
        // 结束时间规则判断
        return Date.parse('' + this.msg.end_at.replace(/-/g, '/')) > Date.parse('' + this.msg.start_at.replace(/-/g, '/'))
      }
    },
    created() {
      this.id = +this.$route.params.id
      this._getFirstAssortment()
    },
    methods: {
      ...merchantOrderMethods,
      _selectConsumer(item) {
        this.msg.consumer = item.id
      },
      // 选择商品
      async _getGoodsList() {
        // if (!this.id) return
        let res = await API.Sale.getGoodsList({
          is_online: 1,
          keyword: this.keyword,
          goods_category_id: this.parentId,
          shelf_id: this.id,
          limit: 7,
          page: this.page,
          activity_theme: this.$route.query.activity_theme
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
          // if (this.selectGoodsId.length === 20) {
          //   this.$toast.show(`选择商品数量不能超过${this.personAllBuyLimit}个`)
          //   return
          // }
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
      // 删除商品
      _showDelGoods(item, index) {
        if (this.disable) {
          return
        }
        this.goodsDelId = item.goods_id
        this.goodsDelIndex = index
        this.$refs.confirm.show('是否确定删除该商品？')
      },
      // 删除商品弹窗
      _delGoods() {
        // let index = this.selectGoodsId.findIndex((item) => item === this.goodsDelId)
        this.selectGoodsId.splice(this.goodsDelIndex, 1)
        this.goodsList.splice(this.goodsDelIndex, 1)
        this.selectDelId.push(this.goodsDelId)
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
      // 单个添加
      _additionOne(item, index) {
        if (item.usable_stock <= 0) {
          this.$toast.show('该商品库存为0，不能选择')
          return
        }
        if (item.selected === 1) {
          return
        }
        // if (this.selectGoodsId.length === this.personAllBuyLimit && item.selected !== 2) {
        //   this.$toast.show(`选择商品数量不能超过${this.personAllBuyLimit}个`)
        //   return
        // }
        if (item.selected !== 2) this.selectGoodsId.push(item.id)
        this.choeesGoods[index].selected = 1
        let goodsItem = objDeepCopy(item)
        goodsItem.all_stock = item.usable_stock
        goodsItem.usable_stock = ''
        goodsItem.trade_price_show = item.trade_price
        if (this.activityTheme !== 'hot_tag') {
          goodsItem.trade_price = ''
        }
        this.goodsList.push(goodsItem)
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
        // const list = objDeepCopy(this.choeesGoods)
        this.selectGoods = this.selectGoods.map((item) => {
          item.selected = item.selected === 2 ? 1 : item.selected
          item.usable_stock = ''
          item.trade_price_show = item.trade_price
          if (this.activityTheme !== 'hot_tag') {
            item.trade_price = ''
          }
          return item
        })
        this.goodsList = this.goodsList.concat(this.selectGoods)
        this.selectGoods = []
        this._hideGoods()
      },
      async _showGoods() {
        if (this.disable) {
          return
        }
        await this._getGoodsList()
        // 展示添加商品弹窗
        this.$refs.goodsModel && this.$refs.goodsModel.showModal()
      },
      _hideGoods() {
        this.$refs.goodsModel.hideModal()
      },
      // 切换分类
      _setClassify(index, item) {
        this.classifyIndex = index
      },
      _back() {
        this.$router.back()
      },
      //  保存
      async _saveActivity() {
        if (this.disable || this.isSubmit) return
        let checkForm = this.checkForm()
        if (!checkForm) return
        let list = this.goodsList
        if (!list.length) {
          this.$toast.show('请添加商品')
          return
        }

        list.map((item) => {
          delete item.person_day_buy_limit
          item.goods_id = item.id || item.goods_id
        })
        let data = Object.assign({}, this.msg, {activity_goods: list, activity_theme: this.$route.query.activity_theme})
        let res = null
        this.isSubmit = true
        res = await API.Sale.storeSale(data, true)
        this.$loading.hide()
        this.$toast.show(res.message)
        if (res.error !== this.$ERR_OK) {
          this.isSubmit = false
          return
        }
        setTimeout(() => {
          this._back()
        }, 1000)
      },
      checkForm() {
        let arr = [
          {value: this.testName, txt: '请输入活动名称'},
          {value: this.testStartTime, txt: '请选择活动开始时间'},
          // {value: this.testStartDate, txt: '活动开始时间必须大于等于当前时间'},
          {value: this.testEndTime, txt: '请选择活动结束时间'}
          // {value: this.testEndTimeReg, txt: '活动结束时间必须大于开始时间'}
        ]
        for (let i = 0, j = arr.length; i < j; i++) {
          if (!arr[i].value) {
            this.$toast.show(arr[i].txt)
            return false
          }
          if (i === j - 1 && arr[i].value) {
            return true
          }
        }
      },
      echangBase(item, index) {
        if (item.usable_stock > item.all_stock && !this.disable) {
          item.usable_stock = item.all_stock
          this.$forceUpdate()
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/detail"

  .consumer-order-detail
    padding-bottom: 20px
    position: relative
    flex: 1
    font-family: $font-family-regular
    font-size: $font-size-14
  .rush-time
    margin-bottom: 27px
  .edit-item
    display: flex
    color: #2A2A2A
    margin-top: 24px
    align-items: center
    position: relative
    .edit-title
      font-size: $font-size-14
      font-family: $font-family-regular
      white-space: nowrap
      text-align: left
      min-width: 64px
    .start
      display: inline-block
      margin-right: -2px
      color: #F52424
    .edit-input-box
      margin: 0 14px 0 40px
      &:nth-child(4)
        margin: 0 14px
      .edit-input
        font-size: $font-size-12
        border-radius: 2px
        padding: 0 14px
        width: 400px
        height: 40px
        display: flex
        align-items: center
        justify-content: space-between
        font-family: $font-family-regular
        color: $color-text-main
        border: 1px solid $color-line
        transition: all 0.3s
        &:hover
          border-color: #ACACAC
        &:focus
          border-color: $color-main
        .edit-time
          color: $color-text-assist
          font-family: $font-family-regular
          font-size: $font-size-12
      .disable-input
        background: #F5F5F5
        color: #ACACAC
    .edit-input-right
      margin-left: 14px
    .tip
      line-height: 40px
      font-size: $font-size-12
      font-family: $font-family-regular
      color: $color-text-main
    .tip-text
      margin-left: 2px
      line-height: 40px
      font-size: $font-size-12
      font-family: $font-family-regular
      color: $color-text-assist
</style>
