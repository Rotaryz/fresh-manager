<template>
  <div class="advertisement normal-box">
    <div class="identification">
      <div class="identification-page">
        <img src="./icon-new_commodity@2x.png" class="identification-icon">
        <p class="identification-name">{{editName}}{{name}}</p>
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
            <zb-dropdown v-model="addData.category"
                         :data="articleCategoryList"
                         :width="400"
                         :height="40"
                         :defaultLabel="addData.categoryName"
                         valueKey="id"
                         :disabled="isDisabled"
                         placeholder="请选择内容分类" @change-visible="_getArticleCategory"
            ></zb-dropdown>
          </div>
          <div v-if="!isDisabled" class="add-category-operate hand" @click="addCategory">添加分类</div>
        </div>
        <!--标题-->
        <div class="edit-item">
          <div class="edit-title">
            <span class="start">*</span>
            {{name}}标题
          </div>
          <div class="edit-input-box">
            <input v-if="currentType === 'video'"
                   v-model="addData.title"
                   :placeholder="'在此输入'+name+'标题，最多30个字'"
                   :disabled="isDisabled"
                   class="edit-input title-input"
                   type="text"
                   max-length="30"
            >
            <input v-else
                   v-model="addData.title"
                   :placeholder="'在此输入'+name+'标题，最少5个最多50个字'"
                   :disabled="isDisabled"
                   class="edit-input title-input"
                   type="text"
                   max-length="50"
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
                         :videoSize="10"
                         :disabled="isDisabled"
                         :fileType="currentType!=='video' ?'image-video' :'image'"
                         @failFile="failFile"
                         @getPic="getPic"
                         @delPic="delPic"
                         @successVideo="getCoverVideo"
            ></base-upload>
            <div v-if="!isDisabled" class="tip">
              <template v-if="currentType === 'video'">
                请添加不大于10M的清晰图片
              </template>
              <template v-else>
                请添加不大于10M的清晰图片或视频(格式:mp4、3gp、m3u8、webm)
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
            <base-upload :imageUrl="addData.authPhoto.url"
                         :disabled="isDisabled"
                         imageIconClassName="add-image-head-photo"
                         fileType="image"
                         @failFile="failFile"
                         @getPic="getAuthorPic"
                         @delPic="delAuthorPic"
            ></base-upload>
            <div class="auto-input">
              <input v-model="addData.authName"
                     :disabled="isDisabled"
                     type="text"
                     placeholder="请输入作者名称10个字以内"
                     class="edit-input"
                     maxlength="10"
              >
              <input v-model="addData.authSignature"
                     :disabled="isDisabled"
                     type="text"
                     placeholder="请输入30个字的个性签名"
                     class="edit-input edit-signature"
                     maxlength="30"
              >
            </div>
          </div>
        </div>
        <!-- 视频  视频内容-->
        <div v-if="currentType === 'video'" class="edit-item">
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
                <div v-if="!isDisabled" class="delete-icon" @click="deleteVideoContent"></div>
              </div>
              <div class="tip">
                <template v-if="!isDisabled">
                  视频上传成功，处理完成
                </template>
                <div>视频名称-{{addData.videoContent.name}}</div>
              </div>
            </template>
            <template v-else>
              <div class="video-content-wrap">
                <div class="video-tip"></div>
                <div class="upload-video-wrap">
                  <base-upload :videoUrl="addData.videoContent.url"
                               :picNum="1"
                               :size="100"
                               :disabled="isDisabled"
                               fileType="video-custom"
                               @failFile="failFile"
                               @successVideo="getVideoContent"
                  >
                    <button class="upload-video btn-main  hand">
                      点击上传视频
                    </button>
                  </base-upload>
                </div>
              </div>
              <div class="tip">
                请添加小于100M,格式为mp4、3gp、m3u8、webm的视频
              </div>
            </template>

          </div>
        </div>
        <!--视频  视频简介-->
        <div v-if="currentType === 'video'" class="edit-item">
          <div class="edit-title">
            <span class="start">*</span>
            视频简介
          </div>
          <div class="edit-input-box  flex-box flex-1">
            <textarea v-model="addData.videoIntroduce" :disabled="isDisabled" class="edit-textarea edit-input" placeholder="" maxlength="60"></textarea>
            <span class="num">{{addData.videoIntroduce && addData.videoIntroduce.length || 0}}/60</span>
          </div>
        </div>
        <!--菜谱  食材清单-->
        <div v-if="currentType === 'cookbook'" class="edit-item">
          <div class="edit-title">
            <span class="start">*</span>
            食材清单
          </div>
          <div class="edit-input-box  flex-box flex-1">
            <textarea id="test"
                      v-model="addData.foodList"
                      :disabled="isDisabled"
                      class="edit-textarea edit-input"
                      placeholder="例子：大蒜，酱油，猪肉，食材之间用逗号隔开，最多输入50个字符"
                      maxlength="100"
            ></textarea>
            <span class="num">{{addData.foodList && addData.foodList.length || 0}}/100</span>
          </div>
        </div>
        <!--视频/菜谱 添加商品-->
        <div v-if="currentType !== 'common'" class="edit-item add-goods-wrap">
          <div class="edit-title">
            添加商品
          </div>
          <div class="edit-input-box">
            <div v-if="!isDisabled" class="activity-tab  flex-box">
              <div class="add-goods-btn  btn-main hand" @click="showGoods">
                添加商品<span class="add-icon"></span>
              </div>
              <div class="tip">最多添加5个商品</div>
            </div>
            <div v-if="addData.goodsList && addData.goodsList.length" :class="['goods-list-box',{disable:isDisabled}]">
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
        <div v-if="currentType!=='video'" class="edit-item">
          <div class="edit-title">
            <span class="start">*</span>
            内容详情
          </div>
          <div class=" edit-input-box flex-1">
            <div v-if="!isDisabled" class="add-cont-type-box">
              <div class="add-cont-type-item  hand" @click="addTextItem">
                <div class="icon icon-text"></div>
                <div>文本</div>
              </div>
              <div class="add-cont-type-item  hand">
                <base-upload fileType="image-custom" @getPic="addImageItem">
                  <div class="add-cont-type-item">
                    <div class="icon icon-img"></div>
                    <div>图片</div>
                  </div>
                </base-upload>
              </div>
              <div class="add-cont-type-item hand">
                <base-upload fileType="video-custom" @successVideo="addVideoItem">
                  <div class="add-cont-type-item  hand">
                    <div class="icon icon-video"></div>
                    <div>视频</div>
                  </div>
                </base-upload>
              </div>
              <!---文章-->
              <div v-if="currentType==='common'" class="add-cont-type-item  hand" @click="addOneGoods">
                <div class="icon icon-goods"></div>
                <div>商品</div>
              </div>
            </div>
            <draggable v-if="currentType!=='video' && addData.details.length" ref="detailsContent" v-model="addData.details" :options="{disabled:isDisabled}" class="content-details">
              <!--<transition-group>-->
              <div v-for="(item, idx) in addData.details" :key="idx" class="content-item">
                <div v-if="!isDisabled" class="close-icon hand" @click="deleteContentItem(idx,item)"></div>
                <img v-if="item.type==='image'" :src="item.value" class="content-image">
                <video v-else-if="item.type==='video'" :src="item.value" class="content-video"></video>
                <div v-else-if="item.type==='goods'" class="good-item">
                  <img v-if="item.value.is_online === 0" src="./pic-off_shelf@2x.png" class="goods-photo">
                  <img v-else-if="item.value.usable_stock === 0" src="./pic-out_stock@2x.png" class="goods-photo">
                  <img v-else :src="item.value.goods_cover_image" class="goods-photo">
                  <div class="info">
                    <div class="name">{{item.value.name}}</div>
                    <div class="details">{{item.value.describe}}</div>
                    <div class="operate">
                      <span class="price-now">10<span class="small">.8<span class="unit">元</span></span></span>
                      <span class="price">{{item.value.original_price}}元</span>
                    </div>
                  </div>
                </div>
                <textarea v-else v-model="item.value" :disabled="isDisabled" class="edit-textarea edit-input" placeholder="输入文字">
              </textarea>
              </div>
              <!--</transition-group>-->
            </draggable>
          </div>
        </div>

        <!-- 其他设置 -->
        <div class="edit-item other-edit-item">
          <div class="edit-title">
            其他设置
          </div>
          <div class="edit-input-box">
            <div class="edit-input-item">
              <div class="edit-title">
                初始点赞人数
              </div>
              <input v-model="addData.goodCount"
                     :disabled="isDisabled"
                     type="number"
                     placeholder=""
                     class="edit-input"
              >
            </div>
            <!--<div class="edit-input-item look-item">-->
            <!--<div class="edit-title">-->
            <!--初始浏览人数-->
            <!--</div>-->
            <!--<input v-model="addData.lookCount"-->
            <!--:disabled="isDisabled"-->
            <!--type="number"-->
            <!--placeholder=""-->
            <!--class="edit-input"-->
            <!--&gt;-->
            <!--</div>-->
          </div>
        </div>
      </div>
    </div>
    <div class="back">
      <template v-if="!id">
        <div class="back-cancel back-btn hand" @click="_submitBtn('addDraft',0)">存为草稿</div>
        <div class="back-btn back-submit hand" @click="_submitBtn('addContent',1)">上线</div>
      </template>
      <template v-else-if="isDisabled">
        <div class="back-cancel back-btn hand" @click="goBack">返回</div>
      </template>
      <template v-else>
        <div class="back-btn back-cancel hand" @click="_submitBtn('editContetnArticle',0)">存为草稿</div>
        <div class="back-btn back-submit hand" @click="_submitBtn('editContetnArticle',1)">上线</div>
      </template>
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
            <zb-dropdown v-model="goodsCategoryFrist"
                         :data="goodsCategoryFristList"
                         placeholder="一级分类"
                         valueKey="id"
                         :width="218"
                         @change="_selectCategoryFirst"
            ></zb-dropdown>
          </div>
          <div class="tab-item">
            <zb-dropdown v-model="goodsCategorySecond"
                         :data="goodsCategorySecondList"
                         placeholder="二级分类"
                         valueKey="id"
                         :width="140"
                         @change="_selectCategorySecond"
            ></zb-dropdown>
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
          <input v-model="addCategoryText" placeholder="长度不能超过4个字" maxlength="4" type="text" class="edit-input add-category-input">
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
  import ZbDropdown from '@components/zb-dropdown/zb-dropdown'
  import PhoneBox from './phone-box/phone-box'
  import API from '@api'
  import Draggable from 'vuedraggable'

  const PAGE_NAME = 'ARTICLE_ADD'
  const TITLE = '创作文章'
  const ARTICLE = 'common'
  const VIDEO = 'video'
  const COOKBOOK = 'cookbook'

  export default {
    name: PAGE_NAME,
    components: {
      DefaultModal,
      PhoneBox,
      Draggable,
      ZbDropdown
    },
    page: {
      title: TITLE
    },
    data() {
      return {
        id: "",
        isDisabled: false,
        currentType: 'common', // 现在创作类型
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
        addCategoryText: "",
        addData: {
          likes: [],
          category: '',
          categoryName: '',
          title: '',
          coverImage: {
            url: '',
            id: ''
          },
          coverVideo: {
            url: '',
            id: '',
            file_id: ''
          },
          authPhoto: {
            url: '',
            id: ''
          },
          authName: '',
          authSignature: '',
          goodCount: 30,
          lookCount: 50,
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
          articlePid: 0
        },
        articleCategoryList: [],// 内容分类列表
        // 已经选择的商品头部
        selectedGoodsCommodities: ['商品名称', '单位', '售价', '操作'],
        // 选择商品弹框删选条件
        chooseGoodsFilter: {
          limit: 7,
          page: 1,
          keyword: '',
          goods_category_id: '',
          is_online: 1
        },
        goodsCategoryFristList: [],
        goodsCategorySecondList: [],
        goodsCategoryFrist: '',
        goodsCategorySecond: '',
        chooseGoods: [], // 弹框商品列表
        goodsPage: {
          total: 1,
          per_page:
            10,
          total_page:
            1
        },
        selectGoods: [] // 单次选择的商品
      }
    },
    computed: {
      isShowEmpty() {
        return !(this.addData.title || this.addData.coverImage.id
          || this.addData.authPhoto.id || this.addData.authName
          || ((this.addData.videoContent.id || this.addData.videoIntroduce) && this.currentType === 'video')
          || (this.addData.goodsList.length)
          || (this.currentType === 'cookbook' && this.addData.foodList)
          || (this.currentType !== 'video' && this.addData.details.length))
      },
      name() {
        return this.typeList[this.currentType] && this.typeList[this.currentType].name || '文章'
      },
      editName() {
        return this.id ? (this.isDisabled ? '查看' : '编辑') : '创作'
      }
    },
    async created() {
      let query = this.$route.query
      this._getArticleCategory()
      this.currentType = query.type || 'common'
      this.id = query.id || ''
      this.isDisabled = Boolean(query.isSee) || false
      this.addData.articlePid = this.$route.query.articlePid || ''
      if (this.id || this.addData.articlePid) {
        this.$route.meta.params && this.changeDetialData(this.$route.meta.params)
        if (this.addData.articlePid) this.addData.category = 0
      } else {
        this._getAuth()
      }
      this._getLikes()
    },
    methods: {
      _getLikes() {
        let limit = this.addData.goodCount < 10 ? this.addData.goodCount : 10
        let params = {article_id: this.articleId || 0, preview: 1, limit, page: 1}
        API.Content.getLikes(params).then(res => {
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
          }
          this.addData.likes = res.data
        })
      },
      // 新增创建时获取最后一次作者信息
      _getAuth() {
        API.Content.getAuth().then(res => {
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
          }
          this.addData.authPhoto.url = res.data.head_image_url
          this.addData.authPhoto.id = res.data.head_image_id
          this.addData.authName = res.data.nickname
          this.addData.authSignature = res.data.sign
        }).finally(() => {
          this.$loading.hide()
        })
      },
      // 转换详情数据
      changeDetialData(obj) {
        // this.isDisabled = obj.status === 1
        this.currentType = obj.type || 'common'
        this.addData.title = obj.title
        this.addData.category = obj.category.id
        this.addData.categoryName = this.isDisabled ? obj.category.name : ''
        this._getArticleCategory()
        this.addData.coverImage.url = obj.cover_image.source_url
        this.addData.coverImage.id = obj.cover_image.id
        this.addData.coverVideo.url = obj.cover_video.full_url || ''
        this.addData.coverVideo.id = obj.cover_video.id || ''
        this.addData.authPhoto.url = obj.author.head_image_url
        this.addData.authPhoto.id = obj.author.head_image_id
        this.addData.authName = obj.author.nickname
        this.addData.authSignature = obj.author.sign
        this.addData.goodCount = obj.init_fabulous_num || 0
        this.addData.lookCount = obj.init_browse_num || 0
        obj.assembly.forEach(item => {
          if (item.type === 'combination' && item.style_type === 'content') {
            let details = []
            item.content.map(cont => {
              if (!(cont.content && cont.content.length)) return false
              let contItem = cont.content[0]
              /* eslint-disable */
              switch (cont.type) {
                case "image":
                  details.push({
                    type: 'image',
                    value: contItem.image.source_url,
                    id: contItem.image.id
                  })
                  break
                case "video":
                  details.push({
                    type: 'video',
                    value: contItem.video.full_url,
                    id: contItem.video.id
                  })
                  break
                case "text":
                  details.push({
                    type: 'text',
                    value: contItem.text,
                  })
                  break
                case "goods":
                  if (contItem.goods.goods_id) {
                    details.push({
                      type: 'goods',
                      value: {id: contItem.goods.goods_id, ...contItem.goods},
                    })
                    this.addData.goodsList.push({id: contItem.goods.goods_id, ...contItem.goods})
                  }
                  break
              }
            })
            this.addData.details = details
          }
          if (item.type === 'text' && item.style_type === 'content_cookbook_food_list') {
            this.addData.foodList = item.content[0].text
          }
          if (item.type === 'video' && item.style_type === 'content_video') {
            this.addData.videoContent.url = item.content[0].video.full_url
            this.addData.videoContent.name = item.content[0].video.name
            this.addData.videoContent.id = item.content[0].video.id
            this.addData.videoIntroduce = item.content[0].introduction
          }
          if (item.type === 'goods' && item.style_type === 'content_goods_list') {
            let goodsList = []
            item.content.forEach(item => {
              if (item.goods.goods_id) {
                goodsList.push({id: item.goods.goods_id, ...item.goods})
              }
            })
            this.addData.goodsList = goodsList
          }
        })
      },
      // 获取内容分类列表
      _getArticleCategory() {
        API.Content.getSortList().then(res => {
          if (res.error !== this.$ERR_OK) this.$toast.show(res.message)
          this.articleCategoryList = res.data
          if (!this.articleCategoryList.find(item => item.id === this.addData.category)) this.addData.category = ''
        }).finally(() => {
          this.$loading.hide()
        })
      },
      addCategory() {
        this.addCategoryText = ''
        this.$refs.addCategory.showModal()
      },
      _submitCategory() {
        API.Content.addSort({name: this.addCategoryText}).then(res => {
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
          }
          this.$toast.show(res.message)
          this.$refs.addCategory.hideModal()
        }).finally(() => {
          this.$loading.hide()
        })
      },
      // 封面
      getCoverVideo(video) {
        this.addData.coverVideo.id = video.id
        this.addData.coverVideo.file_id = video.file_id
        this.addData.coverVideo.url = video.full_url
        this.addData.coverImage.id = video.cover_image_id
        this.addData.coverImage.url = video.full_cover_url
        // if (!this.addData.coverImage.id) {
        //   setTimeout(() => {
        //     this._getCoverImage(this.addData.coverVideo.file_id)
        //   }, 10000)
        // }
      },
      _getCoverImage(file_id) {
        this.addData.coverVideo.file_id && API.Content.getCoverImage({file_id}).then(res => {
          if (res.error !== this.$ERR_OK) return false
          this.addData.coverImage.id = res.data.cover_image_id
          this.addData.coverImage.url = res.data.full_cover_url
        })
      },
      getPic(image) {
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
          id: '',
          file_id: ''
        }
      },
      failFile(msg) {
        this.$toast.show(msg)
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
      },
      addVideoItem(video) {
        this.addDetailContentItem({
          type: 'video',
          value: video.full_url,
          id: video.id,
          file_id: video.file_id
        })
      },
      addOneGoods() {
        this.showGoods()
      },
      deleteContentItem(idx, item) {
        this.addData.details.splice(idx, 1)
        if (item.type === 'goods') {
          let index = this.addData.goodsList.findIndex(goods => goods.id === item.value.id)
          if (index !== -1) this.addData.goodsList.splice(index, 1)
        }
      },
      // --------------弹窗
      // 获取商品列表
      async _getGoodsList() {
        this.$loading.show()
        let res = await API.Product.getGoodsList(this.chooseGoodsFilter)
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
          // 0 没有选择 2 选择高亮  1 单个确认进入列表
          return item
        })
        this.$loading.hide()
      },
      // 展示商品弹窗
      async showGoods() {
        this.chooseGoodsFilter.page = 1
        this.chooseGoodsFilter.goods_category_id = ""
        this.getCategoryFirst()
        await this._getGoodsList()
        this.$refs.goods.showModal()
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
      async getCategoryFirst() {
        let res = await API.Product.getCategory({parent_id: ''})
        this.goodsCategoryFristList = res.error === this.$ERR_OK ? res.data : []
        this.goodsCategorySecondList = []
        this.goodsCategorySecond = ''
      },
      async _selectCategoryFirst() {
        let res = await API.Product.getCategory({parent_id: this.goodsCategoryFrist})
        this.goodsCategorySecondList = res.error === this.$ERR_OK ? res.data : []
        this.goodsCategoryChange(this.goodsCategoryFrist)
      },
      async _selectCategorySecond() {
        this.goodsCategoryChange(this.goodsCategorySecond)
      },
      // 选择分类
      async goodsCategoryChange(id) {
        this.chooseGoodsFilter.goods_category_id = id
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
            if (this.addData.goodsList.length + this.selectGoods.length >= 5) {
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
        if (this.addData.goodsList.length >= 5) {
          this.$toast.show('选择商品数量不能超过5个')
          return
        }
        this.chooseGoods[index].selected = 1
        this.addData.goodsList.push(item)
        if (this.currentType === 'common') {
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
        if (this.currentType === 'common') {
          this.selectGoods.forEach(item => {
            this.addDetailContentItem({type: 'goods', value: item})
          })
        }
        this.selectGoods = []
        this.hideGoods()
      },
      justifyConent(status) {
        let message = ''
        if (!this.addData.category) message = '请选择内容分类'
        else if (!this.addData.title) message = '请输入文章标题'
        else if (this.addData.title && (this.addData.title.length < 5 || this.addData.title.length > 50)) message = '请输入文章标题最少5个最多50个字符'
        else if (!this.addData.coverVideo.id && !this.addData.coverImage.id) message = '请上传封面'
        // else if (this.currentType !== 'video' && this.addData.coverVideo.id && !this.addData.coverImage.id) {
        //   this._getCoverImage(this.addData.coverVideo.file_id)
        //   message = '正在处理视频第一帧作为封面图，请稍后上线'
        // }
        else if (!this.addData.authPhoto.id) message = '请上传作者头像'
        else if (!this.addData.authName) message = '请填写作者名字'
        else if (!this.addData.authSignature) message = '请填写作者签名'
        else if (this.currentType === 'video') {
          if (!this.addData.videoContent.id) message = '请上传视频内容'
          else if (!this.addData.videoIntroduce) message = '请填写视频简介'
        } else if (this.currentType === 'cookbook' && !this.addData.foodList) message = '请填写食材清单'
        else if (this.currentType !== 'video' && !this.addData.details.length) message = '请编辑内容详情'
        else if (!(/^[+]{0,1}(\d+)$/.test(this.addData.goodCount))) message = '请输入正确的初始化点赞数'
        // else if (!(/^[+]{0,1}(\d+)$/.test(this.addData.lookCount))) message = '请输入正确的初始化浏览数'
        // else if (this.addData.goodCount > this.addData.lookCount) message = '初始化点赞数不能大于初始化浏览数'
        if (message) {
          this.$toast.show(message)
          return false
        } else {
          return true
        }
      },
      justifyDraft() {
        let message = ''
        if (!this.addData.title) message = '请输入文章标题'
        if (message) {
          this.$toast.show(message)
          return false
        } else {
          return true
        }
      },
      // 上线
      async _submitBtn(name, status) {
        let res = status ? this.justifyConent() : this.justifyDraft()
        if (res) {
          let data = this.getSubmitData(status)
          let res = await API.Content[name](data, true)
          this.$toast.show(res.message)
          this.$loading.hide()
          if (res.error === this.$ERR_OK) this.$router.go(-1)
        }
      },
      // 上线
      getSubmitData(status) {
        let params = {
          type: this.currentType,
          title: this.addData.title.trim(),
          category_id: this.addData.category,
          author_image_id: this.addData.authPhoto.id,
          author_nickname: this.addData.authName.trim(),
          author_sign: this.addData.authSignature.trim(),
          image_cover_id: this.addData.coverImage.id,
          video_cover_id: this.addData.coverVideo.id,
          init_fabulous_num: this.addData.goodCount,
          init_browse_num: this.addData.lookCount,
          article_pid: this.addData.articlePid,
          assembly: [],
          status
        }
        if (this.currentType === 'video' || this.currentType === 'cookbook') {
          this.addData.goodsList.length && params.assembly.push({
            type: "goods",
            style_type: "content_goods_list",
            content: this.addData.goodsList.map(item => {
              return {
                "goods_id": item.id,
                "goods_sku_id": item.goods_sku_id
              }
            })
          })
          if (this.currentType === 'video') {
            params.assembly.push({
              type: "video",
              style_type: "content_video",
              content: [{
                video_id: this.addData.videoContent.id,
                title: this.addData.videoContent.name,
                introduction: this.addData.videoIntroduce
              }]
            })
          } else if (this.currentType === 'cookbook') {
            params.assembly.push({
              type: "text",
              style_type: "content_cookbook_food_list",
              content: [{
                text: this.addData.foodList
              }]
            })
          }
        }
        if (this.currentType !== 'video') {
          let contents = this.addData.details.map(item => {
            let newItem = {
              type: item.type,
              style_type: 'content_' + item.type
            }
            /* eslint-disable */
            switch (item.type) {
              case 'goods':
                newItem.content = [{
                  goods_id: item.value.id,
                  goods_sku_id: item.value.goods_sku_id
                }]
                break;
              case 'image':
                newItem.content = [{
                  image_id: item.id
                }]
                break;
              case 'video':
                newItem.content = [{
                  video_id: item.id,
                  title: '',
                  introduction: ''
                }]
                break;
              default:
                newItem.content = [{
                  text: item.value
                }]
            }
            return newItem
          })
          params.assembly.push({
            type: "combination",
            style_type: "content",
            content: contents
          })
        }
        if (this.id) params.id = this.id
        return params
      },
      goBack() {
        this.$router.go(-1)
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
    height: 40px
    display: flex
    align-items: center
    justify-content: space-between
    border: 1px solid $color-line
    transition: all 0.3s

    &:hover
      border-color: #ACACAC

    &[disabled]:hover
      border: 1px solid $color-line

    &:focus
      border-color: $color-main

  .flex-box
    display flex
    align-items center

  .flex-1
    flex: 1

    .edit-textarea
      width: 100%

  /* 编辑每一行样式*/
  .edit-item
    display: flex
    color: #2A2A2A
    margin-top: 30px
    position: relative

    &.other-edit-item
      margin-bottom: 60px
      .edit-input
        width: 240px
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
          color: #666

      .look-item
        margin-top 20px
        margin-bottom: 60px

      &.author-info-box
        flex: 1
        background: #F5F7FA
        padding: 20px 20px 20px 20px

        .auto-input
          margin-left: 20px

          .edit-input
            min-width: 270px

          .edit-signature
            margin-top: 10px

      .edit-textarea
        min-width: 370px
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
        object-fit: cover
        background-color $color-np-content

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
        margin-bottom: 20px

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
        width: 100%

        .edit-title
          margin-top 0px
          line-height 28px
          height: 28px

        .goods-list-box
          background: $color-white
          overflow: visible
          display: flex
          flex-direction: column
          flex: 1

          &.disable
            .list-header :last-child
            .list :last-child
              display none

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
        background-color #fdfdfd

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

        .content-item
          border-1px(#D3D8DC)
          border-radius: 2px
          background: #fff
          height: 140px
          position relative
          margin-bottom: 20px

          .good-item
            min-height: 112px
            display flex
            padding: 14px

            .goods-photo
              width: 112px
              height: @width
              flex-shrink 0
              object-fit cover

            .info
              margin-left: 14px
              width: 0
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
              word-break: break-all

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

          .content-video
          .content-image
            width: 112px
            height @width
            border-radius 2px
            object-fit: cover
            margin: 14px
            background-color $color-np-content
            object-fit: cover

          .edit-textarea
            border-width: 0px
            padding: 14px
            scroll-opacity(5px, 100px)
            height: 100%
            width: 100%
            resize: none

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
        margin-top: 7px

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
