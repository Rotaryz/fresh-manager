<template>
  <div class="base-status-tab">
    <div v-for="(item, index) in statusList" :key="index" class="status-tab-item hand"
         :class="{'status-tab-item-active': statusIndex === index}" @click="checkStatus(index, item)"
    >
      {{item.name}} ({{item.num}})
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'BASE_STATUS_TAB'

  export default {
    name: COMPONENT_NAME,
    props: {
      statusList: {
        type: Array,
        default: () => {
          return [
            {name: '全部', value: '', num: 0}, {name: '待提交', value: 0, num: 0}, {name: '已完成', value: 1, num: 0}
          ]
        }
      }
    },
    data() {
      return {
        statusIndex: 0
      }
    },
    methods: {
      checkStatus(index, item) {
        this.statusIndex = index
        this.$emit('setStatus', item, index)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .base-status-tab
    margin-left: 30px
    display: flex
    background: #F6F6F6
    border-radius: 100px
    height: 30px
    box-sizing: border-box
    .status-tab-item
      border-radius: 100px
      padding: 0 20px
      color: $color-text-main
      line-height: 30px
      text-align: center
      transition: 0.2s all
      font-size: $font-size-14
      font-family: $font-family-regular
    .status-tab-item-active
      color: $color-white
      background: $color-main
</style>
