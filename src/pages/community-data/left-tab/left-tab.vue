<template>
  <div class="left-tab">
    <div class="left-tab-item hand" :class="{'active': +tabIndex === 0}" @click="changeCommunity(0)">
      <div class="left">
        <span class="name">全部群数据</span>
      </div>
      <div class="right">
        <span class="edit-icon" :class="{'current': +tabIndex === 0}"></span>
      </div>
    </div>
    <div
      v-for="(item, index) in new Array(30).fill(1)"
      :key="index"
      class="left-tab-item hand"
      :class="{'active': +tabIndex === index+1}"
      @click="changeCommunity(index+1)"
    >
      <div class="left">
        <img src="./icon-v4@2x.png" alt="" class="level-icon">
        <span class="name">社区A微信群</span>
      </div>
      <div class="right">
        <span class="edit-icon" :class="{'current': +tabIndex === index+1}"></span>
      </div>
    </div>
    <div class="left-tab-item" style="flex: 1 0 0"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    props: {
      tabArr: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data() {
      return {
        tabIndex: 0
      }
    },
    methods: {
      changeCommunity(index) {
        this.tabIndex = index
      }
    }
  }

</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .left-tab
    width: 146px
    padding-right: 6px
    height: 850px
    overflow-y: auto
    display: flex
    flex-direction: column
    &::-webkit-scrollbar
      width: 0
      height: 0
      transition: all 0.2s
    &::-webkit-scrollbar-thumb
      background-color: rgba(0, 0, 0, .15)
      border-radius: 10px
    &::-webkit-scrollbar-thumb:hover
      background-color: rgba(0, 0, 0, .3)
    &::-webkit-scrollbar-track
      box-shadow: inset 0 0 6px rgba(0, 0, 0, .15)
      border-radius: 0
    &:hover::-webkit-scrollbar
      width: 6px
      height: 8px
    .left-tab-item
      height: 50px
      width: 140px
      display: flex
      align-items: center
      justify-content: space-between
      padding-left: 20px
      color: $color-text-main
      font-size: $font-size-12
      font-family: $font-family-regular
      position: relative
      border-bottom: 0.5px solid $color-line
      border-right: 0.5px solid $color-line
      transition: color 0.3s
      flex: 0 0 auto
      &:before
        content: ''
        position: absolute
        left: 0
        top: 0
        height: 50px
        width: 2px
        background-color: transparent
        transition: all 0.3s
      .left
        display: flex
        align-items: center
        .level-icon
          width: 12px
          height: 12px
          margin-right: 5px
        .name
          font-size: $font-size-12
      .edit-icon
        width: 12px
        height: 12px
        background-image: url("./icon-edit_default@2x.png")
        background-repeat: no-repeat
        background-position: center
        background-size: cover
        margin-right: 10px
        display: block
        transition: all 0.3s
        &:hover
          background-image: url("./icon-edit_hover@2x.png")
      .right
        width: 12px
        height: 12px
        border-radius: 50%
        margin-right: 6px
        .current
          background-image: url("./icon-right_greed@2x.png")

    .active
      color: $color-positive
      border-right: 0.5px solid transparent
      &:before
        background-color: $color-positive
  .bottom
    width: 20px
</style>
