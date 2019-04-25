<template>
  <div class="product-categories normal-box">
    <div class="identification">
      <div class="identification-page">
        <img src="./icon-goods_classify@2x.png" class="identification-icon">
        <p class="identification-name">商品分类</p>
        <div class="base-status-tab">
          <div v-for="(item, index) in statusTab" :key="index" class="status-tab-item">
            {{item.name}} ({{item.num}})
          </div>
        </div>
        <!--<base-status-tab :statusList="statusTab" @setStatus="changeStatus"></base-status-tab>-->
      </div>
      <div class="function-btn">
        <div class="btn-main" @click="newBigCate">新建大类<span class="add-icon"></span></div>
      </div>
    </div>
    <ul class="categories-box">
      <li v-for="(item, index) in categoryList" :key="index" class="big-box">
        <div class="big-box-main">
          <div class="big-main-left hand" @click="openList(index)">
            <div class="icon" :class="item.select ? 'open' : ''"></div>
            <div class="img" :style="{'background-image': 'url(' +item.image_url+ ')'}"></div>
            <div class="text">{{item.name}} <span class="tip">({{item.list && item.list.length}}个子类)</span></div>
          </div>
          <div class="big-main-right">
            <span class="list-operation" @click="editBigCatee(item, index)">修改</span>
            <span class="list-operation" @click="delBigCatee(item, index)">删除</span>
          </div>
        </div>
        <div v-if="item.select" class="open-list">
          <div v-for="(twoitem, twoindex) in item.list" :key="twoindex" class="open-item">
            <div class="open-item-left">{{twoitem.name}}</div>
            <div class="big-main-right">
              <span class="list-operation" @click="editSmallCatee(item, index, twoitem, twoindex)">修改</span>
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
  import ChangeModel from './change-model/change-model'
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
        statusTab: [
          {name: '一级类目', num: 0},
          {name: '二级类目', num: 0}
        ],
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
      this.getCategoryStatus()
    },
    methods: {
      ...categoriesMethods,
      getCategoryStatus() {
        API.Product.getCategoryStatus()
          .then(res => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            this.statusTab = res.data.map((item, index) => {
              return {
                name: item.status_str,
                num: item.statistic
              }
              // this.$set(this.statusTab[index], 'num', item.statistic)
            })
          })
      },
      newBigCate() {
        // this.$refs.bigModel.show('新建商品分类', this.categoryNewName)
        this.$refs.bigModel.show('新建商品分类', {
          name: this.categoryNewName,
          type: true
        })
        this.categoryType = 0
      },
      newConfirm(data) {
        let {name, sort, imageId, imageUrl, type} = data
        if (name.length === 0 || name.length > 10) {
          // if (this.categoryType === 0) {
          //   this.categoryNewName = name
          // } else if (this.categoryType === 1) {
          //   this.categoryChild = name
          // }
          this.$toast.show('分类名称的长度不能超过10个字')
          return
        }
        if (!imageId && type) {
          this.$toast.show('请上传分类图标')
          return
        }
        switch (this.categoryType) {
        case 0:
          API.Product.createCategory({name: name, sort: sort, image_id: imageId}).then((res) => {
            if (res.error === this.$ERR_OK) {
              this.$refs.bigModel.hide()
              this.$toast.show('创建成功')
              this.categoryNewName = ''
              this.categoryList.push({
                name: name,
                sort: sort,
                id: res.data.id,
                list: [],
                image_url: imageUrl,
                image_id: imageId
              })
              this.categoryList.sort(this._sort)
            } else {
              this.$toast.show(res.message)
            }
          })
          break
        case 1:
          API.Product.createCategory({name: name, sort: sort, parent_id: this.bigItem.id}).then((res) => {
            if (res.error === this.$ERR_OK) {
              this.$refs.bigModel.hide()
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
          API.Product.editCategory(this.bigItem.id, {name: name, sort: sort, image_id: imageId, parent_id: 0}).then(
            (res) => {
              if (res.error === this.$ERR_OK) {
                this.$refs.bigModel.hide()
                this.$toast.show('修改成功')
                this.categoryList[this.bigIndex].name = name
                this.categoryList[this.bigIndex].sort = sort
                this.categoryList[this.bigIndex].image_url = imageUrl
                this.categoryList.sort(this._sort)
              } else {
                this.$toast.show(res.message)
              }
            }
          )
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
        // this.$refs.bigModel.show('新建商品子分类', this.categoryChild, '', '', false)
        this.$refs.bigModel.show('新建商品子分类', {
          name: this.categoryChild,
          type: false
        })
        this.categoryType = 1
        this.bigItem = item
        this.bigIndex = index
      },
      editBigCatee(item, index) {
        this.bigItem = item
        this.bigIndex = index
        this.categoryType = 2
        // this.$refs.bigModel.show('修改商品分类', item.name, item.sort, item.image_url, item.id)
        this.$refs.bigModel.show('修改商品分类', {
          name: item.name,
          sort: item.sort,
          imageUrl: item.image_url,
          imageId: item.image_id,
          id: item.id,
          type: true
        })
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
        // this.$refs.smallModel.show('修改商品分类', this.smallItem.name, this.smallItem.sort, '', false)
        this.$refs.smallModel.show('修改商品分类', {
          name: this.smallItem.name,
          sort: this.smallItem.sort,
          type: false
        })
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
      eidtConfirm(data) {
        let {name, sort, id} = data
        if (name.length === 0 || name.length > 10) {
          this.$toast.show('分类名称的长度不能超过10个字')
          return
        }
        API.Product.editCategory(this.smallItem.id, {name: name, sort: sort, parent_id: id}).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.$refs.smallModel.hide()
            this.$toast.show('修改成功')
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
  .base-status-tab
    margin-left: 30px
    display: flex
    background: #F6F6F6
    border-radius: 100px
    height: 30px
    box-sizing: border-box
    position: relative
    .status-tab-item
      border-radius: 100px
      width: 106px
      color: $color-text-main
      line-height: 30px
      text-align: center
      transition: 0.2s all
      font-size: $font-size-14
      font-family: $font-family-regular
      background: transparent
      position: relative
      z-index: 1
  .categories-box
    border-1px($color-line, 1px)
    .big-box
      width: 100%
      border-bottom-1px($color-line)
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
            &.open
              bg-image('icon-open')
          .img
            width: 32px
            height: 32px
            border-radius: 2px
            border: 0.5px solid $color-line
            margin: 0 10px
            background-size: cover
          .text
            font-size: $font-size-14
            line-height: 1
            color: $color-text-main
            font-family: $font-family-regular
          .tip
            color: $color-text-assist

  .add-box
    height: 60px
    border-top-1px($color-line)
    padding-left: 90px
    layout(row)
    align-items: center
    .icon
      width: 12px
      height: 12px
      border-radius: 50%
      background-size: 12px
      bg-image('icon-add')
      margin-right: 6px
    .text
      font-size: $font-size-14
      line-height: 1
      color: $color-main
      font-family: $font-family-regular

  .open-item
    height: 60px
    border-top-1px($color-line)
    background: $color-white
    padding-left: 90px
    padding-right: 14px
    layout(row)
    align-items: center
    justify-content: space-between
    font-size: $font-size-14
    &:nth-child(2n -1)
      background: #F5F7FA
    &:hover
      background: #F7FAF5
    .open-item-left
      font-size: $font-size-14
      color: $color-text-main
      font-family: $font-family-regular

  .product-categories
    width: 100%
</style>
