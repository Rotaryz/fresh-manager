<template>
  <div class="new-coupon detail-content">
    <div v-if="!disable" class="identification">
      <div class="identification-page">
        <img src="./icon-new_commodity@2x.png" class="identification-icon">
        <p class="identification-name">新建优惠券</p>
      </div>
      <div class="function-btn">
      </div>
    </div>
    <div class="content-header" :class="{'margin-top': disable}">
      <div class="content-title">基本信息</div>
    </div>
    <!--优惠券名称-->
    <div class="form-content">
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          优惠券名称
        </div>
        <div class="edit-input-box">
          <input v-model="msg.coupon_name"
                 type="text"
                 placeholder="请输入优惠券名称"
                 class="edit-input"
                 :readonly="(disable && !editId)"
                 maxlength="10"
                 :class="{'disable-input':(disable && !editId)}"
          >
          <div class="num">{{msg.coupon_name ? msg.coupon_name.length : 0}}/10</div>
        </div>
        <div :class="{'text-no-change': (disable && !editId)}"></div>
      </div>

      <!--使用范围-->
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          使用范围
        </div>
        <div class="input-box" style="flex: 1">
          <base-drop-down :width="400" :height="40" :select="useRange" @setValue="_selectRange"></base-drop-down>
          <!--添加品类列表-->
          <div v-if="+msg.range_type === 2" class="activity-box">
            <div class="activity-list">
              <div class="activity-tab">
                <div :class="{'btn-disable': disable}" class="add-goods-btn btn-main" @click="_showCategory">
                  <span class="add-icon"></span>
                  添加
                </div>
                <!--<div class="remind">(指定此券可以在哪个品类商品上使用，仅限单个品类)</div>-->
              </div>
              <div v-if="selectCategoryList.length" class="goods-list-box">
                <div class="commodities-list-header com-list-box commodities-list-top">
                  <div v-for="(item, index) in categoryTitle" :key="index" :style="{flex: item.flex}" class="com-list-item">{{item.name}}</div>
                </div>
                <div class="big-box">
                  <div v-for="(item, index) in selectCategoryList" :key="index" class="com-list-box com-list-content">
                    <div v-for="(val, ind) in categoryTitle" :key="ind" :style="{flex: val.flex}" class="com-list-item">
                      <span v-if="val.value !== ''">{{item[val.value]}}</span>
                      <span v-else :class="{'list-operation-disable': disable}" class="list-operation" @click="_showDelGoods('category', item, index)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!--添加商品列表-->
          <div v-if="+msg.range_type === 3" class="activity-box">
            <div class="activity-list">
              <div class="activity-tab">
                <div :class="{'btn-disable': disable}" class="add-goods-btn btn-main" @click="_showGoods">
                  <span class="add-icon"></span>
                  添加
                </div>
                <div class="remind"><span v-if="goodsList.length > 0" class="selected">已选择 {{goodsList.length}} 件商品</span>(指定此券可以在哪些商品上使用)</div>
              </div>
              <div v-if="goodsList.length" class="goods-list-box">
                <div class="commodities-list-header com-list-box commodities-list-top">
                  <div v-for="(item, index) in commodities" :key="index" class="com-list-item">{{item}}</div>
                </div>
                <div class="big-box">
                  <div v-for="(item, index) in goodsList" :key="index" class="com-list-box com-list-content">
                    <div class="com-list-item">{{item.name}}</div>
                    <div class="com-list-item">{{item.sale_unit || item.goods_units}}</div>
                    <div class="com-list-item">¥{{item.trade_price || 0}}</div>
                    <div class="com-list-item">{{item.usable_stock || 0}}</div>
                    <div class="com-list-item">
                      <span :class="{'list-operation-disable': disable}" class="list-operation" @click="_showDelGoods('goods', item, index)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div :class="{'text-no-change':disable}"></div>
      </div>

      <!--类型-->
      <div class="edit-item short-top">
        <div class="edit-title">
          <span class="start">*</span>
          优惠券类型
        </div>
        <div class="edit-input-box">
          <div class="checkbox">
            <p class="check-item" @click="changeCheck(2)"><span :class="['item-icon', {'checked': +msg.preferential_type === 2}]"></span>满减券</p>
            <p class="check-item" @click="changeCheck(1)"><span :class="['item-icon', {'checked': +msg.preferential_type === 1}]"></span>折扣券</p>
          </div>
        </div>
        <div :class="{'text-no-change':disable}"></div>
      </div>

      <!--减免金额-->
      <div class="edit-item short-top">
        <div class="edit-title">
          <span class="start">*</span>
          {{+msg.preferential_type === 1 ? '折扣额度' : '减免金额'}}
        </div>
        <div class="edit-input-box">
          <div class="no-wrap">
            <input v-model="msg.denomination"
                   type="number"
                   class="edit-input"
                   :readonly="disable"
                   maxlength="12"
                   :class="{'disable-input':disable}"
            >
            <span>{{+msg.preferential_type === 1 ? '折' : '元'}}</span>
          </div>
        </div>
        <div :class="{'text-no-change':disable}"></div>
      </div>

      <!--使用条件-->
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          使用条件
        </div>
        <div class="edit-input-box">
          <div class="no-wrap">
            <div class="threshold" @click="changeCheck(2)">
              <span style="margin-right: 10px">消费金额满</span>
            </div>
            <input v-model="msg.condition"
                   type="number"
                   class="edit-input"
                   style="width: 318px"
                   :readonly="disable"
                   maxlength="12"
                   :class="{'disable-input':disable}"
            >
            <span>元</span>
          </div>
        </div>
        <div :class="{'text-no-change':disable}"></div>
      </div>

      <!--数量-->
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          发放总量
        </div>
        <div class="edit-input-box">
          <div class="no-wrap">
            <input v-model="msg.usable_stock"
                   type="number"
                   placeholder="最多100000000张"
                   class="edit-input"
                   :readonly="(disable && !editId)"
                   maxlength="12"
                   :class="{'disable-input': (disable && !editId)}"
            >
            <span>张</span>
          </div>
        </div>
        <div :class="{'text-no-change':(disable && !editId)}"></div>
      </div>

      <!--时间-->
      <div class="edit-item short-top">
        <div class="edit-title">
          <span class="start">*</span>
          用券时间
        </div>
        <div class="wrap">
          <div class="select-item">
            <div class="checkbox hand" @click="changeLimit">
              <span :class="['item-icon', {'checked': +msg.is_day_limited === 0}]"></span>
              <span class="text">固定时间</span>
            </div>
            <div class="checkbox hand" @click="changeLimit">
              <span :class="['item-icon', {'checked': +msg.is_day_limited === 1}]"></span>
              <span class="text">领取后生效</span>
            </div>
          </div>
          <div v-if="+msg.is_day_limited === 0" class="time-select">
            <date-picker
              v-model="msg.start_at"
              :editable="false"
              class="edit-input-box"
              type="datetime"
              placeholder="选择开始时间"
              style="width: 240px;height: 40px;border-radius: 1px"
              valueFormat="yyyy-MM-dd HH:mm:ss"
              @change="_getStartTime"
            ></date-picker>
            <div class="tip-text">至</div>
            <date-picker
              v-model="msg.end_at"
              :editable="false"
              class="edit-input-box"
              type="datetime"
              placeholder="选择结束时间"
              style="width: 240px;height: 40px;border-radius: 1px"
              valueFormat="yyyy-MM-dd HH:mm:ss"
              @change="_getEndTime"
            ></date-picker>
          </div>
          <div v-if="+msg.is_day_limited === 1" class="select-day">
            <span>领取当日起</span>
            <input v-model="msg.limit_days" type="text" class="day-item">
            <span>天内可用</span>
          </div>
        </div>
        <div :class="{'check-no-change':disable}"></div>
      </div>

      <!--使用说明-->
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          使用说明
        </div>
        <div class="edit-input-box">
          <div class="no-wrap">
            <textarea v-model="msg.description"
                      type="text"
                      class="edit-input edit-textarea"
                      placeholder="例如: 全场商品通用或特惠商品不可以使用"
                      :readonly="disable"
                      maxlength="50"
                      :class="{'disable-input':disable}"
            >
            </textarea>
            <span class="tip"></span>
          </div>
          <div class="textarea-num">{{msg.description ? msg.description.length : 0}}/50</div>
        </div>
        <div :class="{'text-no-change':disable}"></div>
      </div>
      <!--<p @click="testForm">测试</p>-->
    </div>

    <!-- 选择品类弹窗-->
    <default-modal ref="categoryModal">
      <div slot="content" class="shade-box">
        <div class="title-box">
          <div class="title">选择品类</div>
          <span class="close hand" @click="_cancelModal"></span>
        </div>
        <!--列表-->
        <div class="category-content">
          <div class="coupon-category-list">
            <div v-for="(item, index) in categoryList" :key="index" class="category-item hand" @click="selectCategory(item, index)">
              <div class="left">
                <span :class="['check', {'checked': item.checked}, {'right': item.right}]"></span>
                <span class="name">{{item.name}}</span>
              </div>
              <span class="count">{{item.goods_count || 0}}个商品</span>
            </div>
          </div>
        </div>
        <!--翻页器-->
        <!--<div class="page-box">
          <base-pagination ref="paginationCategory" :pageDetail="goodsPage" @addPage="_getMoreGoods"></base-pagination>
        </div>-->
        <div class="back">
          <div class="back-cancel back-btn hand" @click="_cancelModal">取消</div>
          <div class="back-btn back-submit hand" @click="_addition">确定</div>
        </div>
      </div>
    </default-modal>

    <!-- 选择商品弹窗-->
    <default-modal ref="goodsModal">
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
            <base-search ref="goodsSearch" placeHolder="请输入商品名称" @search="_searchGoods"></base-search>
          </div>
        </div>
        <div class="goods-content">
          <div class="goods-title">
            <div v-for="(item, index) in goodsTitle" :key="index" class="title-item" :style="{flex: item.flex}">{{item.name}}</div>
          </div>
          <div class="category-list">
            <div v-for="(item, index) in chooseGoods" :key="index" class="goods-item">
              <div v-for="(title, ind) in goodsTitle" :key="ind" class="item-content hand" :style="{flex: title.flex}" @click="_selectGoods(item,index)">
                <span v-if="title.value === 'name'" class="select-icon" :class="{'select-icon-disable': item.selected === 1, 'select-icon-active': item.selected === 2}"></span>
                <div v-if="title.value === 'name'" class="goods-img" :style="{'background-image': 'url(' + item.goods_cover_image + ')'}"></div>
                <div class="value">{{title.value === 'trade_price' ? '¥' : ''}}{{item[title.value]}}</div>
              </div>
              <!--<div class="add-btn btn-main" :class="{'add-btn-disable': item.selected === 1}" @click="_additionOne(item, index)">{{item.selected === 1 ? '已添加' : '添加'}}</div>-->
            </div>
          </div>
        </div>
        <div class="page-box">
          <p class="select-all hand" @click="_selectAllGoods()"><span class="select-icon" :class="{'select-icon-active': selectAll}"></span>全选</p>
          <base-pagination ref="pagination" :pageDetail="goodsPage" @addPage="_getMoreGoods"></base-pagination>
        </div>
        <div class="back">
          <div class="back-cancel back-btn hand" @click="_cancelModal">取消</div>
          <div class="back-btn back-submit hand" @click="_batchAddition">批量添加</div>
        </div>
      </div>
    </default-modal>

    <!--选择商品弹窗-->
    <add-goods ref="selectGoods" :goodsType="goodsTypeNumber" @batchAddition="batchAddition"></add-goods>
    <!--确定取消弹窗-->
    <default-confirm ref="confirm" @confirm="_delGoods"></default-confirm>
    <div class="back">
      <div class="back-cancel back-btn hand" @click="_back">取消</div>
      <div :class="{'btn-disable': (disable && !editId)}" class="back-btn back-submit hand" @click="_saveActivity">保存</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import AddGoods from '@components/add-goods/add-goods'
  import {couponComputed, couponMethods} from '@state/helpers'
  import API from '@api'
  import _ from 'lodash'
  // import {DatePicker} from 'iview'
  import {DatePicker} from 'element-ui'

  const PAGE_NAME = 'MEW_COUPON'
  const TITLE = '新建查看优惠券'
  const MONEYREG = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
  const COUNT_TRIM = /^(([0-9]*)|(([0]\.\d{1}|[1-9]*\.\d{1})))$/
  const COUNTREG = /^[1-9]\d*$/
  const RATE = /^[0-9]\d*$/
  const COMMODITIES_LIST = ['商品名称', '单位', '售价(元)', '库存', '操作']
  const CATEGORY_TITLE = [
    {name: '品类名称', class: 'title-item', flex: 2, value: 'name'},
    {name: '商品数量', class: 'title-item', flex: 2, value: 'goods_count'},
    {name: '操作', class: 'title-item', flex: 0.2, value: ''}
  ]

  const GOODS_POP_TITLE = [
    {name: '商品名称', flex: 2, value: 'name'},
    {name: '库存', flex: 1, value: 'usable_stock'},
    {name: '销售价格', flex: 1, value: 'trade_price'}
  ]

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultModal,
      DefaultConfirm,
      AddGoods,
      DatePicker
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        goodsTitle: GOODS_POP_TITLE,
        id: null,
        editId: '',
        couponPage: 1,
        chooseGoods: [],
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
        useRange: {
          check: false,
          show: false,
          content: '全部商品',
          type: 'default',
          data: [{name: '全部商品', id: 1}, {name: '指定品类可用', id: 2}, {name: '指定商品可用', id: 3}] // 格式：{title: '55'}}
        },
        parentId: '',
        goodsPage: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        keyword: '',
        selectGoods: [], // 单次选择的商品
        selectGoodsId: [], // 所有选择的商品id
        goodsDelId: 0,
        goodsDelIndex: 0,
        selectDelId: [],
        disable: false, // 有id不可编辑
        goodsList: [],
        msg: {
          coupon_name: '',
          preferential_type: 2,
          denomination: '', // 优惠券面额
          condition: '0', // 满多少可用
          support_activity: 0, // 是否支持活动商品使用0 1
          start_at: '',
          end_at: '',
          range_type: 1, // 适用范围0未知1通用券2品类券3单品券
          ranges: [],
          limit_days: '',
          is_day_limited: 0,
          description: '',
          tag_type: 0
        },
        isSubmit: false, // 在提交
        categoryShow: false, // 选择品类弹窗
        categoryList: [],
        categoryTitle: CATEGORY_TITLE,
        categoryCheckItem: {}, // 选中的品类
        categorySelectList: [], // 确定选择的品类
        selectCategoryList: [], // 已选品类
        priceFocus: '', // 聚焦活动手机
        sortFocus: '', // 聚焦排序
        checkFull: false,
        delType: '',
        selectAll: false,
        goodsTypeNumber: ''
      }
    },
    computed: {
      ...couponComputed,
      testName() {
        // 优惠名称
        return this.msg.coupon_name
      },
      testMoney() {
        // 优惠价格
        if (this.msg.preferential_type === 2) {
          return this.msg.denomination && RATE.test(this.msg.denomination)
        } else {
          return true
        }
      },
      testMoneyReg() {
        // 优惠价格
        if (this.msg.preferential_type === 2) {
          if (this.msg.condition > 0) {
            return +this.msg.denomination >= 1 && +this.msg.denomination <= this.msg.condition
          } else {
            return +this.msg.denomination >= 1
          }
        } else {
          return true
        }
      },
      testDiscount() {
        if (this.msg.preferential_type === 1) {
          return this.msg.denomination && MONEYREG.test(this.msg.denomination)
        } else {
          return true
        }
      },
      testDiscountNum() {
        if (this.msg.preferential_type === 1) {
          return +this.msg.denomination >= 0.1 && +this.msg.denomination <= 9.9
        } else {
          return true
        }
      },
      testDiscountReg() {
        if (this.msg.preferential_type === 1) {
          return COUNT_TRIM.test(this.msg.denomination)
        } else {
          return true
        }
      },
      testCount() {
        // 发放数量
        return this.msg.usable_stock
      },
      testCountReg() {
        // 发放数量数字类型
        return this.msg.usable_stock && COUNTREG.test(this.msg.usable_stock)
      },
      testCountNum() {
        return this.msg.usable_stock >= 1 && this.msg.usable_stock <= 100000000
      },
      testCountNew() {
        if (this.editId) {
          return this.msg.usable_stock >= this.couponDetail.usable_stock
        } else {
          return true
        }
      },
      testCondition() {
        return this.msg.condition && RATE.test(this.msg.condition)
      },
      testStart() {
        // 开始时间
        if (+this.msg.is_day_limited === 0) {
          return this.msg.start_at
        } else {
          return true
        }
      },
      testEnd() {
        // 结束时间
        if (+this.msg.is_day_limited === 0) {
          return this.msg.end_at
        } else {
          return true
        }
      },
      testEndDate() {
        // 结束时间规则判断
        if (+this.msg.is_day_limited === 0) {
          return (
            // Date.parse(this.msg.end_at.replace(/-/g, '/') + ' 00:00') >
            // Date.parse('' + this.msg.start_at.replace(/-/g, '/') + ' 00:00')
            Date.parse(this.msg.end_at.replace(/-/g, '/')) > Date.parse(this.msg.start_at.replace(/-/g, '/'))
          )
        } else {
          return true
        }
      },
      testLimitDays() {
        if (+this.msg.is_day_limited === 1) {
          return this.msg.limit_days
        } else {
          return true
        }
      },
      testDescription() {
        return this.msg.description
      },
      testGoods() {
        return +this.msg.range_type === 3 ? this.goodsList && this.goodsList.length : true
      },
      testCategory() {
        return +this.msg.range_type === 2 ? this.selectCategoryList.length > 0 : true
      }
    },
    watch: {},
    beforeCreate() {
    ;(this.$route.query.id && this.$route.query.editId) ||
      this.$store.commit('global/SET_CURRENT_TITLES', ['商城', '营销', '优惠券', '新建优惠券'])
    this.$route.query.id && this.$store.commit('global/SET_CURRENT_TITLES', ['商城', '营销', '优惠券', '查看优惠券'])
    this.$route.query.editId &&
      this.$store.commit('global/SET_CURRENT_TITLES', ['商城', '营销', '优惠券', '编辑优惠券'])
    },
    created() {
      this.disable = this.$route.query.id || this.$route.query.editId
      this.editId = this.$route.query.editId || null
      this.id = this.$route.query.id || this.$route.query.editId || null
      // 详情信息
      if (this.id) {
        let obj = _.cloneDeep(this.couponDetail)
        // this.categorySelectItem.social_name = obj.social_name
        if (+obj.range_type === 1) {
          this.$set(this.useRange, 'content', '全部商品')
        } else if (+obj.range_type === 2) {
          this.$set(this.useRange, 'content', '指定品类可用')
          this.selectCategoryList = obj.ranges
        } else if (+obj.range_type === 3) {
          this.$set(this.useRange, 'content', '指定商品可用')
          this.goodsList = obj.ranges
          this.selectGoodsId = obj.ranges.map((item) => {
            return item.range_id
          })
        }
        this.msg = obj
      }
    },
    async mounted() {
      await this._getFirstAssortment()
    },
    methods: {
      ...couponMethods,
      changeCheck(num) {
        this.msg.preferential_type = num
      },
      changeLimit() {
        this.$set(this.msg, 'is_day_limited', this.msg.is_day_limited ? 0 : 1)
      },
      _getStartTime(time) {
        this.msg.start_at = time
      },
      _getEndTime(time) {
        this.msg.end_at = time
      },
      // testForm() {
      //   console.log(this.testCondition, this.msg.condition)
      // },
      // 选择商品
      async _getGoodsList() {
        let res = await API.Coupon.getGoodsList({
          is_online: 1,
          keyword: this.keyword,
          goods_category_id: this.parentId,
          limit: 7,
          page: this.couponPage
        })
        if (res.error !== this.$ERR_OK) {
          return
        }
        this.goodsPage = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        this.chooseGoods = res.data.map((item, index) => {
          item.selected = 0
          let idx = this.goodsList.findIndex((goods) => goods.id === item.id)
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
          return item
        })
      },
      changePrice(index) {
        this.priceFocus = index
      },
      changeSort(index) {
        this.sortFocus = index
      },
      inputBlur() {
        this.priceFocus = ''
        this.sortFocus = ''
      },
      // 获取分页商品列表
      async _getMoreGoods(page) {
        this.couponPage = page
        await this._getGoodsList()
      },
      // 选择一级分类
      async _secondAssortment(item) {
        this.parentId = item.id
        if (item.id === '') {
          this.secondAssortment.data = []
        } else {
          let res = await API.Outreach.goodsCategory({parent_id: this.parentId, get_goods_count: 1})
          this.secondAssortment.data = res.error === this.$ERR_OK ? res.data : []
          this.secondAssortment.data.unshift({name: '全部', id: this.parentId})
        }
        this.secondAssortment.content = '选择二级分类'
        this.couponPage = 1
        this.$refs.pagination.beginPage()
        await this._getGoodsList()
      },
      // 选择二级分类
      async _choessSecondAssortment(item) {
        this.parentId = item.id
        this.couponPage = 1
        this.$refs.pagination.beginPage()
        await this._getGoodsList()
      },
      // 获取一级分类
      async _getFirstAssortment() {
        let res = await API.Outreach.goodsCategory({parent_id: this.parentId, get_goods_count: 1})
        this.assortment.data = res.error === this.$ERR_OK ? res.data : []
        this.assortment.data.unshift({name: '全部', id: ''})
        this.categoryList = res.error === this.$ERR_OK ? res.data : []
        this.categoryList = this.categoryList.slice(1)
      },
      // 搜索商品/搜索品类
      async _searchGoods(text) {
        this.keyword = text
        this.couponPage = 1
        this.$refs.pagination.beginPage()
        await this._getGoodsList()
      },
      // 勾选商品
      _selectGoods(item, index) {
        switch (item.selected) {
        case 0:
          // if (this.selectGoodsId.length === 10) {
          //   this.$toast.show('选择商品数量不能超过十个')
          //   return
          // }
          this.chooseGoods[index].selected = 2
          this.selectGoods.push(item)
          this.selectGoodsId.push(item.id)
          break
        case 2:
          this.chooseGoods[index].selected = 0
          this.selectAll = false
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
      _selectAllGoods() {
        this.selectAll = !this.selectAll
        this.selectGoods = []
        this.selectGoodsId = []
        if (this.selectAll) {
          this.chooseGoods.map((item) => {
          ;+item.selected === 0 && (item.selected = 2)
          ;+item.selected === 2 && this.selectGoods.push(item)
          this.selectGoodsId.push(item.id)
          return item
          })
        } else {
          this.chooseGoods.map((item) => {
            if (+item.selected === 2) {
              item.selected = 0
            }
            if (+item.selected === 1) {
              // this.selectGoods.push(item)
              this.selectGoodsId.push(item.id)
            }
            return item
          })
        }
      },
      // 删除商品
      _showDelGoods(type, item, index) {
        if (this.disable) {
          return
        }
        this.goodsDelId = item.goods_id || item.id
        this.goodsDelIndex = index
        this.delType = type
        this.$refs.confirm.show(`是否确定删除该${type === 'category' ? '品类' : '商品'}？`)
      },
      // 删除商品弹窗
      _delGoods() {
        if (this.delType === 'category') {
          this.selectCategoryList.splice(this.goodsDelIndex, 1)
          this.categorySelectList.splice(this.goodsDelIndex, 1)
          this.categoryList.map((item) => {
            if (item.id === this.goodsDelId) {
              item.right = false
              item.checked = false
            }
          })
        } else {
          this.selectGoodsId.splice(this.goodsDelIndex, 1)
          this.goodsList.splice(this.goodsDelIndex, 1)
          this.selectDelId.push(this.goodsDelId)
        }
      },
      _cancelModal() {
        if (this.categoryShow) {
          this.categoryShow = false
          this.categoryCheckItem = {}
          this.categoryList = this.categoryList.map((item, ind) => {
            let index = this.categorySelectList.findIndex((val) => {
              return item.id === val.id
            })
            if (index > -1) {
              item.checked = false
            }
            return item
          })
          this.$refs.categoryModal.hideModal()
        } else {
          this.selectGoods.forEach((item) => {
            let idx = this.chooseGoods.findIndex((items) => items.goods_id === item.goods_id)
            let delIdx = this.selectGoodsId.findIndex((id) => id === item.goods_id)
            this.chooseGoods[idx].selected = this.chooseGoods[idx].selected === 1 ? 1 : 0
            this.selectGoodsId.splice(delIdx, 1)
          })
          this.selectGoods = []
          this._hideGoods()
        }
      },
      // 单个添加
      _additionOne(item, index) {
        if (item.selected === 1) return
        // if (this.selectGoodsId.length === 20 && item.selected !== 2) {
        //   this.$toast.show('选择商品数量不能超过十个')
        //   return
        // }
        if (item.selected !== 2) this.selectGoodsId.push(item.id)
        this.chooseGoods[index].selected = 1
        this.goodsList.push(item)
        this.chooseGoods.forEach((item) => {
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
        this.chooseGoods = this.chooseGoods.map((item) => {
          item.selected = item.selected === 2 ? 1 : item.selected
          return item
        })
        this.goodsList = this.goodsList.concat(this.selectGoods)
        this.selectGoods = []
        this._hideGoods()
      },
      // 批量添加商品
      batchAddition(list) {
        this.goodsList = list
      },
      async _showGoods() {
        if (this.disable) return
        this.$refs.selectGoods && this.$refs.selectGoods.showModal(this.goodsList)
      // this._initData()
      // this.$refs.goodsSearch._setText('')
      // await this._getGoodsList()
      // 展示添加商品弹窗
      // this.$refs.goodsModal.showModal()
      },
      _hideGoods() {
        this.$refs.goodsModal.hideModal()
        this.selectAll = false
      },
      async _showCategory() {
        if (this.disable) {
          return
        }
        this._initData()
        this.categorySelectList = []
        // 展示品类弹窗
        this.$refs.categoryModal.showModal()
        this.categoryShow = true
      },

      _initData() {
        this.couponPage = 1
        this.keyword = ''
        this.$refs.pagination && this.$refs.pagination.beginPage()
        this.$refs.paginationCategory && this.$refs.paginationCategory.beginPage()
      },

      // 选择品类
      selectCategory(item, index) {
        // this.categoryCheckItem = item
        if (item.right) return
        if (item.checked) {
          this.categoryList = this.categoryList.map((item, ind) => {
            index === ind && (item.checked = false)
            return item
          })
          let idx = this.categorySelectList.findIndex((items) => items.id === item.id)
          idx > -1 && this.categorySelectList.splice(idx, 1)
        } else {
          if (this.selectCategoryList.length > 0 || this.categorySelectList.length > 0) {
            this.$toast.show('只能选择一个品类')
            return
          }
          this.categoryList = this.categoryList.map((item, ind) => {
            index === ind && (item.checked = true)
            return item
          })
          this.categorySelectList.push(item)
        }
      },
      // 确定选择品类
      _addition() {
        this.selectCategoryList = [...this.selectCategoryList, ...this.categorySelectList]
        this.categoryList = this.categoryList.map((item) => {
          item.checked && (item.right = true)
          return item
        })
        this.$refs.categoryModal.hideModal()
      },
      _back() {
        this.$router.back()
      },
      _selectRange(item) {
        this.msg.range_type = item.id
      },
      //  保存
      async _saveActivity() {
        if ((this.disable && !this.editId) || this.isSubmit) return
        let checkForm = this.checkForm()
        if (!checkForm) return
        let data = {}
        data = Object.assign({}, this.msg)
        // 添加coupon_range_id
        if (+this.msg.range_type === 2) {
          // this.categorySelectItem.coupon_range_id = this.categorySelectItem.coupon_range_id || 0
          // this.categorySelectItem.range_id = this.categorySelectItem.id || 0
          data.ranges = this.selectCategoryList.map((item) => {
            return {
              coupon_range_id: item.coupon_range_id || 0,
              range_id: item.id || 0
            }
          })
        } else if (+this.msg.range_type === 3) {
          this.goodsList.forEach((item) => {
            item.range_id = item.id || 0
            item.coupon_range_id = item.coupon_range_id || 0
          })
          let list = this.goodsList
          data = Object.assign({}, this.msg, {ranges: list})
        }
        let res = null
        this.isSubmit = true
        // 调用保存活动接口
        if (this.editId) {
          res = await API.Coupon.editCoupon({
            coupon_name: data.coupon_name,
            usable_stock: data.usable_stock,
            id: this.editId
          })
        } else {
          res = await API.Coupon.storeCoupon(data, true)
        }
        if (res.error !== this.$ERR_OK) {
          this.$toast.show(res.message)
          this.$loading.hide()
          this.isSubmit = false
          return
        }
        this.$loading.hide()
        this.$toast.show('保存成功')
        setTimeout(() => {
          this._back()
        }, 1000)
      },
      checkForm() {
        let arr = [
          {value: this.testName, txt: '请输入活动名称'},
          {value: this.testGoods, txt: '请选择商品'},
          {value: this.testCategory, txt: '请选择品类'},
          {value: this.testMoney, txt: '减免金额应设为小于使用条件金额的整数'},
          {value: this.testMoneyReg, txt: '优惠券面值应设为小于使用条件金额的整数'},
          {value: this.testDiscount, txt: '请输入0.1到9.9之间的折扣数'},
          {value: this.testDiscountNum, txt: '请输入0.1到9.9之间的折扣数'},
          {value: this.testDiscountReg, txt: '请输入0.1到9.9之间的折扣数'},
          {value: this.testCondition, txt: '满减金额数必须为整数'},
          {value: this.testCount, txt: '发放数量应设为1~100000000之间的整数'},
          {value: this.testCountReg, txt: '发放数量应设为1~100000000之间的整数'},
          {value: this.testCountNum, txt: '发放数量应设为1~100000000之间的整数'},
          {value: this.testCountNew, txt: '发放数量只可增加不可减少'},
          {value: this.testStart, txt: '请选择用券开始时间'},
          {value: this.testEnd, txt: '请选择用券结束时间'},
          {value: this.testEndDate, txt: '用券结束时间必须大于开始时间'},
          {value: this.testLimitDays, txt: '请输入领取后可用天数'},
          {value: this.testDescription, txt: '请输入使用说明'}
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
  .new-coupon
    padding-bottom: 20px
    position: relative
    flex: 1
    font-family: $font-family-regular
    font-size: $font-size-14
  .content-header
    justify-content: flex-start
  .admin-select-box
    color: #333 !important
  .margin-top
    margin-top: 24px

  .form-content
    margin-bottom: 27px
  .edit-item
    display: flex
    color: #2A2A2A
    min-height: 40px
    margin-top: 24px
    position: relative
    .edit-title
      margin-top: 7.5px
      white-space: nowrap
      text-align: right
      min-width: 90px
      .start
        display: inline-block
        margin-right: -2px
        color: #F52424
    .checkbox
      height: 24px
      margin-top: 7.5px
      .check-item
        float: left
        margin-right: 60px
        display: flex
        align-items: center
        cursor: pointer
    .item-icon
      width: 16px
      height: 16px
      border: 1px solid #E1E1E1
      display: block
      position: relative
      margin-right: 5px
      border-radius: 50%
      transition: all 0.3s
    .checked
      border: 5px solid $color-main

    .edit-input-box
      margin: 0 14px 0 40px
      position: relative
      color: #333
      .edit-input
        font-size: $font-size-14
        padding: 0 14px
        border-radius: 1px
        width: 400px
        height: 40px
        display: flex
        align-items: center
        margin-right: 10px
        justify-content: space-between
        border: 1px solid $color-line
        transition: all 0.3s
        -moz-appearance: textfield

        &:hover
          border-color: #ACACAC
        &:focus
          border-color: $color-main
      .edit-textarea
        height: 94px
        resize: none
        padding: 4px 14px
      .no-wrap
        display: flex
        align-items: center
        .tip
          color: $color-text-assist
      .disable-input
        background: #F5F5F5
        color: #ACACAC
      .icon
        width: 0
        height: 0
        border: 6px solid #333
        position: absolute
        margin-top: 4px
        right: 10px
        col-center()
        border-bottom-color: transparent
        border-left: 4px solid transparent
        border-right: 4px solid transparent

      .num
        col-center()
        right: 20px
        color: #ACACAC
      .textarea-num
        position: absolute
        left: 360px
        bottom: 6px
        color: $color-text-assist
      .description
        display: flex
        align-items: center
        margin-top: 15px
        cursor: pointer
        .tip
          color: $color-text-assist
    .input-box
      margin: 0 14px 0 40px
    .edit-input-right
      margin-left: 14px
    .tip-text
      line-height: 40px
      color: #333
    .wrap
      .time-select
        display: flex
        align-items: center
        margin: 20px 0 0 40px
        width: 560px
        height: 80px
        background: #f5f7fa
        border: 1px solid #E9ECEE
        .edit-input-box
          margin-left: 20px
          .text
            border-radius: 1px
      .select-item
        margin-left: 40px
        display: flex
        align-items: center
        .checkbox
          display: flex
          align-items: center
        .text
          margin-right: 60px
      .select-day
        width: 400px
        height: 80px
        margin-top: 20px
        margin-left: 40px
        display: flex
        padding-left: 20px
        align-items: center
        background: #f5f7fa
        border: 1px solid #E9ECEE
      .day-item
        width: 138px
        height: 34px
        box-sizing: border-box
        padding: 0 10px
        margin: 0 14px 0 10px
        border: 1px solid $color-line
    .time-no-change,.text-no-change,.check-no-change
      position: absolute
      left: 127px
      top: 0
      width: 550px
      height: 50px
      z-index: 100
    .text-no-change
      cursor: not-allowed
    .check-no-change
      cursor: not-allowed
      height: 100px

  .short-top
    margin-top: 14px
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
          &:last-child
            flex: 0.2

  .history-record
    box-sizing: border-box
    padding: 0 20px
    padding-bottom: 80px

  .activity-tab
    margin: 24px 0
    display: flex
    align-items: center
    box-sizing: border-box
    .edit-title
      white-space: nowrap
      text-align: right
      min-width: 90px
      margin-right: 40px
      .start
        display: inline-block
        margin-right: -2px
        color: #F52424
    .remind
      margin-left: 10px
      color: $color-text-assist
      .selected
        color: #333
    .add-goods-btn
      box-sizing: border-box
      height: 32px
      line-height: 32px
      width: 108px
      font-size: $font-size-14
      font-family: $font-family-regular
      transition: all 0.3s
      .add-icon
        margin-right: 5px
        margin-left: 0


  //  弹窗
  .shade-box
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
    border-radius: 2px
    background: $color-white
    height: 720px
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
      border-radius: 1px
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
          height: 40px
          border-radius: 1px
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

    .btn-category
      margin-top: 40px
      text-align: center
      display: flex
      justify-content: flex-end
      user-select: none
      .btn
        width: 96px
        height: 40px
        line-height: 40px
        border-radius: 1px
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
    border-radius: 1px
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.6)
    text-align: center
    .btn-category-confirm
      text-align: center
      display: flex
      justify-content: center
      user-select: none
      .btn
        width: 96px
        height: 40px
        line-height: 40px
        border-radius: 1px
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
      height: 40px
      line-height: 40px
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

  .page-box
    padding: 0 20px
    box-sizing: border-box
    height: 77px
    align-items: center
    display: flex
    .select-all
      width: 100px
      display: flex
      align-items: center
      -webkit-user-select: none
      -moz-user-select: none
      -ms-user-select: none
      -khtml-user-select: none
      user-select: none
    .select-icon
      margin-right: 20px
      border-radius: 1px
      border: 1px solid #e9ecee
      height: 16px
      width: 16px
      display: inline-block
      -webkit-transition: all .3s
      transition: all .3s
    .select-icon-active
      border: 1px solid transparent
      display: inline-block
      background-size: 100% 100%
      background-image: url("./icon-check@2x.png")
  .goods-content
    border-radius: 4px
    height: 465px
    .goods-title
      display: flex
      height: 45px
      background: #F5F7FA
      position: relative
      align-items: center
      padding: 0 30px 0 20px
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
      .title-item
        padding-right: 20px
      .title-item:first-child
        text-indent: 36px
        box-sizing: border-box
    .category-list
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
        .item-content
          padding-right: 20px
          display: flex
          align-items: center
        .goods-img
          margin-right: 10px
          width: 40px
          height: @width
          overflow: hidden
          background-repeat: no-repeat
          background-size: cover
          background-position: center
          background-color: $color-background
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

  .category-content
    border-radius: 1px
    margin: 7px 0 0
    height: 480px
    overflow-y: auto
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
    .coupon-category-list
      font-size: $font-size-14
      color: #333
      font-family: $font-family-regular
      .category-item
        height: 60px
        line-height: 18px
        display: flex
        align-items: center
        justify-content: space-between
        padding: 0 20px
        border: 0.5px solid $color-line
        border-top: 0
        &:first-child
          border-top: 0.5px solid $color-line
        &:nth-child(2n-1)
          background: #F5F7FA
        .left
          display: flex
          align-items: center
        .check
          width: 16px
          height: 16px
          margin-right: 20px
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
    border-radius: 1px
    box-sizing: border-box
    border: 1px solid $color-line
    padding-left: 22px
    transition: all 0.3s
    &::-webkit-inner-spin-button
      appearance: none
    &:hover
      border-color: #ACACAC
    &::placeholder
      font-family: $font-family-regular
      color: $color-text-assist
    &:focus
      border-color: $color-main !important
  .no-border
    border-width: 0
    background: rgba(255,255,255,0)
  .small-money
    col-center()
    left: 10px
    line-height: 1.1
    font-size: $font-size-13
    font-family: $font-family-regular
    color: $color-text-main

  .com-edit-small
    width: 60px
  .goods-list-box
    background: $color-white
    overflow: visible
    display: flex
    flex-direction: column
    flex: 1
</style>
