<template>
  <div class="edit-supply-goods">
    <div class="identification">
      <div class="identification-page">
        <img src="./icon-new_commodity@2x.png" class="identification-icon">
        <p class="identification-name">{{id ? '编辑商品' : '新建商品'}}</p>
      </div>
      <div class="function-btn">
      </div>
    </div>
    <div class="content-header">
      <div class="content-title">商品信息</div>
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
          类目
        </div>
        <div class="edit-input-box mini-edit-input-box">
          <div class="mini-mr20">
            <base-drop-down :height="40" :width="190" :select="stairSelect" @setValue="setStairValue"></base-drop-down>
          </div>
          <div class="mini-mr20">
            <base-drop-down :height="40" :width="190" :select="stairSelect" @setValue="setStairValue"></base-drop-down>
          </div>
          <base-drop-down :height="40" :width="190" :select="stairSelect" @setValue="setStairValue"></base-drop-down>
        </div>
      </div>
      <div class="edit-item  edit-image-box">
        <div class="edit-title">
          <span class="start">*</span>
          商品图片
        </div>
        <div class="image-box">
          <div class="edit-image">
            <draggable v-model="msg.goods_banner_images" class="draggable" @update="_setSort()">
              <div v-for="(item, index) in msg.goods_banner_images" :key="index" class="show-image hand">
                <img class="img" :src="item.image_url" alt="">
                <span class="close" @click="delPic(index)"></span>
              </div>
            </draggable>
            <div v-if="msg.goods_banner_images.length < picNum" class="add-image hand">
              <input type="file" class="sendImage hand" multiple="multiple" accept="image/*" @change="_addPic('goods_banner_images', picNum, $event)">
              <div v-if="showLoading && uploadImg === 'goods_banner_images'" class="loading-mask">
                <img src="./loading.gif" class="loading">
              </div>
            </div>
          </div>
          <!--<base-edit-image :picList.sync="msg.goods_banner_images" @failFile="failFile" @getPic="getPic" @delPic="delPic"></base-edit-image>-->
          <div class="tip">上传图片的最佳尺寸：1:1，其他尺寸会影响页效果，格式png，jpeg，jpg，最多可上传5张，首张为封面。</div>
        </div>
      </div>
    </div>
    <div class="content-header">
      <div class="content-title">商品规格</div>
    </div>
    <div class="leader-box">
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          基本单位
        </div>
        <div class="edit-input-box">
          <base-drop-down :height="40" :width="400" :select="dispatchSelect" :isUse="!id" @setValue="setValue"></base-drop-down>
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          销售规格
        </div>
        <div class="edit-input-box mini-edit-input-box">
          <input type="number" class="edit-input mini-edit-input" maxlength="10" :disabled="id">
          <div class="edit-input-unit"><span>base_unit</span>/</div>
          <base-drop-down :height="40" :width="133" :select="stairSelect" :isUse="!id" @setValue="setStairValue"></base-drop-down>
        </div>
        <div class="edit-pla">例如：基本单位是kg，销售单位是份，则销售规格可输入0.5，即0.5kg/份</div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          商品编码
        </div>
        <div class="edit-input-box">
          <input type="text" class="edit-input" maxlength="20">
        </div>
      </div>
    </div>
    <div class="content-header procurement-top">
      <div class="content-title">库存信息</div>
    </div>
    <div class="leader-box">
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          销售库存
        </div>
        <div class="edit-input-box goods-select-box">
          <div class="goods-select-left" @click="selectStock(1)">
            <div class="goods-select-icon" :class="goods_skus.is_presale * 1 === 1 ? 'goods-select-icon-active' : ''"></div>
            <div class="goods-select-text">预售库存</div>
          </div>
          <input type="number" class="edit-input edit-input-select" :disabled="goods_skus.is_presale * 1 !== 1">
          <div class="stock-box-text">{{goods_skus.sale_unit}}</div>
          <div class="goods-select-left" @click="selectStock(0)">
            <div class="goods-select-icon" :class="goods_skus.is_presale * 1 === 1 ? '' : 'goods-select-icon-active'"></div>
            <div class="goods-select-text">仓库库存</div>
          </div>
          <div v-if="id" class="stock-box-text current-stock">当前可用库存<span class="stock-color">{{goods_skus.warehouse_usable_stock}}</span>件</div>
        </div>
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
          <base-drop-down :height="40" :width="400" :select="supplierSelect" @setValue="supplierSelectValue"></base-drop-down>
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          采购规格
        </div>
        <div class="edit-input-box mini-edit-input-box">
          <input v-model="goods_skus.base_purchase_rate" type="number" class="edit-input mini-edit-input" maxlength="10" :disabled="id">
          <div class="edit-input-unit"><span>{{goods_skus.base_unit}}</span>/</div>
          <base-drop-down :height="40" :width="133" :select="purchaseSelect" :isUse="!id" @setValue="purchaseSelectValue"></base-drop-down>
        </div>
        <div class="edit-pla">例如：基本单位是kg，采购单位是箱，则采购规格可输入10，即10kg/箱</div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          采购单价
        </div>
        <div class="edit-input-box">
          <input v-model="goods_skus.purchase_price" type="number" class="edit-input" maxlength="10">
        </div>
        <div v-if="goods_skus.purchase_unit" class="edit-pla">元/{{goods_skus.purchase_unit}}</div>
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
            <base-switch width="80px" transform="50px" confirmText="称重" cancelText="不称重" :status="goods_skus.is_weight"></base-switch>
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
  import Draggable from 'vuedraggable'
  const PAGE_NAME = 'EDIT_SUPPLY_GOODS'
  const TITLE = '新建商品'

  export default {
    name: PAGE_NAME,
    components: {
      Draggable
    },
    page: {
      title: TITLE
    },
    data() {
      return {
        id: '',
        msg: {
          goods_detail_images: [],
          goods_banner_images: []
        },
        goods_skus: {
          is_presale: 1,
          sale_unit: 'kg'
        },
        stairSelect: {
          check: false,
          show: false,
          content: '一级分类',
          type: 'default',
          data: []
        },
        showLoading: false,
        uploadImg: '',
        picNum: 5
      }
    },
    methods: {
      setStairValue() {},
      _submit() {},
      _back() {}
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/detail"

  .img
    width :100%
    height :@width
    display :block
    object-fit :cover

  .edit-supply-goods
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
      border-radius: 2px
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
        position: relative
      .edit-input
        font-size: $font-size-14
        padding: 0 14px
        border-radius: 2px
        width: 400px
        height: 40px
        border: 0.5px solid $color-line
        transition: all 0.3s
        &:disabled
          color: $color-text-assist
          background: $color-white
        &::-webkit-inner-spin-button
          appearance: none
        &:hover
          border: 1px solid #ACACAC
        &::placeholder
          font-family: $font-family-regular
          color: $color-text-assist
        &:focus
          border-color: $color-main !important
      .edit-textarea
        padding: 5px 14px
        height: 94px
        resize: none
      .num
        position: absolute
        right: 10px
        bottom: 10px
        font-size: $font-size-12
        font-family: $font-family-regular
        color: $color-text-assist
      .mini-edit-input
        width: 133px
        border-radius: 0
        border-top-left-radius: 2px
        border-bottom-left-radius: 2px
        border-right: none
        &:hover
          border-color: $color-line
      .edit-input-unit
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-text-main
        width: 134px
        height: 40px
        line-height: 40px
        text-align: center
        background: #F9F9F9
        border: 1px solid $color-line
        border-right: none
        margin-right: -1px
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
  .goods-select-box
    layout(row)
    align-items: center
    height: 44px
    .goods-select-left
      height: 44px
      layout(row)
      align-items: center
      cursor: pointer
      .goods-select-icon
        width: 18px
        height: @width
        border: 1px solid #E1E1E1
        background: #F9F9F9
        border-radius: 50%
        margin-right: 10px
      .goods-select-icon-active
        border: 0 solid transparent
        background-size: @width
        icon-image(icon-single_election)
      .goods-select-text
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-text-main
        margin-right: 10px
    .edit-input-select
      width: 148px !important
    .stock-box-text
      width: 74px
      height: 44px
      line-height: 44px
      font-family: $font-family-regular
      color: $color-text-main
      font-size: $font-size-14
      padding-left: 14px
    .current-stock
      width: auto
      padding-left: 0
      .stock-color
        color: $color-negative
  .edit-image
    flex-wrap: wrap
    display: flex
    .draggable
      flex-wrap: wrap
      display: flex
    .add-image
      margin-bottom: 20px
      icon-image('pic-picture1')
      height: 90px
      width: @height
      position: relative
      border-radius: 2px
      overflow: hidden
      .sendImage
        height: 100%
        width: 100%
        top: 0
        left: 0
        opacity: 0
        z-index: 1
        position: absolute
    .show-image
      margin-bottom: 20px
      background-repeat: no-repeat
      background-size: cover
      background-position: center
      height: 90px
      margin-right: 20px
      width: @height
      border-radius: 2px
      position: relative
      overflow: hidden
    .close
      icon-image('pic-delete')
      width: 15px
      height: 15px
      position: absolute
      top: 0
      right: 0
      z-index: 100

    .loading-mask
      width: 100%
      height: 100%
      position: absolute
      top: 0
      left: 0
      background: rgba(0, 0, 0, .6)
      .loading
        all-center()
        width: 25px
        height: 25px
  .add-image
    margin-bottom: 20px
    icon-image('pic-picture1')
    height: 90px
    width: @height
    position: relative
    border-radius: 2px
    overflow: hidden
    .sendImage
      height: 100%
      width: 100%
      top: 0
      left: 0
      opacity: 0
      z-index: 1

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
