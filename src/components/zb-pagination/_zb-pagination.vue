<template>
  <div class="total">
    <div class="page-title">{{pageSize}}条/页，共{{total}}条数据</div>
    <div class="page">
      <!-- 减页码-->
      <div class="page-icon" :class="{'page-icon-disable': currentPage === 1}" @click="subtract">
      </div>
      <!--中间页码-->
      <div class="pade-detail">
        <span v-if="pageTotal>=1" class="page-child hand" :class="{'page-child-active': currentPage === 1}" @click="getPage(1)">1</span>
        <span v-show="pagerCount<pageTotal && currentPage * 2 >pagerCount" class="page-hide-more"></span>
        <span v-for="(num, index) in indexArr" :key="index" class="page-child hand" :class="{'page-child-active': currentPage === num}" @click="getPage(num)">
          {{num}}
        </span>
        <span v-show="pagerCount<pageTotal && (pageTotal +1- currentPage)*2>pagerCount" class="page-hide-more"></span>
        <span v-if="pageTotal>=2" class="page-child hand" :class="{'page-child-active': currentPage ===pageTotal}" @click="getPage(pageTotal)">{{pageTotal}}</span>
      </div>
      <!-- 加页码-->
      <div class="page-icon page-icon-two" :class="{'page-icon-two-disable': currentPage === pageTotal}" @click="addPage">
      </div>
      <!-- 页码列表-->
      <div class="page-box">
        <div class="border-page page-total" :class="{'page-total-active': showMorePage}" @click.stop="showPageDetail">
          {{currentPage}}/{{pageTotal}}
          <span class="page-tap">
            <i class="page-top" :class="{'page-bottom':showMorePage}"></i>
          </span>
          <transition name="fade">
            <ul v-show="showMorePage" class="page-list">
              <li v-for="item in pageTotal"
                  :key="item"
                  class="page-item"
                  :class="{'page-item-active': currentPage === item}"
                  @click.stop="detailPage(item)"
              >
                {{item}}/{{pageTotal}}
              </li>
            </ul>
          </transition>
        </div>
      </div>
      <!-- 页码跳转-->
      <div class="input-box">
        跳至
        <div class="input-box-big">
          <input v-model.number="pageInput" type="number" class="border-page" @mousewheel.native.prevent @keydown="_runPage">
        </div>
        页
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PageDetail',
    props: {
      pagerCount: {
        // 页面显示的多的页码数
        type: Number,
        default: 9
      },
      currentPage: {
        // 当前页面 支持 .sync
        type: Number,
        default: 1
      },
      pageSize: {
        // 当前页面条数
        type: Number,
        default: 10
      },
      total: {
        // 当前页面
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        showMorePage: false,
        pageInput: '',
        isHand: {handLeft: 'pointer', handRight: 'pointer', handGo: 'pointer'},
        backClipped: true,
        preClipped: false,
        showFirst: false,
        showEnd: true
      }
    },
    computed: {
      pageTotal() {
        return Math.ceil(this.total / this.pageSize)
      },
      indexArr() {
        let ret = []
        if (this.pageTotal <= 2) return ret
        if (this.pageTotal < this.pagerCount) {
          for (let i = 2; i < this.pageTotal; i++) {
            ret.push(i)
          }
          return ret
        }
        // 长度大于 最达显示长度
        if (this.currentPage * 2 <= this.pagerCount) {
          for (let i = 2; i < this.pagerCount; i++) {
            ret.push(i)
          }
        } else if (this.currentPage > Math.ceil(this.pageTotal - this.pagerCount / 2)) {
          for (let i = this.pageTotal - this.pagerCount + 2; i < this.pageTotal; i++) {
            ret.push(i)
          }
        } else {
          let num = this.pagerCount - 2
          for (let i = this.currentPage - Math.floor(num / 2); i < this.currentPage + Math.ceil(num / 2); i++) {
            ret.push(i)
          }
        }
        return ret
      }
    },
    created() {
      window.onclick = () => {
        this.hidePageDetail()
      }
    },
    methods: {
      //   页码改变
      getPage(page) {
        this.$emit('update:currentPage', page * 1)
        this.$emit('pageChange', page * 1)
      },
      // 输入框跳转
      _runPage(e) {
        if (e.keyCode === 13) {
          if (this.pageInput !== '') {
            if (this.pageInput > this.pageTotal) {
              this.pageInput = this.pageTotal
            } else if (this.pageInput * 1 <= 0) {
              this.pageInput = 1
            }
            this.pageInput = Math.floor(this.pageInput * 1)
            this.getPage(this.pageInput)
          }
        }
      },
      // 减页码
      subtract() {
        if (this.currentPage > 1) {
          this.getPage(this.currentPage - 1)
        }
      },
      // 加页码
      addPage() {
        if (this.currentPage < this.pageTotal) {
          this.getPage(this.currentPage + 1)
        }
      },
      // 页码列表中选择
      showPageDetail() {
        this.showMorePage = !this.showMorePage
      },
      detailPage(page) {
        this.getPage(page * 1)
        setTimeout(() => {
          this.hidePageDetail()
        }, 100)
      },
      hidePageDetail() {
        this.showMorePage = false
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .total
    width: 100%
    height: 30px
    display: flex
    align-items: center
    justify-content: space-between
    color: $color-text-main
    font-size: $font-size-14

    .page-title
      font-size: $font-size-14

    .page
      display: flex
      align-items: center

      .pade-detail
        align-items: center
        display: flex
        text-align: center

        .page-child
          padding: 0 6.5px
          min-width: 26px
          height: 26px
          box-sizing: border-box
          border-radius: 2px
          border: 0.5px solid $color-line
          font-size: $font-size-12
          color: $color-text-main
          line-height: 26px
          margin-right: 8px
          position: relative
          transition: all 0.3s ease-out

          &:after
            content: ''
            border-top: 0.5px solid transparent
            border-bottom: 0.5px solid transparent
            position: absolute
            z-index: 5
            height: 100%
            width: 0
            right: 0
            top: -0.5px
            box-sizing: content-box
            transition: all 0.3s ease-out
            border-radius: 2px

          &:before
            content: ''
            border-right: 0.5px solid transparent
            border-left: 0.5px solid transparent
            position: absolute
            z-index: 5
            height: 0
            width: 100%
            bottom: 0
            left: -0.5px
            box-sizing: content-box
            transition: all 0.3s ease-out
            border-radius: 2px

        .page-child-active
          transition: all 0.3s ease-out
          color: $color-main
          border-color: $color-main

        .page-hide-more
          width: 20px
          height: 4px
          display: inline-block
          margin-right: 8px
          icon-image('icon-spot')

      .page-icon
        cursor: pointer
        icon-image('icon-before')
        margin-right: 8px
        height: 25px
        width: 25px
        transition: all 0.3s

        &:hover
          transition: all 0.3s
          icon-image('pic-paging_left2')

      .page-icon-disable
        cursor not-allowed

        &:hover
          transition: all 0.3s
          icon-image('icon-before_hover')

      .page-icon-two
        transition: all 0.3s
        icon-image('icon-later')

        &:hover
          transition: all 0.3s
          icon-image('pic-paging_right2')

      .page-icon-two-disable
        cursor: not-allowed

        &:hover
          transition: all 0.3s
          icon-image('icon-later_hover')

      .border-page
        display: flex
        line-height: 26px
        border-radius: 2px
        margin: 0 10px
        border: 0.5px solid $color-line
        font-size: $font-size-12

      div.border-page
        margin-right: 0
        padding: 0 15px
        height: 26px
        line-height: 26px
        cursor: pointer

      div.page-total
        cursor: pointer
        padding-right: 24px
        position: relative
        margin: 0
        transition: all 0.2s

        &:hover
          border-color: #ACACAC

        .page-tap
          position: absolute
          right: 0
          top: 0
          height: 26px
          display: inline-block
          width: 24px

          .page-top
            position: absolute
            left: 50%
            top: 50%
            margin-left: -4px
            margin-top: -5.5px
            width: 8px
            height: 11px
            background: url("./icon-pressed_down.png")
            background-size: 100% 100%
            transition: all 0.2s
            transform: rotate(0deg)

          .page-bottom
            transform: rotate(180deg)

        .page-list
          position: absolute
          width: 100%
          left: 0
          box-shadow: 0 1px 5px 0 rgba(12, 6, 14, 0.20)
          text-align: center
          background: #fff
          border-radius: 2px
          bottom: 30px
          font-size: $font-size-12
          color: $color-text-sub
          max-height: 290px
          overflow-y: auto
          z-index: 99

          &.fade-enter, &.fade-leave-to
            opacity: 0

          &.fade-enter-to, &.fade-leave-to
            transition: all .3s ease-in-out

          .page-item
            cursor: pointer
            height: 29px
            line-height: 29px

            &:hover
              background: #FAFAFA

          .page-item-active
            background: #FAFAFA

      .page-total-active
        border: 0.5px solid $color-main !important

      .input-box-big
        position: relative
        margin: 0 8px
        transition: all 0.4s ease-out

        input.border-page
          position: relative
          z-index: 10
          height: 26px
          width: 46px
          margin: 0
          text-align: center
          transition: all 0.4s ease-out

          &:hover
            border: 0.5px solid #ACACAC

          &:focus
            border: 0.5px solid $color-main

          &::-webkit-inner-spin-button
            appearance: none

      .input-box
        font-size: $font-size-12
        white-space: nowrap
        display: flex
        height: 29px
        align-items: center
        margin-right: 8px

      .page-box
        min-width: 64px
        height: 26px
        margin-right: 10px
</style>
