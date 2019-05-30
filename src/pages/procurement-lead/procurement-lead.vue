<template>
  <div class="procurement-task table">
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-inventory@2x.png" class="identification-icon">
          <p class="identification-name">采购任务导入</p>
        </div>
        <div class="btn-main">
          导入采购任务单
          <input
            type="file"
            class="stock-file hand"
            @change="importStock($event, 1)"
          >
        </div>
      </div>
      <div class="big-list" :class="taskList.length > 10 ? 'big-list-max' : ''">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div v-if="taskList.length !== 0" class="list">
          <div v-for="(item, index) in taskList" :key="index" class="list-content list-box">
            <!--<div class="list-item list-double-row">-->
            <!--<div class="item-dark">{{item.goods_name}}</div>-->
            <!--<div class="item-dark">{{item.goods_sku_encoding}}</div>-->
            <!--</div>-->
            <div class="list-item">ssswe</div>
          </div>
        </div>
        <base-blank v-else></base-blank>
      </div>
      <div class="back">
        <div class="back-cancel back-btn hand" @click="_back">返回</div>
        <div class="back-btn back-submit hand" @click="submitSure">确认提交</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'

  const PAGE_NAME = 'PROCUREMENT_LEAD'
  const TITLE = '采购任务导入'
  const COMMODITIES_LIST = ['序号', '商品', '分类', '供应商', '采购数量']
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        taskList: [],
        isSubmit: false
      }
    },
    created() {
    },
    methods: {
      submitSure() {},
      _back() {
        this.$router.back()
      },
      //  导入商品新建模板
      async importStock(e, index) {
        let param = this._infoFile(e.target.files[0])
        this.$loading.show('上传中...')
        let res = await API.Supply.leadTask(param, true, 60000)
        this.$loading.hide()
        console.log(res)
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
  .base-unit
    no-wrap()
    width: 32px
  .base-big-unit
    no-wrap()
    width: 60px
  .procurement-task
    .list-box
      .list-item
        padding-right: 14px
        &:nth-child(1)
          flex: 1.2
        &:nth-child(3), &:nth-child(4), &:nth-child(5)
          flex-wrap: nowrap

  .down-content
    align-items: flex-start
    padding: 5px 20px 25px
    box-sizing: border-box

  .enter-title
    font-size: $font-size-14
    font-family: $font-family-regular
    color: $color-text-main
    white-space: nowrap
    margin: 20px 80px 0 0
    .enter-title-money
      color: #F84E3C


  .list-item-layout
    layout(row)
    align-items: center
  .edit-input
    font-size: $font-size-14
    padding: 0 14px
    border-radius: 1px
    width: 100px
    height: 34px
    border: 1px solid $color-line
    margin-right: 10px
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
  .tip
    margin: 0 2px
    font-size: $font-size-14
  .procurement-task
    padding-bottom: 80px
  .btn-main
    position: relative
    z-index: 11
  .stock-file
    position: absolute
    top: 0
    left: 0
    font-size: 0
    opacity: 0
    height: 100%
    width: 100%
</style>
