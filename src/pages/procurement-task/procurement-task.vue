<template>
  <div class="procurement-task table">
    <div class="down-content">
      <!--时间选择-->
      <span class="down-tip">生成时间</span>
      <date-picker
        class="edit-input-box" type="date"
        placeholder="开始时间"
        style="width: 187px;height: 28px;border-radius: 1px"
      ></date-picker>
      <!--@on-change="_getStartTime"-->
      <div class="time-tip">~</div>
      <div class="down-item">
        <date-picker
          class="edit-input-box edit-input-right"
          type="date"
          placeholder="结束时间"
          style="width: 187px;height: 28px;border-radius: 1px"
        ></date-picker>
      </div>
      <!--下拉选择-->
      <span class="down-tip">状态</span>
      <div class="down-item">
        <base-drop-down></base-drop-down>
      </div>
      <!--搜索-->
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="订单号或商品名称"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-purchase_list@2x.png" class="identification-icon">
          <p class="identification-name">采购任务列表</p>
        </div>
        <div class="function-btn">
          <div class="btn-main">发布给采购员</div>
          <div class="btn-main g-btn-item">新建采购任务<span class="add-icon"></span></div>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div class="pro-select-icon hand"></div>
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div class="list-content list-box">
            <div class="pro-select-icon hand"></div>
            <div class="list-item">阿克苏苹果克苏苹果克(肉脆汁多)阿克苏苹果克苏苹果克(肉脆汁多)…</div>
            <div class="list-item">item</div>
            <div class="list-item">item</div>
            <div class="list-item">item</div>
            <div class="list-item">item</div>
            <div class="list-item">item</div>
            <div class="list-item list-item-progress">
              <div class="progress-content">
                <div class="progress-num">5件/10sd件</div>
                <div class="progress-bar">
                  <span class="progress-bar-active"></span>
                </div>
              </div>
              <div class="progress-percentage">50%</div>
            </div>
            <div class="list-item">item</div>
            <div class="list-item">item</div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pages"></base-pagination>
      </div>
    </div>
    <default-modal ref="modal">
      <div slot="content" class="default-input">
        <div class="title-input">
          <div class="title">新建采购任务</div>
          <div class="close-box" @click="cancel">
            <div class="close"></div>
          </div>
        </div>
        <div class="main-input">
          <div class="main-left">
            <div class="text">采购商品</div>
            <div class="text">采购量</div>
          </div>
          <div class="main-right">
            <div class="main-input-box">
              <span class="main-input-box-add hand">点击添加</span>
            </div>
            <div class="main-input-big">
              <input type="number" class="main-input-box" placeholder="请输入采购数量">
              <span class="main-input-tip">件</span>
            </div>
          </div>
        </div>
        <div class="btn-group">
          <div class="btn cancel" @click="cancel">取消</div>
          <div class="btn confirm" @click="confirm">确定</div>
        </div>
      </div>
    </default-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {DatePicker} from 'iview'
  import DefaultModal from '@components/default-modal/default-modal'

  const PAGE_NAME = 'PROCUREMENT_TASK'
  const TITLE = '采购任务'
  const COMMODITIES_LIST = [
    '商品',
    '分类',
    '供应商',
    '采购员',
    '计划采购',
    '已采购',
    '采购进度',
    '发布时间',
    '状态'
  ]
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DatePicker,
      DefaultModal
    },
    data() {
      return {
        commodities: COMMODITIES_LIST
      }
    },
    mounted() {
      this.$refs.modal.showModal()
    },
    methods: {
      cancel() {
        this.$refs.modal.hideModal()
      },
      confirm() {

      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .pro-select-icon
    border-radius: 1px
    border: 1px solid $color-line
    height: 14px
    width: 14px
    margin-right: 18px
    transition: all 0.3s

  .pro-select-icon-disable
    border: 1px solid transparent
    cursor: not-allowed
    icon-image('icon-check_ash')

  .pro-select-icon-active
    border: 1px solid transparent
    icon-image('icon-check')

  .procurement-task
    .list-box
      .list-item
        padding-right: 14px
        &:last-child
          flex: 0.4
        &:nth-child(8), &:nth-child(2)
          flex: 1.5

  .list-item-progress
    display: flex
    align-items: flex-end
    .progress-content
      .progress-num
        font-size: $font-size-10
        color: $color-text-main
        line-height: 1
        margin-bottom: 5px
        font-family: $font-family-regular
      .progress-bar
        margin: 0
        width: 100px
        height: 5px
        border-radius: 3px
        background: #EBEBEB
        position: relative
        .progress-bar-active
          height: 100%
          position: absolute
          top: 0
          left: 0
          border-radius: 3px
          background: $color-main
          width: 50%
    .progress-percentage
      margin-left: 8px
      line-height: 1
      font-size: $font-size-14

  .default-input
    padding-bottom: 30px
    background: #fff
    width: 534px
    border-radius: 1px

    .title-input
      height: 60px
      layout(row)
      align-items: center
      justify-content: space-between
      border-bottom: 0.5px solid $color-line
      padding-left: 20px
      .title
        color: $color-text-main
        font-size: $font-size-16
        font-family: $font-family-regular
      .close-box
        padding: 17px
        cursor: pointer
        .close
          width: 22px
          height: 22px
          border-radius: 50%
          background-size: 22px
          bg-image('icon-close')

    .main-input
      padding: 29.5px 20px 0 40px
      display: flex
      .main-input-big
        display: flex
        .main-input-tip
          line-height: 44px
          font-size: $font-size-14
          font-family: $font-family-regular
          color: $color-text-main
          margin-left: 10px
      .main-input-box
        display: flex
        align-items: center
        width: 333px
        height: 44px
        border: 1px solid $color-line
        border-radius: 1px
        font-family: $font-family-regular
        color: $color-text-main
        font-size: $font-size-14
        padding-left: 11px
        transition: all 0.3s
        margin-bottom: 20px
        &::-webkit-inner-spin-button
          appearance: none
        &:hover
          border: 1px solid #ACACAC
        &::placeholder
          font-family: $font-family-regular
          color: $color-text-assist
        &:focus
          border-color: $color-main !important
        .main-input-box-add
          width: 84px
          height: 24px
          background: #F5F7FA
          line-height: 24px
          padding-left: 8px
          box-sizing: border-box
          font-family: PingFangSC-Regular
          font-size: $font-size-14
          color: #ACACAC
          margin-left: 3px
          position: relative
          transition: all 0.3s
          &:after
            content: ''
            position: absolute
            right: 11px
            top: 8px
            width: 2px
            height: 8px
            background: #ACACAC
            transition: all 0.3s
          &:before
            content: ''
            position: absolute
            right: 8px
            top: 11px
            width: 8px
            height: 2px
            background: #ACACAC
            transition: all 0.3s

    .main-left
      min-width: 60px
      margin-right: 20px
      display: flex
      flex-direction: column
      align-items: flex-end
      .text
        line-height: 44px
        color: #666
        font-size: $font-size-14
        font-family: $font-family-regular
        position: relative
        margin-bottom: 20px
        &:after
          content: '*'
          left: -7px
          position: absolute
          margin-right: -2px
          color: #F52424

    .main-model-box
      layout(row)
      align-items: center
      margin-bottom: 24px

    .btn-group
      margin-top: 20px
      text-align: center
      display: flex
      justify-content: center
      user-select: none
      .btn
        width: 96px
        height: 40px
        line-height: 40px
        border-radius: 1px
        border: 1px solid $color-text-D9
        cursor: pointer
        transition: all 0.3s
      .cancel
        border: 1px solid $color-line
        &:hover
          color: $color-text-sub
          border-color: $color-text-sub
      .confirm
        border: 1px solid $color-main
        background: $color-main
        color: $color-white
        margin-left: 20px
        &:hover
          opacity: 0.8
      .one-btn
        margin-left: 0
</style>
