<template>
  <div class="procurement-task table">
    <div class="down-content">
      <div class="enter-title">入库单号：T27218-CGD-2019-03-04-00001</div>
      <div class="enter-title">供应商：水果供应商B</div>
      <div class="enter-title">入库时间：2018-10-21</div>
      <div class="enter-title">状态：待提交</div>
      <div class="enter-title">入库金额：<span class="enter-title-money">￥209.00</span></div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-inventory@2x.png" class="identification-icon">
          <p class="identification-name">商品明细</p>
        </div>
        <div class="function-btn">
          <div class="btn-main">提交入库单<span class="add-icon"></span></div>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div class="list-content list-box">
            <div class="list-item">2018-12-07 15:00</div>
            <div class="list-item">item</div>
            <div class="list-item">item</div>
            <div class="list-item">
              <input type="number" class="edit-input">
              <div>件</div>
            </div>
            <div class="list-item">
              <input type="number" class="edit-input">
              <div>件</div>
            </div>
            <div class="list-item">item</div>
            <div class="list-item time-content">
              <date-picker
                class="edit-input-box" type="date"
                placeholder="保质时间"
                style="width: 100px;height: 34px;border-radius: 1px"
              ></date-picker>
            </div>
            <div class="list-item">
              <div class="select-time">
                <div class="select-time-name">请选择</div>
                <div class="select-time-icon"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pages"></base-pagination>
      </div>
      <default-store></default-store>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {DatePicker} from 'iview'
  import DefaultStore from '@components/default-store/default-store'

  const PAGE_NAME = 'PROCUREMENT_TASK'
  const TITLE = '商品详情'
  const COMMODITIES_LIST = [
    '批次号',
    '商品',
    '分类',
    '入库数量(采购单位)',
    '入库单价(销售单位) ',
    '入库金额',
    '保质期',
    '存放库位'
  ]
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DatePicker,
      DefaultStore
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

  .procurement-task
    .list-box
      .list-item
        padding-right: 14px
        layout(row)
        align-items: center
        &:last-child
          flex: 0.8
        &:nth-child(4), &:nth-child(2), &:nth-child(5), &:nth-child(6)
          flex: 1.5
  .enter-title
    font-size: $font-size-14
    font-family: $font-family-regular
    color: $color-text-main
    margin-right: 130px
    .enter-title-money
      color: #F84E3C

  .edit-input
    font-size: $font-size-14
    padding: 0 14px
    border-radius: 1px
    width: 60px
    height: 34px
    border: 1px solid $color-line
    margin-right: 10px
    transition: all 0.3s
    &::-webkit-inner-spin-button
      appearance: none
    &:hover
      border: 1px solid #ACACAC
    &::placeholder
      font-family: $font-family-regular
      color: $color-text-assist
    &:focus
      border-color: $color-main !important
  .select-time
    layout(row)
    align-items: center
    justify-content: space-between
    width: 100px
    height: 34px
    background: #fff
    border: 1px solid #e1e1e1
    padding: 0 10px
    cursor: pointer
    .select-time-name
      font-size: $font-size-14
      font-family: $font-family-regular
      color: $color-text-main
    .select-time-icon
      width: 14px
      height: 14px
      icon-image(icon-delete)
  .tip
    margin :0 2px
    font-size: $font-size-14
</style>
