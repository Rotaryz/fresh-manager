<template>
  <div class="print-list table">
    <div class="table-content">
      <!--列表tab工具栏-->
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-print_list@2x.png" class="identification-icon">
          <p class="identification-name">打印列表</p>
        </div>
      </div>
      <ul id="list-content" class="list-wrap">
        <li v-for="item in printList.list" :key="item.id" class="print-item">
          <img src="./1.png" alt="" width="330">
        </li>
      </ul>
    </div>
    <div class="back btn-group-wrap">
      <div class="back-cancel back-btn hand" @click="backBtn">返回</div>
      <div class="back-btn back-submit hand" @click="printBtn">打印</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {sortingComputed} from '@state/helpers'
  import printJS from 'print-js'
  const PAGE_NAME = 'PRINT_LSIT'
  const TITLE = '打印列表'
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        printStatus: true
      }
    },
    computed: {
      ...sortingComputed
    },
    methods: {
      backBtn() {
        this.$router.go(-1)
      },
      printBtn() {
        window.print()
        printJS('list-content','html')
        // printJS({
        //   documentTitle:' ',
        //   modalMessage:' ',
        //   printable: ['https://printjs.crabbly.com/images/print-03.jpg', 'https://printjs.crabbly.com/images/print-03.jpg'],
        //   type: 'image',
        //   imageStyle:'50%;margin-bottom:20px;'
        // })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .list-wrap
    page-break-after: always

  .print-item
    display: inline-block
    width: 336px
    height: 240px
    margin: 0px 20px 20px 0px
    border: 1px solid #333

  .back
    position relative
    left: 0
    background-color: #F8FBFD

    &::before
      border-top-width: 0px

  .print-wrap
    padding: 20px
    background-color: #fff
    position: fixed
    top: 0
    right: 0
    left 0
    min-height: 100vh
    z-index: 3000
</style>
