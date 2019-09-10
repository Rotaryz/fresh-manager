<template>
  <div class="edit-commodity detail-content">
    <div class="identification">
      <div class="identification-page">
        <img src="./icon-new_commodity@2x.png" class="identification-icon">
        <p class="identification-name">{{id ? '编辑' : '新建'}}兑换券</p>
      </div>
    </div>
    <div class="leader-box">
      <!-- 时间-->
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          用券时间
        </div>
        <div class="wrap">
          <div class="time-select">
            <date-picker
              :value="commodity.start_at"
              class="edit-input-box"
              type="date"
              :confirm="false"
              :editable="false"
              placement="bottom-end"
              placeholder="选择开始时间"
              style="width: 240px;height: 40px;border-radius: 1px"
              @on-change="getStartTime"
            ></date-picker>
            <div class="tip-text">至</div>
            <date-picker
              :value="commodity.end_at"
              class="edit-input-box edit-input-right"
              type="date"
              :confirm="false"
              :editable="false"
              placement="bottom-end"
              placeholder="选择结束时间"
              style="width: 240px;height: 40px"
              @on-change="getEndTime"
            ></date-picker>
          </div>
        </div>
        <div :class="{'text-no-change': id}"></div>
      </div>
      <!--使用说明-->
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          使用说明
        </div>
        <div class="edit-input-box">
          <div class="no-wrap">
            <textarea v-model="commodity.description"
                      type="text"
                      class="edit-input edit-textarea"
                      :readonly="id"
                      :disabled="id"
                      maxlength="50"
                      :class="{'disable-input': id}"
                      placeholder="例如：全场商品通用或特惠商品不可以使用"
            >
            </textarea>
          </div>
          <div class="textarea-num">{{commodity.description ? commodity.description.length : 0}}/50</div>
        </div>
        <div :class="{'text-no-change': id}"></div>
      </div>
      <!--兑换类型-->
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          兑换类型
        </div>
        <section class="gift-choose-target-wrapper">
          <article class="g-top">
            <span
              :class="{'radio-disable': id}"
              @click="updateData('chooseType', 'free')"
            ><i
              :class="{active: chooseType === 'free'}"
              class="circle"
            ></i>无门槛兑换券</span>
            <span
              :class="{'radio-disable': id}"
              @click="updateData('chooseType', 'fitGift')"
            ><i
              class="circle"
              :class="{active: chooseType === 'fitGift'}"
            ></i>满赠兑换券</span>
          </article>
        </section>
      </div>
      <!--兑换券金额-->
      <div v-show="chooseType === 'fitGift'" class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          兑换券金额
        </div>
        <div class="edit-input-box">
          <input v-model="commodity.condition"
                 type="number"
                 class="edit-input"
                 :disabled="id"
                 @mousewheel.native.prevent
          >
        </div>
        <div :class="{'text-no-change': id}"></div>
        <span class="edit-explain">元可使用</span>
      </div>
      <!-- add goods -->
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          添加商品
        </div>
        <article style="margin-left: 40.9px; width: 989px">
          <div class="add-box">
            <div class="btn-main" :class="{'btn-disable': id}" @click="_showGoods"><span class="add-icon"></span>添加</div>
            <div class="add-tip">(只能选择一个商品)</div>
          </div>
          <div v-if="goodsItem.length" class="big-list">
            <div class="list-header list-box">
              <div v-for="(item, idx) in tableTitle" :key="idx" class="list-item">{{item}}</div>
            </div>
            <div class="list">
              <div v-for="(item, index) in goodsItem" :key="item.id" class="list-content list-box">
                <div class="list-item">
                  <img :src="item.goods_cover_image" class="pic-box">
                </div>
                <div class="list-item">{{item.name}}</div>
                <div class="list-item">{{item.sale_unit || item.goods_units}}</div>
                <div class="list-item">{{item.trade_price}}</div>
                <div class="list-item">{{item.usable_stock}}</div>
                <div class="list-item">
                  <div class="list-operation" :class="{'list-operation-disable': id}" @click="showDel(index)">删除</div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
      <!--名称-->
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          兑换券别名
        </div>
        <div class="edit-input-box">
          <input v-model="commodity.coupon_name"
                 type="text"
                 class="edit-input"
                 :disabled="id"
                 maxlength="20"
                 placeholder="例:进口白肉火龙果2个/份"
                 @mousewheel.native.prevent
          >
          <div class="num">{{commodity.coupon_name ? commodity.coupon_name.length : 0}}/20</div>
        </div>
        <div :class="{'text-no-change': id}"></div>
      </div>
      <!-- 数量-->
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          发放总量
        </div>
        <div class="edit-input-box">
          <input v-model="commodity.usable_stock"
                 type="tel"
                 maxlength="5"
                 class="edit-input"
                 :disabled="id"
                 placeholder="发放数量应设为1~99999之间的整数"
                 @mousewheel.native.prevent
          >
        </div>
        <div :class="{'text-no-change': id}"></div>
        <span class="edit-explain">张</span>
      </div>
    </div>
    <!--商品弹窗-->
    <default-modal ref="goods">
      <div slot="content" class="shade-box">
        <div class="title-box">
          <div class="title">
            选择商品
          </div>
          <span class="close hand" @click="_hideGoods"></span>
        </div>
        <!--商品详情-->
        <div>
          <div class="shade-tab">
            <div class="tab-item">
              <base-drop-down :width="218" :select="assortment" @setValue="_secondAssortment"></base-drop-down>
            </div>
            <div class="tab-item">
              <base-drop-down :width="218" :select="secondAssortment" @setValue="_choessSecondAssortment"></base-drop-down>
            </div>
            <div class="tab-item">
              <base-search placeHolder="请输入商品名称或编码" @search="_searchGoods"></base-search>
            </div>
          </div>
          <div class="goods-content">
            <div class="goods-title">
              <div v-for="(item, index) in goodsTitle" :key="index" class="title-item" :style="{flex: item.flex}">{{item.name}}</div>
            </div>
            <div class="goods-list" :class="{'goods-list-border':choiceGoods.length}">
              <div v-for="(item, index) in choiceGoods" :key="index" class="goods-item">
                <div v-for="(title, ind) in goodsTitle" :key="ind" class="item-content hand" :style="{flex: title.flex}" @click="_selectGoods(item,index)">
                  <span v-if="title.value === 'name'" class="select-icon" :class="{'select-icon-active': +showSelectIndex === index}"></span>
                  <img v-if="title.value === 'name'" class="goods-img" :src="item.goods_cover_image">
                  <div class="value">
                    <p class="text">{{title.value === 'trade_price' ? '¥' : ''}}{{item[title.value]}}{{title.value === 'usable_stock' ? item.sale_unit : ''}}</p>
                    <p v-if="title.value === 'name'" class="text">{{item.goods_sku_encoding}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="page-box">
            <base-pagination ref="goodsPage" :pageDetail="goodsPage" @addPage="_getMoreGoods"></base-pagination>
          </div>
        </div>
        <div class="back back-box">
          <div class="back-cancel back-btn hand" @click="_hideGoods">取消</div>
          <div class="back-btn back-submit hand" @click="_miniGoods">确定</div>
        </div>
      </div>
    </default-modal>
    <!--按钮-->
    <div class="back">
      <div class="back-cancel back-btn hand" @click="back">返回</div>
      <div class="back-btn back-submit" :class="{'btn-disable': id}" @click="submit">保存</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {DatePicker} from 'iview'
  import DefaultModal from '@components/default-modal/default-modal'
  import API from '@api'
  import _ from 'lodash'
  import {couponComputed, couponMethods} from '@state/helpers'
  import {REG_MONEY} from '@utils/common'

  const PAGE_NAME = 'EDIT_COMMODITY'
  const TITLE = '新建兑换券'
  const TABLE_TITLE = ['图片', '商品名称', '单位', '售价(元)', '库存', '操作']
  const GOODS_POP_TITLE = [
    {name: '商品', flex: 2.5, value: 'name'},
    {name: '销售价', flex: 0.9, value: 'trade_price'},
    {name: '可用库存', flex: 0.9, value: 'usable_stock'}
  ]

  const TAG_TYPE = {1: 'free', 2: 'fitGift'}
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DatePicker,
      DefaultModal
    },
    data() {
      return {
        id: this.$route.query.id,
        tableTitle: TABLE_TITLE,
        goodsTitle: GOODS_POP_TITLE,
        commodity: {
          coupon_name: '',
          preferential_type: 2,
          denomination: '0', // 优惠券面额
          condition: 0, // 满多少可用
          support_activity: 1, // 是否支持活动商品使用0 1
          start_at: '',
          end_at: '',
          range_type: 3, // 适用范围0未知1通用券2品类券3单品券
          ranges: [],
          exchange_goods: [],
          limit_days: 0,
          is_day_limited: 0,
          description: '',
          tag_type: 1,
          validity_type: 1,
          usable_stock: '',
          money: ''
        },
        text: '',
        isSubmit: true,
        goodsPage: {total: 1, per_page: 10, total_page: 1},
        choiceGoods: [],
        choicePage: 1,
        goodsItem: [],
        showSelectIndex: -1,
        parentId: '',
        goodsCate: [],
        assortment: {check: false, show: false, content: '一级类目', type: 'default', data: []}, // 格式：{title: '55'
        secondAssortment: {check: false, show: false, content: '二级类目', type: 'default', data: []}, // 格式：{title: '55'}}
        selectItem: {},
        chooseType: 'free'
      }
    },
    computed: {
      ...couponComputed,
      testEndDate() {
        // 结束时间规则判断
        return (
          Date.parse(this.commodity.end_at.replace(/-/g, '/') + ' 00:00') >
          Date.parse('' + this.commodity.start_at.replace(/-/g, '/') + ' 00:00')
        )
      },
      testGoods() {
        // 判断是否选择商品
        return this.goodsItem.length
      },
      textDenomination() {
        let value = /^[0-9]+$/.test(this.commodity.denomination)
        return value
      },
      textUsableStock() {
        let bigNum = 99999
        if (this.commodity.usable_stock > 0 && this.commodity.usable_stock <= bigNum) {
          let value = /^[0-9]+$/.test(this.commodity.usable_stock)
          return value
        }
        return false
      },
      testCardType() {
        if (this.chooseType === 'free') {
          return true
        } else {
          return REG_MONEY.test(this.commodity.condition)
        }
      }
    },
    async created() {
      if (this.id) {
        let obj = _.cloneDeep(this.couponDetail)
        this.commodity = obj
        // this.goodsItem = obj.ranges
        this.goodsItem = obj.exchange_goods
        this.chooseType = TAG_TYPE[obj.tag_type]
      }
      await this._getFirstAssortment()
    },
    methods: {
      ...couponMethods,
      updateData(key, value) {
        if (this.id > 0) return
        this[key] = value
      },
      getStartTime(time) {
        this.commodity.start_at = time
      },
      getEndTime(time) {
        this.commodity.end_at = time
      },
      showDel(index) {
        if (this.id) {
          return
        }
        this.goodsItem.splice(index, 1)
        this.commodity.ranges = []
        this.commodity.exchange_goods = []
      },
      back() {
        this.$router.back()
      },
      checkForm() {
        let arr = [
          {value: this.commodity.start_at, txt: '请选择活动开始时间'},
          {value: this.commodity.end_at, txt: '请选择活动结束时间'},
          {value: this.testEndDate, txt: '结束时间必须大于开始时间'},
          {value: this.commodity.description, txt: '请输入使用说明'},
          {value: this.testCardType, txt: '请输入正确的兑换券金额'},
          {value: this.testGoods, txt: '请选择商品'},
          {
            value: this.commodity.coupon_name && this.commodity.coupon_name.length <= 20,
            txt: '请按要求输入兑换券别名(20字以内)'
          },
          {value: this.commodity.usable_stock, txt: '请输入发放总量'},
          {value: this.textUsableStock, txt: `发放数量应设为1~99999之间的整数`}
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
      _formatSubmitData() {
        let tagType = 1
        for (let [key, value] of Object.entries(TAG_TYPE)) {
          if (this.chooseType === value) {
            tagType = key
          }
        }
        this.commodity.tag_type = tagType
      },
      async submit() {
        if (this.id || !this.isSubmit) return
        if (!this.checkForm()) return
        this._formatSubmitData()
        this.isSubmit = false
        let res = await API.Coupon.storeCoupon(this.commodity, true)
        this.$loading.hide()
        this.$toast.show(res.message)
        if (res.error !== this.$ERR_OK) {
          this.isSubmit = true
          return
        }
        setTimeout(() => {
          this.back()
        }, 1000)
      },
      // 获取商品列表
      async _getGoodsList(loading = true) {
        let res = await API.Coupon.getGoodsList(
          {
            is_online: 1,
            keyword: this.text,
            goods_category_id: this.parentId,
            page: this.choicePage,
            limit: 6
          },
          loading
        )
        this.$loading.hide()
        if (res.error !== this.$ERR_OK) {
          return
        }
        this.goodsPage = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        this.choiceGoods = res.data
        this.showSelectIndex = this.choiceGoods.findIndex(
          (item) => item.id === (this.goodsItem[0] && this.goodsItem[0].id)
        )
      },
      // 弹窗确定选择链接
      async _miniGoods() {
        if (!this.selectItem.id) {
          this.$toast.show('请选择商品')
          return
        }
        this.goodsItem = [this.selectItem]
        this.commodity.ranges[0] = {range_id: this.goodsItem[0].id, coupon_range_id: 0}
        this.commodity.exchange_goods[0] = {goods_id: this.goodsItem[0].id, echange_id: 0}

        // 满赠添加
        // if (!this.commodity.exchange_goods) {
        //   this.commodity.exchange_goods = []
        //   this.commodity.exchange_goods.push(
        //     {
        //       goods_id: this.goodsItem[0].id,
        //       echange_id: 0
        //     }
        //   )
        // }
        this.commodity.coupon_name = this.selectItem.name
        this._hideGoods()
      },
      // 获取分页商品列表
      async _getMoreGoods(page) {
        this.choicePage = page
        await this._getGoodsList()
      },
      async _secondAssortment(item) {
        this.parentId = item.id
        if (item.id === '') {
          this.secondAssortment.data = []
        } else {
          let res = await API.Outreach.goodsCategory({parent_id: this.parentId})
          this.secondAssortment.data = res.error === this.$ERR_OK ? res.data : []
        }
        this.secondAssortment.data.unshift({name: '全部', id: this.parentId})
        this.secondAssortment.content = '二级类目'
        this.choicePage = 1
        this.$refs.goodsPage.beginPage()
        await this._getGoodsList()
      },
      // 选择二级类目
      async _choessSecondAssortment(item) {
        this.parentId = item.id
        this.choicePage = 1
        this.$refs.goodsPage.beginPage()
        await this._getGoodsList()
      },
      // 获取一级类目
      async _getFirstAssortment() {
        let res = await API.Outreach.goodsCategory({parent_id: this.parentId})
        this.goodsCate = res.error === this.$ERR_OK ? _.cloneDeep(res.data) : []
        this.assortment.data = res.error === this.$ERR_OK ? res.data : []
        this.assortment.data.unshift({name: '全部', id: ''})
      },
      // 隐藏商品弹窗
      _hideGoods() {
        this.showSelectIndex = -1
        this.selectItem = {}
        this.text = ''
        this.choicePage = 1
        this.$refs.goods.hideModal()
      },
      async _showGoods() {
        if (this.id) {
          return
        }
        // if (this.commodity.ranges.length) {
        //   this.showSelectIndex = this.choiceGoods.findIndex((item) => item.id === this.commodity.ranges[0].range_id)
        // }
        if (this.commodity.exchange_goods.length) {
          this.showSelectIndex = this.choiceGoods.findIndex(
            (item) => item.id === this.commodity.exchange_goods[0].range_id
          )
        }
        await this._getGoodsList(false)
        this.$refs.goods.showModal()
      },
      // 搜索商品
      async _searchGoods(text) {
        this.statusTab = 4
        this.text = text
        this.choicePage = 1
        this.$refs.goodsPage.beginPage()
        await this._getGoodsList()
      },
      // 选择商品
      _selectGoods(item, index) {
        this.showSelectIndex = index
        this.selectItem = item
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/detail"


  .gift-choose-target-wrapper
    position: relative
    margin-left :40.9px
    padding-top 6px
    .g-top
      display:flex
      & > span
        display :flex
        align-items :center
        margin-right :58px
        cursor :pointer
        &.radio-disable
          cursor: default
      & >>> .circle
        width: 18px
        height: @width
        border: 1px solid #E1E1E1;
        border-radius: 50%
        margin-right:6px
        transition: all 0.3s
        display: inline-block
        &.active
          border: 5px solid #4DBD65;

  .edit-commodity
    width: 100%
  .add-box
    display: flex
    align-items: center
    padding-top :4.5px
    padding-bottom :20px
    .add-icon
      margin-right: 4px
      margin-left: 0
    .add-tip
      color: $color-text-assist
      font-size: $font-size-14
      margin-left: 10px
  .list-box
    .list-item
      font-size: $font-size-14
      .pic-box
        width: 40px
        height: 40px
        object-fit: cover
      &:last-child
        padding: 0
        max-width: 50px
      &:nth-child(2)
        flex: 3
      &:nth-child(1)
        max-width: 100px
        min-width: 100px
  .big-list
    margin-bottom: 0
  .leader-box
    padding: 0 20px
    box-sizing: border-box
    margin-bottom: 35px
    .edit-item
      position: relative
      display: flex
      color: #2A2A2A
      min-height: 40px
      margin-top: 24px
      .edit-explain
        line-height: 40px
        height: 40px
        padding-left: 10px
      .edit-title
        margin-top: 7.5px
        font-size: $font-size-14
        font-family: $font-family-regular
        white-space: nowrap
        text-align: right
        width: 80px
      .start
        display: inline-block
        margin-right: -2px
        color: #F52424
      .edit-input-box
        margin-left: 40.9px
        position: relative
        .edit-show
          line-height: 40px
          border: none
      .edit-input
        position: relative
        font-size: $font-size-14
        padding: 0 14px
        border-radius: 2px
        width: 400px
        height: 40px
        border: 0.5px solid $color-line
        transition: all 0.3s
        box-sizing: border-box
        &::-webkit-inner-spin-button
          appearance: none
        &:hover
          border: 0.5px solid #ACACAC
        &::placeholder
          font-family: $font-family-regular
          color: $color-text-assist
        &:focus
          border-color: $color-main !important
      .edit-textarea
        height: 94px
        resize: none
        padding: 4px 14px
      .disable-input
        background: #F5F5F5
        color: #ACACAC
      .edit-text
        font-size: $font-size-14
        padding: 10px 14px
        border-radius: 2px
        width: 400px
        height: 70px
        border: 0.5px solid $color-line
        transition: all 0.3s
        resize: none
        outline: none
        &:hover
          border: 1px solid #ACACAC
        &::placeholder
          font-family: $font-family-regular
          color: $color-text-assist
        &:focus
          border-color: $color-main !important
      .edit-msg
        line-height: 40px
        font-size: $font-size-14
        color: #acacac
        margin-left: 10px
      .edit-unit
        line-height: 40px
        font-size: $font-size-14
        color: $color-text-main
        margin-left: 10px
  .wrap
    .time-select
      display: flex
      align-items: center
      margin: 0
    .select-item
      margin-top: 20px
      margin-left: 40px
      display: flex
      align-items: center
    .day-item
      width: 138px
      height: 34px
      box-sizing: border-box
      padding: 0 10px
      margin: 0 14px 0 10px
      border: 1px solid $color-line
    .tip-text
      margin: 0 12px 0 14px
    .edit-input-right
      margin-left: 0 !important

  .time-no-change, .text-no-change, .check-no-change
    position: absolute
    left: 127px
    top: 0
    width: 100%
    height: 100%
    z-index: 100
  .text-no-change
    cursor: not-allowed
  .textarea-num
    position: absolute
    left: 360px
    bottom: 6px
    color: $color-text-assist
  .num
    col-center()
    right: 20px
    color: #ACACAC

  //  商品弹窗
  .shade-box
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
    border-radius: 2px
    background: $color-white
    height: 662px
    max-width: 1000px
    width: 1000px
    position: relative
    overflow-x: hidden
    overflow-y: auto
    flex-wrap: wrap
    padding: 0 20px
    .shade-tab
      margin-bottom: 20px
      align-items: center
      box-sizing: border-box
      display: flex
      .tab-item
        margin-right: 10px
    .page-box
      box-sizing: border-box
      height: 76px
      align-items: center
      display: flex

  .goods-content
    border-radius: 4px
    height: 405px
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
      margin: 0
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
        &:nth-child(2n)
          background: #f5f7fa
        .item-content
          padding-right: 20px
          display: flex
          align-items: center
        .goods-img
          width: 40px
          margin-right: 10px
          height: @width
          overflow: hidden
          background-repeat: no-repeat
          background-size: cover
          background-position: center
          background-color: $color-background
        .value
          white-space: nowrap
          text-overflow: ellipsis
          overflow: hidden
          max-width: 285px
          .text
            overflow: hidden
            text-overflow: ellipsis

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
  .page-box
    padding: 0 20px
    box-sizing: border-box
    height: 77px
    align-items: center
    display: flex
  .back-box
    background: $color-white
    height: 70px
    border-top-1px($color-line)
    justify-content: flex-end
    position: absolute
    left: 0
    bottom: 0
  //  单选框
  .select-icon
    width: 16px
    height: 16px
    border-radius: 50%
    background: $color-white
    border: 1px solid $color-line
    transition: all, 0.3s
    position: relative
    transform-origin: 50%
    margin-right: 20px
  .select-icon-active
    border: 5px solid $color-main

</style>
