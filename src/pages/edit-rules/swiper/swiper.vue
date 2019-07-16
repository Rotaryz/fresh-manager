<template>
  <div class="banner">
    <carousel :value="bannerIndex"
              :autoplaySpeed="3000"
              arrow="never"
              :height="536"
              autoplay
              :radiusDot="false"
              dots="none"
              @on-change="_getBanner"
    >
      <carousel-item v-for="(item, index) in bannerList" :key="index">
        <div class="carousel" :style="{'background-image': 'url(\'' + item + '\')'}">
        </div>
      </carousel-item>
    </carousel>
  </div>
</template>

<script type="text/ecmascript-6">
  import {Carousel, CarouselItem} from 'iview'

  const IMAGE_ARR = [
    ['pic-extract', 'pic-compensate', 'pic-choose_commodity', 'pic-place_order'],
    ['pic-refund_notice', 'pic-compensate', 'pic-choose_commodity', 'pic-place_order'],
    ['pic-refund_notice', 'pic-compensate', 'pic-choose_commodity', 'pic-place_order']
  ]
  const COMPONENT_NAME = 'SWIPER'
  export default {
    name: COMPONENT_NAME,
    components: {
      Carousel,
      CarouselItem
    },
    props: {
      type: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        bannerIndex: 0,
        imageArr: IMAGE_ARR
      // bannerList: [`${require('./pic-address_book@2x.png')}`]
      }
    },
    computed: {
      bannerList() {
        let arr = this.imageArr[this.type].map((item) => {
          return require(`./${item}@2x.png`)
        })
        return arr
      }
    },
    created() {},
    methods: {
      _changeBanner(index) {
        this.bannerIndex = index
      },
      _getBanner(oldValue, value) {
        this.bannerIndex = value
        this.$emit('bannerChange', value)
      },
      _setType(cms) {}
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .banner
    width: 300px
    height: 472.2px
    .ivu-carousel-item
      box-sizing: border-box
      padding-left: 0
    .carousel
      border-radius: 1px
      width: 300px
      height: 472.2px
      background-repeat: no-repeat
      background-size: cover
      background-position: center
      background-image: url("pic-address_book@2x.png")
    .carousel-active
      margin-top: 0
      height: 104px
</style>
