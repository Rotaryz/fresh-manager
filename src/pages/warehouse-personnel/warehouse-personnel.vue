<template>
  <div class="warehouse-personnel table">
    <div class="down-content">
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="仓库人员姓名或账号" @search="changeKeyword"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-out_stock@2x.png" class="identification-icon">
          <p class="identification-name">仓库人员列表</p>
        </div>
        <div class="function-btn">
          <router-link tag="div" :to="{path: `/home/foundation-setup/edit-warehouse`}" class="btn-main">新建仓库人员 <span class="add-icon"></span></router-link>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in listTitle" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-if="list.length">
            <div v-for="(item, index) in list" :key="index" class="list-content list-box">
              <div class="list-item">{{item.created_at}}</div>
              <div class="list-item">{{item.true_name}}</div>
              <div class="list-item">{{item.mobile}}</div>
              <div class="list-item list-use">
                <router-link tag="span" :to="{path: `/home/foundation-setup/edit-warehouse?id=${item.id}`}" class="list-operation">编辑</router-link>
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
  import {warehouseComputed, warehouseMethods} from '@state/helpers'

  const PAGE_NAME = 'WAREHOUSE_PERSONNEL'
  const TITLE = '仓库人员管理'
  const LIST_TITLE = ['创建时间', '姓名', '手机号', '操作']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        listTitle: LIST_TITLE
      }
    },
    computed: {
      ...warehouseComputed
    },
    methods: {
      ...warehouseMethods,
      changeKeyword(keyword) {
        this.setKeyword(keyword)
        this.$refs.pagination.beginPage()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .warehouse-personnel
    width: 100%
  .list-box
    .list-item
      box-sizing: border-box
      flex: 1
      &:last-child
        padding: 0
        max-width: 50px
</style>
