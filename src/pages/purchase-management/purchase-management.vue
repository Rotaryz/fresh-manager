<template>
  <div class="purchase-management table">
    <div class="down-content">
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search :infoText="requestData.order_sn" placeHolder="采购单号" @search="_search"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-purchase_list@2x.png" class="identification-icon">
          <p class="identification-name">采购管理</p>
        </div>
        <div class="function-btn">
          <div class="btn-main">
            导入采购单
            <input type="file" title="导入采购单" class="file-box hand" @change="_importFile">
          </div>
        </div>
      </div>
      <div class="big-list">
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
      </div>
      <div class="pagination-box">
        <base-pagination ref="pages" :pagination="requestData.page" :pageDetail="pageTotal" @addPage="_getMoreList"></base-pagination>
      </div>
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
        excelParams: ''
      }
    },
    computed: {
      ...purchaseComputed
    },
    created() {
      let currentId = this.getCurrentId()
      let token = this.$storage.get('auth.currentUser', '')
      this.excelParams = token ? `?access_token=${token.access_token}&current_corp=${currentId}` : ''
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
          this.setRequestData({page: 1})
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
        this.setRequestData({page: 1, order_sn: text})
      },
      _getMoreList(page) {
        this.setRequestData({page})
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
    display: flex
    align-items: center
    .list-item
      box-sizing: border-box
      padding-right: 10px
      flex: 1
      &:nth-child(1)
        flex: 1.4
        min-width: 208px
      &:nth-child(2)
        flex: 1.2
      &:last-child
        padding: 0
        max-width: 80px
        flex: 0.6

</style>
