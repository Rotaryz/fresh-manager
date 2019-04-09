<template>
  <tag :class="['flow-item', to ?'can-active':'' ]"
       :style="getStyle"
       :tag="to ? 'router-link':'div'"
       :to="to">
    <div :class="{'img-wrap':true}">
      <img :src="iconSrc" alt="icon" :width="width-2" :height="width-2">
    </div>
    <div class="name" v-text="text"></div>
  </tag>

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
        require: true,
        type: String,
        default: ""
      },
      text: {
        type: String,
        default: ""
      },
      canClickColor: {
        type: String,
        default: '#44A659'
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
    },
    data() {
      return {}
    },
    computed: {
      getStyle() {
        return {
          left: this.positions[0] + 'px',
          top: this.positions[1] + 'px',
          width: this.width - 2 + 'px'
        }
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

    &.can-active
      .name
        color: $active-color

      .img-wrap
        border-color: $active-color

      &:hover
        .img-wrap
          &.border
            background: $hover-color
            border-color: transparent

        .name
          text-decoration: underline

    .name
      width 100%
      text-align center
      margin-top: 10px
      font-size: $font-size-14
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
</style>
