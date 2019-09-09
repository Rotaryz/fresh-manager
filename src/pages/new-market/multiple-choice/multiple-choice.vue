<template>
  <!--多选兑换券弹窗-->
  <default-modal ref="modal">
    <div slot="content" class="shade-box">
      <div class="title-box">
        <div class="title">
          {{choiceTitle}}
        </div>
        <span class="close hand" @click="hide"></span>
      </div>
      <!--搜索-->
      <div class="shade-tab">
        <div class="tab-item">
          <base-search ref="baseSearch" :placeHolder="searchPlaceHolder" @search="search"></base-search>
        </div>
      </div>
      <!--列表-->
      <div class="group-content">
        <div class="title">
          <span v-for="(item, index) in tabTitle" :key="index" class="title-item" :style="{flex: item.flex}">{{item.name}}</span>
        </div>
        <div class="outreach-group-list">
          <div v-for="(item, index) in dataArray" :key="item.id" class="group-item hand" @click="selectItem(item, index)">
            <div v-for="(val, ind) in tabTitle" :key="val.name" class="title-item" :style="{flex: val.flex}">
              <span v-if="ind === 0" :class="['check', unChooseStyle(item), chooseStyle(item)]"></span>
              <span v-else-if="val.value.push" class="title-item">
                <span v-for="(child, cIdx) in val.value" :key="cIdx" class="item-dark">{{item[child]}}</span>
              </span>
              <span v-else class="title-item">{{item[val.value]}}</span>
            </div>
          </div>
        </div>
      </div>
      <!--翻页器-->
      <div class="page-box">
        <base-pagination ref="pagination" :pageDetail="pageDetail" @addPage="addPage"></base-pagination>
      </div>
      <div class="back">
        <div class="back-cancel back-btn hand" @click="cancel">取消</div>
        <div class="back-btn back-submit hand" @click="confirm">确定</div>
      </div>
    </div>
  </default-modal>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'

  const COMPONENT_NAME = 'MULTIPLE_CHOICE'

  export default {
    name: COMPONENT_NAME,
    components: {
      DefaultModal
    },
    data() {
      return {
        choiceTitle: '',
        searchPlaceHolder: '',
        tabTitle: [],
        dataArray: [],
        originArray: [],
        selectedArray: [],
        pageDetail: {
          total: 1,
          per_page: 10,
          total_page: 1
        }
      }
    },
    methods: {
      unChooseStyle(item) {
        return this.originArray.findIndex((val) => val.id === item.id) > -1 ? 'right' : ''
      },
      chooseStyle(item) {
        return this.selectedArray.findIndex((val) => val.id === item.id) > -1 ? 'checked' : ''
      },
      show(args) {
        /**
         * 1. 后台数据
         * 2. 已勾选的
         * 3. 勾选的
         */
        this.updateData(args)
        this.$refs.modal && this.$refs.modal.showModal()
      },
      hide() {
        this.$refs.modal && this.$refs.modal.hideModal()
        this.$emit('hide')
        setTimeout(() => {
          this.resetData()
        }, 300)
      },
      resetData() {
        Object.assign(this.$data, this.$options.data())
        this.$refs.pagination && this.$refs.pagination.beginPage()
        this.$refs.baseSearch && this.$refs.baseSearch._setText()
      },
      search(key) {
        this.$refs.pagination && this.$refs.pagination.beginPage()
        this.$emit('search', key)
      },
      cancel() {
        this.$emit('cancel')
        this.hide()
      },
      confirm() {
        this.$emit('confirm', this.selectedArray)
        this.hide()
      },
      addPage(page) {
        this.$emit('addPage', page)
      },
      updateData(data) {
        Object.assign(this, data)
      },
      selectItem(item, index) {
        if (this.unChooseStyle(item) === 'right') return
        let i = this.selectedArray.findIndex((val) => val.id === item.id)
        if (i < 0) {
          this.selectedArray.push(item)
        } else {
          this.selectedArray.splice(i, 1)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  /*选择商品样式*/
  .shade-tab
    height: 48px
    box-sizing: border-box
    display: flex
    .tab-item
      margin-right: 10px

  .shade-box
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
    border-radius: 2px
    background: $color-white
    height: 675px
    max-width: 1000px
    width: 1000px
    position: relative
    overflow-x: hidden
    overflow-y: auto
    flex-wrap: wrap
    padding: 0 20px
    box-sizing: border-box
    .title-box
      display: flex
      box-sizing: border-box
      padding: 23px 0
      align-items: center
      justify-content: space-between
      .title
        font-size: $font-size-16
        font-family: $font-family-medium
        line-height: 1
        color: $color-text-main
      .close
        width: 12px
        height: @width
        icon-image('icon-close')
    .back
      border-top-1px($color-line)
      position: absolute
      left: 0
      right: 0
      bottom: 0
      background: $color-white
      justify-content: flex-end

    /*小弹窗盒子*/
    .default-modal-small
      position: absolute
      width: 100%
      height: 100%
      background: rgba(0, 0, 0, 0.50)
      top: 0
      bottom: 0
      right: 0
      z-index: 10
      layout()
      justify-content: center
      align-items: center
      .model-active
        animation: layerFadeIn .3s
      .model-un-active
        animation: hideFadeIn .4s

    /*分类弹窗*/
    .default-input
      box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
      background: #fff
      border-radius: 2px
      .title-input
        height: 60px
        layout(row)
        align-items: center
        justify-content: space-between
        border-bottom: 0.5px solid $color-line
        padding-left: 20px
        .title
          color: $color-text-main
          font-size: $font-size-16
          font-family: $font-family-medium
        .close-box
          padding: 17px
          .close
            width: 16px
            height: 16px
            border-radius: 50%
            background-size: 22px
            icon-image('icon-close')
            transition: all 0.3s
            &:hover
              transform: scale(1.3)

      .main-input
        padding: 42px 20px 30px 20px
        .main-input-box
          width: 310px
          height: 40px
          border-radius: 2px
          font-family: $font-family-regular
          color: $color-text-main
          font-size: $font-size-14
          padding-left: 14px
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

    .btn-group
      text-align: center
      display: flex
      justify-content: flex-end
      user-select: none
      .btn
        width: 96px
        height: 40px
        line-height: 40px
        border-radius: 2px
        cursor: pointer
        transition: all 0.3s
      .cancel
        border: 1px solid $color-line
        &:hover
          color: $color-text-sub
          border-color: $color-text-sub
      .confirm
        border: 1px solid $color-main
        background: $color-main
        color: $color-white
        margin-left: 20px
        &:hover
          background: #44AB67
        &:active
          opacity: 0.8
      .one-btn
        margin-left: 0

    .main-model-box
      layout(row)
      align-items: center
      margin-bottom: 24px
      .text
        color: #666
        font-size: $font-size-14
        font-family: $font-family-regular
        width: 60px
        margin-right: 36px

  .group-content
    border-radius: 2px
    height: 407px
    .title
      display: flex
      height: 45px
      line-height: 45px
      font-family: $font-family-regular
      background: #F5F7FA
      border: 0.5px solid #E9ECEE
      align-items: center
      padding: 0 20px
      .title-item
        display: -webkit-box
        overflow: hidden
        -webkit-line-clamp: 2
        -webkit-box-orient: vertical
        padding-right: 20px
    .outreach-group-list
      font-size: $font-size-14
      color: #333
      font-family: $font-family-regular
      .group-item
        height: 60px
        line-height: 18px
        display: flex
        align-items: center
        border-bottom: 0.5px solid #E9ECEE
        border-right: 0.5px solid #E9ECEE
        border-left: 0.5px solid #E9ECEE
        padding: 0 20px
        &:first-child
          border-top: none
        &:nth-child(2n)
          background: #F5F7FA
        .radio
          width: 16px
          height: 16px
          border: 1px solid #E1E1E1
          border-radius: 50%
          transition: all 0.3s
          display: flex
          justify-content: center
          align-items: center
        .checked
          border: 5px solid $color-main
        .check
          width: 16px
          height: 16px
          border: 1px solid #E1E1E1
          transition: all 0.3s
          display: flex
          justify-content: center
          align-items: center
          &:before
            content: ""
            width: 14px
            height: 14px
            icon-image(icon-check)
            display: block
            opacity: 0
            transition: all 0.3s
        .checked
          border-color: #4DBD65
          &:before
            opacity: 1
        .right
          border-color: #E1E1E1
          &:before
            opacity: 1
            icon-image(icon-check_ash)
        .title-item
          padding-right: 20px
          display: block
          overflow: hidden
          span
            display: -webkit-box
            overflow: hidden
            -webkit-line-clamp: 2
            -webkit-box-orient: vertical
</style>
