<template>
  <div class="edit-warehouse detail-content">
    <div class="identification">
      <div class="identification-page">
        <img src="./icon-out_stock@2x.png" class="identification-icon">
        <p class="identification-name">{{id ? '编辑仓库人员' : '新建仓库人员'}}</p>
      </div>
      <div class="function-btn">
      </div>
    </div>
    <div class="leader-box">
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          手机号
        </div>
        <div class="edit-input-box">
          <input v-model="mobile" type="number" class="edit-input" maxlength="11" placeholder="请输入手机号">
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          密码
        </div>
        <div class="edit-input-box">
          <div v-if="!isChangePassword" class="list-operation edit-change" @click="changeType">修改密码</div>
          <input v-else v-model="password" type="password" class="edit-input" placeholder="请输入密码"
                 maxlength="20"
          >
        </div>
      </div>
    </div>
    <div class="leader-box">
      <div v-if="isChangePassword" class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          确认密码
        </div>
        <div class="edit-input-box">
          <input v-model="confirmPassword" type="password" class="edit-input" placeholder="请确认密码" maxlength="20">
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          姓名
        </div>
        <div class="edit-input-box">
          <input v-model="name" type="text" class="edit-input" placeholder="请输入姓名">
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
  const PAGE_NAME = 'EDIT_WAREHOUSE'
  const TITLE = '仓库人员'
  const TELREG = /^(13[0-9]|14[0-9]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        id: this.$route.query.id,
        isChangePassword: !this.$route.query.id,
        username: '',
        password: '',
        confirmPassword: '',
        name: '',
        mobile: '',
        isSubmit: false
      }
    },
    methods: {
      changeType() {
        this.isChangePassword = true
      },
      back() {
        this.$router.back()
      },
      checkDataValidate() {
        if (!this.mobile) {
          this.$toast.show('请输入手机号')
          return
        } else if (!TELREG.test(this.mobile)) {
          this.$toast.show('请输入正确的手机号')
          return
        } else if (this.isChangePassword && !this.password) {
          this.$toast.show('请输入密码')
          return
        } else if (this.isChangePassword && this.password.length <= 4) {
          this.$toast.show('密码必须大于4位')
          return
        } else if (this.isChangePassword && !this.confirmPassword) {
          this.$toast.show('请输入确认密码')
          return
        } else if (this.isChangePassword && this.password !== this.confirmPassword) {
          this.$toast.show('密码和确认密码不一致')
          return
        } else if (!this.name) {
          this.$toast.show('请输入姓名')
          return
        }
        return true
      },
      submit() {
        if (!this.checkDataValidate()) {
          return
        }
        console.log('保存')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/detail"

  .edit-warehouse
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
      line-height: 40px
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

</style>
