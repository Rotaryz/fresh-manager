<template>
  <div class="edit-rules detail-content">
    <div class="identification">
      <div class="identification-page">
        <img src="./icon-new_commodity@2x.png" class="identification-icon">
        <p class="identification-name">新建规则</p>
      </div>
      <div class="function-btn">
      </div>
    </div>

    <div class="msg-detail">
      <!--左侧轮播图-->
      <div class="left-view">
        <div class="top-content">
          <div class="wrapper">
            <swiper ref="swiper" :type="marketIndex" @bannerChange="bannerChange"></swiper>
          </div>
        </div>
        <div class="bottom">
          <ul class="pointer">
            <li v-for="(item, index) in arrowArr" :key="index" class="pointer-item" :class="{'active': arrowIndex === index}" @click="changeBanner(index)"></li>
            <li class="num">{{arrowIndex + 1}}/{{arrowArr.length}}</li>
          </ul>
          <p class="text">{{arrowArr[arrowIndex]}}</p>
        </div>
      </div>

      <!--右侧轮播图-->
      <div class="right-form">
        <p class="line-title">售后补偿</p>
        <div class="edit-box">
          <div class="edit-item">
            <div class="edit-title"><span class="start">*</span>规则名称</div>
            <div class="edit-content">
              <base-drop-down :width="400" :height="40" :select="stairSelect" @setValue="selectRules"></base-drop-down>
            </div>
          </div>

          <!--选择优惠券-->
          <div v-if="marketIndex !== 2" class="edit-item edit-list-item">
            <div class="edit-title">
              <span class="start">*</span>
              <span>选择优惠券</span>
            </div>
            <div class="edit-content">
              <div class="btn-main hand edit-select" :class="{'btn-disable-store': disable}" @click="showCouponModal('coupon')">选择<span class="add-icon"></span></div>
              <div v-if="couponSelectList.length" class="edit-list-box">
                <div class="list-title" :class="{'no-line': couponSelectList.length === 0}">
                  <div v-for="(item, index) in selectCouponTitle" :key="index" class="list-title-item" :style="{flex: item.flex}">{{item.name}}</div>

                </div>
                <div>
                  <div v-for="(item, index) in couponSelectList" :key="index" class="list">
                    <div v-for="(val, ind) in selectCouponTitle" :key="ind" class="list-item" :style="{flex: val.flex}">
                      <div v-if="val.value === 'time'" class="main">
                        <p v-if="+item.is_day_limited !== 1">{{item.start_at}}</p>
                        <p v-if="+item.is_day_limited !== 1">{{item.end_at}}</p>
                        <p v-if="+item.is_day_limited === 1">领取后{{item.limit_days}}天内有效</p>
                      </div>
                      <p v-else-if="val.value === ''" class="handle" :class="{'list-operation-disable': disable}" @click="showConfirm('coupon', index, item)">删除</p>
                      <p v-else-if="val.value === 'denomination'">{{item[val.value]}}{{+item.preferential_type === 1 ? '折' : '元'}}</p>
                      <p v-else class="main">{{item[val.value]}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <!--补偿条件-->
          <!--订单金额小于-->
          <div v-if="marketIndex === 2" class="edit-item edit-list-item">
            <div class="edit-title" style="margin-top: 10px">
              <span class="start">*</span>
              <span>补偿条件</span>
            </div>
            <div class="edit-content">
              <div class="edit-input-box">
                <div class="no-wrap">
                  <span>订单金额小于</span>
                  <input v-model="price"
                         type="number"
                         class="edit-input"
                         :readonly="disable"
                         maxlength="12"
                         :class="{'disable-input':disable}"
                  >
                  <span>元</span>
                </div>
              </div>
              <div class="btn-main hand edit-select" :class="{'btn-disable-store': disable}" @click="showCouponModal('less')">添加<span class="add-icon"></span></div>

              <div v-if="lessSelectList.length" class="edit-list-box">
                <div class="list-title" :class="{'no-line': lessSelectList.length === 0}">
                  <div v-for="(item, index) in selectCompensateCouponTitle" :key="index" class="list-title-item" :style="{flex: item.flex}">{{item.name}}</div>

                </div>
                <div>
                  <div v-for="(item, index) in lessSelectList" :key="index" class="list">
                    <div v-for="(val, ind) in selectCompensateCouponTitle" :key="ind" class="list-item" :style="{flex: val.flex}">
                      <p v-if="val.value === ''" class="handle" :class="{'list-operation-disable': disable}" @click="showConfirm('less', index, item)">删除</p>
                      <p v-else-if="val.value === 'denomination'">{{item[val.value]}}{{+item.preferential_type === 1 ? '折' : '元'}}</p>
                      <p v-else class="main">{{item[val.value]}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!--订单金额大于-->
          <div v-if="marketIndex === 2" class="edit-item edit-list-item">
            <div class="edit-title" style="margin-top: 10px">
              <span class="start">*</span>
              <span>补偿条件</span>
            </div>
            <div class="edit-content flex">
              <div class="edit-input-box">
                <div class="no-wrap">
                  <span>订单金额大于等于</span>
                  <input v-model="price"
                         type="number"
                         class="edit-input small-input"
                         :readonly="disable"
                         maxlength="12"
                         :class="{'disable-input':disable}"
                  >
                  <span>元</span>
                </div>
              </div>
              <div class="btn-main hand edit-select" :class="{'btn-disable-store': disable}" @click="showCouponModal('great')">添加<span class="add-icon"></span></div>

              <div v-if="greatSelectList.length" class="edit-list-box">
                <div class="list-title" :class="{'no-line': greatSelectList.length === 0}">
                  <div v-for="(item, index) in selectCompensateCouponTitle" :key="index" class="list-title-item" :style="{flex: item.flex}">{{item.name}}</div>

                </div>
                <div>
                  <div v-for="(item, index) in greatSelectList" :key="index" class="list">
                    <div v-for="(val, ind) in selectCompensateCouponTitle" :key="ind" class="list-item" :style="{flex: val.flex}">
                      <p v-if="val.value === ''" class="handle" :class="{'list-operation-disable': disable}" @click="showConfirm('great', index, item)">删除</p>
                      <p v-else-if="val.value === 'denomination'">{{item[val.value]}}{{+item.preferential_type === 1 ? '折' : '元'}}</p>
                      <p v-else class="main">{{item[val.value]}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="back">
      <div class="back-cancel back-btn hand" @click="cancel">取消</div>
      <div class="back-btn back-submit hand" :class="{'btn-disable': disable}" @click="additionGroup">确定</div>
    </div>
    <!-- 选择优惠券弹窗-->
    <default-modal ref="couponModal">
      <div slot="content" class="shade-box">
        <div class="title-box">
          <div class="title">
            选择优惠券
          </div>
          <span class="close hand" @click="cancelModal"></span>
        </div>
        <!--搜索-->
        <div class="shade-tab">
          <div class="tab-item">
            <base-search ref="couponSearch" placeHolder="请输入优惠券名称" @search="_searchData"></base-search>
          </div>
        </div>
        <!--列表-->
        <div class="group-content">
          <div class="title">
            <span v-for="(item, index) in couponTitle" :key="index" class="title-item" :style="{flex: item.flex}">{{item.name}}</span>
          </div>
          <div class="outreach-group-list">
            <div v-for="(item, index) in couponList" :key="index" class="group-item hand" @click="selectCoupon(item, index)">
              <div v-for="(val, ind) in couponTitle" :key="ind" class="title-item" :style="{flex: val.flex}">
                <span v-if="ind === 0" class="radio" :class="{'checked': (couponCheckItem.id && item.id === couponCheckItem.id)}"></span>
                <div v-else-if="val.value === 'time'" class="main">
                  <p v-if="+item.is_day_limited !== 1">{{item.start_at}}</p>
                  <p v-if="+item.is_day_limited !== 1">{{item.end_at}}</p>
                  <p v-if="+item.is_day_limited === 1">领取后{{item.limit_days}}天内有效</p>
                </div>
                <p v-else-if="val.value === 'denomination'">{{item[val.value]}}{{+item.preferential_type === 1 ? '折' : '元'}}</p>
                <span v-else class="title-item">{{item[val.value]}}</span>
              </div>
            </div>
          </div>
        </div>
        <!--翻页器-->
        <div class="page-box">
          <base-pagination ref="paginationCoupon" :pageDetail="couponPage" @addPage="_getMoreCoupon"></base-pagination>
        </div>
        <div class="back">
          <div class="back-cancel back-btn hand" @click="cancelModal">取消</div>
          <div class="back-btn back-submit hand" @click="additionCoupon">确定</div>
        </div>
      </div>
    </default-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {marketComputed} from '@state/helpers'

  import Swiper from './swiper/swiper'
  import API from '@api'
  import DefaultModal from './default-modal/default-modal'

  const PAGE_NAME = 'EDIT_RULES'
  const TITLE = '新增规则'
  const COUPON_TITLE = [
    {name: '选择', flex: 0.4, value: ''},
    {name: '优惠券名称', flex: 1.8, value: 'coupon_name'},
    {name: '类型', flex: 1, value: 'preferential_str'},
    {name: '面值', flex: 1, value: 'denomination'},
    {name: '剩余数量', flex: 1, value: 'usable_stock'},
    {name: '有效期', flex: 1.2, value: 'time'}
  ]
  const SELECT_COUPON_TITLE = [
    {name: '优惠券名称', flex: 1.5, value: 'coupon_name'},
    {name: '类型', flex: 0.6, value: 'preferential_str'},
    {name: '面值', flex: 0.6, value: 'denomination'},
    {name: '剩余', flex: 0.6, value: 'usable_stock'},
    {name: '有效期', flex: 2, value: 'time'},
    {name: '操作', flex: 0.5, value: ''}
  ]

  const SELECT_COMPENSATE_COUPON_TITLE = [
    {name: '优惠券名称', flex: 1.4, value: 'coupon_name'},
    {name: '类型', flex: 1, value: 'preferential_str'},
    {name: '使用门槛', flex: 1, value: 'preferential_str'},
    {name: '面值', flex: 1, value: 'denomination'},
    {name: '剩余', flex: 1, value: 'usable_stock'},
    {name: '操作', flex: 0.5, value: ''}
  ]

  const ARROW_ARR = [
    ['微信推送消息', '点击消息进入领券页领取优惠券', '客户商城选购商品', '提交订单立减金额'],
    ['打开小程序弹出优惠券', '点击消息进入领券页领取优惠券', '客户商城选购商品', '提交订单立减金额'],
  ]
  const MONEYREG = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      Swiper,
      DefaultModal
    },
    data() {
      return {
        disable: this.$route.query.id,
        selectCouponTitle: SELECT_COUPON_TITLE, // 已选优惠券弹窗title
        selectCompensateCouponTitle: SELECT_COMPENSATE_COUPON_TITLE,
        marketIndex: 0,
        arrowIndex: 0,
        couponCheckItem: {},
        couponPage: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        couponList: [],
        page: 0,
        keyword: '',
        stairSelect: {
          check: false,
          show: false,
          content: '请选择规则',
          type: 'default',
          data: []
        },
        rulesId: '',
        rulesTitle: '',
        couponSelectItem: {},
        lessSelectItem: {},
        greatSelectItem: {},
        isAdditionGroup: true,
        couponSelectList: [], // 已选优惠券列表
        lessSelectList: [],
        greatSelectList: [],
        couponTitle: COUPON_TITLE, // 优惠券弹窗title
        showAdd: true,
        price: '',
        modalType: '',
        confirmType: ''
      }
    },
    computed: {
      ...marketComputed,
      arrowArr() {
        return this.marketIndex > 1 ? ARROW_ARR[1] : ARROW_ARR[0]
      },
      testRules() {
        return this.rulesId
      },
      testCoupon() {
        if (+this.marketIndex === 2) {
          return this.lessSelectItem.id && this.greatSelectItem.id
        } else {
          return this.couponSelectItem.id
        }
      },
      testPrice() {
        if (+this.marketIndex === 2) {
          return this.price && MONEYREG.test(this.price)
        }
        return true
      }
    },
    async created() {
      this._initMsg(this.marketDetail)
      if (this.$route.query.id) {
        return
      }
      await this._getRulesList()
    },
    methods: {
      async _getRulesList() {
        let res = await API.Order.couponActivity()
        this.stairSelect.data = res.error === this.$ERR_OK ? res.data : []
      },
      selectRules(item, index) {
        this.rulesId = item.type
        this.rulesTitle = item.name
        this.marketIndex = +index
        this.arrowIndex = 0
        this._initData()
        this.$refs.swiper._changeBanner(0)
      },
      selectCoupon(item, index) {
        this.couponCheckItem = item
      },
      cancel() {
        this.$router.back()
      },
      bannerChange(index) {
        this.arrowIndex = index
      },
      changeBanner(index) {
        this.arrowIndex = index
        this.$refs.swiper._changeBanner(index)
      },
      cancelModal() {
        this.$refs.couponModal.hideModal()
      },
      async additionGroup() {
        if (!this.isAdditionGroup || this.disable) {
          return
        }
        let checkForm = this.checkForm()
        if (!checkForm) return
        this.isAdditionGroup = false
        let arr = []
        if (+this.marketIndex === 2) {
          arr = [
            {coupon_id: this.lessSelectItem.id},
            {coupon_id: this.greatSelectItem.id}
          ]
        } else {
          arr = [{coupon_id: this[`${this.modalType}SelectItem`].id}]
        }
        let data = {
          type: this.rulesId,
          title: this.rulesTitle,
          config_json: {},
          common_coupons: arr
        }
        if (+this.marketIndex === 2) {
          data.config_json.condition_one_coupons = [
            {
              coupon_id: this.lessSelectItem.id,
              conditon_type: 0,
              total: this.price
            }
          ]
          data.config_json.condition_two_coupons = [
            {
              coupon_id: this.greatSelectItem.id,
              conditon_type: 1,
              total: this.price
            }
          ]
        }
        let res = await API.Order.addCouponActivity(data)
        this.$toast.show(res.message, 600)
        if (res.error !== this.$ERR_OK) {
          this.isAdditionGroup = true
          return
        }
        setTimeout(() => {
          this.$router.back()
        }, 800)
      },
      // 验证表单
      checkForm() {
        let arr = [
          {value: this.testRules, txt: '请选择规则'},
          {value: this.testCoupon, txt: '请选择优惠券'},
          {value: this.testPrice, txt: '请正确输入金额'},
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
      // 删除优惠券
      showConfirm(type) {
        if (this.disable) return
        this[`${type}SelectList`] = []
        this[`${type}SelectItem`] = {}
        this.couponCheckItem = {}
      },
      additionCoupon() {
        if (this.couponCheckItem.id) {
          this[`${this.modalType}SelectItem`] = JSON.parse(JSON.stringify(this.couponCheckItem))
          this[`${this.modalType}SelectList`] = [JSON.parse(JSON.stringify(this.couponCheckItem))]
        }
        this.cancelModal()
      },
      // 搜索
      async _searchData(text) {
        this.keyword = text
        this.page = 1
        this.$refs.paginationCoupon.beginPage()
        await this._getCouponList()
      },
      async _getMoreCoupon(page) {
        this.page = page
        await this._getCouponList()
      },
      // 优惠券弹窗
      _getCouponList() {
        let data = {
          coupon_name: this.keyword,
          page: this.page,
          limit: 6,
          status: 1
        }
        API.Coupon.getCouponList(data, false).then((res) => {
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return
          }
          this.couponPage = {
            total: res.meta.total,
            per_page: res.meta.per_page,
            total_page: res.meta.last_page
          }
          this.couponList = res.data
        })
      },
      // 弹窗
      showCouponModal(type) {
        if (this.disable) return
        if (type !== this.modalType) {
          this.couponPage = {
            total: 1,
            per_page: 10,
            total_page: 1
          }
          this.page = 1
          this.keyword = ''
        }
        if (type !== this.modalType) {
          this.couponCheckItem = this[`${type}SelectItem`] || {}
        }
        this.modalType = type
        this._getCouponList()
        this.$refs.couponModal.showModal()
      },
      _initData() {
        ['coupon', 'less', 'great'].map(item => {
          this[`${item}SelectList`] = []
          this[`${item}SelectItem`] = {}
          this.couponCheckItem = {}
        })
      },
      // 详情信息
      _initMsg(news) {
        let id = this.$route.query.id || null
        if (id) {
          if (+news.type === 8) {
            this.lessSelectList = [news.common_coupons[0]]
            this.greatSelectList = [news.common_coupons[1]]
            this.marketIndex = 2
            this.price = JSON.parse(news.config_json).condition_one_coupons[0].total
          } else {
            this.couponSelectList = news.common_coupons
          }
          this.stairSelect.content = news.title
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .edit-rules
    flex: 1
    padding: 0 20px
    background: $color-white
  .msg-detail
    display: flex
  /*左边轮播图*/
  .left-view
    margin: 20px 60px 14px 40px
    width: 340px
    height: 640px
    .top-content
      height: 550px
      background: url(./pic-model@2x.png) no-repeat
      background-size: 100% 100%
      overflow: hidden

    .wrapper
      width: 300px
      height: 472.2px
      overflow: hidden
      margin: 80px auto 0
    .wrapper-box
      width: 100%
      height: 100%
      .step
        background-size: 100% 100%
        width: 100%
        height: 100%
    .bottom
      height: 90px
      border-radius: 0 0 8px 8px
      padding: 22px 20px 18px
      box-sizing: border-box
      border: 2px solid #F3F3F3
      .pointer
        width: 100%
        height: 16px
        .pointer-item
          width: 16px
          height: 16px
          background: #E3E3E3
          float: left
          margin-right: 10px
          border-radius: 50%
          cursor: pointer
          transition: all 0.3s
        .num
          color: #666
          float: right
          height: 16px
          line-height: 16px
        .active
          background: $color-main
      .text
        color: #333
        margin-top: 16px
  .right-form
    box-sizing: border-box
    flex: 1
    padding: 36px 0 20px
  .line-title
    font-size: $font-size-16
    position: relative
    padding-bottom: 10px
    padding-left: 12px
    margin-bottom: 24px
    border-bottom-1px($color-line)
    &:before
      content: ""
      width: 3px
      height: 16px
      background: $color-main
      position: absolute
      left: 0
      top: 4px
  .edit-item
    display: flex
    align-items: center
    margin-bottom: 24px
    .edit-title
      text-align: right
      width: 78px
      .start
        display: inline-block
        color: #F52424
    .edit-content
      margin-left: 40.9px
      width: 100%
      flex: 1
      .edit-select
        height: 32px
        width: 108px
      .add-icon
        margin-left: 6px
    .edit-input-box
      position: relative
      color: #333
      font-family: $font-family-regular
      font-size: $font-size-14
      margin-bottom: 24px
      .edit-input
        font-size: $font-size-14
        padding: 0 14px
        border-radius: 1px
        width: 306px
        height: 40px
        display: flex
        align-items: center
        margin: 0 10px
        justify-content: space-between
        border: 1px solid $color-line
        transition: all 0.3s
        -moz-appearance: textfield

        &:hover
          border-color: #ACACAC
        &:focus
          border-color: $color-main
      .small-input
        width: 278px
      .edit-textarea
        height: 94px
        resize: none
        padding: 4px 14px
      .no-wrap
        display: flex
        align-items: center
        .tip
          color: $color-text-assist
      .disable-input
        background: #F5F5F5
        color: #ACACAC
      .icon
        width: 0
        height: 0
        border: 6px solid #333
        position: absolute
        margin-top: 4px
        right: 10px
        col-center()
        border-bottom-color: transparent
        border-left: 4px solid transparent
        border-right: 4px solid transparent

      .num
        col-center()
        right: 20px
        color: #ACACAC
      .textarea-num
        position: absolute
        left: 360px
        bottom: 6px
        color: $color-text-assist
      .description
        display: flex
        align-items: center
        margin-top: 15px
        cursor: pointer
        .tip
          color: $color-text-assist

  .edit-list-item
    align-items: flex-start
    .edit-title
      margin-top: 4px
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
          height: 40px
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
  /*选择商品样式*/
  .shade-tab
    height: 48px
    box-sizing: border-box
    display: flex
    .tab-item
      margin-right: 10px

  .page-box
    box-sizing: border-box
    height: 76px
    align-items: center
    display: flex
  .group-content
    border-radius: 2px
    height: 407px
    .title
      display: flex
      height: 45px
      line-height: 45px
      font-family: $font-family-regular
      background: #F5F7FA
      border: 0.5px solid #E9ECEE
      align-items: center
      padding: 0 20px
      .title-item
        display: -webkit-box
        overflow: hidden
        -webkit-line-clamp: 2
        -webkit-box-orient: vertical
        padding-right: 20px
    .outreach-group-list
      font-size: $font-size-14
      color: #333
      font-family: $font-family-regular
      .group-item
        height: 60px
        line-height: 18px
        display: flex
        align-items: center
        border-bottom: 0.5px solid #E9ECEE
        border-right: 0.5px solid #E9ECEE
        border-left: 0.5px solid #E9ECEE
        padding: 0 20px
        &:first-child
          border-top: none
        &:nth-child(2n)
          background: #F5F7FA
        .radio
          width: 16px
          height: 16px
          border: 1px solid #E1E1E1
          border-radius: 50%
          transition: all 0.3s
          display: flex
          justify-content: center
          align-items: center
        .checked
          border: 5px solid $color-main
        .check
          width: 16px
          height: 16px
          border: 1px solid #E1E1E1
          transition: all 0.3s
          display: flex
          justify-content: center
          align-items: center
          &:before
            content: ""
            width: 14px
            height: 14px
            icon-image(icon-check)
            display: block
            opacity: 0
            transition: all 0.3s
        .checked
          border-color: #4DBD65
          &:before
            opacity: 1
        .right
          border-color: #E1E1E1
          &:before
            opacity: 1
            icon-image(icon-check_ash)
        .title-item
          padding-right: 20px
          display: block
          overflow: hidden
          span
            display: -webkit-box
            overflow: hidden
            -webkit-line-clamp: 2
            -webkit-box-orient: vertical
  .edit-list-box
    margin-top: 20px
    border: 1px solid $color-line
    .list-title
      background: #F5F7FA
      height: 45px
      line-height: 45px
      padding: 0 20px
      display: flex
      border-bottom: 1px solid $color-line
      .list-title-item
        padding-right: 20px
        &:last-child
          padding-right: 0
    .no-line
      border-bottom: 0
    .list
      height: 60px
      line-height: 60px
      padding: 0 20px
      display: flex
      &:nth-child(2n)
        background: #F5F7FA
      .list-item
        display: flex
        align-items: center
        overflow: hidden
        padding-right: 20px
        &:last-child
          padding-right: 0
        .main
          line-height: 20px
          overflow: hidden
          white-space: nowrap
          text-overflow: ellipsis
        .input-count
          width: 90px
          height: 34px
          padding-left: 15px
          box-sizing: border-box
          border: 1px solid $color-line
          line-height: 20px
        .handle
          color: #4d77bd
          cursor: pointer
          &:hover
            color: #06397e
        .list-operation-disable
          cursor: not-allowed
  .btn-disable-store
    .add-icon
      &:before, &:after
        background: #e9ecee
</style>
