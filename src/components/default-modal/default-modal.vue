<template>
  <transition name="fade">
    <section v-show="isShow" :style="styles" class="default-modal">
      <div :class="showActive ? 'model-active' : 'model-un-active'">
        <slot name="content"></slot>
      </div>
    </section>
  </transition>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'DEFAULT_MODAL'

  export default {
    name: COMPONENT_NAME,
    props: {
      styles: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        showActive: false,
        isShow: false
      }
    },
    watch: {
      $route() {
        this.isShow = false
      }
    },
    methods: {
      showModal() {
        this.isShow = true
        this.showActive = true
      },
      hideModal() {
        setTimeout(() => {
          this.isShow = false
        }, 100)
        this.showActive = false
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  $menu-width = 210px
  @import "~@design"
  .default-modal
    position: fixed
    background: rgba(0, 0, 0, 0.50)
    top: 0
    bottom: 0
    right: 0
    left: $menu-width
    z-index: 1500
    layout()
    justify-content: center
    align-items: center

  .model-active
    position: relative
    animation: layerFadeIn .3s

  .model-un-active
    animation: hideFadeIn .4s

  @keyframes layerFadeIn {
    0% {
      opacity: 0
      transform: scale(.5)
    }
    100% {
      opacity: 1
      transform: scale(1)
    }
  }

  @keyframes hideFadeIn {
    0% {
      opacity: 1
      transform: scale(1)
    }
    100% {
      transform: scale(.5)
      opacity: 0
    }
  }
</style>
