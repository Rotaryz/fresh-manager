<template>
  <div class="goods-list">
    <div class="goods-title" :class="{'padding': goods.length > 5}">
      <div v-for="(item, index) in titleArr"
           :key="index"
           class="title-item"
           :class="item.class"
           :style="{flex: item.flex}"
      >
        <div v-if="index < 2" class="item-main">{{item.name}}</div>
        <div v-if="index > 1" class="item-main hand" @click="changeRank(index)">
          <span class="name" :class="[{'down': +item.active === 1}, {'up': +item.active === 2}]">{{item.name}}</span>
        </div>
      </div>
    </div>
    <div class="list">
      <div v-for="(item, index) in goods" :key="index" class="list-item" :class="{'no-border': index > 5}">
        <div v-for="(val, ind) in titleArr" :key="ind" :style="{flex: val.flex}" class="item-data" :class="val.class">
          <img v-if="val.value === 'img'" class="img" :src="item.goods && item.goods.cover_image" alt="">
          <p v-else-if="val.value === 'name'" class="main">{{item.goods && item.goods[val.value]}}</p>
          <p v-else-if="val.value === 'salePrice'" class="main">¥{{item[val.value]}}</p>
          <p v-else-if="val.value === 'stock_price'" class="main">¥{{item[val.value]}}</p>
          <p v-else class="main">{{item[val.value]}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {communityComputed} from '@state/helpers'
  const COMPONENT_NAME = 'GOODS_LIST'
  const TITLE = [
    {name: '', flex: 0.5, value: 'img', active: '0'},
    {name: '品类名称', flex: 1.4, value: 'name', active: '0'},
    {name: '销量', flex: 1, value: 'sales', active: '0', type: 'saleCount', rank: ['', 'down', 'up']},
    {name: '销售额(元)', flex: 1.2, value: 'salePrice', active: '0', type: 'salePrice', rank: ['', 'down', 'up']},
    {name: '利润(元)', flex: 1, value: 'earn', active: '0', type: 'earn', rank: ['', 'down', 'up']}
  ]
  const TITLE2 = [
    {name: '', flex: 0.5, value: 'img', active: '0'},
    {name: '品类名称', flex: 1.4, value: 'name', active: '0'},
    {name: '库存', flex: 1, value: 'stock', active: '0', type: 'stock', rank: ['', 'down', 'up']},
    {name: '库存金额', flex: 1, value: 'stock_price', active: '0', type: 'stockPrice', rank: ['', 'down', 'up']}
  ]
  const GOOD = [
    {
      "sales": 30,
      "salePrice": 200,
      "earn": 100,
      "stock": 50,
      "stock_price": 100,
      "goods": {
        "id": 399,
        "name": "时令水果",
        "cover_image_id": 5210,
        "cover_image": "http://social-shopping-api-1254297111.picgz.myqcloud.com/1/2019/03/18/155288050414670.png?imageView2/3/w/400/h/400/q/90"
      }
    },
    {
      "sales": 30,
      "salePrice": 200,
      "earn": 100,
      "stock": 50,
      "stock_price": 100,
      "goods": {
        "id": 399,
        "name": "时令水果",
        "cover_image_id": 5210,
        "cover_image": "http://social-shopping-api-1254297111.picgz.myqcloud.com/1/2019/03/18/155288050414670.png?imageView2/3/w/400/h/400/q/90"
      }
    }

  ]
  export default{
    name: COMPONENT_NAME,
    props: {
      type: {
        type: String,
        default: 'sales'
      }
    },
    data() {
      return {
        titleArr: this.type === 'sales' ? TITLE : TITLE2,
        goods: GOOD,
        activeIndex: 0
      }
    },
    computed: {
      ...communityComputed
    },
    methods: {
      changeRank(index) {
        if (this.activeIndex === index) {
          this.titleArr[index].active = this.titleArr[index].active + 1 > 2 ? 0 : this.titleArr[index].active + 1
        } else {
          this.$set(this.titleArr[this.activeIndex], 'active', 0)
          this.$set(this.titleArr[index], 'active', 1)
          this.activeIndex = index
        }
        let type = this.titleArr[index].type
        let rank = this.titleArr[index].rank[index]
        this.$emit('changeGoodsRank', type, rank)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .goods-list
    width: 100%
    flex: 1
    display: flex
    flex-direction: column
  .goods-title
    height: 45px
    line-height: 45px
    display: flex
    padding: 0 20px
    border-bottom: 0.5px solid $color-line
    font-size: $font-size-14
    color: $color-text-main
    font-family: $font-family-regular
    .title-item
      padding-right: 20px
      &:last-child
        padding-right: 0
      .item-main
        -webkit-user-select: none
        -moz-user-select: none
        -ms-user-select: none
        -khtml-user-select: none
        user-select: none
        .name
          position: relative
          &:before,&:after
            content: ""
            position: absolute
            right: -13px
            top: -2px
            width: 5px
            height: 5px
            border-width: 5px
            border-color: #ACACAC
            border-style: solid
            border-top: 5px solid transparent
            border-right: 4px solid transparent
            border-left: 4px solid transparent
          &:after
            top: auto
            bottom: -2px
            transform: rotate(180deg)
        .down:after
          border-color: $color-main
          border-top: 5px solid transparent
          border-right: 4px solid transparent
          border-left: 4px solid transparent
        .up:before
          border-color: $color-main
          border-top: 5px solid transparent
          border-right: 4px solid transparent
          border-left: 4px solid transparent
  .padding
    padding-right: 26px
  .list
    flex: 1
    overflow: auto
    &::-webkit-scrollbar
      width: 6px
      height: 8px
      transition: all 0.2s
    &::-webkit-scrollbar-thumb
      background-color: rgba(0, 0, 0, .15)
      border-radius: 10px
    &::-webkit-scrollbar-thumb:hover
      background-color: rgba(0, 0, 0, .3)
    &::-webkit-scrollbar-track
      box-shadow: inset 0 0 6px rgba(0, 0, 0, .15)
      border-radius: 10px
  .list-item
    border-bottom: 0.5px solid $color-line
    height: 60px
    padding: 0 20px
    font-size: $font-size-14
    color: $color-text-main
    font-family: $font-family-regular
    box-sizing: border-box
    display: flex
    align-items: center
    .item-data
      overflow: hidden
      height: 36px
      line-height: 36px
      padding-right: 20px
      .main
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
      .img
        width: 36px
        height: 36px
        border-radius: 2px
        border: 0.5px solid $color-line

    .item-data:last-child
      padding-right: 0
  .no-border:last-child
    border-bottom: 0
  .rate
    max-width: 70px
</style>
