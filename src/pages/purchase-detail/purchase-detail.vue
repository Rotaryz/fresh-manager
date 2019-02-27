<template>
  <div class="purchase-detail detail-content">
    <div class="identification">
      <div class="identification-page">
        <img src="./icon-purchase_list@2x.png" class="identification-icon">
        <p class="identification-name">采购详情</p>
      </div>
      <div class="function-btn">
      </div>
    </div>
    <div class="essential-information">
      <div class="content-header">
        <div class="content-title">基本信息</div>
        <a class="btn-main btn-a" target="_blank" :href="excelUrl">导出Excel</a>
      </div>
      <div class="essential-information-detail">
        <p class="essential-information-item">采购单号：{{detail.order_sn}}</p>
        <p class="essential-information-item">生成时间：{{detail.created_at}}</p>
        <p class="essential-information-item">采购商品总数：{{detail.type_count}}</p>
        <p class="essential-information-item">数据来源：{{detail.source_str}}</p>
      </div>
    </div>
    <div class="list-of-commodities">
      <div class="content-header">
        <div class="content-title">商品清单</div>
      </div>
      <div class="commodities-list">
        <div class="commodities-list-header com-list-box">
          <div v-for="(item, index) in commodities" :key="index" class="com-list-item">{{item}}</div>
        </div>
        <div class="big-box">
          <div v-for="(item, index) in detail.detail_list" :key="index" class="com-list-box com-list-content">
            <div class="com-list-item">{{index + 1}}</div>
            <div class="com-list-item">{{item.goods_name}}</div>
            <div class="com-list-item">{{item.goods_units}}</div>
            <div class="com-list-item">{{item.wait_num}}</div>
            <div class="com-list-item">{{item.total_stock}}</div>
            <div class="com-list-item">{{item.num}}</div>
            <div class="com-list-item">{{item.not_num}}</div>
            <div class="com-list-item">￥{{item.price}}</div>
            <div class="com-list-item">￥{{item.sub_total}}</div>
          </div>
        </div>
      </div>
    </div>
    <!--<div class="history-record">-->
    <!--<div class="content-header">-->
    <!--<div class="content-title">历史记录</div>-->
    <!--</div>-->
    <!--<div class="commodities-list">-->
    <!--<div class="commodities-list-header com-list-box">-->
    <!--<div v-for="(item, index) in historyRecord" :key="index" class="com-list-item">{{item}}</div>-->
    <!--</div>-->
    <!--<div v-for="(item, index) in detail.operate_list" :key="index" class="com-list-box com-list-content">-->
    <!--<div class="com-list-item">{{index + 1}}</div>-->
    <!--<div class="com-list-item">{{item.manager_name}}</div>-->
    <!--<div class="com-list-item">{{item.created_at}}</div>-->
    <!--<div class="com-list-item">{{item.remark}}</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
    <div class="back">
      <div class="back-btn btn-main" @click="_back">返回</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'PURCHASE_DETAIL'
  const TITLE = '采购详情'
  const COMMODITIES_LIST = [
    '序号',
    '商品名称',
    '单位',
    '待采购量',
    '库存',
    '收货数量',
    '未收数量',
    '收货单价',
    '收货金额'
  ]
  const HISTORY_RECORD = ['序号', '操作人', '时间', '操作记录']
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    props: {
      detail: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        historyRecord: HISTORY_RECORD,
        excelUrl: `${process.env.VUE_APP_API}/social-shopping/api/backend/store-purchase-export/`
      }
    },
    created() {
      let currentId = this.getCurrentId()
      let token = this.$storage.get('auth.currentUser', '')
      let excelParams = token ? `?access_token=${token.access_token}&current_corp=${currentId}` : ''
      let id = this.$route.query.id || null
      this.excelUrl = `${this.excelUrl}${id}${excelParams}`
    },
    methods: {
      _back() {
        this.$router.back()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/detail"

  .purchase-detail
    line-height: 1
    flex: 1
    position: relative

  .btn-a
    &:hover
      color: $color-white

  .com-list-box
    .com-list-item
      &:nth-child(1)
        flex: 0.5
</style>
