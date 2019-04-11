<template>
  <div :style="{padding: padding[0]+'px '+ padding[1]+'px'}">
    <div class="flow">
      <img :src="flowImg" alt="流程关系线" :width="flowImgWidth" draggable="false">
      <slot></slot>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'FOLW'
  export default {
    name: PAGE_NAME,
    props: {
      flowImg: {
        type: String,
        default: ''
      },
      flowImgWidth: {
        type: [Number, String],
        default: 1048
      },
      padding: {
        type: Array,
        default: () => [40, 120]
      }
    },
    data() {
      return {}
    },
    methods: {
      getStyle() {
        let style =  {
          wdith: this.flowImgWidth + 'px',
          padding: `${this.padding[0]}px ${this.padding[1]}px`
        }
        return style
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .flow
    position relative
    text-align left

</style>
