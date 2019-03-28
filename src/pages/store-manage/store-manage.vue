<template>
  <div class="store-manage table">
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-storehouse@2x.png" class="identification-icon">
          <p class="identification-name">库位管理</p>
        </div>
        <div class="function-btn">
          <div v-if="storeListData.length < 4" class="btn-main" @click="creatNewList">新建库位<span class="add-icon"></span></div>
          <div v-if="storeListData.length >= 4" class="btn-main btn-disable-store">新建库位<span class="add-icon add-icon-disable"></span></div>
        </div>
      </div>
      <div class="store-box">
        <div v-for="(item, index) in storeListData" :key="index" class="store-flex">
          <div class="store-title">
            <div class="store-title-name">{{item.name}}</div>
            <div class="store-title-right">
              <div class="store-right-icon icon-edit cur" @click="editBigFn(item, index)"></div>
              <div class="store-right-icon icon-plus_young cur" @click="addSmallFn(item, index)"></div>
              <div v-if="storeListData.length === (index + 1)" class="store-right-icon icon-trash cur" @click="delBigFn(item, index)"></div>
            </div>
          </div>
          <div v-for="(childItem, childIndex) in item.warehouse_positions" :key="childIndex" class="store-son-box" :class="childItem.checked ? 'store-son-box-active' : ''" @click="selectChild(childItem, index)">
            <div class="son-box-name">{{childItem.name}}</div>
            <div class="son-title-right">
              <div class="son-right-icon icon-edit cur" @click.stop="editSmallName(childItem, childIndex, index)"></div>
              <div class="son-right-icon icon-trash cur" @click.stop="delSmallData(childItem, childIndex, index)"></div>
            </div>
          </div>
          <div v-if="index === 0 && item.warehouse_positions.length === 0" class="store-son-box">
            请添加库位
          </div>
          <div v-if="index !== 0 && item.warehouse_positions.length === 0" class="store-son-box">
            请选择{{storeListData[index - 1].name}}
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
  import {productComputed} from '@state/helpers'
  import API from '@api'
  import _ from 'lodash'
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
        storeListData: [],
        curType: '',
        delType: 0,
        curItem: {},
        editType: 0,
        bigIndex: 0,
        smallIndex: 0,
        smallTtem: {}
      }
    },
    computed: {
      ...productComputed
    },
    created() {
      this.storeListData = _.cloneDeep(this.storeList)
      for (let i = 1; i < this.storeListData.length; i++) {
        this.storeListData[i].warehouse_positions = []
      }
    },
    methods: {
      creatNewList() {
        this.curType = 1
        this.$refs.modalBox.show('', '新建库位层级', '长度不能超过6位')
      },
      async confirmInput(text) {
        if (text.length === 0) {
          this.$toast.show('库位名称不能为空')
          return
        }
        if (text.length > 6) {
          this.$toast.show('输入长度单位不能超过6个字')
          return
        }
        switch (this.curType) {
        case 1:
          let res = await API.Store.addStoreList({name: text})
          if (res.error === this.$ERR_OK) {
            this.$toast.show('新增成功')
            let obj = {
              id: res.data.id,
              level_id: res.data.level_id,
              name: text,
              warehouse_positions: []
            }
            this.storeListData.push(obj)
            this.$refs.modalBox.hide()
          } else {
            this.$toast.show(res.message)
          }
          break
        case 2:
          let twores = await API.Store.editStore(this.curItem.level_id, {name: text})
          if (twores.error === this.$ERR_OK) {
            this.$toast.show('修改成功')
            this.storeListData[this.bigIndex].name = text
            this.$refs.modalBox.hide()
          } else {
            this.$toast.show(twores.message)
          }
          break
        case 3:
          let index = 0
          if (this.bigIndex === 0) {
            index = 0
          } else {
            index = this.curItem.id
          }
          API.Store.addSmallStore({p_id: index, level_id: (this.bigIndex +1), name: text}).then((res) => {
            if (res.error === this.$ERR_OK) {
              this.$toast.show('新增成功')
              let obj = {
                id: res.data.id,
                level_id: res.data.level_id,
                p_id: index,
                name: text
              }
              this.storeListData[this.bigIndex].warehouse_positions.push(obj)
              this.$refs.modalBox.hide()
            } else {
              this.$toast.show(res.message)
            }
          })
          break
        case 4:
          API.Store.editSmallStore(this.smallTtem.id, {name: text}).then((res) => {
            if (res.error === this.$ERR_OK) {
              this.$toast.show('更改成功')
              this.storeListData[this.bigIndex].warehouse_positions[this.smallIndex].name = text
              this.$refs.modalBox.hide()
            } else {
              this.$toast.show(res.message)
            }
          })
          break
        }
      },
      async delConfirm() {
        switch (this.delType) {
        case 1:
          let res = await API.Store.delStore(this.curItem.level_id)
          if (res.error === this.$ERR_OK) {
            this.storeListData.splice(this.bigIndex, 1)
            this.$toast.show('删除库位成功')
          } else {
            this.$toast.show(res.message)
          }
          break
        case 2:
          let twores = await API.Store.delSmallStore(this.smallTtem.id)
          if (twores.error === this.$ERR_OK) {
            this.$toast.show('删除成功')
            if (this.smallTtem.checked) {
              for (let i = this.bigIndex + 1; i < this.storeListData.length; i++) {
                this.storeListData[i].warehouse_positions = []
              }
            }
            this.storeListData[this.bigIndex].warehouse_positions.splice(this.smallIndex, 1)
            this.$forceUpdate()
          } else {
            this.$toast.show(res.message)
          }
          break
        }
      },
      async getStoreList() {
        let res = await API.Store.getStoreList(null , false)
        if (res.error === this.$ERR_OK) {
          this.storeListData = res.data
        } else {
          this.$toast.show(res.message)
        }
      },
      delBigFn(item, index) {
        this.curItem = item
        this.bigIndex = index
        this.delType = 1
        this.$refs.confirm.show('确定要删除该库位？')
      },
      editBigFn(item, index) {
        this.curItem = item
        this.curType = 2
        this.bigIndex = index
        this.$refs.modalBox.show(item.name, '编辑库位层级名称', '长度不能超过6位')
      },
      addSmallFn(item, index) {
        if (index === 0) {
          this.curItem = item
          this.curType = 3
          this.bigIndex = index
          this.$refs.modalBox.show('', `添加${item.name}`, '长度不能超过6位')
        } else {
          let isChecked = false
          this.storeListData[index - 1].warehouse_positions.forEach(item1 => {
            if (item1.checked) {
              isChecked = true
              this.curItem = item1
            }
          })
          if (isChecked) {
            this.curType = 3
            this.bigIndex = index
            this.$refs.modalBox.show('', `添加${item.name}`, '长度不能超过6位')
          } else {
            this.$toast.show('请先选择上级层级再进行添加')
          }
        }
      },
      // 查询子类
      selectChild(item, index) {
        if (item.checked) {
          return false
        }
        this.storeListData[index].warehouse_positions.forEach(item1 => {
          item1.checked = false
        })
        item.checked = true
        this.curItem = item
        API.Store.findChild(item.id).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.storeListData[index + 1].warehouse_positions = res.data
            for (let number = index + 2; number < this.storeListData.length; number++) {
              this.storeListData[number].warehouse_positions = []
            }
          } else {
            this.$toast.show(res.message)
          }
        })
        this.$forceUpdate()
      },
      // 编辑子类名称
      editSmallName(childItem, childIndex, index) {
        this.smallTtem = childItem
        this.smallIndex = childIndex
        this.bigIndex = index
        this.curType = 4
        this.$refs.modalBox.show(childItem.name, '编辑库位名称', '长度不能超过6位')
      },
      // 删除子类名称
      delSmallData(childItem, childIndex, index) {
        this.smallTtem = childItem
        this.smallIndex = childIndex
        this.bigIndex = index
        this.delType = 2
        this.$refs.confirm.show('删除当前层级后，下挂在它下面所有库位将会被删除？')
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
        border: 0.5px solid #E6E7EB
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
        border: 0.5px solid #E9ECEE
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
