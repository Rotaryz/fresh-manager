<template>
  <div class="batch table">
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-out_stock@2x.png" class="identification-icon">
          <p class="identification-name">{{goodsMsg.goods_name}}{{goodsMsg.goods_sku_encoding ? `(${goodsMsg.goods_sku_encoding})` : ''}}</p>
        </div>
        <!--<div class="function-btn"></div>-->
      </div>
      <div class="big-list" :class="stockListNow.length > 10 ? 'big-list-max' : ''">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-if="stockListNow.length">
            <div v-for="(item, index) in stockListNow" :key="index" class="list-content list-box">
              <div class="list-item">{{item.batch_num}}</div>
              <div class="list-item">{{`${item.usable_stock}${item.unit}`}}</div>
              <div class="list-item">￥{{item.stock_average}}</div>
              <div class="list-item">￥{{item.stock_value}}</div>
              <div class="list-item">{{`${item.base_num}${item.unit}`}}</div>
              <div class="list-item">{{item.supplier}}</div>
              <div class="list-item time-content">
                <date-picker
                  class="edit-input-box"
                  type="date"
                  placeholder="请选择"
                  style="width: 110px;height: 34px;border-radius: 2px"
                  :value="item.shelf_life"
                  @on-change="changeStartTime($event, index)"
                ></date-picker>
              </div>
              <div class="list-item">
                <div class="select-time">
                  <div class="select-time-name" :class="{'select-time-name-null': !item.warehouse_position}" @click="setStoreFn(index)">{{item.warehouse_position || '请选择'}}</div>
                  <div v-show="item.warehouse_position" class="select-time-icon hand" @click.stop="clearPosition(index)"></div>
                </div>
              </div>
            </div>
          </div>
          <base-blank v-else></base-blank>
        </div>
      </div>
    </div>
    <default-store ref="modalBox" @confirm="confirm"></default-store>
    <div class="back">
      <div class="back-cancel back-btn hand" @click="cancel">取消</div>
      <div class="back-btn back-submit hand" @click="changeBatch">保存</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {DatePicker} from 'iview'
  import DefaultStore from '@components/default-store/default-store'
  import {storeComputed, storeMethods} from '@state/helpers'
  import API from '@api'

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
    props: {
      goodsMsg: {
        type: Object,
        default: () => {
          return {
            goods_name: '',
            goods_sku_encoding: ''
          }
        }
      }
    },
    data() {
      return {
        title: this.$route.query.name,
        commodities: COMMODITIES_LIST,
        curIndex: 0,
        isChange: true,
        stockListNow: []
      }
    },
    computed: {
      ...storeComputed
    },
    created() {
      this.stockListNow = JSON.parse(JSON.stringify(this.stockList))
    },
    methods: {
      ...storeMethods,
      cancel() {
        this.$router.back()
      },
      // 修改保质期
      changeStartTime(e, index) {
        this.stockListNow[index].shelf_life = e
      },
      setStoreFn(index) {
        this.curIndex = index
        this.$refs.modalBox.getStoreList()
        this.$refs.modalBox.show()
      },
      // 确认选择的库位
      confirm(id, text) {
        this.$refs.modalBox.cancel()
        this.stockListNow[this.curIndex].warehouse_position = text
        this.stockListNow[this.curIndex].warehouse_position_id = id
      },
      clearPosition(index) {
        this.stockListNow[index].warehouse_position = ''
        this.stockListNow[index].warehouse_position_id = ''
      },
      // 修改
      async changeBatch() {
        if (!this.isChange) {
          return false
        }
        let data = []
        for (let i in this.stockListNow) {
          // if (!this.stockListNow[i].warehouse_position_id) {
          //   this.$toast.show(`请选择批次号${this.stockListNow[i].batch_num}的存放库位`)
          //   return
          // }
          data.push({
            batch_num: this.stockListNow[i].batch_num,
            warehouse_position_id: this.stockListNow[i].warehouse_position_id,
            shelf_life: this.stockListNow[i].shelf_life
          })
        }
        this.isChange = false
        let res = await API.Store.editWarehouseBatch(this.$route.query.code, {batch: data})
        this.$toast.show(res.message, 600)
        if (res.error !== this.$ERR_OK) {
          this.isChange = true
          return
        }
        setTimeout(() => {
          this.$router.back()
        }, 800)
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
