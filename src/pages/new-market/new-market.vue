<template>
  <div class="new-market detail-content">
    <div v-if="!disable" class="identification">
      <div class="identification-page">
        <img src="./icon-new_commodity@2x.png" class="identification-icon">
        <p class="identification-name">新建优惠券营销</p>
      </div>
      <div class="function-btn">
      </div>
    </div>
    <div class="msg-detail">
      <!--轮播图-->
      <div class="left-view">
        <div class="top-content">
          <div class="wrapper">
            <swiper ref="swiper" :type="marketIndex" @bannerChange="bannerChange"></swiper>
          </div>
        </div>
        <div class="bottom">
          <ul class="pointer">
            <li v-for="(item, index) in arrowArr" :key="index" class="pointer-item" :class="{'active': arrowIndex === index}" @click="changeBanner(index)"></li>
            <li class="num">{{arrowIndex + 1}}/{{arrowArr.length}}</li>
          </ul>
          <p class="text">{{arrowText[marketIndex][arrowIndex]}}</p>
        </div>
      </div>

      <div class="right-form">
        <h3 class="title">{{title}}</h3>

        <!--营销名称-->
        <div class="edit-item">
          <div class="edit-title">
            <span class="start">*</span>
            <span>营销名称</span>
          </div>
          <div class="edit-content">
            <input v-model="msg.title"
                   type="text"
                   placeholder="请输入营销名称"
                   class="edit-input"
                   maxlength="12"
                   :class="{'disable-input':disable}"
            >
            <span class="count">{{(msg.title && msg.title.length) || 0}}/12</span>
            <div :class="{'text-no-change':disable}"></div>
          </div>
        </div>

        <!--新客户配置-->
        <div v-if="marketIndex === 0" class="edit-item edit-item-new">
          <div class="edit-title">
            <span class="start">*</span>
            <span>新客户配置</span>
            <span class="tip">(二选一)</span>
          </div>
          <div class="edit-content">
            <div class="check-item">
              <span class="check-icon" :class="{'checked': newItem === 'between_days'}" @click="checkNew('between_days')"></span>
              <span style="margin-right: 10px; cursor: pointer" @click="checkNew('between_days')">满足注册时间 从</span>
              <date-picker
                :value="msg.config_json.start_day"
                class="edit-input-box"
                type="date"
                :editable="false"
                placement="bottom-end"
                placeholder="选择开始时间"
                style="width: 240px;height: 44px;border-radius: 1px"
                @click.stop
                @on-change="_getStartTime"
              ></date-picker>
              <span style="margin: 0 10px">至</span>
              <date-picker
                :value="msg.config_json.end_day"
                class="edit-input-box edit-input-right"
                type="date"
                :editable="false"
                placement="bottom-end"
                placeholder="选择结束时间"
                style="width: 240px;height: 44px"
                @on-change="_getEndTime"
              ></date-picker>
              <span style="margin: 0 10px">的客户</span>
            </div>
            <div class="check-item">
              <span class="check-icon" :class="{'checked': newItem === 'days'}" @click="checkNew('days')"></span>
              <span style="margin-right: 10px; cursor: pointer" @click="checkNew('days')">满足注册时间 前</span>
              <base-drop-down :width="120" :height="44" :select="dayDataNew" @setValue="_selectDayNew"></base-drop-down>
              <span style="margin: 0 10px">内注册的客户</span>
            </div>
            <div v-if="disable" :class="{'time-no-change':disable}"></div>
          </div>
        </div>

        <!--活跃客户配置-->
        <div v-if="marketIndex === 1" class="edit-item edit-item-activity">
          <div class="edit-title">
            <span class="start">*</span>
            <span>活跃客户配置</span>
            <span class="tip">(二选一)</span>
          </div>
          <div class="edit-content">
            <p class="text">如果设置的数字为空或为“0”，则视为没有设置，设置条件后，系统自动按照条件筛选出匹配的客户</p>
            <div class="check-item">
              <span class="check-icon" :class="{'checked': activityItem === 'order_count'}" @click="checkActivity('order_count')"></span>
              <span style="margin-right: 10px" @click="checkActivity('order_count')">满足下单次数 前</span>
              <base-drop-down :width="120" :height="44" :select="dayData" @setValue="_selectDay"></base-drop-down>
              <span style="margin: 0 10px">内大于</span>
              <input v-model="msg.config_json.order_count" type="text" :readonly="activityItem === 'order_toal'" placeholder="输入次数" class="count-input">
              <span style="margin-left: 10px">次的客户</span>
            </div>
            <div class="check-item">
              <span class="check-icon" :class="{'checked': activityItem === 'order_toal'}" @click="checkActivity('order_toal')"></span>
              <span style="margin-right: 10px" @click="checkActivity('order_toal')">满足订单金额 前</span>
              <base-drop-down :width="120" :height="44" :select="dayData2" @setValue="_selectDay2"></base-drop-down>
              <span style="margin: 0 10px">内大于</span>
              <input v-model="msg.config_json.order_toal" type="text" :readonly="activityItem === 'order_count'" placeholder="输入金额" class="count-input">
              <span style="margin-left: 10px">元的客户</span>
            </div>
            <div v-if="disable" :class="{'day-no-change':disable}"></div>
          </div>
        </div>

        <!--沉睡客户配置-->
        <div v-if="false" class="edit-item">
          <div class="edit-title">
            <span class="start">*</span>
            <span>沉睡客户配置</span>
          </div>
          <div class="edit-content no-wrap">
            <span style="margin-right: 10px">满足 前</span>
            <base-drop-down :width="120" :height="44" :select="dayData" @setValue="_selectDay"></base-drop-down>
            <span style="margin-left: 10px">内无下单记录的客户</span>
          </div>
        </div>

        <!--选择优惠券-->
        <div class="edit-item  edit-list-item">
          <div class="edit-title">
            <span class="start">*</span>
            <span>选择优惠券</span>
          </div>
          <div class="edit-content flex">
            <div class="add-btn hand" :class="{'disable': disable}" @click="_showCouponModal">选择<img class="icon" src="./icon-add@2x.png" alt=""></div>

            <div v-if="selectCouponList.length" class="edit-list-box">
              <div class="list-title" :class="{'no-line': selectCouponList.length === 0}">
                <div v-for="(item, index) in selectCouponTitle" :key="index" class="list-title-item" :style="{flex: item.flex}">{{item.name}}</div>

              </div>
              <div>
                <div v-for="(item, index) in selectCouponList" :key="index" class="list">
                  <div v-for="(val, ind) in selectCouponTitle" :key="ind" class="list-item" :style="{flex: val.flex}">
                    <div v-if="val.value === 'time'" class="main">
                      <p>{{item.start_at}}</p>
                      <p>{{item.end_at}}</p>
                    </div>
                    <p v-else-if="val.value === ''" class="handle" :class="{'list-operation-disable': disable}" @click="showConfirm('coupon', index, item)">删除</p>
                    <p v-else-if="val.value === 'denomination'">{{item[val.value]}}{{+item.preferential_type === 1 ? '折' : '元'}}</p>
                    <p v-else class="main">{{item[val.value]}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--添加团长-->
        <div v-if="marketIndex === 3" class="edit-item edit-list-item">
          <div class="edit-title">
            <span class="start">*</span>
            <span>添加团长</span>
          </div>
          <div class="edit-content flex">
            <div class="add-btn hand" :class="{'disable': disable}" @click="_showGroupModal">添加<img class="icon" src="./icon-add@2x.png" alt=""></div>

            <div v-if="selectGroupList.length" class="edit-list-box">
              <div class="list-title" :class="{'no-line': selectGroupList.length === 0}">
                <div v-for="(item, index) in selectGroupTitle" :key="index" class="list-title-item" :style="{flex: item.flex}">{{item.name}}</div>

              </div>
              <div>
                <div v-for="(item, index) in selectGroupList" :key="index" class="list">
                  <div v-for="(val, ind) in selectGroupTitle" :key="ind" class="list-item" :style="{flex: val.flex}">
                    <div v-if="val.value === 'time'" class="main">
                      <p>{{item.start_at}}</p>
                      <p>{{item.end_at}}</p>
                    </div>
                    <p v-else-if="val.value === 'number'">
                      <input v-if="!disable" v-model="item[val.value]" type="text" class="input-count">
                      <span v-else>{{item.total_stock}}</span>
                    </p>
                    <p v-else-if="val.value === ''" class="handle" :class="{'list-operation-disable': disable}" @click="showConfirm('group', index, item)">删除</p>
                    <p v-else class="main">{{item[val.value]}}</p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <default-confirm ref="confirm" @confirm="_delItem"></default-confirm>
    <div class="back">
      <div :class="{'btn-disable': disable}" class="back-btn back-submit hand" @click="_saveActivity">保存</div>
      <div class="back-cancel back-btn hand" @click="_back">取消</div>
    </div>

    <!-- 选择优惠券弹窗-->
    <default-modal ref="couponModal">
      <div slot="content" class="shade-box">
        <div class="shade-header">
          <div class="shade-title">选择优惠券</div>
          <span class="close hand" @click="_cancelModal"></span>
        </div>
        <!--搜索-->
        <div class="shade-tab">
          <div class="tab-item">
            <base-search ref="couponSearch" placeHolder="请输入优惠券名称" @search="_searchData"></base-search>
          </div>
        </div>
        <!--列表-->
        <div class="group-content">
          <div class="title">
            <span v-for="(item, index) in couponTitle" :key="index" class="title-item" :style="{flex: item.flex}">{{item.name}}</span>
          </div>
          <div class="outreach-group-list">
            <div v-for="(item, index) in couponList" :key="index" class="group-item" @click="_selectCoupon(item, index)">
              <div v-for="(val, ind) in couponTitle" :key="ind" class="title-item" :style="{flex: val.flex}">
                <span v-if="ind === 0" class="radio" :class="{'checked': (couponCheckItem.id ? (item.id === couponCheckItem.id) : (item.id === couponSelectItem.id))}"></span>
                <div v-else-if="val.value === 'time'" class="main">
                  <p>{{item.start_at}}</p>
                  <p>{{item.end_at}}</p>
                </div>
                <p v-else-if="val.value === 'denomination'">{{item[val.value]}}{{+item.preferential_type === 1 ? '折' : '元'}}</p>
                <span v-else class="title-item">{{item[val.value]}}</span>
              </div>
            </div>
          </div>
        </div>
        <!--翻页器-->
        <div class="page-box">
          <base-pagination ref="paginationCoupon" :pageDetail="couponPage" @addPage="_getMoreCoupon"></base-pagination>
        </div>
        <div class="back">
          <div class="back-btn back-submit hand" @click="_additionCoupon">确定</div>
          <div class="back-cancel back-btn hand" @click="_cancelModal">取消</div>
        </div>
      </div>
    </default-modal>

    <!-- 选择团长弹窗-->
    <default-modal ref="groupModal">
      <div slot="content" class="shade-box">
        <div class="shade-header">
          <div class="shade-title">选择团长</div>
          <span class="close hand" @click="_cancelModal"></span>
        </div>
        <!--搜索-->
        <div class="shade-tab">
          <div class="tab-item">
            <base-search ref="groupSearch" placeHolder="请输入团长名称或账号" @search="_searchData"></base-search>
          </div>
        </div>
        <!--列表-->
        <div class="group-content">
          <div class="title">
            <span v-for="(item, index) in groupTitle" :key="index" class="title-item" :style="{flex: item.flex}">{{item.name}}</span>
          </div>
          <div class="outreach-group-list">
            <div v-for="(item, index) in groupList" :key="item.id" class="group-item" @click="_selectGroup(item, index)">
              <span v-for="(val, ind) in groupTitle" :key="val.name" class="title-item" :style="{flex: val.flex}">
                <span v-if="ind === 0" :class="['check',{'checked': item.checked}, {'right': item.right}]"></span>
                <span v-else class="title-item">{{item[val.value]}}</span>
              </span>
            </div>
          </div>
        </div>
        <!--翻页器-->
        <div class="page-box">
          <base-pagination ref="paginationGroup" :pageDetail="groupPage" @addPage="_getMoreGroup"></base-pagination>
        </div>
        <div class="back">
          <div class="back-btn back-submit hand" @click="_additionGroup">确定</div>
          <div class="back-cancel back-btn hand" @click="_cancelModal">取消</div>
        </div>
      </div>
    </default-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import Swiper from './swiper/swiper'
  import {marketComputed, marketMethods} from '@state/helpers'
  import {DatePicker} from 'iview'
  import API from '@api'
  import _ from 'lodash'

  const PAGE_NAME = 'NEW_MARKET'
  const TITLE = '新建查看优惠券营销'
  const MONEYREG = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
  const COUNTREG = /^[1-9]\d*$/
  const TYPE = ['new_customer', 'active_customer', 'sleeping_customer', 'share_coupon']
  // const WAY = ['between_days', 'days', 'order_count', 'order_toal']
  const SELECT_COUPON_TITLE = [
    {name: '优惠券名称', flex: 1.4, value: 'coupon_name'},
    {name: '类型', flex: 1, value: 'preferential_str'},
    {name: '面值', flex: 1, value: 'denomination'},
    {name: '剩余', flex: 1, value: 'usable_stock'},
    {name: '有效期', flex: 1.2, value: 'time'},
    {name: '操作', flex: 0.4, value: ''},
  ]
  const SELECT_GROUP_TITLE = [
    {name: '团长帐号', flex: 1, value: 'mobile'},
    {name: '团长名称', flex: 1, value: 'name'},
    {name: '社区', flex: 1.4, value: 'social_name'},
    {name: '券数量', flex: 1, value: 'number'},
    {name: '操作', flex: 0.4, value: ''}
  ]
  const GROUP_TITLE = [
    {name: '选择', flex: 0.4, value: ''},
    {name: '团长帐号', flex: 1, value: 'mobile'},
    {name: '团长名称', flex: 1, value: 'name'},
    {name: '社区名称', flex: 1.2, value: 'social_name'},
    {name: '社区地址', flex: 2, value: 'address'},
  ]
  const COUPON_TITLE = [
    {name: '选择', flex: 0.4, value: ''},
    {name: '优惠券名称', flex: 1.8, value: 'coupon_name'},
    {name: '类型', flex: 1, value: 'preferential_str'},
    {name: '面值', flex: 1, value: 'denomination'},
    {name: '剩余数量', flex: 1, value: 'usable_stock'},
    {name: '有效期', flex: 1, value: 'time'},
  ]
  const ARROW_TEXT = [
    ['新客户打开小程序弹出优惠券', '客户商城选购商品', '提交订单立减金额'],
    ['微信推送消息', '点击消息进入领券页领取优惠券', '客户商城选购商品', '提交订单立减金额'],
    ['新客户打开小程序弹出优惠券', '客户商城选购商品', '提交订单立减金额'],
    ['团长打开小区管理优惠券营销转发优惠券', '选择微信聊天列表发送', '点击链接进入领券页领取优惠券', '领取成功点击去使用跳转商城', '客户商城选购商品', '提交订单立减金额']
  ]
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultModal,
      DefaultConfirm,
      DatePicker,
      Swiper
    },
    data() {
      return {
        couponTitle: COUPON_TITLE, // 优惠券弹窗title
        groupTitle: GROUP_TITLE, // 团长弹窗title
        selectCouponTitle: SELECT_COUPON_TITLE, // 已选优惠券弹窗title
        selectGroupTitle: SELECT_GROUP_TITLE, // 已选团长title
        selectGroupList: [], // 已选团长列表
        selectCouponList: [], // 已选优惠券列表
        groupList: [], // 弹窗团长列表
        couponList: [], // 弹窗优惠券列表
        page: 1,
        marketIndex: 0,
        groupPage: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        couponPage: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        msg: {
          type: 1, // 1新客户2活跃客户3沉睡4发放优惠券
          config_json: {},
          shop_coupons: []
        },
        arrowArr: [],
        arrowIndex: 0,
        arrowText: ARROW_TEXT,
        groupSelectItem: [],
        couponSelectItem: {},
        couponCheckItem: {},
        title: '',
        dayData: {
          check: false,
          show: false,
          content: '3天',
          type: 'default',
          data: [{name: '1天'}, {name: '3天', id: 3}, {name: '5天', id: 5}, {name: '7天', id: 7}, {name: '15天', id: 15}, {name: '30天', id: 30}] // 格式：{title: '55'}}
        },
        dayData2: {
          check: false,
          show: false,
          content: '3天',
          type: 'default',
          data:  [{name: '1天'}, {name: '3天', id: 3}, {name: '5天', id: 5}, {name: '7天', id: 7}, {name: '15天', id: 15}, {name: '30天', id: 30}]  // 格式：{title: '55'}}
        },
        dayDataNew: {
          check: false,
          show: false,
          content: '3天',
          type: 'default',
          data:  [{name: '1天'}, {name: '3天', id: 3}, {name: '5天', id: 5}, {name: '7天', id: 7}, {name: '15天', id: 15}, {name: '30天', id: 30}] // 格式：{title: '55'}}
        },
        count: '',
        activityItem: 'order_count', // 活跃客户配置
        newItem: 'between_days', // 新客户配置
        willDelItem: {},
        confirmType: '',
        modalType: '',
        type: '',
        disable: false,
        currentItem: ''
      }
    },
    computed: {
      ...marketComputed,
      testName() { // 活动名称
        return this.msg.title
      },
      testNewStartTime() {
        if (+this.marketIndex === 0) {
          return (this.msg.config_json.way === 'between_days') ? this.msg.config_json.start_day : true
        } else {
          return true
        }
      },
      testNewEndTime() {
        if (+this.marketIndex === 0) {
          return (this.msg.config_json.way === 'between_days') ? this.msg.config_json.end_day : true
        } else {
          return true
        }
      },
      testNewEndTimeReg() { // 结束时间规则判断
        if (+this.marketIndex === 0  && this.msg.config_json.way === 'between_days') {
          return Date.parse(this.msg.config_json.end_day + ' 00:00') > Date.parse('' + this.msg.config_json.start_day + ' 00:00')
        } else {
          return true
        }
      },
      testActivityCount() {
        if (+this.marketIndex === 1) {
          return (this.msg.config_json.way === 'order_count') ? this.msg.config_json.order_count : true
        } else {
          return true
        }
      },
      testActivityCountReg() {
        if (+this.marketIndex === 1) {
          return (this.msg.config_json.way === 'order_count') ? COUNTREG.test(this.msg.config_json.order_count) : true
        } else {
          return true
        }
      },
      testActivityMoney() {
        if (+this.marketIndex === 1) {
          return (this.msg.config_json.way === 'order_toal') ? this.msg.config_json.order_toal : true
        } else {
          return true
        }
      },
      testActivityMoneyReg() {
        if (+this.marketIndex === 1) {
          return (this.msg.config_json.way === 'order_toal') ? MONEYREG.test(this.msg.config_json.order_toal) : true
        } else {
          return true
        }
      },
      testCouponList() {
        let length = this.selectCouponList.length
        return length
      },
      testGroupList() {
        return (+this.marketIndex === 3) ? this.selectGroupList.length : true
      },
      testGroupCount() {
        let result = this.selectGroupList.every(item => {
          return item.number > 0 && COUNTREG.test(item.number)
        })
        return result
      }
    },
    watch: {
      marketDetail: {
        handler(news) {
          let id = this.$route.query.id || null
          if (id && news.config_json) {
            let obj = _.cloneDeep(news)
            console.log(obj, 'market')
            this.selectCouponList[0] = obj.coupon
            this.selectCouponList[0].start_at = this.selectCouponList[0].start_at.split(' ')[0]
            this.selectCouponList[0].end_at = this.selectCouponList[0].end_at.split(' ')[0]
            this.selectGroupList = obj.shop_coupon.map(item => {
              return {
                total_stock: item.total_stock,
                mobile: item.shop && item.shop.mobile,
                name: item.shop && item.shop.name,
                social_name: item.shop && item.shop.social_name
              }
            })
            this.msg = obj
            this.msg.config_json = JSON.parse(obj.config_json)
            switch (obj.config_json.way) {
            case 'days':
              this.newItem = obj.config_json.way
              this.dayDataNew.content = obj.config_json.days + '天'
              break
            case 'order_count':
              this.activityItem = obj.config_json.way
              this.dayData.content = obj.config_json.days + '天'
              this.dayData2.content = 3 + '天'
              break
            case 'order_toal':
              this.activityItem = obj.config_json.way
              this.dayData2.content = obj.config_json.days + '天'
              this.dayData.content = 3 + '天'
              break
            default:
              this.newItem = obj.config_json.way
            }
          }
        },
        immediate: true
      }
    },
    beforeCreate() {
      this.id = this.$route.query.id || null
      if(this.$route.query.id) {
        this.$store.commit('global/SET_CURRENT_TITLES', ['商城', '营销', '优惠券营销', '查看优惠券营销'])
      } else {
        this.$store.commit('global/SET_CURRENT_TITLES', ['商城', '营销', '优惠券营销', '新建优惠券营销'])
      }
    },
    created() {
      this.marketIndex = +this.$route.query.index || 0
      this.type = this.$route.query.id || ''
      switch(this.marketIndex) {
      case 0:
        this.msg.type = 1
        this.type || (this.msg.config_json.way = 'between_days')
        this.arrowArr = new Array(3).fill(1)
        this.title = '新客户规则设置'
        this.type || this._getCouponList()
        break
      case 1:
        this.msg.type = 2
        this.msg.config_json.way = 'order_count'
        this.msg.config_json.days = 3
        this.arrowArr = new Array(4).fill(1)
        this.title = '活跃客户规则设置'
        this.type || this._getCouponList()
        break
      case 2:
        this.msg.type = 3
        this.msg.config_json.way = 'days'
        this.msg.config_json.days = 6
        this.arrowArr = new Array(3).fill(1)
        this.title = '沉睡客户规则设置'
        this.type || this._getCouponList()
        break
      case 3:
        this.msg.type = 4
        this.arrowArr = new Array(6).fill(1)
        this.title = '发券规则设置'
        this.type || this._getCouponList()
        this.type || this._getGroupList()
      }
      this.disable = this.$route.query.id
    },
    async mounted() {
    },
    methods: {
      ...marketMethods,
      bannerChange(index) {
        this.arrowIndex = index
      },
      changeBanner(index) {
        this.arrowIndex = index
        this.$refs.swiper._changeBanner(index)
      },
      // 下拉选择
      _selectDay(item) {
        this.msg.config_json.days = item.id
      },
      _selectDay2(item) {
        this.msg.config_json.days = item.id
      },
      _selectDayNew(item) {
        this.msg.config_json.days = item.id
      },
      // 开始结束时间
      _getStartTime(time) {
        this.msg.config_json.start_day = time
        this.msg = JSON.parse(JSON.stringify(this.msg))
      },
      _getEndTime(time) {
        this.msg.config_json.end_day = time
        this.msg = JSON.parse(JSON.stringify(this.msg))
      },
      // 选择配置
      checkNew(str) {
        if (this.disable) return
        this.$set(this.msg.config_json, 'way', str)
        this.newItem = str
        if (str === 'days') {
          this.msg.config_json.days = 3
        }
      },
      checkActivity(str) {
        this.$set(this.msg.config_json, 'way', str)
        this.activityItem = str
      },
      // 删除列表时弹窗
      showConfirm(type, index, item) {
        if (this.disable) return
        this.$refs.confirm.show(`确定删除此${type === 'coupon' ? '优惠券' : '团长'}吗？`)
        this.confirmType = type
        this.willDelItem = index
        this.currentItem = item
      },
      // 确定删除
      _delItem() {
        if (this.confirmType === 'coupon') {
          this.selectCouponList.splice(this.willDelItem, 1)
          this.couponSelectItem = {}
          this.couponCheckItem = {}
        } else {
          this.selectGroupList.splice(this.willDelItem, 1)
          this.groupSelectItem.splice(this.willDelItem, 1)
          this.groupList.map(item => {
            if (item.id === this.currentItem.id) {
              item.right = false
              item.checked = false
            }
          })
        }
      },
      _back() {
        this.$router.back()
      },
      // 获取优惠券列表、团长列表
      async _getGroupList() {
        let res = await API.Outreach.getGroupList({
          keyword: this.keyword,
          limit: 6,
          page: this.page
        })
        if (res.error !== this.$ERR_OK) {
          this.$toast.show(res.message)
          return
        }
        this.$loading.hide()
        this.groupPage = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        this.groupList = res.data.map(item => {
          item.checked = this.selectGroupList.some(val => {
            return val.id === item.id
          })
        })
        this.groupList = res.data
      },
      _getCouponList() {
        let data = {
          coupon_name: this.keyword,
          page: this.page,
          limit: 6,
          status: 1
        }
        API.Coupon.getCouponList(data, false)
          .then(res => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            this.couponPage = {
              total: res.meta.total,
              per_page: res.meta.per_page,
              total_page: res.meta.last_page
            }
            this.couponList = res.data
          })
      },
      // 弹窗
      _showCouponModal() {
        if (this.disable) return
        this.modalType = 'coupon'
        this.$refs.couponModal.showModal()
      },
      _showGroupModal() {
        if (this.disable) return
        this.groupList = this.groupList.map(item => {
          let index = this.selectGroupList.findIndex(val => item.id === val.id)
          if (index > -1) {
            item.checked = true
          }
          return item
        })
        this.$refs.groupModal.showModal()
      },
      // 搜索
      async _searchData(text) {
        this.keyword = text
        this.page = 1
        if (this.modalType === 'coupon') {
          this.$refs.paginationCoupon.beginPage()
          await this._getCouponList()
        } else {
          this.$refs.paginationGroup.beginPage()
          await this._getGroupList()
        }
      },
      // 初始化数据
      _initData() {
        this.page = 1
        this.keyword = ''
        this.modalType = ''
        this.couponCheckItem = {}
        this.$refs.paginationGroup && this.$refs.paginationGroup.beginPage()
        this.$refs.paginationCoupon && this.$refs.paginationCoupon.beginPage()
      },
      // 统一用一个关闭弹窗方法
      _cancelModal() {
        this._initData()
        this.$refs.couponModal && this.$refs.couponModal.hideModal()
        this.$refs.groupModal && this.$refs.groupModal.hideModal()
      },
      // 选中列表某一项
      _selectGroup(item, index) {
        if (item.right) return
        if (item.checked) {
          this.groupList = this.groupList.map((item, ind) => {
            index === ind && (item.checked = false)
            return item
          })
          let idx = this.groupSelectItem.findIndex((items) => items.id === item.id)
          idx > -1 && this.groupSelectItem.splice(idx, 1)
        } else {
          this.groupList = this.groupList.map((item, ind) => {
            index === ind && (item.checked = true)
            return item
          })
          this.groupSelectItem.push(item)
        }
      },
      _selectCoupon(item, index) {
        this.couponCheckItem = item
      },
      // 弹窗保存
      _additionGroup() {
        this.selectGroupList = [...this.groupSelectItem]
        this.groupList = this.groupList.map(item => {
          item.checked && (item.right = true)
          return item
        })
        this._cancelModal()
      },
      _additionCoupon() {
        this.couponSelectItem = this.couponCheckItem
        this.selectCouponList[0] = this.couponCheckItem
        this._cancelModal()
      },
      // 翻页
      async _getMoreGroup(page) {
        this.page = page
        if (this.modalType === 'coupon') {
          await this._getCouponList()
        } else {
          await this._getGroupList()
        }
      },
      async _getMoreCoupon(page) {
        this.page = page
        if (this.modalType === 'coupon') {
          await this._getCouponList()
        } else {
          await this._getGroupList()
        }
      },
      // 保存优惠券数据
      _saveActivity() {
        if (this.id) return
        if (this.disable || this.isSubmit) return
        let checkForm = this.checkForm()
        if (!checkForm) return
        this.isSubmit = true
        this.msg.coupon_id = this.couponSelectItem.id
        switch (+this.marketIndex) {
        case 0:
          if (this.msg.config_json.way === 'between_days') {
            delete this.msg.config_json.days
          } else {
            delete this.msg.config_json.start_day
            delete this.msg.config_json.end_day
          }
          break
        case 1:
          if (this.msg.config_json.way === 'order_count') {
            delete this.msg.config_json.order_toal
          } else {
            delete this.msg.config_json.order_count
          }
          break
        case 3:
          this.msg.shop_coupons = this.selectGroupList.map(item => {
            return {
              shop_id: item.id,
              number: item.number
            }
          })
          break
        }
        this.msg.config_json.type_str = TYPE[this.marketIndex]
        API.Market.storeMarket(this.msg, true)
          .then(res => {
            this.$loading.hide()
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              this.isSubmit = false
              return
            }

            this.$toast.show('保存成功')
            setTimeout(() => {
              this._back()
              this.isSubmit = false
            }, 1000)

          })
      },
      // 验证表单
      checkForm() {
        let arr = [
          {value: this.testName, txt: '请输入营销名称'},
          {value: this.testNewStartTime, txt: '请选择开始时间'},
          {value: this.testNewEndTime, txt: '请选择结束时间'},
          {value: this.testNewEndTimeReg, txt: '结束时间必须大于开始时间'},
          {value: this.testActivityCount, txt: '请输入满足下单次数'},
          {value: this.testActivityCountReg, txt: '请输入正确的满足下单次数'},
          {value: this.testActivityMoney, txt: '请输入满足订单金额'},
          {value: this.testActivityMoneyReg, txt: '请输入正确的满足订单金额'},
          {value: this.testCouponList, txt: '请选择优惠券'},
          {value: this.testGroupList, txt: '请选择团长'},
          {value: this.testGroupCount, txt: '请输入团长优惠券发放数量'}
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
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/detail"
  ::-webkit-input-placeholder{
    font-size: 14px
    font-family: $font-family-regular
    color: #ACACAC
  }
  .new-market
    padding-bottom: 20px
    position: relative
    flex: 1
    font-size: $font-size-14
    color: #333
    font-family: $font-family-regular
  .msg-detail
    display: flex
  /*左边轮播图*/
  .left-view
    margin: 40px 80px 14px
    width: 380px
    height: 716px
    .top-content
      height: 626px
      background: url(./pic-model@2x.png) no-repeat
      background-size: 100% 100%
      overflow: hidden

    .wrapper
      width: 336px
      height: 536px
      overflow: hidden
      margin: 91px auto 0
    .wrapper-box
      width: 100%
      height: 100%
      .step
        background-size: 100% 100%
        width: 100%
        height: 100%
    .bottom
      height: 90px
      border-radius: 0 0 8px 8px
      padding: 22px 20px 18px
      box-sizing: border-box
      border: 2px solid #F3F3F3
      .pointer
        width: 100%
        height: 16px
        .pointer-item
          width: 16px
          height: 16px
          background: #E3E3E3
          float: left
          margin-right: 10px
          border-radius: 50%
          transition: all 0.3s
        .num
          color: #666
          float: right
          height: 16px
          line-height: 16px
        .active
          background: $color-main
      .text
        color: #333
        margin-top: 16px
  /*右边表单*/
  .right-form
    flex: 1
    padding: 20px
    .title
      font-size: $font-size-16
      position: relative
      padding-bottom: 10px
      padding-left: 12px
      margin-bottom: 24px
      border-bottom: 1px solid $color-line
      &:before
        content: ""
        width: 3px
        height: 16px
        background: $color-main
        position: absolute
        left: 0
        top: 4px
    .edit-item
      display: flex
      align-items: center
      margin-bottom: 38px
      .edit-title
        text-align: right
        width: 94px
        .start
          display: inline-block
          color: #F52424
        .tip
          display: block
          font-size: $font-size-12
          color: $color-text-assist
      .edit-content
        margin-left: 40px
        position: relative
        .edit-input
          font-size: $font-size-14
          padding: 0 14px
          border-radius: 1px
          width: 400px
          height: 44px
          line-height: 44px
          display: flex
          align-items: center
          justify-content: space-between
          border: 1px solid $color-line
          transition: all 0.3s
          &:hover
            border-color: #ACACAC
          &:focus
            border-color: $color-main
        .disable-input
          background: #F5F5F5
          color: #ACACAC
        .count
          color: $color-text-assist
          position: absolute
          right: 10px
          col-center()
        .time-no-change,.text-no-change,.day-no-change
          position: absolute
          left: 0
          top: 0
          width: 400px
          height: 44px
          z-index: 100
        .text-no-change
          cursor: not-allowed
        .time-no-change
          height: 110px
          width: 660px
        .day-no-change
          top: 40px
          height: 110px
          width: 518px
        .add-btn
          box-sizing: border-box
          height: 32px
          width: 108px
          color: #4DBD65
          transition: all 0.3s
          border-radius: 1px
          border: 1px solid $color-main
          display: flex
          align-items: center
          justify-content: center
          .icon
            width: 10px
            height: 10px
            margin-left: 5px
            object-fit: cover
        .disable
          cursor: not-allowed
        .edit-list-box
          margin-top: 20px
          border: 1px solid $color-line
          .list-title
            background: #F5F7FA
            height: 45px
            line-height: 45px
            padding: 0 20px
            display: flex
            border-bottom: 1px solid $color-line
            .list-title-item
              padding-right: 20px
              &:last-child
                padding-right: 0
          .no-line
            border-bottom: 0
          .list
            height: 60px
            line-height: 60px
            padding: 0 20px
            display: flex
            &:nth-child(2n)
              background: #F5F7FA
            .list-item
              display: flex
              align-items: center
              overflow: hidden
              padding-right: 20px
              &:last-child
                padding-right: 0
              .main
                line-height: 20px
                overflow: hidden
                white-space: nowrap
                text-overflow: ellipsis
              .input-count
                width: 90px
                height: 34px
                padding-left: 15px
                box-sizing: border-box
                border: 1px solid $color-line
                line-height: 34px
              .handle
                color: #4d77bd
                cursor: pointer
                &:hover
                  color: #06397e
              .list-operation-disable
                cursor: not-allowed
        .text
          color: $color-text-assist
          margin-bottom: 20px
        .check-item
          display: flex
          margin-bottom: 20px
          align-items: center
          cursor: pointer
          .check-icon
            width: 16px
            height: 16px
            border: 1px solid #E1E1E1
            border-radius: 50%
            margin-right: 10px
            transition: all 0.3s
            display: flex
            justify-content: center
            align-items: center
            &:before
              content: ""
              display: block
              width: 8px
              height: 8px
              border-radius: 50%
              background: #4DBD65
              opacity: 0
              transition: all 0.3s
          .checked
            border-color: #4DBD65
            &:before
              opacity: 1
          .count-input
            width: 120px
            height: 43px
            line-height: 43px
            padding: 0 10px
            border: 1px solid $color-line
            box-sizing: border-box
        .check-item:last-child
          margin-bottom: 0
      .flex
        flex: 1
      .no-wrap
        display: flex
        align-items: center
    .edit-list-item
      align-items: flex-start
      .edit-title
        margin-top: 4px
    .edit-item-activity
      align-items: flex-start
    .edit-item-new
      align-items: flex-start
      .edit-title
        margin-top: 11px
    .bottom
      background: #fff
  //  弹窗
  .shade-box
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
    border-radius: 1px
    background: $color-white
    height: 687px
    max-width: 1000px
    width: 1000px
    position: relative
    overflow-x: hidden
    overflow-y: auto
    flex-wrap: wrap
    .shade-header
      display: flex
      align-items: center
      justify-content: space-between
      height: 60.5px
      box-sizing: border-box
      padding: 0 20px
      border-bottom: 0.5px solid $color-line
      .shade-title
        color: $color-text-main
        font-family: $font-family-medium
        font-size: $font-size-16
      .close
        icon-image('icon-close')
        width: 16px
        height: @width
        transition: all 0.3s
        &:hover
          transform: scale(1.3)
    .back
      position: absolute
      left: 0
      right: 0
      bottom: 0
      border-top: 1px solid $color-line
    /*小弹窗盒子*/
    .default-modal-small
      position: absolute
      width: 100%
      height: 100%
      background: rgba(0, 0, 0, 0.50)
      top: 0
      bottom: 0
      right: 0
      z-index: 10
      layout()
      justify-content: center
      align-items: center
      .model-active
        animation: layerFadeIn .3s
      .model-un-active
        animation: hideFadeIn .4s
  /*选择商品样式*/
  .shade-tab
    height: 67.5px
    align-items: center
    padding: 0 20px
    box-sizing: border-box
    display: flex
    .tab-item
      margin-right: 10px
  .group-content
    border-radius: 1px
    border: 1px solid $color-line
    margin: 0 20px
    height: 407px
    .title
      display: flex
      height: 45px
      line-height: 45px
      font-family: $font-family-regular
      background: #F5F7FA
      border-bottom: 1px solid #E9ECEE
      align-items: center
      padding: 0 20px
      .title-item
        display: -webkit-box
        overflow: hidden
        -webkit-line-clamp: 2
        -webkit-box-orient: vertical
        padding-right: 20px
    .outreach-group-list
      font-size: $font-size-14
      color: #333
      font-family: $font-family-regular
      .group-item
        height: 60px
        line-height: 18px
        display: flex
        align-items: center
        border-bottom: 1px solid #E9ECEE
        padding: 0 20px
        cursor: pointer
        &:nth-child(2n)
          background: #F5F7FA
        &:last-child
          border-bottom: 0
        &:first-child
          border-bottom: 1px solid #E9ECEE
        .radio
          width: 16px
          height: 16px
          border: 1px solid #E1E1E1
          border-radius: 50%
          transition: all 0.3s
          display: flex
          justify-content: center
          align-items: center
          &:before
            content: ""
            display: block
            width: 8px
            height: 8px
            border-radius: 50%
            background: #4DBD65
            opacity: 0
            transition: all 0.3s
          .checked
            border-color: #4DBD65
            &:before
              opacity: 1
        .check
          width: 16px
          height: 16px
          border: 1px solid #E1E1E1
          transition: all 0.3s
          display: flex
          justify-content: center
          align-items: center
          &:before
            content: ""
            width: 14px
            height: 14px
            icon-image(icon-check)
            display: block
            opacity: 0
            transition: all 0.3s
        .checked
          border-color: #4DBD65
          &:before
            opacity: 1
        .right
          border-color: #E1E1E1
          &:before
            icon-image(icon-check_ash)
        .title-item
          padding-right: 20px
          display: block
          overflow: hidden
          span
            display: -webkit-box
            overflow: hidden
            -webkit-line-clamp: 2
            -webkit-box-orient: vertical
  .page-box
    padding: 0 20px
    box-sizing: border-box
    height: 66px
    align-items: center
    display: flex
</style>
