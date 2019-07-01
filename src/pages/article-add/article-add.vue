<template>
  <div class="advertisement normal-box">
    <div class="identification">
      <div class="identification-page">
        <img src="./icon-new_commodity@2x.png" class="identification-icon">
        <p class="identification-name">创作</p>
      </div>
      <div class="function-btn">
      </div>
    </div>
    <div class="wrap-container">
      <phone-box></phone-box>
      <div class="edite-right-box">
        <!--内容分类 -->
        <div class="edit-item">
          <div class="edit-title">
            <span class="start">*</span>
            内容分类
          </div>
          <div class="edit-input-box">
            <base-drop-down :width="218" :select="assortment" placeholder="请选择内容分类" @setValue="_secondAssortment"></base-drop-down>
          </div>
        </div>
        <!--菜谱标题-->
        <div class="edit-item">
          <div class="edit-title">
            <span class="start">*</span>
            菜谱标题
          </div>
          <div class="edit-input-box">
            <input v-model="addData.title"
                   type="text"
                   placeholder="在此输入文章标题，最少5个字"
                   class="edit-input"
            >
          </div>
        </div>
        <!-- 菜谱封面-->
        <div class="edit-item">
          <div class="edit-title">
            <span class="start">*</span>
            菜谱封面
          </div>
          <div class="edit-input-box flex-box">
            <base-edit-image :picList.sync="coverImage" :picNum="1" fileType="image-video" @failFile="failFile" @getPic="getPic"
                             @delPic="delPic"
            ></base-edit-image>
            <div class="tip">
              请添加不大于10M的清晰图片或视频
              <br>文章封面是文章首图
            </div>
            <div :class="{'img-no-change':disable}"></div>
          </div>
        </div>
        <!--作者信息-->
        <div class="edit-item">
          <div class="edit-title">
            <span class="start">*</span>
            作者信息
          </div>
          <div class="edit-input-box flex-box author-info-box">
            <base-edit-image :picList.sync="authorPhoto" :picNum="1" imageIconClassName="add-image-head-photo"
                             fileType="image"
                             @failFile="failFile"
                             @getPic="getAuthorPic"
                             @delPic="delAuthorPic"
            ></base-edit-image>
            <div class="auto-input">
              <input v-model="addData.title"
                     type="text"
                     placeholder="请输入作者名称"
                     class="edit-input"
              >
              <input v-model="addData.title"
                     type="text"
                     placeholder="请输入30个字的个性签名"
                     class="edit-input edit-signature"
              >
            </div>
          </div>
        </div>
        <!--食材清单-->
        <div class="edit-item">
          <div class="edit-title">
            <span class="start">*</span>
            食材清单
          </div>
          <div class="edit-input-box">
            <textarea v-model="addData.foodList" class="edit-textarea edit-input" placeholder="输入商品副标题" maxlength="50"></textarea>
            <span class="num">{{addData.foodList && addData.foodList.length || 0}}/50</span>
          </div>
        </div>
        <!--添加商品-->
        <div class="edit-item">
          <div class="edit-title">
            添加商品
          </div>
          <div class="edit-input-box flex-box">
            <div class="activity-tab">
              <div :class="{'disable': disable}" class="add-goods-btn hand" @click="_showGoods">
                <img class="icon-add" src="./icon-add@2x.png" alt="">
                添加商品
              </div>
              <div class="tip">最多添加5个商品</div>
            </div>
            <div v-if="goodsList && goodsList.length" class="goods-list-box">
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
        <!--内容详情-->
        <div class="edit-item">
          <div class="edit-title">
            内容详情
          </div>
          <div class="edit-input-box add-cont-type-box">
            <div class="add-cont-type-item">
              <div class="icon icon-text"></div>
              <div>文本</div>
            </div>
            <div class="add-cont-type-item">
              <div class="icon icon-img"></div>
              <div>图片</div>
            </div>
            <div class="add-cont-type-item">
              <div class="icon icon-video"></div>
              <div>视频</div>
            </div>
            <div class="add-cont-type-item">
              <div class="icon icon-goods"></div>
              <div>商品</div>
            </div>
          </div>
        </div>
        <draggable v-model="contentDetails" class="content-details" @update="_setSort()">
          <transition-group>
            <div v-for="(item, idx) in contentDetails" :key="idx" class="content-item">
              <div class="close-icon"></div>
              <textarea v-model="item.value" class="edit-textarea edit-input" placeholder="输入文字"></textarea>
            </div>value
          </transition-group>
        </draggable>
        <!-- 其他设置 -->
        <div class="edit-item">
          <div class="edit-title">
            其他设置
          </div>
          <div class="edit-input-box">
            <div class="edit-input-item">
              <div class="edit-title">
                初始点赞人数
              </div>
              <input v-model="addData.title"
                     type="number"
                     placeholder=""
                     class="edit-input"
              >
            </div>
            <div class="edit-input-item look-item">
              <div class="edit-title">
                初始浏览人数
              </div>
              <input v-model="addData.title"
                     type="number"
                     placeholder=""
                     class="edit-input"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="advertisement-btn-wrap">
      <div class="advertisement-btn">
        <div class="submit-activity-btn hand" @click="_editBanner()">提交</div>
      </div>
    </div>
    <!-- 选择商品弹窗-->
    <default-modal ref="goodsModal">
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
            <base-search ref="goodsSearch" placeHolder="请输入商品名称" @search="_searchGoods"></base-search>
          </div>
        </div>
        <div class="goods-content">
          <div class="outreach-goods-list">
            <div v-for="(item, index) in chooseGoods" :key="index" class="goods-item">
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
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  import PhoneBox from './phone-box/phone-box'
  import API from '@api'
  import {adverComputed, adverMethods} from '@state/helpers'
  // import _ from 'lodash'
  import Draggable from 'vuedraggable'

  const PAGE_NAME = 'ARTICLE_ADD'
  const TITLE = '创作文章'
  export default {
    name: PAGE_NAME,
    components: {
      DefaultModal,
      PhoneBox,
      Draggable
    },
    page: {
      title: TITLE
    },
    data() {
      this._isSave = false // 是否保存当前数据
      return {
        addData: {
          category: '',
          title: '',
          cover_image: '',
          image_id: '',
          authorPhoto: '',
          autoPhotoId: '',
          foodList: ''
        },
        contentDetails: [{
          type: 'text',
          value: '111111111'
        }, {
          type: 'image',
          value: "http://social-shopping-api-1254297111.picgz.myqcloud.com/1/2019/07/01/156197765342658.png"
        }, {
          type: 'video',
          value: 'http://social-shopping-api-1254297111.picgz.myqcloud.com/1/2019/07/01/156197765342658.png'
        }],
        showLoading: false,
        chooseGoods: [],
        parentId: '',
        goodsPage: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
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
        coverImage: [],
        authorPhoto: [],
        page: '',
        keyword: '',
        goodsList: [],
        selectGoods: [], // 单次选择的商品
        selectGoodsId: [], // 所有选择的商品id
        disable: false // 有id不可编辑
      }
    },
    computed: {
      ...adverComputed,
      dataName() {
        let lastName = this.cmsType[0].toUpperCase() + this.cmsType.slice(1, this.cmsType.length)
        let useName = `temporary${lastName}`
        return useName
      }
    },
    async created() {
      this.$loading.show()
      this._getFirstAssortment()
      this.$loading.hide()
    },
    methods: {
      ...adverMethods,
      failFile(msg) {
        this.$emit('showToast', msg)
      },
      getPic(image) {
        console.log(image)
        let item = {id: 0, image_id: image.id, image_url: image.url}
        this.addData.cover_image = image.url
        this.addData.image_id = image.id
        this.coverImage[0] = item
      },
      getAuthorPic(image) {
        let item = {id: 0, image_id: image.id, image_url: image.url}
        this.addData.authorPhoto = image.url
        this.addData.authorPhotoId = image.id
        this.authorPhoto[0] = item
      },
      delPic(index) {
        this.addData.cover_image = ''
        this.addData.image_id = ''
        this.coverImage = []
      },
      delAuthorPic(index) {
        this.addData.authorPhoto = ''
        this.addData.authorPhotoId = ''
        this.authorPhoto = []
      },
      // 选择商品
      async _getGoodsList() {
        let res = await API.Outreach.getGoodsList({
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
        this.chooseGoods = res.data.map((item, index) => {
          item.selected = 0
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
          item.trade_price = ''
          item.usable_stock = ''
          item.sort = 0
          return item
        })
      },
      // 获取分页商品列表
      async _getMoreGoods(page) {
        this.page = page
        await this._getGoodsList()
      },
      _cancelGoods() {
        this.selectGoods.forEach((item) => {
          let idx = this.chooseGoods.findIndex((items) => items.goods_id === item.goods_id)
          let delIdx = this.selectGoodsId.findIndex((id) => id === item.goods_id)
          this.chooseGoods[idx].selected = this.chooseGoods[idx].selected === 1 ? 1 : 0
          this.selectGoodsId.splice(delIdx, 1)
        })
        this.selectGoods = []
        this._hideGoods()
      },
      handleCancelConfirm() {
        if (this._isRouting) {
          console.log(this._next)
          this._next()
        } else {
          this._actionToChangeModule()
        }
      },
      handleSaveConfirm() {

      },
      _setSort() {
      },
      // 展示确认弹窗
      _showConfirm(id, index) {
        this.delId = id
        this.delIndex = index
        if (!id) {
          this[this.dataName].splice(index, 1)
          return
        }
        this.$refs.dialog.show('是否确定删除该广告？')
      },
      // 弹窗确定选择链接
      async _miniGoods() {
      },
      // 选择一级分类
      async _secondAssortment(item) {
        this.parentId = item.id
        if (item.id === '') {
          this.secondAssortment.data = []
        } else {
          let res = await API.Outreach.goodsCategory({parent_id: this.parentId})
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
            if (this.selectGoodsId.length === 20) {
              this.$toast.show('选择商品数量不能超过二十个')
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
        this.delType = 'goods'
        this.goodsDelId = item.goods_id
        this.goodsDelIndex = index
        this.$refs.confirm.show('是否确定删除该商品？')
      },
      // 单个添加
      _additionOne(item, index) {
        if (item.selected === 1) {
          return
        }
        if (this.selectGoodsId.length === 19 && item.selected !== 2) {
          this.$toast.show('选择商品数量不能超过20个')
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
      // 添加图片
      async _addPic(index, item, e) {
        this.upIndex = index
        this.upItem = item
        this[this.dataName][index].showLoading = true
        let param = this._infoImage(e.target.files[0])
        e.target.value = ''
        await this._upImage(param)
      },
      // 格式化图片流
      _infoImage(file) {
        let param = new FormData() // 创建form对象
        param.append('file', file, file.name) // 通过append向form对象添加数据
        return param
      },
      // 上传banner图片
      async _upImage(param) {
        let res = await API.Upload.UploadImg(param)
        this[this.dataName][this.upIndex].showLoading = false
        if (res.error !== this.$ERR_OK) {
          this.$toast.show(res.message)
          return
        }
        this[this.dataName][this.upIndex].image_url = res.data.url
        this[this.dataName][this.upIndex].image_id = res.data.id
      },
      // 新建banner
      async _editBanner(success) {
      },
      // 展示商品弹窗
      _showGoods() {
        this.$refs.goods.showModal()
      },
      // 隐藏商品弹窗
      _hideGoods() {
        this.$refs.goods.hideModal()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .edit-input
    font-size: $font-size-14
    padding: 0 14px
    border-radius: 2px
    width: 800px
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

  .flex-box
    display flex
    align-items center

  /* 编辑每一行样式*/
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
      min-width: 64px
      text-align: right

    .start
      display: inline-block
      margin-right: -2px
      color: #F52424

    .edit-input-box
      margin: 0 14px 0 40px
      position: relative

      .edit-input-item
        display flex

        .edit-title
          text-align left
          min-width: 105px

      .look-item
        margin-top 20px
        margin-bottom: 60px

      &.author-info-box
        flex: 1
        background: #F5F7FA
        padding: 20px 20px 0px 20px

        .auto-input
          margin-bottom: 20px
          margin-left: 20px

          .edit-signature
            margin-top: 10px


      .edit-textarea
        padding: 5px 14px
        height: 94px
        resize: none

      .num
        position: absolute
        right: 10px
        bottom: 10px
        font-size: $font-size-12
        font-family: $font-family-regular
        color: $color-text-assist

    .add-cont-type-box
      display flex
      flex: 1
      border-1px()

      .add-cont-type-item
        height 46px
        border-right-1px()
        width: 92px
        display flex
        align-items center
        justify-content center

        .icon
          width: 20px
          height: 18px
          margin-right: 5px

        .icon-text
          icon-image(icon-text_normal)

        .icon-img
          icon-image(icon-picture_normal)

        .icon-video
          icon-image(icon-vedio_normal)

        .icon-goods
          icon-image(icon-commodity_normal)

        &:hover
          color: $color-main

          .icon-text
            icon-image(icon-text_hover)

          .icon-img
            icon-image(icon-picture_hover)

          .icon-video
            icon-image(icon-vedio_hover)

          .icon-goods
            icon-image(icon-commodity_hover)


    .edit-input-right
      margin-left: 14px

    .tip
      font-size: $font-size-14
      font-family: $font-family-regular
      color: $color-text-assist
      margin-left: 14px

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

  /*添加商品样式*/
  .activity-tab
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

    .icon-add
      width: 10px
      height: 10px
      margin-right: 5px
      object-fit: cover

  .goods-list-box
    background: $color-white
    overflow: visible
    display: flex
    flex-direction: column
    flex: 1

  /* 布局*/
  .wrap-container
    display: flex
    font-family: $font-family-regular
    .content-details
      background: #F5F7FA
      border-radius: 2px
      padding:20px


    .content-item
      border: 0.5 pxdashed #D3D8DC
      border-radius: 2px
      background: #fff
      height: 168px
      position relative
      margin-bottom:20px
      &:last-child
        margin-bottom:0px

      .close-icon
        width:12px
        height: @width
        icon-image(icon-close_content)
        position absolute
        right:10px
        top:10px

      .edit-textarea
        height: 100%
        width:100%
  .advertisement-btn-wrap
    height: 60px
    background: #F8F8FD

  .advertisement-btn
    display: flex
    position: fixed
    left: 230px
    right: 0
    bottom: 0
    z-index: 10
    background: #F8F8FD
    height: 80px
    border-radius: 0 0 6px 6px
    box-sizing: border-box
    justify-content: center
    align-items: center


  //  商品弹窗
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

    .shade-tab
      height: 68px
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
    margin: 0 20px
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
        width: 56px
        text-align: center

      .add-btn-disable
        border-radius: 2px
        margin-left: 88px
        padding: 7px 0
        width: 56px
        box-sizing: border-box
        text-align: center
        font-size: $font-size-14
        line-height: 1
        cursor: not-allowed
        background: $color-line
        color: $color-text-assist

    .page-box
      padding: 0 20px
      box-sizing: border-box
      height: 77px
      align-items: center
      display: flex

  .shade-header
    display: flex
    justify-content: space-between
    height: 52px
    box-sizing: border-box
    padding: 23px 20px 0 0

    .shade-tab-type
      height: 100%
      display: flex
      position: relative

      .shade-tab-item
        line-height: 1
        display: flex
        transition: all 0.3s
        color: $color-text-main
        font-family: $font-family-regular
        margin-left: 40px

      .shade-tab-item-active
        font-family: $font-family-medium

      .line
        transition: all 0.3s
        left: 40px
        position: absolute
        bottom: 0px
        height: 3px
        width: 64px
        background: $color-main
        border-radius: 3px

    .shade-title
      color: $color-text-main
      font-family: $font-family-medium
      font-size: $font-size-16

    .close
      icon-image('icon-close')
      width: 12px
      height: @width
      transition: all 0.3s

  .back-box
    background: $color-white
    height: 70px
    border-top-1px($color-line)
    justify-content: flex-end
    position: absolute
    left: 0
    bottom: 0


  .submit-activity
    border-top: 0.5px solid $color-line

  .submit-activity-btn
    margin-left: 20px
    font-family: $font-family-regular
    font-size: $font-size-14
    color: $color-white
    letter-spacing: 0
    width: 108px
    height: 32px
    background: $color-main
    border-radius: 2px
    line-height: 32px
    text-align: center
    transition: 0.3s all
    user-select: none

    &:hover
      opacity: 0.8


  //  单选框
  .select-icon
    width: 16px
    height: 16px
    border-radius: 50%
    background: $color-white
    border: 1px solid $color-line
    transition: all, 0.3s
    position: relative
    transform-origin: 50%
    margin-right: 20px

    .after
      all-center()
      transform-origin: 50%
      transition: all, 0.3s
      width: 0
      height: 0
      border-radius: 50%

  .select-icon-active
    border: 5px solid $color-main
</style>
