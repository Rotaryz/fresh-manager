<template>
  <div class="edit-market detail-content">
    <div v-if="!disable" class="identification">
      <div class="identification-page">
        <img src="./icon-new_commodity@2x.png" class="identification-icon">
        <p class="identification-name">新建优惠券营销</p>
      </div>
      <div class="function-btn">
      </div>
    </div>
    <div class="msg-detail">
      <div class="left-view">
        <div class="top-content">
          <div class="wrapper">
            <ul class="wrapper-box">
              <li class="step"></li>
            </ul>
          </div>
        </div>
        <div class="bottom">
          <ul class="pointer">
            <li v-for="(item, index) in arr" :key="index" class="pointer-item"></li>
            <li class="num">1/{{arr.length}}</li>
          </ul>
          <p class="text">团长打开小区管理优惠券营销转发优惠券</p>
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
            <input v-model="msg.coupon_name"
                   type="text"
                   placeholder="请输入营销名称"
                   class="edit-input"
                   maxlength="12"
            >
            <span class="count">{{(msg.coupon_name && msg.coupon_name.length) || 0}}/12</span>
          </div>
        </div>

        <!--新客户配置-->
        <div v-if="+marketIndex === 0" class="edit-item edit-item-new">
          <div class="edit-title">
            <span class="start">*</span>
            <span>新客户配置</span>
            <span class="tip">(二选一)</span>
          </div>
          <div class="edit-content">
            <div class="check-item" @click="checkNew(1)">
              <span class="check-icon" :class="{'checked': activityItem === 1}"></span>
              <span style="margin-right: 10px">满足注册时间 从</span>
              <date-picker
                :value="msg.start_at"
                class="edit-input-box"
                type="date"
                :editable="false"
                placement="bottom-end"
                placeholder="选择开始时间"
                style="width: 240px;height: 44px;border-radius: 1px"
                readonly
                @on-change="_getStartTime"
              ></date-picker>
              <span style="margin: 0 10px">至</span>
              <date-picker
                :value="msg.end_at"
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
            <div class="check-item" @click="checkNew(2)">
              <span class="check-icon" :class="{'checked': activityItem === 2}"></span>
              <span style="margin-right: 10px">满足注册时间 前</span>
              <base-drop-down :width="120" :height="44" :select="dayData3" @setValue="_selectDay3"></base-drop-down>
              <span style="margin: 0 10px">内注册的客户</span>
            </div>

          </div>
        </div>

        <!--活跃客户配置-->
        <div v-if="+marketIndex === 1" class="edit-item edit-item-activity">
          <div class="edit-title">
            <span class="start">*</span>
            <span>活跃客户配置</span>
            <span class="tip">(二选一)</span>
          </div>
          <div class="edit-content">
            <p class="text">如果设置的数字为空或为“0”，则视为没有设置，设置条件后，系统自动按照条件筛选出匹配的客户</p>
            <div class="check-item" @click="checkActivity(1)">
              <span class="check-icon" :class="{'checked': activityItem === 1}"></span>
              <span style="margin-right: 10px">满足下单次数 前</span>
              <base-drop-down :width="120" :height="44" :select="dayData" @setValue="_selectDay"></base-drop-down>
              <span style="margin: 0 10px">内大于</span>
              <input v-model="count" type="text" placeholder="输入次数" class="count-input">
              <span style="margin-left: 10px">次的客户</span>
            </div>
            <div class="check-item" @click="checkActivity(2)">
              <span class="check-icon" :class="{'checked': activityItem === 2}"></span>
              <span style="margin-right: 10px">满足下单次数 前</span>
              <base-drop-down :width="120" :height="44" :select="dayData2" @setValue="_selectDay"></base-drop-down>
              <span style="margin: 0 10px">内大于</span>
              <input v-model="count" type="text" placeholder="输入次数" class="count-input">
              <span style="margin-left: 10px">次的客户</span>
            </div>

          </div>
        </div>

        <!--沉睡客户配置-->
        <div v-if="+marketIndex === 2" class="edit-item">
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
          <div class="edit-content">
            <div class="add-btn hand" @click="_showCouponModal">选择<img class="icon" src="./icon-add@2x.png" alt=""></div>

            <div class="edit-list-box">
              <div class="list-title">
                <div v-for="(item, index) in selectCouponTitle" :key="index" class="list-title-item" :style="{flex: item.flex}">{{item.name}}</div>

              </div>
              <div>
                <div v-for="(item, index) in selectCouponList" :key="index" class="list">
                  <div v-for="(val, ind) in selectCouponTitle" :key="ind" class="list-item" :style="{flex: val.flex}">
                    <div v-if="val.value === 'time'" class="main">
                      <p>{{item.start_at}}</p>
                      <p>{{item.end_at}}</p>
                    </div>
                    <p v-else-if="val.value === ''" class="handle">删除</p>
                    <p v-else class="main">{{item[val.value]}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--添加团长-->
        <div v-if="+marketIndex === 3" class="edit-item edit-list-item">
          <div class="edit-title">
            <span class="start">*</span>
            <span>添加团长</span>
          </div>
          <div class="edit-content">
            <div class="add-btn hand" @click="_showGroupModal">添加<img class="icon" src="./icon-add@2x.png" alt=""></div>

            <div class="edit-list-box">
              <div class="list-title">
                <div v-for="(item, index) in selectGroupTitle" :key="index" class="list-title-item" :style="{flex: item.flex}">{{item.name}}</div>

              </div>
              <div>
                <div v-for="(item, index) in selectGroupList" :key="index" class="list">
                  <div v-for="(val, ind) in selectGroupTitle" :key="ind" class="list-item" :style="{flex: val.flex}">
                    <div v-if="val.value === 'time'" class="main">
                      <p>{{item.start_at}}</p>
                      <p>{{item.end_at}}</p>
                    </div>
                    <p v-else-if="val.value === 'count'">
                      <input v-model="item[val.value]" type="text" class="input-count">
                    </p>
                    <p v-else-if="val.value === ''" class="handle">删除</p>
                    <p v-else class="main">{{item[val.value]}}</p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <default-confirm ref="confirm" @confirm="_delCoupon"></default-confirm>
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
            <div v-for="(item, index) in couponList" :key="index" class="group-item" @click="_selectGroup(item, index)">
              <span v-for="(val, ind) in couponTitle" :key="ind" class="title-item" :style="{flex: val.flex}">
                <span v-if="ind === 0" class="check" :class="{'checked': (couponCheckItem.id ? (item.id === couponCheckItem.id) : (item.id === couponSelectItem.id))}"></span>
                <span v-else class="title-item">{{item[val.value]}}</span>
              </span>
            </div>
          </div>
        </div>
        <!--翻页器-->
        <div class="page-box">
          <base-pagination ref="paginationCoupon" :pageDetail="goodsPage" @addPage="_getMoreCoupon"></base-pagination>
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
            <div v-for="(item, index) in groupList" :key="index" class="group-item" @click="_selectGroup(item, index)">
              <span v-for="(val, ind) in groupTitle" :key="ind" class="title-item" :style="{flex: val.flex}">
                <span v-if="ind === 0" class="check" :class="{'checked': (groupCheckItem.id ? (item.id === groupCheckItem.id) : (item.id === groupSelectItem.id))}"></span>
                <span v-else class="title-item">{{item[val.value]}}</span>
              </span>
            </div>
          </div>
        </div>
        <!--翻页器-->
        <div class="page-box">
          <base-pagination ref="paginationGroup" :pageDetail="goodsPage" @addPage="_getMoreGroup"></base-pagination>
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
  import {marketComputed, marketMethods} from '@state/helpers'
  import {DatePicker} from 'iview'
  // import API from '@api'

  const PAGE_NAME = 'EDIT_MARKET'
  const TITLE = '新建编辑优惠券营销'
  const SELECT_COUPON_TITLE = [
    {name: '优惠券名称', flex: 1.4, value: 'coupon_name'},
    {name: '类型', flex: 1, value: 'type'},
    {name: '面值', flex: 1, value: 'money'},
    {name: '剩余', flex: 1, value: 'overplus'},
    {name: '有效期', flex: 1, value: 'time'},
    {name: '操作', flex: 1, value: ''},
  ]
  const SELECT_GROUP_TITLE = [
    {name: '团长帐号', flex: 1, value: 'mobile'},
    {name: '团长名称', flex: 1, value: 'name'},
    {name: '社区', flex: 1.4, value: 'social_name'},
    {name: '券数量', flex: 1, value: 'count'},
    {name: '操作', flex: 1, value: ''}
  ]
  const GROUP_TITLE = [
    {name: '选择', flex: 0.7, value: ''},
    {name: '团长帐号', flex: 1, value: 'mobile'},
    {name: '团长名称', flex: 1, value: 'name'},
    {name: '社区名称', flex: 1.2, value: 'social_name'},
    {name: '社区地址', flex: 2, value: 'address'},
  ]
  const COUPON_TITLE = [
    {name: '选择', flex: 0.7, value: ''},
    {name: '优惠券名称', flex: 1.8, value: 'mobile'},
    {name: '类型', flex: 1, value: 'type'},
    {name: '面值', flex: 1, value: 'money'},
    {name: '剩余数量', flex: 1, value: 'overplus'},
    {name: '有效期', flex: 1, value: 'time'},
  ]
  const ARR_GROUP = [
    {mobile: '123456487', name: '王先生', social_name: '广州白云区白云花园社区', count: 100},
    {mobile: '123456487', name: '王先生', social_name: '广州白云区白云花园社区', count: 100}
  ]
  const ARR_COUPON = [
    {coupon_name: '饮品优惠券', type: '满减券', money: 50, overplus: 20, start_at: '2019-03-19', end_at: '2019-03-20' },
    {coupon_name: '饮品优惠券', type: '满减券', money: 50, overplus: 20, start_at: '2019-03-19', end_at: '2019-03-20' }
  ]
  const ARR_GROUP_LIST = [
    {mobile: '13584561012', name: '王先生', social_name: '白云区白云花园社区', address: '白云区白云花园'},
    {mobile: '13584561012', name: '王先生', social_name: '白云区白云花园社区', address: '白云区白云花园'}
  ]
  const ARR_COUPON_LIST = [
    {mobile: '13584260103', type: '满减券', money: '50', start_at: '2019-03-19', end_at: '2019-03-20', overplus: 20},
    {mobile: '13584260103', type: '满减券', money: '50', start_at: '2019-03-19', end_at: '2019-03-20', overplus: 20}
  ]
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultModal,
      DefaultConfirm,
      DatePicker
    },
    data() {
      return {
        couponTitle: COUPON_TITLE, // 优惠券弹窗title
        groupTitle: GROUP_TITLE, // 团长弹窗title
        selectCouponTitle: SELECT_COUPON_TITLE, // 已选优惠券弹窗title
        selectGroupTitle: SELECT_GROUP_TITLE, // 已选团长title
        selectGroupList: ARR_GROUP, // 已选团长列表
        selectCouponList: ARR_COUPON, // 已选优惠券列表
        groupList: ARR_GROUP_LIST, // 弹窗团长列表
        couponList: ARR_COUPON_LIST, // 弹窗优惠券列表
        page: 1,
        marketIndex: 0,
        goodsPage: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        msg: {},
        arr: [1, 2, 3],
        groupSelectItem: {},
        groupCheckItem: {},
        couponSelectItem: {},
        couponCheckItem: {},
        title: '',
        dayData: {
          check: false,
          show: false,
          content: '7天',
          type: 'default',
          data: [{name: '7天'}, {name: '15天'}, {name: '30天'}] // 格式：{title: '55'}}
        },
        dayData2: {
          check: false,
          show: false,
          content: '7天',
          type: 'default',
          data: [{name: '7天'}, {name: '15天'}, {name: '30天'}] // 格式：{title: '55'}}
        },
        dayData3: {
          check: false,
          show: false,
          content: '3天',
          type: 'default',
          data: [{name: '3天'}, {name: '5天'}, {name: '10天'}] // 格式：{title: '55'}}
        },
        count: '',
        activityItem: 1, // 活跃客户配置
        newItem: 1 // 新客户配置
      }
    },
    computed: {
      ...marketComputed,
      testName() { // 活动名称
        return this.msg.activity_name
      }
    },
    watch: {
    },
    created() {
      this.marketIndex = this.$route.query.index || 0
      switch(+this.marketIndex) {
      case 0:
        this.title = '新客户规则设置'; break
      case 1:
        this.title = '活跃客户规则设置'; break
      case 2:
        this.title = '沉睡客户规则设置'; break
      case 3:
        this.title = '发券规则设置'; break
      default:
        this.title = '新客户规则设置'
      }
      this.disable = this.$route.query.id
      this.id = this.$route.query.id || null
      if(this.$route.query.id) {
        this.$store.commit('global/SET_CURRENT_TITLES', ['商城', '营销', '优惠券营销', '编辑优惠券'])
      } else {
        this.$store.commit('global/SET_CURRENT_TITLES', ['商城', '营销', '优惠券营销', '新建优惠券'])
      }
    },
    async mounted() {
    },
    methods: {
      ...marketMethods,

      // 删除商品弹窗
      _delCoupon() {
        let index = this.selectGoodsId.findIndex((item) => item === this.goodsDelId)
        this.selectGoodsId.splice(index, 1)
        this.goodsList.splice(this.goodsDelIndex, 1)
        this.selectDelId.push(this.goodsDelId)
      },
      _selectDay(item) {
        console.log(item)
      },
      _selectDay3(item) {
        console.log(item)
      },
      _getStartTime(time) {
        this.msg.start_at = time
      },
      _getEndTime(time) {
        this.msg.end_at = time
      },
      _saveActivity() {
        console.log('save')
      },
      checkNew(num) {
        this.newItem = num
      },
      checkActivity(num) {
        this.activityItem = num
      },
      _back() {
        this.$router.back()
      },
      _initData() {
        this.page = 1
        this.keyword = ''
        this.$refs.paginationGroup && this.$refs.paginationGroup.beginPage()
        this.$refs.paginationCoupon && this.$refs.paginationCoupon.beginPage()
      },
      _showCouponModal() {
        this.$refs.couponModal.showModal()
      },
      _showGroupModal() {
        this.$refs.groupModal.showModal()
      },
      _searchData() {
      },
      _cancelModal() {
        this._initData()
        this._hideModal()
      },
      // 统一用一个关闭弹窗方法
      _hideModal() {
        this.$refs.couponModal && this.$refs.couponModal.hideModal()
        this.$refs.groupModal && this.$refs.groupModal.hideModal()
      },
      _selectGroup(item, index) {
        this.groupSelectItem = item
      },
      _additionGroup() {
      },
      _additionCoupon() {
      },
      _getMoreGroup() {

      },
      _getMoreCoupon() {

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
  .edit-market
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
        background: url(./pic-single_goupon@2x.png) no-repeat
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
        flex: 1
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
        .count
          color: $color-text-assist
          position: absolute
          right: 10px
          col-center()
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
          .disable
            cursor: not-allowed
          .icon
            width: 10px
            height: 10px
            margin-left: 5px
            object-fit: cover
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

        .text
          color: $color-text-assist
          margin-bottom: 20px
        .check-item
          display: flex
          margin-bottom: 20px
          align-items: center
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
        &:nth-child(2n)
          background: #F5F7FA
        &:last-child
          border-bottom: 0
        &:first-child
          border-bottom: 1px solid #E9ECEE
        .check
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
