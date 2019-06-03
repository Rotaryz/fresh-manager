<template>
  <default-modal ref="modal">
    <div slot="content" class="default-input">
      <div class="title-box">
        <div class="title">
          {{des[desIndex]}}
        </div>
        <span class="close hand" @click="hide"></span>
      </div>
      <div class="main-data">
        <div v-for="(item, index) in desText" :key="index">
          <div v-if="desIndex === index">
            <p v-for="(val, ind) in item" :key="ind" class="main-text">{{val}}</p>
          </div>
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
    ['高订单量(支付订单)', '商品浏览量(PV)', '利润率0至1%'],
    ['商品浏览量(PV)', '利润率0至1%'],
    ['高销售量', '利润率0至1%'],
    ['销售金额']
  ]

  export default {
    name: COMPONENT_NAME,
    components: {DefaultModal},
    props: {
      desIndex: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        des: ['爆款品', '引流品', '粘性品', '利润品'],
        desText: DES
      }
    },
    methods: {
      show() {
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
      padding: 23px 0
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
      padding: 10px 40px 30px
      .main-text
        color: #666
        font-family: $font-family-regular
        font-size: $font-size-16
        display: block

</style>
