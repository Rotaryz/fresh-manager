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
                <div>{{barCodePreviewInfo.goods_name}}</div>
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
              <button class="generate-btn hand" @click="_sureTagInfo">生成条码</button>
            </div>
          </div>
        </div>
        <div class="generate-icon">
          <img src="./icon-qiantou@2x.png" class="generate-img">
          <span class="generate-tip">生成条码</span>
        </div>
        <div class="bar-code-content">
          <div class="bar-code-content-box">
            <div id="print" class="print-item">
              <div>
                <h3 class="goods-name">商品名称：<span>{{barCodePreviewInfo.goods_name}}</span></h3>
                <div v-if="setting[0].value" class="standard-wrap">规格：{{setting[0].value}}</div>
                <div v-if="setting[1].value" class="standard-wrap">保质期：{{setting[1].value}}</div>
                <div v-if="setting[2].value" class="standard-wrap">包装日期：{{setting[2].value}}</div>
              </div>
              <div class="line"></div>
              <img ref="code" :src="codeImg" alt="" width="330">
            </div>
          </div>
          <div class="generate">
            <div v-print="'#print'" class="generate-btn hand">打印</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import {DatePicker} from 'iview'
  import JsBarcode from 'jsbarcode'
  import {sortingComputed} from '@state/helpers'
  const PAGE_NAME = 'PERVIEW'
  const TITLE = '打印预览'
  function getDateNow(){
    let nowDate = new Date()
    let year = nowDate.getFullYear()
    let month = nowDate.getMonth()+1
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
        setting:[{
          label:'重量',
          type:'input',
          id:'zl',
          value:''
        },{
          label:'保质期',
          type:'input',
          id:'goods_date',
          value:''
        },{
          label:'包装日期',
          type:'date',
          id:'page_time',
          value:getDateNow()
        }],
        printStatus: true,
        codeImg:''
      }
    },
    computed: {
      ...sortingComputed
    },
    mounted() {
      this.initCode()
    },
    methods: {
      // 打印彈框   日期選擇
      handleDateChange(val){
        console.log(this.setting[2].value)
        this.setting[2].value=val
      },
      _sureTagInfo(){
        API.Sorting.getPrintData().then((res)=>{
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return false
          }
          this.$router.push({name:"sorting-task-print-list",params:{id:res.data.id}})
        }).catch((err) => {
          this.$toast.show(err.message)
        }).finally(() => {
          this.$loading.hide()
        })

      },
      initCode() {
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
    .line
      border:1px solid #333
  .back
    position relative
    left: 0
    background-color: #F8FBFD

    &::before
      border-top-width: 0px

</style>
