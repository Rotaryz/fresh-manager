<template>
  <div class="coupon-data">
    <!--统计-->
    <div class="view-data">
      <div class="view-header">
        <div class="title">
          <img src="./icon-@2x.png" alt="" class="data-icon">
          <p class="name">“{{viewData.coupon_name}}”效果统计</p>
          <span class="text">(统计至前一天)</span>
        </div>
        <div class="right">
          <p class="export hand" @click="exportData">
            <span class="export-icon"></span>
            <span>导出</span>
          </p>
          <span class="close hand" @click="closeData"><img src="./icon-close@2x.png" alt="" class="close-icon"></span>
        </div>
      </div>
      <div class="view-num">
        <p class="data-title">投入产出统计</p>
        <div class="data-num">
          <div v-for="(item, index) in viewData" :key="index" class="data-item">
            <img :src="require('./'+item.icon+'@2x.png')" alt="" class="icon">
            <div class="num-text hand" @click="showDescription(index)">
              <span class="name">{{item.name}} <img src="./icon-help@2x.png" alt="" class="name-icon"></span>
              <span class="num">{{item.num}}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="image-data">
        <p class="data-title">优惠券使用统计</p>
        <div class="data-box">
          <funnel-data ref="funnel" :chartData="chartData" chartId="funnel"></funnel-data>
        </div>
      </div>
    </div>
    <description-modal ref="description"></description-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import FunnelData from './funnel-data/funnel-data'
  import DescriptionModal from './description-modal/description-modal'

  const PAGE_NAME = 'COUPON_DATA'

  const TITLE = '优惠券统计'
  const VIEW_DATA = [
    {
      name: '用券成交金额(元)',
      icon: 'icon-use_coupon',
      num: '600.00'
    },
    {
      name: '优惠总金额(元)',
      icon: 'icon-entered_account',
      num: '200.00'
    },
    {
      name: 'ROI',
      icon: 'icon-pending_entry',
      num: '100.00'
    }
  ]
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      FunnelData,
      DescriptionModal
    },
    data() {
      return {
        id: '',
        couponName: '',
        viewData: VIEW_DATA,
        chartDataArr: ['total_num', 'received_num', 'used_num'],
        chartData: [
          {
            value: 1,
            name: '优惠券总数'
          },
          {
            value: 1,
            name: '已发放'
          },
          {
            value: 1,
            name: '已使用'
          }
        ]
      }
    },
    created() {
      this.id = this.$route.query.id || 0
      this.getCouponData()
    },
    mounted() {
    // this.barcode()
    },
    methods: {
      getCouponData() {
        API.Coupon.getCouponData({
          tag_type: 0,
          coupon_id: this.id
        })
          .then(res => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            this.chartData = this.chartDataArr.map((item, index) => {
              return {
                value: res.data[item],
                name: this.chartData[index].name
              }
            })
            this.couponName = res.data.coupon_name
            this.viewData[0].num = res.data.trade_total
            this.viewData[1].num = res.data.discount_total
            this.viewData[2].num = res.data.roi_value
          })
      },
      exportUrl() {
        let currentId = this.getCurrentId()
        let token = this.$storage.get('auth.currentUser', '')
        let data = {
          current_corp: currentId,
          current_shop: process.env.VUE_APP_CURRENT_SHOP,
          access_token: token.access_token,
          tag_type: 0,
          coupon_id: this.id
        }
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        return process.env.VUE_APP_API + '/social-shopping/v2/api/backend/coupon-manage/coupon/coupon-report/day-report-export?' + search.join('&')
      },
      exportData() {
        window.open(this.exportUrl())
      },
      showDescription(index) {
        this.$refs.description.show(index)
      },
      closeData() {
        this.$router.back()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .coupon-data
    width: 100%
  .view-data
    width: 100%
    height: 856px
    left: 0
    top: 40px
    z-index: 10
    background: #FFF
    .view-header
      height: 60px
      display: flex
      align-items: center
      justify-content: space-between
      padding: 0 20px
      border-bottom-1px($color-line)
      .title
        display: flex
        align-items: center
      .data-icon
        width: 14px
        height: 14px
      .name
        font-family: $font-family-regular
        font-size: $font-size-16
        color: #333
      .text
        font-family: $font-family-regular
        font-size: $font-size-14
        color: #acacac
        margin-left: 6px
      .right
        display: flex
        align-items: center
      .export
        display: flex
        align-items: center
        font-family: $font-family-regular
        font-size: $font-size-14
        color: #444
        margin-right: 20px
        transition: all 0.2s
        &:hover
          color: #4dbd65
          .export-icon
            background-image: url("./icon-export_2@2x.png")
      .export-icon
        width: 12px
        height: 12px
        margin-right: 5px
        background: url("./icon-export_1@2x.png")
        background-size: 100% 100%
        transition: all 0.2s
      .close
        padding-left: 20px
        border-left-1px(#E6EAED)
        height: 16px
      .close-icon
        width: 12px
        height: 12px
        margin: auto
    .view-num
      padding: 20px 20px 10px
      .data-title
        font-family: $font-family-regular
        font-size: $font-size-16
        color: #333333
      .data-num
        margin-top: 14px
        border-1px($color-line)
        display: flex
        align-items: center
        height: 138px
        padding: 40px 20px
      .data-item
        margin-right: 80px
        display: flex
        align-items: center
      .icon
        width: 58px
        height: 58px
        margin-right: 18px
      .num-text
        color: #333333
        font-family: $font-family-regular
        font-size: $font-size-14
      .name
        display: flex
        align-items: center
        padding-left: 2px
      .name-icon
        width: 14px
        height: 14px
        margin-left: 10px
      .num
        font-size: 32px
        font-family: $font-family-din-bold
        color: #333333
        margin-top: 10px
    .image-data
      padding: 22px 20px 12px
      .data-title
        font-family: $font-family-regular
        font-size: $font-size-16
        color: #333333
      .data-box
        margin-top: 14px
        border-1px($color-line)
        display: flex
        height: 512px
        padding: 44px

</style>
