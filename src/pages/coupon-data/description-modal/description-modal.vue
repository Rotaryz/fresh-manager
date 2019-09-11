<template>
  <default-modal ref="modal">
    <div slot="content" class="default-input">
      <div class="title-box">
        <div class="title">{{desText[desIndex].title}}</div>
        <span class="close hand" @click="hide"></span>
      </div>
      <div class="main-data">
        <div class="text-box">
          <p class="main-text">{{desText[desIndex].text}}</p>
        </div>
        <div class="btn-group">
          <div class="btn confirm" @click="hide">确定</div>
        </div>
      </div>
    </div>
  </default-modal>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'

  const COMPONENT_NAME = 'SESCRIPTION_MODAL'
  const DES = [
    {
      title: '用券成交金额',
      text: '使用该优惠券的订单付款总金额'
    },
    {
      title: '优惠总金额',
      text: '使用该优惠券优惠的总金额'
    },
    {
      title: 'ROI',
      text: '用券总成交额/优惠总金额'
    }
  ]

  export default {
    name: COMPONENT_NAME,
    components: {DefaultModal},
    props: {},
    data() {
      return {
        desText: DES,
        desIndex: 0
      }
    },
    methods: {
      show(index) {
        this.desIndex = index
        this.$refs.modal && this.$refs.modal.showModal()
      },
      hide() {
        this.$refs.modal && this.$refs.modal.hideModal()
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
      padding: 23px 0 16px
      align-items: center
      justify-content: space-between
      .title
        font-size: $font-size-16
        font-family: $font-family-medium
        line-height: 1
        color: $color-text-main
        font-weight: 600
      .close
        width: 12px
        height: @width
        icon-image('icon-close')
    .main-data
      .text-box
        margin-bottom: 28px
        fonts-zie: $font-size-14
        color: #666
      .tip
        font-family: $font-family-regular
        color: #666
      .text-title
        color: #333
        font-family: $font-family-medium
      .main-text
        color: #666
        font-family: $font-family-regular
        .text
          word-break: break-all
          margin-right: 24px
          &:nth-child(2)
            margin-right: 0
</style>
