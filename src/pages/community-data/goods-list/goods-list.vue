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
      <div v-for="(item, index) in goodsList" :key="index" class="list-item">
        <div v-for="(val, ind) in titleArr" :key="ind" :style="{flex: val.flex}" class="item-data" :class="val.class">
          <img v-if="val.class === 'img'" class="img" :src="item.goods && item.goods.cover_image" alt="">
          <p v-else-if="val.value === 'name'" class="main">{{item.goods && item.goods[val.value]}}</p>
          <p v-else class="main">{{item.goods && item[val.value]}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {communityComputed} from '@state/helpers'
  const COMPONENT_NAME = 'GOODS_LIST'
  const TITLE = [
    {name: '图片', flex: 0.4, class: 'img', value: ''},
    {name: '商品名称', flex: 4, class: 'name', value: 'name'},
    {name: '销量', flex: 0.6, class: 'count', value: 'sales'},
    {name: '转化率', flex: 0.8, class: 'rate', value: 'conversion'}
  ]
  const GOOD = [
    {
      "wx_group_id": 2,
      "sales": 30,
      "conversion": "76.93%",
      "goods": {
        "id": 399,
        "name": "欧家新鲜",
        "cover_image_id": 5210,
        "cover_image": "http://social-shopping-api-1254297111.picgz.myqcloud.com/1/2019/03/18/155288050414670.png?imageView2/3/w/400/h/400/q/90"
      }
    },
    {
      "wx_group_id": 1,
      "sales": 13,
      "conversion": "59.10%",
      "goods": {
        "id": 400,
        "name": "大米",
        "cover_image_id": 6111,
        "cover_image": "http://social-shopping-api-1254297111.picgz.myqcloud.com/1/2019/03/26/155358548164093.png?imageView2/3/w/400/h/400/q/90"
      }
    }
  ]
  export default{
    name: COMPONENT_NAME,
    props: {

    },
    data() {
      return {
        titleArr: TITLE,
        goods: GOOD
      }
    },
    computed: {
      ...communityComputed
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
      .img
        width: 36px
        height: 36px
        border-radius: 2px
        border: 0.5px solid $color-line
  .rate
    max-width: 70px
</style>
