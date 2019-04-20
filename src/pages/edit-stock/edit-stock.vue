<template>
  <div class="edit-stock table">
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-stock_detailed@2x.png" class="identification-icon">
          <p class="identification-name">库存明细</p>
        </div>
        <div class="function-btn">
          <div class="btn-main">导入库存清单</div>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-if="blankList.length" class="list-content list-box">
            <div class="list-item">1</div>
            <div class="list-item">666</div>
            <div class="list-item">666</div>
            <div class="list-item">666</div>
            <div class="list-item">666</div>
            <div class="list-item">666</div>
            <div class="list-item">666</div>
            <div class="list-item list-manager-box">
              <span class="list-manager hand">亏损<span class="list-icon"></span></span>
              <ul class="adjustment-list">
                <li v-for="(ad,key) in adjustment" :key="key" class="adjustment-item hand adjustment-item-active">{{ad}}</li>
              </ul>
            </div>
          </div>
          <base-blank v-else></base-blank>
        </div>
      </div>
    </div>
    <div class="back">
      <div class="back-cancel back-btn hand" @click="cancel">取消</div>
      <div class="back-btn back-submit hand" @click="addition">调整</div>
    </div>
    <default-confirm ref="confirm"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultConfirm from '@components/default-confirm/default-confirm'

  const PAGE_NAME = 'EDIT_STOCK'
  const TITLE = '新建盘点'
  const COMMODITIES_LIST = ['序号', '商品', '分类', '基本单位', '库存数量', '盘点数量', '差异数量', '调整类型']
  const ADJUSTMENT = ['报损', '盈亏']
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultConfirm
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        adjustment: ADJUSTMENT,
        blankList: []
      }
    },
    methods: {
      addition() {
        this.$refs.confirm.show('是否进行盘点库存调整？')
      },
      cancel() {
        this.$router.back()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .list-box
    .list-item
      align-items: center
      &:nth-child(1)
        flex: 0.4
      &:nth-child(2)
        flex: 1.7
      &:nth-child(3)
        flex: 1.3
      &:last-child
        padding: 0
        max-width: 80px
  .edit-stock
    .list-box
      .list-manager-box
        position: relative
        overflow: visible
        z-index: 10
      .list-manager-box-active
        .adjustment-list
          opacity: 1
        .list-icon
          transform-origin: 50% 0
          transform: rotate(180deg) translateY(-50%)
  .list-manager
    position: relative
    font-size: $font-size-14
    .list-icon
      transition: all 0.4s
      col-center()
      transform-origin: 50% 0
      transform: rotate(0) translateY(-50%)
      right: -16px
      width: 14px
      height: 14px
      icon-image('icon-pull_down')
  .adjustment-list
    border: 0 solid #E9ECEE
    border-radius: 4px
    position: absolute
    top: 24px
    left: -51px
    box-shadow: 0 0 8px 0 #EBEBEB
    opacity: 0
    transition: opacity .4s
    &:after
      position: absolute
      top: -4px
      right: 38px
      display: block
      content: ''
      width: 0
      height: 0
      z-index: 88
      box-shadow: 0 0 8px 0 #EBEBEB
      border: 3px solid $color-white
      transform: rotate(45deg)
    .adjustment-item
      position: relative
      z-index: 100
      width: 130px
      height: 50px
      line-height: 50px
      text-indent: 16px
      border-bottom-1px(#E9ECEE)
      background: $color-white
      &:last-child
        border-none()
    .adjustment-item-active
      color: $color-main

</style>
