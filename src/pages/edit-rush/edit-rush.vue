<template>
  <div class="edit-rush detail-content">
    <div class="identification">
      <div class="identification-page">
        <img src="./icon-new_commodity@2x.png" class="identification-icon">
        <p class="identification-name">{{id ? '编辑活动' : '新建活动'}}</p>
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
          <input v-model="essInformation.activity_name" type="text" placeholder="请输入" class="edit-input">
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          活动时间
        </div>
        <date-picker
          :value="essInformation.start_at"
          class="edit-input-box" type="date"
          placement="bottom-end"
          placeholder="开始时间"
          style="width: 240px;height: 40px;border-radius: 2px"
          @on-change="_getStartTime"
        ></date-picker>
        <div class="tip">至</div>
        <date-picker
          :value="essInformation.end_at"
          class="edit-input-box edit-input-right"
          type="date"
          placement="bottom-end"
          placeholder="结束时间"
          style="width: 240px;height: 40px"
          @on-change="_getEndTime"
        ></date-picker>
        <div class="tip-text">每日23点刷新活动，单人每日限购重置</div>
      </div>
    </div>
    <div class="content-header">
      <div class="content-title">活动商品</div>
    </div>
    <div class="activity-box">
      <!--<div class="classify">-->
      <!--<div v-for="(item, index) in classify" :key="index" class="classify-item hand" :class="{'classify-item-active': index === classifyIndex}" @click="_setClassify(index, item)">{{item.name}}</div>-->
      <!--</div>-->
      <!--<div :class="{'btn-disable': disable}" class="btn-main classify-manager" @click="_showEditShade">活动分类管理</div>-->
      <div class="activity-list">
        <div class="activity-tab">
          <div :class="{'btn-disable': disable}" class="add-goods-btn hand" @click="_showGoods">添加商品 +</div>
        </div>
        <div class="rush-list-box">
          <div class="commodities-list-header com-list-box commodities-list-top">
            <div v-for="(item, index) in commodities" :key="index" class="com-list-item">{{item}}</div>
          </div>
          <div class="big-box">
            <div v-for="(item, index) in goodsList" :key="index" class="com-list-box com-list-content">
              <div class="com-list-item com-list-double">{{item.name}}</div>
              <div class="com-list-item">{{item.goods_units}}</div>
              <div class="com-list-item">{{item.original_price}}</div>
              <div class="com-list-item">
                <input v-model="item.trade_price" type="number" class="com-edit">
                <span v-if="item.original_price" class="small-money">￥</span>
              </div>
              <div class="com-list-item">
                <input v-model="item.person_day_buy_limit" type="number" class="com-edit com-edit-small">
              </div>
              <div class="com-list-item">
                <input v-model="item.usable_stock" type="number" class="com-edit com-edit-small">
              </div>
              <div class="com-list-item">{{item.sale_count}}</div>
              <div class="com-list-item">
                <input v-model="item.sort" type="number" class="com-edit com-edit-small">
              </div>
              <div class="com-list-item">
                <span :class="{'list-operation-disable': disable}" class="list-operation" @click="_showDelGoods(item, index)">删除</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <!--编辑分类弹窗-->
    <default-modal ref="shadeCustom">
      <div slot="content" class="shade-box">
        <div class="title-box">
          <div class="title">
            编辑活动分类
          </div>
          <span class="close hand" @click="_hideEditShade"></span>
        </div>
        <div class="auxiliary-box">
          <div v-for="(item, index) in tagList" :key="index" class="auxiliary-item">
            <div class="text">{{item.name}}</div>
            <div class="auxiliary-model">
              <div class="img-box" @click="_showModal(false,item,index)"></div>
              <div class="img-box del" @click="_showConfirm(item.id, index)"></div>
            </div>
          </div>
          <div class="btn-main auxiliary-add" @click="_showModal(true)">新增+</div>
        </div>
        <!--小弹窗新增编辑-->
        <transition name="fade">
          <section v-show="isShow" class="default-modal-small">
            <div :class="showActive ? 'model-active' : 'model-un-active'">
              <div slot="content" class="default-input">
                <div class="title-input">
                  <div class="title">新建活动分类</div>
                  <div class="close-box hand" @click="_hideModal">
                    <div class="close"></div>
                  </div>
                </div>
                <div class="main-input">
                  <div class="main-model-box">
                    <div class="text">分类名称</div>
                    <input v-model="classifyName" type="text" class="main-input-box" placeholder="长度不能超过5位" maxlength="5">
                  </div>
                  <div class="main-model-box">
                    <div class="text">排序号</div>
                    <input v-model="classifyNum" type="number" class="main-input-box" placeholder="0" @mousewheel.native.prevent>
                  </div>
                  <div class="btn-group">
                    <span class="btn cancel" @click="_hideModal">取消</span>
                    <span class="btn confirm" @click="_operationClassify">确定</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </transition>
        <!--小弹窗新增编辑-->
        <transition name="fade">
          <section v-show="isShowConfirm" class="default-modal-small">
            <div :class="showConfirmActive ? 'model-active' : 'model-un-active'">
              <div class="default-confirm">
                <div class="confirm-content">
                  <!--<div class="title">{{title}}</div>-->
                  <div class="text">确定要删除该分类？</div>
                  <div class="btn-group-confirm">
                    <span class="btn cancel" @click="_hideConfirm">取消</span>
                    <span class="btn confirm" @click="_delItem()">确定</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </transition>
      </div>
    </default-modal>
    <!-- 选择商品弹窗-->
    <default-modal ref="goodsModel">
      <div slot="content" class="shade-box">
        <div class="title-box">
          <div class="title">
            选择商品
          </div>
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
            <div v-for="(item, index) in choessGoods" :key="index" class="goods-item">
              <span class="select-icon hand" :class="{'select-icon-disable': item.selected === 1, 'select-icon-active': item.selected === 2}" @click="_selectGoods(item,index)"></span>
              <div class="goods-img" :style="{'background-image': 'url(\'' +item.goods_cover_image+ '\')'}"></div>
              <div class="goods-msg">
                <div class="goods-name">{{item.name}}</div>
                <div class="goods-money">¥{{item.original_price}}</div>
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
      <div :class="{'btn-disable': disable}" class="back-btn back-submit hand" @click="_saveActivity">保存</div>
      <div class="back-cancel back-btn hand" @click="_back">取消</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import {rushComputed, rushMethods} from '@state/helpers'
  import API from '@api'
  import {ERR_OK} from '../../utils/config'
  import _ from 'lodash'
  import {DatePicker} from 'iview'

  const PAGE_NAME = 'EDIT_RUSH'
  const TITLE = '新建编辑今日抢购'
  const COMMODITIES_LIST = [
    '商品名称',
    '单位',
    '划线价',
    '活动价格',
    '单人每日限购',
    '活动可售数量',
    '销量',
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
        listHeight: 417,
        showActive: false,
        isShow: false,
        classifyName: '',
        classifyNum: 0,
        showConfirmActive: false,
        isShowConfirm: false,
        delId: [], // 删除id数组
        isStoreClassify: true,
        classifyChangeIdx: 0,
        id: null,
        classifyDelId: 0,
        classifyDelIndex: 0,
        tagList: [],
        tagItem: {},
        page: 1,
        choessGoods: [],
        rushMsg: [],
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
        disable: false,
        goodsList: [],
        essInformation: {activity_type: 'fixed', activity_theme: 'fixed'},
        isSubmit: false
      }
    },
    computed: {
      ...rushComputed
    },
    watch: {
      rushDetail: {
        handler(news) {
          let id = this.$route.query.id || null
          if (id) {
            let obj = _.cloneDeep(news)
            this.goodsList = obj.activity_goods
            if (this.goodsList) {
              this.selectGoodsId = obj.activity_goods.map((item) => {
                return item.goods_id
              })
            }
            this.essInformation = {start_at: obj.start_at, end_at: obj.end_at, activity_name: obj.activity_name}
          }
        },
        immediate: true
      }
    },
    async mounted() {
      // this.classifyIndex = 0
      this.disable = this.$route.query.disable && +this.$route.query.disable === 2 ? 1 : 0
      this.id = this.$route.query.id || null
      await this._getFirstAssortment()
      this._getListHeight()
      this._getGoodsList()
    },
    methods: {
      ...rushMethods,
      _getStartTime(time) {
        this.essInformation.start_at = time
      },
      _getEndTime(time) {
        this.essInformation.end_at = time
      },
      // 选择商品
      async _getGoodsList() {
        let res = await API.Rush.getGoodsList({
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
        this.choessGoods = res.data.map((item, index) => {
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
          return item
        })
      },
      // 获取分页商品列表
      async _getMoreGoods(page) {
        this.page = page
        await this._getGoodsList()
      },
      // 选择二级分类
      async _secondAssortment(item) {
        this.parentId = item.id
        let res = await API.Rush.goodsCategory({parent_id: this.parentId})
        this.secondAssortment.data = res.error === this.$ERR_OK ? res.data : []
        this.secondAssortment.data.unshift({name: '全部', id: this.parentId})
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
        let res = await API.Rush.goodsCategory({parent_id: this.parentId})
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
        switch (item.selected) {
        case 0:
          this.choessGoods[index].selected = 2
          this.selectGoods.push(item)
          this.selectGoodsId.push(item.id)
          break
        case 2:
          this.choessGoods[index].selected = 0
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
        let index = this.selectGoodsId.findIndex((item) => item === this.goodsDelId)
        this.selectGoodsId.splice(index, 1)
        this.goodsList.splice(this.goodsDelIndex, 1)
        this.selectDelId.push(this.goodsDelId)
      },
      _cancelGoods() {
        this.selectGoods.forEach((item) => {
          let idx = this.choessGoods.findIndex((items) => items.goods_id === item.goods_id)
          let delIdx = this.selectGoodsId.findIndex((id) => id === item.goods_id)
          this.choessGoods[idx].selected = this.choessGoods[idx].selected === 1 ? 1 : 0
          this.selectGoodsId.splice(delIdx, 1)
        })
        this.selectGoods = []
        this._hideGoods()
      },
      // 单个添加
      _additionOne(item, index) {
        if (item.selected === 1) {
          return
        }
        this.choessGoods[index].selected = 1
        this.goodsList.push(item)
        this.selectGoodsId.push(item.id)
        this.choessGoods.forEach((item) => {
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
        this.choessGoods = this.choessGoods.map((item) => {
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
      // 获取高度
      _getListHeight() {
        let ele = document.querySelector('html')
        let height = ele.clientHeight
        this.listHeight = height - 700
      },
      _back() {
        this.$router.back()
      },
      // 删除分类
      async _delItem() {
        // this.classifyDelId
        let res = await API.Rush.deleteTag(this.classifyDelId)
        this.$toast.show(res.message)
        if (res.error !== ERR_OK) {
          // this._hideConfirm()
          return
        }
        this.rushMsg.lists.splice(this.classifyDelIndex, 1)
        this._hideConfirm()
      },
      _showEditShade() {
        if (this.disable) {
          return
        }
        // 展示分类编辑弹窗
        this.$refs.shadeCustom.showModal()
      },
      _hideEditShade() {
        // 隐藏分类编辑弹窗
        this.$refs.shadeCustom.hideModal()
      },
      _showModal(status, item, index) {
        if (status && this.classify.length >= 10) {
          this.$toast.show('分类不能超过10个')
          return
        }
        this.isShow = true
        this.showActive = true
        this.isStoreClassify = status
        if (!status) {
          this.classifyName = item.name
          this.classifyNum = item.sort
          this.tagItem = item
          this.classifyChangeIdx = index
        }
      },
      // 新建编辑分类
      async _operationClassify() {
        let res = null
        if (this.isStoreClassify) {
          res = await API.Rush.storeTag({name: this.classifyName, sort: this.classifyNum, shelf_id: this.id})
          this.$toast.show(res.message)
          if (res.error !== this.$ERR_OK) {
            return
          }
          let obj = {name: this.classifyName, sort: this.classifyNum, id: res.data.id}
          this.rushMsg.lists.push({shelf_tag: obj, activity_goods: []})
        } else {
          res = await API.Rush.updateTag({name: this.classifyName, sort: this.classifyNum}, this.tagItem.id)
          this.$toast.show(res.message)
          if (res.error !== this.$ERR_OK) {
            return
          }
          this.rushMsg.lists[this.classifyChangeIdx]['shelf_tag'] = {
            name: this.classifyName,
            sort: this.classifyNum,
            id: this.tagItem.id
          }
        }
        this._hideModal()
      },
      // 隐藏分类弹窗
      _hideModal() {
        setTimeout(() => {
          this.isShow = false
          this.classifyName = ''
          this.classifyNum = ''
        }, 100)
        this.showActive = false
      },
      _showConfirm(id, index) {
        this.isShowConfirm = true
        this.showConfirmActive = true
        this.classifyDelId = id
        this.classifyDelIndex = index
      },
      _hideConfirm() {
        setTimeout(() => {
          this.isShowConfirm = false
        }, 100)
        this.showConfirmActive = false
      },
      //  保存
      async _saveActivity() {
        if (this.disable) {
          return
        } else if (this.isSubmit) {
          return
        }
        let date = Date.parse(new Date())
        let endTime = this.essInformation.end_at + ' 23:00'
        if (!this.essInformation.activity_name) {
          this.$toast.show('活动名称不能为空')
          return
        } else if (!this.essInformation.start_at) {
          this.$toast.show('活动开始时间不能为空')
          return
        } else if (!this.essInformation.end_at) {
          this.$toast.show('活动结束时间不能为空')
          return
        } else if (Date.parse(endTime.replace(/-/g, '/')) < date) {
          this.$toast.show('活动结束时间不能小于当天')
          return
        }
        let list = this.goodsList
        for (let i in list) {
          // for (let index in list[i].shelf_goods) {
          if (!list[i].trade_price || !list[i].person_day_buy_limit || !list[i].usable_stock || list[i].sort === '') {
            this.$toast.show(`${list[i].name}信息不全`)
            return
          } else if (
            +list[i].trade_price < 0 ||
            +list[i].person_day_buy_limit <= 0 ||
            +list[i].usable_stock < 0 ||
            (list[i].usable_stock + '').includes('.') ||
            +list[i].sort < 0
          ) {
            this.$toast.show(`${list[i].name}输入数据有误`)
            return
          }
        // }
        }
        let data = Object.assign({}, this.essInformation, {activity_goods: list})
        let res = null
        this.isSubmit = true
        if (this.id) {
          res = await API.Rush.updateGoods(data, this.id, true)
        } else {
          res = await API.Rush.storeGoods(data, this.id, true)
        }
        this.$loading.hide()
        this.$toast.show(res.message)
        if (res.error !== this.$ERR_OK) {
          this.isSubmit = false
          return
        }
        setTimeout(() => {
          this._back()
        }, 1000)
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
    flex: 1

  .rush-time
    margin-bottom: 27px

  .edit-item
    display: flex
    color: #2A2A2A
    min-height: 40px
    margin-top: 24px
    .edit-title
      margin-top: 7.5px
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
      .edit-input
        font-size: $font-size-14
        padding: 0 14px
        border-radius: 2px
        width: 240px
        height: 40px
        display: flex
        align-items: center
        justify-content: space-between
        border: 0.5px solid $color-line
        transition: all 0.3s
        &:hover
          border-color: #ACACAC
        &:focus
          border-color: $color-main
        .edit-time
          color: $color-text-assist
          font-family: $font-family-regular
          font-size: $font-size-12
        .time-icon
          icon-image('icon-date_icon')
          width: 12px
          height: @width
    .edit-input-right
      margin-left: 14px
    .tip
      line-height: 44px
      font-size: $font-size-12
      font-family: $font-family-regular
      color: $color-text-main
    .tip-text
      margin-left: 2px
      line-height: 44px
      font-size: $font-size-12
      font-family: $font-family-regular
      color: $color-text-assist

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
          &:nth-child(7)
            flex: 0.5
          &:last-child
            max-width: 70px
        .com-list-double
          white-space: normal
          line-height: 18px
          no-wrap-plus()

  .activity-tab
    margin-bottom: 20px
    display: flex
    align-items: center
    box-sizing: border-box
    .add-goods-btn
      box-sizing: border-box
      height: 28px
      line-height: 28px
      width: 92px
      border: 1px solid $color-main
      color: $color-main
      background: $color-white
      font-size: $font-size-12
      white-space: nowrap
      transition: all 0.3s
      text-align: center
      border-radius: 2px
    .btn-disable
      border: 1px solid $color-main
      color: $color-main
      background: $color-white

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
      background: $color-white
      justify-content: flex-end
      position: absolute
      left: 0
      right: 0
      bottom: 0
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
    margin-bottom: 20px
    align-items: center
    box-sizing: border-box
    display: flex
    .tab-item
      margin-right: 10px

  .page-box
    box-sizing: border-box
    height: 76px
    align-items: center
    display: flex

  .goods-content
    border-radius: 2px
    .rush-goods-list
      height: 420px
    .goods-item
      box-sizing: border-box
      padding: 0 20px
      width: 100%
      height: 60px
      display: flex
      align-items: center
      border-bottom: 0.5px solid $color-line
      border-right: 0.5px solid $color-line
      border-left: 0.5px solid $color-line
      position: relative
      &:nth-child(2n+1)
        background: #f5f7fa
      &:first-child
        border-top: 0.5px solid $color-line
      .select-icon
        margin-right: 20px
        border-radius: 2px
        border: 1px solid $color-line
        height: 16px
        width: 16px
        transition: all 0.3s
      .select-icon-disable
        border: 1px solid transparent
        cursor: not-allowed
        icon-image('icon-check_ash')
      .select-icon-active
        border: 1px solid transparent
        icon-image('icon-check')
      .goods-img
        margin-right: 20px
        width: 40px
        height: @width
        overflow: hidden
        background-repeat: no-repeat
        background-size: cover
        background-position: center
        background-color: $color-background
      .goods-msg
        display: flex
        color: $color-text-main
        font-family: $font-family-regular
        height: 40px
        align-items: center
        margin-right: 130px
        flex: 1
        .goods-name
          width: 593px
          no-wrap()
        .goods-name, .goods-money
          line-height: 1
          font-size: $font-size-14
      .add-btn
        col-center()
        right: 20px
        border-radius: 2px
        margin-left: 88px
        padding: 7px 0
        min-width: 56px
        text-align: center
      .add-btn-disable
        border-radius: 2px
        padding: 7px 0
        width: 56px
        box-sizing: border-box
        text-align: center
        font-size: $font-size-14
        line-height: 1
        cursor: not-allowed
        background: $color-line
        color: $color-text-assist
        border: none
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
    width: 70px

  .rush-list-box
    background: $color-white
    overflow: visible
    display: flex
    flex-direction: column
    flex: 1
</style>
