<template>
  <div class="procurement-task table">
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-import@2x.png" class="identification-icon">
          <p class="identification-name">商品导入</p>
        </div>
        <div class="function-btn">
          <a :href="downUrl" class="btn-main btn-main-end" target="_blank">商品模板导出</a>
          <div class="btn-main g-btn-item">
            导入商品
            <input
              type="file"
              class="stock-file hand"
              @change="importStock($event, 1)"
            >
          </div>
        </div>
      </div>
      <div class="big-list" :class="blankList.length > 10 ? 'big-list-max' : ''">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item list-item-title">{{item}}</div>
        </div>
        <div v-if="blankList.length !== 0" class="list">
          <div v-for="(item, index) in blankList" :key="index" class="list-content list-box">
            <!--商品名称-->
            <div class="list-item list-double-row">
              <div class="item-dark" :class="{'red': item.error_tips.goods_material_name}">{{item.error_tips.goods_material_name || item.goods_material_name}}</div>
              <div class="item-dark" :class="{'red': item.error_tips.goods_sku_encoding}">{{item.error_tips.goods_sku_encoding || item.goods_sku_encoding}}</div>
            </div>
            <!--商品类目-->
            <div class="list-item" :class="{'red': item.error_tips.goods_material_category_name}">{{item.error_tips.goods_material_category_name || item.goods_material_category_name}}</div>
            <div class="list-item" :class="{'red': item.error_tips.base_unit}">{{item.error_tips.base_unit || item.base_unit}}</div>
            <div class="list-item" :class="{'red': item.error_tips.supplier_name}">{{item.error_tips.supplier_name || item.supplier_name}}</div>
            <!--采购规格-->
            <div v-if="item.error_tips.base_purchase_rate" class="list-item red">{{item.error_tips.base_purchase_rate}}</div>
            <div v-else class="list-item">{{item.base_purchase_rate}}{{item.base_unit}}/{{item.purchase_unit}}</div>
            <!--采购单价-->
            <div class="list-item" :class="{'red': item.error_tips.purchase_price}">{{item.error_tips.purchase_price || item.purchase_price}}</div>
            <div class="list-item" :class="{'red': item.error_tips.purchase_cycle}">{{item.error_tips.purchase_cycle || item.purchase_cycle}}</div>
            <div class="list-item" :class="{'red': item.error_tips.goods_type}">{{item.error_tips.goods_type || (+item.goods_type === 1 ? '否' : '是')}}</div>
            <!--售卖类型-->
            <div class="list-item" :class="{'red': item.error_tips.is_presale}">{{item.error_tips.is_presale || (item.is_presale ? '预售库存' : '仓库库存')}}</div>
            <div v-if="item.error_tips.base_sale_rate" class="list-item red">{{item.error_tips.base_sale_rate}}</div>
            <div v-else class="list-item">{{item.base_sale_rate}}{{item.base_unit}}/{{item.sale_unit}}</div>
            <!--售卖销售单价-->
            <div class="list-item" :class="{'red': item.error_tips.trade_price}">{{item.error_tips.trade_price || item.trade_price}}</div>
            <div class="list-item" :class="{'red': item.error_tips.goods_category_name}">{{item.error_tips.goods_category_name || item.goods_category_name}}</div>
          </div>
        </div>
        <base-blank v-else></base-blank>
      </div>
      <div class="back">
        <div class="back-cancel back-btn hand" @click="_back">返回</div>
        <div class="back-btn back-submit hand" :class="{'btn-disable': hasError}" @click="submitSure">创建</div>
      </div>
    </div>
    <default-confirm ref="confirm" @confirm="confirm"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import API from '@api'

  const PAGE_NAME = 'PROCUREMENT_LEAD'
  const TITLE = '采购任务导入'
  const COMMODITIES_LIST = ['商品名称/编码', '商品类目', '基本单位', '供应商', '采购规格', '采购单价', '采购周期', '是否集采', '售卖类型', '销售规格', '销售单价', '商品分类']
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
        blankList: [],
        downUrl: '',
        isSubmit: true,
        hasError: false
      }
    },
    created() {
      this._getUrl()
    },
    methods: {
      _getUrl() {
        let currentId = this.getCurrentId()
        let token = this.$storage.get('auth.currentUser', '')
        let params = `access_token=${token.access_token}&current_corp=${currentId}&`
        this.downUrl =
          process.env.VUE_APP_API + `/social-shopping/api/backend/goods-manage/goods-create-scm-template-excel?${params}`
      },
      // 提交
      submitSure() {
        if (this.hasError) return
        if (!this.blankList.length) {
          this.$toast.show('导入商品不能为空')
          return
        }
        this.$refs.confirm.show('是否批量导入商品？')
      },
      // 提交数据
      async confirm() {
        if (!this.isSubmit) {
          return
        }
        this.isSubmit = false
        let res = await API.Product.scmGoodsImport({data: this.blankList})
        this.$toast.show(res.message, 1500)
        if (res.error !== this.$ERR_OK) {
          this.isSubmit = true
          this.$toast.show(res.message)
          return
        }
        setTimeout(() => {
          this.$router.back()
        }, 1500)
      },
      _back() {
        this.$router.back()
      },
      //  导入商品新建模板
      async importStock(e, index) {
        this.hasError = false
        let param = this._infoFile(e.target.files[0])
        this.$loading.show('上传中...')
        let res = await API.Product.checkGoodsImport(param, true, 60000)
        this.$loading.hide()
        // this.blankList = res.error === this.$ERR_OK ? res.data : []
        e.target.value = ''
        if (res.error !== this.$ERR_OK) {
          this.$toast.show(res.message)
          return
        }
        res.data.forEach(item => {
          for (let i in item.error_tips) { // eslint-disable-line
            this.hasError = true
          }
        })
        this.blankList = res.data
        // let result = res.data.every(item => {
        //   return +item.error_type === 0
        // })
        // if (!result) {
        //   this.hasError = true
        // }
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
        text-align: left
        white-space: normal
        display: -webkit-box
        word-break: break-all
        -webkit-line-clamp: 2
        -webkit-box-orient: vertical
        padding-right: 14px
        &:nth-child(1),&:nth-child(2)
          flex: 1.6
        &:nth-child(4),&:nth-child(12)
          flex: 1.3
        &:last-child
          padding-right: 0
      .red
        color: #F84E3C
      .list-double-row
        flex-direction: column
      .list-item-title
        -webkit-box-orient: inherit
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
