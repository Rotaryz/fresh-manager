<template>
  <div class="edit-outreach detail-content">
    <div v-if="!disable" class="identification">
      <div class="identification-page">
        <img src="./icon-new_commodity@2x.png" class="identification-icon">
        <p class="identification-name">新建拓展</p>
      </div>
      <div class="function-btn">
      </div>
    </div>
    <div class="content-header" :class="{'margin-top': disable}">
      <div class="content-title">基本信息</div>
    </div>
    <div class="outreach-time">
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          拓展名称
        </div>
        <div class="edit-input-box">
          <input v-model="essInformation.activity_name"
                 type="text"
                 :placeholder="disable ? '' : '请输入'"
                 class="edit-input"
                 :readonly="disable"
                 :class="{'disable-input':disable}"
          >
        </div>
        <div :class="{'text-no-change':disable}"></div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          拓展图片
        </div>
        <div class="image-box">
          <base-edit-image :picList.sync="banner_image" :picNum="1" @failFile="failFile" @getPic="getPic" @delPic="delPic"></base-edit-image>
          <div class="tip">上传图片的最佳尺寸：750*480，其他尺寸会影响页面效果，格式png，jpeg，jpg</div>
          <div :class="{'img-no-change':disable}"></div>
        </div>
      </div>

      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          拓展时间
        </div>
        <date-picker
          :value="essInformation.start_at"
          class="edit-input-box"
          type="date"
          :editable="false"
          placement="bottom-end"
          placeholder="选择开始时间"
          style="width: 240px;height: 40px;border-radius: 2px"
          readonly
          @on-change="_getStartTime"
        ></date-picker>
        <div class="tip-text">至</div>
        <date-picker
          :value="essInformation.end_at"
          class="edit-input-box edit-input-right"
          type="date"
          :editable="false"
          placement="bottom-end"
          placeholder="选择结束时间"
          style="width: 240px;height: 40px"
          @on-change="_getEndTime"
        ></date-picker>
        <div :class="{'time-no-change':disable}"></div>
      </div>

      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          拓展社区
        </div>
        <div class="edit-input-box">
          <input v-model="groupSelectItem.social_name"
                 type="text"
                 placeholder="选择团长"
                 class="edit-input"
                 :class="{'disable-input':disable}"
                 readonly
                 @click="_showGroup"
          >
          <span class="icon"></span>
        </div>
        <div :class="{'text-no-change':disable}"></div>
      </div>
    </div>

    <!--成员信息-->
    <div class="content-header">
      <div class="content-title">成员信息</div>
    </div>
    <div class="activity-box">
      <div class="activity-list">
        <div class="activity-tab">
          <div :class="{'disable': disable}" class="add-goods-btn hand" @click="_showMember">
            <img class="icon" src="./icon-add@2x.png" alt="">
            添加成员
          </div>
        </div>
        <div v-if="selectMembers && selectMembers.length" class="outreach-list-box">
          <div class="commodities-list-header com-list-box commodities-list-top">
            <div v-for="(item, index) in memberHeader" :key="index" class="member-list-item">{{item}}</div>
          </div>
          <div class="big-box">
            <div v-for="(item, index) in selectMembers" :key="index" class="com-list-box com-list-content">
              <div class="member-list-item">{{item.name}}</div>
              <div class="member-list-item">{{item.mobile}}</div>
              <div class="member-list-item">
                <span :class="{'list-operation-disable': disable}" class="list-operation" @click="_showDelMembers(item, index)">删除</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--拓展商品-->
    <div class="content-header header-margin">
      <div class="content-title">商品信息</div>
    </div>
    <div class="activity-box">
      <div class="activity-list">
        <div class="activity-tab">
          <div :class="{'disable': disable}" class="add-goods-btn hand" @click="_showGoods">
            <img class="icon" src="./icon-add@2x.png" alt="">
            添加商品
          </div>
        </div>
        <div v-if="goodsList && goodsList.length" class="outreach-list-box">
          <div class="commodities-list-header com-list-box commodities-list-top">
            <div v-for="(item, index) in commodities" :key="index" class="com-list-item">{{item}}</div>
          </div>
          <div class="big-box">
            <div v-for="(item, index) in goodsList" :key="index" class="com-list-box com-list-content">
              <div class="com-list-item">{{item.name}}</div>
              <div class="com-list-item">{{item.sale_unit || item.goods_units}}</div>
              <div class="com-list-item">¥{{item.original_price || 0}}</div>
              <div class="com-list-item" :class="{'price-focus':priceFocus === index}">
                <input v-model="item.trade_price" :class="{'no-border': disable}" type="number" class="com-edit" :readonly="disable">
                <span v-if="item.original_price" class="small-money">¥</span>
              </div>
              <div class="com-list-item" :class="{'sort-focus':sortFocus === index}">
                <input v-model="item.sort" type="number" class="com-edit com-edit-small" :class="{'no-border': disable}" :readonly="disable">
              </div>
              <div class="com-list-item">
                <span :class="{'list-operation-disable': disable}" class="list-operation" @click="_showDelGoods(item, index)">删除</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 选择团长弹窗-->
    <default-modal ref="groupModal">
      <div slot="content" class="shade-box">
        <div class="title-box">
          <div class="title">
            选择团长
          </div>
          <span class="close hand" @click="_hideGroup"></span>
        </div>
        <!--搜索-->
        <div class="shade-tab">
          <div class="tab-item">
            <base-search ref="groupSearch" placeHolder="请输入团长名称或账号" @search="_searchGoods"></base-search>
          </div>
        </div>
        <!--列表-->
        <div class="group-content">
          <div class="title">
            <span v-for="(item, index) in groupTitle" :key="index" :class="item.class" :style="{flex: item.flex}">{{item.name}}</span>
          </div>
          <div class="outreach-group-list">
            <div v-for="(item, index) in groupList" :key="index" class="group-item" @click="selectGroup(item, index)">
              <span v-for="(val, ind) in groupTitle" :key="ind" :class="val.class" :style="{flex: val.flex}">
                <span v-if="ind === 0" class="check" :class="{'checked': (groupCheckItem.id ? (item.id === groupCheckItem.id) : (item.id === groupSelectItem.id))}"></span>
                <span v-else>{{item[val.value]}}</span>
              </span>
            </div>
          </div>
        </div>
        <!--翻页器-->
        <div class="page-box">
          <base-pagination ref="paginationGroup" :pageDetail="goodsPage" @addPage="_getMoreGoods"></base-pagination>
        </div>
        <div class="back">
          <div class="back-cancel back-btn hand" @click="_cancelGroup">取消</div>
          <div class="back-btn back-submit hand" @click="_addition">确定</div>
        </div>
      </div>
    </default-modal>

    <!-- 添加成员弹窗-->
    <member-modal
      ref="memberModal"
      :selectMembers="selectMembers"
      @addMemberOne="addMemberOne"
      @_memberAddition="_memberAddition"
    >
    </member-modal>

    <!--选择商品弹窗-->
    <add-goods ref="selectGoods" :goodsStock="false" :goodsTitle="goodsTitle" @batchAddition="batchAddition"></add-goods>
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
  import AddGoods from '@components/add-goods/add-goods'
  import MemberModal from './member-modal/member-modal'
  import moment from 'moment'
  import {outreachComputed, outreachMethods} from '@state/helpers'
  import API from '@api'
  import _ from 'lodash'
  import {DatePicker} from 'iview'

  const PAGE_NAME = 'EDIT_OUTREACH'
  const TITLE = '新建查看拓展任务'
  const COMMODITIES_LIST = ['商品名称', '单位', '原售价(元)', '活动售价(元)', '排序', '操作']
  const MEMBERS_LIST = ['成员姓名', '手机', '操作']
  const GROUP_TITLE = [
    {name: '选择', class: 'title-item', flex: 0.4, value: ''},
    {name: '团长帐号', class: 'title-item', flex: 0.8, value: 'mobile'},
    {name: '团长名称', class: 'title-item', flex: 1, value: 'name'},
    {name: '社区名称', class: 'title-item', flex: 1.2, value: 'social_name'},
    {name: '社区地址', class: 'title-item', flex: 2, value: 'address'}
  ]

  const GOODS_POP_TITLE = [
    {name: '商品', flex: 2, value: 'name'},
    {name: '销售价格', flex: 0.5, value: 'trade_price'}
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
      AddGoods,
      MemberModal
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        memberHeader: MEMBERS_LIST,
        goodsTitle: GOODS_POP_TITLE,
        classifyIndex: 0,
        delId: [], // 删除id数组
        id: null,
        tagList: [],
        page: 1,
        chooseGoods: [],
        outreachMsg: [],
        assortment: {
          check: false,
          show: false,
          content: '选择类目',
          type: 'default',
          data: [] // 格式：{title: '55'}}
        },
        secondAssortment: {
          check: false,
          show: false,
          content: '选择二级类目',
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
        disable: false, // 有id不可编辑
        goodsList: [],
        essInformation: {
          activity_type: 'offline',
          activity_theme: 'offline',
          activity_name: '',
          activity_cover_image: '',
          start_at: '',
          end_at: '',
          shop_id: '',
          image_id: '',
          activity_goods: []
        },
        isSubmit: false, // 在提交
        groupShow: false, // 选择团长弹窗
        groupList: [],
        groupTitle: GROUP_TITLE,
        groupCheckItem: {}, // 选中的团长
        groupSelectItem: {}, // 确定选择的团长
        priceFocus: '', // 聚焦活动手机
        sortFocus: '', // 聚焦排序
        banner_image: [],
        selectMembers: [], // 活动成员列表
        memberDelId: '', // 删除的成员ID
        delType: '' // 删除弹窗的类型 成员 member 商品 goods
      }
    },
    computed: {
      ...outreachComputed,
      testName() {
        // 拓展名称
        return this.essInformation.activity_name
      },
      testImg() {
        // 拓展图片
        return this.essInformation.image_id !== ''
      },
      testStart() {
        // 开始时间
        return this.essInformation.start_at
      },
      testStartDate() {
        // 开始时间规则判断
        return Date.parse(this.essInformation.start_at.replace(/-/g, '/')) < new Date()
      },
      testEnd() {
        // 结束时间
        return this.essInformation.end_at
      },
      testEndDate() {
        // 结束时间规则判断
        return (
          Date.parse(this.essInformation.end_at.replace(/-/g, '/') + ' 00:00') >
          Date.parse('' + this.essInformation.start_at.replace(/-/g, '/') + ' 00:00')
        )
      },
      testGroup() {
        // 社区
        return this.essInformation.shop_id !== ''
      },
      testMember() {
        return this.selectMembers.length
      }
    },
    watch: {
      outreachDetail: {
        handler(news) {
          let id = this.$route.query.id || null
          if (id) {
            let obj = _.cloneDeep(news)
            this.goodsList = obj.activity_goods
            this.selectMembers = obj.members
            let imgArr = [{id: 0, image_id: 0, image_url: obj.activity_cover_image}]
            this.banner_image = imgArr
            this.groupSelectItem.social_name = obj.social_name
            if (this.goodsList) {
              this.selectGoodsId = obj.activity_goods.map((item) => {
                return item.goods_id
              })
            }
            this.essInformation = {
              start_at: obj.start_at,
              end_at: obj.end_at,
              activity_name: obj.activity_name,
              activity_cover_image: obj.activity_cover_image
            }
          }
        },
        immediate: true
      }
    },
    created() {
      // let time = new Date().toLocaleDateString().replace(/\b\d\b/, '0$1')
      this.essInformation.start_at = moment().format('YYYY-MM-DD')
      if (this.$route.query.id) {
        this.$store.commit('global/SET_CURRENT_TITLES', ['商城', '任务', '拓展任务', '查看任务'])
      } else {
        this.$store.commit('global/SET_CURRENT_TITLES', ['商城', '任务', '拓展任务', '新建任务'])
      }
    },
    async mounted() {
      this.disable = this.$route.query.id
      this.id = this.$route.query.id || null
    },
    methods: {
      ...outreachMethods,
      failFile(msg) {
        this.$emit('showToast', msg)
      },
      getPic(image) {
        let item = {id: 0, image_id: image.id, image_url: image.url}
        this.essInformation.activity_cover_image = image.url
        this.essInformation.image_id = image.id
        this.banner_image[0] = item
      },
      delPic(index) {
        this.essInformation.activity_cover_image = ''
        this.banner_image = []
      },
      _getStartTime(time) {
        this.essInformation.start_at = time
      },
      _getEndTime(time) {
        this.essInformation.end_at = time
      },
      async _showGroup() {
        if (this.disable) return
        this.groupShow = true
        this._initData()
        this.$refs.groupSearch._setText('')
        this.$refs.groupModal.showModal()
        this._getGroupList()
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
        this.page = page
        await this._getGroupList()
      },
      // 搜索商品/搜索团长
      async _searchGoods(text) {
        this.keyword = text
        this.page = 1
        this.$refs.paginationGroup.beginPage()
        await this._getGroupList()
      },
      // 删除商品
      _showDelGoods(item, index) {
        if (this.disable) {
          return
        }
        this.delType = 'goods'
        this.goodsDelId = item.goods_id
        this.goodsDelIndex = index
        this.$refs.confirm.show('是否确定删除该商品？')
      },
      // 删除成员
      _showDelMembers(item, idx) {
        if (this.disable) {
          return
        }
        this.delType = 'member'
        this.memberDelId = item.id
        this.$refs.confirm.show('是否确定删除该成员？')
      },
      // 删除商品弹窗
      _delGoods() {
        if (this.delType === 'goods') {
          // let index = this.selectGoodsId.findIndex((item) => item === this.goodsDelId)
          this.selectGoodsId.splice(this.goodsDelIndex, 1)
          this.goodsList.splice(this.goodsDelIndex, 1)
          this.selectDelId.push(this.goodsDelId)
        } else {
          this.selectMembers = this.selectMembers.filter((item) => {
            return +item.id !== +this.memberDelId
          })
        }
      },
      // 批量添加商品
      batchAddition(list) {
        let arr = JSON.parse(JSON.stringify(list))
        let newArr = arr.map((item) => {
          let isExist = false
          this.goodsList.forEach((goods) => {
            if (item.id * 1 === goods.id * 1) {
              isExist = true
            }
          })
          if (!isExist) {
            // 初始数据
            item.trade_price = ''
            item.usable_stock = ''
            item.sort = 0
          }
          return item
        })
        this.goodsList = newArr
      },
      _memberAddition(arr) {
        this.selectMembers = this.selectMembers.concat(arr)
      },
      addMemberOne(item) {
        this.selectMembers.push(item)
      },
      async _showGoods() {
        if (this.disable) return
        this.$refs.selectGoods && this.$refs.selectGoods.showModal(this.goodsList)
      },
      async _showMember() {
        if (this.disable) {
          return
        }
        // 展示添加商品弹窗
        this.$refs.memberModal.showModal()
      },
      _initData() {
        this.page = 1
        this.keyword = ''
        this.$refs.paginationGroup.beginPage()
      },

      // 获取团长列表
      async _getGroupList() {
        let res = await API.Outreach.getGroupList({
          keyword: this.keyword,
          limit: 6,
          page: this.page
        })
        if (res.error !== this.$ERR_OK) {
          return
        }
        this.$loading.hide()
        this.goodsPage = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        this.groupList = res.data
      },
      // 关闭选择团长弹窗
      _hideGroup() {
        this.groupShow = false
        this.$refs.groupModal.hideModal()
      },
      // 选择团长
      selectGroup(item, index) {
        this.groupCheckItem = item
      },
      // 确定选择团长
      _addition() {
        this.groupCheckItem.id && (this.groupSelectItem = this.groupCheckItem)
        this.groupCheckItem.id && (this.essInformation.shop_id = this.groupSelectItem.shop_id)
        this._hideGroup()
      },
      // 取消选择团长
      _cancelGroup() {
        this.groupCheckItem = {}
        this._hideGroup()
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
          if (!list[i].trade_price || list[i].sort === '') {
            this.$toast.show(`请输入商品“${list[i].name}”的活动售价`)
            return
          } else if (+list[i].trade_price < 0 || +list[i].sort < 0) {
            this.$toast.show(`“${list[i].name}”输入数据有误`)
            return
          }
        }
        list.map((item) => {
          item.goods_id = item.id
        })
        let members = this.selectMembers.map((item) => {
          return item.id
        })
        let data = Object.assign({}, this.essInformation, {activity_goods: list, member_ids: members})
        let res = null
        this.isSubmit = true
        // 调用保存活动接口
        res = await API.Outreach.storeActivity(data, this.id, true)
        this.$loading.hide()
        this.$toast.show(res.message)
        if (res.error !== this.$ERR_OK) {
          this.isSubmit = false
          return
        }
        setTimeout(() => {
          this._back()
        }, 1000)
      },
      checkForm() {
        let arr = [
          {value: this.testName, txt: '请输入拓展名称'},
          {value: this.testImg, txt: '请选择拓展图片'},
          {value: this.testStart, txt: '请选择拓展开始时间'},
          // {value: this.testStartDate, txt: '活动开始时间只能为今天'},
          {value: this.testEnd, txt: '请选择拓展结束时间'},
          {value: this.testEndDate, txt: '拓展结束时间必须大于今天'},
          {value: this.testGroup, txt: '请选择拓展社区'},
          {value: this.testMember, txt: '请添加成员后保存'}
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
  ::-webkit-input-placeholder {
    font-size: 14px
    font-family: $font-family-regular
    color: #ACACAC
  }
  .edit-outreach
    padding-bottom: 20px
    position: relative
    flex: 1
  .content-header
    justify-content: flex-start
  .margin-top
    margin-top: 24px
  .outreach-time
    margin-bottom: 27px

  .edit-item
    display: flex
    color: #2A2A2A
    min-height: 40px
    margin-top: 24px
    position: relative
    .edit-title
      margin-top: 7.5px
      font-size: $font-size-14
      font-family: $font-family-regular
      white-space: nowrap
      text-align: left
      min-width: 64px
    .image-box
      margin-left: 40px
      position: relative
      .img-no-change
        position: absolute
        left: 0
        top: 0
        width: 90px
        height: 90px
        z-index: 100
        cursor: not-allowed
    .start
      display: inline-block
      margin-right: -2px
      color: #F52424
    .edit-input-box
      margin: 0 14px 0 40px
      position: relative
      .edit-input
        font-size: $font-size-14
        padding: 0 14px
        border-radius: 2px
        width: 400px
        height: 40px
        display: flex
        align-items: center
        justify-content: space-between
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
        .time-icon
          icon-image('icon-date_icon')
          width: 12px
          height: @width
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
    .edit-input-right
      margin-left: 14px
    .tip
      font-size: $font-size-14
      font-family: $font-family-regular
      color: $color-text-assist
    .tip-text
      margin-left: 2px
      line-height: 40px
      font-size: $font-size-12
      font-family: $font-family-regular
      color: $color-text-assist
    .time-no-change, .text-no-change
      position: absolute
      left: 100px
      top: 0
      width: 550px
      height: 50px
      z-index: 100
    .text-no-change
      cursor: not-allowed
  .edit-activity
    box-sizing: border-box
    padding-left: 20px

  .edit-arrive
    .edit-input-box
      margin: 0 14px 0 32px

  .header-margin
    margin-top: 50px
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
          position: relative
          &:nth-child(1)
            flex: 2
        .member-list-item
          position: relative
          flex: 1
          &:nth-child(1)
            flex: 2
          &:nth-child(2)
            flex: 4
            margin-right: 80px

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
    .disable
      cursor: not-allowed
    .icon
      width: 10px
      height: 10px
      margin-right: 5px
      object-fit: cover
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
          height: 40px
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
    box-sizing: border-box
    height: 76px
    align-items: center
    display: flex

  .goods-content
    border-radius: 4px
    height: 420px
    .goods-list
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
          font-size: $font-size-14
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
      padding: 0 20px
      box-sizing: border-box
      height: 77px
      align-items: center
      display: flex

  .group-content
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
        &:nth-child(1)
          max-width: 60px
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
          &:nth-child(1)
            max-width: 60px
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
      border-color: #ACACAC
    &::placeholder
      font-family: $font-family-regular
      color: $color-text-assist
    &:focus
      border-color: $color-main !important
  .no-border
    border-width: 0
    background: rgba(255, 255, 255, 0)
  .small-money
    col-center()
    left: 10px
    line-height: 1.1
    font-size: $font-size-13
    font-family: $font-family-regular
    color: $color-text-main

  .com-edit-small
    width: 60px
  .outreach-list-box
    background: $color-white
    overflow: visible
    display: flex
    flex-direction: column
    flex: 1
</style>
