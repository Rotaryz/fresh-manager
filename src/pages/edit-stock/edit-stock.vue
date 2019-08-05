<template>
  <div class="edit-stock table">
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-stock_detailed@2x.png" class="identification-icon">
          <p class="identification-name">库存明细</p>
        </div>
        <div class="function-btn">
          <div class="btn-main">
            导入库存清单
            <input
              type="file"
              class="stock-file hand"
              @change="importStock"
            >
          </div>
        </div>
      </div>
      <div class="big-list-max">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-if="blankList.length">
            <div v-for="(item, index) in blankList" :key="index" class="list-content list-box">
              <div class="list-item">{{item.id}}</div>
              <div class="list-item">
                <div>{{item.goods_name}}</div>
                <div :class="['grey-text', {'red': +item.error_type === 1}]">{{+item.error_type === 1 ? item.error_msg : item.goods_sku_encoding}}</div>
              </div>
              <div class="list-item">{{item.goods_category}}</div>
              <div class="list-item">{{item.base_unit}}</div>
              <div class="list-item" :class="{'red': +item.error_type === 3}">{{+item.error_type === 3 ? item.error_msg : item.system_stock}}</div>
              <div class="list-item" :class="{'red': +item.error_type === 2}">{{+item.error_type === 2 ? item.error_msg : item.actual_stock}}</div>
              <div class="list-item">{{item.diff_stock}}</div>
              <div class="list-item list-manager-box" :class="{'list-manager-box-active': blankIndex === index}" @click="setStatus(index, item)">
                <span class="list-manager hand">{{item.adjust_type_str}}<span v-if="item.adjust_type === 1 || item.adjust_type === 3" class="list-icon"></span></span>
                <ul v-if="item.adjust_type === 1 || item.adjust_type === 3" class="adjustment-list">
                  <li v-for="(ad,key) in adjustment" :key="key" class="adjustment-item hand" :class="{'adjustment-item-active' : item.adjust_type_str === ad.name}" @click.stop="selectType(ad)">{{ad.name}}</li>
                </ul>
              </div>
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
    <default-confirm ref="confirm" @confirm="confirm"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import API from '@api'

  const PAGE_NAME = 'EDIT_STOCK'
  const TITLE = '新建盘点'
  const COMMODITIES_LIST = ['序号', '商品', '分类', '基本单位', '库存数量', '盘点数量', '差异数量', '调整类型']
  const ADJUSTMENT = [{name: '报损', type: 1}, {name: '盘亏', type: 3}]
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
        blankList: [],
        blankIndex: -1,
        isSubmit: true
      }
    },
    methods: {
      // 下拉选择调整类型
      setStatus(index, item) {
        if (item.adjust_type !== 1 && item.adjust_type !== 3) {
          return
        }
        this.blankIndex = this.blankIndex === index ? -1 : index
      },
      selectType(ad) {
        this.blankList[this.blankIndex].adjust_type_str = ad.name
        this.blankList[this.blankIndex].adjust_type = ad.type
        this.blankIndex = -1
      },
      addition() {
        if (!this.blankList.length) {
          this.$toast.show('导入库存清单不能为空')
          return
        }
        this.$refs.confirm.show('是否批量导入库存清单？')
      },
      cancel() {
        this.$router.back()
      },
      async confirm() {
        if (!this.isSubmit) {
          return
        }
        this.isSubmit = false
        let res = await API.Store.editStockList({data: this.blankList})
        this.$toast.show(res.message, 600)
        if (res.error !== this.$ERR_OK) {
          this.isSubmit = true
          return
        }
        setTimeout(() => {
          this.$router.back()
        }, 800)
      },
      //  导入库存清单
      async importStock(e) {
        let param = this._infoFile(e.target.files[0])
        this.$loading.show('上传中...')
        let res = await API.Store.importStock(param, true, 60000)
        this.$loading.hide()
        this.blankList = res.error === this.$ERR_OK ? res.data : []
        this.$toast.show(res.message)
        e.target.value = ''
      },
      // 格式化文件
      _infoFile(file) {
        let param = new FormData() // 创建form对象
        param.append('file', file, file.name) // 通过append向form对象添加数据
        return param
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
      .grey-text
        color: #ACACAC
    .red
      color: #F53737
  .edit-stock
    .list-box
      .list-manager-box
        position: relative
        overflow: visible
      .list-manager-box-active
        .adjustment-list
          opacity: 1
          display: block
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
    z-index: 100
    background: $color-white
    display: none
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
      &:hover
        color: $color-main
      &:last-child
        border-none()
    .adjustment-item-active
      color: $color-main
  .stock-file
    position: absolute
    top: 0
    left: 0
    font-size: 0
    opacity: 0
    height: 100%
    width: 100%

</style>
