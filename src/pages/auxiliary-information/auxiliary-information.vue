<template>
  <div class="auxiliary-information">
    <div class="content-header">
      <div class="content-title">计量单位</div>
    </div>
    <div class="auxiliary-box">
      <div v-for="(item, index) in unitsList" :key="index" class="auxiliary-item">
        <div class="text">{{item.name}}</div>
        <div class="auxiliary-model">
          <div class="img-box" @click="changeItem(item)"></div>
          <div class="img-box del" @click="delItem(item, index)"></div>
        </div>
      </div>
      <div class="btn-main auxiliary-add" @click="changeItem">新增+</div>
    </div>
    <default-confirm ref="confirm" @confirm="delConfirm"></default-confirm>
    <default-input ref="modalBox" @confirm="confirmInput"></default-input>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import DefaultInput from '@components/default-input/default-input'
  const PAGE_NAME = 'AUXILIARY_INFORMATION'
  const TITLE = '辅助资料'

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
        unitsList: [],
        newUnits: '',
        unitsType: 0,
        curItem: null,
        delIndex: null
      }
    },
    created() {
      this.getUnitsList()
    },
    methods: {
      delItem(item, index) {
        this.curItem = item
        this.delIndex = index
        this.$refs.confirm.show('确定要删除该单位？')
      },
      delConfirm() {
        API.Product.delUnits(this.curItem.id).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.$toast.show('删除成功')
            this.unitsList.splice(this.delIndex, 1)
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      changeItem(item) {
        if (item.id) {
          console.log(item)
          this.curItem = item
          this.$refs.modalBox.show(item.name, '修改计量单位', '长度不能超过5位')
          this.unitsType = 1
        } else {
          this.$refs.modalBox.show(this.newUnits, '新增计量单位', '长度不能超过5位')
          this.unitsType = 0
        }
      },
      confirmInput(text) {
        if (text.length === 0 || text.length > 5) {
          if (this.unitsType === 0) {
            this.newUnits = text
          }
          this.$toast.show('计量单位的长度不能超过5个')
          return
        }
        if (this.unitsType === 0) {
          API.Product.createUnits({name: text}).then((res) => {
            if (res.error === this.$ERR_OK) {
              this.$toast.show('新增成功')
              this.newUnits = ''
              this.getUnitsList({}, false)
            } else {
              this.$toast.show(res.message)
            }
            this.$loading.hide()
          })
        } else {
          API.Product.editUnits(this.curItem.id, {name: text}, false).then((res) => {
            if (res.error === this.$ERR_OK) {
              this.$toast.show('修改成功')
              this.getUnitsList({}, false)
            } else {
              this.$toast.show(res.message)
            }
          })
        }
      },
      getUnitsList(data, loading) {
        API.Product.getUnitsList(data, loading).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.unitsList = res.data
            console.log(this.unitsList)
          } else {
            this.$toast.show(res.message)
          }
          this.$loading.hide()
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .all-title
    padding: 29px 0 16px
    border-bottom: 1px solid #e1e1e1
    position: relative
    .name
      font-size: $font-size-16
      line-height: 1
      color: $color-text-main
      font-family: $font-family-medium
    .line
      position: absolute
      width: 34px
      height: 2px
      background: $color-main
      bottom: -1px
      left: 0
  .auxiliary-box
    margin-top: 32px
    layout(row)
    .auxiliary-item
      min-width: 80px
      height: 32px
      border-1px(#333, 4px)
      text-align: center
      position: relative
      margin-right: 10px
      margin-bottom: 20px
      .text
        font-size: $font-size-14
        color: $color-text-main
        line-height: 32px
        font-family: $font-family-regular
      .auxiliary-model
        opacity: 0
        position: absolute
        width: 100%
        height: 100%
        border-radius: 4px
        background: rgba(51,51,51,0.9)
        left: 0
        top: 0
        padding: 0 11px
        box-sizing: border-box
        layout(row)
        align-items: center
        justify-content: space-between
        .img-box
          width: 22px
          height: 22px
          border-radius: 50%
          background: #fff
          cursor: pointer
          background-size: 22px
          bg-image('icon-quit_round')
        .del
          bg-image('icon-delete_round')
        &:hover
          opacity: 1
    .auxiliary-add
      min-width: 80px
      margin-bottom: 20px
      text-align: center
      padding: 10px 16px
  .auxiliary-information
    width: 100%
  .content-header
    border-bottom: 1px solid $color-line
    display: flex
    align-items: center
    justify-content: space-between
    height: 62px
    position: relative
    box-sizing: border-box
    &:after
      content: ''
      position: absolute
      width: 34px
      height: 2px
      background: $color-main
      border-radius: 1px
      bottom: -1px
      left: 0
    .content-title
      color: $color-text-main
      font-family: $font-family-medium
      font-size: $font-size-16

</style>
