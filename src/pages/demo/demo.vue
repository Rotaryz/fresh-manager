<template>
  <div class="demo">
    demo
    <!--<add-goods ref="addg" @batchAddition="_batchAddition"></add-goods>-->
    <span @click="deleteGoods()">sahNGV</span>
    <div v-show="true" class="big">
      <div id="printTest">
        <div>
          <!--<p class="name">荞麦饼干</p>-->
          <!--<div class="msg">-->
          <!--<div class="content">原味</div>-->
          <!--<div class="money">售价：12：00</div>-->
          <!--</div>-->
          <!--<img src="./2-140412125945415.jpg" alt="" class="img">-->
          <img v-if="false" id="barcode" class="barcodes">
        </div>
      </div>
    </div>
    <button v-print="'#printTest'">打印</button>

    <!--<section ref="print">-->
    <!--打印内容-->
    <!--<div class="no-print">不要打印我</div>-->
    <!--</section>-->
    <!--<button @click="printAll">打印</button>-->
    <div></div>
  </div>
</template>

<script type="text/ecmascript-6">
// import AddGoods from '@components/add-goods/add-goods'
  import JsBarcode from 'jsbarcode'

  const PAGE_NAME = 'DEMO'

  const TITLE = '模板'
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
    // AddGoods
    },
    data() {
      return {
        img: ''
      }
    },
    mounted() {
    // this.barcode()
    },
    methods: {
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
