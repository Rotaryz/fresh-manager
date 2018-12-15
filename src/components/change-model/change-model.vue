<template>
  <default-modal ref="modal">
    <div slot="content" class="default-input">
      <div class="title-input">
        <div class="title">{{numberTitle}}</div>
        <div class="close-box" @click="cancel">
          <div class="close"></div>
        </div>
      </div>
      <div class="main-input">
        <div v-if="showCate" class="main-model-box">
          <div class="text">上级分类</div>
          <div class="edit-input-box">
            <base-drop-down :select="dispatchSelect" @setValue="setValue"></base-drop-down>
          </div>
        </div>
        <div class="main-model-box">
          <div class="text">分类名称</div>
          <input v-model="pointName" type="text" class="main-input-box" :placeholder="numberPla">
        </div>
        <div class="main-model-box">
          <div class="text">排序号</div>
          <input v-model="pointNumber" type="text" class="main-input-box" placeholder="0">
        </div>
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
  const COMPONENT_NAME = 'CHANGE_MODEL'

  export default {
    name: COMPONENT_NAME,
    components: {DefaultModal},
    props: {
      numberPla: {
        type: String,
        default: '长度不能超过5位'
      },
      showCate: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        numberTitle: '',
        pointName: '',
        pointNumber: '',
        dispatchSelect: {
          check: false,
          show: false,
          content: '全部社区',
          type: 'default',
          data: [{title: 'sdsd'}, {title: 'sds'}] // 格式：{title: '55'}
        }
      }
    },
    methods: {
      show(title, text, number) {
        this.numberTitle = title
        this.pointName = text
        console.log(this.pointName, '111111')
        this.pointNumber = number
        this.$refs.modal && this.$refs.modal.showModal()
      },
      hide() {
        this.$refs.modal && this.$refs.modal.hideModal()
      },
      confirm() {
        this.hide()
        this.$emit('confirm', this.pointName, this.pointNumber)
      },
      cancel() {
        this.hide()
        this.$emit('cancel')
      },
      setValue(item) {
        console.log(item, '111')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .default-input
    background: #fff
    width: 534px
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
      padding: 42px 20px 30px 20px
      .main-input-box
        width: 310px
        height: 44px
        border: 1px solid #e1e1e1
        border-radius: 4px
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
    margin-top: 40px
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
    .confirm
      border: 1px solid $color-main
      background: $color-main
      color: $color-white
      margin-left: 20px
    .one-btn
      margin-left :0
  .main-model-box
    layout(row)
    align-items: center
    margin-bottom: 24px
    .text
      color: #666
      font-size: $font-size-14
      font-family: $font-family-regular
      width: 60px
      margin-right: 36px
</style>
