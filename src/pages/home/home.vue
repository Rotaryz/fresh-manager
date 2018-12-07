<template>
  <div class="home" @touchmove.prevent>
    <navigation></navigation>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Navigation from './navigation/navigation'
  const PAGE_NAME = 'HOME'

  export default {
    name: PAGE_NAME,
    page: {
      title: 'Home',
      meta: [{name: 'description', content: 'description'}]
    },
    components: {
      Navigation
    },
    created() {
      console.log(1111)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
</style>
