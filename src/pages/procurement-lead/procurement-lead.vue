<template>
  <div class="procurement-task table">
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-purchase_list@2x.png" class="identification-icon">
          <p class="identification-name">采购任务导入</p>
        </div>
        <div class="function-btn">
          <div class="btn-main" @click="exportModel">
            模板导出
          </div>
          <div class="btn-main g-btn-item">
            导入采购任务单
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
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div v-if="blankList.length !== 0" class="list">
          <div v-for="(item, index) in blankList" :key="index" class="list-content list-box">
            <div class="list-item">{{item.num}}</div>
            <div class="list-item" :class="{'red': +item.error_type === 1}">{{+item.error_type === 1 ? item.error_msg : item.goods_sku_encoding}}</div>
            <div class="list-item">{{item.goods_name}}</div>
            <div class="list-item" :class="{'red': +item.error_type === 2}">{{+item.error_type === 2 ? item.error_msg : item.plan_num}}</div>
            <div class="list-item">{{item.purchase_unit}}</div>
            <div class="list-item" :class="{'red': +item.error_type === 3}">{{+item.error_type === 3 ? item.error_msg : item.supplier_name}}</div>
          </div>
        </div>
        <base-blank v-else></base-blank>
      </div>
      <div class="back">
        <div class="back-cancel back-btn hand" @click="_back">返回</div>
        <div class="back-btn back-submit hand" :class="{'btn-disable': hasError}" @click="submitSure">确认提交</div>
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
  const COMMODITIES_LIST = ['序号', '商品编码', '商品名称', '采购数量', '采购单位', '供应商']
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
        isSubmit: true,
        hasError: false
      }
    },
    created() {},
    methods: {
      submitSure() {
        if (!this.blankList.length) {
          this.$toast.show('导入采购任务单不能为空')
          return
        }
        if (this.hasError) return
        this.$refs.confirm.show('是否批量导入采购任务单？')
      },
      async confirm() {
        if (!this.isSubmit) {
          return
        }
        this.isSubmit = false
        let res = await API.Supply.createLeadTask({data: this.blankList})
        this.$toast.show(res.message, 600)
        if (res.error !== this.$ERR_OK) {
          this.isSubmit = true
          this.$toast.show(res.message)
          return
        }
        setTimeout(() => {
          this.$router.back()
        }, 800)
      },
      _back() {
        this.$router.back()
      },
      //  导入商品新建模板
      async importStock(e, index) {
        this.hasError = false
        let param = this._infoFile(e.target.files[0])
        this.$loading.show('上传中...')
        let res = await API.Supply.leadTask(param, true, 60000)
        this.$loading.hide()
        e.target.value = ''
        if (res.error !== this.$ERR_OK) {
          this.$toast.show(res.message)
          return
        }
        this.blankList = res.data
        let result = res.data.every(item => {
          return +item.error_type === 0
        })
        if (!result) {
          this.hasError = true
        }
      },
      exportModel() {
        let token = this.$storage.get('auth.currentUser', '')
        let data = {
          current_corp: this.getCurrentId(),
          // current_shop: process.env.VUE_APP_CURRENT_SHOP,
          access_token: token.access_token,
        }
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        let Url = process.env.VUE_APP_SCM_API + '/scm/api/backend/purchase/purchase-task-export-temp?' + search.join('&')
        window.open(Url)
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
        &:nth-child(2)
          flex: 1.2
      .red
        color: #F84E3C

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
