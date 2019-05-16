<template>
  <div class="edit-rush detail-content">
    <div class="identification">
      <div class="identification-page">
        <img src="./icon-new_commodity@2x.png" class="identification-icon">
        <p class="identification-name">{{disable ? '查看活动' : '新建活动'}}</p>
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
          <input v-model="msg.activity_name" type="text" placeholder="请输入" class="edit-input" :class="{'disable-input': disable}">
        </div>
        <div :class="{'text-no-change':disable}"></div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          活动时间
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
        <div class="tip-text">开始时间必须大于等于当前时间(精确到年月日时分秒)</div>
        <div :class="{'time-no-change':disable}"></div>
      </div>
      <!--<p @click="test">测试</p>-->
    </div>

    <div class="content-header">
      <div class="content-title">活动商品</div>
    </div>
    <div class="activity-box">
      <div class="activity-list">
        <div class="activity-tab">
          <div :class="{'disable': disable}" class="add-goods-btn hand" @click="_showGoods">
            <img class="icon" src="./icon-add@2x.png" alt="">
            添加商品
          </div>
          <div class="remind">商品数量一共可添加10个</div>
        </div>
        <div v-if="goodsList.length" class="rush-list-box">
          <div class="commodities-list-header com-list-box commodities-list-top">
            <div v-for="(item, index) in commodities" :key="index" class="com-list-item">{{item}}</div>
          </div>
          <div class="big-box">
            <div v-for="(item, index) in goodsList" :key="index" class="com-list-box com-list-content">
              <div class="com-list-item">{{item.name}}</div>
              <div class="com-list-item">{{item.sale_unit || item.goods_units}}</div>
              <div class="com-list-item">¥{{item.original_price}}</div>
              <div class="com-list-item">{{item.sale_count || 0}}</div>
              <div class="com-list-item">
                <input v-model="item.trade_price" type="number" :readonly="disable" class="com-edit">
                <span v-if="item.original_price" class="small-money">¥</span>
              </div>
              <div class="com-list-item">
                <input v-model="item.person_all_buy_limit" :readonly="disable" type="number" class="com-edit com-edit-small">
              </div>
              <div class="com-list-item">
                <input v-model="item.usable_stock" :readonly="disable" type="number" class="com-edit com-edit-small" @input="echangBase(item, index)">
              </div>
              <div class="com-list-item">
                <input v-model="item.sort" :readonly="disable" type="number" class="com-edit com-edit-small">
              </div>
              <div class="com-list-item">
                <span :class="{'list-operation-disable': disable}" class="list-operation" @click="_showDelGoods(item, index)">删除</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- 选择商品弹窗-->
    <default-modal ref="goodsModel">
      <div slot="content" class="shade-box">
        <div class="title-box">
          <div class="title">选择商品</div>
          <span class="close hand" @click="_cancelGoods"></span>
        </div>
        <div class="shade-tab">
          <div class="tab-item">
            <base-drop-down :width="218" :select="assortment" @setValue="_secondAssortment"></base-drop-down>
          </div>
          <div class="tab-item">
            <base-drop-down :width="140" :select="secondAssortment" @setValue="_choessSecondAssortment"></base-drop-down>
          </div>
          <div class="tab-item">
            <base-search placeHolder="请输入商品名称" @search="_searchGoods"></base-search>
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
                  <div class="goods-money-text">¥{{item.original_price}}</div>
                </div>
              </div>
              <div class="add-btn btn-main" :class="{'add-btn-disable': item.selected === 1}" @click="_additionOne(item, index)">{{item.selected === 1 ? '已添加' : '添加'}}</div>
            </div>
          </div>
        </div>
        <div class="page-box">
          <base-pagination ref="pagination" :pageDetail="goodsPage" @addPage="_getMoreGoods"></base-pagination>
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
  import {saleComputed, saleMethods} from '@state/helpers'
  import API from '@api'
  import _ from 'lodash'
  import {DatePicker} from 'element-ui'

  const PAGE_NAME = 'EDIT_RUSH'
  const TITLE = '新建查看今日抢购'
  const COMMODITIES_LIST = [
    '商品名称',
    '单位',
    '原售价(元)',
    '销量',
    '抢购价(元)',
    '每人限购',
    '可用库存',
    '排序',
    '操作'
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
        parentId: 0,
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
        disable: false,
        goodsList: [],
        msg: {
          activity_type: 'fixed'
        },
        isSubmit: false
      }
    },
    computed: {
      ...saleComputed,
      testName() {
        return this.msg.activity_name
      },
      testStartTime() {
        return this.msg.start_at
      },
      testStartDate() {
        // 开始时间规则判断
        return Date.parse('' + this.msg.start_at.replace(/-/g, '/')) > new Date() - 360000
      },
      testEndTime() {
        return this.msg.end_at
      },
      testEndTimeReg() {
        // 结束时间规则判断
        return Date.parse('' + this.msg.end_at.replace(/-/g, '/')) > Date.parse('' + this.msg.start_at.replace(/-/g, '/'))
      }
    },
    watch: {},
    created() {
      this.disable = this.$route.query.id
      this.id = this.$route.query.id || this.$route.query.editId || null
      if (this.id) {
        let obj = _.cloneDeep(this.saleDetail)
        this.goodsList = obj.activity_goods
        if (this.goodsList) {
          this.selectGoodsId = obj.activity_goods.map((item) => {
            return item.goods_id
          })
        }
        this.msg = {start_at: obj.start_at, end_at: obj.end_at, activity_name: obj.activity_name}
      }
      this._getFirstAssortment()

    // this._getGoodsList()
    },
    async mounted() {
    // this.classifyIndex = 0
    },
    methods: {
      ...saleMethods,
      _getStartTime(time) {
        this.msg.start_at = time
      },
      _getEndTime(time) {
        this.msg.end_at = time
      },
      // 选择商品
      async _getGoodsList() {
        let res = await API.Sale.getGoodsList({
          is_online: 1,
          keyword: this.keyword,
          goods_category_id: this.parentId,
          shelf_id: this.id,
          limit: 7,
          page: this.page
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
          item.trade_price = ''
          item.sort = 0
          return item
        })
      },
      // 获取分页商品列表
      async _getMoreGoods(page) {
        this.page = page
        await this._getGoodsList()
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
        this.$refs.pagination.beginPage()
        await this._getGoodsList()
      },
      // 选择二级分类
      async _choessSecondAssortment(item) {
        this.parentId = item.id
        this.page = 1
        this.$refs.pagination.beginPage()
        await this._getGoodsList()
      },
      // 获取一级分类
      async _getFirstAssortment() {
        let res = await API.Product.getCategory({parent_id: this.parentId, get_goods_count: 1})
        this.$loading.hide()
        this.assortment.data = res.error === this.$ERR_OK ? res.data : []
        this.assortment.data.unshift({name: '全部', id: ''})
      },
      // 搜索商品
      async _searchGoods(text) {
        this.keyword = text
        this.page = 1
        this.$refs.pagination.beginPage()
        await this._getGoodsList()
      },
      // 勾选商品
      _selectGoods(item, index) {
        if (item.usable_stock <= 0) {
          this.$toast.show('该商品库存为0，不能选择')
          return
        }
        switch (item.selected) {
        case 0:
          if (this.selectGoodsId.length === 10) {
            this.$toast.show('选择商品数量不能超过10个')
            return
          }
          this.choeesGoods[index].selected = 2
          item.all_stock = item.usable_stock
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
      _showDelGoods(item, index) {
        if (this.disable) {
          return
        }
        this.goodsDelId = item.goods_id
        this.goodsDelIndex = index
        this.$refs.confirm.show('是否确定删除该商品？')
      },
      // 删除商品弹窗
      _delGoods() {
        // let index = this.selectGoodsId.findIndex((item) => item === this.goodsDelId)
        this.selectGoodsId.splice(this.goodsDelIndex, 1)
        this.goodsList.splice(this.goodsDelIndex, 1)
        this.selectDelId.push(this.goodsDelId)
      },
      _cancelGoods() {
        this.selectGoods.forEach((item) => {
          let idx = this.choeesGoods.findIndex((items) => items.goods_id === item.goods_id)
          let delIdx = this.selectGoodsId.findIndex((id) => id === item.goods_id)
          this.choeesGoods[idx].selected = this.choeesGoods[idx].selected === 1 ? 1 : 0
          this.selectGoodsId.splice(delIdx, 1)
        })
        this.selectGoods = []
        this._hideGoods()
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
        if (this.selectGoodsId.length === 10 && item.selected !== 2) {
          this.$toast.show('选择商品数量不能超过10个')
          return
        }
        if (item.selected !== 2) this.selectGoodsId.push(item.id)
        this.choeesGoods[index].selected = 1
        item.all_stock = item.usable_stock
        this.goodsList.push(item)
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
          return item
        })
        this.goodsList = this.goodsList.concat(this.selectGoods)
        this.selectGoods = []
        this._hideGoods()
      },
      async _showGoods() {
        if (this.disable) {
          return
        }
        await this._getGoodsList()
        // 展示添加商品弹窗
        this.$refs.goodsModel.showModal()
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
        if (this.disable || this.isSubmit) return
        let checkForm = this.checkForm()
        if (!checkForm) return
        let list = this.goodsList
        if (!list.length) {
          this.$toast.show('请添加商品')
          return
        }
        for (let i in list) {
          if (!list[i].trade_price || !list[i].person_all_buy_limit || !list[i].usable_stock || list[i].sort === '') {
            this.$toast.show(`${list[i].name}信息不全`)
            return
          } else if (
            +list[i].trade_price < 0 ||
            +list[i].person_all_buy_limit <= 0 ||
            +list[i].usable_stock < 0 ||
            (list[i].usable_stock + '').includes('.') ||
            +list[i].sort < 0
          ) {
            this.$toast.show(`${list[i].name}输入数据有误`)
            return
          }
        }
        list.map((item) => {
          delete item.person_day_buy_limit
          item.goods_id = item.id || item.goods_id
        })
        let data = Object.assign({}, this.msg, {activity_goods: list})
        let res = null
        this.isSubmit = true
        res = await API.Sale.storeSale(data, true)
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
      test() {
        console.log(this.testStartDate, this.testEndTimeReg)
      },
      checkForm() {
        let arr = [
          {value: this.testName, txt: '请输入活动名称'},
          {value: this.testStartTime, txt: '请选择活动开始时间'},
          // {value: this.testStartDate, txt: '活动开始时间必须大于等于当前时间'},
          {value: this.testEndTime, txt: '请选择活动结束时间'},
          // {value: this.testEndTimeReg, txt: '活动结束时间必须大于开始时间'}
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
  .content-header
    justify-content: flex-start
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
      text-align: left
      min-width: 64px
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
    .time-no-change, .text-no-change
      position: absolute
      left: 103px
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
