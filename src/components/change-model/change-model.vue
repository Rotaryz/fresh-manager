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
        <div v-if="showCate" class="main-model-box">
          <div class="text">上级类目</div>
          <div class="categories-input-box">
            <base-drop-down :select="dispatchSelect" @setValue="setValue"></base-drop-down>
          </div>
        </div>
        <div class="main-model-box">
          <div class="text">类目名称</div>
          <input v-model="pointName" type="text" class="main-input-box" :placeholder="numberPla">
        </div>
        <div class="main-model-box">
          <div class="text">排序号</div>
          <input v-model="pointNumber" type="number" class="main-input-box" placeholder="0">
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
          content: '类目',
          type: 'default',
          data: [{name: ''}]
        },
        typeId: 0,
        selectItem: {id: ''}
      }
    },
    methods: {
      show(title, text, number) {
        this.numberTitle = title
        this.pointName = text
        this.pointNumber = number
        this.$refs.modal && this.$refs.modal.showModal()
      },
      hide() {
        this.$refs.modal && this.$refs.modal.hideModal()
      },
      setData(item, data) {
        this.typeId = item.id
        this.dispatchSelect.content = item.name
        this.dispatchSelect.data = data
      },
      confirm() {
        this.$emit('confirm', this.pointName, this.pointNumber, this.typeId)
      },
      cancel() {
        this.hide()
        this.$emit('cancel')
      },
      setValue(item) {
        this.typeId = item.id
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
    .one-btn
      margin-left: 0
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
