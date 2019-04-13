<template>
  <div class="group-tab">
    <section v-if="!groupList.length" class="add-wrapper" @click="showModalHandle('addChildren')">
      <div class="icon"></div>
      <p class="text">添加</p>
    </section>
    <section class="group-wrapper">

    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import {outreachGroupComputed, outreachGroupMethods} from '@state/helpers'

  const COMPONENT_NAME = 'GROUP_TAB'

  export default {
    name: COMPONENT_NAME,
    data() {
      return {

      }
    },
    computed: {
      ...outreachGroupComputed,
    },
    methods: {
      ...outreachGroupMethods,
      showModalHandle(key) {
        this.showModal({
          ctx: this.$parent,
          key
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .group-tab
    width: 140px
    height :861px
    border-right: 0.5px solid $color-line
    overflow-x : hidden
    overflow-y :scroll
    scroll-opacity()
    .group-wrapper
      height :250vh
    .add-wrapper
      display :flex
      align-items :center
      font-family: $font-family-regular
      font-size: 14px
      line-height :@font-size
      color: $color-positive
      padding :15px 17px
      &:hover
        cursor: pointer
      .icon
        width :14px
        height :@width
        icon-image(icon-add)
      .text
        padding-left :6px
</style>
