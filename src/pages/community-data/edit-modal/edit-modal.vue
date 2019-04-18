<template>
  <default-modal ref="modal">
    <div slot="content" class="default-input">
      <div class="title-box">
        <div class="title">
          编辑群信息
        </div>
        <span class="close hand" @click="cancel"></span>
      </div>
      <div class="main-input">
        <div class="main-model-box">
          <div class="text">团长账号</div>
          <input v-model="msg.account" type="number" readonly class="main-input-box grey" placeholder="请输入团长账号">
        </div>
        <div class="main-model-box">
          <div class="text">微信群名称</div>
          <input v-model="msg.name" type="text" class="main-input-box" placeholder="请输入微信群名称">
        </div>
        <div class="main-model-box">
          <div class="text">微信群人数</div>
          <input v-model="msg.total" type="number" class="main-input-box" placeholder="请输入微信群人数">
        </div>
        <div class="btn-group">
          <div class="btn cancel" @click="cancel">取消</div>
          <div class="btn confirm" @click="confirm">确定</div>
        </div>
      </div>
    </div>
  </default-modal>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'

  const NUMBER = /^[1-9]\d*$/
  const COMPONENT_NAME = 'EDIT_MODAL'

  export default {
    name: COMPONENT_NAME,
    components: {DefaultModal},
    data() {
      return {
        msg: {
          account: '',
          name: '',
          total: '',
          id: ''
        }
      }
    },
    methods: {
      show(data) {
        this.msg = Object.assign({}, data)
        this.$refs.modal && this.$refs.modal.showModal()
      },
      hide() {
        this.$refs.modal && this.$refs.modal.hideModal()
      },
      confirm() {
        if (!this.msg.name) {
          this.$toast.show('请输入微信群名称')
          return
        }
        if (!NUMBER.test(this.msg.total)) {
          this.$toast.show('请输入微信群人数')
          return
        }
        this.$emit('confirm', this.msg)
        this.hide()
      },
      cancel() {
        this.hide()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .default-input
    background: #fff
    width: 534px
    border-radius: 2px
    padding: 0 20px 60px
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
    .main-input
      padding: 10px 0 16px
      .main-input-box
        width: 310px
        height: 44px
        border: 1px solid $color-line
        border-radius: 2px
        font-family: $font-family-regular
        color: $color-text-main
        font-size: $font-size-14
        padding-left: 14px
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
      .grey
        color: $color-text-assist
        background: #F9F9F9
  .btn-group
    text-align: center
    display: flex
    justify-content: flex-end
    user-select: none
    .btn
      width: 96px
      height: 40px
      line-height: 40px
      border-radius: 2px
      border: 1px solid $color-text-D9
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
  .main-model-box
    layout(row)
    align-items: center
    margin-bottom: 24px
    .text
      color: #666
      font-size: $font-size-14
      font-family: $font-family-regular
      width: 80px
      margin-right: 20px
      &:before
        content: "*";
        color: #f52424;
</style>
