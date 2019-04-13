<template>
  <default-modal ref="memberModal">
    <div slot="content" class="shade-box">
      <div class="title-box">
        <div class="title">
          添加成员
        </div>
        <span class="close hand" @click="_cancelGoods"></span>
      </div>
      <div class="shade-tab">
        <div class="tab-item">
          <base-drop-down :width="218" :select="assortment" @setValue="_secondAssortment"></base-drop-down>
        </div>
        <div class="tab-item">
          <base-drop-down :width="140" :select="secondAssortment" @setValue="_choessSecondAssortment"></base-drop-down>
        </div>
        <div class="tab-item">
          <base-search ref="goodsSearch" placeHolder="请输入商品名称" @search="_searchGoods"></base-search>
        </div>
      </div>
      <div class="goods-content">
        <div class="outreach-goods-list">
          <div v-for="(item, index) in chooseMember" :key="index" class="goods-item">
            <span class="select-icon hand" :class="{'select-icon-disable': item.selected === 1, 'select-icon-active': item.selected === 2}" @click="_selectGoods(item,index)"></span>
            <div class="goods-img" :style="{'background-image': 'url(' +item.goods_cover_image+ ')'}"></div>
            <div class="goods-msg">
              <div class="goods-name">{{item.name}}</div>
              <div class="goods-money">¥{{item.original_price}}</div>
            </div>
            <div class="add-btn btn-main" :class="{'add-btn-disable': item.selected === 1}" @click="_additionOne(item, index)">{{item.selected === 1 ? '已添加' : '添加'}}</div>
          </div>
        </div>
      </div>
      <div class="page-box">
        <base-pagination ref="pagination" :pageDetail="memberPage" @addPage="_getMoreGoods"></base-pagination>
      </div>
      <div class="back">
        <div class="back-cancel back-btn hand" @click="_cancelMembers">取消</div>
        <div class="back-btn back-submit hand" @click="_memberAddition">批量添加</div>
      </div>
    </div>
  </default-modal>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'

  const NAME = 'MEMBER_MODAL'

  export default {
    name: NAME,
    components: {
      DefaultModal
    },
    props: {
      chooseMember: {
        type: Array,
        default: () => {
          return []
        }
      },
      memberPage: {
        type: Object,
        default: () => {
          return {
            total: 1,
            per_page: 10,
            total_page: 1
          }
        }
      },
      assortment: {
        type: Object,
        default: () => {
          return {
            check: false,
            show: false,
            content: '选择分类',
            type: 'default',
            data: [] // 格式：{title: '55'}}
          }
        }
      },
      secondAssortment: {
        type: Object,
        default: () => {
          return {
            check: false,
            show: false,
            content: '选择二级分类',
            type: 'default',
            data: [] // 格式：{title: '55'}}
          }
        }
      }
    },
    data() {
      return {

      }
    },
    methods: {
      _cancelMembers() {
        this.$emit('_cancelMembers')
      },
      _memberAddition() {
        this.$emit('_memberAddition')
      },
      memberModal() {
        this.$refs.memberModal.showModal()
      }
    }
  }
</script>

<style  scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  //  弹窗
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
      height: 70px
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

  .shade-tab
    height: 48px
    box-sizing: border-box
    display: flex
    .tab-item
      margin-right: 10px

  .page-box
    box-sizing: border-box
    height: 76px
    align-items: center
    display: flex

  .goods-content
    border-radius: 4px
    height: 420px
    .goods-list
      flex-wrap: wrap
      display: flex
    .goods-item
      box-sizing: border-box
      padding: 0 30px 0 20px
      width: 100%
      height: 60px
      display: flex
      align-items: center
      position: relative
      &:last-child
        border-bottom-1px($color-line)
      &:before
        content: ""
        pointer-events: none // 解决iphone上的点击无效Bug
        display: block
        position: absolute
        left: 0
        top: 0
        transform-origin: 0 0
        border-right: 1px solid #E9ECEE
        border-left: 1px solid #E9ECEE
        border-top: 1px solid #E9ECEE
        box-sizing border-box
        width: 200%
        height: 100%
        transform: scaleX(.5) translateZ(0)
        @media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3)
          width: 100%
          height: 300%
          transform: scaleX(1 / 3) translateZ(0)
      &:nth-child(2n - 1)
        background: #f5f7fa
      .goods-img
        margin-right: 10px
        width: 40px
        height: @width
        overflow: hidden
        background-repeat: no-repeat
        background-size: cover
        background-position: center
        background-color: $color-background
      .select-icon
        margin-right: 20px
        border-radius: 1px
        border: 1px solid #e9ecee
        height: 16px
        width: 16px
        -webkit-transition: all .3s
        transition: all .3s
      .select-icon-active
        border: 1px solid transparent
        display: inline-block
        background-size: 100% 100%
        background-image: url("./icon-check@2x.png")
      .select-icon-disable
        border: 1px solid transparent
        cursor: not-allowed
        display: inline-block
        background-size: 100% 100%
        background-image: url("./icon-check_ash@2x.png")
      .goods-msg
        flex: 1
        display: flex
        color: $color-text-main
        font-family: $font-family-regular
        justify-content: space-between
        height: 100%
        align-items: center
        .goods-name
          width: 500px
          no-wrap()
        .goods-name, .goods-money
          line-height: 1
          font-size: $font-size-14
      .add-btn
        border-radius: 2px
        margin-left: 88px
        padding: 7px 0
        min-width: 54px
        text-align: center
      .add-btn-disable
        border-radius: 2px
        margin-left: 88px
        padding: 7px 0
        box-sizing: border-box
        text-align: center
        font-size: $font-size-14
        line-height: 1
        cursor: not-allowed
        background: $color-line
        color: $color-text-assist
        border: none
    .page-box
      padding: 0 20px
      box-sizing: border-box
      height: 77px
      align-items: center
      display: flex


</style>
