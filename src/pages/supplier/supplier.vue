<template>
  <div class="supplier table">
    <div class="down-content">
      <!--搜索-->
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search :infoText="keyword" placeHolder="供应商名称" @search="changeKeyword"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-buyer@2x.png" class="identification-icon">
          <p class="identification-name">供应商列表</p>
        </div>
        <div class="function-btn">
          <router-link tag="div" to="edit-supplier" append class="btn-main g-btn-item">新建供应商<span class="add-icon"></span></router-link>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-if="list.length">
            <div v-for="(item, index) in list" :key="index" class="list-content list-box">
              <div class="list-item">{{item.created_at}}</div>
              <div class="list-item">{{item.supplier_name}}</div>
              <div class="list-item">{{item.mobile}}</div>
              <div class="list-item">{{item.province + item.city + item.area + item.address}}</div>
              <div class="list-item">{{item.purchase_user_name}}</div>
              <div class="list-item">
                <router-link tag="div" :to="`edit-supplier?id=${item.id}`" append class="list-operation">编辑</router-link>
              </div>
            </div>
          </div>
          <base-blank v-else></base-blank>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pageDetail="pageDetail" :pagination="page" @addPage="setPage"></base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {supplierComputed, supplierMethods} from '@state/helpers'

  const PAGE_NAME = 'SUPPLIER'
  const TITLE = '供应商'
  const COMMODITIES_LIST = ['创建时间', '供应商名称', '手机', '地址', '采购员', '操作']
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        commodities: COMMODITIES_LIST
      }
    },
    computed: {
      ...supplierComputed
    },
    methods: {
      ...supplierMethods,
      changeKeyword(keyword) {
        this.setKeyword(keyword)
        this.$refs.pagination.beginPage()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .supplier
    .list-box
      .list-item
        &:last-child
          max-width :50px
          padding: 0
          flex: 0.3
        &:nth-child(1)
          flex: 1.2
        &:nth-child(4)
          flex: 1.5
</style>
