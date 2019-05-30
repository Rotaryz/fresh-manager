<template>
  <default-modal ref="modal">
    <div slot="content" class="default-confirm">
      <div class="confirm-content">
        <div class="title-box">
          <div class="title">
            {{infoTitle}}
          </div>
          <span class="close hand" @click="cancel"></span>
        </div>
        <div class="text">{{text}}</div>
        <div v-if="oneBtn" class="btn-group">
          <span class="btn confirm one-btn" @click="cancel">确定</span>
        </div>
        <div v-else class="btn-group">
          <span class="btn cancel" @click="cancel">{{cancelText}}</span>
          <span class="btn confirm" @click="confirm">{{sureText}}</span>
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
      cancelText: {
        type: String,
        default: '取消'
      },
      sureText: {
        type: String,
        default: '确认'
      },
      oneBtn: {
        type: Boolean,
        default: false
      },
      infoTitle: {
        type: String,
        default: '温馨提示'
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
    width: 380px
    height: 185px
    background: #fff
    border-radius: 3px
    box-shadow: 0 8px 14px 0 rgba(12, 6, 14, 0.08)
    text-align: center
    padding: 0 20px
    box-sizing: border-box
    position: relative
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
        width: 12px
        height: @width
        icon-image('icon-close')
    .text
      margin-top: 7px
      font-size: $font-size-16
      font-family: $font-family-regular
      color: #666
      text-align: left
      word-break: break-all
      line-height: 1.4
</style>
