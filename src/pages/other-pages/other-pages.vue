<template>
  <base-panel>
    <div slot="content" class="other-pages" :style="isTwoPage? 'bottom: 0' : ''">
      <h1>up code is todo</h1>
      <h1 @click="showToast">toast</h1>
    </div>
  </base-panel>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'OTHER_PAGE'

  export default {
    name: PAGE_NAME,
    data() {
      return {
        isTwoPage: false
      }
    },
    created() {
      // todo
      let path = this.$route.path
      if (path !== '/other-pages') {
        this.isTwoPage = true
      }
    },
    methods: {
      showToast() {
        this.$toast.show('ashdahsdkajshdkad')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .other-pages
    background: azure
</style>
