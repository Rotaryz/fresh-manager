<template>
  <div class="base-sort hand">
    <span :class="{'sort-down-active': sortIndex === 0}" class="sort-down"></span>
    <span :class="{'sort-up-active': sortIndex === 1}" class="sort-up"></span>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'BASE_SORT'

  export default {
    name: COMPONENT_NAME,
    props: {
      sortStatus: {
        // 排序的数字let arr = [4,5]  arr[0] -> 降序  arr[1] -> 升序
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data() {
      return {
        sortIndex: -1
      }
    },
    methods: {
      setSort() {
        this.sortIndex = this.sortIndex === -1 ? 1 : this.sortIndex === 1 ? 0 : 1
        // this.$emit('getSortStatus', this.sortStatus[this.sortIndex])
        return this.sortStatus[this.sortIndex]
      },
      infoSort() {
        this.sortIndex = -1
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .base-sort
    display: inline-block
    position: relative
    width: 13px
    height: 20px
    transform :translateY(-2px)
    padding-left: 5px

  .sort-up
    border: 4px solid transparent
    border-top: 4px solid #ACACAC
    position: absolute
    left: 5px
    transition: all 0.3s
    bottom: -2px

  .sort-down
    border: 4px solid transparent
    border-bottom: 4px solid #ACACAC
    position: absolute
    left: 5px
    top: 3px
    transition: all 0.3s

  .sort-up-active
    border: 4px solid transparent
    border-top: 4px solid $color-main

  .sort-down-active
    border: 4px solid transparent
    border-bottom: 4px solid $color-main
</style>
