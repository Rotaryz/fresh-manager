<template>
  <default-modal ref="modal">
    <div slot="content" class="default-input">
      <div class="title-box">
        <div class="title">
          群等级说明
        </div>
        <span class="close hand" @click="cancel"></span>
      </div>
      <div class="main-data">
        <div class="data-table">
          <div class="table-list">
            <div class="table-title">
              <span class="text">数据指标</span>
              <span class="text">社群等级</span>
            </div>
            <span class="item grey">Lv1</span>
            <span class="item grey">Lv2</span>
            <span class="item grey">Lv3</span>
            <span class="item grey">Lv4</span>
          </div>
          <div v-for="(val, ind) in data" :key="ind" class="table-list">
            <span class="item title">{{val.name}}</span>
            <span v-for="(item, index) in val.data" :key="index" class="item">{{item}}</span>
          </div>
        </div>

        <div class="btn-group">
          <div class="btn confirm" @click="confirm">确定</div>
        </div>
      </div>
    </div>
  </default-modal>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'

  const COMPONENT_NAME = 'EDIT_MODAL'

  const DATA = [
    {
      name: '分享链接的浏览数(PV)',
      data: [100, 200, 300, 400]
    },
    {
      name: '主力客户',
      data: [100, 200, 300, 400]
    },
    {
      name: '支付订单',
      data: [100, 200, 300, 400]
    }
  ]

  export default {
    name: COMPONENT_NAME,
    components: {DefaultModal},
    props: {
      numberPla: {
        type: String,
        default: '请输入团长账号'
      }
    },
    data() {
      return {
        data: DATA
      }
    },
    methods: {
      show() {
        this.$refs.modal && this.$refs.modal.showModal()
      },
      hide() {
        this.$refs.modal && this.$refs.modal.hideModal()
      },
      confirm() {
        this.hide()
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
    .main-data
      padding: 10px 0 30px
      .data-table
        border-radius: 2px
        border: 0.5px solid $color-line
        font-size: $font-size-12
        font-family: $font-family-regular
        color: #666
      .table-list
        height: 50px
        display: flex
      .table-title
        width: 134px
        height: 50px
        position: relative
        background: #F5F7FA
        border-bottom: 0.5px solid $color-line
        &:before
          content: ""
          width: 143px
          height: 1px
          border-top: 0.5px solid $color-line
          position: absolute
          left: 0
          top: 0
          transform: rotate(20deg)
          transform-origin: 0 0
        .text
          position: absolute
          left: 8px
          bottom: 4px
          font-size: $font-size-12
          &:last-child
            left: auto
            right: 8px
            bottom: auto
            top: 4px
      .item
        width: 90px
        height: 50px
        line-height: 50px
        text-align: center
        border-bottom: 0.5px solid $color-line
        border-left: 0.5px solid $color-line
        font-size: $font-size-12
      .title
        width: 134px
        height: 50px
        background: #F5F7FA
        line-height: 16px
        padding: 0 10px
        display: flex
        align-items: center
        border-left: 0
        text-align: left
      .grey
        background: #F5F7FA
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
