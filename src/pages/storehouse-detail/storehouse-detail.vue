<template>
  <div class="storehouse-detail table">
    <div class="down-content">
      <!--时间选择-->
      <span class="down-tip">变动类型</span>
      <div class="down-item">
        <base-drop-down :select="storeType" @setValue="setStoreType"></base-drop-down>
      </div>
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="单据号" @search="searchDetail"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-warehouse_goods@2x.png" class="identification-icon">
          <p class="identification-name">{{goodsMsg.goods_name}}{{goodsMsg.goods_sku_encoding ? `(${goodsMsg.goods_sku_encoding})` : ''}}</p>
        </div>
        <div class="function-btn">
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-if="warehouseDetailList.length">
            <div v-for="(item, index) in warehouseDetailList" :key="index" class="list-content list-box">
              <div class="list-item">{{item.created_at}}</div>
              <div class="list-item">
                <div class="list-operation" @click="goDetail(item)">{{item.order_sn}}</div>
              </div>
              <div class="list-item">{{item.type_str}}</div>
              <div class="list-item">{{`${item.num}${item.unit}`}}</div>
              <div class="list-item">{{`${item.total_stock}${item.unit}`}}</div>
              <div class="list-item">{{item.operator}}</div>
            </div>
          </div>
          <base-blank v-else></base-blank>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pagination" :pageDetail="detailPageTotal" @addPage="addPage"></base-pagination>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import {storeComputed, storeMethods} from '@state/helpers'
  import API from '@api'

  const PAGE_NAME = 'STOREHOUSE_DETAIL'
  const TITLE = '库存管理详情'
  const COMMODITIES_LIST = ['操作时间', '单据号', '变动类型', '数量', '总库存数', '操作人']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE,
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
        orderSn: '',
        page: 1,
        type: '',
        storeType: {check: false, show: false, content: '变动类型', type: 'default', data: []} // 格式：{name: '55'
      }
    },
    computed: {
      ...storeComputed
    },
    async created() {
      await this._getwarehouseStockType()
    },
    methods: {
      ...storeMethods,
      goDetail(item) {
        switch (item.type) {
        case 1:
          this.$router.push(`/home/product-enter/enter-detail/${item.source_order_id}`)
          break
        case 4:
        case 9:
        case 13:
          this.$router.push(`/home/stock-taking/stock-detail/${item.source_order_id}`)
          break
        case 6:
        case 11:
          this.$router.push(`/home/product-out/out-detail/${item.source_order_id}`)
          break
        }
      },
      // 获取变动类型列表
      async _getwarehouseStockType() {
        let res = await API.Store.warehouseStockType()
        if (res.error !== this.$ERR_OK) {
          return
        }
        let arr = []
        for (let value in res.data) {
          arr.push({name: res.data[value], status: value})
        }
        arr.unshift({name: '全部', status: ''})
        this.storeType.data = arr
      },
      setStoreType(item) {
        this.type = item.status
        this.page = 1
        this.$refs.pagination.beginPage()
        this._getWarehouseDetailList()
      },
      _getWarehouseDetailList() {
        this.getWarehouseDetailList(
          {
            code: this.$route.query.code,
            page: this.page,
            type: this.type,
            orderSn: this.orderSn,
            loading: false
          }
        )
      },
      searchDetail(orderSn) {
        this.page = 1
        this.orderSn = orderSn
        this.$refs.pagination.beginPage()
        this._getWarehouseDetailList()
      },
      addPage(page) {
        this.page = page
        this._getWarehouseDetailList()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .list-box
    .list-item
      align-items: center
      &:nth-child(1)
        flex: 1.3
      &:nth-child(2)
        flex: 2
        min-width: 190px
      &:last-child
        flex: 0.7
</style>
