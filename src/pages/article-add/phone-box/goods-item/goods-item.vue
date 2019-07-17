<template>
  <div class="good-item">
    <img v-if="goodsData.is_online === 0" src="../../pic-off_shelf@2x.png" class="goods-photo">
    <img v-else-if="goodsData.usable_stock === 0" src="../../pic-out_stock@2x.png" class="goods-photo">
    <img v-else :src="goodsData.goods_cover_image" class="goods-photo">
    <div class="info">
      <div v-if="goodsData && goodsData.name" class="name">{{goodsData.name}}</div>
      <div class="details">{{goodsData.describe}}</div>
      <div class="operate">
        <div>
          <span class="price-now">
            <span class="big">{{goodsData.trade_price}}</span>
            <span class="unit">元</span>
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
      border-radius 8px 0px 0px 8px
      object-fit cover
      flex-shrink 0
    .info
      padding: 5px 12px
      overflow: hidden
      flex: 1
      display flex
      flex-direction column
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
        font-family $font-family-medium

        .big
          font-size: $font-size-25

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
