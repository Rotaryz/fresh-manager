<template>
  <div class="table">
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-print_list@2x.png" class="identification-icon">
          <p class="identification-name">打印条码</p>
        </div>
        <div class="function-btn">
        </div>
      </div>
      <div class="bar-code">
        <div class="set-bar-code">
          <div class="bar-title">输入编码</div>
          <div class="set-bar-code-box">
            <textarea v-model="codeValue" name="print" class="bar-text"></textarea>
            <div class="generate">
              <button class="generate-btn hand" @click="generate">生成条码</button>
              <span class="generate-tip">当前条数{{num}}/50</span>
            </div>
          </div>
        </div>
        <div class="generate-icon">
          <img src="./icon-qiantou@2x.png" class="generate-img">
          <span class="generate-tip">生成条码</span>
        </div>
        <div class="bar-code-content">
          <div class="bar-code-content-box">
            <div class="bar-code-small" :style="{height: height + 'px'}">
              <div :style="{opacity: 0}" class="bar-code-items bar-code-items-one">
              </div>
              <div class="bar-code-items-box">
                <div v-for="(item, index) in img" :key="index" :style="{height: itemHeight + 'px'}" class="bar-code-items">
                  <img :src="item" class="barcode">
                </div>
              </div>

              <!--&lt;!&ndash;<div v-for="i in 200" :key="i">dfs</div>&ndash;&gt;-->
            </div>
          </div>
          <div class="generate">
            <div v-if="code.length" v-print="'#printTest'" class="generate-btn hand">打印</div>
            <div v-else class="generate-btn hand" @click="noPrint">打印</div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="false" class="big">
      <div id="printTest">
        <div v-for="(item, index) in code " :key="index" class="print-box">
          <div class="print-box-small">
            <img :src="item" class="print-img">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import JsBarcode from 'jsbarcode'

  const PAGE_NAME = 'BAR_CODE'
  const TITLE = '打印条码'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        height: 0,
        itemHeight: 0,
        img: [],
        code: [],
        codeValue: '',
        isShow: false,
        num: 0
      }
    },
    watch: {
      codeValue(news) {
        let value = news.split('\n').join('；')
        let endArr = []
        let arr = value.split('；')
        arr.forEach((item) => {
          if (item) {
            endArr.push(item)
          }
        })
        this.num = endArr.length
      }
    },
    mounted() {
      this.height = document.querySelector('.bar-code-content').offsetHeight - 60
      this.itemHeight = document.querySelector('.bar-code-items-one').offsetWidth * 0.7131
      window.onresize = () => {
        this.itemHeight = document.querySelector('.bar-code-items-one').offsetWidth * 0.7131
      }
    },
    methods: {
      noPrint() {
        this.$toast.show('暂无可打印的条码')
      },
      generate() {
        let value = this.codeValue.split('\n').join('；')
        let endArr = []
        let arr = value.split('；')
        arr.forEach((item) => {
          if (item) {
            endArr.push(item)
          }
        })
        if (endArr.length > 50) {
          this.$toast.show('生成条码不能超过50条')
          return
        } else if (JSON.stringify(this.code) === JSON.stringify(endArr)) {
          return
        }
        this.isShow = false
        this.code = endArr
        let img = []
        if (endArr.length <= 0) {
          this.img = []
          return
        }
        this.$loading.show('条形码生成中')
        setTimeout(() => {
          let ele = document.querySelectorAll('.print-img')
          for (let i in this.code) {
            let str = this.code[i]
            let options = {
              format: 'CODE128',
              textAlign: 'left',
              height: 70,
              margin: 0,
              lineColor: '#000000'
            }
            if (i === 'length') {
              return
            }
            JsBarcode(ele[i], str, options)
            img.push(ele[i].src)
          }
          this.img = img
          this.isShow = true
          this.$loading.hide()
        }, 600)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .bar-code
    display: flex
    margin-top: 7px
    padding-bottom: 20px
    box-sizing: border-box
    flex: 1
  .set-bar-code
    display: flex
    .bar-title
      font-size: $font-size-14
      color: $color-text-sub
      margin: 15px 40px 0 19px
      line-height: 1
    .set-bar-code-box
      display: flex
      flex-direction: column
      .bar-text
        width: 284px
        padding: 20px 12px
        box-sizing: border-box
        border: 0.5px solid #D3D8DC
        resize: none
        flex: 1
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-text-main
        &::-webkit-scrollbar
          width: 4px
          height: 0
          transition: all 0.2s
        &::-webkit-scrollbar-thumb
          background-color: rgba(153, 153, 153, .8)
          border-radius: 10px

        &::-webkit-scrollbar-thumb:hover
          background-color: #999999

        &::-webkit-scrollbar-track
          box-shadow: inset 0 0 6px rgba(0, 0, 0, .15)
          border-radius: 10px

  .generate-icon
    margin: 0 40px
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    .generate-img
      width: 28px
      margin-bottom: 15px
    .generate-tip
      font-size: $font-size-14
      line-height: 1
      color: $color-text-sub

  .bar-code-content
    flex: 1
    display: flex
    flex-direction: column
    .bar-code-content-box
      flex: 1
      background: #F9F9F9
      border-radius: 2px
      border-1px(#D3D8DC, 2px)
      box-sizing: border-box
    .bar-code-small
      overflow-y: auto
      padding: 1px
      &::-webkit-scrollbar
        width: 4px
        height: 0
        transition: all 0.2s
      &::-webkit-scrollbar-thumb
        background-color: rgba(153, 153, 153, .8)
        border-radius: 10px

      &::-webkit-scrollbar-thumb:hover
        background-color: #999999

      &::-webkit-scrollbar-track
        box-shadow: inset 0 0 6px rgba(0, 0, 0, .15)
        border-radius: 10px
      .bar-code-items-box
        display: flex
        flex-wrap: wrap
        padding-top: 2.2%
      .bar-code-items
        border-radius: 2px
        border: 1px solid $color-text-main
        width: 23.125%
        height: 179px
        margin: 0 0 2.2% 1.5%
        background: $color-white
        box-sizing: border-box
        display: flex
        align-items: center
        justify-content: center
        .barcode
          width: 79.7%
      .bar-code-items-one
        opacity: 0
        position: absolute

  .generate
    box-sizing: border-box
    padding-top: 20px
    .generate-tip
      display: inline-block
      font-size: 12px
      color: $color-text-assist
      margin-left: 10px
    .generate-btn
      text-align: center
      line-height: 40px
      background: $color-main
      font-size: $font-size-16
      color: $color-white
      border-radius: 2px
      height: 40px
      width: 104px
      transition: all 0.2s
      &:hover
        opacity: 0.9

  .print-box
    width: 300px
    background: $color-white
    height: 205px
    display: flex
    justify-content: center
    align-items: center
    .print-box-small
      margin-top: -7%
    .print-img
      display: block
      margin: auto
      width: 79.7%

  @media print {
    html, body {
      height: inherit
    }
  }
  @page
    color: #000
    margin: 3mm
    size: auto A4 landscape
</style>
