<template>
  <div class="distribution-task table">
    <base-tab-select :infoTabIndex="tabIndex" :tabStatus="tabStatus" :lineWidth="104" @getStatusTab="_changeStatusTab"></base-tab-select>
    <template v-if="tabIndex===0">
      <div class="down-content">
        <span class="down-tip">下单时间</span>
        <div class="down-item">
          <base-date-select :placeHolder="datePlaceHolder" :dateInfo="timeArr" @getTime="changeTime"></base-date-select>
        </div>
        <div class="distribution-down">
          <span class="down-tip">搜索</span>
          <div class="down-item">
            <base-search placeHolder="订单号或商户名称" :infoText="merchantFilter.keyword" @search="changeMerchantKeyword"></base-search>
          </div>
        </div>
      </div>
      <div class="table-content">
        <div class="identification">
          <div class="identification-page">
            <img :src="tabStatus[0].img" class="identification-icon">
            <p class="identification-name">{{tabStatus[0].text}}</p>
            <base-status-nav :statusList="dispatchSelect" :value="merchantFilter.status" valueKey="status" labelKey="status_str" numKey="statistic"
                             @change="setValue"
            ></base-status-nav>
          </div>
        </div>
        <div class="big-list">
          <div class="list-header list-box">
            <div v-for="(item,index) in commodities" :key="index" class="list-item" :style="{flex: item.flex}" :class="['list-item',item.class]">{{item.title}}</div>
          </div>
          <div class="list">
            <template v-if="orderList.length">
              <div v-for="(row, index) in orderList" :key="index" class="list-content list-box">
                <div v-for="item in commodities" :key="item.key" :style="{flex: item.flex}" :class="['list-item',item.class]">
                  <template v-if="item.key" name="name">
                    {{row[item.key]}}
                    <div v-if="item.key ==='type_count' && row[item.after]" class="lack-icon">
                    </div>
                  </template>
                  <template v-else name="operation">
                    <router-link class="list-operation" :to="{name:'merchant-order-detail',params:{id:row.id}}">{{item.operation}}</router-link>
                  </template>
                </div>
              </div>
            </template>
            <base-blank v-else></base-blank>
          </div>
        </div>
        <div class="pagination-box">
          <base-pagination ref="paginationMerchant" :pageDetail="pageTotal" :pagination="merchantFilter.page" @addPage="setOrderPage"></base-pagination>
        </div>
      </div>
    </template>

    <!--消费者订单-->
    <template v-if="tabIndex === 1">
      <div class="down-content">
        <span class="down-tip">下单时间</span>
        <div class="down-item">
          <base-date-select :placeHolder="datePlaceHolder" :dateInfo="timeArr" @getTime="changeTime"></base-date-select>
        </div>
        <span class="down-tip">异常状态</span>
        <div class="down-item">
          <base-drop-down :select="unusualSelect" @setValue="_selectUnusual"></base-drop-down>
        </div>
        <span class="down-tip">订单来源</span>
        <div class="down-item">
          <base-drop-down :select="sourceSelect" @setValue="_selectSource"></base-drop-down>
        </div>
        <div class="distribution-down">
          <span class="down-tip">搜索</span>
          <div class="down-item">
            <base-search placeHolder="订单号、商户名称或会员手机" :infoText="merchantFilter.keyword" @search="changeMerchantKeyword"></base-search>
          </div>
        </div>
      </div>
      <div class="table-content">
        <div class="identification">
          <div class="identification-page">
            <img :src="tabStatus[1].img" class="identification-icon">
            <p class="identification-name">{{tabStatus[1].text}}</p>
            <!--<base-status-nav :statusList="consumerStatusTab" :value="merchantFilter.status" valueKey="status" labelKey="status_str" numKey="statistic"
                             @change="setValue"
            ></base-status-nav>-->
          </div>
          <div class="function-btn">
            <router-link tag="a" to="consumer-order-detail" append class="btn-main">补录订单</router-link>
            <a target="_blank" :href="storeExcel" class="btn-main g-btn-item">导出订单</a>
          </div>
        </div>
        <div class="big-list">
          <div class="list-header list-box">
            <div v-for="(item,index) in commodities" :key="index" class="list-item" :style="{flex: item.flex}" :class="['list-item',item.class]">{{item.title}}</div>
          </div>
          <div class="list">
            <template v-if="orderList.length">
              <div v-for="(row, index) in orderList" :key="index" class="list-content list-box">
                <div v-for="item in commodities" :key="item.key" :style="{flex: item.flex}" :class="['list-item',item.class]">
                  <template v-if="item.key" name="name">
                    <div :class="{'item-dark-icon' : row[item.goodsType] * 1 === 2}">{{row[item.key]}}</div>
                    <div v-if="item.key === 'sale_num' && row.is_exception" class="unusual-icon"></div>
                    <div v-if="item.key === 'out_order_sn'" style="color:#ACACAC">{{row.created_at}}</div>
                    <div v-if="item.key === 'goods_name'">{{row.goods_sku_encoding}}</div>
                  </template>
                  <template v-else name="operation">
                    <div v-if="row.show_delete" class="list-operation" @click="showConfirm(row)">{{item.operation}}</div>
                    <div v-else class="">---</div>
                  </template>
                </div>
              </div>
            </template>
            <base-blank v-else></base-blank>
          </div>
        </div>
        <div class="pagination-box">
          <base-pagination
            ref="paginationMerchant"
            :pageDetail="pageTotal"
            :pagination="merchantFilter.page"
            @addPage="setOrderPage"
          ></base-pagination>
        </div>
      </div>
    </template>
    <default-confirm ref="delConfirm" @confirm="delConfirm"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import {authComputed, merchantOrderComputed, merchantOrderMethods} from '@state/helpers'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import API from '@api'

  const PAGE_NAME = 'MERCHANT_ORDER'
  const TITLE = '商户订单'
  const COMMODITIES_LIST = [
    {title: '下单时间', key: 'created_at', flex: 1.5},
    {title: '订单号 ', key: 'order_sn', flex: 1.5},
    {title: '商户名称', key: 'buyer_name', flex: 1},
    {title: '品类数', key: 'type_count', flex: 0.6, after: 'is_lack'},
    {title: '状态', key: 'status_str', flex: 0.6},
    // {title: '类型', key: 'type_str', flex: 0.8},
    {title: '操作', key: '', operation: '详情', flex: 1, class: 'operate'}
  ]
  const COMMODITIES_LIST2 = [
    {title: '订单号', key: 'out_order_sn', flex: 1.5},
    {title: '会员名称', key: 'nickname', flex: 1},
    {title: '会员手机号', key: 'mobile', flex: 1},
    {title: '商品', key: 'goods_name', flex: 1.2, goodsType: 'goods_type'},
    {title: '下单数量', key: 'sale_num', flex: 0.7},
    {title: '商户名称', key: 'buyer_name', flex: 1.5},
    {title: '订单来源', key: 'type_str', flex: 0.7},
    {title: '操作', key: '', operation: '删除', flex: 1, class: 'operate'}
  ]

  const ORDER_DATA = [
    {
      order_sn: '123123',
      order_name: '小李',
      mobile: '13584260103',
      goods_name: '苹果',
      type_count: '2份',
      buyer_name: '广海花园社区',
      status: '待分拣',
      order_resource: '人工补录'
    },
    {
      order_sn: '123123',
      order_name: '小李',
      mobile: '13584260103',
      goods_name: '苹果',
      type_count: '2份',
      buyer_name: '广海花园社区',
      status: '待分拣',
      order_resource: '人工补录'
    },
    {
      order_sn: '123123',
      order_name: '小李',
      mobile: '13584260103',
      goods_name: '苹果',
      type_count: '2份',
      buyer_name: '广海花园社区',
      status: '待分拣',
      order_resource: '人工补录'
    }
  ]
  const ORDERSTATUS = [
    {text: '商户订单', status: 0, img: require('./icon-order_list2@2x.png')},
    {text: '消费者订单', status: 1, img: require('./pic-zanwu@2x.png')}
  // {text: '商品汇总单', status: 1, img: require('./pic-zanwu@2x.png')}
  ]
  const ENTRY_STORE_EXPORT = '/scm/api/backend/oms/export-customer-orders'
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultConfirm
    },
    data() {
      return {
        tabStatus: ORDERSTATUS,
        commodities: COMMODITIES_LIST,
        orderData: ORDER_DATA,
        datePlaceHolder: '选择下单日期',
        orderKeyword: '',
        currentItem: {},
        unusualSelect: {
          check: false,
          show: false,
          content: '全部',
          type: 'default',
          data: [{name: '全部', status: ''}, {name: '正常', status: '0'}, {name: '异常', status: '1'}]
        },
        sourceSelect: {
          check: false,
          show: false,
          content: '全部',
          type: 'default',
          data: [{name: '全部', status: ''}, {name: '系统销售', status: '1'}, {name: '人工补录', status: '3'}]
        },
        dispatchSelect: [
          {status_str: '全部', value: '', statistic: 0},
          {status_str: '待调度', value: 0, statistic: 0},
          {status_str: '待出库', value: 1, statistic: 0},
          {status_str: '待配送', value: 2, statistic: 0},
          {status_str: '已完成', value: 3, statistic: 0}
        ],
        consumerStatusTab: [
          {status_str: '全部', status: '', statistic: 0},
          {status_str: '待分拣', status: 0, statistic: 0},
          {status_str: '待出库', status: 1, statistic: 0},
          {status_str: '代配送', status: 2, statistic: 0},
          {status_str: '已完成', status: 3, statistic: 0}
        ]
      }
    },
    computed: {
      ...merchantOrderComputed,
      ...authComputed,
      timeArr() {
        return [this.merchantFilter.start_time, this.merchantFilter.end_time]
      },
      storeExcel() {
        let currentId = this.getCurrentId()
        let data = {
          current_corp: currentId,
          current_shop: process.env.VUE_APP_CURRENT_SHOP,
          access_token: this.currentUser.access_token,
          start_time: this.merchantFilter.start_time,
          end_time: this.merchantFilter.end_time,
          keyword: this.merchantFilter.keyword,
          status: this.merchantFilter.status,
          type: this.merchantFilter.type,
          exception_status: this.merchantFilter.exception_status
        }
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        let url = process.env.VUE_APP_SCM_API + ENTRY_STORE_EXPORT + '?' + search.join('&')
        return url
      }
    },
    async created() {
      this.commodities = this.tabIndex === 0 ? COMMODITIES_LIST : COMMODITIES_LIST2
      this._getStatusData()
    },
    methods: {
      ...merchantOrderMethods,
      // 顶部 切换
      _changeStatusTab(item, index) {
        this.SET_TAB_INDEX(index)
        this.SET_MERCHANT_LIST([])
        this.commodities = index === 0 ? COMMODITIES_LIST : COMMODITIES_LIST2
        // 待调度
        this._updateMerchantOrderList({
          page: 1,
          limit: 10,
          start_time: '',
          end_time: '',
          exception_status: '',
          type: '',
          status: 0,
          keyword: ''
        })
        this.unusualSelect.content = '全部'
        this.sourceSelect.content = '全部'
      },
      _selectUnusual(item) {
        this._updateMerchantOrderList({exception_status: item.status})
      },
      _selectSource(item) {
        this._updateMerchantOrderList({type: item.status})
      },
      // 获取订单列表
      _updateMerchantOrderList(params, noUpdateStatus) {
        this.SET_PARAMS(params)
        if (!noUpdateStatus && +this.tabIndex !== 1) {
          this._getStatusData()
        }
        if (+this.tabIndex === 0) {
          this.getMerchantOrderList()
        } else {
          this.getConsumerOrderList()
        }
        if (params.page === 1) {
          this.$nextTick(function() {
            this.$refs.paginationMerchant.beginPage()
          })
        }
      },
      // 状态数据
      _getStatusData() {
        // let params = {start_time, end_time, keyword, type} = this.merchantFilter
        let params = {
          start_time: this.merchantFilter.start_time,
          end_time: this.merchantFilter.end_time,
          keyword: this.merchantFilter.keyword,
          is_parent_order: 1 // 商户合单
        }
        if (+this.tabIndex === 0) {
          API.MerchantOrder.getStausData(params).then((res) => {
            if (res.error !== this.$ERR_OK) {
              return false
            }
            this.dispatchSelect = res.data
          })
        } else {
          params.type = this.merchantFilter.type
          params.is_parent_order = 0 // 消费者订单
          API.MerchantOrder.getConsumerStatus(params).then((res) => {
            if (res.error !== this.$ERR_OK) {
              return false
            }
            this.consumerStatusTab = res.data
          })
        }
      },
      // 翻页
      setOrderPage(page) {
        this._updateMerchantOrderList({page}, true)
      },
      // 时间
      changeTime(timeArr = ['', '']) {
        this._updateMerchantOrderList({
          start_time: timeArr[0],
          end_time: timeArr[1],
          page: 1
        })
      },
      // 状态
      setValue(item) {
        this._updateMerchantOrderList({
          status: item,
          page: 1
        })
      },
      // 商户订单搜索
      changeMerchantKeyword(keyword) {
        this._updateMerchantOrderList({
          keyword,
          page: 1
        })
      },
      showConfirm(item) {
        this.currentItem = item
        this.$refs.delConfirm.show('确定删除此订单？')
      },
      delConfirm() {
        API.MerchantOrder.deleteConsumerOrder({
          out_order_sn: this.currentItem.out_order_sn,
          goods_sku_code: this.currentItem.goods_sku_code
        }).then((res) => {
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return
          }
          this.$refs.delConfirm.hide()
          this.$toast.show('删除成功')
          this.getConsumerOrderList()
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .list-operation
    text-decoration: underline

  .operate
    max-width: 50px

  .lack-icon
    width: 16px
    height: 16px
    icon-image(icon-lack)
  .unusual-icon
    width: 16px
    height: 16px
    icon-image(icon-unusual_list)

  .distribution-down
    display: flex
    align-items: center
</style>
