<template>
  <div class="edit-rush">
    <div class="content-header">
      <div class="content-title">基本信息</div>
    </div>
    <div class="rush-time">
      <div class="edit-item edit-activity">
        <div class="edit-title">
          <span class="start">*</span>
          活动时间
        </div>
        <div class="edit-input-box">
          <div class="edit-input">
            <div class="edit-time">{{rushDetail.start_at}}</div>
            <span class="time-icon"></span>
          </div>
        </div>
        <div class="tip">至</div>
        <div class="edit-input-box edit-input-right">
          <div class="edit-input">
            <div class="edit-time">{{rushDetail.end_at}}</div>
            <span class="time-icon"></span>
          </div>
        </div>
      </div>
      <div class="edit-item edit-arrive">
        <div class="edit-title">
          <span class="start">*</span>
          预计到货时间
        </div>
        <div class="edit-input-box">
          <div class="edit-input">
            <div class="edit-time">{{rushDetail.delivery_at}}</div>
            <span class="time-icon"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="content-header">
      <div class="content-title">活动商品</div>
    </div>
    <div class="activity-box">
      <div class="classify">
        <div v-for="(item, index) in classify" :key="index" class="classify-item hand" :class="{'classify-item-active': index === classifyIndex}" @click="_setClassify(index, item)">{{item.name}}</div>
      </div>
      <div class="btn-main classify-manager" @click="_showEditShade">活动分类管理</div>
      <div class="activity-list">
        <div class="activity-tab">
          <div class="btn-main" @click="_showGoods">添加商品 +</div>
        </div>
        <div class="commodities-list-header com-list-box">
          <div v-for="(item, index) in commodities" :key="index" class="com-list-item">{{item}}</div>
        </div>
        <div class="big-box" :style="{'min-height': listHeight + 'px'}">
          <div v-for="(item, index) in goodsList[classifyIndex]" :key="index" class="com-list-box com-list-content">
            <div class="com-list-item">{{item.name}}</div>
            <div class="com-list-item">{{item.goods_units}}</div>
            <div class="com-list-item">{{item.original_price}}</div>
            <div class="com-list-item">
              <input v-model="item.trade_price" type="text" class="com-edit">
              <span class="small-money">￥</span>
            </div>
            <div class="com-list-item">
              <input v-model="item.buy_limit" type="text" class="com-edit com-edit-small">
              <span class="small-money">￥</span>
            </div>
            <div class="com-list-item">
              <input v-model="item.usable_stock" type="text" class="com-edit com-edit-small">
              <span class="small-money">￥</span>
            </div>
            <div class="com-list-item">{{item.usable_stock}}</div>
            <div class="com-list-item">
              <input v-model="item.sort" type="text" class="com-edit com-edit-small">
            </div>
            <div class="com-list-item">
              <span class="list-operation" @click="_delGoods()">删除</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="back">
      <div class="back-cancel back-btn hand" @click="_back">返回</div>
      <div class="back-btn btn-main">保存</div>
    </div>
    <!--编辑分类弹窗-->
    <default-modal ref="shadeCustom">
      <div slot="content" class="shade-box">
        <div class="shade-header">
          <div class="shade-title">编辑活动分类</div>
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
        <div class="back">
          <div class="back-cancel back-btn hand" @click="_hideEditShade">取消</div>
          <div class="back-btn btn-main">保存</div>
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
        <div class="shade-header">
          <div class="shade-title">选择商品</div>
          <span class="close hand" @click="_hideGoods"></span>
        </div>
        <div class="shade-tab">
          <div class="tab-item">
            <base-drop-down :width="218" :select="assortment"></base-drop-down>
          </div>
          <div class="tab-item">
            <base-drop-down :width="140"></base-drop-down>
          </div>
          <div class="tab-item">
            <base-search placeHolder="请输入商品名称"></base-search>
          </div>
        </div>
        <div class="goods-content">
          <div class="goods-list">
            <div v-for="(item, index) in choeesGoods" :key="index" class="goods-item">
              <span class="select-icon hand" :class="{'select-icon-disable': item.selected === 1, 'select-icon-active': item.selected === 2}"></span>
              <div class="goods-img" :style="{'background-image': 'url(' +item.goods_cover_image+ ')'}"></div>
              <div class="goods-msg">
                <div class="goods-name">{{item.name}}</div>
                <div class="goods-money">¥{{item.store_price}}</div>
              </div>
              <div class="add-btn btn-main">添加</div>
            </div>
          </div>
        </div>
        <div class="page-box">
          <base-pagination></base-pagination>
        </div>
        <div class="back">
          <div class="back-cancel back-btn hand" @click="_hideGoods">取消</div>
          <div class="back-btn btn-main">批量添加</div>
        </div>
      </div>
    </default-modal>
    <!--确定取消弹窗-->
    <default-confirm ref="confirm"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import {rushComputed, rushMethods} from '@state/helpers'
  import API from '@api'
  import {ERR_OK} from "../../utils/config";
  import _ from 'lodash'

  const PAGE_NAME = 'EDIT_RUSH'
  const TITLE = '新建编辑今日抢购'
  const COMMODITIES_LIST = ['商品名称', '单位', '划线价', '活动价格', '单人限购', '活动库存', '销量', '排序', '操作']
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultModal,
      DefaultConfirm
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        classifyIndex: 0,
        listHeight: 417,
        showActive: false,
        isShow: false,
        classifyName: '',
        classifyNum: '',
        showConfirmActive: false,
        isShowConfirm: false,
        delId: [], // 删除id数组
        lists: [],
        isStoreClassify: true,
        classifyChangeIdx: 0,
        id: null,
        classifyDelId: 0,
        classifyDelIndex: 0,
        tagList: [],
        tagItem: {},
        page: 1,
        choeesGoods: [],
        rushMag: [],
        assortment: {
          check: false,
          show: false,
          content: '选择分类',
          type: 'default',
          data: [] // 格式：{title: '55'}}
        },
        parentId: 0
      }
    },
    computed: {
      ...rushComputed,
      // 分类数组
      classify() {
        if (!this.rushMag.lists) {
          return []
        }
        let arr = this.rushMag.lists.map((item) => {
          return item['shelf-tag']
        })
        return arr
      },
      goodsList() {
        if (!this.rushMag.lists) {
          return []
        }
        let arr = this.rushMag.lists.map((item) => {
          return item['shelf_goods']
        })
        return arr
      }
    },
    async created() {
      this.id = this.$route.query.id || null
      await this._tagList()
      this.rushMag = _.cloneDeep(this.rushDetail)
      await this._getGoodsList()
      await this._getFirstAssortment()
    },
    mounted() {
      this._getListHeight()
    },
    methods: {
      ...rushMethods,
      // 选择商品
      async _getGoodsList() {
        let res = await API.Rush.getGoodsList({is_online: 1, keyword: '', goods_category_id: '', shelf_id: this.id, limit: 10, page: this.page})
        this.choeesGoods = res.error === this.$ERR_OK ? res.data : []
      },
      // 获取一级分类
      async _getFirstAssortment() {
        let res = await API.Rush.goodsCategory({parent_id: this.parentId})
        this.assortment.data = res.error === this.$ERR_OK ? res.data : []
        console.log(res)
      },
      async _tagList() {
        let res = await API.Rush.tagList({shelf_id: this.id})
        this.tagList = res.error === this.$ERR_OK ? res.data : []
        console.log(this.tagList)
      },
      // 切换分类
      _setClassify(index, item) {
        this.classifyIndex = index
      },
      // 获取高度
      _getListHeight() {
        let ele = document.querySelector('html')
        let height = ele.clientHeight
        this.listHeight = height - 692
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
        this._tagList()
        this.rushMag.lists.splice(this.classifyDelIndex, 1)
        this._hideConfirm()
      },
      async _delGoods() {
      },
      _showEditShade() {
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
          this.rushMag.lists.push({'shelf-tag': obj, 'shelf_goods': []})
        } else {
          res = await API.Rush.updateTag({name: this.classifyName, sort: this.classifyNum}, this.tagItem.id)
          this.$toast.show(res.message)
          if (res.error !== this.$ERR_OK) {
            return
          }
          this.rushMag.lists[this.classifyChangeIdx]['shelf-tag'] = {name: this.classifyName, sort: this.classifyNum, id: this.tagItem.id}
        }
        this._tagList()
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
      _showGoods() {
        // 展示添加商品弹窗
        this.$refs.goodsModel.showModal()
      },
      _hideGoods() {
        this.$refs.goodsModel.hideModal()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .edit-rush
    position: relative
    flex: 1

  .rush-time
    margin-bottom: 27px

  /*基本信息类头部盒子样式*/
  .content-header
    border-bottom: 1px solid $color-line
    display: flex
    align-items: center
    justify-content: space-between
    height: 62px
    position: relative
    box-sizing: border-box
    &:after
      content: ''
      position: absolute
      width: 34px
      height: 2px
      background: $color-main
      border-radius: 1px
      bottom: -1px
      left: 0
    .content-title
      color: $color-text-main
      font-family: $font-family-medium
      font-size: $font-size-16

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
        border-radius: 4px
        width: 240px
        height: 44px
        display: flex
        align-items: center
        justify-content: space-between
        border: 1px solid $color-line
        transition: all 0.3s
        &:hover
          border-color: #ACACAC
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
      line-height: 40px
      font-size: $font-size-12
      font-family: $font-family-regular
      color: $color-text-main

  .edit-activity
    box-sizing: border-box
    padding-left: 20px

  .edit-arrive
    .edit-input-box
      margin: 0 14px 0 32px

  .activity-box
    margin-top: 24px
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
      border: 1px solid $color-line
      box-sizing: border-box
      .big-box
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
      .com-list-box
        .com-list-item
          &:nth-child(1)
            flex: 2

  .history-record
    box-sizing: border-box
    padding: 0 20px
    padding-bottom: 80px

  .activity-tab
    height: 58px
    display: flex
    align-items: center
    padding-left: 21px
    box-sizing: border-box

  .commodities-list-header
    height: 50px
    background: $color-list-header
    .com-list-item
      font-size: $font-size-16

  .com-list-content
    height: 58.5px
    .com-list-item
      font-size: $font-size-14

  // 列表
  .com-list-box
    padding-left: 30px
    box-sizing: border-box
    display: flex
    align-items: center
    border-bottom: 1px solid $color-line
    .com-list-item
      flex: 1
      padding-right: 10px
      box-sizing: border-box
      position: relative
      no-wrap()
      color: $color-text-main
      font-family: $font-family-regular
      &:last-child
        flex: 0.5
      .com-edit
        height: 34px
        width: 93px
        border-radius: 4px
        box-sizing: border-box
        border: 1px solid $color-line
        padding-left: 22px
        transition: all 0.3s
        &::-webkit-inner-spin-button
          appearance: none
        &:hover
          border: 1px solid #ACACAC
        &::placeholder
          font-family: $font-family-regular
          color: $color-text-assist
        &:focus
          border-color: $color-sub !important
      .small-money
        col-center()
        left: 10px
        line-height: 1.1
        font-size: $font-size-13
        font-family: $font-family-regular
        color: $color-text-main
      .com-edit-small
        width: 60px

  .back
    position: fixed
    left: 200px
    right: 0px
    bottom: 0
    z-index: 10
    background: #F9F9F9
    height: 80px
    border-radius: 0 0 6px 6px
    display: flex
    align-items: center
    padding-left: 40px
    box-sizing: border-box
    .back-btn
      box-sizing: border-box
      font-size: $font-size-16
      margin-right: 20px
      padding: 12px 0
      width: 96px
      text-align: center
      white-space: nowrap
      transition: all 0.3s
    .back-cancel
      padding: 11px 0
      box-sizing: border-box
      line-height: 1
      color: $color-text-main
      border: 1px solid #ACACAC
      border-radius: 4px
      &:hover
        color: $color-text-sub
        border-color: $color-text-sub

  //  弹窗
  .shade-box
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
    border-radius: 3px
    background: $color-white
    height: 675px
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
      border-bottom: 1px solid $color-line
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
          border-radius: 4px
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
      position: absolute
      justify-content: flex-end
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

    /*分类弹窗*/
    .default-input
      box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
      background: #fff
      border-radius: 3px
      .title-input
        height: 60px
        layout(row)
        align-items: center
        justify-content: space-between
        border-bottom: 1px solid #e1e1e1
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
          border-radius: 4px
          font-family: $font-family-medium
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
            border-color: $color-sub !important

    .btn-group
      margin-top: 40px
      text-align: center
      display: flex
      justify-content: flex-end
      user-select: none
      .btn
        width: 96px
        height: 40px
        line-height: 40px
        border-radius: 3px
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
    border-radius: 3px
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
        border-radius: 3px
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
    height: 67.5px
    align-items: center
    padding: 0 20px
    box-sizing: border-box
    display: flex
    .tab-item
      margin-right: 10px

  .page-box
    padding: 0 20px
    box-sizing: border-box
    height: 66px
    align-items: center
    display: flex

  .goods-content
    border-radius: 4px
    border: 1px solid $color-line
    margin: 0 20px
    height: 400px
    .goods-list
      flex-wrap: wrap
      display: flex
    .goods-item
      box-sizing: border-box
      padding: 0 20px
      width: 50%
      height: 79.5px
      display: flex
      align-items: center
      border-bottom: 1px solid $color-line
      &:nth-child(2n+1)
        border-right: 1px solid $color-line
      &:nth-child(9), &:nth-child(10)
        border-bottom: none
      .select-icon
        margin-right: 20px
        border-radius: 1px
        border: 1px solid $color-line
        height: 16px
        width: 16px
        transition: all 0.3s
      .select-icon-disable
        border: none
        cursor: not-allowed
        icon-image('icon-check_ash')
      .select-icon-active
        border: none
        icon-image('icon-check')
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
        display: flex
        flex-direction: column
        color: $color-text-main
        font-family: $font-family-regular
        justify-content: space-between
        height: 40px
        .goods-name
          width: 210px
          no-wrap()
        .goods-name, .goods-money
          line-height: 1
          font-size: $font-size-14
      .add-btn
        border-radius: 2px
        margin-left: 88px
        padding: 5px 0
        width: 56px
        text-align: center
      .add-btn-disable
        border-radius: 2px
        margin-left: 88px
        padding: 5px 0
        width: 56px
        box-sizing: border-box
        text-align: center
        font-size: $font-size-14
        line-height: 1
        cursor: not-allowed
        background: $color-line
        color: $color-text-assist

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

</style>
