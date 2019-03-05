<template>
  <div class="dispatching-detail detail-content">
    <div class="identification">
      <div class="identification-page">
        <img src="./icon-dispatching@2x.png" class="identification-icon">
        <p class="identification-name">团长配送单详情</p>
      </div>
      <div class="function-btn">
      </div>
    </div>
    <div class="essential-information">
      <div class="content-header">
        <div class="content-title">基本信息</div>
        <div class="function-btn">
          <a class="btn-main excel" target="_blank" :href="deliveryUrl">导出配送单</a>
          <a class="btn-main excel" target="_blank" :href="userUrl">导出消费者订单</a>
        </div>
      </div>
      <div class="essential-information-detail">
        <p class="essential-information-item">配送单号：{{detail.order_sn}}</p>
        <p class="essential-information-item essential-information-time">生成时间：{{detail.created_at}}</p>
        <p class="essential-information-item essential-information-total">配送日期：{{detail.delivery_at}}</p>
        <p class="essential-information-item essential-information-data">社区名称：{{detail.social_name}}</p>
        <p class="essential-information-item essential-information-data">团长名称：{{detail.name}}</p>
        <p class="essential-information-item essential-information-data">团长电话：{{detail.mobile}}</p>
        <p class="essential-information-item essential-information-data">社区地址：{{detail.province}} {{detail.city}} {{detail.district}} {{detail.address}}</p>
      </div>
    </div>
    <div class="list-of-commodities">
      <div class="content-header">
        <div class="content-title">商品清单</div>
      </div>
      <div class="commodities-list">
        <div class="goods-list">
          <div class="commodities-list-header com-list-box">
            <div v-for="(item, index) in commodities" :key="index" class="com-list-item">{{item}}</div>
          </div>
          <div class="big-box">
            <div v-for="(item,index) in detail.detail_list" :key="index" class="com-list-box com-list-content">
              <div class="com-list-item">{{index + 1}}</div>
              <div class="com-list-item">{{item.goods_name}}</div>
              <div class="com-list-item">{{item.goods_units}}</div>
              <div class="com-list-item">{{item.num}}</div>
              <div class="com-list-item">{{item.price}}</div>
              <div class="com-list-item">{{item.total}}</div>
            </div>
          </div>
        </div>
        <div class="total-money">预定总金额：￥{{detail.total}}</div>
      </div>
    </div>
    <div class="back">
      <div class="back-btn btn-main" @click="_back">返回</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'DISPATCHING_DETAIL'
  const TITLE = '团长配送单'
  const COMMODITIES_LIST = ['序号', '商品名称', '单位', '预定数量', '预定单价', '预定金额']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    props: {
      detail: {
        type: Object,
        default() {
          return {}
        },
        deliveryUrl: '',
        userUrl: ''
      }
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        id: null
      }
    },
    created() {
      let currentId = this.getCurrentId()
      this.id = this.$route.query.id || null
      let token = this.$storage.get('auth.currentUser', '')
      let excelParams = token ? `?access_token=${token.access_token}&current_corp=${currentId}` : ''
      this.deliveryUrl = `${process.env.VUE_APP_API}/social-shopping/api/backend/store-delivery-export/${
        this.id}${excelParams}`
      this.userUrl = `${process.env.VUE_APP_API}/social-shopping/api/backend/user-order-export/${this.id}${excelParams}`
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

  .dispatching-detail
    line-height: 1
    flex: 1
    padding-bottom: 80px
    position: relative
</style>

