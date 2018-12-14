<template>
  <div class="auxiliary-information">
    <div class="all-title">
      <div class="name">计量单位</div>
      <div class="line"></div>
    </div>
    <div class="auxiliary-box">
      <div v-for="(item, index) in [1, 2, 3, 4, 5, 6, 7, 8, 2, 3, 4, 5, 6, 7, 8, 2, 3, 4, 5, 6, 7, 8]" :key="index" class="auxiliary-item">
        <div class="text">斤{{item}}</div>
        <div class="auxiliary-model">
          <div class="img-box" @click="changeItem"></div>
          <div class="img-box del" @click="delItem"></div>
        </div>
      </div>
      <div class="btn-main auxiliary-add">新增+</div>
    </div>
    <default-confirm ref="confirm"></default-confirm>
    <default-input ref="modalBox" @confirm="confirmInput"></default-input>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import DefaultInput from '@components/default-input/default-input'
  const PAGE_NAME = 'AUXILIARY_INFORMATION'
  const TITLE = '辅助资料'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultConfirm,
      DefaultInput
    },
    data() {
      return {}
    },
    methods: {
      delItem() {
        this.$refs.confirm.show('确定要删除该单位？')
      },
      changeItem() {
        this.$refs.modalBox.show('1221', '新增计量单位', '长度不能超过5位')
      },
      confirmInput(text) {
        console.log(text)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .all-title
    padding: 29px 0 16px
    border-bottom: 1px solid #e1e1e1
    position: relative
    .name
      font-size: $font-size-16
      line-height: 1
      color: $color-text-main
      font-family: $font-family-medium
    .line
      position: absolute
      width: 34px
      height: 2px
      background: $color-main
      bottom: -1px
      left: 0
  .auxiliary-box
    margin-top: 32px
    layout(row)
    .auxiliary-item
      min-width: 80px
      height: 32px
      border-1px(#333, 4px)
      text-align: center
      position: relative
      margin-right: 10px
      margin-bottom: 20px
      .text
        font-size: $font-size-14
        color: $color-text-main
        line-height: 32px
        font-family: $font-family-regular
      .auxiliary-model
        opacity: 0
        position: absolute
        width: 100%
        height: 100%
        border-radius: 4px
        background: rgba(51,51,51,0.9)
        left: 0
        top: 0
        padding: 0 11px
        box-sizing: border-box
        layout(row)
        align-items: center
        justify-content: space-between
        .img-box
          width: 22px
          height: 22px
          border-radius: 50%
          background: #fff
          cursor: pointer
          background-size: 22px
          bg-image('icon-quit_round')
        .del
          bg-image('icon-delete_round')
        &:hover
          opacity: 1
    .auxiliary-add
      min-width: 80px
      margin-bottom: 20px
      text-align: center
      padding: 10px 16px
  .auxiliary-information
    width: 100%
</style>
