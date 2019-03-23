<template>
  <div class="edit-outreach detail-content">
    <div v-if="!disable" class="identification">
      <div class="identification-page">
        <img src="./icon-new_commodity@2x.png" class="identification-icon">
        <p class="identification-name">新建活动</p>
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
          活动名称
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
          活动图片
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
          活动时间
        </div>
        <date-picker
          :value="essInformation.start_at"
          class="edit-input-box"
          type="date"
          :editable="false"
          placement="bottom-end"
          placeholder="选择开始时间"
          style="width: 240px;height: 44px;border-radius: 1px"
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
          style="width: 240px;height: 44px"
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
        </div>
        <div class="outreach-list-box">
          <div class="commodities-list-header com-list-box commodities-list-top">
            <div v-for="(item, index) in commodities" :key="index" class="com-list-item">{{item}}</div>
          </div>
          <div class="big-box">
            <div v-for="(item, index) in goodsList" :key="index" class="com-list-box com-list-content">
              <div class="com-list-item">{{item.name}}</div>
              <div class="com-list-item">{{item.goods_units}}</div>
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
        <div class="shade-header">
          <div class="shade-title">选择团长</div>
          <span class="close hand" @click="_cancelGoods"></span>
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
          <div class="back-btn back-submit hand" @click="_addition">确定</div>
          <div class="back-cancel back-btn hand" @click="_cancelGroup">取消</div>
        </div>
      </div>
    </default-modal>

    <!-- 选择商品弹窗-->
    <default-modal ref="goodsModal">
      <div slot="content" class="shade-box">
        <div class="shade-header">
          <div class="shade-title">选择商品</div>
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
            <base-search ref="goodsSearch" placeHolder="请输入商品名称" @search="_searchGoods"></base-search>
          </div>
        </div>
        <div class="goods-content">
          <div class="outreach-goods-list">
            <div v-for="(item, index) in chooseGoods" :key="index" class="goods-item">
              <span class="select-icon hand" :class="{'select-icon-disable': item.selected === 1, 'select-icon-active': item.selected === 2}" @click="_selectGoods(item,index)"></span>
              <div class="goods-img" :style="{'background-image': 'url(' +item.goods_cover_image+ ')'}"></div>
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
  import {outreachComputed, outreachMethods} from '@state/helpers'
  import API from '@api'
  import _ from 'lodash'
  import {DatePicker} from 'iview'

  const PAGE_NAME = 'EDIT_OUTREACH'
  const TITLE = '新建查看拓展活动'
  const COMMODITIES_LIST = [
    '商品名称',
    '单位',
    '原售价(元)',
    '活动售价(元)',
    '排序',
    '操作'
  ]
  const GROUP_TITLE = [
    {name: '选择', class: 'title-item', flex: 0.7, value: ''},
    {name: '团长帐号', class: 'title-item', flex: 1, value: 'mobile'},
    {name: '团长名称', class: 'title-item', flex: 1, value: 'name'},
    {name: '社区名称', class: 'title-item', flex: 1.2, value: 'social_name'},
    {name: '社区地址', class: 'title-item', flex: 2, value: 'address'},
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
        delId: [], // 删除id数组
        id: null,
        tagList: [],
        page: 1,
        chooseGoods: [],
        outreachMsg: [],
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
        disable: false, // 有id不可编辑
        goodsList: [],
        essInformation: {
          activity_type: 'offline',
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
        banner_image: []
      }
    },
    computed: {
      ...outreachComputed,
      testName() { // 活动名称
        return this.essInformation.activity_name
      },
      testImg() { // 活动图片
        return this.essInformation.image_id !== ''
      },
      testStart() { // 开始时间
        return this.essInformation.start_at
      },
      testStartDate() { // 开始时间规则判断
        return Date.parse(this.essInformation.start_at) < new Date()
      },
      testEnd() { // 结束时间
        return this.essInformation.end_at
      },
      testEndDate() { // 结束时间规则判断
        return Date.parse(this.essInformation.end_at + ' 00:00') > Date.parse('' + this.essInformation.start_at + ' 00:00')
      },
      testGroup() { // 社区
        return this.essInformation.shop_id !== ''
      }
    },
    watch: {
      outreachDetail: {
        handler(news) {
          let id = this.$route.query.id || null
          if (id) {
            let obj = _.cloneDeep(news)
            this.goodsList = obj.activity_goods
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
              activity_cover_image: obj.activity_cover_image,
            }
          }
        },
        immediate: true
      }
    },
    created() {
      let time = new Date().toLocaleDateString().replace(/^(\d)$/,"0$1")
      this.essInformation.start_at = time.replace(/\//g, '-')
      if(this.$route.query.id) {
        this.$store.commit('global/SET_CURRENT_TITLES', ['商城', '活动', '拓展活动', '查看活动'])
      } else {
        this.$store.commit('global/SET_CURRENT_TITLES', ['商城', '活动', '拓展活动', '新建活动'])
      }
    },
    async mounted() {
      this.disable = this.$route.query.id
      this.id = this.$route.query.id || null
      await this._getFirstAssortment()
      this._getGoodsList()
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
      // 选择商品
      async _getGoodsList() {
        let res = await API.Outreach.getGoodsList({
          is_online: 1,
          keyword: this.keyword,
          goods_category_id: this.parentId,
          shelf_id: this.id,
          limit: 10,
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
        this.chooseGoods = res.data.map((item, index) => {
          let idx = this.selectGoodsId.findIndex((id) => id === item.id)
          let goodsIndex = this.selectGoods.findIndex((items) => items.id === item.id)
          let delIndex = this.selectDelId.findIndex((id) => id === item.id)
          // item.trade_price = item.trade_price || 0
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
        this.page = page
        if (this.groupShow) {
          await this._getGroupList()
        } else {
          await this._getGoodsList()
        }
      },
      // 选择二级分类
      async _secondAssortment(item) {
        this.parentId = item.id
        let res = await API.Outreach.goodsCategory({parent_id: this.parentId})
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
        let res = await API.Outreach.goodsCategory({parent_id: this.parentId})
        this.assortment.data = res.error === this.$ERR_OK ? res.data : []
        this.assortment.data.unshift({name: '全部', id: ''})
      },
      // 搜索商品/搜索团长
      async _searchGoods(text) {
        this.keyword = text
        this.page = 1

        if (this.groupShow) {
          this.$refs.paginationGroup.beginPage()
          await this._getGroupList()
        } else {
          this.$refs.pagination.beginPage()
          await this._getGoodsList()
        }
      },
      // 勾选商品
      _selectGoods(item, index) {
        switch (item.selected) {
        case 0:
          if (this.selectGoodsId.length === 3) {
            this.$toast.show('选择商品数量不能超过三个')
            return
          }
          this.chooseGoods[index].selected = 2
          this.selectGoods.push(item)
          this.selectGoodsId.push(item.id)
          break
        case 2:
          this.chooseGoods[index].selected = 0
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
        if (this.groupShow) {
          this._hideGroup()
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
        if (item.selected === 1) {
          return
        }
        if(this.selectGoodsId.length === 3 && item.selected !== 2) {
          this.$toast.show('选择商品数量不能超过三个')
          return
        }

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
      async _showGoods() {
        if (this.disable) {
          return
        }
        this._initData()
        this.$refs.goodsSearch._setText('')
        await this._getGoodsList()
        // 展示添加商品弹窗
        this.$refs.goodsModal.showModal()
      },
      _hideGoods() {
        this.$refs.goodsModal.hideModal()
      },

      _initData() {
        this.page = 1
        this.keyword = ''
        this.$refs.pagination.beginPage()
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
        if (this.id) return
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
        let data = Object.assign({}, this.essInformation, {activity_goods: list})
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
          {value: this.testName, txt: '请输入活动名称'},
          {value: this.testImg, txt: '请选择活动图片'},
          {value: this.testStart, txt: '请选择活动开始时间'},
          // {value: this.testStartDate, txt: '活动开始时间只能为今天'},
          {value: this.testEnd, txt: '请选择活动结束时间'},
          {value: this.testEndDate, txt: '活动结束时间必须大于今天'},
          {value: this.testGroup, txt: '请选择拓展社区'}
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
  .edit-outreach
    padding-bottom: 20px
    position: relative
    flex: 1
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
        border-radius: 1px
        width: 400px
        height: 44px
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
      line-height: 44px
      font-size: $font-size-12
      font-family: $font-family-regular
      color: $color-text-assist
    .time-no-change,.text-no-change
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
      border-radius: 1px
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
    border-radius: 1px
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
          height: 44px
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
    .btn-group-confirm
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
    border-radius: 1px
    border: 1px solid $color-line
    margin: 0 20px
    height: 400px
    .outreach-goods-list
      flex-wrap: wrap
      display: flex
      .goods-item
        box-sizing: border-box
        padding: 0 20px
        width: 50%
        height: 79.5px
        display: flex
        align-items: center
        border-bottom: 0.5px solid $color-line
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
          border: 1px solid transparent
          cursor: not-allowed
          icon-image('icon-check_ash')
        .select-icon-active
          border: 1px solid transparent
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
            line-height: 1.2
            font-size: $font-size-14

        .add-btn
          border-radius: 1px
          margin-left: 88px
          padding: 5px 0
          width: 56px
          text-align: center
        .add-btn-disable
          border-radius: 1px
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
          border: none

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
  .outreach-list-box
    background: $color-white
    overflow: visible
    display: flex
    flex-direction: column
    flex: 1
</style>
