<template>
  <div class="edit-supplier detail-content">
    <div class="identification">
      <div class="identification-page">
        <img src="./icon-buyer_new@2x.png" class="identification-icon">
        <p class="identification-name">{{id ? '编辑采购员' : '新建采购员'}}</p>
      </div>
      <div class="function-btn">
      </div>
    </div>
    <div class="content-header">
      <div class="content-title">基本信息</div>
    </div>
    <div class="leader-box">
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          供应商名称
        </div>
        <div class="edit-input-box">
          <input type="number" class="edit-input" placeholder="请输入供应商名称" maxlength="20">
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          手机号
        </div>
        <div class="edit-input-box">
          <input type="number" class="edit-input" placeholder="请输入手机号码" maxlength="11">
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          地址
        </div>
        <div class="edit-input-box">
          <textarea class="edit-text" maxlength="50"></textarea>
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          地址
        </div>
        <div class="edit-input-box">
          <base-drop-down :width="400" :height="44"></base-drop-down>
          <!--<textarea class="edit-text" maxlength="50"></textarea>-->
        </div>
      </div>
    </div>
    <div class="back">
      <div class="back-cancel back-btn hand" @click="_back">返回</div>
      <div class="back-btn back-submit" @click="submit">保存</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'EDIT_SUPPLIER'
  const TITLE = '新建供应商'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        id: ''
      }
    },
    methods: {
      _back() {
        this.$router.back()
      },
      submit() {
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/detail"

  .edit-leader
    padding-bottom: 80px
    position: relative
    flex: 1

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
        border-radius: 1px
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
      .edit-text
        font-size: $font-size-14
        padding: 10px 14px
        border-radius: 1px
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

  .edit-change
    line-height: 40px
</style>
