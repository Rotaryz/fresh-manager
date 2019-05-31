<template>
  <div class="goods-list">
    <div class="goods-title" :class="{'padding': list.length > 5}">
      <div v-for="(item, index) in titleArr"
           :key="index"
           class="title-item"
           :class="item.class"
           :style="{flex: item.flex}"
      >
        <div v-if="index < 2" class="item-main">{{item.name}}</div>
        <div v-else class="item-main" :class="[{'hand': saleTrue}, {'active': activeIndex === index && saleTrue}]" @click="changeRank(index)">
          <span :class="{'active': item.active}">{{item.name}}</span>
        </div>
      </div>
    </div>
    <div class="list">
      <div v-for="(item, index) in list" :key="index" class="list-item" :class="{'no-border': index > 5}">
        <div v-for="(val, ind) in titleArr" :key="ind" :style="{flex: val.flex}" class="item-data" :class="val.class">
          <img v-if="val.value === 'img'" class="img" :src="item.image_url" alt="">
          <p v-else-if="val.value === 'amount'" class="main">¥{{item[val.value]}}</p>
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
    {name: '', flex: 0.5, value: 'img'},
    {name: '品类名称', flex: 1.4, value: 'name'},
    {name: '销量', flex: 1, value: 'num', active: false},
    {name: '销售额(元)', flex: 1.2, value: 'amount', active: false},
    {name: '利润(元)', flex: 1, value: 'profit', active: false}
  ]
  const TITLE2 = [
    {name: '', flex: 0.5, value: 'img'},
    {name: '品类名称', flex: 1.4, value: 'name'},
    {name: '库存', flex: 1, value: 'num'},
    {name: '库存金额', flex: 1, value: 'amount'}
  ]
  const GOOD = [
    {
      "num": "2",
      "amount": "20.00",
      "profit": "18.00",
      "spu": "1",
      "name": "苹果",
      "stock": 50,
      "stock_price": 100,
      "image_url": "http://social-shopping-api-1254297111.picgz.myqcloud.com/1/2018/12/20/154528653880037.png"
    },
    {
      "num": "2",
      "amount": "20.00",
      "profit": "18.00",
      "spu": "1",
      "name": "苹果",
      "stock": 50,
      "stock_price": 100,
      "image_url": "http://social-shopping-api-1254297111.picgz.myqcloud.com/1/2018/12/20/154528653880037.png"
    }

  ]
  export default{
    name: COMPONENT_NAME,
    props: {
      type: {
        type: String,
        default: 'sales'
      },
      list: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data() {
      return {
        titleArr: this.type === 'sales' ? TITLE : TITLE2,
        goods: GOOD,
        activeIndex: 2
      }
    },
    computed: {
      ...communityComputed,
      saleTrue() {
        return  this.type === 'sales'
      }
    },
    methods: {
      changeRank(index) {
        if (this.type !== 'sales') return
        this.activeIndex = index
        let type = this.titleArr[index].value
        this.$emit('changeGoodsRank', type)
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
        color: $color-text-main
        font-family: $font-family-regular
        transition: all 0.3s
      .active
        color: $color-main
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
