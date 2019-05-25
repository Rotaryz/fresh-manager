<template>
  <default-modal ref="modal">
    <section slot="content" class="default-input">
      <article v-if="modalType !== 'addStaff'">
        <div class="title-input">
          <div class="title">{{title}}</div>
          <div class="close-box" @click="cancel">
            <div class="close hand"></div>
          </div>
        </div>
        <div class="main-input">
          <div class="main-model-box">
            <div class="text">名称</div>
            <input v-model="inputName" type="text" :maxlength="maxLength" class="main-input-box" placeholder="输入名称">
          </div>
          <div class="btn-group">
            <div class="btn cancel" @click="cancel">取消</div>
            <div class="btn confirm" @click="handleSubmit">确定</div>
          </div>
        </div>
      </article>
      <article v-if="modalType === 'addStaff'">
        <div class="title-input">
          <div class="title">{{title}}</div>
          <div class="close-box" @click="cancel">
            <div class="close hand"></div>
          </div>
        </div>
        <div class="main-input">
          <div class="main-model-box">
            <div class="text">名称</div>
            <input v-model="inputName" type="text" :maxlength="maxLength" class="main-input-box" placeholder="输入名称">
          </div>
          <div class="main-model-box">
            <div class="text">手机</div>
            <input v-model="inputMobile" type="tel" maxlength="11" class="main-input-box" placeholder="请输入手机">
          </div>
          <div class="main-model-box">
            <div class="text">移动</div>
            <div>
              <base-drop-down :width="209" :height="40" :select="departmentSelect" @setValue="setValue($event,'department')"></base-drop-down>
            </div>
            <div style="width: 20px"></div>
            <div>
              <base-drop-down :width="209" :height="40" :select="teamSelect" @setValue="setValue($event,'team')"></base-drop-down>
            </div>
          </div>
          <div class="btn-group">
            <div class="btn cancel" @click="cancel">取消</div>
            <div class="btn confirm" @click="handleSubmit">确定</div>
          </div>
        </div>
      </article>
    </section>
  </default-modal>
</template>
<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  import {outreachGroupComputed, outreachGroupMethods} from '@state/helpers'
  const COMPONENT_NAME = 'CHANGE_MODEL'

  export default {
    name: COMPONENT_NAME,
    components: {DefaultModal},
    data() {
      return {
        departmentSelect: {
          check: false,
          show: false,
          content: '选择部门',
          type: 'default',
          data: []
        },
        teamSelect: {
          check: false,
          show: false,
          content: '选择团队',
          type: 'default',
          data: []
        },
        currentTeam: {},
        nowTime: 0
      }
    },
    computed: {
      ...outreachGroupComputed,
      inputName: {
        get() {
          return this.name
        },
        set(val) {
          this.setName(val)
        }
      },
      inputMobile: {
        get() {
          return this.mobile
        },
        set(val) {
          this.setMobile(val)
        }
      }
    },
    watch: {
      isShow(val) {
        if (Date.now() - this.nowTime < 500) {
          this.nowTime = Date.now()
          return
        }
        if (val) {
          this._initDepartmentSelect()
          this.$refs.modal && this.$refs.modal.showModal()
        } else {
          this.$refs.modal && this.$refs.modal.hideModal()
        }
      }
    },
    created() {
      this.cancel()
      // todo
    },
    beforeDestroy() {
      this.cancel()
    },
    methods: {
      ...outreachGroupMethods,
      async handleSubmit() {
        try {
          await this[this.useType]({currentTeam: this.currentTeam})
          this.submit()
        } catch (e) {
        } finally {
        }
      },
      _initDepartmentSelect() {
        if (this.groupList) {
          this.departmentSelect.content = this.parentObj.name || '选择部门'
          this.teamSelect.content = this.current.name || '选择团队'
          this.teamSelect.data = []
          this.currentTeam = this.current || {}
          this.departmentSelect.data = (this.groupList[0] && this.groupList[0].list) || []
        }
      },
      setValue(item, type) {
        if (type === 'department') {
          this.teamSelect.content = '选择团队'
          this.teamSelect.data = item.list || []
        }
        if (type === 'team') {
          this.currentTeam = item
        }
      }
    }
  }
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .default-input
    background: #fff
    width: 534px
    border-radius: 2px
    padding: 0 20px 60px
    .title-input
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
    .main-input
      padding: 10px 0 0px
      .main-input-box
        width: 438px
        height: 40px
        border: 1px solid $color-line
        border-radius: 1px
        font-family: $font-family-regular
        color: $color-text-main
        font-size: $font-size-14
        padding-left: 14px
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
    margin-top: 40px
    text-align: center
    display: flex
    justify-content: flex-end
    user-select :none
    .btn
      width: 96px
      height: 40px
      line-height: 40px
      border-radius: 2px
      border: 1px solid $color-text-D9
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
        opacity: 0.8
    .one-btn
      margin-left :0
  .main-model-box
    layout(row,block,nowrap)
    align-items: center
    margin-bottom: 20px
    .text
      color: #666
      font-size: $font-size-14
      font-family: $font-family-regular
      width: 56px
      &:before
        content: "*"
        color: #F52424
    .no-before
      padding-left: 7px
      box-sizing: border-box
      &:before
        content: ""
</style>
