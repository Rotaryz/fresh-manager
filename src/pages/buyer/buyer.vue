<template>
  <div class="buyer table">
    <div class="down-content">
      <!--搜索-->
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search :infoText="keyword" placeHolder="采购员姓名或手机搜索" @search="changeKeyword"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-supplier@2x.png" class="identification-icon">
          <p class="identification-name">采购员列表</p>
        </div>
        <div class="function-btn">
          <router-link tag="div" to="edit-procurement" append class="btn-main g-btn-item">新建采购员<span class="add-icon"></span></router-link>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in list" :key="index" class="list-content list-box">
            <div class="list-item">{{item.created_at}}</div>
            <div class="list-item">{{item.mobile}}</div>
            <div class="list-item">{{item.true_name}}</div>
            <div class="list-item">
              <router-link tag="div" :to="`edit-procurement?id=${item.id}`" append class="list-operation">编辑</router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pageDetail="pageDetail" :pagination="page" @addPage="setPage"></base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {buyerComputed, buyerMethods} from '@state/helpers'

  const PAGE_NAME = 'BUYER'
  const TITLE = '采购员'
  const COMMODITIES_LIST = ['创建时间', '手机', '姓名', '操作']
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
      ...buyerComputed
    },
    methods: {
      ...buyerMethods,
      changeKeyword(keyword) {
        this.setKeyword(keyword)
        this.$refs.pagination.beginPage()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .buyer
    .list-box
      .list-item
        padding-right: 14px
        &:last-child
          max-width :50px
          padding: 0
          flex: 0.3
</style>
