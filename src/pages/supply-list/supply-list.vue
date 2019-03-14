<template>
  <div class="supplier table">
    <div class="down-content">
      <!--时间选择-->
      <span class="down-tip">下单时间</span>
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
        <base-search placeHolder="订单号或商户名称"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <!--<img src="./icon-buyer@2x.png" class="identification-icon">-->
          <p class="identification-name">订单列表</p>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div class="list-content list-box">
            <div class="list-item">item</div>
            <div class="list-item">item</div>
            <div class="list-item">item</div>
            <div class="list-item">中国广东省佛山市禅城区大高路290号省佛山市禅城区大高路290号</div>
            <div class="list-item">item</div>
            <div class="list-item">
              <div class="list-operation">编辑</div>
            </div>
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
  const PAGE_NAME = 'SUPPLIER'
  const TITLE = '订单列表'
  const COMMODITIES_LIST = [
    '下单时间',
    '订单号',
    '商户名称',
    '销售金额',
    '状态',
    '操作'
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

  .supplier
    .list-box
      .list-item
        padding-right: 14px
        &:last-child
          flex: 0.3
        &:nth-child(4)
          flex: 3
</style>
