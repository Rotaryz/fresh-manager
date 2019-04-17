<template>
  <default-modal ref="modal">
    <div slot="content" class="default-confirm">
      <div class="confirm-content">
        <div class="title">{{title}}</div>
        <div class="text">{{text}}</div>
        <div class="btn-group">
          <span class="btn confirm" @click="confirm">确定</span>
          <span class="btn cancel" @click="cancel">取消</span>
        </div>
      </div>
    </div>
  </default-modal>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'

  const COMPONENT_NAME = 'COUPON_CONFIRM'

  export default {
    name: COMPONENT_NAME,
    components: {DefaultModal},
    props: {},
    data() {
      return {
        text: '',
        title: ''
      }
    },
    methods: {
      show(text, title) {
        if (!text && !title) return
        this.$refs.modal && this.$refs.modal.showModal()
        this.text = text
        this.title = title
      },
      hide() {
        this.$refs.modal && this.$refs.modal.hideModal()
      },
      confirm() {
        this.hide()
        this.$emit('confirm')
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

  .default-confirm
    width: 329.6px
    height: 200px
    background: #fff
    border-radius: 1px
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.6)
    text-align: center
    color: #333
    .btn-group
      text-align: center
      display: flex
      justify-content: center
      user-select: none
      .btn
        width: 96px
        height: 40px
        line-height: 40px
        border-radius: 1px
        border: 1px solid $color-text-D9
        cursor: pointer
        transition: all 0.3s
      .cancel
        border: 1px solid $color-line
        margin-left: 20px
        &:hover
          color: $color-text-sub
          border-color: $color-text-sub
      .confirm
        border: 1px solid $color-main
        background: $color-main
        color: $color-white
        &:hover
          opacity: 0.8
      .one-btn
        margin-left: 0
    .title
      font-size: $font-size-16
      font-family: $font-family-medium
      padding-top: 25px
    .text
      font-size: $font-size-16
      font-family: $font-family-regular
      color: #333
      padding-top: 15px
      height: 94px
      text-align: center
      margin: 0 35px
      word-break: break-all
      line-height: 1.4
</style>
