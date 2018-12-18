<template>
  <div class="edit-leader" @click="closeMenu">
    <div class="content-header">
      <div class="content-title">基本信息</div>
    </div>
    <div class="leader-box">
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          商品名称
        </div>
        <div class="edit-input-box">
          <input v-model="msg.name" type="text" class="edit-input" maxlength="30" @mousewheel.native.prevent>
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          商品分类
        </div>
        <div class="edit-input-box hand select-box-input">
          <div class="edit-input" @click.stop="menutBtn">
            <div class="select-text" :class="menuName === '请选择' ? 'select-text-assist' : ''">{{menuName}}</div>
            <div class="select-icon" :class="showMenu ? 'select-icon-active' : ''"></div>
          </div>
          <div class="select-main-box" :class="showMenu ? '' : 'menu-leave-to'">
            <ul class="fater-list">
              <li v-for="(item, index) in menuList" :key="index" :class="menuIndex === index ? 'item-active' : ''" class="item"
                  @mouseenter="menuListMouse(item, index)" @click.stop="menuListClick(item, index)"
              >
                <div class="text">{{item.name}}</div>
                <div v-if="item.list.length !== 0" class="icon"></div>
              </li>
            </ul>
            <ul class="child-list">
              <li v-for="(item, index) in goodsChildren" :key="index" class="item" :class="item.select ? 'item-active' : ''" @click.stop="menuChild(item, index)">
                <div class="text">{{item.name}}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start" style="opacity: 0">*</span>
          推荐语
        </div>
        <div class="edit-input-box">
          <input v-model="msg.describe" type="text" class="edit-input" maxlength="20">
        </div>
      </div>
      <div class="edit-item  edit-image-box">
        <div class="edit-title">
          <span class="start">*</span>
          商品图片
        </div>
        <div class="image-box">
          <base-edit-image :picList.sync="msg.goods_banner_images" @failFile="failFile" @getPic="getPic" @delPic="delPic"></base-edit-image>
          <div class="tip">上传图片的最佳尺寸：1:1，其他尺寸会影响页效果，格式png，jpeg，jpg，最多可上传5张，首张为封面。</div>
        </div>
      </div>
      <div class="edit-item  edit-image-box">
        <div class="edit-title">
          <span class="start">*</span>
          商品详情
        </div>
        <div class="image-box">
          <base-edit-image :picList.sync="msg.goods_detail_images" :picNum="15" @failFile="failFile" @getPic="getPic2" @delPic="delPic2"></base-edit-image>
          <div class="tip">上传图片的格式png，jpeg，jpg，最多可上传15张。</div>
        </div>
      </div>
    </div>
    <div class="content-header">
      <div class="content-title">价格库存</div>
    </div>
    <div class="leader-box">
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          售卖单位
        </div>
        <div class="edit-input-box">
          <base-drop-down :select="dispatchSelect" @setValue="setValue"></base-drop-down>
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          划线价
        </div>
        <div class="edit-input-box">
          <input v-model="msg.original_price" type="number" class="edit-input" maxlength="10">
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          售价
        </div>
        <div class="edit-input-box">
          <input v-model="msg.store_price" type="number" class="edit-input">
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          团长佣金
        </div>
        <div class="edit-input-box">
          <input v-model="msg.commission_rate" type="number" class="edit-input" maxlength="3">
        </div>
        <div class="edit-pla">实际以成交价为准(%)</div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          库存
        </div>
        <div class="edit-input-box">
          <input v-model="msg.usable_stock" type="number" class="edit-input">
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          初始销量
        </div>
        <div class="edit-input-box">
          <input v-model="msg.sale_count" type="number" class="edit-input">
        </div>
        <div class="edit-pla">仅展示在小程序，不影响订单</div>
      </div>
    </div>
    <div class="back">
      <div class="back-cancel back-btn hand" @click="_back">返回</div>
      <div class="back-btn btn-main" @click="_submit">保存</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import _ from 'lodash'
  const PAGE_NAME = 'EDIT_GOODS'
  const TITLE = '新建商品'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    props: {
      detail: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        msg: {
          name: '',
          describe: '',
          goods_banner_images: [],
          goods_detail_images: [],
          goods_units: '',
          store_price: '',
          is_online: 1,
          is_multi_specs: 0,
          goods_category_id: 0,
          original_price: '',
          usable_stock: '',
          commission_rate: '',
          goods_skus: [
            {
              id: 0,
              store_price: 0,
              original_price: 0,
              usable_stock: 0,
              image_id: '',
              specs: ''
            }
          ]
        },
        dispatchSelect: {
          check: false,
          show: false,
          content: '售卖单位',
          type: 'default',
          data: []
        },
        menuList: [],
        menuIndex: null,
        goodsChildren: [],
        menuName: '请选择',
        showMenu: false,
        preMenuIndex: null,
        preChildIndex: null,
        isSubmit: false
      }
    },
    created() {
      this.id = this.$route.query.id || null
      this._setData()
      this.getSelectData()
      this.getCategoriesData()
    },
    methods: {
      /**
       * 设置默认数据 -> 编辑状态
       * @private
       */
      _setData() {
        if (!_.isEmpty(this.detail)) {
          console.log(this.detail)
          this.msg = _.cloneDeep(this.detail)
          this.dispatchSelect.content = this.msg.goods_units
          this.menuName = this.msg.goods_category_name
        }
      },
      _back() {
        this.$router.back()
      },
      menuListMouse(item, index) {
        if (item.list.length === 0) return
        this.menuIndex = index
        this.goodsChildren = item.list
      },
      menuListClick(item, index) {
        console.log(item, 'menuList')
        if (item.list.length !== 0) return
        this.menuIndex = index
        this.menuName = item.name
        this.goodsChildren = []
        if (this.preChildIndex) {
          this.menuList[this.preMenuIndex].list[this.preChildIndex].select = false
          console.log(this.menuList[this.preMenuIndex].list[this.preChildIndex])
        }
        this.showMenu = false
        this.msg.goods_category_id = item.id
      },
      menuChild(item, index) {
        console.log(item, 'child')
        this.menuName = this.menuList[this.menuIndex].name + ' / ' + item.name
        this.menuList[this.menuIndex].list[index].select = true
        if (this.preChildIndex) {
          this.menuList[this.preMenuIndex].list[this.preChildIndex].select = false
          console.log(this.menuList[this.preMenuIndex].list[this.preChildIndex])
        }
        this.preMenuIndex = this.menuIndex
        this.preChildIndex = index
        this.goodsChildren[index].select = true
        this.showMenu = false
        this.msg.goods_category_id = item.id
      },
      menutBtn() {
        this.showMenu = !this.showMenu
      },
      closeMenu() {
        this.showMenu = false
      },
      getPic(image) {
        let item = {id: 0, image_id: image.id, image_url: image.url}
        this.msg.goods_banner_images.push(item)
      },
      delPic(index) {
        this.msg.goods_banner_images.splice(index, 1)
      },
      getPic2(image) {
        let item = {id: 0, image_id: image.id, image_url: image.url}
        this.msg.goods_detail_images.push(item)
      },
      delPic2(index) {
        this.msg.goods_detail_images.splice(index, 1)
      },
      failFile(msg) {
        this.$emit('showToast', msg)
      },
      _submit() {
        if (this.isSubmit) {
          return
        }
        this.msg.usable_stock += ''
        this.msg.sale_count += ''
        if (this.msg.name.length === 0 || this.msg.name.length >= 30) {
          this.$toast.show('请选择输入商品名称且小于30字')
          return
        } else if (this.msg.goods_category_id <= 0) {
          this.$toast.show('请选择商品分类')
          return
        } else if (this.msg.goods_banner_images.length === 0) {
          this.$toast.show('请上传商品封面图')
          return
        } else if (this.msg.goods_detail_images.length === 0) {
          this.$toast.show('请上传商品详情图')
          return
        } else if (this.msg.describe.length >= 20) {
          this.$toast.show('推荐语不能大于20个字')
          return
        } else if (this.msg.describe.length >= 20) {
          this.$toast.show('推荐语不能大于20个字')
          return
        } else if (this.msg.goods_units === '') {
          this.$toast.show('请选择售卖单位')
          return
        } else if (this.msg.original_price.length === 0) {
          this.$toast.show('请输入划线价')
          return
        } else if (this.msg.store_price.length === 0) {
          this.$toast.show('请输入售价')
          return
        } else if (+this.msg.original_price < +this.msg.store_price) {
          this.$toast.show('请输入划线价大于售价')
          return
        } else if (+this.msg.commission_rate < 0 || +this.msg.commission_rate > 100 || !this.msg.commission_rate) {
          this.$toast.show('成员佣金比率区间在0与100之间')
          return
        } else if (!this.msg.usable_stock || this.msg.usable_stock.includes('.') || +this.msg.usable_stock <= 0) {
          this.$toast.show('请输入正确商品库存')
          return
        } else if (!this.msg.sale_count || this.msg.sale_count.includes('.') || +this.msg.sale_count <= 0) {
          this.$toast.show('请输入正确初始销量')
          return
        }
        this.msg.goods_skus[0].store_price = this.msg.store_price
        this.msg.goods_skus[0].original_price = this.msg.original_price
        this.msg.goods_skus[0].usable_stock = this.msg.usable_stock
        this.isSubmit = true
        if (this.id) {
          API.Product.editGoodsDetail(this.id, this.msg).then((res) => {
            if (res.error === this.$ERR_OK) {
              this.$toast.show('编辑成功')
              setTimeout(() => {
                this.isSubmit = false
                this._back()
              }, 1000)
            } else {
              this.$toast.show(res.message)
            }
            this.$loading.hide()
          })
          return
        }
        API.Product.createGoodsDetail(this.msg).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.$toast.show('创建成功')
            setTimeout(() => {
              this.isSubmit = false
              this._back()
            }, 1000)
          } else {
            this.$toast.show(res.message)
          }
          this.$loading.hide()
        })
      },
      getSelectData() {
        API.Product.getUnitsList({}, false).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.dispatchSelect.data = res.data
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      getCategoriesData() {
        API.Product.getCategory({parent_id: -1}, false).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.menuList = res.data
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      setValue(data) {
        this.msg.goods_units = data.name
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .edit-leader
    padding-bottom: 80px
    position: relative
    flex: 1
  .select-box-input
    position: relative
    .edit-input
      line-height: 40px
      layout(row)
      align-items: center
      justify-content: space-between
      .select-text
        font-size: $font-size-14
        font-family: $font-family-medium
        color: $color-text-main
      .select-text-assist
        color: $color-text-assist
      .select-icon
        width: 18px
        height: 18px
        background-size: 18px
        bg-image(icon-drop_down)
        transition: all 0.5s
      .select-icon-active
        transform: rotate(180deg)
    .select-main-box
      position: absolute
      min-width: 220px
      height: 180px
      z-index: 111
      display: block
      top: 45px
      left: 0
      background-color: #fff
      box-sizing: border-box
      border-radius: 4px
      box-shadow: 0 2px 6px 0 #f2f0fa
      transition: all .3s
      opacity: 1
      overflow: hidden
      layout(row)
      .fater-list
        height: 180px
        overflow: auto
        padding: 5px 0!important
        list-style: none
        .item
          min-width: 100px
          height: 30px
          layout(row)
          align-items: center
          justify-content: space-between
          padding: 0 5px
          box-sizing: border-box
          &:hover
            background: #eaeaea
          .text
            font-size: $font-size-14
            font-family: $font-family-regular
            color: $color-text-main
          .icon
            width: 10px
            height: 15px
            background-size: 10px 15px
            bg-image(icon-right)
        .item-active
          background: #eaeaea
          .text
            color: $color-main
      .child-list
        min-width: 110px
        height: 180px
        overflow: auto
        padding: 5px 0!important
        list-style: none
        .item
          min-width: 100px
          height: 30px
          layout(row)
          align-items: center
          justify-content: space-between
          padding: 0 5px
          box-sizing: border-box
          &:hover
            background: #eaeaea
          .text
            font-size: $font-size-14
            font-family: $font-family-regular
            color: $color-text-main
          .icon
            width: 10px
            height: 15px
            background-size: 10px 15px
            bg-image(icon-right)
        .item-active
          background: #eaeaea
          .text
            color: $color-main
    .menu-leave-to
      height: 0
  ::-webkit-scrollbar {
    width: 10px
    height: 10px
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 10px
    -webkit-box-shadow: inset 0 0 5px rgba(93,93,93,.2)
    background: #c3c3c3
  }
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(78,78,78,.2)
    border-radius: 10px
    background: #e3e3e3
  }
  /*基本信息类头部盒子样式*/
  .content-header
    border-bottom: 1px solid $color-line
    display: flex
    align-items: center
    justify-content: space-between
    height: 62px
    position: relative
    box-sizing: border-box
    &:after
      content: ''
      position: absolute
      width: 34px
      height: 2px
      background: $color-main
      border-radius: 1px
      bottom: -1px
      left: 0
    .content-title
      color: $color-text-main
      font-family: $font-family-medium
      font-size: $font-size-16

  .leader-box
    padding: 0 20px
    box-sizing: border-box
    .edit-item
      display: flex
      color: #2A2A2A
      min-height: 40px
      margin-top: 24px
      .edit-title
        margin-top: 7.5px
        font-size: $font-size-14
        font-family: $font-family-regular
        white-space: nowrap
        text-align: left
        width: 64px
      .start
        display: inline-block
        margin-right: -2px
        color: #F52424
      .edit-input-box
        margin-left: 40.9px
      .edit-input
        font-size: $font-size-14
        padding: 0 14px
        border-radius: 4px
        width: 400px
        height: 40px
        border: 1px solid $color-line
        transition: all 0.3s
        &::-webkit-inner-spin-button
          appearance: none
        &:hover
          border: 1px solid #ACACAC
        &::placeholder
          font-family: $font-family-regular
          color: $color-text-assist
        &:focus
          border-color: $color-sub !important
      .edit-text
        font-size: $font-size-14
        padding: 10px 14px
        border-radius: 4px
        width: 400px
        height: 70px
        border: 1px solid $color-line
        transition: all 0.3s
        resize: none
        outline: none
        &:hover
          border: 1px solid #ACACAC
        &::placeholder
          font-family: $font-family-regular
          color: $color-text-assist
        &:focus
          border-color: $color-sub !important

  .back
    position: absolute
    left: -20px
    right: -20px
    bottom: -60px
    z-index: 10
    background: #F9F9F9
    height: 80px
    border-radius: 0 0 6px 6px
    display: flex
    align-items: center
    padding-left: 40px
    box-sizing: border-box
    .back-btn
      box-sizing: border-box
      font-size: $font-size-16
      margin-right: 20px
      padding: 12px 32px
      transition: all 0.3s
    .back-cancel
      padding: 11px 32px
      box-sizing: border-box
      line-height: 1
      color: $color-text-main
      border: 1px solid #ACACAC
      border-radius: 4px
      &:hover
        color: $color-text-sub
        border-color: $color-text-sub
  .edit-pla
    font-size: $font-size-14
    color: $color-text-assist
    font-family: $font-family-regular
    display: flex
    align-items: center
    margin-left: 10px
  .image-box
    margin-left: 40.9px
  .edit-image-box
    align-items: flex-start
    min-height: 116px
    margin-bottom: 30px
    .edit-title
      margin-top: 15px
    .tip
      text-align: left
      margin-top: -6px
      font-size: $font-size-14
      color: $color-text-assist
      font-family: $font-family-regular

  .edit-msg
    font-size: $font-size-medium14
    color: #acacac
    margin-left: 10px

</style>
