<template>
  <base-panel>
    <div slot="content" class="test-page">
      test-page
      <h1 @click="test">confirm</h1>
      <h2 @click="user">userInfo</h2>
      <h3 @click="uuu">update-user</h3>
      <default-confirm ref="confirm"></default-confirm>
    </div>
  </base-panel>
</template>

<script type="text/ecmascript-6">
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import {oauthComputed, oauthMethods} from '@state/helpers'

  const PAGE_NAME = 'TEST_PAGE'

  export default {
    name: PAGE_NAME,
    components: {
      DefaultConfirm
    },
    data() {
      return {}
    },
    computed:{
      ...oauthComputed,
    },
    created() {
    },
    methods: {
      ...oauthMethods,
      test() {
        this.$refs.confirm.show('123123')
      },
      user() {
        console.log(this.info, '111111111111')
      },
      uuu() {
        this.update(12123)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .test-page
    width: 100%;
    height :500px
    background #fff
</style>
