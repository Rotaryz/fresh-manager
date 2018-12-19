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
            <span class="list-operation" @click="editBigCatee(item, index)">编辑</span>
            <span class="list-operation" @click="delBigCatee(item, index)">删除</span>
          </div>
        </div>
        <div v-if="item.select" class="open-list">
          <div v-for="(twoitem, twoindex) in item.list" :key="twoindex" class="open-item">
            <div class="open-item-left">{{twoitem.name}}</div>
            <div class="big-main-right">
              <span class="list-operation" @click="editSmallCatee(item, index, twoitem, twoindex)">编辑</span>
              <span class="list-operation" @click="delSmallCatee(item, index, twoitem, twoindex)">删除</span>
            </div>
          </div>
          <div class="add-box hand" @click="addChilrenCate(item, index)">
            <div class="icon"></div>
            <div class="text">添加</div>
          </div>
        </div>
      </li>
    </ul>
    <change-model ref="smallModel" :showCate="true" numberPla="长度不能超过10位" @confirm="eidtConfirm"></change-model>
    <change-model ref="bigModel" :showCate="false" numberPla="长度不能超过10位" @confirm="newConfirm"></change-model>
    <default-confirm ref="bigConfirm" :oneBtn="oneBtn" @confirm="delConfirm"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import {categoriesComputed, categoriesMethods} from '@state/helpers'
  import API from '@api'
  import ChangeModel from '@components/change-model/change-model'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import _ from 'lodash'
  const PAGE_NAME = 'PRODUCT_CATEGORIES'
  const TITLE = '商品分类'

  export default {
    name: PAGE_NAME,
    components: {
      ChangeModel,
      DefaultConfirm
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
        smallItem: '',
        smallIndex: '',
        categoryList: [],
        oneBtn: false,
        deteleType: 0
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
      newConfirm(name, sort) {
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
          API.Product.createCategory({name: name, sort: sort}).then((res) => {
            if (res.error === this.$ERR_OK) {
              this.$toast.show('创建成功')
              this.categoryNewName = ''
              this.categoryList.push({name: name, sort: sort, id: res.data.id, list: []})
              this.categoryList.sort(this._sort)
            } else {
              this.$toast.show(res.message)
            }
          })
          break
        case 1:
          API.Product.createCategory({name: name, sort: sort, parent_id: this.bigItem.id}).then((res) => {
            if (res.error === this.$ERR_OK) {
              this.$toast.show('创建成功')
              this.categoryNewName = ''
              this.categoryList[this.bigIndex].list.push({
                name: name,
                sort: sort,
                parent_id: this.bigItem.id,
                id: res.data.id
              })
              this.categoryList[this.bigIndex].list.sort(this._sort)
            } else {
              this.$toast.show(res.message)
            }
          })
          break
        case 2:
          API.Product.editCategory(this.bigItem.id, {name: name, sort: sort, parent_id: 0}).then((res) => {
            if (res.error === this.$ERR_OK) {
              this.$toast.show('编辑成功')
              this.categoryList[this.bigIndex].name = name
              this.categoryList[this.bigIndex].sort = sort
              this.categoryList.sort(this._sort)
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
        this.$forceUpdate()
      },
      addChilrenCate(item, index) {
        this.$refs.bigModel.show('新建商品子分类', this.categoryChild)
        this.categoryType = 1
        this.bigItem = item
        this.bigIndex = index
      },
      editBigCatee(item, index) {
        this.bigItem = item
        this.bigIndex = index
        this.categoryType = 2
        this.$refs.bigModel.show('编辑商品分类', item.name, item.sort)
      },
      delBigCatee(item, index) {
        this.bigItem = item
        this.bigIndex = index
        this.oneBtn = false
        this.deteleType = 0
        this.$refs.bigConfirm.show(`确定删除该分类？`)
      },
      editSmallCatee(item, index, twoitem, twoindex) {
        this.bigItem = item
        this.bigIndex = index
        this.smallItem = twoitem
        this.smallIndex = twoindex
        this.$refs.smallModel.setData(item, this.categoryList)
        this.$refs.smallModel.show('修改商品分类', this.smallItem.name, this.smallItem.sort)
      },
      delSmallCatee(item, index, twoitem, twoindex) {
        this.bigItem = item
        this.bigIndex = index
        this.smallItem = twoitem
        this.smallIndex = twoindex
        this.oneBtn = false
        this.deteleType = 1
        this.$refs.bigConfirm.show(`确定删除该分类？`)
      },
      eidtConfirm(name, sort, id) {
        if (name.length === 0 || name.length > 10) {
          this.$toast.show('计量单位的长度不能超过10个')
          return
        }
        API.Product.editCategory(this.smallItem.id, {name: name, sort: sort, parent_id: id}).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.$toast.show('编辑成功')
            if (this.bigItem.id * 1 === id * 1) {
              this.categoryList[this.bigIndex].list[this.smallIndex].name = name
              this.categoryList[this.bigIndex].list[this.smallIndex].sort = sort
              this.categoryList[this.bigIndex].list.sort(this._sort)
            } else {
              this.categoryList[this.bigIndex].list.splice(this.smallIndex, 1)
              let that = this
              this.categoryList.forEach((item, index) => {
                if (item.id * 1 === id * 1) {
                  that.categoryList[index].list.push({name: name, sort: sort, parent_id: id, id: this.smallItem.id})
                  that.categoryList[index].list.sort(this._sort)
                }
              })
            }
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      delConfirm() {
        switch (this.deteleType * 1) {
        case 0:
          API.Product.delCategory(this.bigItem.id).then((res) => {
            if (res.error === this.$ERR_OK) {
              setTimeout(() => {
                this.categoryList.splice(this.bigIndex, 1)
                this.oneBtn = true
                this.$refs.bigConfirm.show(`该分类已成功删除`)
              }, 1000)
            } else {
              this.$toast.show(res.message)
            }
          })
          break
        case 1:
          API.Product.delCategory(this.smallItem.id).then((res) => {
            if (res.error === this.$ERR_OK) {
              setTimeout(() => {
                this.categoryList[this.bigIndex].list.splice(this.smallIndex, 1)
                this.oneBtn = true
                this.$refs.bigConfirm.show(`该分类已成功删除`)
              }, 1000)
            } else {
              this.$toast.show(res.message)
            }
          })
          break
        }
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
