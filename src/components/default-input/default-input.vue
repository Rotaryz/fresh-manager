<template>
  <default-modal ref="modal">
    <div slot="content" class="default-input">
      <div class="title-input">
        <div class="title">{{numberTitle}}</div>
        <div class="close-box">
          <div class="close" @click="cancel"></div>
        </div>
      </div>
      <div class="main-input">
        <input v-model="numberTxt" type="text" class="main-input-box" :placeholder="numberPla">
        <div class="btn-group">
          <span class="btn cancel" @click="cancel">取消</span>
          <span class="btn confirm" @click="confirm">确定</span>
        </div>
      </div>
    </div>
  </default-modal>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  const COMPONENT_NAME = 'DEFAULT_INPUT'

  export default {
    name: COMPONENT_NAME,
    components: {DefaultModal},
    data() {
      return {
        numberTxt: '',
        numberTitle: '',
        numberPla: ''
      }
    },
    methods: {
      show(text, title, placeholder) {
        this.numberTxt = text
        this.numberTitle = title
        this.numberPla = placeholder
        this.$refs.modal && this.$refs.modal.showModal()
      },
      hide() {
        this.$refs.modal && this.$refs.modal.hideModal()
      },
      confirm() {
        this.$emit('confirm', this.numberTxt)
      },
      cancel() {
        this.hide()
        this.$emit('cancel')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .default-input
    background: #fff
    width: 534px
    height: 261px
    border-radius: 3px
    .title-input
      height: 60px
      layout(row)
      align-items: center
      justify-content: space-between
      border-bottom: 1px solid #e1e1e1
      padding-left: 20px
      .title
        color: $color-text-main
        font-size: $font-size-16
        font-family: $font-family-medium
      .close-box
        padding: 17px
        cursor: pointer
        .close
          width: 22px
          height: 22px
          border-radius: 50%
          background-size: 22px
          bg-image('icon-close')

    .main-input
      padding: 42px 20px 0 40px
      .main-input-box
        width: 310px
        height: 44px
        border: 1px solid #e1e1e1
        border-radius: 1px
        font-family: $font-family-medium
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
          border-color: $color-sub !important
  .btn-group
    margin-top: 55px
    text-align: center
    display: flex
    justify-content: flex-end
    user-select :none
    .btn
      width: 96px
      height: 40px
      line-height: 40px
      border-radius: 3px
      cursor :pointer
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
      margin-left :0
  .z
    width: 100%
</style>
