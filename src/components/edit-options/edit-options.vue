<template>
  <div class="edit-options">
    <div class="edit-title">
      <span v-if="importance" class="key-word">*</span>
      {{title}}
    </div>
    <slot name="middle"></slot>
    <slot name="right"></slot>
  </div>
<!--  <div class="edit-item">-->
<!--    <div class="edit-title">-->
<!--      <span class="start">*</span>-->
<!--      划线价-->
<!--    </div>-->
<!--    <div class="edit-input-box">-->
<!--      <input v-model="sale_skus.original_price" type="number" class="edit-input" maxlength="10">-->
<!--    </div>-->
<!--    <div v-if="goods_skus.sale_unit" class="edit-pla">元/{{goods_skus.sale_unit}}</div>-->
<!--  </div>-->
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'EDIT_OPTIONS'

  export default {
    name: COMPONENT_NAME,
    props: {
      title: {
        type: String,
        default: ''
      },
      importance: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {}
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .edit-options
    display: flex
    color: #2A2A2A
    min-height: 40px
    margin-top: 24px
    .edit-title
      margin-top: 7.5px
      font-size: $font-size-14
      font-family: $font-family-regular
      white-space: nowrap
      text-align: right
      width: 64px
    .key-word
      display: inline-block
      margin-right: -2px
      color: #F52424
</style>
