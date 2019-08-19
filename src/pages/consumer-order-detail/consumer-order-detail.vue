<template>
  <div class="consumer-order-detail detail-content">
    <div class="identification">
      <div class="identification-page">
        <img src="./icon-order_repair@2x.png" class="identification-icon">
        <p class="identification-name">补录订单</p>
      </div>
    </div>
    <div class="content-header">
      <div class="content-title">基本信息</div>
    </div>
    <div class="rush-time">
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          补货对象
        </div>
        <div class="edit-input-box">
          <base-drop-down :width="400" :height="40" :select="consumer" @setValue="_selectConsumer"></base-drop-down>
        </div>
      </div>
      <div v-if="+consumerType === 1" class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          会员手机号
        </div>
        <div class="edit-input-box">
          <input v-model="mobile" type="tel" placeholder="请输入" maxlength="11" class="edit-input">
        </div>
        <span class="btn-text hand" @click="fixPosition">定位社区</span>
      </div>
      <div v-if="+consumerType === 1" class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          微信昵称
        </div>
        <div class="edit-input-box">
          <span class="tip-text" :class="{'tip': nickName}">{{nickName || '输入会员手机点击定位社区'}}</span>
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          所属社区
        </div>
        <div class="edit-input-box">
          <base-drop-down
            :width="400"
            :height="40"
            :isInput="+consumerType === 2"
            :select="community"
            @changeText="_searchShop"
            @setValue="_selectCommunity"
          ></base-drop-down>
        </div>
      </div>
    </div>

    <div class="content-header">
      <div class="content-title">商品信息</div>
    </div>
    <div class="activity-box">
      <div class="activity-list">
        <div class="activity-tab">
          <div class="add-goods-btn hand" @click="_showGoods">
            <img class="icon" src="./icon-add@2x.png" alt="">
            添加商品
          </div>
          <!--<div class="remind">商品数量一共可添加({{goodsList.length}}/{{personAllBuyLimit}})个</div>-->
        </div>
        <div v-if="goodsList.length" class="rush-list-box">
          <div class="commodities-list-header com-list-box commodities-list-top">
            <div v-for="(item, index) in commodities" :key="index" class="com-list-item">{{item}}</div>
          </div>
          <div class="big-box">
            <div v-for="(item, index) in goodsList" :key="index" class="com-list-box com-list-content">
              <div class="com-list-item">{{item.name || item.goods_name}}</div>
              <div class="com-list-item">{{item.sale_unit}}</div>
              <div class="com-list-item">{{item.sale_usable_stock}}</div>
              <div class="com-list-item">
                <input
                  v-model="item.sale_num"
                  :readonly="disable"
                  type="number"
                  class="com-edit com-edit-small"
                  :class="{'red': item.is_error}"
                  @input="stockHandle(item)"
                >
              </div>
              <div class="com-list-item">
                <span :class="{'list-operation-disable': disable}" class="list-operation" @click="_showDelGoods(item, index)">删除</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!--确定取消弹窗-->
    <default-confirm ref="confirm" @confirm="_delGoods"></default-confirm>
    <default-confirm ref="tipConfirm"></default-confirm>
    <div class="back">
      <div class="back-cancel back-btn hand" @click="_back">取消</div>
      <div class="back-btn back-submit hand" @click="_saveActivity">保存</div>
    </div>
    <select-goods ref="goodsPop" @additionOne="additionOne" @batchAddition="batchAddition"></select-goods>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import SelectGoods from './select-goods/select-goods'
  import {merchantOrderComputed, merchantOrderMethods} from '@state/helpers'
  import API from '@api'
  import {objDeepCopy} from '@utils/common'

  const PAGE_NAME = 'CONSUMER_ORDER_DETAIL'
  const TITLE = '新建补录订单'

  const COMMODITIES_LIST = [
    '商品',
    '销售单位',
    '可用库存',
    '下单数量',
    '操作'
  ]

  const RATE = /^[0-9]\d*$/
  const REGPHONE = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[0-9])\d{8}$/

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultConfirm,
      SelectGoods
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        classifyIndex: 0,
        id: null,
        page: 1,
        choeesGoods: [],
        assortment: {
          check: false,
          show: false,
          content: '选择分类',
          type: 'default',
          data: [] // 格式：{title: '55'}}
        },
        secondAssortment: {
          check: false,
          show: false,
          content: '选择二级分类',
          type: 'default',
          data: [] // 格式：{title: '55'}}
        },
        goodsPage: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        consumer: {
          check: false,
          show: false,
          content: '选择补货对象',
          type: 'default',
          data: [{name: '指定消费者', id: 1}, {name: '给团长分配', id: 2}] // 格式：{title: '55'}}
        },
        community: {
          check: false,
          show: false,
          content: '选择社区',
          type: 'default',
          data: [] // 格式：{title: '55'}}
        },
        communityList: [],
        parentId: '',
        keyword: '',
        selectGoods: [], // 单次选择的商品
        selectGoodsId: [], // 所有选择的商品id
        goodsDelId: 0,
        goodsDelIndex: 0,
        // selectDelId: [],
        disable: false,
        goodsList: [],
        msg: {},
        isSubmit: false,
        activityTheme: '',
        pageConfig: {},
        consumerType: '',
        mobile: '',
        nickName: ''
      }
    },
    computed: {
      ...merchantOrderComputed,
      testConsumer() {
        return this.consumerType
      },
      testMobile() {
        if (+this.consumerType === 1) {
          return this.mobile && REGPHONE.test(this.mobile)
        }
        return true
      },
      testCommunity() {
        return this.msg.receiver_name
      },
      testGoods() {
        return this.goodsList.length
      }
    },
    watch: {
      mobile(now, old) {
        if (now !== old) {
          this._initData()
        }
      }
    },
    created() {
    },
    methods: {
      ...merchantOrderMethods,
      _initData() {
        this.msg = {}
        this.nickName = ''
        this.community.data = []
        this.communityList = []
        this.community.content = '选择社区'
      },
      _selectConsumer(item) {
        if (+this.consumerType !== +item.id) {
          this.msg = {}
          this.mobile = ''
          this.nickName = ''
          this.community.data = []
          this.communityList = []
          this.community.content = '选择社区'
          this.consumerType = item.id
        }
        if (+item.id === 2) {
          this.getCommunity()
        }
      },
      _selectCommunity(item) {
        this.msg = {
          receiver_name: item.name,
          receiver_mobile: item.mobile,
          receiver_province: item.province,
          receiver_city: item.city,
          receiver_district: item.area,
          receiver_address: item.address,
          out_buyer_id: item.out_buyer_id,
          latitude: item.latitude,
          longitude: item.longitude,
          back_tracking_obj: this.consumerType,
          out_order_sn: ''
        }
        this.nickName = item.nickname
      },
      _searchShop(text) {
        if (text.length === 0) {
          this.community.data = this.communityList
          return
        }
        let arr = []
        this.communityList.forEach((item) =>{
          if (item.name.toLowerCase().includes(text.toLowerCase())) {
            arr.push(item)
          }
        })
        this.community.data = arr
      },
      fixPosition() {
        if (!this.testMobile) {
          this.$toast.show('请输入11位的会员手机号')
          return
        }
        this._initData()
        this.getCommunity()
      },
      getCommunity() {
        API.MerchantOrder.getCommunity({mobile: this.mobile})
          .then(res => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            this.community.data = res.data
            this.communityList = res.data
            this.community.content = '选择社区'
            this.nickName = res.data[0].nickname
          })
      },
      stockHandle(item) {
        if (item.sale_num < 0) {
          item.sale_num = item.sale_num * -1
        }
        if (item.sale_num > item.sale_usable_stock && !item.is_presale) {
          item.sale_num = item.sale_usable_stock
        }
        item.is_error = 0
      },

      // 删除商品
      _showDelGoods(item, index) {
        if (this.disable) {
          return
        }
        // this.goodsDelId = item.goods_id
        this.goodsDelIndex = index
        this.$refs.confirm.show('是否确定删除该商品？')
      },
      // 删除商品弹窗
      _delGoods() {
        // let index = this.selectGoodsId.findIndex((item) => item === this.goodsDelId)

        // this.selectGoodsId.splice(this.goodsDelIndex, 1)
        this.goodsList.splice(this.goodsDelIndex, 1)
        // this.selectDelId.push(this.goodsDelId)
      },
      // 单个添加
      additionOne(item, index) {
        let isExist = false
        let obj = objDeepCopy(item)
        obj.sale_num = ''
        this.goodsList.forEach((item) => {
          if (item.goods_id === obj.goods_id) {
            isExist = true
          }
        })
        if (!isExist) {
          this.goodsList.push(obj)
        }
      },
      batchAddition(list) {
        list.forEach((item) => {
          let isExist = false
          this.goodsList.forEach((item1) => {
            if (item.goods_id * 1 === item1.goods_id * 1) {
              isExist = true
            }
          })
          if (!isExist) {
            let obj = objDeepCopy(item)
            obj.sale_num = ''
            this.goodsList.push(obj)
          }
        })
      },
      async _showGoods() {
        // if (this.disable) {
        //   return
        // }
        // await this._getGoodsList()
        // // 展示添加商品弹窗
        // this.$refs.goodsModel && this.$refs.goodsModel.showModal()
        this.$refs.goodsPop._delGoods(this.goodsList)
      },
      _hideGoods() {
        this.$refs.goodsModel.hideModal()
      },
      // 切换分类
      _setClassify(index, item) {
        this.classifyIndex = index
      },
      _back() {
        this.$router.back()
      },
      //  保存
      async _saveActivity() {
        if (this.isSubmit) return
        let checkForm = this.checkForm()
        if (!checkForm) return
        let checkGoods = this.checkGoods()
        if (!checkGoods) return
        let total = 0
        let goods = this.goodsList.map(item => {
          let totalPrice = item.trade_price * item.sale_num
          total += totalPrice
          item.total = totalPrice
          item.sale_price = item.trade_price
          item.promote = 0
          return item
        })
        this.mobile && (this.msg.customer_mobile = this.mobile)
        let data = Object.assign({}, this.msg, {goods, total})
        let res = null
        this.isSubmit = true
        res = await API.MerchantOrder.saveConsumerOrder(data, true)
        this.$loading.hide()
        if (res.error !== this.$ERR_OK) {
          this.isSubmit = false
          this.$toast.show(res.message)
          return
        }
        if (res.data) {
          // 库存不足时的反馈
          this.isSubmit = false
          this.goodsList = res.data.goods
          this.$refs.tipConfirm.show('可用库存不足，请重新输入下单数量')
        } else {
          this.$toast.show('保存成功')
          setTimeout(() => {
            this._back()
          }, 1000)
        }
      },
      checkForm() {
        let arr = [
          {value: this.testConsumer, txt: '请选择补货对象'},
          {value: this.testMobile, txt: '请输入11位的会员手机号'},
          // {value: this.testWechatName, txt: '请定位会员社区'},
          {value: this.testCommunity, txt: '请选择社区'},
          {value: this.testGoods, txt: '请选择商品'}
          // {value: this.testGoodsCount, txt: ''},
        ]
        for (let i = 0, j = arr.length; i < j; i++) {
          if (!arr[i].value) {
            this.$toast.show(arr[i].txt)
            return false
          }
          if (i === j - 1 && arr[i].value) {
            return true
          }
        }
      },
      checkGoods() {
        let result = this.goodsList.every(item => {
          !item.sale_num && this.$toast.show(`请输入“${item.name}”下单数量`)
          if (item.sale_num < 1 || !RATE.test(item.sale_num)) {
            this.$toast.show(`下单数量应为大于0的整数`)
          }
          return item.sale_num > 0 && RATE.test(item.sale_num)
        })
        return result
      },
      echangBase(item, index) {
        if (item.usable_stock > item.all_stock && !this.disable) {
          item.usable_stock = item.all_stock
          this.$forceUpdate()
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/detail"

  .consumer-order-detail
    padding-bottom: 20px
    position: relative
    flex: 1
    font-family: $font-family-regular
    font-size: $font-size-14
  .rush-time
    margin-bottom: 27px
  .edit-item
    display: flex
    color: #2A2A2A
    margin-top: 24px
    align-items: center
    position: relative
    .edit-title
      font-size: $font-size-14
      font-family: $font-family-regular
      white-space: nowrap
      text-align: right
      min-width: 84px
    .start
      display: inline-block
      margin-right: -2px
      color: #F52424
    .edit-input-box
      margin: 0 14px 0 40px
      &:nth-child(4)
        margin: 0 14px
      .edit-input
        font-size: $font-size-12
        border-radius: 2px
        padding: 0 14px
        width: 400px
        height: 40px
        display: flex
        align-items: center
        justify-content: space-between
        font-family: $font-family-regular
        color: $color-text-main
        border: 1px solid $color-line
        transition: all 0.3s
        &:hover
          border-color: #ACACAC
        &:focus
          border-color: $color-main
        .edit-time
          color: $color-text-assist
          font-family: $font-family-regular
          font-size: $font-size-12
      .disable-input
        background: #F5F5F5
        color: #ACACAC
    .edit-input-right
      margin-left: 14px
    .tip-text
      margin-left: 2px
      line-height: 40px
      font-size: $font-size-12
      font-family: $font-family-regular
      color: $color-text-assist
    .tip
      line-height: 40px
      font-size: $font-size-12
      font-family: $font-family-regular
      color: $color-text-main
    .btn-text
      color: #4D77BD
      font-family: $font-family-regular
      font-size: $font-size-14


  .activity-tab
    margin: 24px 0
    display: flex
    align-items: center
    box-sizing: border-box
    .add-goods-btn
      box-sizing: border-box
      height: 32px
      line-height: 32px
      width: 108px
      color: #4DBD65
      font-size: $font-size-14
      font-family: $font-family-regular
      transition: all 0.3s
      text-align: center
      border-radius: 2px
      border: 1px solid #4DBD65
      display: flex
      align-items: center
      justify-content: center
    .icon
      width: 10px
      height: 10px
      margin-right: 5px
      object-fit: cover
    .remind
      margin-left: 10px
      color: $color-text-assist
    .disable
      cursor: not-allowed


  .com-list-box .com-list-item
    &:first-child
      flex: 1.2
    &:last-child
      max-width: 98px
  //  弹窗
  .shade-box
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
    border-radius: 2px
    background: $color-white
    height: 675px
    max-width: 1000px
    width: 1000px
    position: relative
    overflow-x: hidden
    overflow-y: auto
    flex-wrap: wrap
    padding: 0 20px
    box-sizing: border-box
    .title-box
      display: flex
      box-sizing: border-box
      padding: 23px 0
      align-items: center
      justify-content: space-between
      .title
        font-size: $font-size-16
        font-family: $font-family-medium
        line-height: 1
        color: $color-text-main
      .close
        width: 12px
        height: @width
        icon-image('icon-close')
    .back
      border-top-1px($color-line)
      position: absolute
      left: 0
      right: 0
      bottom: 0
      background: $color-white
      justify-content: flex-end
      height: 70px
    /*选择商品样式*/
    .shade-tab
      height: 48px
      box-sizing: border-box
      display: flex
      .tab-item
        margin-right: 10px
    .goods-content
      border-radius: 4px
      height: 420px
      .rush-goods-list
        flex-wrap: wrap
        display: flex
      .goods-item
        box-sizing: border-box
        padding: 0 30px 0 20px
        width: 100%
        height: 60px
        display: flex
        align-items: center
        position: relative
        &:last-child
          border-bottom-1px($color-line)
        &:before
          content: ""
          pointer-events: none // 解决iphone上的点击无效Bug
          display: block
          position: absolute
          left: 0
          top: 0
          transform-origin: 0 0
          border-right: 1px solid #E9ECEE
          border-left: 1px solid #E9ECEE
          border-top: 1px solid #E9ECEE
          box-sizing border-box
          width: 200%
          height: 100%
          transform: scaleX(.5) translateZ(0)
          @media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3)
            width: 100%
            height: 300%
            transform: scaleX(1 / 3) translateZ(0)
        &:nth-child(2n - 1)
          background: #f5f7fa
        .select-icon
          margin-right: 20px
          border-radius: 1px
          border: 1px solid #e9ecee
          height: 16px
          width: 16px
          -webkit-transition: all .3s
          transition: all .3s
        .select-icon-active
          border: 1px solid transparent
          display: inline-block
          background-size: 100% 100%
          background-image: url("./icon-check@2x.png")
        .select-icon-disable
          border: 1px solid transparent
          cursor: not-allowed
          display: inline-block
          background-size: 100% 100%
          background-image: url("./icon-check_ash@2x.png")
        .goods-img
          margin-right: 10px
          width: 40px
          height: @width
          overflow: hidden
          background-repeat: no-repeat
          background-size: cover
          background-position: center
          background-color: $color-background
        .goods-msg
          flex: 1
          display: flex
          color: $color-text-main
          font-family: $font-family-regular
          justify-content: space-between
          height: 100%
          align-items: center
          .goods-name
            width: 500px
            padding-right: 20px
            no-wrap()
            .text
              width: 100%
              text-overflow: ellipsis
              overflow: hidden
              line-height: 1.4
          .goods-name, .goods-money
            line-height: 1
          .goods-money
            flex: 1
            layout(row)
            .goods-money-text
              width: 50%
          .goods-stock
            flex: 1
        .add-btn
          border-radius: 2px
          margin-left: 88px
          padding: 7px 0
          min-width: 54px
          text-align: center
        .add-btn-disable
          border-radius: 2px
          margin-left: 88px
          padding: 7px 0
          box-sizing: border-box
          text-align: center
          font-size: $font-size-14
          line-height: 1
          cursor: not-allowed
          background: $color-line
          color: $color-text-assist
          border: none
    .page-box
      box-sizing: border-box
      height: 76px
      align-items: center
      display: flex


  .com-edit
    height: 34px
    width: 93px
    border-radius: 2px
    box-sizing: border-box
    border: 1px solid $color-line
    padding-left: 10px
    transition: all 0.3s
    &::-webkit-inner-spin-button
      appearance: none
    &:hover
      border: 0.5px solid #ACACAC
    &::placeholder
      font-family: $font-family-regular
      color: $color-text-assist
    &:focus
      border-color: $color-main !important

  .com-edit-small
    width: 60px
  .red
    color: #F84E3C
</style>
