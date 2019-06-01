<template>
  <default-modal ref="modal">
    <div slot="content" class="default-input">
      <div class="title-box">
        <div class="title">群等级说明</div>
        <span class="close hand" @click="hide"></span>
      </div>
      <div class="main-data">
        <div v-for="(item, index) in desText" :key="index" class="text-box">
          <p class="text-title">{{item.title}}</p>
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
      text: ['高销售量：占全部商品总销售量的20%', '高销售额：占全部商品总销售额的10%', '高浏览数：占全部商品总浏览数的20%', '必须满足其中两个条件'],
    },{
      title: '引流品',
      text: ['高浏览数：占全部商品总浏览数的20%'],
    },{
      title: '粘性品',
      text: ['高销售量：占全部商品总销售量的20%'],
    },{
      title: '利润品',
      text: ['高销售额：占全部商品总销售额的10%'],
    },{
      title: '其它',
      text: ['为商品都不满足其它三个品的条件']
    }
  ]

  export default {
    name: COMPONENT_NAME,
    components: {DefaultModal},
    props: {
    },
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
      padding: 0 0 30px
      .text-box
        margin-bottom: 20px
        fonts-zie: $font-size-14
        color: #2A2A2A
      .text-title
        font-family: $font-family-medium
      .main-text
        font-family: $font-family-regular
        .text
          word-break: break-all
          margin-right: 15px
          &:nth-child(2)
            margin-right: 0
</style>
