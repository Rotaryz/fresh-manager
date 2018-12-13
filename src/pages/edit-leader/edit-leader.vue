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
          <input type="number" class="edit-input" maxlength="11" @mousewheel.native.prevent>
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          社区名称
        </div>
        <div class="edit-input-box">
          <input type="text" class="edit-input" maxlength="20">
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
          <input type="text" class="edit-input" maxlength="10">
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          微信号
        </div>
        <div class="edit-input-box">
          <input type="text" class="edit-input">
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          社区地址
        </div>
        <div class="edit-input-box">
          <city-select></city-select>
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          详细地址
        </div>
        <div class="edit-input-box">
          <textarea name="" class="edit-text" maxlength="50"></textarea>
        </div>
      </div>
    </div>
    <div class="back">
      <div class="back-cancel back-btn hand" @click="_back">返回</div>
      <div class="back-btn btn-main">保存</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import CitySelect from '@components/city-select/city-select'

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
    data() {
      return {}
    },
    methods: {
      _back() {
        this.$router.back()
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
