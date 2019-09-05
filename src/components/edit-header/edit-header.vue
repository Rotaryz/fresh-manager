<template>
  <div class="edit-header content-header">
    <div class="content-title">{{title}}</div>
    <div v-if="btnText" class="btn-main" @click="buttonHandle">{{btnText}}</div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'EDIT_HEADER'

  export default {
    name: COMPONENT_NAME,
    props: {
      title: {
        type: String,
        default: ''
      },
      btnText: {
        type: String,
        default: ''
      }
    },
    data() {
      return {

      }
    },
    methods: {
      buttonHandle() {
        this.$emit('button')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .edit-header
    align-items :flex-end !important
    min-height :(28+15)px
</style>
