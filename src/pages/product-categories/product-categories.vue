<template>
  <div class="product-categories">
    <div class="product-top">
      <div class="btn-main" @click="newBigCate">新建大类 +</div>
    </div>
    <ul class="categories-box">
      <li v-for="(item, index) in categoryList" :key="index" class="big-box">
        <div class="big-box-main">
          <div class="big-main-left hand" @click="openList(index)">
            <div class="icon" :class="item.select ? 'open' : ''"></div>
            <div class="text">{{item.name}}</div>
          </div>
          <div class="big-main-right">
            <span class="list-operation">编辑</span>
            <span class="list-operation">删除</span>
          </div>
        </div>
        <div v-if="item.select" class="open-list">
          <div v-for="(twoitem, twoindex) in item.list" :key="twoindex" class="open-item">
            <div class="open-item-left">{{twoitem.name}}</div>
            <div class="big-main-right">
              <span class="list-operation" @click="openTwoList(index)">编辑</span>
              <span class="list-operation">删除</span>
            </div>
          </div>
          <div class="add-box hand" @click="addChilrenCate(item, index)">
            <div class="icon"></div>
            <div class="text">添加</div>
          </div>
        </div>
      </li>
    </ul>
    <change-model :showCate="true"></change-model>
    <change-model ref="bigModel" :showCate="false" numberPla="长度不能超过10位" @confirm="newConfirm"></change-model>
  </div>
</template>

<script type="text/ecmascript-6">
  import {categoriesComputed, categoriesMethods} from '@state/helpers'
  import API from '@api'
  import ChangeModel from '@components/change-model/change-model'
  import _ from 'lodash'
  const PAGE_NAME = 'PRODUCT_CATEGORIES'
  const TITLE = '商品分类'

  export default {
    name: PAGE_NAME,
    components: {
      ChangeModel
    },
    page: {
      title: TITLE
    },
    data() {
      return {
        categoryType: 0,
        categoryNewName: '',
        categoryChild: '',
        bigItem: '',
        bigIndex: 0,
        categoryList: []
      }
    },
    computed: {
      ...categoriesComputed
    },
    created() {
      this.categoryList = _.cloneDeep(this.reqCategoryList)
    },
    methods: {
      ...categoriesMethods,
      newBigCate() {
        this.$refs.bigModel.show('新建商品分类', this.categoryNewName)
        this.categoryType = 0
      },
      newConfirm(name, number) {
        if (name.length === 0 || name.length > 10) {
          if (this.categoryType === 0) {
            this.categoryNewName = name
          } else if (this.categoryType === 1) {
            this.categoryChild = name
          }
          this.$toast.show('计量单位的长度不能超过10个')
          return
        }
        switch (this.categoryType) {
        case 0:
          API.Product.createCategory({name: name, sort: number}).then((res) => {
            if (res.error === this.$ERR_OK) {
              this.$toast.show('创建成功')
              this.categoryNewName = ''
              this.addChild({name: name, sort: number, id: 0})
            } else {
              this.$toast.show(res.message)
            }
          })
          break
        case 1:
          API.Product.createCategory({name: name, sort: number, parent_id: this.bigItem.id}).then((res) => {
            if (res.error === this.$ERR_OK) {
              this.$toast.show('创建成功')
              this.categoryNewName = ''
              this.getCategoryList(-1, false)
            } else {
              this.$toast.show(res.message)
            }
          })
          break
        }
      },
      _sort(a, b) {
        return b.sort - a.sort
      },
      openList(index) {
        this.categoryList[index].select = !this.categoryList[index].select
        // this.categoryList.sort(this._sort)
        this.$forceUpdate()
      },
      openTwoList(index) {
      // this.cateList[index].children.sort(this._sort)
      },
      addChilrenCate(item, index) {
        this.$refs.bigModel.show('新建商品子分类', this.categoryChild)
        this.categoryType = 1
        this.bigItem = item
        this.bigIndex = index
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .product-top
    layout(row)
    align-items: center
    justify-content: space-between
    height: 80px
  .categories-box
    border: 1px solid #e1e1e1
    border-bottom: 0px solid #e1e1e1
    .big-box
      width: 100%
      border-bottom: 1px solid #e1e1e1
      .big-box-main
        height: 60px
        padding-left: 22px
        padding-right: 14px
        box-sizing: border-box
        layout(row)
        align-items: center
        justify-content: space-between
        .big-main-left
          layout(row)
          align-items: center
          min-height: 100%
          min-width: 200px
          .icon
            width: 16px
            height: 16px
            border-radius: 50%
            background-size: 16px
            bg-image('icon-retract')
            margin-right: 5px
            &.open
              bg-image('icon-open')
          .text
            font-size: $font-size-14
            line-height: 1
            color: $color-text-main
            font-family: $font-family-medium
  .add-box
    height: 60px
    border-top: 1px solid #e1e1e1
    background: #f9f9f9
    padding-left: 57px
    layout(row)
    align-items: center
    .icon
      width: 12px
      height: 12px
      border-radius: 50%
      background-size: 12px
      bg-image('icon-plus_young')
      margin-right: 5px
    .text
      font-size: $font-size-14
      line-height: 1
      color: $color-sub
      font-family: $font-family-medium
  .open-item
    height: 60px
    border-top: 1px solid #e1e1e1
    background: #f9f9f9
    padding-left: 57px
    padding-right: 14px
    layout(row)
    align-items: center
    justify-content: space-between
    .open-item-left
      font-size: $font-size-14
      color: $color-text-main
      font-family: $font-family-regular
  .big-main-right
    .list-operation
      color: $color-sub
  .product-categories
    width: 100%
</style>
