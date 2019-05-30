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
      <div class="bar-code">
        <div class="set-bar-code">
          <div class="set-bar-code-box">
            <div class="bar-content">
              <div class="form-item">
                <label class="right">商品名称：</label>
                <div>{{barCodePreviewInfo.goodsName}}</div>
              </div>
              <div v-for="item in setting" :key="item.id" class="form-item">
                <label class="right">{{item.label}}：</label>
                <input v-if="item.type==='input'" v-model="item.value" :label="item.label" class="ivu-input" type="text">
                <date-picker
                  v-else-if="item.type==='date'"
                  type="date"
                  class="large"
                  :value="item.value"
                  :clearable="false"
                  size="large"
                  @on-change="handleDateChange"
                ></date-picker>
              </div>
            </div>
            <div class="generate">
              <button class="generate-btn hand" @click="_sureTagInfo">刷新条码</button>
            </div>
          </div>
        </div>
        <div class="generate-icon">
          <img src="./icon-qiantou@2x.png" class="generate-img">
          <span class="generate-tip">生成条码</span>
        </div>
        <div class="bar-code-content">
          <div class="bar-code-content-box">
            <div class="print-item">
              <!--<div>-->
              <h3 class="goods-name">商品名称：{{barCodePreviewInfo.goodsName}}</h3>
              <div v-if="setting[0].value" class="info-text">规格：{{setting[0].value}}</div>
              <div v-if="setting[1].value" class="info-text">保质期：{{setting[1].value}}</div>
              <div v-if="setting[2].value" class="info-text">包装日期：{{setting[2].value}}</div>
              <!--</div>-->
              <div class="line"></div>
              <img ref="code">
            </div>
          </div>
          <div class="generate">
            <div v-print="'#print'" class="generate-btn hand">打印</div>
            <div class="back-btn hand" @click="backBtn">返回</div>
          </div>
          <div v-show="false">
            <div id="print" class="print-item">
              <h3 class="goods-name">商品名称：{{barCodePreviewInfo.goodsName}}</h3>
              <div v-if="setting[0].value" class="info-text">规格：{{setting[0].value}}</div>
              <div v-if="setting[1].value" class="info-text">保质期：{{setting[1].value}}</div>
              <div v-if="setting[2].value" class="info-text">包装日期：{{setting[2].value}}</div>
              <div class="line"></div>
              <img :src="codeImg" class="print-img">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {DatePicker} from 'iview'
  import JsBarcode from 'jsbarcode'
  import {sortingComputed, sortingMethods} from '@state/helpers'
  const PAGE_NAME = 'PERVIEW'
  const TITLE = '打印预览'
  function getDateNow() {
    let nowDate = new Date()
    let year = nowDate.getFullYear()
    let month = nowDate.getMonth() + 1
    let date = nowDate.getDate()
    return `${year}-${month}-${date}`
  }
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DatePicker
    },
    data() {
      return {
        setting: [
          {
            label: '重量',
            type: 'input',
            id: 'zl',
            value: ''
          },
          {
            label: '保质期',
            type: 'input',
            id: 'goods_date',
            value: ''
          },
          {
            label: '包装日期',
            type: 'date',
            id: 'page_time',
            value: getDateNow()
          }
        ],
        printStatus: true,
        codeImg: ''
      }
    },
    computed: {
      ...sortingComputed
    },
    mounted() {
      this.initCode()
    },
    methods: {
      ...sortingMethods,
      // 打印彈框   日期選擇
      handleDateChange(val) {
        this.setting[2].value = val
      },
      _sureTagInfo() {
        this.$loading.show()
        this.getBarCodePreviewInfo(this.$route.params).then((res) => {
          res && this.initCode()
          this.$loading.hide()
        })
      },
      initCode(height = 70) {
        let options = {
          format: 'CODE128',
          textAlign: 'left',
          height: 70,
          margin: 0,
          lineColor: '#000000'
        }
        JsBarcode(this.$refs.code, this.barCodePreviewInfo.code || '空', options)
        this.codeImg = this.$refs.code.src
      },
      backBtn() {
        this.$router.replace({
          name: 'sorting-task',
          params: {
            tabIndex: 1
          }
        })
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
      .bar-content
        width: 400px
        padding: 20px 30px 20px 10px
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

  .form-item
    display: flex
    align-items: center
    font-size :14px
    margin-bottom:24px
    height:40px
    label
      font-family:$font-family-regular
      margin-right:20px
      width:84px
      flex-shrink: 0
      &.right
        text-align right
    .ivu-date-picker
      flex:1
    input
      height: 40px
      width:410px
      border:1px solid #D3D8DC
      border-radius: 2px
      padding:20px
      color:#333


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
      display flex
      align-content center
      align-items center
  .generate
    box-sizing: border-box
    padding-top: 20px
    .generate-tip
      display: inline-block
      font-size: 12px
      color: $color-text-assist
      margin-left: 10px
    .generate-btn
      display:inline-block
      text-align: center
      line-height: 40px
      background: $color-main
      font-size: $font-size-16
      color: $color-white
      border-radius: 2px
      height: 40px
      width: 96px
      transition: all 0.2s
      &:hover
        opacity: 0.9
     .back-btn
        display:inline-block
        width: 96px
        height:40px
        line-height: 40px
        text-align: center
        margin-left:20px
        border: 1px solid #E6EAED
        border-radius 4px
        background-color: #FFF

  .print-item
    width:420px
    padding:20px
    display: flex
    flex-direction:column
    justify-content:space-between
    height: 300px
    margin: 0px auto
    border: 1px solid #333
    border-radius :6px
    box-sizing: border-box
    color: #33333
    font-size:$font-size-15
    .goods-name
      font-size :$font-size-16
      font-family :$font-family-medium
      font-weight :bold
      color: #33333
    .info-text
      color: #33333
      font-size:$font-size-15
    .line
      border-bottom:2px solid #333
  #print
    width:61mm
    height:45mm
    &.print-item
      padding:2mm
      .line
        margin-bottom:1mm
      .print-img
        flex:1
        max-height:18mm
    .goods-name
      font-size :$font-size-14
      font-family :$font-family-medium
      font-weight :bold
      color: #33333
      .info-text
        color: #33333
        font-size:$font-size-12
  @page
    color: #000
    margin: 3mm
</style>
