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
      <div class="right-form">
        <p class="line-title">售后补偿</p>
        <div class="edit-box">
          <div class="edit-item">
            <div class="edit-title"><span class="start">*</span>规则名称</div>
            <div class="edit-content">
              <base-drop-down :width="400" :height="40"></base-drop-down>
            </div>
          </div>
          <div class="edit-item">
            <div class="edit-title"><span class="start">*</span>选择优惠券</div>
            <div class="edit-content">
              <div class="btn-main hand edit-select" @click="showCouponModal">选择<span class="add-icon"></span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="back">
      <div class="back-cancel back-btn hand" @click="cancel">取消</div>
      <div class="back-btn back-submit hand" @click="additionGroup">确定</div>
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
            <div v-for="(item, index) in couponList" :key="index" class="group-item" @click="_selectCoupon(item, index)">
              <div v-for="(val, ind) in couponTitle" :key="ind" class="title-item" :style="{flex: val.flex}">
                <span v-if="ind === 0" class="radio" :class="{'checked': (couponCheckItem.id ? (item.id === couponCheckItem.id) : (item.id === couponSelectItem.id))}"></span>
                <div v-else-if="val.value === 'time'" class="main">
                  <p>{{item.start_at}}</p>
                  <p>{{item.end_at}}</p>
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
  import Swiper from './swiper/swiper'
  import API from '@api'
  import DefaultModal from '@components/default-modal/default-modal'

  const PAGE_NAME = 'EDIT_RULES'
  const TITLE = '新增规则'
  const COUPON_TITLE = [
    {name: '选择', flex: 0.4, value: ''},
    {name: '优惠券名称', flex: 1.8, value: 'coupon_name'},
    {name: '类型', flex: 1, value: 'preferential_str'},
    {name: '面值', flex: 1, value: 'denomination'},
    {name: '剩余数量', flex: 1, value: 'usable_stock'},
    {name: '有效期', flex: 1, value: 'time'},
  ]
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
        marketIndex: 1,
        arrowArr: ['微信推送消息', '点击消息进入领券页领取优惠券', '客户商城选购商品', '提交订单立减金额'],
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
        couponTitle: COUPON_TITLE // 优惠券弹窗title
      }
    },
    methods: {
      cancel() {

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
      additionGroup() {
      },
      additionCoupon() {

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
        API.Coupon.getCouponList(data, false)
          .then(res => {
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
      showCouponModal() {
        this.couponCheckItem = {}
        this._getCouponList()
        this.$refs.couponModal.showModal()
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
      .edit-select
        height: 32px
        width: 108px
      .add-icon
        margin-left: 6px

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

</style>
