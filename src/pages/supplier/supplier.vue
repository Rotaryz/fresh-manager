<template>
  <div class="supplier table">
    <div class="down-content">
      <!--搜索-->
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="供应商名称"></base-search>
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
          <div class="list-content list-box">
            <div class="list-item">item</div>
            <div class="list-item">item</div>
            <div class="list-item">item</div>
            <div class="list-item">中国广东省佛山市禅城区大高路290号省佛山市禅城区大高路290号</div>
            <div class="list-item">item</div>
            <div class="list-item">
              <div class="list-operation">编辑</div>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pages"></base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'SUPPLIER'
  const TITLE = '供应商'
  const COMMODITIES_LIST = ['编号', '供应商名称', '手机', '地址', '采购员', '操作']
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        commodities: COMMODITIES_LIST
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .supplier
    .list-box
      .list-item
        padding-right: 14px
        &:last-child
          flex: 0.3
        &:nth-child(4)
          flex: 3
</style>
