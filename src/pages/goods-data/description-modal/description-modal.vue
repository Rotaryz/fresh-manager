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
    ['高销售量：占全部商品总销售量的20%', '高销售额：占全部商品总销售额的10%', '高浏览数：占全部商品总浏览数的20%', '必须满足其中两个条件'],
    ['定义高浏览数：占全部商品总浏览数的20%'],
    ['定义高销售量：占全部商品总销售量的20%'],
    ['定义高销售额：占全部商品总销售额的10%'],
    ['定义为商品都不满足其它三个品的条件']
  ]

  export default {
    name: COMPONENT_NAME,
    components: {DefaultModal},
    props: {
    },
    data() {
      return {
        des: ['爆款品', '引流品', '粘性品', '利润品', '其他'],
        desText: DES,
        desIndex: 0
      }
    },
    methods: {
      show(type) {
        let index = this.des.findIndex(item => {
          return item === type
        })
        this.desIndex = index > 0 ? index : 0
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
