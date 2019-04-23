<template>
  <div ref="leftTab" class="left-tab" @scroll="tabScroll">
    <div ref="leftBox" class="left-box">
      <div class="left-tab-item hand" :class="{'active': +tabIndex === 0}" @click="changeCommunity(0, {id: 0})">
        <div class="left">
          <span class="name">全部群数据({{communityList.length}})</span>
        </div>
        <div v-if="+tabIndex === 0" class="right">
          <div class="btn">
            <span class="edit-icon" :class="{'current no-edit': +tabIndex === 0}"></span>
          </div>
        </div>
      </div>
      <div
        v-for="(item, index) in communityList"
        :key="index"
        class="left-tab-item hand"
        :class="{'active': +tabIndex === index+1, 'grey': item.blocked}"
        @click="changeCommunity(index+1, item)"
      >
        <div class="left">
          <div class="head">
            <img v-for="(val, ind) in item.head_images" :key="ind" :src="require('./head/pic-'+ val +'.png')" alt="" class="head-image">
            <div class="bg"></div>
            <img :src="require('./'+ lvArr[item.level] +'@2x.png')" alt="" class="level-icon">
          </div>
          <span class="name">{{item.name}}</span>
        </div>
        <div class="right" @click.stop="editGroup(item)">
          <div class="btn">
            <span class="edit-icon" :class="{'current': +tabIndex === index+1}"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="left-tab-item last"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {communityComputed} from '@state/helpers'
  const COMPONENT_NAME = 'LEFT-TAB'
  const LV_ARR = ['icon-v0', 'icon-v1', 'icon-v2', 'icon-v3', 'icon-v4']
  export default{
    name: COMPONENT_NAME,
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
        tabIndex: 0,
        groupArr: new Array(20).fill(1),
        getMore: false,
        lvArr: LV_ARR
      }
    },
    computed: {
      ...communityComputed
    },
    methods: {
      changeCommunity(index, item) {
        this.tabIndex = index
        this.$emit('changeCommunity', index, item)
      },
      editGroup(item) {
        this.$emit('editGroup', item)
      },
      tabScroll() {
        // let leftBoxHeight = this.$refs.leftBox.offsetHeight
        // let leftTabHeight = this.$refs.leftTab.offsetHeight
        // let scrollTop = this.$refs.leftTab.scrollTop
        // if (leftBoxHeight > leftTabHeight && (scrollTop >= leftBoxHeight - leftTabHeight)) {
        //   if (this.getMore) return
        //   this.getMore = true
        //   this.groupArr.push(new Array(10).fill(1))
        //   setTimeout(() => {
        //     this.getMore = false
        //   }, 200)
        // }
      }
    }
  }

</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .left-tab
    width: 176px
    padding-right: 6px
    height: 870px
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
    &:hover::-webkit-scrollbar
      width: 6px
      height: 8px
    .left-tab-item
      height: 60px
      width: 170px
      display: flex
      align-items: center
      justify-content: space-between
      padding-left: 12px
      color: $color-text-main
      font-size: $font-size-14
      font-family: $font-family-regular
      position: relative
      border-bottom: 0.5px solid $color-line
      border-right: 0.5px solid $color-line
      transition: color 0.3s
      flex: 0 0 auto
      &:hover
        color: $color-positive
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
      &:before
        content: ''
        position: absolute
        left: 0
        top: 0
        height: 60px
        width: 3px
        background-color: transparent
        transition: all 0.3s
      .left
        display: flex
        align-items: center
        .head
          width: 28px
          height: 28px
          background: #E0E0E0
          margin-right: 8px
          border-radius: 1.1px
          position: relative
          padding-top: 1px
          padding-left: 1px
          .head-image
            width: 8px
            height: 8px
            float: left
            margin-right: 1px
            margin-bottom: 1px

          .level-icon
            width: 14px
            height: 14px
            position: absolute
            right: -2px
            bottom: -2px
        .name
          font-size: $font-size-14
          line-height: 18px
          width: 98px
          overflow: hidden
          display: -webkit-box
          -webkit-line-clamp: 2
          -webkit-box-orient: vertical
          word-break: break-all
      .right
        width: 24px
        height: 48px
        padding-left: 6px
        display: flex
        justify-content: center
        align-items: center
        &:hover
          .edit-icon
            background-image: url("./icon-edit_hover@2x.png")
          .no-edit
            background-image: url("./icon-right_greed@2x.png")
      .btn
        width: 12px
        height: 12px
        border-radius: 50%
        margin-right: 7px
        .current
          width: 12px
          height: 12px
          background-repeat: no-repeat
          background-position: center
          background-size: cover
          margin-right: 10px
          display: block
          transition: all 0.3s
          background-image: url("./icon-right_greed@2x.png")

    .last
      border-bottom: 0
      min-height: 80px
      flex: 1 0 0
    .active
      color: $color-positive
      border-right: 0.5px solid transparent
      &:before
        background-color: $color-positive
      .name
        font-family: $font-family-medium
    .grey
      color: #ccc
      .bg
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        background: rgba(255,255,255,.6)
  .bottom
    width: 20px
</style>
