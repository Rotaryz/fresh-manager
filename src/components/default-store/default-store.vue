<template>
  <div class="default-store">
    <default-modal ref="modal">
      <div slot="content" class="default-input">
        <div class="title-input">
          <div class="title">选择库位</div>
          <div class="close-box">
            <div class="close" @click="cancel"></div>
          </div>
        </div>
        <div class="main-input">
          <div class="edit-item">
            <div class="edit-title">
              <span class="start">*</span>
              初始销量
            </div>
            <base-drop-down :select="dispatchSelect" @setValue="setValue" width="333" height="44"></base-drop-down>
          </div>
          <div class="btn-group">
            <span class="btn cancel" @click="cancel">取消</span>
            <span class="btn confirm" @click="confirm">确定</span>
          </div>
        </div>
      </div>
    </default-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  const COMPONENT_NAME = 'DEFAULT_STORE'

  export default {
    name: COMPONENT_NAME,
    components: {DefaultModal},
    data() {
      return {
        numberTxt: '',
        numberTitle: '',
        numberPla: '',
        dispatchSelect: {
          check: false,
          show: false,
          content: '全部状态',
          type: 'default',
          data: [{name: '全部', value: ''}, {name: '上架', value: 1}, {name: '下架', value: 0}]
        }
      }
    },
    methods: {
      cancel() {},
      confirm() {}
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .default-input
    background: #fff
    width: 534px
    height: 261px
    border-radius: 1px
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
        font-family: $font-family-regular
      .close-box
        padding: 17px
        cursor: pointer
        .close
          width: 22px
          height: 22px
          border-radius: 50%
          background-size: 22px
          bg-image('icon-close')

  .edit-item
    display: flex
    color: #2A2A2A
    min-height: 40px
    margin-top: 20px
    padding-left: 54px
    .edit-title
      margin-top: 7.5px
      font-size: $font-size-14
      font-family: $font-family-regular
      white-space: nowrap
      text-align: left
      margin-right: 20px
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

  .main-input
    padding: 42px 10px 0 40px
  .btn-group
    margin-top: 36px
    text-align: center
    display: flex
    justify-content: center
    user-select: none
    .btn
      width: 96px
      height: 40px
      line-height: 40px
      border-radius: 1px
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
        opacity: 0.8
    .one-btn
      margin-left: 0

  .z
    width: 100%
</style>
