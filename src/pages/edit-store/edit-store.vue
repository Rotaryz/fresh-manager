<template>
  <div class="edit-store">
    <div class="identification">
      <div class="identification-page">
        <img src="./icon-out_stocknew@2x.png" class="identification-icon">
        <p class="identification-name">新建出库单</p>
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
          出库对象
        </div>
        <div class="edit-input-box">
          <input type="text" class="edit-input" maxlength="30" @mousewheel.native.prevent>
        </div>
      </div>
    </div>
    <div class="content-header mt-30">
      <div class="content-title">商品信息</div>
    </div>
    <div class="function-btn btn-box">
      <div class="btn-main" @click="deleteGoods()"><span class="add-icon"></span>添加商品</div>
    </div>
    <div class="big-list">
      <div class="list-header list-box">
        <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
      </div>
      <div class="list">
        <div class="list-content list-box">
          <div class="list-item">1</div>
          <div class="list-item">item</div>
          <div class="list-item">item</div>
          <div class="list-item">item</div>
          <div class="list-item">item</div>
          <div class="list-item">item</div>
          <div class="list-item">item</div>
          <div class="list-item list-operation-box">
            <span class="list-operation">出库</span>
          </div>
        </div>
      </div>
    </div>
    <div class="back">
      <div class="back-cancel back-btn hand">返回</div>
      <div class="back-btn back-submit hand">保存</div>
    </div>
    <!--<add-goods ref="addg"></add-goods>-->
    <select-store ref="addg"></select-store>
  </div>
</template>

<script type="text/ecmascript-6">
  // import AddGoods from '@components/add-goods/add-goods'
  import SelectStore from '@components/select-store/select-store'
  const PAGE_NAME = 'EDIT_STORE'
  const TITLE = '新建出库单'
  const COMMODITIES_LIST = [
    '序号',
    '商品名称',
    '分类',
    '出库数(销售单位)',
    '出库批次',
    '出库单价',
    '出库金额',
    '操作',
  ]

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        commodities: COMMODITIES_LIST
      }
    },
    components: {
      // AddGoods,
      SelectStore
    },
    methods:{
      _batchAddition(list) {
        console.log(list)
      },
      deleteGoods() {
        this.$refs.addg._delGoods(160)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/detail"

  .edit-store
    position: relative
    flex: 1
    background: $color-white
    padding: 0 20px 80px
    box-sizing: border-box
  .mt-30
    margin-top: 30px
  .btn-box
    padding: 24px 0
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

</style>
