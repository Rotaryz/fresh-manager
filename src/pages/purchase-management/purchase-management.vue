<template>
  <div class="purchase-management table">
    <div class="tab-header">
      <base-search placeHolder="采购单号" @search="_search"></base-search>
      <div class="btn-main">
        <input type="file" title="导入采购单" class="file-box hand" @change="_importFile">
        导入采购单
      </div>
    </div>
    <div class="list-header list-box">
      <div v-for="(item,index) in listTitle" :key="index" class="list-item">{{item}}</div>
    </div>
    <div class="list">
      <div v-for="(item,index) in purchaseList" :key="index" class="list-content list-box">
        <div class="list-item list-double-row">
          <p class="item-dark">{{item.order_sn}}</p>
          <p class="item-sub">{{item.created_at}}</p>
        </div>
        <div class="list-item">{{item.delivery_at}}</div>
        <div class="list-item">{{item.type_count}}</div>
        <div class="list-item">{{item.type_had_count}}</div>
        <div class="list-item">{{item.total}}</div>
        <div class="list-item list-operation-box">
          <router-link tag="span" :to="'purchase-detail?id=' + item.id" append class="list-operation">详情</router-link>
          <a class="list-operation list-link" :href="item.url + item.id + excelParams" target="_blank">导出</a>
        </div>
      </div>
    </div>
    <div class="pagination-box">
      <base-pagination ref="pages" :pageDetail="pageTotal" @addPage="_getMoreList"></base-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {purchaseComputed, purchaseMethods} from '@state/helpers'
  import API from '@api'

  const PAGE_NAME = 'PURCHASE_MANAGEMENT'
  const TITLE = '采购管理'
  const LIST_TITLE = ['采购单号', '计划交货时间', '总采购项', '已采购项', '收货金额', '操作']
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        listTitle: LIST_TITLE,
        page: 1,
        orderSn: '',
        excelParams: ''
      }
    },
    computed: {
      ...purchaseComputed
    },
    created() {
      let currentId = this.getCurrentId()
      let token = this.$storage.get('auth.currentUser', '')
      this.excelParams = token
        ? `?access_token=${token.access_token}&current_corp=${currentId}`
        : ''
    },
    methods: {
      ...purchaseMethods,
      // 导入
      async _importFile(e) {
        let file = this.infoFile(e.target.files[0])
        let size = (e.target.files[0].size / 1024).toFixed(2)
        this.fileMsg = {
          name: e.target.files[0].name,
          size: size > 1024 ? size + 'MB' : size + 'KB'
        }
        API.Upload.importFile(file).then((res) => {
          this.$toast.show(res.message)
          if (res.error !== this.$ERR_OK) {
            return
          }
          this.page = 1
          this.getPurchaseList({page: this.page, orderSn: this.orderSn, loading: false})
        })
        e.target.value = ''
      },
      infoFile(file) {
        let param = new FormData() // 创建form对象
        param.append('file', file, file.name) // 通过append向form对象添加数据
        return param
      },
      _search(text) {
        this.$refs.pages.beginPage()
        this.page = 1
        this.orderSn = text
        this.getPurchaseList({page: this.page, orderSn: this.orderSn, loading: false})
      },
      _getMoreList(page) {
        this.page = page
        this.getPurchaseList({page: this.page, orderSn: this.orderSn, loading: false})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .tab-header
    height: 80px
    display: flex
    justify-content: space-between
    align-items: center
    box-sizing: border-box

  .list-box
    padding-left: 30px
    box-sizing: border-box
    border-bottom: 1px solid $color-line
    display: flex
    align-items: center
    .list-item
      box-sizing: border-box
      padding-right: 10px
      flex: 1
      &:last-child
        flex: 0.6

</style>
