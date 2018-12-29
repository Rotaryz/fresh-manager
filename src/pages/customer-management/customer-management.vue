<template>
  <div class="customer-management">
    <div class="tab-header">
      <div class="tab-box">
        <base-date-select placeHolder="选择注册日期"></base-date-select>
      </div>
      <base-search placeHolder="会员昵称/手机号" @search="_search"></base-search>
    </div>
    <div class="list-header list-box">
      <div v-for="(item,index) in listTitle" :key="index" class="list-item">
        {{item.title}}
        <base-sort v-if="item.showSort"></base-sort>
      </div>
    </div>
    <div class="list">
      <div class="list-content list-box">
        <div class="list-item">
          <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1546002486381&di=2fefb7abbf591ad892c202ab36408f2d&imgtype=0&src=http%3A%2F%2Fwww.17qq.com%2Fimg_biaoqing%2F82173425.jpeg" class="list-img">
        </div>
        <div class="list-item">发</div>
        <div class="list-item">的</div>
        <div class="list-item">的</div>
        <div class="list-item">的</div>
        <div class="list-item">是</div>
        <div class="list-item">是</div>
        <div class="list-item">是</div>
      </div>
    </div>
    <div class="pagination-box">
      <!--:pageDetail="pageTotal"-->
      <base-pagination ref="pages" @addPage="_getMoreList"></base-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'CUSTOMER_MANAGEMENT'
  const TITLE = '客户管理'
  const LIST_TITLE = [
    {title: '客户头像', showSort: false},
    {title: '客户昵称', showSort: false},
    {title: '客户手机', showSort: false},
    {title: '交易单数', showSort: true},
    {title: '交易数', showSort: true},
    {title: '客单价', showSort: true},
    {title: '注册时间', showSort: false},
    {title: '最后登录时间', showSort: false}
  ]

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
    computed: {},
    created() {},
    methods: {
      _search(text) {
        this.$refs.pages.beginPage()
        this.page = 1
      },
      _getMoreList(page) {}
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .customer-management
    overflow: hidden
    flex: 1
    display: flex
    flex-direction: column

  .tab-header
    height: 80px
    display: flex
    align-items: center
    box-sizing: border-box
    .tab-box
      margin-right: 10px

  .list-header
    height: 50px
    font-size: $font-size-16
    font-family: $font-family-regular
    color: $color-text-main
    background: $color-list-header
    .list-item
      display: flex
      align-items: center

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
      .list-img
        width: 50px
        height: @width
        object-fit: cover
        overflow: hidden
        border-radius: 50%

  .list
    flex: 1
    .list-content
      font-family: $font-family-regular
      color: $color-text-main
      height: 70px
      border-bottom: 1px solid $color-line
      .list-item
        no-wrap()
        font-size: $font-size-14
        .list-link
          &:hover
            color: $color-sub
      // 双行样式
      .list-double-row
        .item-sub
          no-wrap()
          line-height: 1
          margin-top: 8px
          font-size: $font-size-14
          color: $color-text-assist
        .item-dark
          no-wrap()
          font-size: $font-size-14
          line-height: 1

  .pagination-box
    height: 70px
    align-items: center
    display: flex

  .btn-main
    position: relative
    .file-box
      position: absolute
      top: 0
      left: 0
      width: 84px
      height: 28px
      opacity: 0
</style>
