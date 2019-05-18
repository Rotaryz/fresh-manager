<template>
  <div class="admin-select">
    <div class="select-item" @click.stop="selectType">
      <div class="admin-big-box" @mouseleave.stop="mouseLeave" @mouseenter.stop="mouseEnter">
        <div class="admin-select-box input-height-item" :class="{'button-dropdown':isButtonDropdown,'admin-select-box-active': select.check}" :style="{'min-width': width + 'px',height: height + 'px', lineHeight: height + 'px'}">
          {{select.content}}
          <div v-if="isUse" class="show-icon"></div>
          <transition name="fade">
            <div v-show="select.check" class="select-child" :style="{top: (height - 4) + 'px'}">
              <ul class="down-content-ul" @mouseleave.stop="leaveHide()" @mouseenter.stop="endShow">
                <li v-for="(child, chIdx) in select.data" :key="chIdx" class="select-child-item" :class="{active:child[labelKey]===select.content && !isButtonDropdown}" :style="{height: itemHeight + 'px', lineHeight: itemHeight + 'px'}"
                    @click.stop="setValue(child, chIdx)"
                >
                  {{child[labelKey]}}
                </li>
              </ul>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      trigger:{
        type:String,
        default:'click'
      },
      isButtonDropdown:{
        type:Boolean,
        default:false
      },
      labelKey:{
        type:String,
        default:'name'
      },
      select: {
        type: Object,
        default: () => {
          return {
            check: false,
            show: false,
            content: '全部',
            type: 'default',
            data: [] // 格式：{name: '55'}
          }
        }
      },
      isUse: {
        type: Boolean,
        default: true
      },
      itemHeight: {
        type: Number,
        default: 40
      },
      width: {
        type: Number,
        default: 102
      },
      height: {
        type: Number,
        default: 28
      }
    },
    data() {
      return {
        setTime: '',
        selectIdx: -1
      }
    },
    mounted() {
      window.onclick = () => {
        this.select.check = false
      }
    },
    methods: {
      mouseLeave(){
        console.log('離開上方')
        if(this.trigger==='hover'){
          this.setTime && clearTimeout(this.setTime)
          this.setTime = setTimeout(()=>{
            this.clickHide()
          },1000)
        }
      },
      mouseEnter(){
        console.log('已經上方')
        if(this.trigger==='hover'){
          this.setTime && clearTimeout(this.setTime)
          this.select.check = true
        }
      },
      clickHide() {
        this.select.check = false
      },
      endShow() {
        console.log('已經下方')
        this.setTime && clearTimeout(this.setTime)
        this.select.check = true
      },
      leaveHide() {
        console.log('離開下方')
        this.setTime = setTimeout(() => {
          this.clickHide()
        }, 1500)
      },
      selectType() {
        if (!this.isUse) {
          return
        }
        if (!this.select.data.length) {
          return
        }
        this.select.check = !this.select.check
        this.$emit('selectType', this.select)
      },
      setValue(value, index) {
        this.select.check = false
        this.selectIdx = index
        if(!this.isButtonDropdown){
          this.select.content = value.name
        }
        this.$emit('setValue', value, index)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .admin-select
    box-sizing: border-box
    display: flex
  .select-item
    display: flex
    align-items: center
    position: relative
    &:first-child
      margin-left: 0px
  .admin-big-box
    cursor: pointer
    box-sizing: border-box
    border-radius: 2px
    font-size: $font-size-medium
    color: $color-text-main
    position: relative
    .admin-select-box
      display: flex
      align-items: center
      justify-content space-between
      min-width: 102px
      border-radius: 2px
      border 1px solid $color-line
      padding: 0 31px 0 15px
      line-height: 27px
      white-space: nowrap
      font-size: $font-size-12
      position: relative
      color: $color-text-sub
      box-sizing: border-box
      transition: all 0.2s
      .show-icon
        width: 8px
        height: 6px
        margin-left: 6px
        position: relative
        width: 8px
        height: @width
        col-center()
        right: 10px
        transform-origin: 50% 0
        transform: rotate(0deg) translateY(-50%)
        transition: transform 0.3s
        &:after
          content: ''
          position: absolute
          z-index: 99
          top: 0
          right: 0
          width: 0
          height: 0
          border-left: 4px solid transparent
          border-right: 4px solid transparent
          border-top: 6px solid #000
      .select-child
        left: 0
        background: $color-white
        z-index: 300
        position: absolute
        border-radius: 3px
        box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.20)
        margin-top: 10px
        min-width: 100%
        .down-content-ul
          max-height: 350px
          overflow-y: auto
        &::-webkit-scrollbar
          width: 8px
          height: 10px
        &::-webkit-scrollbar-thumb
          background-color: rgba(0, 0, 0, .15)
          border-radius: 10px
        &::-webkit-scrollbar-thumb:hover
          background-color: rgba(0, 0, 0, .3)
        &::-webkit-scrollbar-track
          box-shadow: inset 0 0 6px rgba(0, 0, 0, .15)
          border-radius: 10px
        &.fade-enter, &.fade-leave-to
          opacity: 0
        &.fade-enter-to, &.fade-leave-to
          transition: opacity .3s ease-in-out
        .select-child-item
          white-space: nowrap
          color: $color-text-main
          padding: 0 11px
          text-align: left
          height: 40px
          line-height: 40px
          font-size: 14px
          font-family: $font-family-regular
          border-bottom: 0.5px solid $color-line
          box-sizing: border-box
          &:hover,&.active
            color: $color-main
      &:hover
        border-color: #ACACAC
      &.admin-select-box-active
        border-color: $color-main !important
        color: $color-text-main
        .show-icon
          transform-origin: 50% 0
          transform: rotate(180deg) translateY(-50%)
          transition: transform 0.3s
      &.button-dropdown
        border 1px solid $color-positive
        color: $color-positive
        .select-child:before
          content: ""
          position: absolute
          z-index: 99
          top: -8px
          right: 32px
          width: 0
          height: 0
          border-left: 4px solid transparent
          border-right: 4px solid transparent
          border-bottom: 8px solid #ebebeb
        .show-icon:after
          border-top: 6px solid  $color-positive
        &.admin-select-box-active
          color: $color-white
          background-color $color-positive
          .show-icon:after
            border-top: 6px solid  $color-white


  /*下方不知道是否有使用*/
  .categories-input-box
    .admin-big-box
      margin-left: 0 !important
      .admin-select-box
        font-size: $font-size-14 !important
        min-width: 310px !important
        margin-left: 0
        line-height: 44px !important
        height: 44px !important
  .select-title
    font-size: $font-size-medium
    line-height: 17px
    no-wrap()

</style>
