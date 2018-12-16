<template>
  <div class="edit-leader">
    <div class="content-header">
      <div class="content-title">基本信息</div>
    </div>
    <div class="leader-box">
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          团长账号
        </div>
        <div class="edit-input-box">
          <input v-model="leaderData.mobile" type="number" class="edit-input" maxlength="11" :disabled="id"
                 @mousewheel.native.prevent
          >
        </div>
        <div class="edit-msg">团长账号为手机号，绑定微信，不能修改</div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          社区名称
        </div>
        <div class="edit-input-box">
          <input v-model="leaderData.social_name" type="text" class="edit-input" maxlength="20">
        </div>
      </div>
    </div>
    <div class="content-header">
      <div class="content-title">收货信息</div>
    </div>
    <div class="leader-box">
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          团长名称
        </div>
        <div class="edit-input-box">
          <input v-model="leaderData.name" type="text" class="edit-input" maxlength="10">
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          微信号
        </div>
        <div class="edit-input-box">
          <input v-model="leaderData.wx_account" type="text" class="edit-input">
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          社区地址
        </div>
        <div class="edit-input-box">
          <city-select @setValue="_getCity"></city-select>
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          详细地址
        </div>
        <div class="edit-input-box">
          <textarea v-model="leaderData.address" class="edit-text" maxlength="50"></textarea>
        </div>
      </div>
    </div>
    <div class="back">
      <div class="back-cancel back-btn hand" @click="back">返回</div>
      <div class="back-btn btn-main" @click="submit">保存</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import CitySelect from '@components/city-select/city-select'
  import API from '@api'
  import _ from 'lodash'

  const PAGE_NAME = 'EDIT_LEADER'
  const TITLE = '新建团长'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      CitySelect
    },
    props: {
      detail: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        id: null,
        leaderData: {
          mobile: '',
          social_name: '',
          name: '',
          wx_account: '',
          province: '',
          city: '',
          district: '',
          address: '',
          longitude: '',
          latitude: ''
        },
        isSubmit: false
      }
    },
    created() {
      this.id = this.$route.query.id || null
      this._setData()
    },
    methods: {
      back() {
        this.$router.back()
      },
      submit() {
        if (this.isSubmit) {
          return
        }
        if (!this._isDataValidate()) {
          return
        }
        this.isSubmit = true
        let address = this.leaderData.province + this.leaderData.city + this.leaderData.district + this.leaderData.address
        let oAjax = new XMLHttpRequest()
        oAjax.open(
          'GET',
          `https://restapi.amap.com/v3/geocode/geo?address=${address}&key=${process.env.VUE_APP_KEY}`,
          true
        )
        oAjax.send()
        oAjax.onreadystatechange = async () => {
          if (oAjax.readyState === 4 && oAjax.status === 200) {
            let res = JSON.parse(oAjax.responseText)
            let location = res.geocodes[0].location.split(',')
            this.leaderData.longitude = location[0]
            this.leaderData.latitude = location[1]

            if (this.id) {
              // 编辑团长
              res = await API.Leader.editLeader(this.id, this.leaderData)
            } else {
              // 新建团长
              res = await API.Leader.storeLeader(this.leaderData)
            }

            this.$loading.hide()
            this.$toast.show(res.message)
            if (res.error === this.$ERR_OK) {
              setTimeout(() => {
                this.isSubmit = false
                this._back()
              }, 1000)
            }
          }
        }
      },
      /**
       * 设置默认数据 -> 编辑状态
       * @private
       */
      _setData() {
        if (!_.isEmpty(this.detail)) {
          this.leaderData = this.detail
        // TODO 设置默认省市区
        }
      },
      _isDataValidate() {
        if (!this.leaderData.mobile || this.leaderData.mobile.length !== 11) {
          this.$toast.show('请输入正确的团长账号')
          return
        } else if (!this.leaderData.social_name) {
          this.$toast.show('请输入正确的社区名称')
          return
        } else if (!this.leaderData.name) {
          this.$toast.show('请输入正确的团长名称')
          return
        } else if (!this.leaderData.wx_account) {
          this.$toast.show('请输入正确的微信号')
          return
        } else if (!this.leaderData.province) {
          this.$toast.show('请选择正确的省份')
          return
        } else if (!this.leaderData.city) {
          this.$toast.show('请选择正确的城市')
          return
        } else if (!this.leaderData.district) {
          this.$toast.show('请选择正确的区/县')
          return
        } else if (!this.leaderData.address) {
          this.$toast.show('请输入正确的详情地址')
          return
        }
        return true
      },
      _getCity(data) {
        // 获取地址
        this.leaderData.province = data.province.includes('请选择') ? '' : data.province
        this.leaderData.city = data.city.includes('请选择') ? '' : data.city
        this.leaderData.district = data.area.includes('请选择') ? '' : data.area
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .edit-leader
    padding-bottom: 80px
    position: relative
    flex: 1

  /*基本信息类头部盒子样式*/
  .content-header
    border-bottom: 1px solid $color-line
    display: flex
    align-items: center
    justify-content: space-between
    height: 62px
    position: relative
    box-sizing: border-box
    &:after
      content: ''
      position: absolute
      width: 34px
      height: 2px
      background: $color-main
      border-radius: 1px
      bottom: -1px
      left: 0
    .content-title
      color: $color-text-main
      font-family: $font-family-medium
      font-size: $font-size-16

  .leader-box
    padding: 0 20px
    box-sizing: border-box
    margin-bottom: 35px
    .edit-item
      display: flex
      color: #2A2A2A
      min-height: 40px
      margin-top: 24px
      .edit-title
        margin-top: 7.5px
        font-size: $font-size-14
        font-family: $font-family-regular
        white-space: nowrap
        text-align: left
        width: 64px
      .start
        display: inline-block
        margin-right: -2px
        color: #F52424
      .edit-input-box
        margin-left: 40.9px
      .edit-input
        font-size: $font-size-14
        padding: 0 14px
        border-radius: 4px
        width: 400px
        height: 40px
        border: 1px solid $color-line
        transition: all 0.3s
        box-sizing: border-box
        &::-webkit-inner-spin-button
          appearance: none
        &:hover
          border: 1px solid #ACACAC
        &::placeholder
          font-family: $font-family-regular
          color: $color-text-assist
        &:focus
          border-color: $color-sub !important
      .edit-text
        font-size: $font-size-14
        padding: 10px 14px
        border-radius: 4px
        width: 400px
        height: 70px
        border: 1px solid $color-line
        transition: all 0.3s
        resize: none
        outline: none
        &:hover
          border: 1px solid #ACACAC
        &::placeholder
          font-family: $font-family-regular
          color: $color-text-assist
        &:focus
          border-color: $color-sub !important
      .edit-msg
        line-height: 40px
        font-size: $font-size-14
        color: #acacac
        margin-left: 10px

  .back
    position: absolute
    left: -20px
    right: -20px
    bottom: 0
    z-index: 10
    background: #F9F9F9
    height: 80px
    border-radius: 0 0 6px 6px
    display: flex
    align-items: center
    padding-left: 40px
    box-sizing: border-box
    .back-btn
      box-sizing: border-box
      font-size: $font-size-16
      margin-right: 20px
      padding: 12px 32px
      transition: all 0.3s
    .back-cancel
      padding: 11px 32px
      box-sizing: border-box
      line-height: 1
      color: $color-text-main
      border: 1px solid #ACACAC
      border-radius: 4px
      &:hover
        color: $color-text-sub
        border-color: $color-text-sub
</style>
