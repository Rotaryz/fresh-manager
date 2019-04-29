<template>
  <div class="outreach-activity-staff table">
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-team@2x.png" class="identification-icon">
          <p class="identification-name">{{memberData.activity_name}}线下拓展团队</p>
        </div>
        <div class="top-data">
          <div v-for="(item, index) in topItem" :key="index" class="top-item">
            <img class="img" :src="require('./'+ item.icon +'@2x.png')" alt="">
            <span class="name">{{item.name}}</span>
            <span class="num">{{item.icon === 'icon-deal' ? '¥' : ''}}{{memberData[item.value]}}</span>
          </div>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in activityTitle" :key="index" class="list-item" :style="{flex: item.flex}">{{item.name}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in memberList" :key="index" class="list-content list-box">
            <div v-for="(val, ind) in activityTitle" :key="ind" :style="{flex: val.flex}" class="list-item" :class="{'list-about': val.type === 2}">
              <div v-if="+val.type === 1" :style="{flex: val.flex}" class="item">
                {{val.value === 'pay_amount' ? '¥' : ''}}{{(val.value === 'pay_num' || val.value === 'pay_amount' || val.value === 'repurchase_num') ? (item[val.value] || '0') : (item[val.value] || '---')}}
              </div>

              <!--二维码-->
              <div v-if="+val.type === 2" :style="{flex: val.flex}" class="code-box">
                <div class="code-main" @click="_getQrCode(item, index)">
                  <img src="./icon-qr@2x.png" class="small-code">
                  <transition name="fade">
                    <div v-if="codeShow === index" class="code-content">
                      <img :src="item.qrcode_url + '?imageView2/format/jpg'" alt="" class="code">
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <default-modal v-if="memberList.length" ref="codeModal">
        <div slot="content" class="pop-main code">
          <div class="shade-header">
            <div class="shade-title">{{memberList[codeIndex] && memberList[codeIndex].member_name}}</div>
            <!--@click="_cancelGoods"-->
            <span class="close hand" @click="_close"></span>
          </div>
          <div class="img-box">
            <img v-if="!loadImg" key="1" :src="qrUrl" alt="" class="xcx-img">
            <img v-if="loadImg" key="2" src="./loading.gif" alt="" class="load-img">
          </div>
        </div>
      </default-modal>
      <div class="pagination-box">
        <base-pagination ref="pages" :pageDetail="memberPage" @addPage="addPage"></base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {outreachComputed, outreachMethods} from '@state/helpers'
  import DefaultModal from '@components/default-modal/default-modal'
  import API from '@api'

  const PAGE_NAME = 'OUTREACH_ACTIVITY_STAFF'
  const TITLE = '拓展活动-团队成员'

  const ACTIVITI_TITLE = [
    {name: '姓名', flex: 1.2, value: 'member_name', type: 1},
    {name: '手机号', flex: 1.2, value: 'member_mobile', type: 1},
    {name: '订单', flex: 1.2, value: 'pay_num', type: 1},
    {name: '交易额(元)', flex: 1, value: 'pay_amount', type: 1},
    {name: '复购数', flex: 1, value: 'repurchase_num', type: 1},
    {name: '复购率(15天)', flex: 1, value: 'repeat_rate', type: 1},
    {name: '二维码', flex: 1, value: 'qrcode_url', type: 2}
  ]
  const TOP_ITEM = [
    {name: '订单', icon: 'icon-order', value: 'order_counts'},
    {name: '交易额', icon: 'icon-deal', value: 'total_sum'},
    {name: '复购率', icon: 'icon-repeat', value: 'repurchase_rate'}
  ]
  const ICON = ['icon-rising', 'icon-up_hover', 'icon-flat']
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
        activityTitle: ACTIVITI_TITLE,
        iconArr: ICON,
        topItem: TOP_ITEM,
        page: 1,
        status: 0,
        codeShow: '',
        id: '',
        qrUrl: '',
        loadImg: false,
        codeIndex: ''
      }
    },
    computed: {
      ...outreachComputed
    },
    created() {
      this.id = this.$route.query.id || ''
    },
    methods: {
      ...outreachMethods,
      showCode(index) {
        clearTimeout(this.timer)
        this.codeShow = index
      },
      hideCode() {
        this.timer = setTimeout(() => {
          this.codeShow = ''
        }, 500)
      },
      addPage(page) {
        this.page = page
        this.$emit('getMemberList', {page, id: this.id})
      },
      async _getQrCode(item, index) {
        this.codeIndex = index
        this.loadImg = true
        this.$refs.codeModal.showModal()
        let res = await API.Outreach.getQrCode({path: `pages/recommend?s=${item.shop_id}&m=${item.activity_id}&e=${item.member_id}`, is_hyaline: false})
        if (res.error !== this.$ERR_OK) {
          this.$toast.show(res.message)
          return
        }
        this.loadImg = false
        this.qrUrl = res.data.image_url
      },
      _close() {
        this.$refs.codeModal.hideModal()
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .identification
    height: 106px
    padding: 22px 0 26px
    display: block
    .identification-icon
      width: 17px
      height: 12px
    .top-data
      margin-top: 24px
      display: flex
      align-items: center
    .top-item
      display: flex
      align-items: center
    .img
      height: 14px
      object-fit: cover
    .name
      font-size: $font-size-14
      font-family: $font-family-regular
      color: $color-text-main
      margin-left: 5px
      line-height: 14px
    .num
      font-size: $font-size-16
      color: #FF8282
      line-height: 16px
      font-family: $font-family-din-bold
      margin-left: 8px
      margin-right: 88px

  .list
    flex: 1
    .list-item
      font-size: $font-size-14
      .item
        text-overflow: ellipsis
        overflow: hidden
        white-space: nowrap
        font-size: 14px
      .code-box
        position: relative
        display: flex
        align-items: center
        .code-main
          margin-left: -15px
          padding-left: 15px
          height: 16px
      .small-code
        width: 16px
        height: 16px
        object-fit: cover
        cursor: pointer
      .code-bg
        padding-right: 10px
      .code-content
        position: absolute
        left: -170px
        top: -68px
        width: 160px
        height: 160px
        border-radius: 2px
        overflow: hidden
        box-shadow: 0 0 8px 0 #E9ECEE
        border: 1px solid #E9ECEE
        background: #FFF
        z-index: 1
        .code
          width: 120px
          height: 120px
          margin: 20px auto
          display: block
        .text
          font-size: $font-size-16
          color: #4DBD65
          font-family: $font-family-regular
          text-align: center
          line-height: 40px
          height: 40px
          background: #F5F7FA
          display: block
          border-top: 1px solid #E9ECEE
          cursor: pointer
    .list-content .list-about
      overflow: inherit


  .list-box
    .list-item
      box-sizing: border-box
      flex: 1
      &:last-child
        padding: 0
        max-width: 122px
  .pop-main
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
    border-radius: 2px
    background: $color-white
    width: 530px
    height: 360px
    box-sizing: border-box
    text-align: left
    display: flex
    flex-direction: column
    .shade-header
      display: flex
      align-items: center
      justify-content: space-between
      height: 60.5px
      box-sizing: border-box
      padding: 0 20px
      border-bottom: 0.5px solid $color-line
    .shade-title
      color: $color-text-main
      font-family: $font-family-regular
      font-size: $font-size-16
    .close
      icon-image('icon-close')
      width: 16px
      height: @width
      transition: all 0.3s
      &:hover
        transform: scale(1.3)
    .img-box
      flex: 1
      display: flex
      align-items: center
      justify-content: center
    .xcx-img
      display: block
      width: 238px
      height: @width

    .load-img
      display: block
      width: 40px
      height: 40px
</style>
