<template>
  <div class="demo">
    <button @click="addPage">
      Jiayi
    </button>
    <div style="height:200px"></div>
    <zb-pagination :pagerCount="9" :currentPage.sync="currentPage" :total="119" @pageChange="pageChange"></zb-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
  import JsBarcode from 'jsbarcode'
  import zbPagination from '../../components/zb-pagination/_zb-pagination'

  const PAGE_NAME = 'DEMO'

  const TITLE = '模板'
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      zbPagination
    // AddGoods
    },
    data() {
      return {
        currentPage: 1,
        img: ''
      }
    },
    methods: {
      pageChange(val) {
        console.log(val)
      },
      addPage() {
        this.currentPage++
      },
      barcode() {
        // JsBarcode生成条形码
        JsBarcode('#barcode')
          .options({font: 'OCR-B'})
          .EAN13('6927999300031', {fontSize: 16, textMargin: 0})
          .blank(20)
          .render()
        let qrImage = document.querySelector('#barcode')
        this.img = qrImage.src
      },
      printAll() {
        // let htmls = window.document.body.innerHTML
        this.$print(this.$refs.print)
      },
      _batchAddition(list) {
        console.log(list)
      },
      deleteGoods() {
        this.$refs.addg._delGoods(160)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  #test::-webkit-input-placeholder
  #test::-moz-placeholder
  #test:-moz-placeholder
  #test::-ms-input-placeholder
    font-size: $font-size-14
    color: red

  textarea::-webkit-input-placeholder
  textarea::-moz-placeholder
  textarea:-moz-placeholder
  textarea::-ms-input-placeholder
    font-size: $font-size-14
    color: #000

  .placeholder-text
    font-size: $font-size-14
    color: #ACACAC

  .demo
    width: 100%

  @media print {
    html, body {
      height: inherit
    }
  }

  .big
    display: block

  @page
    color: #000
    margin: 3mm 0 0
    size: auto A4 landscape

  #printTest
    color: #000
    padding: 0
    margin: 0
    display: flex
    flex-direction: column
    align-items: center
    text-align: center
    /*width: 342px*/
    /*height: 205px*/
    box-sizing: border-box
    margin-left: -10px

  .img
    width: 60px

  .name
    font-size: 24px

  .msg
    margin: 8px auto
    display: flex
    width: 60%
    font-size: 14px
    justify-content: space-between

  .barcodes
    width: 210px
    margin-left: 18px

  .img
    margin-top: -10px
    width: 190px
</style>
