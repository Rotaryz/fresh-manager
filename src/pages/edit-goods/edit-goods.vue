<template>
  <div class="table">
    <base-tab-select :infoTabIndex="tabIndex" :tabStatus="tabStatus" :lineWidth="104" @getStatusTab="_changeStatusTab"></base-tab-select>
    <template v-if="tabIndex===0">
      <div class="edit-leader">
        <div class="content-header content-padding-top">
          <div class="content-title">商品信息</div>
        </div>
        <div class="leader-box">
          <div class="edit-item">
            <div class="edit-title">
              <span class="start">*</span>
              商品名称
            </div>
            <div class="edit-input-box">
              <input v-model="goods_skus.goods_material_name" type="text" class="edit-input" maxlength="29" @mousewheel.native.prevent>
            </div>
            <div class="edit-pla">该商品名称为后台名称，不展示在小程序</div>
          </div>
          <div class="edit-item">
            <div class="edit-title">
              <span class="start">*</span>
              类目
            </div>
            <div class="edit-input-box mini-edit-input-box">
              <div class="mini-mr20">
                <base-drop-down :height="40" :width="190" :select="stairSelect" @setValue="setStairValue"></base-drop-down>
              </div>
              <div class="mini-mr20">
                <base-drop-down :height="40" :width="190" :select="secondSelect" @setValue="setSecondValue"></base-drop-down>
              </div>
              <base-drop-down :height="40" :width="190" :select="thirdlySelect" @setValue="setThirdlyValue"></base-drop-down>
            </div>
          </div>
          <div class="edit-item  edit-image-box">
            <div class="edit-title">
              <!--<span class="start">*</span>-->
              商品图片
            </div>
            <div class="image-box">
              <div class="edit-image">
                <draggable v-model="msg.goods_main_images" class="draggable" @update="_setSort()">
                  <div v-for="(item, index) in msg.goods_main_images" :key="index" class="show-image hand">
                    <img class="img" :src="item.image_url" alt="">
                    <span class="close" @click="delMainPic(index)"></span>
                  </div>
                </draggable>
                <div v-if="msg.goods_main_images.length < picNum" class="add-image hand">
                  <input type="file"
                         class="sendImage hand"
                         multiple="multiple"
                         accept="image/*"
                         @change="_addPic('goods_main_images', picNum, $event)"
                  >
                  <div v-if="showLoading && uploadImg === 'goods_main_images'" class="loading-mask">
                    <img src="./loading.gif" class="loading">
                  </div>
                </div>
              </div>
              <div class="tip">该图片不展示在小程序端，建议图片的尺寸：750*750，支持png，jpeg，jpg格式，最多可上传5张。</div>
            </div>
          </div>
        </div>
        <div class="content-header">
          <div class="content-title">商品规格</div>
        </div>
        <div class="leader-box">
          <div class="edit-item">
            <div class="edit-title">
              <span class="start">*</span>
              基本单位
            </div>
            <div class="edit-input-box">
              <base-drop-down :height="40" :width="400" :select="dispatchSelect" :isUse="!id" @setValue="setBaseValue"></base-drop-down>
            </div>
          </div>
          <div class="edit-item">
            <div class="edit-title">
              <span class="start">*</span>
              销售规格
            </div>
            <div class="edit-input-box mini-edit-input-box">
              <input v-model="goods_skus.base_sale_rate" type="number" class="edit-input mini-edit-input" maxlength="10" :disabled="completeStatus * 1 === 1">
              <div class="edit-input-unit"><span>{{goods_skus.base_unit}}</span>/</div>
              <base-drop-down :height="40" :width="133" :isUse="completeStatus * 1 === 0" :select="saleSelect" @setValue="saleSelectValue"></base-drop-down>
            </div>
            <div class="edit-pla">例如：基本单位是kg，销售单位是份，则销售规格可输入0.5，即0.5kg/份</div>
          </div>
          <div class="edit-item">
            <div class="edit-title">
              <span class="start">*</span>
              商品编码
            </div>
            <div class="edit-input-box">
              <input v-model="goods_skus.goods_sku_encoding" type="text" class="edit-input" maxlength="20">
            </div>
          </div>
        </div>
        <div class="content-header procurement-top">
          <div class="content-title">库存信息</div>
        </div>
        <div class="leader-box">
          <div class="edit-item">
            <div class="edit-title">
              <span class="start">*</span>
              销售库存
            </div>
            <div class="edit-input-box goods-select-box">
              <div class="goods-select-left" @click="selectStock(1)">
                <div class="goods-select-icon" :class="msg.is_presale * 1 === 1 ? 'goods-select-icon-active' : ''"></div>
                <div class="goods-select-text">预售库存</div>
              </div>
              <input v-model="goods_skus.presale_usable_stock" type="number" class="edit-input edit-input-select" :disabled="msg.is_presale * 1 !== 1">
              <div class="stock-box-text">{{goods_skus.sale_unit}}</div>
              <div class="goods-select-left" @click="selectStock(0)">
                <div class="goods-select-icon" :class="msg.is_presale * 1 === 1 ? '' : 'goods-select-icon-active'"></div>
                <div class="goods-select-text">仓库库存</div>
              </div>
              <div v-if="id" class="stock-box-text current-stock">当前可用库存<span class="stock-color">{{goods_skus.warehouse_usable_stock}}</span>件</div>
            </div>
          </div>
        </div>
        <div class="content-header procurement-top">
          <div class="content-title">供应链信息</div>
        </div>
        <div class="leader-box">
          <div class="edit-item">
            <div class="edit-title">
              <span class="start">*</span>
              供应商
            </div>
            <div class="edit-input-box">
              <base-drop-down :height="40" :width="400" :isInput="true" :select="supplierSelect" isInputPla="请选择供应商"
                              @setValue="supplierSelectValue"
                              @changeText="changeText"
              ></base-drop-down>
            </div>
          </div>
          <div class="edit-item">
            <div class="edit-title">
              <span class="start">*</span>
              采购规格
            </div>
            <div class="edit-input-box mini-edit-input-box">
              <input v-model="goods_skus.base_purchase_rate" type="number" class="edit-input mini-edit-input" maxlength="10">
              <div class="edit-input-unit"><span>{{goods_skus.base_unit}}</span>/</div>
              <base-drop-down :height="40" :width="133" :select="purchaseSelect" @setValue="purchaseSelectValue"></base-drop-down>
            </div>
            <div class="edit-pla">例如：基本单位是kg，采购单位是箱，则采购规格可输入10，即10kg/箱</div>
          </div>
          <div class="edit-item">
            <div class="edit-title">
              <span class="start">*</span>
              采购单价
            </div>
            <div class="edit-input-box">
              <input v-model="goods_skus.purchase_price" type="number" class="edit-input" maxlength="10">
            </div>
            <div v-if="goods_skus.purchase_unit" class="edit-pla">元/{{goods_skus.purchase_unit}}</div>
          </div>
          <div class="edit-item">
            <div class="edit-title">
              <span class="start">*</span>
              损耗比
            </div>
            <div class="edit-input-box">
              <input v-model="goods_skus.damage_rate" type="number" class="edit-input">
            </div>
            <div class="edit-pla">根据耗损的百分比额外增加采购数量（%）</div>
          </div>
          <div class="edit-item">
            <div class="edit-title">
              <span class="start">*</span>
              是否称重
            </div>
            <div class="edit-input-box">
              <div class="list-item-btn" @click="switchBtn">
                <base-switch width="80px" transform="50px" confirmText="称重" cancelText="不称重" :status="goods_skus.is_weight"></base-switch>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-if="tabIndex===1 && id">
      <div class="edit-leader">
        <div class="content-header content-padding-top">
          <div class="content-title">图文信息</div>
        </div>
        <div class="leader-box">
          <div class="edit-item  edit-image-box">
            <div class="edit-title">
              <span class="start">*</span>
              封面图
            </div>
            <div class="image-box">
              <div class="edit-image">
                <draggable v-model="saleMsg.goods_banner_images" class="draggable" @update="_setSort()">
                  <div v-for="(item, index) in saleMsg.goods_banner_images" :key="index" class="show-image hand">
                    <img class="img" :src="item.image_url" alt="">
                    <span class="close" @click="delPic(index)"></span>
                  </div>
                </draggable>
                <div v-if="saleMsg.goods_banner_images.length < picNum" class="add-image hand">
                  <input type="file" class="sendImage hand" multiple="multiple" accept="image/*" @change="_addSalePic('goods_banner_images', picNum, $event)">
                  <div v-if="showLoading && uploadImg === 'goods_banner_images'" class="loading-mask">
                    <img src="./loading.gif" class="loading">
                  </div>
                </div>
              </div>
              <div class="tip">该图片展示在小程序端，建议图片的尺寸：750*750，支持png，jpeg，jpg格式，最多可上传5张，首张为封面。</div>
            </div>
          </div>
          <div class="edit-item  edit-image-box">
            <div class="edit-title">
              <span class="start">*</span>
              详情图
            </div>
            <div class="image-box">
              <div class="edit-image">
                <draggable v-model="saleMsg.goods_detail_images" class="draggable" @update="_setSort()">
                  <div v-for="(item, index) in saleMsg.goods_detail_images" :key="index" class="show-image hand">
                    <img class="img" :src="item.image_url" alt="">
                    <span class="close" @click="delPic2(index)"></span>
                  </div>
                </draggable>
                <div v-if="saleMsg.goods_detail_images.length < 15" class="add-image hand">
                  <input type="file" class="sendImage hand" multiple="multiple" accept="image/*" @change="_addSalePic('goods_detail_images', 15, $event)">
                  <div v-if="showLoading && uploadImg === 'goods_detail_images'" class="loading-mask">
                    <img src="./loading.gif" class="loading">
                  </div>
                </div>
              </div>
              <div class="tip">上传图片的格式png，jpeg，jpg，最多可上传15张。</div>
            </div>
          </div>
        </div>
        <div class="content-header">
          <div class="content-title">销售信息</div>
        </div>
        <div class="leader-box">
          <div class="edit-item">
            <div class="edit-title">
              <span class="start">*</span>
              商品销售标题
            </div>
            <div class="edit-input-box">
              <input v-model="saleMsg.name" type="text" class="edit-input" maxlength="29" @mousewheel.native.prevent>
            </div>
            <div class="edit-pla">展示在小程序端</div>
          </div>
          <div class="edit-item">
            <div class="edit-title">
              <span class="start" style="opacity: 0">*</span>
              商品副标题
            </div>
            <div class="edit-input-box">
              <textarea v-model="saleMsg.describe" class="edit-textarea edit-input" placeholder="输入商品副标题" maxlength="50"></textarea>
              <span class="num">{{saleMsg.describe && saleMsg.describe.length || 0}}/50</span>
            </div>
          </div>
          <div class="edit-item">
            <div class="edit-title">
              <span class="start">*</span>
              商品分类
            </div>
            <div class="edit-input-box mini-edit-input-box">
              <div class="mini-mr20">
                <base-drop-down :height="40" :width="190" :select="categoriesSelect" @setValue="setStairCategoriesValue"></base-drop-down>
              </div>
              <base-drop-down :height="40" :width="190" :select="categoriesSecondSelect" @setValue="setSecondCategoriesValue"></base-drop-down>
            </div>
          </div>
          <div class="edit-item">
            <div class="edit-title">
              销售规格
            </div>
            <div class="edit-input-box">
              <div class="sale-size">{{editSkus.base_sale_rate}}{{editSkus.base_unit}}/{{editSkus.sale_unit}}</div>
            </div>
          </div>
          <div class="edit-item">
            <div class="edit-title">
              <span class="start">*</span>
              划线价
            </div>
            <div class="edit-input-box">
              <input v-model="sale_skus.original_price" type="number" class="edit-input" maxlength="10">
            </div>
            <div v-if="goods_skus.sale_unit" class="edit-pla">元/{{goods_skus.sale_unit}}</div>
          </div>
          <div class="edit-item">
            <div class="edit-title">
              <span class="start">*</span>
              销售售价
            </div>
            <div class="edit-input-box">
              <input v-model="sale_skus.trade_price" type="number" class="edit-input">
            </div>
            <div v-if="goods_skus.sale_unit" class="edit-pla">元/{{goods_skus.sale_unit}}</div>
          </div>
          <div class="edit-item">
            <div class="edit-title">
              <span class="start">*</span>
              初始销量
            </div>
            <div class="edit-input-box">
              <input v-model="saleMsg.init_sale_count" type="number" class="edit-input">
            </div>
            <div class="edit-pla">仅展示在小程序，不影响订单</div>
          </div>
        </div>
      </div>
    </template>
    <div class="back">
      <div v-if="!isCopy" class="back-cancel back-btn hand" @click="_back">返回</div>
      <div class="back-btn back-submit hand" @click="_submitType">保存</div>
      <div v-if="isShow" class="back-btn back-submit hand" @click="_jumpCopyPage">一键复制</div>
    </div>
    <default-confirm ref="confirm" @confirm="changeEdit"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import API from '@api'
  import Draggable from 'vuedraggable'
  import storage from 'storage-controller'
  import _ from 'lodash'

  const PAGE_NAME = 'EDIT_GOODS'
  const TITLE = '新建商品'
  const ORDERSTATUS = [
    {text: '基础信息', status: 0},
    {text: '销售信息', status: 1}
  ]

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      Draggable,
      DefaultConfirm
    },
    props: {
      detail: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        id: this.$route.query.id || null,
        msg: {
          name: '',
          goods_material_category_id: 0,
          goods_main_images: [],
          goods_skus: [],
          is_presale: 1,
          save_type: 'base'
        },
        goods_skus: {
          goods_material_name: '',
          base_unit: '',
          base_sale_rate: '',
          sale_unit: '',
          goods_sku_encoding: '',
          presale_usable_stock: '',
          warehouse_usable_stock: '',
          supplier_id: 0,
          base_purchase_rate: '',
          purchase_unit: '',
          purchase_price: '',
          damage_rate: '',
          is_weight: 1
        },
        stairSelect: {check: false, show: false, content: '一级类目', type: 'default', data: []},
        secondSelect: {check: false, show: false, content: '二级类目', type: 'default', data: []},
        thirdlySelect: {check: false, show: false, content: '三级类目', type: 'default', data: []},
        dispatchSelect: {check: false, show: false, content: '基本单位', type: 'default', data: []},
        saleSelect: {check: false, show: false, content: '销售单位', type: 'default', data: []},
        purchaseSelect: {check: false, show: false, content: '采购单位', type: 'default', data: []},
        supplierSelect: {check: false, show: false, content: '选择供应商', type: 'default', data: []},
        saleMsg: {
          goods_banner_images: [],
          goods_detail_images: [],
          goods_skus: [],
          goods_category_id: 0,
          name: '',
          describe: '',
          init_sale_count: ''
        },
        sale_skus: {
          trade_price: '',
          original_price: ''
        },
        categoriesSelect: {check: false, show: false, content: '一级分类', type: 'default', data: []},
        categoriesSecondSelect: {check: false, show: false, content: '二级分类', type: 'default', data: []},
        preChildIndex: null,
        showLoading: false,
        picNum: 5,
        uploadImg: '',
        isSelectStock: true,
        tabStatus: ORDERSTATUS,
        tabIndex: 0,
        isSubmit: false,
        editRurchasePrice: 0,
        editRurchaseUnit: '',
        isCopy: this.$route.query.copy || null,
        isShow: this.$route.query.isShow || null,
        searchList: [],
        imgInput: '',
        completeStatus: 0,
        editSkus: {
          base_unit: '',
          base_sale_rate: '',
          sale_unit: ''
        }
      }
    },
    created() {
      this._setData()
      this.getSelectData()
      this.getSupplierData()
      this.getCategoriesData()
      this.getScmCategoriesData()
    },
    destroyed() {
      if (this.isCopy) {
        storage.remove('msg')
        storage.remove('goods_skus')
        storage.remove('saleMsg')
        storage.remove('sale_skus')
      }
    },
    methods: {
      // 顶部 切换
      _changeStatusTab(item, index) {
        this.tabIndex = index
      },
      /**
       * 设置默认数据 -> 编辑状态
       * @private
       */
      _setData() {
        if (!_.isEmpty(this.detail)) {
          this.msg = _.cloneDeep(this.detail)
          this.goods_skus = this.msg.goods_skus[0]
          this.editSkus = _.cloneDeep(this.goods_skus)
          this.saleSelect.content = this.goods_skus.sale_unit
          this.supplierSelect.content = this.goods_skus.supplier_name
          this.purchaseSelect.content = this.goods_skus.purchase_unit
          this.editRurchaseUnit = this.goods_skus.purchase_unit
          this.dispatchSelect.content = this.goods_skus.base_unit
          this.editRurchasePrice = this.goods_skus.base_purchase_rate
          this.completeStatus = this.msg.complete_status
          this._saleInfo()
        }
        if (this.$route.query.copy) {
          this.msg = storage.get('msg')
          this.goods_skus = storage.get('goods_skus')
          this.saleMsg = storage.get('saleMsg')
          this.sale_skus = storage.get('sale_skus')
          this.editSkus = _.cloneDeep(this.goods_skus)
          this.saleSelect.content = this.goods_skus.sale_unit
          this.supplierSelect.content = this.goods_skus.supplier_name
          this.purchaseSelect.content = this.goods_skus.purchase_unit
          this.editRurchaseUnit = this.goods_skus.purchase_unit
          this.dispatchSelect.content = this.goods_skus.base_unit
          this.editRurchasePrice = this.goods_skus.base_purchase_rate
          this.msg.goods_main_images.forEach((item) => {
            item.id = 0
          })
          this.saleMsg.goods_banner_images.forEach((item) => {
            item.id = 0
          })
          this.saleMsg.goods_detail_images.forEach((item) => {
            item.id = 0
          })
          this.goods_skus.goods_sku_id = 0
          this.goods_skus.goods_id = 0
          this.msg.goods_id = 0
          this.saleMsg.goods_id = 0
          this.sale_skus.goods_sku_id = 0
          this.sale_skus.goods_id = 0
        }
      },
      getScmCategoriesData() {
        API.Product.getScmCategoryList({parent_id: -1, goods_id: this.isCopy ? storage.get('goods_id') : this.id}, false).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.stairSelect.data = res.data
            res.data.forEach((item) => {
              if (item.is_selected) {
                this.stairSelect.content = item.name
                this.secondSelect.data = item.list
                this.secondSelect.data.forEach((twomitem) => {
                  if (twomitem.is_selected) {
                    this.secondSelect.content = twomitem.name
                    this.thirdlySelect.data = twomitem.list
                    this.thirdlySelect.data.forEach((thritem) => {
                      if(thritem.is_selected) {
                        this.thirdlySelect.content = thritem.name
                      }
                    })
                  }
                })
              }
            })
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      _submitType() {
        if (this.isSubmit) {
          return
        }
        if (this.tabIndex === 0) {
          this._baseSubmit()
          return
        }
        this._saleSubmit()
      },
      // 基础信息提交
      _baseSubmit() {
        this.goods_skus.presale_usable_stock += ''
        if (this.goods_skus.goods_material_name.length === 0 || this.goods_skus.goods_material_name.length >= 30) {
          this.$toast.show('请输入商品名称且小于30字')
          return
        } else if (this.msg.goods_material_category_id <= 0) {
          this.$toast.show('请选择商品类目')
          return
        } else if (this.goods_skus.base_unit === '') {
          this.$toast.show('请选择基本单位')
          return
        } else if (this.goods_skus.base_sale_rate.length === 0) {
          this.$toast.show('请输入销售规格')
          return
        } else if (this.goods_skus.base_sale_rate <= 0) {
          this.$toast.show('请输入销售规格大于零')
          return
        } else if (this.goods_skus.sale_unit === '') {
          this.$toast.show('请选择销售单位')
          return
        } else if (this.goods_skus.goods_sku_encoding.length === 0) {
          this.$toast.show('请输入商品编码')
          return
        } else if (this.goods_skus.presale_usable_stock.length === 0 && this.msg.is_presale * 1 === 1) {
          this.$toast.show('请输入预售库存')
          return
        } else if (this.goods_skus.presale_usable_stock < 0 && this.msg.is_presale * 1 === 1) {
          this.$toast.show('请输入预售库存大于零')
          return
        } else if (this.goods_skus.presale_usable_stock.includes('.') && this.msg.is_presale * 1 === 1) {
          this.$toast.show('请输入正确的预售库存')
          return
        } else if (this.goods_skus.supplier_id <= 0) {
          this.$toast.show('请选择供应商')
          return
        } else if (this.goods_skus.base_purchase_rate.length === 0) {
          this.$toast.show('请输入采购规格')
          return
        } else if (this.goods_skus.base_purchase_rate <= 0) {
          this.$toast.show('请输入采购规格大于零')
          return
        } else if (this.goods_skus.purchase_unit === '') {
          this.$toast.show('请选择采购单位')
          return
        } else if (this.goods_skus.purchase_price.length === 0) {
          this.$toast.show('请输入采购单价')
          return
        } else if (
          +this.goods_skus.damage_rate < 0 ||
          +this.goods_skus.damage_rate > 100 ||
          this.goods_skus.damage_rate.length === 0
        ) {
          this.$toast.show('损耗比区间在0与100之间')
          return
        }
        this.msg.goods_skus[0] = this.goods_skus
        this.msg.save_type = 'base'
        if (this.id) {
          if (this.editRurchasePrice * 1 === this.goods_skus.base_purchase_rate * 1 && this.editRurchaseUnit === this.goods_skus.purchase_unit) {
            this.isSubmit = true
            API.Product.editGoodsDetail(this.id, this.msg).then((res) => {
              this.isSubmit = false
              if (res.error === this.$ERR_OK) {
                this.tabIndex = 1
                this.$toast.show('编辑基础信息成功')
                this.editSkus = _.cloneDeep(this.goods_skus)
              } else {
                this.$toast.show(res.message)
              }
              this.$loading.hide()
            })
          } else {
            API.Product.checkGoodsTask({goods_id: this.id}).then((res) => {
              if (res.error === this.$ERR_OK) {
                if (res.data.has_task === 1) {
                  this.$refs.confirm.show('当前商品存在采购任务，修改采购规格可能会影响实际采购数量，是否确认继续修改？')
                  return
                }
                this.isSubmit = true
                API.Product.editGoodsDetail(this.id, this.msg).then((res) => {
                  this.isSubmit = false
                  if (res.error === this.$ERR_OK) {
                    this.tabIndex = 1
                    this.$toast.show('编辑基础信息成功')
                    this.editSkus = _.cloneDeep(this.goods_skus)
                  } else {
                    this.$toast.show(res.message)
                  }
                  this.$loading.hide()
                })
              } else {
                this.$toast.show(res.message)
              }
              this.$loading.hide()
            })
          }
          return
        }
        API.Product.createGoodsDetail(this.msg).then((res) => {
          this.isSubmit = false
          if (res.error === this.$ERR_OK) {
            this.id = res.data.goods_id
            this.goods_skus.goods_sku_id = res.data.goods_sku_id
            this.sale_skus.goods_sku_id = res.data.goods_sku_id
            this.tabIndex = 1
            this.$toast.show('创建基础信息成功')
            this.editSkus = _.cloneDeep(this.goods_skus)
          } else {
            this.$toast.show(res.message)
          }
          this.$loading.hide()
        })
      },
      // 销售信息提交
      _saleSubmit() {
        if (!this.id) {
          this.$toast.show('请先创建基础信息')
          return
        }
        this.saleMsg.init_sale_count += ''
        if (this.saleMsg.goods_banner_images.length === 0) {
          this.$toast.show('请上传商品封面图')
          return
        } else if (this.saleMsg.goods_detail_images.length === 0) {
          this.$toast.show('请上传商品详情图')
          return
        } else if (this.saleMsg.name.length === 0 || this.saleMsg.name.length >= 30) {
          this.$toast.show('请输入商品名称且小于30字')
          return
        } else if (this.saleMsg.goods_category_id <= 0) {
          this.$toast.show('请选择商品分类')
          return
        } else if (this.sale_skus.original_price.length === 0) {
          this.$toast.show('请输入划线价')
          return
        } else if (this.sale_skus.trade_price.length === 0) {
          this.$toast.show('请输入销售售价')
          return
        } else if (+this.sale_skus.original_price < +this.sale_skus.trade_price) {
          this.$toast.show('请输入划线价大于销售售价')
          return
        } else if (
          this.saleMsg.init_sale_count === '' ||
          this.saleMsg.init_sale_count.includes('.') ||
          +this.saleMsg.init_sale_count < 0
        ) {
          this.$toast.show('请输入正确初始销量')
          return
        }
        this.saleMsg.save_type = 'sale'
        this.saleMsg.goods_skus[0] = this.sale_skus
        this.isSubmit = true
        if (this.id) {
          API.Product.editGoodsDetail(this.id, this.saleMsg).then((res) => {
            this.isSubmit = false
            if (res.error === this.$ERR_OK) {
              this.$toast.show('编辑销售信息成功')
              setTimeout(() => {
                this.$router.push('/home/product-list')
              }, 1000)
            } else {
              this.$toast.show(res.message)
            }
            this.$loading.hide()
          })
          return
        }
        this.$toast.show('请先保存基础信息')
      },
      // 返回上一页
      _back() {
        this.$router.back()
      },
      // 编辑销售信息
      _saleInfo() {
        API.Product.getGoodsDetail(this.id, {show_type: 'sale'}).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.saleMsg = res.data
            this.sale_skus = this.saleMsg.goods_skus[0]
          } else {
            this.$toast.show(res.message)
          }
          this.$loading.hide()
        })
      },
      // 切换销售类型
      selectStock(index) {
        if (!this.id) {
          this.msg.is_presale = index
        } else {
          API.Product.checkStockType(this.id, false).then((res) => {
            if (res.error === this.$ERR_OK) {
              if (res.data.is_allow_change * 1 === 1) {
                this.msg.is_presale = index
              } else {
                this.$toast.show(res.data.msg)
              }
            } else {
              this.$toast.show(res.message)
            }
          })
        }
      },
      // 获取计量单位
      getSelectData() {
        API.Product.getUnitsList({}, false).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.dispatchSelect.data = res.data
            this.saleSelect.data = res.data
            this.purchaseSelect.data = res.data
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      // 筛选供应商
      changeText(text) {
        if (text.length === 0) {
          this.supplierSelect.data = this.searchList
          return
        }
        let arr = []
        this.searchList.forEach((item) =>{
          if (item.supplier_name.includes(text)) {
            arr.push(item)
          }
        })
        this.supplierSelect.data = arr
      },
      // 获取供应商列表
      getSupplierData() {
        API.Product.getSupplier({page: 1, limit: 10}, false).then((res) => {
          if (res.error === this.$ERR_OK) {
            res.data.forEach((item) => {
              item.name = item.supplier_name
            })
            this.supplierSelect.data = res.data
            this.searchList = res.data
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      // 获取类目
      getCategoriesData() {
        API.Product.getCategoryList({parent_id: -1, goods_id: this.isCopy ? storage.get('goods_id') : this.id}, false).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.categoriesSelect.data = res.data
            res.data.forEach((item) => {
              if (item.is_selected) {
                this.categoriesSelect.content = item.name
                this.categoriesSecondSelect.data = item.list
                this.categoriesSecondSelect.data.forEach((twomitem) => {
                  if (twomitem.is_selected) {
                    this.categoriesSecondSelect.content = twomitem.name
                  }
                })
              }
            })
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      // 选择一级类目
      setStairValue(data) {
        this.secondSelect.content = '二级类目'
        this.secondSelect.data = data.list
        this.thirdlySelect.content = '三级类目'
        this.thirdlySelect.data = ''
        this.msg.goods_material_category_id = data.id
      },
      // 选择二级类目
      setSecondValue(data) {
        this.thirdlySelect.content = '三级类目'
        this.thirdlySelect.data = data.list
        this.msg.goods_material_category_id = data.id
      },
      // 选择三级类目
      setThirdlyValue(data) {
        this.msg.goods_material_category_id = data.id
      },
      // 选择基本单位
      setBaseValue(data) {
        this.goods_skus.base_unit = data.name
      },
      // 选择销售单位
      saleSelectValue(data) {
        this.goods_skus.sale_unit = data.name
      },
      // 选择采购单位
      purchaseSelectValue(data) {
        this.goods_skus.purchase_unit = data.name
      },
      // 选择供应商
      supplierSelectValue(data) {
        this.goods_skus.supplier_id = data.supplier_id
      },
      // 切换称重
      switchBtn() {
        this.goods_skus.is_weight = !this.goods_skus.is_weight ? 1 : 0
      },
      // 选择一级分类
      setStairCategoriesValue(data) {
        this.categoriesSecondSelect.content = '二级分类'
        this.categoriesSecondSelect.data = data.list
        this.saleMsg.goods_category_id = data.id
      },
      // 选择二级分类
      setSecondCategoriesValue(data) {
        this.saleMsg.goods_category_id = data.id
      },
      // 修改采购规格编辑
      changeEdit() {
        this.isSubmit = true
        API.Product.editGoodsDetail(this.id, this.msg).then((res) => {
          this.isSubmit = false
          if (res.error === this.$ERR_OK) {
            this.tabIndex = 1
            this.$toast.show('编辑基础信息成功')
            this.editSkus = _.cloneDeep(this.goods_skus)
          } else {
            this.$toast.show(res.message)
          }
          this.$loading.hide()
        })
      },
      _setSort() {},
      // 添加基本信息图片
      _addPic(type, length, e) {
        this.uploadImg = type
        let arr = Array.from(e.target.files)
        e.target.value = ''
        if (arr.length < 1) return
        if (this.msg[type].length) {
          arr = arr.slice(0, length - this.msg[type].length)
        } else {
          arr = arr.slice(0, length)
        }
        this.showLoading = true
        this.$cos.uploadFiles(this.$cosFileType.IMAGE_TYPE, arr).then((resArr) => {
          this.showLoading = false
          let imagesArr = []
          resArr.forEach((item) => {
            if (item.error !== this.$ERR_OK) {
              return this.$toast.show(item.message)
            }
            let obj = {
              id: 0,
              image_id: item.data.id,
              image_url: item.data.url
            }
            imagesArr.push(obj)
          })
          this.$set(this.msg, type, this.msg[type].concat(imagesArr))
        })
      },
      // 添加销售信息图片
      _addSalePic(type, length, e) {
        this.uploadImg = type
        let arr = Array.from(e.target.files)
        e.target.value = ''
        if (arr.length < 1) return
        if (this.saleMsg[type].length) {
          arr = arr.slice(0, length - this.saleMsg[type].length)
        } else {
          arr = arr.slice(0, length)
        }
        this.showLoading = true
        this.$cos.uploadFiles(this.$cosFileType.IMAGE_TYPE, arr).then((resArr) => {
          this.showLoading = false
          let imagesArr = []
          resArr.forEach((item) => {
            if (item.error !== this.$ERR_OK) {
              return this.$toast.show(item.message)
            }
            let obj = {
              id: 0,
              image_id: item.data.id,
              image_url: item.data.url
            }
            imagesArr.push(obj)
          })
          this.$set(this.saleMsg, type, this.saleMsg[type].concat(imagesArr))
        })
      },
      // 删除商品信息图片
      delMainPic(index) {
        this.msg.goods_main_images.splice(index, 1)
        this.imgInput = ''
      },
      // 删除封面图片
      delPic(index) {
        this.saleMsg.goods_banner_images.splice(index, 1)
      },
      // 删除详情图片
      delPic2(index) {
        this.saleMsg.goods_detail_images.splice(index, 1)
      },
      failFile(msg) {
        this.$emit('showToast', msg)
      },
      // async _addPic(type, e) {
      //   this.uploadImg = type
      //   this.showLoading = true
      //   let param = this._infoImage(e.target.files[0])
      //   e.target.value = ''
      //   await this._upImage(param)
      // },
      // 格式化图片流
      getPic2(image) {
        let item = {id: 0, image_id: image.id, image_url: image.url}
        this.saleMsg.goods_detail_images.push(item)
      },
      getPic(image) {
        let item = {id: 0, image_id: image.id, image_url: image.url}
        this.saleMsg.goods_banner_images.push(item)
      },
      _infoImage(file) {
        let param = new FormData() // 创建form对象
        param.append('file', file, file.name) // 通过append向form对象添加数据
        return param
      },
      async _upImage(param) {
        let res = await API.Upload.UploadImg(param)
        this.showLoading = false
        if (res.error !== this.$ERR_OK) {
          this.failFile(res.message)
          return
        }
        if (this.uploadImg === 'pic1') {
          this.getPic(res.data)
        } else {
          this.getPic2(res.data)
        }
      },
      // 一键复制
      _jumpCopyPage() {
        let pathname = window.location.href
        let url = pathname.split('?')
        let jumpUrl = url[0] + '?copy=true'
        storage.set('msg', this.msg)
        storage.set('goods_skus', this.goods_skus)
        storage.set('saleMsg', this.saleMsg)
        storage.set('sale_skus', this.sale_skus)
        storage.set('goods_id', this.id)
        window.open(jumpUrl, '_blank')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/detail"

  .content-padding-top
    padding-top: 32px
  .img
    width :100%
    height :@width
    display :block
    object-fit :cover

  .edit-leader
    position: relative
    flex: 1
    background: $color-white
    padding: 0 20px 80px
    box-sizing: border-box

  .select-box-input
    position: relative
    .edit-input
      line-height: 40px
      layout(row)
      align-items: center
      justify-content: space-between
      .select-text
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-text-main
      .select-text-assist
        color: $color-text-assist
      .select-icon
        width: 18px
        height: 18px
        background-size: 18px
        bg-image(icon-drop_down)
        transition: all 0.5s
      .select-icon-active
        transform: rotate(180deg)
    .select-main-box
      position: absolute
      min-width: 220px
      height: 180px
      z-index: 111
      display: block
      top: 45px
      left: 0
      background-color: #fff
      box-sizing: border-box
      border-radius: 2px
      box-shadow: 0 2px 6px 0 #f2f0fa
      transition: all .3s
      opacity: 1
      overflow: hidden
      layout(row)
      .fater-list
        height: 180px
        overflow: auto
        padding: 5px 0 !important
        list-style: none
        .item
          min-width: 100px
          height: 30px
          layout(row)
          align-items: center
          justify-content: space-between
          padding: 0 5px
          box-sizing: border-box
          &:hover
            background: #eaeaea
          .text
            font-size: $font-size-14
            font-family: $font-family-regular
            color: $color-text-main
          .icon
            width: 10px
            height: 15px
            background-size: 10px 15px
            bg-image(icon-right)
        .item-active
          background: #eaeaea
          .text
            color: $color-main
      .child-list
        min-width: 110px
        height: 180px
        overflow: auto
        padding: 5px 0 !important
        list-style: none
        .item
          min-width: 100px
          height: 30px
          layout(row)
          align-items: center
          justify-content: space-between
          padding: 0 5px
          box-sizing: border-box
          &:hover
            background: #eaeaea
          .text
            font-size: $font-size-14
            font-family: $font-family-regular
            color: $color-text-main
          .icon
            width: 10px
            height: 15px
            background-size: 10px 15px
            bg-image(icon-right)
        .item-active
          background: #eaeaea
          .text
            color: $color-main
    .menu-leave-to
      height: 0

  ::-webkit-scrollbar {
    width: 10px
    height: 10px
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px
    -webkit-box-shadow: inset 0 0 5px rgba(93, 93, 93, .2)
    background: #c3c3c3
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(78, 78, 78, .2)
    border-radius: 10px
    background: #e3e3e3
  }

  .leader-box
    padding: 0 20px
    box-sizing: border-box
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
        width: 64px
      .start
        display: inline-block
        margin-right: -2px
        color: #F52424
      .edit-input-box
        margin-left: 40.9px
        position: relative
      .edit-input
        font-size: $font-size-14
        padding: 0 14px
        border-radius: 2px
        width: 400px
        height: 40px
        border: 0.5px solid $color-line
        transition: all 0.3s
        &:disabled
          color: $color-text-assist
          background: $color-white
        &::-webkit-inner-spin-button
          appearance: none
        &:hover
          border: 1px solid #ACACAC
        &::placeholder
          font-family: $font-family-regular
          color: $color-text-assist
        &:focus
          border-color: $color-main !important
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
      .mini-edit-input
        width: 133px
        border-radius: 0
        border-top-left-radius: 2px
        border-bottom-left-radius: 2px
        border-right: none
        &:hover
          border-color: $color-line
      .edit-input-unit
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-text-main
        width: 134px
        height: 40px
        line-height: 40px
        text-align: center
        background: #F9F9F9
        border: 1px solid $color-line
        border-right: none
        margin-right: -1px
  .mini-edit-input-box
    layout(row)
    .mini-mr20
      margin-right: 20px
  .edit-pla
    font-size: $font-size-14
    color: $color-text-assist
    font-family: $font-family-regular
    display: flex
    align-items: center
    margin-left: 10px

  .image-box
    margin-left: 40.9px
  .goods-select-box
    layout(row)
    align-items: center
    height: 44px
    .goods-select-left
      height: 44px
      layout(row)
      align-items: center
      cursor: pointer
      .goods-select-icon
        width: 18px
        height: @width
        border: 1px solid #E1E1E1
        background: #F9F9F9
        border-radius: 50%
        margin-right: 10px
      .goods-select-icon-active
        border: 0 solid transparent
        background-size: @width
        icon-image(icon-single_election)
      .goods-select-text
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-text-main
        margin-right: 10px
    .edit-input-select
      width: 148px !important
    .stock-box-text
      width: 74px
      height: 44px
      line-height: 44px
      font-family: $font-family-regular
      color: $color-text-main
      font-size: $font-size-14
      padding-left: 14px
    .current-stock
      width: auto
      padding-left: 0
      .stock-color
        color: $color-negative
  .edit-image
    flex-wrap: wrap
    display: flex
    .draggable
      flex-wrap: wrap
      display: flex
    .add-image
      margin-bottom: 20px
      icon-image('pic-picture1')
      height: 90px
      width: @height
      position: relative
      border-radius: 2px
      overflow: hidden
      .sendImage
        height: 100%
        width: 100%
        top: 0
        left: 0
        opacity: 0
        z-index: 1
        position: absolute
    .show-image
      margin-bottom: 20px
      background-repeat: no-repeat
      background-size: cover
      background-position: center
      height: 90px
      margin-right: 20px
      width: @height
      border-radius: 2px
      position: relative
      overflow: hidden
    .close
      icon-image('pic-delete')
      width: 15px
      height: 15px
      position: absolute
      top: 0
      right: 0
      z-index: 100

    .loading-mask
      width: 100%
      height: 100%
      position: absolute
      top: 0
      left: 0
      background: rgba(0, 0, 0, .6)
      .loading
        all-center()
        width: 25px
        height: 25px
  .add-image
    margin-bottom: 20px
    icon-image('pic-picture1')
    height: 90px
    width: @height
    position: relative
    border-radius: 2px
    overflow: hidden
    .sendImage
      height: 100%
      width: 100%
      top: 0
      left: 0
      opacity: 0
      z-index: 1

  .edit-image-box
    align-items: flex-start
    min-height: 116px
    margin-bottom: 30px
    .edit-title
      margin-top: 15px
    .tip
      text-align: left
      margin-top: -6px
      font-size: $font-size-14
      color: $color-text-assist
      font-family: $font-family-regular
  .procurement-top
    margin-top: 24px
  .edit-msg
    font-size: $font-size-medium14
    color: #acacac
    margin-left: 10px
  .sale-size
    font-size: $font-size-14
    line-height: 40px
    color: #343434
    font-family: $font-family-regular
</style>
