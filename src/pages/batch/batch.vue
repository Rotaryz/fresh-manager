<template>
  <div class="batch table">
    <div class="down-content">
      <!--时间选择-->
      <span class="down-tip">分类筛选</span>
      <div class="down-item">
        <base-drop-down placeHolder="请选择建单时间"></base-drop-down>
      </div>
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="商品名称或商品编码"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-out_stock@2x.png" class="identification-icon">
          <p class="identification-name">{{title}}</p>
        </div>
        <div class="function-btn">
          <div class="btn-main">修改</div>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div class="list-content list-box">
            <div class="list-item">666</div>
            <div class="list-item">666</div>
            <div class="list-item">666</div>
            <div class="list-item">666</div>
            <div class="list-item">666</div>
            <div class="list-item">666</div>
            <div class="list-item time-content">
              <date-picker
                class="edit-input-box" type="date"
                placeholder="请选择"
                style="width: 110px;height: 34px;border-radius: 2px"
                @on-change="changeStartTime($event, index)"
              ></date-picker>
              <!--<div>{{'' || '&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;'}}</div>-->
            </div>
            <div class="list-item">
              <div class="select-time">
                <div class="select-time-name select-time-name-null" @click="setStoreFn()">请选择</div>
                <div class="select-time-icon hand" @click.stop></div>
              </div>
            </div>
            <!--<div v-if="enterMsg.status === 1">-->
            <!--{{item.warehouse_position|| '&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;'}}-->
            <!--</div>-->
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination"></base-pagination>
      </div>
    </div>
    <default-store ref="modalBox" @confirm="confirm"></default-store>
  </div>
</template>

<script type="text/ecmascript-6">
  import {DatePicker} from 'iview'
  import DefaultStore from '@components/default-store/default-store'

  const PAGE_NAME = 'BATCH'
  const TITLE = '批次'
  const COMMODITIES_LIST = ['批次号', '批次库存', '库存均价', '批次库存货值', '入库数', '供应商', '保质期', '存放库位']

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
        title: '名称需要补充数据',
        commodities: COMMODITIES_LIST
      }
    },
    methods: {
      changeStartTime(e, index) {
        // this.enterDetailList[index].shelf_life = e
      },
      setStoreFn(idnex) {
        this.curIndex = idnex
        this.$refs.modalBox.show()
      },
      confirm() {
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .batch
    width: 100%
  .select-time
    layout(row)
    align-items: center
    justify-content: space-between
    width: 127px
    height: 34px
    background: #fff
    border: 1px solid #e1e1e1
    padding: 0 10px
    cursor: pointer
    position: relative
    .select-time-name
      font-size: $font-size-14
      font-family: $font-family-regular
      color: $color-text-main
      width: 100%
      padding-right: 10px
      no-wrap()
    .select-time-name-null
      font-size: $font-size-12
      color: #acacac
    .select-time-icon
      col-center()
      right: 14.5px
      width: 7px
      height: 7px
      icon-image(icon-close)
</style>
