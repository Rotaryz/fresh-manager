<template>
  <div class="storehouse-detail table">
    <div class="down-content">
      <!--时间选择-->
      <span class="down-tip">变动类型</span>
      <div class="down-item">
        <base-drop-down></base-drop-down>
      </div>
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="单据号"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-warehouse_goods@2x.png" class="identification-icon">
          <p class="identification-name">{{title}}</p>
        </div>
        <div class="function-btn">
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div class="list-content list-box">
            <div class="list-item">666</div>
            <div class="list-item">
              <div class="list-operation">T27218-CGD-190304-00001</div>
            </div>
            <div class="list-item">666</div>
            <div class="list-item">666</div>
            <div class="list-item">666</div>
            <div class="list-item">666</div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination"></base-pagination>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'STOREHOUSE_DETAIL'
  const TITLE = '库存管理详情'
  const COMMODITIES_LIST = ['操作时间', '单据号', '变动类型', '数量', '总库存数', '操作人']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        title: '名称需要补充数据',
        commodities: COMMODITIES_LIST
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
        flex: 1.3
      &:nth-child(2)
        flex: 2
        min-width: 190px
      &:last-child
        flex: 0.7
</style>
