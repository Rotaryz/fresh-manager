<template>
  <div class="print-list table">
    <div class="table-content">
      <!--列表tab工具栏-->
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-print_list@2x.png" class="identification-icon">
          <p class="identification-name">打印预览</p>
        </div>
      </div>
      <div class="print-wrap">
        <div id="print" class="print-item">
          <h3>商品名称：<span>{{sortingTaskDetailByOrder.goods_name}}</span></h3>
          <div class="standard-wrap">规格：{{sortingTaskDetailByOrder.standard}}</div>
          <div class="standard-wrap">包装日期：{{sortingTaskDetailByOrder.package_time}}</div>
          <div class="line"></div>
          <img ref="code" :src="codeImg" alt="" width="330">
        </div>
      </div>

    </div>
    <div class="back btn-group-wrap">
      <div class="back-cancel back-btn hand" @click="backBtn">返回</div>
      <div class="back-btn back-submit hand" v-print="'#print'">打印</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import JsBarcode from 'jsbarcode'
  import {sortingComputed} from '@state/helpers'
  const PAGE_NAME = 'PERVIEW'
  const TITLE = '打印预览'
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        printStatus: true,
        codeImg:''
      }
    },
    computed: {
      ...sortingComputed
    },
    mounted() {
      this.getCode()
    },
    methods: {
      getCode() {
        let options = {
          format: 'CODE128',
          textAlign: 'left',
          height: 70,
          margin: 0,
          lineColor: "#000000"
        }
        JsBarcode(this.$refs.code, this.barCodePreviewInfo.code || 11111, options)
      },
      backBtn() {
        this.$router.replace({
          name:'sorting-task',
          params:{
            tabIndex:1
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .list-wrap
    page-break-after: always

  .print-item
    width:420px
    padding:20px
    display: inline-block
    height: 300px
    margin: 0px auto
    border: 1px solid #333
    border-radius :6px
    box-sizing: border-box
    color: #33333
    font-size:$font-size-15
    .good-name
      font-size :$font-size-16
    .line
      border:1px solid #333
      margin:30px 0px 40px
  .back
    position relative
    left: 0
    background-color: #F8FBFD

    &::before
      border-top-width: 0px

  /*.print-wrap*/
    /*display flex*/
    /*justify-content center*/


</style>
