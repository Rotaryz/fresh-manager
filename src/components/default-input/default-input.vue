<template>
  <default-modal ref="modal">
    <div slot="content" class="default-input">
      <div class="title-box">
        <div class="title">
          {{numberTitle}}
        </div>
        <span class="close hand" @click="cancel"></span>
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
    width: 380px
    height: 213px
    border-radius: 1px
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
        width: 10px
        height: @width
        icon-image('icon-close')

    .main-input
      margin-top: 7px
      .main-input-box
        width: 100%
        height: 44px
        border: 0.5px solid #D3D8DC
        border-radius: 1px
        font-family: $font-family-regular
        color: $color-text-main
        font-size: $font-size-14
        padding-left: 14px
        transition: all 0.3s
        &::-webkit-inner-spin-button
          appearance: none
        &:hover
          border: 0.5px solid #ACACAC
        &::placeholder
          font-family: $font-family-regular
          color: $color-text-assist
        &:focus
          border-color: $color-main !important
  .z
    width: 100%
</style>
