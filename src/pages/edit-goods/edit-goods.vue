<template>
  <div class="edit-leader">
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
          <input type="number" class="edit-input" maxlength="11" @mousewheel.native.prevent>
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start" style="opacity: 0">*</span>
          推荐语
        </div>
        <div class="edit-input-box">
          <input type="text" class="edit-input" maxlength="20">
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
          <base-edit-image :picList.sync="msg.goods_images" :picNum="15" @failFile="failFile" @getPic="getPic2" @delPic="delPic2"></base-edit-image>
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
          <base-drop-down :select="dispatchSelect"></base-drop-down>
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          划线价
        </div>
        <div class="edit-input-box">
          <input type="text" class="edit-input" maxlength="10">
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          售价
        </div>
        <div class="edit-input-box">
          <input type="text" class="edit-input">
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          团长佣金
        </div>
        <div class="edit-input-box">
          <input type="text" class="edit-input">
        </div>
        <div class="edit-pla">实际以成交价为准</div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          库存
        </div>
        <div class="edit-input-box">
          <input type="text" class="edit-input">
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          初始销量
        </div>
        <div class="edit-input-box">
          <input type="text" class="edit-input">
        </div>
        <div class="edit-pla">仅展示在小程序，不影响订单</div>
      </div>
    </div>
    <div class="back">
      <div class="back-cancel back-btn hand" @click="_back">返回</div>
      <div class="back-btn btn-main">保存</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'EDIT_GOODS'
  const TITLE = '新建商品'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        msg: {},
        dispatchSelect: {
          check: false,
          show: false,
          content: '全部社区',
          type: 'default',
          data: [{title: 'sdsd'}, {title: 'sds'}] // 格式：{title: '55'}
        }
      }
    },
    methods: {
      _back() {
        this.$router.back()
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
    bottom: 0
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
