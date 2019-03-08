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
      <div class="tip">~</div>
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
        <base-search placeHolder="采购单号"></base-search>
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
  </div>
</template>

<script type="text/ecmascript-6">
  import {DatePicker} from 'iview'

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
      DatePicker
    },
    data() {
      return {
        commodities: COMMODITIES_LIST
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

  .tip
    margin :0 2px
    font-size: $font-size-14
</style>
