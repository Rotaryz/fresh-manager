<template>
  <div class="admin-select">
    <div class="select-item" @click.stop="selectType">
      <div class="admin-big-box">
        <div class="admin-select-box input-height-item" :class="[{'admin-select-box-active': visible}, {'focus-light':!disabled}]" :style="{'min-width': width + 'px',height: height + 'px', lineHeight: height + 'px'}">
          <div v-if="valueLabel || defaultLabel" :class="['input-item',{disabled:disabled}]">{{valueLabel ? valueLabel : defaultLabel}}</div>
          <div v-else class="placeholder-text">{{placeholder}}</div>
          <input :value="valueLabel"
                 :placeholder="placeholder"
                 type="text"
                 disabled="true"
                 class="input-item"
                 style="visibility: hidden"
                 @click.stop="selectType"
          >
          <img v-if="!disabled" src="./icon-pull_down@2x.png" class="city-tap-top" :class="{'city-tap-top-active': visible}">
          <transition name="fade">
            <ul v-show="visible" class="select-child" :style="{top: (height - 4) + 'px'}" @mouseleave="leaveHide()" @mouseenter="endShow">
              <li v-for="(child, chIdx) in data"
                  :key="chIdx"
                  :class="['select-child-item',{active:(valueKey ? child[valueKey] :child)===value}]"
                  :style="{height: itemHeight + 'px', lineHeight: itemHeight + 'px'}"
                  @click.stop="setValue(child, chIdx)"
              >
                {{child[labelKey]}}
              </li>
              <li v-if="!data.length" class="select-child-item">{{noContentText}}</li>
            </ul>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      // 选中的值
      value: {
        type: [String, Object, Boolean, Number],
        default: ''
      },
      defaultLabel:{
        type: String,
        default: ''
      },
      // 占位符
      placeholder: {
        type: String,
        default: ''
      },
      // 显示的label键值
      labelKey: {
        type: String,
        default: 'name'
      },
      // 需要的value键值
      valueKey: {
        type: String,
        default: 'id'
      },
      // 列表数据
      data: {
        type: Array,
        default: () => {
          return []
        }
      },
      // 没有选择列表显示的文字
      noContentText: {
        type: String,
        default: '暂无数据'
      },
      // 禁用
      disabled: {
        type: Boolean,
        default: false
      },
      // 每一行高度
      itemHeight: {
        type: Number,
        default: 40
      },
      // 每一行宽度
      width: {
        type: Number,
        default: 102
      },
      // 显示选中input的高度
      height: {
        type: Number,
        default: 28
      }
    },
    data() {
      return {
        visible: "",
        setTime: '',
      }
    },
    computed: {
      valueLabel() {
        let res = this.data.find(item => {
          let re = this.valueKey ? item[this.valueKey] === this.value : item === this.value
          return re
        })
        return res ? res[this.labelKey] :''
      }
    },
    mounted() {
      window.onclick = () => {
        this.visible = false
      }
    },
    methods: {
      clickHide() {
        this.visible = false
      },
      endShow() {
        clearTimeout(this.setTime)
      },
      leaveHide() {
        this.setTime = setTimeout(() => {
          this.clickHide()
        }, 1500)
      },
      selectType() {
        console.log(this.disabled)
        if (this.disabled) {
          return
        }
        console.log(2222)
        this.visible = !this.visible
        this.$emit('change-visible')
      },
      setValue(value, index) {
        console.log(value, this.valueKey)
        this.visible = false
        this.showHover = false
        let res = this.valueKey ? value[this.valueKey] : value
        this.$emit('input', res)
        this.$emit('change', res)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .select-item
    display: flex
    align-items: center
    position: relative

    .input-item
      width: 100%
      height: 100%
      border: 0px solid #ccc
      color: #333333
      background #fff
      &.disabled
        cursor not-allowed
    &:first-child
      margin-left: 0px

  .select-title
    font-size: $font-size-medium
    line-height: 17px
    no-wrap()

  .admin-big-box
    cursor: pointer
    box-sizing: border-box
    border-radius: 2px
    font-size: $font-size-medium
    color: $color-text-main
    position: relative
    &:hover .focus-light
       border-color: #ACACAC

  .admin-select-box
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
      display: flex
      justify-content: center

      .city-tap-top
        width: 8px
        height: @width
        col-center()
        right: 10px
        transform-origin: 50% 0
        transform: rotate(0deg) translateY(-50%)
        transition: transform 0.3s

      .city-tap-top-active
        transform-origin: 50% 0
        transform: rotate(180deg) translateY(-50%)
        transition: transform 0.3s

      .select-child
        left: 0
        background: $color-white
        z-index: 300
        position: absolute
        border-radius: 3px
        box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.20)
        margin-top: 10px
        max-height: 350px
        overflow-y: auto
        min-width: 100%

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

          &:hover
          &.active
            color: $color-main

    .admin-select-box-active
      border-color: $color-main !important
      color: $color-text-main

</style>
