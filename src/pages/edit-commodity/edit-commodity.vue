<template>
  <div class="edit-commodity detail-content">
    <div class="identification">
      <div class="identification-page">
        <img src="./icon-new_commodity@2x.png" class="identification-icon">
        <p class="identification-name">{{id ? '编辑' : '新建'}}商品券</p>
      </div>
      <div class="function-btn">
      </div>
    </div>
    <div class="content-header">
      <div class="content-title">商品信息</div>
    </div>
    <div class="add-box">
      <div class="btn-main"><span class="add-icon"></span>添加商品</div>
      <div class="add-tip">(只能选择一个商品)</div>
    </div>
    <div class="big-list">
      <div class="list-header list-box">
        <div v-for="(item, idx) in tableTitle" :key="idx" class="list-item">{{item}}</div>
      </div>
      <div class="list">
        <!--v-for="(item, index) in goodsCoupon" :key="index"-->
        <div class="list-content list-box">
          <div class="list-item">item.created_at}}</div>
          <div class="list-item">item.social_name}}</div>
          <div class="list-item">item.name}}</div>
          <div class="list-item">item.total}}</div>
          <div class="list-item">
            <div class="list-operation" @click="showDel()">删除</div>
          </div>
        </div>
      </div>
    </div>
    <div class="content-header">
      <div class="content-title">基本信息</div>
    </div>
    <div class="leader-box">
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          商品券金额
        </div>
        <div class="edit-input-box">
          <input v-model="commodity.mobile"
                 type="number"
                 class="edit-input"
                 :disabled="id"
                 placeholder="请输入正整数"
                 @mousewheel.native.prevent
          >
        </div>
        <div class="edit-unit">元兑换</div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          商品券名称
        </div>
        <div class="edit-input-box">
          <input v-model="commodity.mobile"
                 oninput="if(value.length > 11)value = value.slice(0, 11)"
                 type="number"
                 class="edit-input"
                 :disabled="id"
                 placeholder="请输入商品券名称"
                 @mousewheel.native.prevent
          >
        </div>
        <div class="edit-unit">元兑换</div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          发放数量
        </div>
        <div class="edit-input-box">
          <input v-model="commodity.mobile"
                 oninput="if(value.length > 11)value = value.slice(0, 11)"
                 type="number"
                 class="edit-input"
                 :disabled="id"
                 placeholder="发放数量应设为1~99999之间的整数"
                 @mousewheel.native.prevent
          >
        </div>
        <div class="edit-unit">元兑换</div>
      </div>

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'EDIT_COMMODITY'
  const TITLE = '新建商品券'
  const TABLE_TITLE = ['商品名称', '单位', '售价(元)', '库存', '操作']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        id: this.$route.query.id,
        tableTitle: TABLE_TITLE,
        commodity: {
          mobile: ''
        }
      }
    },
    methods: {
      showDel(index) {

      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/detail"
  .edit-commodity
    width: 100%
  .add-box
    margin: 24px 0 20px
    display: flex
    align-items: center
    .add-icon
      margin-right: 4px
      margin-left: 0
    .add-tip
      color: $color-text-assist
      font-size: $font-size-14
      margin-left: 10px
  .list-box
    .list-item
      font-size: $font-size-14
      &:last-child
        padding: 0
        max-width: 50px
      &:nth-child(1)
        flex: 3
  .big-list
    margin-bottom: 30px
  .leader-box
    padding: 0 20px
    box-sizing: border-box
    margin-bottom: 35px
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
        text-align: right
        width: 80px
      .start
        display: inline-block
        margin-right: -2px
        color: #F52424
      .edit-input-box
        margin-left: 40.9px
      .edit-input
        font-size: $font-size-14
        padding: 0 14px
        border-radius: 2px
        width: 400px
        height: 40px
        border: 0.5px solid $color-line
        transition: all 0.3s
        box-sizing: border-box
        &::-webkit-inner-spin-button
          appearance: none
        &:hover
          border: 0.5px solid #ACACAC
        &::placeholder
          font-family: $font-family-regular
          color: $color-text-assist
        &:focus
          border-color: $color-main !important
      .edit-text
        font-size: $font-size-14
        padding: 10px 14px
        border-radius: 2px
        width: 400px
        height: 70px
        border: 0.5px solid $color-line
        transition: all 0.3s
        resize: none
        outline: none
        &:hover
          border: 1px solid #ACACAC
        &::placeholder
          font-family: $font-family-regular
          color: $color-text-assist
        &:focus
          border-color: $color-main !important
      .edit-msg
        line-height: 40px
        font-size: $font-size-14
        color: #acacac
        margin-left: 10px
      .edit-unit
        line-height: 40px
        font-size: $font-size-14
        color: $color-text-main
        margin-left: 10px
</style>
