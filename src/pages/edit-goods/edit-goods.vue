<template>
  <div class="edit-leader">
    <div class="identification">
      <div class="identification-page">
        <img src="./icon-new_commodity@2x.png" class="identification-icon">
        <p class="identification-name">{{id ? '编辑商品' : '新建商品'}}</p>
      </div>
      <div class="function-btn">
      </div>
    </div>
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
          <input v-model="msg.name" type="text" class="edit-input" maxlength="29" @mousewheel.native.prevent>
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          商品分类
        </div>
        <div class="edit-input-box mini-edit-input-box">
          <div class="mini-mr20">
            <base-drop-down :height="44" :width="190" :select="stairSelect" @setValue="setStairValue"></base-drop-down>
          </div>
          <base-drop-down :height="44" :width="190" :select="secondSelect" @setValue="setSecondValue"></base-drop-down>
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          基本单位
        </div>
        <div class="edit-input-box">
          <base-drop-down :height="44" :width="400" :select="dispatchSelect" @setValue="setValue"></base-drop-down>
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start" style="opacity: 0">*</span>
          推荐语
        </div>
        <div class="edit-input-box">
          <input v-model="msg.describe" type="text" class="edit-input" maxlength="100">
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
      <div class="content-title">销售信息</div>
    </div>
    <div class="leader-box">
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          销售规格
        </div>
        <div class="edit-input-box mini-edit-input-box">
          <input v-model="goods_skus.base_sale_rate" type="number" class="edit-input mini-edit-input" maxlength="10">
          <div class="edit-input-unit"><span>{{goods_skus.base_unit}}</span>/</div>
          <base-drop-down :height="40" :width="133" :select="saleSelect" @setValue="saleSelectValue"></base-drop-down>
        </div>
        <div class="edit-pla">请先选择基本单位</div>
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
          销售售价
        </div>
        <div class="edit-input-box">
          <input v-model="msg.trade_price" type="number" class="edit-input">
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
          销售库存
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
          <input v-model="msg.init_sale_count" type="number" class="edit-input">
        </div>
        <div class="edit-pla">仅展示在小程序，不影响订单</div>
      </div>
    </div>
    <div class="content-header procurement-top">
      <div class="content-title">供应链信息</div>
    </div>
    <div class="leader-box">
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          供应商
        </div>
        <div class="edit-input-box">
          <base-drop-down :height="44" :width="400" :select="supplierSelect" @setValue="supplierSelectValue"></base-drop-down>
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          采购规格
        </div>
        <div class="edit-input-box mini-edit-input-box">
          <input v-model="goods_skus.base_purchase_rate" type="number" class="edit-input mini-edit-input" maxlength="10">
          <div class="edit-input-unit"><span>{{goods_skus.base_unit}}</span>/</div>
          <base-drop-down :height="40" :width="133" :select="purchaseSelect" @setValue="purchaseSelectValue"></base-drop-down>
        </div>
        <div class="edit-pla">请先选择基本单位</div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          损耗比
        </div>
        <div class="edit-input-box">
          <input v-model="goods_skus.damage_rate" type="number" class="edit-input">
        </div>
        <div class="edit-pla">根据耗损的百分比额外增加采购数量（%）</div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          是否称重
        </div>
        <div class="edit-input-box">
          <div class="list-item-btn" @click="switchBtn">
            <base-switch width="80px" transform="50px" confirmText="称重" cancelText="不称重" :status="msg.goods_skus[0].is_weight"></base-switch>
          </div>
        </div>
      </div>
    </div>
    <div class="back">
      <div class="back-cancel back-btn hand" @click="_back">返回</div>
      <div class="back-btn back-submit hand" @click="_submit">保存</div>
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
          trade_price: '',
          is_online: 1,
          is_multi_specs: 0,
          goods_category_id: 0,
          original_price: '',
          usable_stock: '',
          commission_rate: '',
          goods_skus: [
            {
              id: 0,
              trade_price: 0,
              original_price: 0,
              usable_stock: 0,
              image_id: '',
              specs: '',
              is_weight: 1
            }
          ],
        },
        dispatchSelect: {
          check: false,
          show: false,
          content: '基本单位',
          type: 'default',
          data: []
        },
        saleSelect: {
          check: false,
          show: false,
          content: '销售单位',
          type: 'default',
          data: []
        },
        supplierSelect: {
          check: false,
          show: false,
          content: '选择供应商',
          type: 'default',
          data: []
        },
        purchaseSelect: {
          check: false,
          show: false,
          content: '采购单位',
          type: 'default',
          data: []
        },
        stairSelect: {
          check: false,
          show: false,
          content: '一级分类',
          type: 'default',
          data: []
        },
        secondSelect: {
          check: false,
          show: false,
          content: '二级分类',
          type: 'default',
          data: []
        },
        menuName: '请选择',
        showMenu: false,
        preMenuIndex: null,
        preChildIndex: null,
        isSubmit: false,
        goods_skus: {
          base_sale_rate: '',
          base_purchase_rate: '',
          base_unit: '',
          sale_unit: '',
          purchase_unit: '',
          damage_rate: '',
          supplier_id: 0
        },
        isWeight: 1
      }
    },
    created() {
      this.id = this.$route.query.id || null
      this._setData()
      this.getSelectData()
      this.getSupplierData()
      this.getCategoriesData()
    },
    methods: {
      /**
       * 设置默认数据 -> 编辑状态
       * @private
       */
      _setData() {
        if (!_.isEmpty(this.detail)) {
          this.msg = _.cloneDeep(this.detail)
          this.dispatchSelect.content = this.msg.goods_skus[0].base_unit
          this.goods_skus = this.msg.goods_skus[0]
          this.saleSelect.content = this.goods_skus.sale_unit
          this.supplierSelect.content = this.goods_skus.supplier_name
          this.purchaseSelect.content = this.goods_skus.purchase_unit
          this.menuName = this.msg.goods_category_name
        }
      },
      _back() {
        this.$router.back()
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
        this.msg.init_sale_count += ''
        if (this.msg.name.length === 0 || this.msg.name.length >= 30) {
          this.$toast.show('请选择输入商品名称且小于30字')
          return
        } else if (this.msg.goods_category_id <= 0) {
          this.$toast.show('请选择商品分类')
          return
        } else if (this.goods_skus.base_unit === '') {
          this.$toast.show('请选择基本单位')
          return
        } else if (this.msg.goods_banner_images.length === 0) {
          this.$toast.show('请上传商品封面图')
          return
        } else if (this.msg.goods_detail_images.length === 0) {
          this.$toast.show('请上传商品详情图')
          return
        } else if (this.goods_skus.base_sale_rate.length === 0) {
          this.$toast.show('请输入销售规格')
          return
        } else if (this.goods_skus.base_sale_rate <= 0) {
          this.$toast.show('请输入销售规格大于零')
          return
        } else if (this.goods_skus.sale_unit === '') {
          this.$toast.show('请选择销售单位')
          return
        } else if (this.msg.original_price.length === 0) {
          this.$toast.show('请输入划线价')
          return
        } else if (this.msg.trade_price.length === 0) {
          this.$toast.show('请输入售价')
          return
        } else if (+this.msg.original_price < +this.msg.trade_price) {
          this.$toast.show('请输入划线价大于售价')
          return
        } else if (+this.msg.commission_rate < 0 || +this.msg.commission_rate > 100 || !this.msg.commission_rate) {
          this.$toast.show('成员佣金比率区间在0与100之间')
          return
        } else if (!this.msg.usable_stock || this.msg.usable_stock.includes('.') || +this.msg.usable_stock < 0) {
          this.$toast.show('请输入正确商品库存')
          return
        } else if (this.goods_skus.base_purchase_rate.length === 0) {
          this.$toast.show('请输入采购规格')
          return
        } else if (this.goods_skus.base_purchase_rate <= 0) {
          this.$toast.show('请输入采购规格大于零')
          return
        } else if (this.goods_skus.supplier_id <= 0) {
          this.$toast.show('请选择供应商')
          return
        } else if (this.goods_skus.purchase_unit === '') {
          this.$toast.show('请选择采购单位')
          return
        } else if (
          +this.goods_skus.damage_rate < 0 ||
          +this.goods_skus.damage_rate > 100 ||
          !this.goods_skus.damage_rate
        ) {
          this.$toast.show('损耗比区间在0与100之间')
          return
        } else if (
          !this.msg.init_sale_count ||
          this.msg.init_sale_count.includes('.') ||
          +this.msg.init_sale_count <= 0
        ) {
          this.$toast.show('请输入正确初始销量')
          return
        }
        this.msg.goods_skus[0] = this.goods_skus
        this.msg.goods_skus[0].trade_price = this.msg.trade_price
        this.msg.goods_skus[0].original_price = this.msg.original_price
        this.msg.goods_skus[0].usable_stock = this.msg.usable_stock
        this.isSubmit = true
        if (this.id) {
          API.Product.editGoodsDetail(this.id, this.msg).then((res) => {
            if (res.error === this.$ERR_OK) {
              this.$toast.show('编辑成功')
              setTimeout(() => {
                this._back()
              }, 1000)
            } else {
              this.$toast.show(res.message)
            }
            this.$loading.hide()
            this.isSubmit = false
          })
          return
        }
        API.Product.createGoodsDetail(this.msg).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.$toast.show('创建成功')
            setTimeout(() => {
              this._back()
            }, 1000)
          } else {
            this.$toast.show(res.message)
          }
          this.$loading.hide()
          this.isSubmit = false
        })
      },
      getSelectData() {
        API.Product.getUnitsList({}, false).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.dispatchSelect.data = res.data
            this.saleSelect.data = res.data
            this.purchaseSelect.data = res.data
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      getSupplierData() {
        API.Product.getSupplier({page: 1, limit: 10}, false).then((res) => {
          if (res.error === this.$ERR_OK) {
            res.data.forEach((item) => {
              item.name = item.supplier_name
            })
            this.supplierSelect.data = res.data
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      getCategoriesData() {
        API.Product.getCategory({parent_id: -1, goods_id: this.id}, false).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.stairSelect.data = res.data
            res.data.forEach((item) => {
              if (item.is_selected) {
                this.stairSelect.content = item.name
                this.secondSelect.data = item.list
                this.secondSelect.data.forEach((twomitem) => {
                  if (twomitem.is_selected) {
                    this.secondSelect.content = twomitem.name
                  }
                })
              }
            })
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      setValue(data) {
        this.goods_skus.base_unit = data.name
      },
      saleSelectValue(data) {
        this.goods_skus.sale_unit = data.name
      },
      purchaseSelectValue(data) {
        this.goods_skus.purchase_unit = data.name
      },
      supplierSelectValue(data) {
        this.goods_skus.supplier_id = data.supplier_id
      },
      setStairValue(data) {
        this.secondSelect.content = '二级分类'
        this.secondSelect.data = data.list
        this.msg.goods_category_id = data.id
      },
      setSecondValue(data) {
        this.msg.goods_category_id = data.id
      },
      switchBtn() {
        this.msg.goods_skus[0].is_weight = !this.msg.goods_skus[0].is_weight ? 1 : 0
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/detail"

  .edit-leader
    position: relative
    flex: 1
    background: $color-white
    padding: 0 20px 80px
    box-sizing: border-box

  .select-box-input
    position: relative
    .edit-input
      line-height: 40px
      layout(row)
      align-items: center
      justify-content: space-between
      .select-text
        font-size: $font-size-14
        font-family: $font-family-regular
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
      border-radius: 1px
      box-shadow: 0 2px 6px 0 #f2f0fa
      transition: all .3s
      opacity: 1
      overflow: hidden
      layout(row)
      .fater-list
        height: 180px
        overflow: auto
        padding: 5px 0 !important
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
        padding: 5px 0 !important
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
    -webkit-box-shadow: inset 0 0 5px rgba(93, 93, 93, .2)
    background: #c3c3c3
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(78, 78, 78, .2)
    border-radius: 10px
    background: #e3e3e3
  }

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
        border-radius: 1px
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
          border-color: $color-main !important
      .mini-edit-input
        width: 133px
      .edit-input-unit
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-text-main
        border-radius: 1px
        width: 134px
        height: 40px
        line-height: 40px
        text-align: center
        background: #F9F9F9
        border: 1px solid #D6D6D6
  .mini-edit-input-box
    layout(row)
    .mini-mr20
      margin-right: 20px
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
  .procurement-top
    margin-top: 24px
  .edit-msg
    font-size: $font-size-medium14
    color: #acacac
    margin-left: 10px

</style>
