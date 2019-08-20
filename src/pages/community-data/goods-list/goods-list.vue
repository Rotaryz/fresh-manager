<template>
  <div class="goods-list">
    <div v-if="goodsList.length" class="goods-title" :class="{'padding': goodsList.length > 5}">
      <span v-for="(item, index) in titleArr"
            :key="index"
            class="title-item"
            :class="item.class"
            :style="{flex: item.flex}"
      >{{item.name}}</span>
    </div>
    <div class="list">
      <div v-for="(item, index) in goodsList" :key="index" class="list-item">
        <div v-for="(val, ind) in titleArr" :key="ind" :style="{flex: val.flex}" class="item-data" :class="val.class">
          <p v-if="val.value === 'name'" class="main">
            <img class="img" :src="item.goods && item.goods.cover_image" alt="">
            <span class="text">{{item.goods && item.goods[val.value]}}</span>
          </p>
          <p v-else-if="val.value === 'conversion'" class="main">{{(time === 'today') ? '---' : item.conversion}}</p>
          <p v-else class="main">{{item[val.value]}}</p>
        </div>
      </div>
    </div>

    <div v-show="!goodsList.length && loaded" class="no-data">暂无数据</div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {communityComputed} from '@state/helpers'
  const COMPONENT_NAME = 'GOODS_LIST'
  const TITLE = [
    {name: '商品', flex: 4, class: 'name', value: 'name'},
    {name: '销量', flex: 0.8, class: 'count', value: 'sales'},
    {name: '销售额', flex: 1.2, class: 'rate', value: 'amount'}
  ]
  const GOOD = [
    {
      wx_group_id: 2,
      sales: 30,
      conversion: '76.93%',
      goods: {
        id: 399,
        name: '欧家新鲜',
        cover_image_id: 5210,
        cover_image:
          'http://social-shopping-api-1254297111.picgz.myqcloud.com/1/2019/03/18/155288050414670.png?imageView2/3/w/400/h/400/q/90'
      }
    },
    {
      wx_group_id: 1,
      sales: 13,
      conversion: '59.10%',
      goods: {
        id: 400,
        name: '大米',
        cover_image_id: 6111,
        cover_image:
          'http://social-shopping-api-1254297111.picgz.myqcloud.com/1/2019/03/26/155358548164093.png?imageView2/3/w/400/h/400/q/90'
      }
    }
  ]
  export default {
    name: COMPONENT_NAME,
    props: {
      time: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        titleArr: TITLE,
        goods: GOOD,
        loaded: false
      }
    },
    computed: {
      ...communityComputed
    },
    watch: {
      goodsList(value, oldValue) {
        this.loaded = true
      }
    },
    methods: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .goods-list
    width: 100%
    flex: 1
    display: flex
    flex-direction: column
    overflow: hidden
    .no-data
      width: 100%
      height: 100%
      display: flex
      align-items: center
      justify-content: center
      color: #666
      font-size: $font-size-14
      font-family: $font-family-regular
  .goods-title
    height: 45px
    line-height: 45px
    background: #F5F7FA
    display: flex
    padding: 0 20px
    .title-item
      padding-right: 20px
      &:first-child
        min-width: 52px
      &:last-child
        padding-right: 0
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
    &:last-child
      border-bottom: 0
    .item-data
      overflow: hidden
      height: 36px
      line-height: 36px
      padding-right: 20px
      &:first-child
        min-width: 52px
      .main
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
        display: flex
        align-items: center
      .img
        width: 36px
        height: 36px
        margin-right: 10px
        border-radius: 2px
        object-fit: cover
        border: 0.5px solid $color-line
      .text
        overflow: hidden;
        text-overflow: ellipsis;
    .item-data:last-child
      padding-right: 0
  .rate
    max-width: 70px
</style>
