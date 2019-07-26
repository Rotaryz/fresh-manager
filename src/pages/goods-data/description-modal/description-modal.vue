<template>
  <default-modal ref="modal">
    <div slot="content" class="default-input">
      <div class="title-box">
        <div class="title">商品结构说明</div>
        <span class="close hand" @click="hide"></span>
      </div>
      <div class="main-data">
        <div v-for="(item, index) in desText" :key="index" class="text-box">
          <p class="text-title">{{item.title}}<span v-if="index === 0" class="tip">(满足其中两个条件)</span></p>
          <p class="main-text">
            <span v-for="(val, ind) in item.text" :key="ind" class="text">{{val}}</span>
          </p>
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
      title: '爆款品',
      text: ['高销售量：占全部商品总销售量的5%', '高销售额：占全部商品总销售额的5%', '高浏览数：占全部商品总浏览数的5%']
    },
    {
      title: '引流品',
      text: ['高浏览数：占全部商品总浏览数的5%']
    },
    {
      title: '粘性品',
      text: ['高销售量：占全部商品总销售量的5%']
    },
    {
      title: '利润品',
      text: ['高销售额：占全部商品总销售额的5%']
    },
    {
      title: '其它',
      text: ['商品都不满足其它四个品(爆款品、引流品、粘性品、利润品)的条件']
    }
  ]

  export default {
    name: COMPONENT_NAME,
    components: {DefaultModal},
    props: {},
    data() {
      return {
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
      padding: 0 0 12px
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
