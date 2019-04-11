<template>
  <div @click="itemClick">
    <tag :class="['flow-item', {'can-active':to},{'text-active':activeText} ]"
         :style="getStyle" :tag="to ? 'router-link':'div'" :to="to"
    >
      <template v-if="iconSrc">
        <div :class="{'img-wrap':true}">
          <img :src="iconSrc" alt="icon" :width="width-2" :height="width-2" draggable="false">
        </div>
        <div class="name" v-text="text"></div>
      </template>
      <template v-if="!iconSrc && text"> {{text}}</template>
    </tag>
  </div>


</template>
<script type="text/ecmascript-6">
  export default {
    name: 'FLOWITEM',
    components: {
      'tag': {
        props: {
          to: {
            type: String,
            default: ''
          },
          tag: {
            type: String,
            default: 'div'
          }
        },
        computed: {
          getRouter() {
            if (!this.to) return ''
            if (this.to.slice(0, 1) === '/') {
              return this.to
            } else {
              return {name: this.to}
            }
          }
        },
        render: function (createElement) {
          return createElement(
            this.tag,   // 标签名称
            {
              props: {
                to: this.getRouter
              }
            },
            this.$slots.default // 子元素数组
          )
        },
      }
    },
    props: {
      width: {
        type: Number,
        default: 100
      },
      positions: {
        type: Array,
        default: () => [0, 0]
      },
      iconSrc: {
        type: String,
        default: ""
      },
      text: {
        type: String,
        default: ""
      },
      activeText: {
        type: [String, Boolean],
        default: false
      },
      hoverClass: {
        type: String,
        default: 'active'
      },
      cannotClickColor: {
        type: String,
        default: 'orange'
      },
      to: {
        type: [String, Object],
        default: ""
      },
      fontSize: {
        type: Number,
        default: 14
      }
    },
    data() {
      return {}
    },
    computed: {
      getStyle() {
        let size = !this.iconSrc ? 12 : this.fontSize
        return {
          'font-size': size + 'px',
          left: this.positions[0] + 'px',
          top: this.positions[1] + 'px',
          width: this.width - 2 + 'px'
        }
      }
    },
    methods: {
      itemClick() {
        this.$emit('item-click')
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  $hover-color = #C5EECE
  $active-color = #44A659
  $text-default-color = #E8A13A
  @import "~@design"
  .flow-item
    width 100px
    position absolute
    box-sizing: border-box
    display flex
    flex-direction: column;
    align-items: center
    color: $text-default-color

    .img-wrap
      padding: 100% 100% 0 0;
      position: relative
      border-radius 50%
      border 2px solid transparent
      overflow hidden

    img
      position absolute
      top: 0px
      left: 0px
      width 100px
      height 100px

    .name
      width 100%
      text-align center
      font-size inherit

    &.text-active
      color: $active-color

    &.can-active
      color: $active-color

      .name
        margin-top: 10px

      .img-wrap
        border-color: $active-color

      &:hover
        .img-wrap
          background: $hover-color
          border-color: transparent

        .name
          text-decoration: underline


</style>
