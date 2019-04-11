<template>
  <div class="goods-list">
    <div class="goods-title" :class="{'padding': goods.length > 5}">
      <span v-for="(item, index) in titleArr"
            :key="index"
            class="title-item"
            :class="item.class"
            :style="{flex: item.flex}"
      >{{item.name}}</span>
    </div>
    <div class="list">
      <div v-for="(item, index) in goods" :key="index" class="list-item">
        <div v-for="(val, ind) in titleArr" :key="ind" :style="{flex: val.flex}" class="item-data" :class="val.class">
          <img v-if="val.class === 'img'" class="img" src="./img.jpg" alt="">
          <p v-else class="main">{{item[val.value]}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'GOODS_LIST'
  const TITLE = [
    {name: '图片', flex: 0.4, class: 'img', value: ''},
    {name: '商品名称', flex: 4, class: 'name', value: 'name'},
    {name: '销量', flex: 0.6, class: 'count', value: 'count'},
    {name: '转化率', flex: 0.8, class: 'rate', value: 'rate'}
  ]
  const GOODS = [
    {name: '水果蔬菜水果水果', count: 200, rate: '10%'},
    {name: '水果蔬菜水果水果', count: 200, rate: '10%'},
    {name: '水果蔬菜水果水果', count: 200, rate: '10%'},
    {name: '水果蔬菜水果水果', count: 200, rate: '10%'},
    {name: '水果蔬菜水果水果', count: 200, rate: '10%'},
    {name: '水果蔬菜水果水果', count: 200, rate: '10%'},
    {name: '水果蔬菜水果水果', count: 200, rate: '10%'},
    {name: '水果蔬菜水果水果', count: 200, rate: '10%'}
  ]
  export default{
    name: COMPONENT_NAME,
    props: {

    },
    data() {
      return {
        titleArr: TITLE,
        goods: GOODS
      }
    },
    methods: {

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
    background: #F5F7FA
    display: flex
    padding: 0 20px
    .title-item
      padding-right: 20px
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
    display: flex
    align-items: center
    &:last-child
      border-bottom: 0
    .item-data
      overflow: hidden
      height: 36px
      line-height: 36px
      padding-right: 20px
      .img
        width: 36px
        height: 36px
        border-radius: 2px
        border: 1px solid $color-line
  .rate
    max-width: 70px
</style>
