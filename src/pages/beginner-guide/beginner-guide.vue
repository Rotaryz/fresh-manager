<template>
  <div class="beginner-guide">
    <base-tabs :tabList="flowData" @tab-change="tabChange" :defaultTab="activeIdx"></base-tabs>
    <template v-for="(flow,idx) in flowData">
      <flow v-show="idx === activeIdx" :key="idx" :flowImg="getImg(flow.imgName,'pic')" :flowImgWidth="flow.width" class="flow-wrap">
        <flow-item v-for="(item,key) in flow.data" :key="key" :text="item.name" :positions="item.positions" :iconSrc="getImg(item.imgName)"
                   :to="item.routerName">
        </flow-item>
      </flow>
    </template>
  </div>
</template>

<script type="text/ecmascript-6">
  import Flow from './flow'
  import FlowItem from './flowItem'

  const PAGE_NAME = 'BEGINNER_GUIDE'
  const TITLE = '新手指引'
  const PAGE_ONE_LEFT_FRIST = 155
  const PAGE_ONE_LEFT_SECEND = 291
  const PAGE_ONE_TOP_FRIST = -45
  const PAGE_ONE_TOP_SECEND = 42
  const PAGE_ONE_TOP_THIRD = 126

  const PAGE_TWO_TOP_FRIST = -45
  const PAGE_TWO_TOP_SECEND = 150
  const PAGE_TWO_LEFT_FRIST = 130
  const PAGE_TWO_LEFT_SECEND = 305
  const PAGE_TWO_LEFT_THIRD = 655
  const PAGE_TWO_LEFT_FOUR = 825
  const ICON_WIDTH = 98
  const STORE_INFO_GUIDE = [{
    name: "管理者",
    imgName: 'controller',
    positions: [-100, 174]
  }, {
    name: "创建团长",
    routerName: 'leader-list',
    url: 'home/leader-list',
    imgName: "createcolonel",
    positions: [PAGE_ONE_LEFT_FRIST, 300]
  }, {
    name: "创建采购员",
    imgName: "buyer",
    url: 'home/edit-procurement',
    routerName: 'edit-procurement',
    positions: [PAGE_ONE_LEFT_FRIST, PAGE_ONE_TOP_FRIST]
  }, {
    name: "创建供应商",
    imgName: "supplier",
    url: 'home/edit-supplier',
    routerName: 'edit-supplier',
    positions: [PAGE_ONE_LEFT_SECEND, PAGE_ONE_TOP_FRIST]
  }, {
    name: "创建单位",
    imgName: "unit",
    url: 'home/auxiliary-information',
    routerName: 'auxiliary-information',
    positions: [PAGE_ONE_LEFT_SECEND, PAGE_ONE_TOP_THIRD]
  }, {
    name: "创建分类",
    imgName: "classification",
    url: 'home/product-categories',
    routerName: 'product-categories',
    positions: [PAGE_ONE_LEFT_FRIST, PAGE_ONE_TOP_THIRD]
  }, {
    name: "创建商品",
    imgName: "commodity",
    routerName: 'edit-goods',
    positions: [475, PAGE_ONE_TOP_SECEND]
  }, {
    name: "创建活动",
    imgName: "activity",
    routerName: 'edit-outreach',
    positions: [615, PAGE_ONE_TOP_SECEND]
  }, {
    name: "编辑首页",
    imgName: "home",
    routerName: 'advertisement',
    positions: [755, PAGE_ONE_TOP_SECEND]
  }, {
    name: "线上商城",
    imgName: "mall",
    positions: [896, PAGE_ONE_TOP_SECEND]
  }, {
    name: "消费者",
    imgName: "consumer",
    positions: [1053, PAGE_ONE_TOP_SECEND]
  }]
  const OPERATION_GUIDE = [{
    name: "采购单",
    imgName: "consumerorder",
    routerName: "purchase-order",
    positions: [-45, PAGE_TWO_TOP_FRIST]
  }, {
    name: "采购任务",
    imgName: "task",
    routerName: "procurement-task",
    positions: [PAGE_TWO_LEFT_FRIST, PAGE_TWO_TOP_FRIST]
  }, {
    name: "社区订单",
    imgName: "order",
    routerName: "dispatching-list",
    positions: [PAGE_TWO_LEFT_SECEND, PAGE_TWO_TOP_FRIST]
  }, {
    name: "消费者订单",
    imgName: "consumerorder",
    routerName: "supply-list",
    positions: [PAGE_TWO_LEFT_THIRD, PAGE_TWO_TOP_FRIST]
  }, {
    name: "线上商城",
    imgName: "mall",
    positions: [PAGE_TWO_LEFT_FOUR, PAGE_TWO_TOP_FRIST]
  }, {
    name: "消费者",
    imgName: "consumer",
    positions: [996, PAGE_TWO_TOP_FRIST]
  }, {
    name: "线下门店",
    imgName: "store",
    positions: [PAGE_TWO_LEFT_FOUR, PAGE_TWO_TOP_SECEND]
  }, {
    name: "配送",
    imgName: "delivery",
    routerName: "distribution-task",
    positions: [PAGE_TWO_LEFT_THIRD, PAGE_TWO_TOP_SECEND]
  }, {
    name: "商品出库",
    imgName: "outbound",
    routerName: "product-out",
    positions: [480, PAGE_TWO_TOP_SECEND]
  }, {
    name: "仓库",
    imgName: "warehouse",
    positions: [PAGE_TWO_LEFT_SECEND, PAGE_TWO_TOP_SECEND]
  }, {
    name: "商品入库",
    imgName: "inbound",
    routerName: "product-enter",
    positions: [PAGE_TWO_LEFT_FRIST, PAGE_TWO_TOP_SECEND]
  }]
  const PAGE_TWO_TOP_FIRST = 95
  const AFTER_SALE_GUIDE = [{
    name: "运营人员",
    imgName: "operator",
    positions: [-105, PAGE_TWO_TOP_FIRST]
  }, {
    name: "退货管理",
    imgName: "returns",
    routerName: "returns-management",
    positions: [100, PAGE_TWO_TOP_FIRST]
  }, {
    name: "团长",
    imgName: "colonel",
    positions: [360, PAGE_TWO_TOP_FIRST]
  }, {
    name: "消费者",
    imgName: "consumer",
    positions: [625, PAGE_TWO_TOP_FIRST]
  }, {
    name: "红包秒退",
    imgName: "redenvelopes",
    positions: [480, -45]
  }, {
    name: "下发退款",
    imgName: "refund",
    routerName: "returns-management",
    positions: [230, 240]
  }]
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      Flow,
      FlowItem
    },
    data() {
      return {
        iconWidth: ICON_WIDTH,
        activeLine: {
          left: 0,
          lineWidth: 30,
        },
        activeIdx: 0,
        flowData: [{
          text: '完善商城信息', imgName: 'line1', width: 1048, data: STORE_INFO_GUIDE
        }, {
          text: '日常运营', imgName: 'line2', width: 1047, data: OPERATION_GUIDE
        }, {
          text: '处理售后', imgName: 'line3', width: 657, data: AFTER_SALE_GUIDE
        }]
      }
    },
    computed: {
      activeFlow() {
        let data = this.flowData[this.active]
        console.log(this.active, data)
        return data && data.data || []
      }
    },
    mounted() {

    },
    methods: {
      goTo(){
        this.$router.push({path: "/home/transaction-record"})
      },
      getImg(name, type = 'icon') {
        return `/imgs/beginner-guide/${type}-${name}@2x.png`
      },
      tabChange(val) {
        this.activeIdx = val
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .beginner-guide
    width: 100%
    display: flex;
    flex-direction: column
    align-items: center
    background-color #fff

  .flow-wrap
    margin-top 50px
</style>
