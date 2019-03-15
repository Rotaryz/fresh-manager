<template>
  <div class="edit-supplier detail-content">
    <div class="identification">
      <div class="identification-page">
        <img src="./icon-buyer_new@2x.png" class="identification-icon">
        <p class="identification-name">{{id ? '编辑供应商' : '新建供应商'}}</p>
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
          供应商名称
        </div>
        <div class="edit-input-box">
          <input v-model="supplierName" type="text" class="edit-input" placeholder="请输入供应商名称" maxlength="20">
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          手机号
        </div>
        <div class="edit-input-box">
          <input v-model="mobile" type="number" class="edit-input" placeholder="请输入手机号码" maxlength="11">
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          地址
        </div>
        <div class="edit-input-box">
          <textarea v-model="address" class="edit-text" maxlength="50" placeholder="请输入供应商地址"></textarea>
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          所属采购员
        </div>
        <div class="edit-input-box">
          <base-drop-down :width="400" :height="44" :select="buyerSelect" @setValue="changeBuyer"></base-drop-down>
          <!--<textarea class="edit-text" maxlength="50"></textarea>-->
        </div>
      </div>
    </div>
    <div class="back">
      <div class="back-cancel back-btn hand" @click="back">返回</div>
      <div class="back-btn back-submit" @click="submit">保存</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import {supplierComputed} from '@state/helpers'

  const PAGE_NAME = 'EDIT_SUPPLIER'
  const TITLE = '新建供应商'
  const SELECT = {
    check: false,
    show: false,
    content: '请选择',
    type: 'default',
    data: []
  }
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        id: this.$route.query.id,
        supplierName: '',
        mobile: '',
        address: '',
        purchaseUserId: '',
        buyerSelect: SELECT
      }
    },
    computed: {
      ...supplierComputed
    },
    created() {
      this.supplierName = this.id && (this.detail.supplier_name || '')
      this.mobile = this.id && (this.detail.mobile || '')
      this.address = this.id && (this.detail.address || '')
      this.purchaseUserId = this.id && (this.detail.purchase_user_id || '')
      this._setBuyerSelect()
    },
    methods: {
      _setBuyerSelect() {
        API.Supply.getAllBuyer().then((res) => {
          if (res.error !== this.$ERR_OK) {
            return
          }
          let selectData = res.data.map((item) => {
            item.name = item.true_name
            return item
          })
          selectData.unshift({name: '请选择', id: ''})
          this.buyerSelect.data = selectData
          if (this.id) {
            this.buyerSelect.content = this.detail.purchase_user_name
          } else {
            this.buyerSelect.content = '请选择'
          }
        })
      },
      changeBuyer(select) {
        this.purchaseUserId = select.id
      },
      back() {
        this.$router.back()
      },
      submit() {
        let data = {
          supplier_name: this.supplierName,
          mobile: this.mobile,
          address: this.address,
          purchase_user_id: this.purchaseUserId
        }
        if (this.id) {
          API.Supply.editSupplier(this.id, data).then((res) => {
            this.$loading.hide()
            this.$toast.show(res.message)
            if (res.error !== this.$ERR_OK) {
              return
            }
            this.back()
          })
        } else {
          API.Supply.addSupplier(data).then((res) => {
            this.$loading.hide()
            this.$toast.show(res.message)
            if (res.error !== this.$ERR_OK) {
              return
            }
            this.back()
          })
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/detail"

  .edit-leader
    padding-bottom: 80px
    position: relative
    flex: 1

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
        border-radius: 1px
        width: 400px
        height: 84px
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

  .edit-change
    line-height: 40px
</style>
