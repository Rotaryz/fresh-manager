<template>
  <default-modal ref="modal">
    <div slot="content" class="default-confirm">
      <div class="confirm-content">
        <!--<div class="title">{{title}}</div>-->
        <div class="text">{{text}}</div>
        <div v-if="oneBtn" class="btn-group">
          <span class="btn confirm one-btn" @click="cancel">确定</span>
        </div>
        <div v-else class="btn-group">
          <span class="btn cancel" @click="cancel">取消</span>
          <span class="btn confirm" @click="confirm">确定</span>
        </div>
      </div>
    </div>
  </default-modal>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  const COMPONENT_NAME = 'DEFAULT_CONFIRM'

  export default {
    name: COMPONENT_NAME,
    components: {DefaultModal},
    props: {
      oneBtn: {
        type: Boolean,
        default: false
      }
    },
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
    width: 356px
    height: 210px
    background: #fff
    border-radius: 3px
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.6)
    text-align: center
    .btn-group
      text-align: center
      display: flex
      justify-content: center
      user-select :none
      .btn
        width: 96px
        height: 40px
        line-height: 40px
        border-radius: 3px
        border: 1px solid $color-text-D9
        cursor :pointer
      .cancel
        border-right: 1px solid $color-line
      .confirm
        border-right: 1px solid $color-main
        background: $color-main
        color: $color-white
        margin-left: 20px
      .one-btn
        margin-left :0
    .title
      font-size: $font-size-16
      font-family: $font-family-medium
      height: 44px
      line-height: 44px
      padding: 0 15px
    .text
      font-size: $font-size-16
      color: $color-text-main
      height: 126px
      display: flex
      align-items: center
      justify-content: center
      margin: 10px 15px
      overflow-y :auto
      text-align :justify
      word-break :break-all
      line-height :1.4
</style>
