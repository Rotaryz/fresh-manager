<template>
  <div class="edit-rush">
    <div class="content-header">
      <div class="content-title">基本信息</div>
    </div>
    <div class="rush-time">
      <div class="edit-item edit-activity">
        <div class="edit-title">
          <span class="start">*</span>
          活动时间
        </div>
        <div class="edit-input-box">
          <div class="edit-input">
            <div class="edit-time">2018-12-07 23:00</div>
            <span class="time-icon"></span>
          </div>
        </div>
        <div class="tip">至</div>
        <div class="edit-input-box edit-input-right">
          <div class="edit-input">
            <div class="edit-time">2018-12-07 23:00</div>
            <span class="time-icon"></span>
          </div>
        </div>
      </div>
      <div class="edit-item edit-arrive">
        <div class="edit-title">
          <span class="start">*</span>
          预计到货时间
        </div>
        <div class="edit-input-box">
          <div class="edit-input">
            <div class="edit-time">2018-12-07 23:00</div>
            <span class="time-icon"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="content-header">
      <div class="content-title">活动商品</div>
    </div>
    <div class="activity-box">
      <div class="classify">
        <div v-for="(item, index) in classify" :key="index" class="classify-item hand" :class="{'classify-item-active': index === classifyIndex}" @click="_setClassify(index, item)">{{item.text}}</div>
      </div>
      <div class="activity-list">
        <div class="activity-tab">
          <div class="btn-main">添加商品 +</div>
        </div>
        <div class="commodities-list-header com-list-box">
          <div v-for="(item, index) in commodities" :key="index" class="com-list-item">{{item}}</div>
        </div>
        <div class="big-box" :style="{'height': listHeight + 'px'}">
          <div class="com-list-box com-list-content">
            <div class="com-list-item">1</div>
            <div class="com-list-item">口水鸭先鸡不知口水鸭先鸡不知口水鸭先鸡不知口水鸭先鸡不知</div>
            <div class="com-list-item">斤</div>
            <div class="com-list-item">
              <input type="text" class="com-edit" value="￥5.98">
            </div>
            <div class="com-list-item">
              <input type="text" class="com-edit com-edit-small" value="10">
            </div>
            <div class="com-list-item">
              <input type="text" class="com-edit com-edit-small" value="10">
            </div>
            <div class="com-list-item">12</div>
            <div class="com-list-item">￥45.32</div>
            <div class="com-list-item">
              <span class="list-operation">删除</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="back">
      <div class="back-cancel back-btn hand" @click="_back">返回</div>
      <div class="back-btn btn-main">保存</div>
    </div>
    <default-modal ref="shadeCustom">
      <div slot="content" class="shade-box">
        <div class="shade-header">
          <div class="shade-title">编辑活动分类</div>
          <span class="close hand"></span>
        </div>
        <div class="auxiliary-box">
          <div v-for="(item, index) in 12" :key="index" class="auxiliary-item">
            <div class="text">蔬菜水果</div>
            <div class="auxiliary-model">
              <div class="img-box" @click="_changeItem"></div>
              <div class="img-box del" @click="_delItem"></div>
            </div>
          </div>
          <div class="btn-main auxiliary-add">新增+</div>
        </div>
        <div class="back">
          <div class="back-cancel back-btn hand">取消</div>
          <div class="back-btn btn-main">保存</div>
        </div>
        <!--小弹窗-->
        <transition name="fade">
          <section v-show="isShow" class="default-modal-small">
            <div :class="showActive ? 'model-active' : 'model-un-active'">

            </div>
          </section>
        </transition>
      </div>
    </default-modal>
    <!--确定取消弹窗-->
    <!--<default-confirm></default-confirm>-->
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  // import DefaultConfirm from '@components/default-confirm/default-confirm'

  const PAGE_NAME = 'EDIT_RUSH'
  const TITLE = '新建编辑今日抢购'
  const COMMODITIES_LIST = ['商品名称', '单位', '划线价', '活动价格', '单人限购', '活动库存', '销量', '排序', '操作']
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultModal
      // DefaultConfirm
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        classifyIndex: 0,
        classify: [
          {text: '报考', status: 0},
          {text: '日常百货', status: 'c_common'},
          {text: '水果', status: 'c_groupon'},
          {text: '蔬菜', status: 'c_bargain'},
          {text: '鲜肉', status: 'c_praise'}
        ],
        listHeight: 417,
        showActive: true,
        isShow: true
      }
    },
    mounted() {
      this._getListHeight()
    },
    methods: {
      _setClassify(index, item) {
        this.classifyIndex = index
      },
      _getListHeight() {
        let ele = document.querySelector('html')
        let height = ele.clientHeight
        this.listHeight = height - 710
        console.log(height)
      },
      _back() {
        this.$router.back()
      },
      _delItem() {
        // this.$refs.confirm.show('确定要删除该单位？')
      },
      _changeItem() {
        // this.$refs.modalBox.show('1221', '新增计量单位', '长度不能超过5位')
      },
      _confirmInput(text) {
        console.log(text)
      },
      _showModal() {
        this.isShow = true
        this.showActive = true
      },
      _hideModal() {
        setTimeout(() => {
          this.isShow = false
        }, 100)
        this.showActive = false
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .edit-rush
    position: relative
    flex: 1

  .rush-time
    margin-bottom: 27px

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
      min-width: 64px
    .start
      display: inline-block
      margin-right: -2px
      color: #F52424
    .edit-input-box
      margin: 0 14px 0 40px
      .edit-input
        font-size: $font-size-14
        padding: 0 14px
        border-radius: 4px
        width: 240px
        height: 44px
        display: flex
        align-items: center
        justify-content: space-between
        border: 1px solid $color-line
        transition: all 0.3s
        &:hover
          border-color: #ACACAC
        .edit-time
          color: $color-text-assist
          font-family: $font-family-regular
          font-size: $font-size-12
        .time-icon
          icon-image('icon-date_icon')
          width: 12px
          height: @width
    .edit-input-right
      margin-left: 14px
    .tip
      line-height: 40px
      font-size: $font-size-12
      font-family: $font-family-regular
      color: $color-text-main

  .edit-activity
    box-sizing: border-box
    padding-left: 20px

  .edit-arrive
    .edit-input-box
      margin: 0 14px 0 32px

  .activity-box
    margin-top: 24px
    .classify
      display: flex
      height: 42px
      .classify-item
        box-sizing: border-box
        margin-right: 4px
        font-size: $font-size-14
        width: 97px
        height: 42px
        text-align: center
        line-height: 42px
        color: #222
        font-family: $fontFamilyRegular
        background: #F8F8F8
        border-top-right-radius: 6px
        border-top-left-radius: 6px
        border: 1px solid $color-line
        border-bottom: none
        position: relative
        z-index: 1px
        transition: all 0.3s
      .classify-item-active
        height: 43px
        font-family: $fontFamilyMeddle
        color: $color-4985FC
        background: $color-white

    .activity-list
      border: 1px solid $color-line
      box-sizing: border-box
      .big-box
        position: relative
        box-sizing: border-box
        overflow-y: auto
        &::-webkit-scrollbar
          width: 6px
          height: 10px
        &::-webkit-scrollbar-thumb
          background-color: rgba(0, 0, 0, .15)
          border-radius: 10px
        &::-webkit-scrollbar-thumb:hover
          background-color: rgba(0, 0, 0, .3)
        &::-webkit-scrollbar-track
          box-shadow: inset 0 0 6px rgba(0, 0, 0, .15)
          border-radius: 10px
      .com-list-box
        .com-list-item
          &:nth-child(2)
            flex: 2

  .history-record
    box-sizing: border-box
    padding: 0 20px
    padding-bottom: 80px

  .activity-tab
    height: 58px
    display: flex
    align-items: center
    padding-left: 21px
    box-sizing: border-box

  .commodities-list-header
    height: 50px
    background: $color-list-header
    .com-list-item
      font-size: $font-size-16

  .com-list-content
    height: 58.5px
    .com-list-item
      font-size: $font-size-14

  .com-list-box
    padding-left: 30px
    box-sizing: border-box
    display: flex
    align-items: center
    border-bottom: 1px solid $color-line
    .com-list-item
      flex: 1
      padding-right: 10px
      box-sizing: border-box
      no-wrap()
      color: $color-text-main
      font-family: $font-family-regular
      &:last-child
        flex: 0.5
      .com-edit
        height: 34px
        width: 93px
        border-radius: 4px
        box-sizing: border-box
        border: 1px solid $color-line
        padding-left: 10px
      .com-edit-small
        width: 60px

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

  //  弹窗
  .shade-box
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
    border-radius: 3px
    background: $color-white
    height: 675px
    max-width: 1000
    width: 1000px
    position: relative
    overflow-x: hidden
    overflow-y: auto
    flex-wrap: wrap
    .shade-header
      display: flex
      align-items: center
      justify-content: space-between
      height: 60.5px
      box-sizing: border-box
      padding: 0 20px
      border-bottom: 1px solid $color-line
      .shade-title
        color: $color-text-main
        font-family: $font-family-medium
        font-size: $font-size-16
      .close
        icon-image('icon-close')
        width: 16px
        height: @width
        transition: all 0.3s
        &:hover
          transform: scale(1.3)
    .auxiliary-box
      padding: 0 20px
      box-sizing: border-box
      margin-top: 32px
      layout(row)
      flex-wrap: wrap
      .auxiliary-item
        min-width: 80px
        height: 32px
        border-1px(#333, 4px)
        text-align: center
        position: relative
        margin-right: 10px
        margin-bottom: 20px
        .text
          font-size: $font-size-14
          color: $color-text-main
          line-height: 32px
          font-family: $font-family-regular
        .auxiliary-model
          opacity: 0
          position: absolute
          width: 100%
          height: 100%
          border-radius: 4px
          background: rgba(51, 51, 51, 0.9)
          left: 0
          top: 0
          padding: 0 11px
          box-sizing: border-box
          layout(row)
          align-items: center
          justify-content: space-between
          transition: all 0.4s
          .img-box
            width: 22px
            height: 22px
            border-radius: 50%
            background: #fff
            cursor: pointer
            background-size: 22px
            bg-image('icon-quit_round')
          .del
            bg-image('icon-delete_round')
          &:hover
            opacity: 1
      .auxiliary-add
        font-size: $font-size-14
        padding: 9px 12px
        margin-bottom: 20px
        min-width: 80px
        text-align: center
    .back
      justify-content: flex-end
      left: 0
      right: 0
      bottom: 0
    .default-modal-small
      position: fixed
      background: rgba(0, 0, 0, 0.50)
      top: 0
      bottom: 0
      right: 0
      left: $menu-width
      z-index: 1500
      layout()
      justify-content: center
      align-items: center
      .model-active
        animation: layerFadeIn .3s
      .model-un-active
        animation: hideFadeIn .4s

  @keyframes layerFadeIn {
    0% {
      opacity: 0
      transform: scale(.5)
    }
    100% {
      opacity: 1
      transform: scale(1)
    }
  }

  @keyframes hideFadeIn {
    0% {
      opacity: 1
      transform: scale(1)
    }
    100% {
      transform: scale(.5)
      opacity: 0
    }
  }

</style>
