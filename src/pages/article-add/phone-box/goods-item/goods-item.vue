<template>
  <div class="good-item">
    <img :src="goodsData.goods_cover_image" class="goods-photo">
    <div class="info">
      <div v-if="goodsData && goodsData.name" class="name">{{goodsData.name}}</div>
      <div class="details">{{goodsData.describe}}</div>
      <div class="operate">
        <div>
          <span class="price-now">
            {{goodsData.trade_price.split('.')[0]}}
            <span class="small">
              <span v-if="goodsData.trade_price.split('.')[1]">.{{goodsData.trade_price.split('.')[1]}}</span>
              <span class="unit">元</span>
            </span>
          </span>
          <span class="price">{{goodsData.original_price}}元</span>
        </div>
        <img src="./icon-add_to@2x.png" class="add-img" @click="addBtn">
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'GOODS_ITEM'
  export default {
    name: PAGE_NAME,
    components: {},
    props: {
      addDisabled: {
        type: Boolean,
        default: false
      },
      goodsData: {
        require: true,
        type: Object,
        default: function () {
          return {
            name: '',
            details: '',
            price: '',
            photo: ''
          }
        }
      }
    },
    data() {
      return {}
    },
    methods: {
      addBtn() {
        if (this.addDisabled) return false
        this.$emit('add-click', this.goodsData)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .good-item
    display flex
    background: #FFFFFF
    border: 1px solid #EFEFEF
    box-shadow: 0 4px 6px 0 rgba(17, 17, 17, 0.02)
    border-radius: 8px
    margin-bottom 15px

    .goods-photo
      width: 90px
      height: 90px
      flex-shrink: 0

    .info
      padding: 5px 12px
      overflow: hidden
      flex:1
      .name
        font-family $font-family-medium
        font-size: $font-size-16
        color: #111111
        overflow hidden
        text-overflow ellipsis
        white-space: nowrap

      .details
        font-family $font-family-regular
        font-size: $font-size-14
        color: #808080
        margin: 4px 0px 5px
        overflow hidden
        text-overflow ellipsis
        white-space: nowrap

      .operate
        display flex
        justify-content space-between
        align-items center

      .price-now
        color: #FA7500
        font-size: $font-size-25
        font-family $font-family-medium

        .small
          font-size: $font-size-16

          .unit
            font-family $font-family-regular

      .price
        color: #B7B7B7
        font-size: $font-size-12
        font-family $font-family-regular
        text-decoration-line line-through
        margin-left 6px

    .add-img
      width: 24px
      height: 24px


</style>
