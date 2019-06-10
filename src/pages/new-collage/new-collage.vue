<template>
  <div class="edit-rush detail-content">
    <div class="identification">
      <div class="identification-page">
        <img src="./icon-new_commodity@2x.png" class="identification-icon">
        <p class="identification-name">{{disable ? '查看' : '新建'}}拼团返现</p>
      </div>
      <div class="function-btn">
      </div>
    </div>
    <div class="content-header">
      <div class="content-title">基本信息</div>
    </div>
    <div class="rush-time">
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          活动名称
        </div>
        <div class="edit-input-box">
          <input v-model="msg.activity_name" type="text" placeholder="请输入活动名称" maxlength="25" class="edit-input">
        </div>
        <div :class="{'text-no-change':disable}"></div>
      </div>

      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          拼团活动时间
        </div>
        <date-picker
          v-model="msg.start_at"
          :editable="false"
          class="edit-input-box"
          type="datetime"
          placeholder="开始时间"
          style="width: 240px;height: 40px;border-radius: 1px"
          valueFormat="yyyy-MM-dd HH:mm:ss"
          @change="_getStartTime"
        ></date-picker>
        <div class="tip">至</div>
        <date-picker
          v-model="msg.end_at"
          :editable="false"
          class="edit-input-box"
          type="datetime"
          placeholder="结束时间"
          style="width: 240px;height: 40px;border-radius: 1px"
          valueFormat="yyyy-MM-dd HH:mm:ss"
          @change="_getEndTime"
        ></date-picker>
        <!--<div class="tip-text">开始时间必须大于等于当前时间(精确到年月日时分秒)</div>-->
        <div :class="{'time-no-change':disable}"></div>
      </div>

      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          成团有效时间
        </div>
        <!--<div class="edit-input-box">
          <input v-model="msg.activity_name" type="text" placeholder="选择时间" class="edit-input">
        </div>-->
        <div class="edit-input-box">
          <base-drop-down :width="400" :height="40" :select="usefulTime" @setValue="_selectUsefulTime"></base-drop-down>
        </div>
        <span class="tip">小时</span>
        <div :class="{'text-no-change':disable}"></div>
      </div>

      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          成团人数
        </div>
        <div class="edit-input-box">
          <base-drop-down :width="400" :height="40" :select="usefulPerson" @setValue="_selectPerson"></base-drop-down>
        </div>
        <!--<div class="edit-input-box">
          <input v-model="msg.person_limit" type="number" placeholder="请输入2~5人" class="edit-input">
        </div>-->
        <div :class="{'text-no-change':disable}"></div>
      </div>

      <div class="edit-item">
        <div class="edit-title">
          <!--<span class="start">*</span>-->
          模拟成团
        </div>
        <div class="edit-input-box">
          <div class="checkbox">
            <p class="check-item"><span :class="['item-icon', 'checked']"></span>开启</p>
            <!--<p class="check-item" @click="changeCheck(1)"><span :class="['item-icon', {'checked': +msg.preferential_type === 1}]"></span>关闭</p>-->
            <span class="description">注：成团有效期失效前30分钟后如无论是否成团，系统均按成团处理</span>
          </div>
        </div>
        <!--<div :class="{'text-no-change':disable}"></div>-->
      </div>
    </div>

    <div class="add-list">
      <div class="content-header">
        <div class="content-title">活动返券</div>
      </div>
      <div class="activity-box">
        <div class="activity-list">
          <div class="activity-tab">
            <div :class="{'disable': disable}" class="add-goods-btn hand" @click="_showCouponModal">
              <img class="icon" src="./icon-add@2x.png" alt="">
              添加优惠券
            </div>
            <div class="remind">优惠券只可添加一种（只能选择满减券）</div>
          </div>
          <div v-if="selectCouponList.length" class="rush-list-box">
            <div class="commodities-list-header com-list-box commodities-list-top">
              <div v-for="(item, index) in selectCouponTitle" :key="index" class="com-list-item" :style="{flex: item.flex}">{{item.name}}</div>
            </div>
            <div class="big-box">
              <div v-for="(item, index) in selectCouponList" :key="index" class="com-list-box com-list-content">
                <div v-for="(val, ind) in selectCouponTitle" :key="ind" class="com-list-item" :style="{flex: val.flex}">
                  <div v-if="val.value === 'time'" class="main">
                    <p>{{item.start_at}}</p>
                    <p>{{item.end_at}}</p>
                  </div>
                  <p v-else-if="val.value === ''" class="list-operation" :class="{'list-operation-disable': disable}" @click="_showDelItem('coupon', index, item)">删除</p>
                  <p v-else-if="val.value === 'denomination'">{{item[val.value]}}{{+item.preferential_type === 1 ? '折' : '元'}}</p>
                  <p v-else class="main">{{item[val.value]}}</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>

    <div class="add-list">
      <div class="content-header">
        <div class="content-title">活动商品</div>
      </div>
      <div class="activity-box">
        <div class="activity-list">
          <div class="activity-tab">
            <div :class="{'disable': disable}" class="add-goods-btn hand" @click="_showGoodsModal">
              <img class="icon" src="./icon-add@2x.png" alt="">
              添加商品
            </div>
            <div class="remind">添加商品数量{{goodsList.length}}/20个</div>
          </div>
          <div v-if="goodsList.length" class="rush-list-box">
            <div class="commodities-list-header com-list-box commodities-list-top">
              <div v-for="(item, index) in commodities" :key="index" class="com-list-item">{{item}}</div>
            </div>
            <div class="big-box">
              <div v-for="(item, index) in goodsList" :key="index" class="com-list-box com-list-content">
                <div class="com-list-item">{{item.name}}</div>
                <div class="com-list-item">{{item.sale_unit || item.goods_units}}</div>
                <div class="com-list-item">¥{{item.goods_trade_price || item.trade_price_show}}</div>
                <div class="com-list-item">
                  <input v-model="item.trade_price" type="number" :readonly="disable" class="com-edit">
                  <span v-if="item.original_price" class="small-money">¥</span>
                </div>
                <div class="com-list-item">
                  <input v-model="item.person_all_buy_limit" :readonly="disable" type="number" class="com-edit com-edit-small">
                </div>
                <div class="com-list-item">{{item.goods_usable_stock || item.all_stock || 0}}</div>
                <div class="com-list-item">
                  <input v-model="item.usable_stock" :readonly="disable" type="number" class="com-edit com-edit-small" @input="echangBase(item, index)">
                </div>
                <div class="com-list-item">{{item.sale_count || 0}}</div>
                <div class="com-list-item">
                  <input v-model="item.sort" :readonly="disable" type="number" class="com-edit com-edit-small">
                </div>
                <div class="com-list-item">
                  <span :class="{'list-operation-disable': disable}" class="list-operation" @click="_showDelItem('goods', item, index)">删除</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    <!--<p @click="test">测试</p>-->
    <!-- 选择优惠券弹窗-->
    <default-modal ref="couponModal">
      <div slot="content" class="shade-box">
        <div class="title-box">
          <div class="title">
            选择优惠券
          </div>
          <span class="close hand" @click="_cancelModal"></span>
        </div>
        <!--搜索-->
        <div class="shade-tab">
          <div class="tab-item">
            <base-search ref="couponSearch" placeHolder="请输入优惠券名称" @search="_searchData"></base-search>
          </div>
        </div>
        <!--列表-->
        <div class="coupon-content">
          <div class="title">
            <span v-for="(item, index) in couponTitle" :key="index" class="title-item" :style="{flex: item.flex}">{{item.name}}</span>
          </div>
          <div class="outreach-group-list">
            <div v-for="(item, index) in couponList" :key="index" class="group-item hand" @click="_selectCoupon(item, index)">
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
          <base-pagination ref="paginationCoupon" :pageDetail="couponPage" @addPage="_getMore"></base-pagination>
        </div>
        <div class="back">
          <div class="back-cancel back-btn hand" @click="_cancelModal">取消</div>
          <div class="back-btn back-submit hand" @click="_additionCoupon">确定</div>
        </div>
      </div>
    </default-modal>

    <!-- 选择商品弹窗-->
    <default-modal ref="goodsModel">
      <div slot="content" class="shade-box">
        <div class="title-box">
          <div class="title">选择商品</div>
          <span class="close hand" @click="_cancelModal"></span>
        </div>
        <div class="shade-tab">
          <div class="tab-item">
            <base-drop-down :width="218" :select="assortment" @setValue="_secondAssortment"></base-drop-down>
          </div>
          <div class="tab-item">
            <base-drop-down :width="140" :select="secondAssortment" @setValue="_choessSecondAssortment"></base-drop-down>
          </div>
          <div class="tab-item">
            <base-search ref="goodsSearch" placeHolder="请输入商品名称" @search="_searchData"></base-search>
          </div>
        </div>
        <div class="goods-content">
          <div class="rush-goods-list">
            <div v-for="(item, index) in choeesGoods" :key="index" class="goods-item">
              <span class="select-icon hand" :class="{'select-icon-disable': item.selected === 1, 'select-icon-active': item.selected === 2}" @click="_selectGoods(item,index)"></span>
              <div class="goods-img" :style="{'background-image': 'url(\'' + item.goods_cover_image + '\')'}"></div>
              <div class="goods-msg">
                <!--<div class="goods-name">{{item.usable_stock}}</div>-->
                <div class="goods-name">{{item.name}}</div>
                <div class="goods-money">
                  <div class="goods-money-text">{{item.usable_stock}}</div>
                  <div class="goods-money-text">¥{{item.trade_price}}</div>
                </div>
              </div>
              <div class="add-btn btn-main" :class="{'add-btn-disable': item.selected === 1}" @click="_additionOne(item, index)">{{item.selected === 1 ? '已添加' : '添加'}}</div>
            </div>
          </div>
        </div>
        <div class="page-box">
          <base-pagination ref="paginationGoods" :pageDetail="goodsPage" @addPage="_getMore"></base-pagination>
        </div>
        <div class="back">
          <div class="back-cancel back-btn hand" @click="_cancelGoods">取消</div>
          <div class="back-btn back-submit hand" @click="_batchAddition">批量添加</div>
        </div>
      </div>
    </default-modal>


    <!--确定取消弹窗-->
    <default-confirm ref="confirm" @confirm="_delGoods"></default-confirm>
    <div class="back">
      <div class="back-cancel back-btn hand" @click="_back">取消</div>
      <div :class="{'btn-disable': disable}" class="back-btn back-submit hand" @click="_saveActivity">保存</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import {activityComputed, activityMethods} from '@state/helpers'
  import API from '@api'
  import _ from 'lodash'
  import {DatePicker} from 'element-ui'

  const PAGE_NAME = 'NEW_COLLAGE'
  const TITLE = '新建拼团'
  const COMMODITIES_LIST = [
    '商品名称',
    '单位',
    '销售价',
    '拼团价',
    '每人限购',
    '商品库存',
    '活动库存',
    '销量',
    '排序',
    '操作'
  ]
  const SELECT_COUPON_TITLE = [
    {name: '优惠券名称', flex: 1.7, value: 'coupon_name'},
    {name: '类型', flex: 1, value: 'preferential_str'},
    {name: '面值', flex: 1, value: 'denomination'},
    {name: '剩余', flex: 1, value: 'usable_stock'},
    {name: '有效期', flex: 1.6, value: 'time'},
    {name: '操作', flex: 0.7, value: ''}
  ]
  const COUPON_TITLE = [
    {name: '选择', flex: 0.4, value: ''},
    {name: '优惠券名称', flex: 1.8, value: 'coupon_name'},
    {name: '类型', flex: 1, value: 'preferential_str'},
    {name: '面值', flex: 1, value: 'denomination'},
    {name: '剩余数量', flex: 1, value: 'usable_stock'},
    {name: '有效期', flex: 1, value: 'time'}
  ]

  const COUNT = /[2-5]/
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
        selectCouponTitle: SELECT_COUPON_TITLE, // 选择的优惠券列表title
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
        usefulTime: {
          check: false,
          show: false,
          content: '选择时间',
          type: 'default',
          data: [{name: '3'}, {name: '4'}, {name: '5'}] // 格式：{title: '55'}}
        },
        usefulPerson: {
          check: false,
          show: false,
          content: '选择成团人数',
          type: 'default',
          data: [{name: '2'}, {name: '3'}, {name: '4'}, {name: '5'}] // 格式：{title: '55'}}
        },
        parentId: '',
        goodsPage: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        couponPage: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        keyword: '',
        selectGoods: [], // 单次选择的商品
        selectGoodsId: [], // 所有选择的商品id
        couponCheckItem: {}, // 选中的优惠券
        couponSelectItem: {},
        selectCouponList: [],
        modalType: '',
        couponList: [],
        willDelId: 0,
        willDelIndex: 0,
        selectDelId: [],
        disable: false,
        goodsList: [],
        msg: {
          activity_name: '',
          start_at: '',
          end_at: '',
          effective_time: '',
          person_limit: '',
          // preferential_type: 1,
          coupon_id: '',
          activity_theme: this.$route.query.activity_theme
        },
        isSubmit: false,
        confirmType: '',
        defaultCount: 2
      }
    },
    computed: {
      ...activityComputed,
      testName() {
        return this.msg.activity_name
      },
      testStartTime() {
        return this.msg.start_at
      },
      testStartDate() {
        // 开始时间规则判断
        return Date.parse('' + this.msg.start_at.replace(/-/g, '/')) > new Date() - 600000
      },
      testEndTime() {
        return this.msg.end_at
      },
      testEndTimeReg() {
        // 结束时间规则判断
        return Date.parse('' + this.msg.end_at.replace(/-/g, '/')) > Date.parse('' + this.msg.start_at.replace(/-/g, '/'))
      },
      testUsefulTime() {
        return this.msg.effective_time
      },
      testCount() {
        return COUNT.test(this.msg.person_limit)
      },
      testCouponList() {
        let length = this.selectCouponList.length
        return length > 0
      }
    },
    watch: {},
    created() {
      this.disable = +this.$route.query.id > 0
      this.id = +this.$route.query.id || +this.$route.query.editId || null
      if (this.id) {
        let obj = _.cloneDeep(this.collageDetail)
        this.goodsList = obj.activity_goods
        if (this.goodsList) {
          this.selectGoodsId = obj.activity_goods.map((item) => {
            return item.goods_id
          })
        }
        if (+obj.effective_time === 3) {
          this.$set(this.usefulTime, 'content', '3')
        } else if (+obj.effective_time === 4) {
          this.$set(this.usefulTime, 'content', '4')
        } else if (+obj.effective_time === 5) {
          this.$set(this.usefulTime, 'content', '5')
        }
        switch (+obj.person_limit) {
        case 2:
          this.$set(this.usefulPerson, 'content', '2')
          break
        case 3:
          this.$set(this.usefulPerson, 'content', '3')
          break
        case 4:
          this.$set(this.usefulPerson, 'content', '4')
          break
        case 5:
          this.$set(this.usefulPerson, 'content', '5')
          break
        }
        this.selectCouponList = obj.coupon.coupon_id ? [obj.coupon] : []
        this.couponSelectItem = obj.coupon
        this.msg = {
          start_at: obj.start_at,
          end_at: obj.end_at,
          activity_name: obj.activity_name,
          person_limit: obj.person_limit,
          effective_time: obj.effective_time,
          coupon_id: 0,
          activity_theme: this.$route.query.activity_theme
        }
      }
      this._getFirstAssortment()

    // this._getGoodsList()
    },
    async mounted() {
    // this.classifyIndex = 0
    },
    methods: {
      ...activityMethods,
      _getStartTime(time) {
        this.msg.start_at = time
      },
      _getEndTime(time) {
        this.msg.end_at = time
      },
      _selectUsefulTime(item) {
        this.msg.effective_time = item.name
      },
      _selectPerson(item) {
        this.msg.person_limit = item.name
      },
      // 初始化数据
      _initData() {
        this.page = 1
        this.keyword = ''
        this.modalType = ''
        this.parentId = ''
        this.$refs.paginationGroup && this.$refs.paginationGroup.beginPage()
        this.$refs.paginationCoupon && this.$refs.paginationCoupon.beginPage()
      },
      changeCheck(num) {
        this.msg.preferential_type = num
      },
      // 选择商品
      async _getGoodsList() {
        // if (!this.id) return
        let res = await API.Sale.getGoodsList({
          is_online: 1,
          keyword: this.keyword,
          goods_category_id: this.parentId,
          shelf_id: this.id,
          limit: 7,
          page: this.page,
          activity_theme: this.$route.query.activity_theme
        })
        if (res.error !== this.$ERR_OK) {
          return
        }
        this.goodsPage = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        this.choeesGoods = res.data.map((item, index) => {
          item.selected = 0
          let idx = this.selectGoodsId.findIndex((id) => id === item.id)
          let goodsIndex = this.selectGoods.findIndex((items) => items.id === item.id)
          let delIndex = this.selectDelId.findIndex((id) => id === item.id)
          if (delIndex !== -1) {
            item.selected = 0
          }
          if (idx !== -1) {
            item.selected = 1
          }
          if (goodsIndex !== -1) {
            item.selected = 2
          }
          item.all_stock = item.usable_stock
          // item.trade_price = ''
          item.sort = 0
          return item
        })
      },
      // 获取分页商品列表
      async _getMore(page) {
        this.page = page
        if (this.modalType === 'coupon') {
          await this._getCouponList()
        } else {
          await this._getGoodsList()
        }
      },
      _selectCoupon(item, index) {
        this.couponCheckItem = item
      },
      // 选择一级分类
      async _secondAssortment(item) {
        this.parentId = item.id
        if (item.id === '') {
          this.secondAssortment.data = []
        } else {
          let res = await API.Product.getCategory({parent_id: this.parentId, get_goods_count: 1})
          this.$loading.hide()
          this.secondAssortment.data = res.error === this.$ERR_OK ? res.data : []
          this.secondAssortment.data.unshift({name: '全部', id: this.parentId})
        }
        this.secondAssortment.content = '选择二级分类'
        this.page = 1
        this.$refs.paginationGoods.beginPage()
        await this._getGoodsList()
      },
      // 选择二级分类
      async _choessSecondAssortment(item) {
        this.parentId = item.id
        this.page = 1
        this.$refs.paginationGoods.beginPage()
        await this._getGoodsList()
      },
      // 获取一级分类
      async _getFirstAssortment() {
        let res = await API.Product.getCategory({parent_id: this.parentId, get_goods_count: 1})
        this.$loading.hide()
        this.assortment.data = res.error === this.$ERR_OK ? res.data : []
        this.assortment.data.unshift({name: '全部', id: ''})
      },
      // 搜索
      async _searchData(text) {
        this.keyword = text
        this.page = 1
        if (this.modalType === 'coupon') {
          this.$refs.paginationCoupon.beginPage()
          await this._getCouponList()
        } else {
          this.$refs.paginationGoods.beginPage()
          await this._getGoodsList()
        }
      },
      // 勾选商品
      _selectGoods(item, index) {
        if (item.usable_stock <= 0) {
          this.$toast.show('该商品库存为0，不能选择')
          return
        }
        switch (item.selected) {
        case 0:
          if (this.selectGoodsId.length === 20) {
            this.$toast.show('选择商品数量不能超过20个')
            return
          }
          this.choeesGoods[index].selected = 2
          // item.all_stock = item.usable_stock
          this.selectGoods.push(item)
          this.selectGoodsId.push(item.id)
          break
        case 2:
          this.choeesGoods[index].selected = 0
          let idx = this.selectGoods.findIndex((items) => items.id === item.id)
          let idIdx = this.selectGoodsId.findIndex((id) => id === item.id)
          if (idx !== -1) {
            this.selectGoods.splice(idx, 1)
          }
          if (idIdx !== -1) {
            this.selectGoodsId.splice(idx, 1)
          }
          break
        }
      },
      // 删除商品
      _showDelItem(type, item, index) {
        if (this.disable) return
        this.willDelId = item.goods_id || 0
        this.willDelIndex = index
        this.confirmType = type
        this.$refs.confirm.show(`是否确定删除该${type === 'coupon' ? '优惠券' : '商品'}？`)
      },
      // 删除商品弹窗
      _delGoods() {
        if (this.confirmType === 'coupon') {
          this.selectCouponList.splice(this.willDelIndex, 1)
          this.couponSelectItem = {}
          this.couponCheckItem = {}
        } else {
          this.selectGoodsId.splice(this.willDelIndex, 1)
          this.goodsList.splice(this.willDelIndex, 1)
          this.selectDelId.push(this.willDelId)
        }
      },
      _cancelGoods() {
        this.selectGoods.forEach((item) => {
          let idx = this.choeesGoods.findIndex((items) => items.goods_id === item.goods_id)
          let delIdx = this.selectGoodsId.findIndex((id) => id === item.goods_id)
          this.choeesGoods[idx].selected = this.choeesGoods[idx].selected === 1 ? 1 : 0
          this.selectGoodsId.splice(delIdx, 1)
        })
        this.selectGoods = []
        this._cancelModal()
      },
      // 单个添加
      _additionOne(item, index) {
        if (item.usable_stock <= 0) {
          this.$toast.show('该商品库存为0，不能选择')
          return
        }
        if (item.selected === 1) {
          return
        }
        if (this.selectGoodsId.length === 20 && item.selected !== 2) {
          this.$toast.show('选择商品数量不能超过20个')
          return
        }
        if (item.selected !== 2) this.selectGoodsId.push(item.id)
        this.choeesGoods[index].selected = 1
        // item.all_stock = item.usable_stock
        let goods = Object.assign({}, item)
        goods.usable_stock = ''
        goods.trade_price_show = item.trade_price
        goods.trade_price = ''
        this.goodsList.push(goods)

        this.choeesGoods.forEach((item) => {
          if (item.selected === 1) {
            let idx = this.selectGoods.findIndex((child) => child.id === item.id)
            if (idx !== -1) {
              this.selectGoods.splice(idx, 1)
            }
          }
        })
      },
      // 批量添加
      _batchAddition() {
        this.choeesGoods = this.choeesGoods.map((item) => {
          item.selected = item.selected === 2 ? 1 : item.selected
          item.usable_stock = ''
          item.trade_price_show = item.trade_price
          item.trade_price = ''
          return item
        })
        this.goodsList = this.goodsList.concat(this.selectGoods)
        this.selectGoods = []
        this._cancelModal()
      },

      _additionCoupon() {
        this.couponCheckItem.id && (this.couponSelectItem = this.couponCheckItem)
        if (this.couponCheckItem.id) {
          let arr = []
          arr.push(this.couponSelectItem)
          this.selectCouponList = arr
        }
        this._cancelModal()
      },

      // 优惠券弹窗
      async _showCouponModal() {
        if (this.disable) return
        this.couponCheckItem = {}
        if (this.modalType !== 'coupon') {
          this._initData()
          this.modalType = 'coupon'
          this.couponList = []
          await this._getCouponList()
          this.$refs.couponModal.showModal()
          this.$refs.couponSearch.infoTextMethods()
        } else {
          await this._getCouponList()
          this.$refs.couponModal.showModal()
        }
      },
      async _showGoodsModal() {
        if (this.disable) return
        if (this.modalType === 'coupon') {
          this._initData()
          this.modalType = ''
          await this._getGoodsList()
          // 展示添加商品弹窗
          this.$refs.goodsModel.showModal()
          this.$refs.goodsSearch.infoTextMethods()
        } else {
          await this._getGoodsList()
          this.$refs.goodsModel.showModal()
        }
      },
      _cancelModal() {
        this.$refs.couponModal && this.$refs.couponModal.hideModal()
        this.$refs.goodsModel && this.$refs.goodsModel.hideModal()
      },
      // 切换分类
      _setClassify(index, item) {
        this.classifyIndex = index
      },
      _back() {
        this.$router.back()
      },

      _getCouponList() {
        let data = {
          coupon_name: this.keyword,
          page: this.page,
          limit: 6,
          status: 1,
          preferential_type: 2,
          has_stock: 1
        }
        API.Coupon.getCouponList(data, false).then((res) => {
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
      //  保存
      async _saveActivity() {
        if (this.disable || this.isSubmit) return
        if (!this.checkForm()) return
        if (!this.testGoods()) return

        this.msg.coupon_id = this.couponSelectItem.id || this.couponSelectItem.coupon_id || 0
        let list = this.goodsList.map((item) => {
          delete item.person_day_buy_limit
          item.goods_id = item.id || item.goods_id
          return item
        })

        this.isSubmit = true
        let data = Object.assign({}, this.msg, {activity_goods: list})
        let res = await API.Activity.newCollage(data, true)
        this.$loading.hide()
        this.$toast.show(res.message)
        if (res.error !== this.$ERR_OK) {
          this.isSubmit = false
          return
        }
        setTimeout(() => {
          this._back()
        }, 1000)
        setTimeout(() => {
          this.isSubmit = false
        }, 2000)
      },
      // 测试已选择商品列表
      testGoods() {
        let list = this.goodsList
        if (!list.length) {
          this.$toast.show('请添加商品')
          return false
        }
        for (let i in list) {
          if (!list[i].trade_price || !list[i].person_all_buy_limit || !list[i].usable_stock || list[i].sort === '') {
            this.$toast.show(`${list[i].name}信息不全`)
            return false
          } else if (
            +list[i].trade_price < 0 ||
            +list[i].trade_price > +list[i].original_price ||
            +list[i].person_all_buy_limit <= 0 ||
            +list[i].usable_stock < 0 ||
            (list[i].usable_stock + '').includes('.') ||
            +list[i].sort < 0
          ) {
            this.$toast.show(`${list[i].name}输入数据有误`)
            return false
          }
        }
        return true
      },
      test() {
        let list = this.goodsList.map((item) => {
          delete item.person_day_buy_limit
          item.goods_id = item.id || item.goods_id
        })
        console.log(list)
      },
      checkForm() {
        let arr = [
          {value: this.testName, txt: '请输入活动名称'},
          {value: this.testStartTime, txt: '请选择活动开始时间'},
          {value: this.testStartDate, txt: '活动开始时间必须大于等于当前时间'},
          {value: this.testEndTime, txt: '请选择活动结束时间'},
          {value: this.testEndTimeReg, txt: '活动结束时间必须大于开始时间'},
          {value: this.testUsefulTime, txt: '请选择成团有效时间'},
          {value: this.testCount, txt: '请输入2~5人成团人数'}
        // {value: this.testCouponList, txt: '请添加优惠券'}
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

  .edit-rush
    padding-bottom: 20px
    position: relative
    font-family: $font-family-regular
    flex: 1
  .add-list
    padding-bottom: 40px
  .content-header
    justify-content: flex-start
  .rush-time
    margin-bottom: 27px

  .edit-item
    display: flex
    color: #2A2A2A
    margin-top: 24px
    position: relative
    .edit-title
      font-size: $font-size-14
      font-family: $font-family-regular
      white-space: nowrap
      text-align: right
      margin-top: 7.5px
      min-width: 96px
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
      .checkbox
        height: 24px
        margin-top: 7.5px
        margin-bottom: 10px
        .check-item
          float: left
          margin-right: 20px
          display: flex
          align-items: center
      .item-icon
        width: 16px
        height: 16px
        border: 1px solid #E1E1E1
        border-radius: 50%
        margin-right: 5px
        transition: all 0.3s
        display: flex
        justify-content: center
        align-items: center
      .checked
        border: 5px solid $color-main

    .edit-input-right
      margin-left: 14px
    .tip
      line-height: 40px
      font-size: $font-size-12
      font-family: $font-family-regular
      color: $color-text-main
    .tip-text
      margin-left: 2px
      line-height: 40px
      font-size: $font-size-12
      font-family: $font-family-regular
      color: $color-text-assist
    .description
      font-size: $font-size-12
      font-family: $font-family-regular
      color: $color-text-assist
      margin-left: 20px
    .time-no-change, .text-no-change
      position: absolute
      left: 134px
      top: 0
      width: 402px
      height: 40px
      z-index: 100
      cursor: not-allowed
    .time-no-change
      width: 522px
  .edit-activity
    box-sizing: border-box
    padding-left: 20px

  .edit-arrive
    .edit-input-box
      margin: 0 14px 0 32px

  .activity-box
    margin-top: 25px
    position: relative
    .classify
      display: flex
      height: 42px
      .classify-item
        box-sizing: border-box
        margin-right: 4px
        font-size: $font-size-14
        width: 90px
        height: 42px
        text-align: center
        line-height: 42px
        color: #222
        font-family: $fontFamilyRegular
        background: #F8F8F8
        border-top-right-radius: 6px
        border-top-left-radius: 6px
        border: 1px solid $color-line
        border-bottom: none
        position: relative
        z-index: 1px
        transition: all 0.3s
      .classify-item-active
        height: 43px
        font-family: $fontFamilyMeddle
        color: $color-4985FC
        background: $color-white

    .classify-manager
      position: absolute
      top: 0
      right: 0
    .activity-list
      box-sizing: border-box
      border-bottom: none
      .big-box
        flex: 1
        position: relative
        box-sizing: border-box
        &::-webkit-scrollbar
          width: 6px
          height: 10px
        &::-webkit-scrollbar-thumb
          background-color: rgba(0, 0, 0, .15)
          border-radius: 10px
        &::-webkit-scrollbar-thumb:hover
          background-color: rgba(0, 0, 0, .3)
        &::-webkit-scrollbar-track
          box-shadow: inset 0 0 6px rgba(0, 0, 0, .15)
          border-radius: 10px
      .commodities-list-top
        margin-top: 0
      .com-list-box
        .com-list-item
          &:nth-child(1)
            flex: 2
  .history-record
    box-sizing: border-box
    padding: 0 20px
    padding-bottom: 80px

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
    // 分类编辑新建
    .auxiliary-box
      padding: 0 20px
      box-sizing: border-box
      margin-top: 32px
      layout(row)
      flex-wrap: wrap
      .auxiliary-item
        min-width: 80px
        height: 32px
        border-1px(#333, 4px)
        text-align: center
        position: relative
        margin-right: 10px
        margin-bottom: 20px
        .text
          font-size: $font-size-14
          color: $color-text-main
          line-height: 32px
          font-family: $font-family-regular
        .auxiliary-model
          opacity: 0
          position: absolute
          width: 100%
          height: 100%
          border-radius: 2px
          background: rgba(51, 51, 51, 0.9)
          left: 0
          top: 0
          padding: 0 11px
          box-sizing: border-box
          layout(row)
          align-items: center
          justify-content: space-between
          transition: all 0.4s
          .img-box
            width: 22px
            height: 22px
            border-radius: 50%
            background: #fff
            cursor: pointer
            background-size: 22px
            bg-image('icon-quit_round')
          .del
            bg-image('icon-delete_round')
          &:hover
            opacity: 1
      .auxiliary-add
        font-size: $font-size-14
        padding: 9px 12px
        margin-bottom: 20px
        min-width: 80px
        text-align: center
    .back
      border-top-1px($color-line)
      position: absolute
      left: 0
      right: 0
      bottom: 0
      background: $color-white
      justify-content: flex-end
      height: 70px
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

    /*分类弹窗*/
    .default-input
      box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
      background: #fff
      border-radius: 2px
      .title-input
        height: 60px
        layout(row)
        align-items: center
        justify-content: space-between
        border-bottom: 0.5px solid $color-line
        padding-left: 20px
        .title
          color: $color-text-main
          font-size: $font-size-16
          font-family: $font-family-medium
        .close-box
          padding: 17px
          .close
            width: 16px
            height: 16px
            border-radius: 50%
            background-size: 22px
            icon-image('icon-close')
            transition: all 0.3s
            &:hover
              transform: scale(1.3)

      .main-input
        padding: 42px 20px 30px 20px
        .main-input-box
          width: 310px
          height: 44px
          border-radius: 2px
          font-family: $font-family-regular
          color: $color-text-main
          font-size: $font-size-14
          padding-left: 14px
          border: 1px solid $color-line
          transition: all 0.3s
          &::-webkit-inner-spin-button
            appearance: none
          &:hover
            border: 1px solid #ACACAC
          &::placeholder
            font-family: $font-family-regular
            color: $color-text-assist
          &:focus
            border-color: $color-main !important

    .btn-group
      text-align: center
      display: flex
      justify-content: flex-end
      user-select: none
      .btn
        width: 96px
        height: 40px
        line-height: 40px
        border-radius: 2px
        cursor: pointer
        transition: all 0.3s
      .cancel
        border: 1px solid $color-line
        &:hover
          color: $color-text-sub
          border-color: $color-text-sub
      .confirm
        border: 1px solid $color-main
        background: $color-main
        color: $color-white
        margin-left: 20px
        &:hover
          background: #44AB67
        &:active
          opacity: 0.8
      .one-btn
        margin-left: 0

    .main-model-box
      layout(row)
      align-items: center
      margin-bottom: 24px
      .text
        color: #666
        font-size: $font-size-14
        font-family: $font-family-regular
        width: 60px
        margin-right: 36px

  /*新建编辑内部的确定弹窗*/
  .default-confirm
    width: 329.6px
    height: 200px
    background: #fff
    border-radius: 2px
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.6)
    text-align: center
    .btn-group-confirm
      text-align: center
      display: flex
      justify-content: center
      user-select: none
      .btn
        width: 96px
        height: 40px
        line-height: 40px
        border-radius: 2px
        border: 1px solid $color-text-D9
        cursor: pointer
        transition: all 0.3s
      .cancel
        border: 1px solid $color-line
        &:hover
          color: $color-text-sub
          border-color: $color-text-sub
      .confirm
        border: 1px solid $color-main
        background: $color-main
        color: $color-white
        margin-left: 20px
        &:hover
          background: #44AB67
        &:active
          opacity: 0.8
      .one-btn
        margin-left: 0
    .title
      font-size: $font-size-16
      font-family: $font-family-medium
      height: 44px
      line-height: 44px
      padding: 0 15px
    .text
      font-size: $font-size-16
      color: $color-text-main
      height: 120px
      display: flex
      align-items: center
      justify-content: center
      margin: 10px 15px
      overflow-y: auto
      text-align: justify
      word-break: break-all
      line-height: 1.4

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
          no-wrap()
        .goods-name, .goods-money
          line-height: 1
        .goods-money
          flex: 1
          layout(row)
          .goods-money-text
            width: 50%
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

  .coupon-content
    border-radius: 2px
    height: 407px
    .title
      display: flex
      height: 45px
      line-height: 45px
      font-family: $font-family-regular
      background: #F5F7FA
      border: 0.5px solid #E9ECEE
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
        border-bottom: 0.5px solid #E9ECEE
        border-right: 0.5px solid #E9ECEE
        border-left: 0.5px solid #E9ECEE
        padding: 0 20px
        &:first-child
          border-top: none
        &:nth-child(2n)
          background: #F5F7FA
        .radio
          width: 16px
          height: 16px
          border: 1px solid #E1E1E1
          border-radius: 50%
          transition: all 0.3s
          display: flex
          justify-content: center
          align-items: center
        .checked
          border: 5px solid $color-main
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
            opacity: 1
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
    box-sizing: border-box
    height: 76px
    align-items: center
    display: flex

  /*弹窗动画*/
  @keyframes layerFadeIn {
    0% {
      opacity: 0
      transform: scale(.5)
    }
    100% {
      opacity: 1
      transform: scale(1)
    }
  }

  @keyframes hideFadeIn {
    0% {
      opacity: 1
      transform: scale(1)
    }
    100% {
      transform: scale(.5)
      opacity: 0
    }
  }

  .com-list-item
    position: relative

  .com-edit
    height: 34px
    width: 93px
    border-radius: 2px
    box-sizing: border-box
    border: 1px solid $color-line
    padding-left: 22px
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

  .small-money
    col-center()
    left: 10px
    line-height: 1.1
    font-size: $font-size-13
    font-family: $font-family-regular
    color: $color-text-main

  .com-edit-small
    width: 60px

  .rush-list-box
    background: $color-white
    overflow: visible
    display: flex
    flex-direction: column
    flex: 1
</style>
