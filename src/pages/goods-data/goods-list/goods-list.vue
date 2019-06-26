<template>
  <div class="goods-list">
    <div v-show="list.length">
      <div class="goods-title" :class="{'padding': list.length > 5}">
        <div v-for="(item, index) in titleArr"
             :key="index"
             class="title-item"
             :class="item.class"
             :style="{flex: item.flex}"
        >
          <div v-if="index < 1" class="item-main">{{item.name}}</div>
          <div v-else class="item-main" :class="[{'hand': saleTrue}, {'active': activeIndex === index && saleTrue}]" @click="changeRank(index)">
            <span :class="{'active': item.active}">{{item.name}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="list">
      <div v-for="(item, index) in list" :key="index" class="list-item" :class="{'no-border': index > 5}">
        <div v-for="(val, ind) in titleArr" :key="ind" :style="{flex: val.flex}" class="item-data" :class="val.class">
          <div v-if="val.value === 'img'" class="main">
            <div class="image-box">
              <img class="img" :src="item.image_url" alt="">
            </div>
            <span class="name">{{item.name}}</span>
          </div>
          <p v-else-if="val.type === 'money'" class="main">¥{{item[val.value]}}</p>
          <p v-else class="main">{{item[val.value]}}</p>
        </div>
      </div>
    </div>
    <div v-show="!list.length && loaded" class="no-data">暂无数据</div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {communityComputed} from '@state/helpers'
  const COMPONENT_NAME = 'GOODS_LIST'
  const TITLE = [
    {name: '品类', flex: 2, value: 'img'},
    {name: '销量', flex: 0.6, value: 'num', active: false},
    {name: '销售额(元)', flex: 0.8, value: 'amount', active: false},
    {name: '利润(元)', flex: 0.8, value: 'profit', active: false}
  ]
  const TITLE2 = [
    {name: '品类', flex: 1.6, value: 'img'},
    {name: '库存', flex: 0.6, value: 'num'},
    {name: '库存金额', flex: 0.6, value: 'amount', type: 'money'}
  ]
  export default {
    name: COMPONENT_NAME,
    props: {
      type: {
        type: String,
        default: 'sales'
      },
      loaded: {
        type: Boolean,
        default: false
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
        activeIndex: 1
      }
    },
    computed: {
      ...communityComputed,
      saleTrue() {
        return this.type === 'sales'
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
    height: 345px
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
    height: 300px
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
      .image-box
        width: 36px
        height: 36px
        margin-right: 10px
        border-1px($color-line, 4px)
      .main
        display: flex
        align-items: center
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
      .name
        text-overflow: ellipsis
        overflow: hidden
      .img
        width: 36px
        height: 36px
        border-radius: 2px
        object-fit: cover

    .item-data:last-child
      padding-right: 0
  .no-border:last-child
    border-bottom: 0
  .rate
    max-width: 70px
</style>
