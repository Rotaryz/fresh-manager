<template>
  <div>
    <div class="phone-box">
      <div class="phone">
        <div class="content-box">
          <div class="invitation hand invitation-active">
            <carousel :autoplaySpeed="3000"
                      arrow="never"
                      :height="54"
                      :autoplay="true"
                      :radiusDot="true"
                      dots="none"
            >
              <carousel-item v-for="(item, index) in invitationList" :key="index">
                <img class="carousel" :src="item.image_url" alt="">
                <!--<img v-else src="./icon-picmr@2x.png" class="carousel">-->
              </carousel-item>
            </carousel>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {Carousel, CarouselItem} from 'iview'

  const PAGE_NAME = 'MINE'

  export default {
    name: PAGE_NAME,
    components: {
      Carousel,
      CarouselItem
    },
    props: {
      invitationList: {
        type: Array,
        default: () => {
          return []
        }
      }
    }
  }
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  // 结构布局
  .phone-box
    margin: 0 76px 0 71px
    box-sizing: border-box
    display: flex
    justify-content: center
    position: relative
    .phone
      icon-image('pic-tel')
      width: 340px
      height: 726.24px
      position: relative
      .content-box
        background-image: url('./mine@2x.png')
        background-repeat: no-repeat
        background-size: 100%
        padding: 0 2px
        box-sizing: border-box
        top: 111px
        left: 23px
        position: absolute
        width: 294px
        height: 499px
        max-height: 532px
        overflow-x: hidden
        &::-webkit-scrollbar
          width: 0
  .invitation
    width: 279px
    height: 58px
    position: absolute
    top: 192px
    left: 7.5px
    border: 2px solid transparent
    border-radius: 4px
    .carousel
      border-radius: 2px
      width: 100%
      height: 100%
      object-fit: cover
  .invitation-active
    border: 2px solid #4dbd65
</style>
