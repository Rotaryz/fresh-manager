<template>
  <div class="store-manage table">
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-storehouse@2x.png" class="identification-icon">
          <p class="identification-name">入库列表</p>
        </div>
        <div class="function-btn">
          <div class="btn-main" @click="creatNewList">新建入库单<span class="add-icon"></span></div>
          <!--<div class="btn-main btn-disable-store">新建入库单<span class="add-icon add-icon-disable"></span></div>-->
        </div>
      </div>
      <div class="store-box">
        <div class="store-flex">
          <div class="store-title">
            <div class="store-title-name">水产区</div>
            <div class="store-title-right">
              <div class="store-right-icon icon-edit cur"></div>
              <div class="store-right-icon icon-plus_young cur"></div>
              <div class="store-right-icon icon-trash cur"></div>
            </div>
          </div>
          <div class="store-son-box store-son-box-active">
            <div class="son-box-name">二分区</div>
            <div class="son-title-right">
              <div class="son-right-icon icon-edit cur"></div>
              <div class="son-right-icon icon-trash cur"></div>
            </div>
          </div>
          <div class="store-son-box">
            <div class="son-box-name">二分区</div>
            <div class="son-title-right">
              <div class="son-right-icon icon-edit cur"></div>
              <div class="son-right-icon icon-trash cur"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <default-input ref="modalBox" @confirm="confirmInput"></default-input>
    <default-confirm ref="confirm" @confirm="delConfirm"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import DefaultInput from '@components/default-input/default-input'
  const PAGE_NAME = 'STORE_MANAGE'
  const TITLE = '库位管理'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultConfirm,
      DefaultInput
    },
    data() {
      return {

      }
    },
    methods: {
      creatNewList() {
        this.$refs.modalBox.show('', '新建货位层级', '长度不能超过6位')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .store-box
    width: 100%
    position: relative
    layout(row)
    .store-flex
      min-width: 25%
      max-width: 25%
      height: 40px
      padding-right: 30px
      .store-title
        width: 100%
        height:60px
        padding: 0 20px 0 30px
        layout(row)
        align-items: center
        justify-content: space-between
        background: #F5F7FA
        border: 1px solid #E6E7EB
        border-bottom: 0
        .store-title-name
          font-size: $font-size-14
          color: $color-text-main
          font-family: $font-family-regular
      .store-title-right
        layout(row)
        align-items: center
        .store-right-icon
          width: 14px
          height: 14px
          display: block
          margin-left: 20px
      .store-son-box
        width: 100%
        height: 60px
        padding: 0 20px 0 30px
        layout(row)
        align-items: center
        justify-content: space-between
        background: #fff
        border: 1px solid #E9ECEE
        border-top: 0
        .son-box-name
          font-size: $font-size-14
          color: $color-text-main
          font-family: $font-family-regular
        .son-title-right
          layout(row)
          align-items: center
          .son-right-icon
            width: 14px
            height: 14px
            display: block
            margin-left: 20px
      .store-son-box:hover
        background: #f5f5f5
      .store-son-box-active
        background: #4DBD65
        .icon-edit
          icon-image('icon-edit_white')
        .icon-trash
          icon-image('icon-trash_white')
        .son-box-name
          color: #fff
      .store-son-box-active:hover
        background: #149100
  .icon-edit
    icon-image('icon-edit')
  .icon-plus_young
    icon-image('icon-plus_young')
  .icon-trash
    icon-image('icon-trash')
  .store-manage
    width: 100%
  .cur
    cursor: pointer
</style>
