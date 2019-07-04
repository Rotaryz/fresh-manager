<template>
  <div class="advertisement normal-box">
    <div class="identification">
      <div class="identification-page">
        <img src="./icon-new_commodity@2x.png" class="identification-icon">
        <p class="identification-name">创作{{name}}</p>
      </div>
      <div class="function-btn">
      </div>
    </div>
    <div class="wrap-container">
      <phone-box :isShowEmpty="isShowEmpty" :data="addData" :type="currentType"></phone-box>
      <div class="edite-right-box">
        <!--分类 -->
        <div class="edit-item">
          <div class="edit-title">
            <span class="start">*</span>
            内容分类
          </div>
          <div class="edit-input-box">
            <base-dropdown v-model="addData.category" :data="articleCategoryList" valueKey="value" :width="400" :height="40"
                           placeholder="请选择内容分类" @click="_getArticleCategory"
            ></base-dropdown>
          </div>
          <div class="add-category-operate hand" @click="addCategory">添加分类</div>
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
            <base-upload :videoUrl="addData.coverVideo.url"
                         :imageUrl="addData.coverImage.url"
                         :picNum="1"
                         :fileType="currentType!=='1' ?'image-video' :'image'"
                         @failFile="failFile"
                         @getPic="getPic"
                         @delPic="delPic"
                         @successVideo="getCoverVideo"
            ></base-upload>
            <div class="tip">
              <template v-if="currentType === '1'">
                请添加不大于10M的清晰图片
              </template>
              <template v-else>
                请添加不大于10M的清晰图片或视频
                <br>
                {{name}}封面是{{name}}首图
              </template>
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
            <base-upload :imageUrl = "addData.authPhoto.url"
                         :picNum="1"
                         imageIconClassName="add-image-head-photo"
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
              <input v-model="addData.authSignature"
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
            <template v-if="addData.videoContent.url">
              <div class="video-wrap">
                <video :src="addData.videoContent.url" class="video-wrap">
                </video>
                <div class="delete-icon" @click="deleteVideoContent"></div>
              </div>
              <div class="tip">
                视频上传成功，处理完成
                <div>视频名称-{{addData.videoContent.name}}</div>
              </div>
            </template>
            <div v-else class="video-content-wrap">
              <div class="video-tip"></div>
              <div class="upload-video-wrap">
                <base-upload :videoUrl="addData.videoContent.url"
                             :picNum="1"
                             fileType="video-custom"
                             :size="100"
                             @failFile="failFile"
                             @successVideo="getVideoContent"
                >
                  <button class="upload-video btn-main  hand">
                    点击上传视频
                  </button>
                </base-upload>
              </div>

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
            <textarea v-model="addData.videoIntroduce" class="edit-textarea edit-input" placeholder="" maxlength="50"></textarea>
            <span class="num">{{addData.videoIntroduce && addData.videoIntroduce.length || 0}}/50</span>
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
                      maxlength="50"
            ></textarea>
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
              <div class="add-goods-btn  btn-main hand" @click="showGoods">
                <img class="icon-add" src="./icon-add@2x.png" alt="">
                添加商品
              </div>
              <div class="tip">最多添加5个商品</div>
            </div>
            <div v-if="addData.goodsList && addData.goodsList.length" class="goods-list-box">
              <div class="list-header list-box">
                <div v-for="(item, index) in selectedGoodsCommodities" :key="index" class="list-item">{{item}}</div>
              </div>
              <div class="list">
                <div v-for="(item, index) in addData.goodsList" :key="index" class="list-content list-box">
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
            <span class="start">*</span>
            内容详情
          </div>
          <div class="edit-input-box add-cont-type-box">
            <div class="add-cont-type-item" @click="addTextItem">
              <div class="icon icon-text"></div>
              <div>文本</div>
            </div>
            <div class="add-cont-type-item">
              <base-upload fileType="image-custom" @getPic="addImageItem">
                <div class="add-cont-type-item">
                  <div class="icon icon-img"></div>
                  <div>图片</div>
                </div>
              </base-upload>
            </div>
            <div class="add-cont-type-item">
              <base-upload fileType="video-custom" @successVideo="addVideoItem">
                <div class="add-cont-type-item">
                  <div class="icon icon-video"></div>
                  <div>视频</div>
                </div>
              </base-upload>
            </div>
            <!---文章-->
            <div v-if="currentType==='0'" class="add-cont-type-item" @click="addOneGoods">
              <div class="icon icon-goods"></div>
              <div>商品</div>
            </div>
          </div>
        </div>
        <draggable v-if="currentType!=='1' && addData.details.length" ref="detailsContent" v-model="addData.details" class="content-details" @update="_setSort()">
          <transition-group>
            <div v-for="(item, idx) in addData.details" :key="idx" class="content-item">
              <div class="close-icon" @click="deleteContentItem(idx,item)"></div>
              <img v-if="item.type==='image'" :src="item.value" class="conten-image">
              <video v-else-if="item.type==='video'" :src="item.value" class="conten-video"></video>
              <div v-else-if="item.type==='goods'" class="good-item">
                <img :src="item.value.goods_cover_image" class="goods-photo">
                <div class="info">
                  <div>
                    <div class="name">{{item.value.name}}</div>
                    <div class="details">{{item.value.describe}}</div>
                  </div>
                  <div class="operate">
                    <span class="price-now">10<span class="small">.8<span class="unit">元</span></span></span>
                    <span class="price">{{item.value.original_price}}元</span>
                  </div>
                </div>
              </div>
              <textarea v-else v-model="item.value" class="edit-textarea edit-input" placeholder="输入文字">
              </textarea>
            </div>
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
    <default-modal ref="addCategory">
      <div slot="content" class="shade-box add-category-box">
        <div class="title-box">
          <div class="title">
            增加分类
          </div>
          <span class="close hand" @click="$refs.addCategory.hideModal()"></span>
        </div>
        <div>
          <input v-model="addCategoryText" placeholder="长度不能超过6个字" maxlength="6" type="text" class="edit-input add-category-input">
        </div>
        <div class="back">
          <div class="back-cancel back-btn hand" @click="$refs.addCategory.hideModal()">取消</div>
          <div class="back-btn back-submit hand" @click="_submitCategory">确定</div>
        </div>
      </div>
    </default-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  import PhoneBox from './phone-box/phone-box'
  import API from '@api'
  import Draggable from 'vuedraggable'

  const PAGE_NAME = 'ARTICLE_ADD'
  const TITLE = '创作文章'

  const ARTICLE = '0'
  const VIDEO = '1'
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
      return {
        isCanSelectMore: true,
        typeList: {
          [ARTICLE]: {
            name: '文章'
          },
          [VIDEO]: {
            name: '视频'
          },
          [COOKBOOK]: {
            name: '菜谱'
          }
        }, // 三种创作
        currentType: '0', // 现在创作类型
        addCategoryText: "",
        addData: {
          likes: [],
          category: '',
          title: '',
          coverImage: {
            url: '',
            id: ''
          },
          coverVideo: {
            url: '',
            id: ''
          },
          authPhoto: {
            url: '',
            id: ''
          },
          authName: '',
          authSignature: '',
          goodCount: 0,
          lookCount: 0,
          // 不同情况的字段
          videoContent: {
            url: '',
            id: '',
            name: ''
          },
          videoIntroduce: "",
          foodList: '',
          goodsList: [],
          // 内容详情
          details: [],
        },
        articleCategoryList: [],// 内容分类列表
        // 已经选择的商品头部
        selectedGoodsCommodities: ['商品名称', '单位', '售价', '操作'],
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
          per_page:
            10,
          total_page:
            1
        },
        selectGoods: [], // 单次选择的商品
      }
    },
    computed: {
      isShowEmpty() {
        return !(this.addData.title || this.addData.coverImage.id
          || this.addData.authPhoto.id || this.addData.authName
          || ((this.addData.videoContent.id || this.addData.videoIntroduce) && this.currentType === '1')
          || (this.currentType === '2' && this.addData.foodList)
          || (this.currentType !== '1' && this.addData.details.length))
      },
      name() {
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
    },
    methods: {
      // 获取内容分类列表
      _getArticleCategory() {
        console.log(111)
      },
      addCategory() {
        this.addCategoryText = ''
        console.log(111)
        this.$refs.addCategory.showModal()
      },
      _submitCategory() {

      },
      // 封面
      getCoverVideo(video) {
        console.log('封面视频', video)
        this.addData.coverVideo.id = video.id
        this.addData.coverVideo.url = video.full_url
        this.addData.coverImage.id = video.cover_image_id
        this.addData.coverImage.url = video.full_cover_url
      },
      getPic(image) {
        console.log('封面图片', image)
        this.addData.coverImage.url = image.url
        this.addData.coverImage.id = image.id
      },
      delPic() {
        this.addData.coverImage = {
          url: '',
          id: ''
        }
        this.addData.coverVideo = {
          url: '',
          id: ''
        }
      },
      failFile(msg) {
        this.$emit('showToast', msg)
      },
      // 作者头像
      getAuthorPic(image) {
        this.addData.authPhoto.url = image.url
        this.addData.authPhoto.id = image.id
      },
      delAuthorPic() {
        this.addData.authPhoto.url = ''
        this.addData.authPhoto.id = ''
      },
      // 视频内容
      getVideoContent(video) {
        this.addData.videoContent.url = video.full_url
        this.addData.videoContent.id = video.id
        this.addData.videoContent.name = video.name
      },
      deleteVideoContent() {
        this.addData.videoContent = {
          url: '',
          id: '',
          name: ''
        }
      },
      // 内容详情增加
      addDetailContentItem(item) {
        this.addData.details.push(item)
        this.$nextTick(function () {
          let el = this.$refs.detailsContent.$el
          console.log(el)
          el.scrollTop = el.scrollHeight
        })
      },
      addTextItem() {
        this.addDetailContentItem({
          type: 'text',
          value: ''
        })
      },
      addImageItem(image) {
        this.addDetailContentItem({
          type: 'image',
          value: image.url,
          id: image.id
        })
        console.log(image)
      },
      addVideoItem(video) {
        console.log('addVideoItem', video)
        this.addDetailContentItem({
          type: 'video',
          value: video.full_url,
          id: video.id
        })
        console.log(video)
      },
      addOneGoods() {
        this.showGoods()
        this.isCanSelectMore = false
      },
      deleteContentItem(idx, item) {
        this.addData.details.splice(idx, 1)
        if (item.type === 'goods') {
          let index = this.addData.goodsList.findIndex(goods => goods.id === item.value.id)
          if (index !== -1) this.addData.goodsList.splice(index, 1)
        }
      },
      // 托拽
      _setSort() {
        console.log(this.addData.details)
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
          let isInList = this.addData.goodsList.findIndex((items) => items.id === item.id)
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
            if (this.addData.goodsList.length + this.selectGoods.length === 5) {
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
        this.addData.goodsList.splice(index, 1)
      },
      // 单个添加
      _additionOne(item, index) {
        if (item.selected === 1) {
          return
        }
        if (this.addData.goodsList.length === 5) {
          this.$toast.show('选择商品数量不能超过5个')
          return
        }
        this.chooseGoods[index].selected = 1
        this.addData.goodsList.push(item)
        if (this.currentType === '0') {
          this.selectGoods = []
          this.addDetailContentItem({type: 'goods', value: item})
        } else {
          this.chooseGoods.forEach((item) => {
            if (item.selected === 1) {
              let idx = this.selectGoods.findIndex((child) => child.id === item.id)
              if (idx !== -1) {
                this.selectGoods.splice(idx, 1)
              }
            }
          })
        }

      },
      // 批量添加
      _batchAddition() {
        this.chooseGoods = this.chooseGoods.map((item) => {
          item.selected = item.selected === 2 ? 1 : item.selected
          return item
        })
        this.addData.goodsList = this.addData.goodsList.concat(this.selectGoods)
        if (this.currentType === '0') {
          this.selectGoods.forEach(item => {
            this.addDetailContentItem({type: 'goods', value: item})
          })
        }
        this.selectGoods = []
        this.hideGoods()

      },
      justifyConent() {
        let message = ''
        if (!this.addData.category) message = '请选择内容分类'
        else if (!this.addData.title) message = '请输入文章标题'
        else if (this.addData.title && (this.addData.title.length < 5 || this.addData.title.length > 8)) message = '请输入5-8个字的文章标题'
        else if (!this.addData.coverImage.id) message = '请上传封面'
        else if (!this.addData.authPhoto.id) message = '请上传作者头像'
        else if (!this.addData.authName) message = '请填写作者名字'
        else if (this.currentType === '1') {
          if (!this.addData.videoContent.id) message = '请上传视频内容'
          else if (!this.addData.videoIntroduce) message = '请填写视频简介'
        } else if (this.currentType === '2' && !this.addData.foodList) message = '请填写食材清单'
        else if (this.currentType !== '1' && !this.addData.details.length) message = '请编辑内容详情'
        else if (this.addData.goodCount) this.addData.goodCount = 0
        else if (this.addData.lookCount) this.addData.lookCount = 0
        if (message) {
          this.$toast.show(message)
          return false
        } else {
          return true
        }
      },
      // 上线
      async submitLaunch() {
        let res = this.justifyConent()
        console.log(res, this.addData.details)
      },
      // 草稿
      async submitDraft() {
      }
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
    margin-top: 30px
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
        padding: 20px 20px 20px 20px

        .auto-input
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


      .video-wrap
        width: 265px
        height: 140px
        border-radius 4px
        position: relative
        object-fit: fill

        .delete-icon
          position: absolute
          top: 0
          right: 0
          width: 18px
          height: @width
          icon-image(icon-delete_img)

      .video-content-wrap
        padding: 12px
        width: 265px
        height: 140px
        display flex
        flex-direction column
        justify-content space-around
        align-items center
        background: #FAFAFA
        border-1px(#D3D8DC, 4px, dashed)

        .video-tip
          width: 100%
          padding: 0px 14px 20px
          flex: 1
          icon-image(pic-video_select)
          background-origin content-box
          background-repeat no-repeat

        .upload-video-wrap
          &:hover  .upload-video
            color: #ffffff
            background: $color-main
            cursor pointer

        .upload-video
          border-radius: 2px
          height: 28px
          padding: 0px 10px

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
          font-size: $font-size-14
          font-family: $font-family-regular
          transition: all 0.3s
          text-align: center
          border-radius: 2px
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

        .content-item
          border-1px(#D3D8DC)
          border-radius: 2px
          background: #fff
          height: 140px
          position relative
          margin-bottom: 20px
          padding: 14px

          .good-item
            height: 112px
            display flex

            .goods-photo
              width: 112px
              height: @width

            .info
              margin-left: 14px
              flex: 1
              display flex
              flex-direction column
              justify-content space-around

            .name
              font-family $font-family-medium
              font-size: $font-size-16
              color: #111111
              overflow hidden
              text-overflow ellipsis
              white-space: nowrap

            .details
              font-family $font-family-regular
              font-size: $font-size-14
              color: #808080
              margin: 0px 0px 5px
              overflow hidden
              text-overflow ellipsis
              white-space: nowrap

            .price-now
              color: #FA7500
              font-size: 32px
              font-family $font-family-medium

              .small
                font-size: $font-size-20

                .unit
                  font-family $font-family-regular

            .price
              color: #B7B7B7
              font-size: $font-size-30
              font-family $font-family-regular
              text-decoration-line line-through
              margin-left 6px

          .conten-video
          .conten-image
            width: 112px
            height @width
            border-radius 2px

          .edit-textarea
            border-width: 0px
            padding: 0px
            scroll-opacity(5px, 100px)
            height: 100%
            width: 100%

          &:last-child
            margin-bottom: 0px

          .close-icon
            width: 12px
            height: @width
            icon-image(icon-close_content)
            position absolute
            right: 10px
            top: 10px


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

    &.add-category-box
      width: 380px
      height: 213px

      .add-category-input
        width: 340px
        margin-top:7px
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
      border-none()
    .page-box
      padding: 0 20px
      box-sizing: border-box
      height: 77px
      align-items: center
      display: flex


</style>
