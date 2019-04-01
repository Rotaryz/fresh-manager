<template>
  <div class="default-store">
    <default-modal ref="modal">
      <div slot="content" class="default-input">
        <div class="title-input">
          <div class="title">选择库位</div>
          <div class="close-box">
            <div class="close" @click="cancel"></div>
          </div>
        </div>
        <div class="main-input">
          <div v-for="(item,index) in storeList" :key="index" class="edit-item">
            <div class="edit-title">
              <span class="start"></span>
              {{item.name}}
            </div>
            <base-drop-down :select="item.selectItem" :width="333" :height="44" @setValue="setValue($event, item, index)"></base-drop-down>
          </div>
          <div class="btn-group">
            <span class="btn cancel" @click="cancel">取消</span>
            <span class="btn confirm" @click="confirm">确定</span>
          </div>
        </div>
      </div>
    </default-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  import API from '@api'
  const COMPONENT_NAME = 'DEFAULT_STORE'

  export default {
    name: COMPONENT_NAME,
    components: {DefaultModal},
    data() {
      return {
        storeList: [],
        storeText: '',
        storeId: '',
        firstName: '',
        secondName: '',
        thrName: '',
        fourName: ''
      }
    },
    created() {
      this.getStoreList()
    },
    methods: {
      show() {
        this.$refs.modal && this.$refs.modal.showModal()
      },
      cancel() {
        this.$refs.modal && this.$refs.modal.hideModal()
      },
      setValue(value, item, index) {
        switch (index) {
        case 0:
          this.firstName = value.name
          this.storeText = this.firstName
          break
        case 1:
          this.secondName = value.name
          this.storeText = this.firstName + this.secondName
          break
        case 2:
          this.thrName = value.name
          this.storeText = this.firstName + this.secondName + this.thrName
          break
        case 3:
          this.fourName = value.name
          this.storeText = this.firstName + this.secondName + this.thrName + this.fourName
          break
        }
        this.storeId = value.id
        API.Store.findChild(value.id).then((res) => {
          if (res.error === this.$ERR_OK) {
            for (let number = index + 1; number < this.storeList.length; number++) {
              this.storeList[number].selectItem.data = []
              this.storeList[number].selectItem.content = '请选择'
            }
            if (index + 1 === this.storeList.length) return
            this.storeList[index + 1].selectItem.data = res.data
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      confirm() {
        this.$emit('confirm', this.storeId, this.storeText)
      },
      getStoreList() {
        API.Store.getStoreList(null, false).then((res) => {
          if (res.error === this.$ERR_OK) {
            let arr = []
            for (let i = 0; i < res.data.length; i++) {
              if (i === 0) {
                let obj = {}
                let selectObj = {
                  check: false,
                  show: false,
                  content: '请选择',
                  type: 'default',
                  data: [{name: '全部', value: ''}, {name: '待提交', value: 0}, {name: '已完成', value: 1}]
                }
                obj.name = res.data[i].name
                obj.id = res.data[i].id
                obj.level_id = res.data[i].level_id
                selectObj.data = res.data[i].warehouse_positions
                obj.selectItem = selectObj
                arr.push(obj)
              } else {
                let obj = {}
                let selectObj = {
                  check: false,
                  show: false,
                  content: '请选择',
                  type: 'default',
                  data: []
                }
                obj.name = res.data[i].name
                obj.id = res.data[i].id
                obj.level_id = res.data[i].level_id
                obj.selectItem = selectObj
                arr.push(obj)
              }
            }
            this.storeList = arr
          } else {
            this.$toast.show(res.message)
          }
        })
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
        font-family: $font-family-regular
      .close-box
        padding: 17px
        cursor: pointer
        .close
          width: 22px
          height: 22px
          border-radius: 50%
          background-size: 22px
          bg-image('icon-close')

  .edit-item
    display: flex
    color: #2A2A2A
    min-height: 40px
    margin-top: 20px
    .edit-title
      margin-top: 7.5px
      font-size: $font-size-14
      font-family: $font-family-regular
      white-space: nowrap
      text-align: left
      margin-right: 20px
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
      border-radius: 2px
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

  .main-input
    padding: 10px 10px 30px 40px
    min-height: 180px
    layout()
    justify-content: space-between
  .btn-group
    text-align: center
    display: flex
    justify-content: center
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
        opacity: 0.8
    .one-btn
      margin-left: 0
</style>
