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
        <!--分类 -->
        <div class="edit-item">
          <div class="edit-title">
            <span class="start">*</span>
            内容分类
          </div>
          <div class="edit-input-box">
            <base-dropdown v-model="addData.category" :data="articleCategoryList" valueKey="value" :width="400" :height="40"
                           placeholder="请选择内容分类"
            ></base-dropdown>
          </div>
          <div class="add-category-operate">添加分类</div>
        </div>
        <!--标题-->
        <div class="edit-item">
          <div class="edit-title">
            <span class="start">*</span>
            {{name}}标题
          </div>
          <div class="edit-input-box">
            <input v-model="addData.title"
                   type="text"
                   :placeholder="'在此输入'+name+'标题，最少5个字'"
                   class="edit-input title-input"
            >
          </div>
        </div>
        <!-- 封面-->
        <div class="edit-item">
          <div class="edit-title">
            <span class="start">*</span>
            {{name}}封面
          </div>
          <div class="edit-input-box flex-box">
            <base-upload :picList.sync="coverImages"
                         :picNum="1"
                         :fileType="currentType!=='1' ?'image-video' :'image'"
                         @failFile="failFile"
                         @getPic="getPic"
                         @delPic="delPic"
            ></base-upload>
            <div class="tip">
              请添加不大于10M的清晰图片或视频
              <br>{{name}}封面是{{name}}首图
            </div>
          </div>
        </div>
        <!--作者信息-->
        <div class="edit-item">
          <div class="edit-title">
            <span class="start">*</span>
            作者信息
          </div>
          <div class="edit-input-box flex-box author-info-box">
            <base-upload :picList.sync="authorPhoto" :picNum="1" imageIconClassName="add-image-head-photo"
                         fileType="image"
                         @failFile="failFile"
                         @getPic="getAuthorPic"
                         @delPic="delAuthorPic"
            ></base-upload>
            <div class="auto-input">
              <input v-model="addData.authName"
                     type="text"
                     placeholder="请输入作者名称"
                     class="edit-input"
              >
              <input v-model="addData.auth_signature"
                     type="text"
                     placeholder="请输入30个字的个性签名"
                     class="edit-input edit-signature"
              >
            </div>
          </div>
        </div>
        <!-- 视频  视频内容-->
        <div v-if="currentType === '1'" class="edit-item">
          <div class="edit-title">
            <span class="start">*</span>
            视频内容
          </div>
          <!-- todo-->
          <div class="edit-input-box flex-box">
            <base-edit-image :picList.sync="coverImages" :picNum="1" fileType="video" @failFile="failFile" @getPic="getPic"
                             @delPic="delPic"
            ></base-edit-image>
            <div class="tip">
              请上传5-15秒竖版视频，大小控制在100M以内优质且清晰的小视频，可以获得更多流量哦
            </div>
            <div class="tip">
              视频上传成功，处理完成
              <div>视频名称-香菇芋头排骨焖饭</div>
            </div>
          </div>
        </div>
        <!--视频  视频简介-->
        <div v-if="currentType === '1'" class="edit-item">
          <div class="edit-title">
            <span class="start">*</span>
            视频简介
          </div>
          <div class="edit-input-box">
            <textarea v-model="addData.foodList" class="edit-textarea edit-input" placeholder="" maxlength="50"></textarea>
            <span class="num">{{addData.foodList && addData.foodList.length || 0}}/50</span>
          </div>
        </div>
        <!--菜谱  食材清单-->
        <div v-if="currentType === '2'" class="edit-item">
          <div class="edit-title">
            <span class="start">*</span>
            食材清单
          </div>
          <div class="edit-input-box">
            <textarea v-model="addData.foodList" class="edit-textarea edit-input"
                      placeholder="例子：大蒜，酱油，猪肉，食材之间用逗号隔开，最多输入50个字符"
                      maxlength="50"></textarea>
            <span class="num">{{addData.foodList && addData.foodList.length || 0}}/50</span>
          </div>
        </div>
        <!--视频/菜谱 添加商品-->
        <div v-if="currentType !== '0'" class="edit-item add-goods-wrap">
          <div class="edit-title">
            添加商品
          </div>
          <div class="edit-input-box">
            <div class="activity-tab  flex-box">
              <div class="add-goods-btn hand" @click="showGoods">
                <img class="icon-add" src="./icon-add@2x.png" alt="">
                添加商品
              </div>
              <div class="tip">最多添加5个商品</div>
            </div>
            <div v-if="goodsList && goodsList.length" class="goods-list-box">
              <div class="list-header list-box">
                <div v-for="(item, index) in selectedGoodsCommodities" :key="index" class="list-item">{{item}}</div>
              </div>
              <div class="list">
                <div v-for="(item, index) in goodsList" :key="index" class="list-content list-box">
                  <div class="list-item">{{item.name}}</div>
                  <div class="list-item">{{item.sale_unit || item.goods_units}}</div>
                  <div class="list-item">¥{{item.original_price || 0}}</div>
                  <div class="list-item">
                    <span class="list-operation" @click="_showDelGoods(item, index)">删除</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--文章/菜谱 内容详情-->
        <div v-if="currentType!=='1'" class="edit-item">
          <div class="edit-title">
            内容详情
          </div>
          <div class="edit-input-box add-cont-type-box">
            <div class="add-cont-type-item" @click="addTextItem">
              <div class="icon icon-text"></div>
              <div>文本</div>
            </div>
            <base-upload fileType="image-custom">
              <div class="add-cont-type-item">
                <div class="icon icon-img"></div>
                <div>图片</div>
              </div>
            </base-upload>

            <base-upload fileType="video-custom">
              <div class="add-cont-type-item">
                <div class="icon icon-video"></div>
                <div>视频</div>
              </div>
            </base-upload>
            <!---文章-->
            <div v-if="currentType==='0'" class="add-cont-type-item">
              <div class="icon icon-goods"></div>
              <div>商品</div>
            </div>
          </div>
        </div>
        <draggable v-if="contentDetails.length" v-model="contentDetails" class="content-details" @update="_setSort()">
          <transition-group>
            <div v-for="(item, idx) in contentDetails" :key="idx" class="content-item">
              <div class="close-icon" @click="deleteContentItem(idx)"></div>
              <textarea v-model="item.value" class="edit-textarea edit-input" placeholder="输入文字"></textarea>
            </div>
            value
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
              <input v-model="addData.goodCount"
                     type="number"
                     placeholder=""
                     class="edit-input"
              >
            </div>
            <div class="edit-input-item look-item">
              <div class="edit-title">
                初始浏览人数
              </div>
              <input v-model="addData.lookCount"
                     type="number"
                     placeholder=""
                     class="edit-input"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="back">
      <div class="back-cancel back-btn hand" @click="submitDraft()">存为草稿</div>
      <div class="back-btn back-submit hand" @click="submitLaunch()">上线</div>
    </div>
    <!-- 选择商品弹窗-->
    <default-modal ref="goods">
      <div slot="content" class="shade-box">
        <div class="title-box">
          <div class="title">
            选择商品
          </div>
          <span class="close hand" @click="hideGoods"></span>
        </div>
        <div class="shade-tab">
          <div class="tab-item">
            <base-dropdown v-model="chooseGoodsFilter.goods_category_id"
                           :data="goodsCategoryList"
                           valueKey="value"
                           :width="218"
                           @change="goodsCategoryChange"
            ></base-dropdown>
          </div>
          <div class="tab-item">
            <base-search ref="goodsSearch" placeHolder="请输入商品名称" @search="_searchGoods"></base-search>
          </div>
        </div>
        <div class="goods-list list">
          <div v-for="(item, index) in chooseGoods" :key="index" class="list-content list-box">
            <div class="list-item list-item-select">
              <div class="select-icon hand"
                   :class="{'select-icon-disable': item.selected === 1, 'select-icon-active': item.selected === 2}"
                   @click="selectGoodsBtn(item,index)"
              >
              </div>
            </div>
            <div class="list-item goods-img-wrap">
              <div class="wrap">
                <div class="goods-img" :style="{'background-image': 'url('+ item.goods_cover_image+ ')'}">
                </div>
              </div>
            </div>
            <div class="list-item goods-name">
              {{item.name}}
            </div>
            <div class="list-item  goods-money">¥{{item.original_price}}</div>

            <div class="add-btn btn-main" :class="{'add-btn-disable': item.selected === 1}" @click="_additionOne(item, index)">{{item.selected === 1 ? '已添加' : '添加'}}</div>
          </div>
        </div>
        <div class="page-box">
          <base-pagination ref="pagination" :pageDetail="goodsPage" @addPage="getMoreGoods"></base-pagination>
        </div>
        <div class="back">
          <div class="back-cancel back-btn hand" @click="hideGoods">取消</div>
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

  const ARTICLE = '0'
  const VEDIO = '1'
  const COOKBOOK = '2'

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
        typeList: {
          [ARTICLE]: {
            name: '文章'
          },
          [VEDIO]: {
            name: '视频'
          },
          [COOKBOOK]: {
            name: '菜谱'
          }
        }, // 三种创作
        currentType: '0', // 现在创作类型
        addData: {
          category: '',
          title: '',
          cover_image: '',
          cover_image_id: '',
          authorPhoto: '',
          authPhotoId: '',
          authName: '',
          auth_signature: '',
          foodList: '',
          goodCount: 0,
          lookCount: 0
        },
        articleCategoryList: [],// 内容分类列表
        coverImages: [], // 封面图片
        authorPhoto: [], // 作者头像
        // 已经选择的商品头部
        selectedGoodsCommodities: ['商品名称', '单位', '售价', '操作'],
        goodsList: [],
        // 内容详情
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
        // 校验规则
        justifyArr: [{
          key: 'category',
          tips: [{
            default: true,
            tip: '请选择内容分类'
          }]
        }, {
          key: 'title',
          tips: [{
            default: true,
            tip: '请输入文章标题'
          }, {
            length: [5, 8],
            tip: '请输入5-8个字的文章标题'
          }]
        }, {
          key: 'cover_image',
          tips: [{
            default: true,
            tip: '请上传首图'
          }]
        }, {
          key: 'authorPhoto',
          tips: [{
            default: true,
            tip: '请上传作者头像'
          }]
        }, {
          key: 'authName',
          tips: [{
            default: true,
            tip: '请输入作者名称'
          }]
        }, {
          key: 'auth_signature',
          tips: [{
            default: true,
            tip: '请输入个性签名'
          }, {
            length: [1, 30],
            tip: '请输入30字的个性签名'
          }]
        }, {
          key: 'foodList',
          tips: [{
            default: true,
            tip: '食材清单'
          }]
        }, {
          key: 'goodsList',
          tips: [{
            length: [0, 5],
            tip: '最多添加5个商品'
          }]
        }, {
          key: 'wx_group_photo_url',
          tips: [{
            default: true,
            tip: '请上传100人以上的微信群照片'
          }]
        }],
        goodsCategoryList: [],
        // 选择商品弹框删选条件
        chooseGoodsFilter: {
          limit: 7,
          page: '',
          keyword: '',
          goods_category_id: '',
        },
        chooseGoods: [], // 弹框商品列表
        goodsPage: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        showLoading: false,
        selectGoods: [], // 单次选择的商品
      }
    },
    computed: {
      ...adverComputed,
      name() {
        console.log(this.typeList[this.currentType] && this.typeList[this.currentType].name)
        return this.typeList[this.currentType] && this.typeList[this.currentType].name || '文章'
      },
      dataName() {
        let lastName = this.cmsType[0].toUpperCase() + this.cmsType.slice(1, this.cmsType.length)
        let useName = `temporary${lastName}`
        return useName
      }
    },
    async created() {
      this.currentType = this.$route.params.type
      console.log(this.$route.params.type)
      this._getArticleCategory()
    },
    methods: {
      ...adverMethods,
      // 获取内容分类列表
      _getArticleCategory() {

      },
      // 封面图片
      getPic(image) {
        console.log(image)
        let item = {id: 0, image_id: image.id, image_url: image.url}
        this.addData.cover_image = image.url
        this.addData.cover_image_id = image.id
        this.coverImages[0] = item
      },
      delPic(index) {
        this.addData.cover_image = ''
        this.addData.cover_image_id = ''
        this.coverImages = []
      },
      failFile(msg) {
        this.$emit('showToast', msg)
      },
      // 作者头像
      getAuthorPic(image) {
        let item = {id: 0, image_id: image.id, image_url: image.url}
        this.addData.authorPhoto = image.url
        this.addData.authorPhotoId = image.id
        this.authorPhoto[0] = item
      },
      delAuthorPic(index) {
        this.addData.authorPhoto = ''
        this.addData.authorPhotoId = ''
        this.authorPhoto = []
      },
      // 内容详情增加
      addTextItem() {
        this.contentDetails.push({
          type: 'text',
          value: ''
        })
      },
      addVedioItem() {

      },
      addImageItem() {

      },
      deleteContentItem(idx) {
        this.contentDetails.splice(idx, 1)
      },
      // 托拽
      _setSort() {
        console.log(this.contentDetails)
      },
      // --------------弹窗
      // 获取商品列表
      async _getGoodsList() {
        this.$loading.show()
        let res = await API.Outreach.getGoodsList({
          is_online: 1,
          shelf_id: this.id,
          ...this.chooseGoodsFilter
        })
        if (res.error !== this.$ERR_OK) {
          return
        }
        if (this.chooseGoodsFilter.page === 1) {
          this.$refs.pagination && this.$refs.pagination.beginPage()
        }
        this.goodsPage = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        this.chooseGoods = res.data.map((item, index) => {
          let isInList = this.goodsList.findIndex((items) => items.id === item.id)
          let isSelect = this.selectGoods.findIndex((select) => select.id === item.id)

          item.selected = isSelect !== -1 ? 2 : (isInList !== -1 ? 1 : 0)
          console.log(isInList, 'isInList', isSelect, 'isSelect', item.selected)
          // 0 没有选择 2 选择高亮  1 单个确认进入列表
          return item
        })
        this.$loading.hide()
      },
      // 展示商品弹窗
      async showGoods() {
        this.chooseGoodsFilter.page = 1
        this._getFirstAssortment()
        await this._getGoodsList()
        this.$refs.goods.showModal()
        this.$refs.pagination.beginPage()
      },
      // 隐藏商品弹窗
      hideGoods() {
        this.selectGoods = []
        this.$refs.goods.hideModal()
      },
      // 获取分页商品列表
      async getMoreGoods(page) {
        this.chooseGoodsFilter.page = page
        await this._getGoodsList()
      },
      // 获取一级分类
      async _getFirstAssortment() {
        let res = await API.Outreach.goodsCategory({parent_id: this.chooseGoodsFilter.goods_category_id})
        this.goodsCategoryList = res.error === this.$ERR_OK ? res.data : []
      },
      // 选择分类
      async goodsCategoryChange(item) {
        this.chooseGoodsFilter.goods_category_id = item.id
        this.chooseGoodsFilter.page = 1
        await this._getGoodsList()
      },
      // 搜索商品
      async _searchGoods(text) {
        this.chooseGoodsFilter.keyword = text
        this.chooseGoodsFilter.page = 1
        await this._getGoodsList()
      },
      // 勾选商品
      selectGoodsBtn(item, index) {
        /* eslint-disable */
        switch (item.selected) {
          case 0:
            if (this.goodsList.length === 5) {
              this.$toast.show('选择商品数量不能超过五个')
              return
            }
            this.chooseGoods[index].selected = 2
            this.selectGoods.push(item)
            break
          case 2:
            this.chooseGoods[index].selected = 0
            let idx = this.selectGoods.findIndex((items) => items.id === item.id)
            if (idx !== -1) {
              this.selectGoods.splice(idx, 1)
            }
            break
        }
      },
      // 删除商品
      _showDelGoods(item, index) {
        this.goodsList.splice(index, 1)
      },
      // 单个添加
      _additionOne(item, index) {
        if (item.selected === 1) {
          return
        }
        if (this.goodsList.length === 5 && item.selected !== 2) {
          this.$toast.show('选择商品数量不能超过5个')
          return
        }
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
        this.hideGoods()
      },
      // 上线
      async submitLaunch() {
        console.log(this.contentDetails)
      },
      // 草稿
      async submitDraft() {
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .add-category-operate
    color: $color-main
    text-decoration underline
    height: 40px
    line-height: 40px
    margin-left: 20px

  /*输入框*/
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
      margin: 0 0px 0 40px
      position: relative

      .edit-input.title-input
        width: 400px

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


  /* 布局*/
  .advertisement
    flex: 1

    .wrap-container
      display: flex
      font-family: $font-family-regular

      .edite-right-box
        flex: 1

      .tip
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-text-assist
        margin-left: 14px

      /*添加商品样式*/

      .activity-tab
        display: flex
        align-items: center
        box-sizing: border-box

        .add-goods-btn
          box-sizing: border-box
          height: 28px
          line-height: 28px
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


        .icon-add
          width: 10px
          height: 10px
          margin-right: 5px
          object-fit: cover


      /*商品列表*/

      .add-goods-wrap
        margin-top: 20px
        width: 100%

        .goods-list-box
          margin-top: 20px
          background: $color-white
          overflow: visible
          display: flex
          flex-direction: column
          flex: 1

        .edit-input-box
          flex: 1

        .list-box .list-item
          &:child-nth(1)
            flex: 2

          &:last-child
            max-width: 50px

      /* 内容详情*/

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


      .content-details
        background: #F5F7FA
        border-radius: 2px
        padding: 20px
        margin-top: 20px
        margin-left: 104px
        max-height: 600px
        overflow auto
        scroll-opacity(5px, 100px)

        .content-item
          border: 0.5 pxdashed #D3D8DC
          border-radius: 2px
          background: #fff
          height: 168px
          position relative
          margin-bottom: 20px

          &:last-child
            margin-bottom: 0px

          .close-icon
            width: 12px
            height: @width
            icon-image(icon-close_content)
            position absolute
            right: 10px
            top: 10px

          .edit-textarea
            height: 100%
            width: 100%


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

    .shade-tab
      height: 68px
      align-items: center
      padding: 0 20px
      box-sizing: border-box
      display: flex

      .tab-item
        margin-right: 10px

    .goods-list
      .list-item-select
        max-width 60px

        .select-icon
          margin-right: 20px
          border-radius: 1px
          border: 1px solid #e9ecee
          height: 16px
          width: 16px
          -webkit-transition: all .3s
          transition: all .3s
          background-size: 100% 100%
          display: inline-block

          &.select-icon-active
            border: 1px solid transparent
            background-image: url("./icon-check@2x.png")

          &.select-icon-disable
            cursor: not-allowed
            border: 1px solid transparent
            background-image: url("./icon-check_ash@2x.png")


      .goods-img-wrap
        max-width 100px

        .wrap
          width: 40px
          height: 40px
          background #fff

        .goods-img
          width: 40px
          height: 40px
          border-radius 50%
          background-size 100%

      .goods-name
        flex: 3

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

    .back
      border-top-1px($color-line)
      position: absolute
      left: 0
      right: 0
      bottom: 0
      background: $color-white
      justify-content: flex-end
      height: 70px

    .page-box
      padding: 0 20px
      box-sizing: border-box
      height: 77px
      align-items: center
      display: flex


</style>
