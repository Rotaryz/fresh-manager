<template>
  <div class="table">
    <div class="edit-panel">
      <section class="process-wrapper">
        <p class="title active">
          <span class="icon">1</span>
          <span class="text">基础信息</span>
        </p>
        <div class="line" :class="{active: stepIndex}"></div>
        <p class="title" :class="{active: stepIndex}">
          <span class="icon">2</span>
          <span class="text">采购/销售信息</span>
        </p>
      </section>
      <template v-if="stepIndex === 0">
        <edit-header title="基础信息"
                     btnText="导入商品图文"
        ></edit-header>
        <edit-options title="商品名称">
          <input slot="middle"
                 type="text"
                 class="edit-input-box edit-input"
                 maxlength="10"
                 v-model="goodsName"
          >
          <p slot="right" class="edit-pla">展示在商城的名称，供消费者浏览</p>
        </edit-options>
        <edit-options title="推荐语"
                      :importance="false"
        >
          <textarea slot="middle"
                    type="text"
                    class="edit-input-box edit-textarea edit-input"
                    maxlength="50"
                    v-model="describe"
          ></textarea>
        </edit-options>
        <edit-options title="商品类目">
          <div slot="middle" class="edit-input-box mini-edit-input-box">
            <div class="mini-mr20">
              <base-drop-down :height="inputHeight"
                              :width="190"
                              :select="firstTypeSelect"
                              @setValue="setGoodsTypeValue($event, 'secondTypeSelect')"
              ></base-drop-down>
            </div>
            <div class="mini-mr20">
              <base-drop-down :height="inputHeight"
                              :width="190"
                              :select="secondTypeSelect"
                              @setValue="setGoodsTypeValue"
              ></base-drop-down>
            </div>
          </div>
        </edit-options>
        <edit-options title="基本单位">
          <base-drop-down slot="middle"
                          class="edit-input-box"
                          :height="inputHeight"
                          :width="400"
                          :select="baseUnitSelect"
                          :isUse="!id"
                          @setValue="setCommonValue($event.name, 'basicUnit')"
          ></base-drop-down>
          <p slot="right" class="edit-pla">商品在仓库存放时的最小单位<span class="edit-pla-children hand">查看示例</span></p>
        </edit-options>
        <edit-options title="封面图">
          <edit-media
            slot="middle"
            explain="建议图片的尺寸：750*750，支持png，jpeg，jpg格式，最多可上传5张，首张为封面。"
            mediaKey="coverImageList"
            :dataArray="coverImageList"
            :maxFiles="5"
            @drag="dragMediaHandle"
            @gain="addMediaHandle"
            @del="deleteMediaHandle"
          ></edit-media>
        </edit-options>
        <edit-options title="主图视频" :importance="false">
          <edit-media
            slot="middle"
            explain="建议上传50M以内的清晰视频，内容突出商品1-2个核心卖点。"
            fileType="video"
            imgUrlKey="full_url"
            mediaKey="videoList"
            :dataArray="videoList"
            :maxFiles="1"
            @drag="dragMediaHandle"
            @gain="addMediaHandle"
            @del="deleteMediaHandle"
          ></edit-media>
        </edit-options>
        <edit-options title="详情图">
          <edit-media
            slot="middle"
            explain="建议图片的尺寸：750*750，支持png，jpeg，jpg格式，最多可上传15张。"
            mediaKey="detailImageList"
            :dataArray="detailImageList"
            :maxFiles="15"
            @drag="dragMediaHandle"
            @gain="addMediaHandle"
            @del="deleteMediaHandle"
          ></edit-media>
        </edit-options>
      </template>
      <template v-if="stepIndex === 1">
        <edit-header title="采购信息"
        ></edit-header>
        <edit-options title="商品别名" :importance="false">
          <input slot="middle"
                 v-model="aliasName"
                 type="number"
                 class="edit-input-box edit-input"
                 maxlength="10">
          <p slot="right" class="edit-pla">展示在供应链的商品名称，供本部采购或仓管人员浏览</p>
        </edit-options>
        <edit-options title="供应商">
          <base-drop-down slot="middle"
                          class="edit-input-box"
                          :height="inputHeight"
                          :width="400"
                          :isInput="true"
                          :select="supplierSelect"
                          isInputPla="请选择供应商"
                          @setValue="setCommonValue($event.supplier_id, 'supply')"
                          @changeText="changeText"
          ></base-drop-down>
          <p slot="right" class="edit-pla hand"><span style="text-decoration :underline;color: #3E77C3">新增</span><span class="edit-pla-children" @click="_getSupplierData">刷新</span></p>
        </edit-options>
        <edit-options title="采购规格">
          <div class="edit-input-box mini-edit-input-box"
               slot="middle"
          >
            <p class="size-left">1</p>
            <base-drop-down :height="inputHeight"
                            :width="131"
                            :select="purchaseSelect"
                            @setValue="setCommonValue($event.name, 'purchaseUnit')"
            ></base-drop-down>
            <div class="size-equal">
              <p class="line"></p>
              <p class="line m-5"></p>
            </div>
            <input class="edit-input mini-edit-input"
                   type="number"
                   style="width: 127px"
                   v-model="purchaseSize"
            >
          </div>
          <p slot="right" class="edit-pla c-333">盒<span class="edit-pla-children hand">查看示例</span></p>
        </edit-options>
        <edit-options title="采购单价">
          <input slot="middle"
                 type="number"
                 class="edit-input-box edit-input"
                 v-model="purchasePrice"
          >
          <p slot="right" class="edit-pla c-333">元/箱</p>
        </edit-options>
        <edit-options title="采购周期">
          <input slot="middle"
                 type="number"
                 class="edit-input-box edit-input"
                 v-model="purchaseCycle"
          >
          <p slot="right" class="edit-pla c-333">天内可采购入库<span class="edit-pla-children-default">采购周期1天的商品，当日或次日可送达社区，2天的商品，次日或隔日可送达社区，以此类推</span></p>
        </edit-options>
        <edit-options title="是否集采" :importance="false">
          <div slot="middle" class="edit-input-box goods-select-box">
            <section class="goods-select-left" @click="toggleRadios('purchaseCollective')">
              <div class="goods-select-icon" :class=" !purchaseCollective ? 'goods-select-icon-active' : ''"></div>
              <div class="goods-select-text">不需要</div>
            </section>
            <section class="goods-select-left" style="margin-left: 50px" @click="toggleRadios('purchaseCollective')">
              <div class="goods-select-icon" :class=" purchaseCollective ? 'goods-select-icon-active' : ''"></div>
              <div class="goods-select-text">需要</div>
            </section>
          </div>
          <p slot="right" class="edit-pla hand" style="text-decoration :underline;color: #3E77C3">什么是集采？</p>
        </edit-options>
        <edit-header title="销售信息"
                     style="margin-top: 25px"
        ></edit-header>
        <edit-options title="销售类型" :importance="false">
          <div slot="middle" class="edit-input-box goods-select-box">
            <section class="goods-select-left" @click="toggleRadios('preSell')">
              <div class="goods-select-icon" :class=" !preSell ? 'goods-select-icon-active' : ''"></div>
              <div class="goods-select-text">非预售</div>
            </section>
            <section class="goods-select-left" style="margin-left: 50px" @click="toggleRadios('preSell')">
              <div class="goods-select-icon" :class=" preSell ? 'goods-select-icon-active' : ''"></div>
              <div class="goods-select-text">预售</div>
            </section>
          </div>
          <p slot="right" class="edit-pla hand">仓库中有存货，不可售卖的商品为非预售商品</p>
        </edit-options>
        <edit-options title="商品分类">
          <base-drop-down slot="middle"
                          class="edit-input-box"
                          :height="inputHeight"
                          :width="400"
                          :isInput="true"
                          :select="categoriesSelect"
                          isInputPla="请选择商品分类"
                          @setValue="setCommonValue($event.id, 'goodsCategory')"
                          @changeText="changeCategoryText"
          ></base-drop-down>
          <p slot="right" class="edit-pla hand"><span style="text-decoration :underline;color: #3E77C3">新增</span><span class="edit-pla-children" @click="_getGoodsCategory">刷新</span></p>
        </edit-options>
        <edit-options title="商品编码">
          <input slot="middle"
                 type="text"
                 class="edit-input-box edit-input"
                 maxlength="50"
                 v-model="goodsCode"
          >
          <p slot="right" class="edit-pla">用于仓库扫码枪快速定位商品，标品时建议修改为图示中的编码<span class="edit-pla-children hand">查看图示</span></p>
        </edit-options>
        <edit-options title="销售规格">
          <div class="edit-input-box mini-edit-input-box"
               slot="middle"
          >
            <p class="size-left">1</p>
            <base-drop-down :height="inputHeight"
                            :width="131"
                            :select="saleSelect"
                            @setValue="setCommonValue($event.name, 'sellUnit')"
            ></base-drop-down>
            <div class="size-equal">
              <p class="line"></p>
              <p class="line m-5"></p>
            </div>
            <input class="edit-input mini-edit-input"
                   type="number"
                   style="width: 127px"
                   v-model="sellSize"
            >
          </div>
          <p slot="right" class="edit-pla c-333">盒<span class="edit-pla-children hand">查看示例</span></p>
        </edit-options>
        <edit-options title="销售单价">
          <input slot="middle"
                 type="number"
                 class="edit-input-box edit-input"
                 v-model="sellPrice"
          >
          <p slot="right" class="edit-pla c-333">元/盒<span style="padding-left: 20px">采购成本价：23元/盒</span></p>
        </edit-options>
        <edit-options title="划线价" :importance="false">
          <input slot="middle"
                 type="number"
                 class="edit-input-box edit-input"
                 maxlength="10"
                 v-model="underlinePrice"
          >
          <p slot="right" class="edit-pla">默认比销售单价高30%</p>
        </edit-options>
        <edit-options title="库存数量">
          <input slot="middle"
                 type="number"
                 class="edit-input-box edit-input"
                 maxlength="10"
                 v-model="stock"
          >
        </edit-options>
        <edit-options title="初始销量" :importance="false">
          <input slot="middle"
                 type="number"
                 class="edit-input-box edit-input"
                 v-model="originSales"
          >
          <p slot="right" class="edit-pla">消费者看到的销量=初始销量+实际下单量</p>
        </edit-options>
        <edit-options title="团长佣金" :importance="false">
          <div slot="middle" class="edit-input-box goods-select-box">
            <section class="goods-select-left" @click="toggleRadios('commissionType')">
              <div class="goods-select-icon" :class=" !commissionType ? 'goods-select-icon-active' : ''"></div>
              <div class="goods-select-text">团长设置</div>
            </section>
            <section class="goods-select-left" style="margin-left: 50px" @click="toggleRadios('commissionType')">
              <div class="goods-select-icon" :class=" commissionType ? 'goods-select-icon-active' : ''"></div>
              <div class="goods-select-text">统一设置</div>
            </section>
          </div>
          <p slot="right" class="edit-pla">商品售卖后，按创建团长时所设置的佣金比率分别计算佣金</p>
        </edit-options>
        <edit-options v-if="commissionType" title="" :importance="false">
          <input slot="middle"
                 type="number"
                 class="edit-input-box edit-input"
                 v-model="commission"
          >
          <p slot="right" class="edit-pla c-333">%</p>
        </edit-options>
      </template>
    </div>
    <div class="back">
      <div class="back-cancel back-btn hand" @click="_back">返回</div>
      <div class="btn-main step-button" @click="toggleStepHandle">{{stepIndex? '上一步': '下一步'}}</div>
      <div v-if="stepIndex" class="back-btn back-submit hand" @click="_submitType">保存</div>
    </div>
<!--    <default-confirm ref="confirm" @confirm="changeEdit"></default-confirm>-->
  </div>
</template>

<script type="text/ecmascript-6">
  import EditOptions from '@components/edit-options/edit-options'
  import EditHeader from '@components/edit-header/edit-header'
  import EditMedia from '@components/edit-media/edit-media'
  // import DefaultConfirm from '@components/default-confirm/default-confirm'
  import API from '@api'
  import storage from 'storage-controller'
  import _ from 'lodash'
  // import {uploadFiles} from '../../utils/vod/vod'

  const PAGE_NAME = 'EDIT_GOODS'
  const TITLE = '新建商品'
  // const ORDERSTATUS = [{text: '基础信息', status: 0}, {text: '销售信息', status: 1}]

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      // DefaultConfirm,
      EditOptions,
      EditHeader,
      EditMedia
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
        inputHeight: 44, // 控件高度
        stepIndex: 1, // 步骤Index
        goodsName: '', // 商品名称
        describe: '', // 商品描述
        goodsTypeId: '', // 商品类目
        basicUnit: '', // 基础单位
        coverImageList: [], // 封面图
        videoList: [], // 视频
        detailImageList: [], // 详情图片
        aliasName: '', // 商品别名
        supply: '', // 供应商
        purchaseUnit: '', // 采购单位
        purchaseSize: '', // 采购规格
        purchasePrice: '', // 采购单价
        purchaseCycle: '', // 采购周期
        purchaseCollective: false, // 集中采购
        preSell: false, // 销售类型
        goodsCategory: '', // 商品分类
        goodsCode: '', // 商品编码
        sellUnit: '', // 销售单位
        sellSize: '', // 销售规格
        sellPrice: '', // 销售单价
        underlinePrice: '', // 划线价
        stock: '', // 库存
        originSales: '', // 初始销量
        commissionType: false, // 团长佣金类型
        commission: '', // 佣金
        id: this.$route.query.id || null,
        // msg: {
        //   name: '',
        //   goods_material_category_id: 0,
        //   goods_main_images: [],
        //   goods_skus: [],
        //   is_presale: 1,
        //   save_type: 'base'
        // },
        // goods_skus: {
        //   goods_material_name: '',
        //   base_unit: '',
        //   base_sale_rate: '',
        //   sale_unit: '',
        //   goods_sku_encoding: '',
        //   presale_usable_stock: '',
        //   warehouse_usable_stock: '',
        //   supplier_id: 0,
        //   base_purchase_rate: '',
        //   purchase_unit: '',
        //   purchase_price: '',
        //   damage_rate: '',
        //   is_weight: 1
        // },
        firstTypeSelect: {check: false, show: false, content: '一级类目', type: 'default', data: []},
        secondTypeSelect: {check: false, show: false, content: '二级类目', type: 'default', data: []},
        baseUnitSelect: {check: false, show: false, content: '基本单位', type: 'default', data: []},
        saleSelect: {check: false, show: false, content: '销售单位', type: 'default', data: []},
        purchaseSelect: {check: false, show: false, content: '采购单位', type: 'default', data: []},
        supplierSelect: {check: false, show: false, content: '选择供应商', type: 'default', data: []},
        categoriesSelect: {check: false, show: false, content: '选择分类', type: 'default', data: []},
        searchList: [],
        // saleMsg: {
        //   goods_banner_images: [],
        //   goods_detail_images: [],
        //   goods_skus: [],
        //   goods_category_id: 0,
        //   name: '',
        //   describe: '',
        //   init_sale_count: '',
        //   goods_videos: []
        // },
        // sale_skus: {
        //   trade_price: '',
        //   original_price: ''
        // },
        // categoriesSelect: {check: false, show: false, content: '一级分类', type: 'default', data: []},
        // categoriesSecondSelect: {check: false, show: false, content: '二级分类', type: 'default', data: []},
        // preChildIndex: null,
        // showLoading: false,
        // picNum: 5,
        // uploadImg: '',
        // isSelectStock: true,
        // tabStatus: ORDERSTATUS,
        // tabIndex: 0,
        // isSubmit: false,
        // editRurchasePrice: 0,
        // editRurchaseUnit: '',
        // isCopy: this.$route.query.copy || null,
        // isShow: this.$route.query.isShow || null,
        // searchList: [],
        // imgInput: '',
        // completeStatus: 0,
        // editSkus: {
        //   base_unit: '',
        //   base_sale_rate: '',
        //   sale_unit: ''
        // },
        // videoUrl: ''
      }
    },
    beforeRouteEnter(to, from, next) {
      console.log(to, from, '========')
      next()
    },
    created() {
      // this._setData()
      // this.getSelectData()
      this._getSupplierData()
      // this.getCategoriesData()
      // this.getScmCategoriesData()
      this._getGoodsTypeList()
      this._getBasicUnitList()
      this._getGoodsCategory()
    },
    destroyed() {
      clearInterval(this.timerVod)
      if (this.isCopy) {
        storage.remove('msg')
        storage.remove('goods_skus')
        storage.remove('saleMsg')
        storage.remove('sale_skus')
        storage.remove('videoUrl')
      }
    },
    methods: {
      // 单选切换
      toggleRadios(key) {
        this[key] = !this[key]
      },
      // 切换步骤
      toggleStepHandle() {
        const maxStep = 1
        const minStep = 0
        this.stepIndex++
        if (this.stepIndex > maxStep) {
          this.stepIndex = minStep
        }
      },
      // 生成商品编码
      _createGoodsCode() {

      },
      // // 顶部 切换
      // _changeStatusTab(item, index) {
      //   this.tabIndex = index
      // },
      // /**
      //  * 设置默认数据 -> 编辑状态
      //  * @private
      //  */
      // _setData() {
      //   if (!_.isEmpty(this.detail)) {
      //     this.msg = _.cloneDeep(this.detail)
      //     this.goods_skus = this.msg.goods_skus[0]
      //     this.editSkus = _.cloneDeep(this.goods_skus)
      //     this.saleSelect.content = this.goods_skus.sale_unit
      //     this.supplierSelect.content = this.goods_skus.supplier_name
      //     this.purchaseSelect.content = this.goods_skus.purchase_unit
      //     this.editRurchaseUnit = this.goods_skus.purchase_unit
      //     this.dispatchSelect.content = this.goods_skus.base_unit
      //     this.editRurchasePrice = this.goods_skus.base_purchase_rate
      //     this.completeStatus = this.msg.complete_status
      //     this._saleInfo()
      //   }
      //   if (this.$route.query.copy) {
      //     this.msg = storage.get('msg')
      //     this.goods_skus = storage.get('goods_skus')
      //     this.saleMsg = storage.get('saleMsg')
      //     this.sale_skus = storage.get('sale_skus')
      //     this.videoUrl = storage.get('videoUrl')
      //     this.editSkus = _.cloneDeep(this.goods_skus)
      //     this.saleSelect.content = this.goods_skus.sale_unit
      //     this.supplierSelect.content = this.goods_skus.supplier_name
      //     this.purchaseSelect.content = this.goods_skus.purchase_unit
      //     this.editRurchaseUnit = this.goods_skus.purchase_unit
      //     this.dispatchSelect.content = this.goods_skus.base_unit
      //     this.editRurchasePrice = this.goods_skus.base_purchase_rate
      //     this.msg.goods_main_images.forEach((item) => {
      //       item.id = 0
      //     })
      //     this.saleMsg.goods_banner_images.forEach((item) => {
      //       item.id = 0
      //     })
      //     this.saleMsg.goods_detail_images.forEach((item) => {
      //       item.id = 0
      //     })
      //     this.goods_skus.goods_sku_id = 0
      //     this.goods_skus.goods_id = 0
      //     this.msg.goods_id = 0
      //     this.saleMsg.goods_id = 0
      //     this.sale_skus.goods_sku_id = 0
      //     this.sale_skus.goods_id = 0
      //   }
      // },
      // 获取商品类目列表
      _getGoodsTypeList() {
        API.Product.getScmCategoryList({parent_id: -1, goods_id: this.id}, false)
          .then((res) => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            this.firstTypeSelect.data = res.data
            this.firstTypeSelect.data.forEach((child) => {
              if (child.is_selected) {
                this.firstTypeSelect.content = child.name
                this.secondTypeSelect.data = child.list
              }
            })
          })
      },
      // getScmCategoriesData() {
      //   API.Product.getScmCategoryList(
      //     {parent_id: -1, goods_id: this.isCopy ? storage.get('goods_id') : this.id},
      //     false
      //   ).then((res) => {
      //     if (res.error === this.$ERR_OK) {
      //       this.stairSelect.data = res.data
      //       res.data.forEach((item) => {
      //         if (item.is_selected) {
      //           this.stairSelect.content = item.name
      //           this.secondSelect.data = item.list
      //           this.secondSelect.data.forEach((twomitem) => {
      //             if (twomitem.is_selected) {
      //               this.secondSelect.content = twomitem.name
      //               this.thirdlySelect.data = twomitem.list
      //               this.thirdlySelect.data.forEach((thritem) => {
      //                 if (thritem.is_selected) {
      //                   this.thirdlySelect.content = thritem.name
      //                 }
      //               })
      //             }
      //           })
      //         }
      //       })
      //     } else {
      //       this.$toast.show(res.message)
      //     }
      //   })
      // },
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
          if (
            this.editRurchasePrice * 1 === this.goods_skus.base_purchase_rate * 1 &&
            this.editRurchaseUnit === this.goods_skus.purchase_unit
          ) {
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
      // _saleInfo() {
      //   API.Product.getGoodsDetail(this.id, {show_type: 'sale'}).then((res) => {
      //     if (res.error === this.$ERR_OK) {
      //       this.saleMsg = res.data
      //       this.sale_skus = this.saleMsg.goods_skus[0]
      //       if(res.data.goods_videos && res.data.goods_videos.length && res.data.goods_videos[0]) {
      //         this.videoUrl = res.data.goods_videos[0].full_url||''
      //         this.saleMsg.goods_videos = [{file_id: res.data.goods_videos[0].id}]
      //       }
      //     } else {
      //       this.$toast.show(res.message)
      //     }
      //     this.$loading.hide()
      //   })
      // },
      // 切换销售类型
      // selectStock(index) {
      //   if (!this.id) {
      //     this.msg.is_presale = index
      //   } else {
      //     API.Product.checkStockType(this.id, false).then((res) => {
      //       if (res.error === this.$ERR_OK) {
      //         if (res.data.is_allow_change * 1 === 1) {
      //           this.msg.is_presale = index
      //         } else {
      //           this.$toast.show(res.data.msg)
      //         }
      //       } else {
      //         this.$toast.show(res.message)
      //       }
      //     })
      //   }
      // },
      // 获取计量单位
      _getBasicUnitList() {
        API.Product.getUnitsList({}, false).then((res) => {
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return
          }
          this.baseUnitSelect.data = res.data
          this.saleSelect.data = res.data
          this.purchaseSelect.data = res.data
        })
      },
      // // 获取计量单位
      // getSelectData() {
      //   API.Product.getUnitsList({}, false).then((res) => {
      //     if (res.error === this.$ERR_OK) {
      //       this.dispatchSelect.data = res.data
      //       this.saleSelect.data = res.data
      //       this.purchaseSelect.data = res.data
      //     } else {
      //       this.$toast.show(res.message)
      //     }
      //   })
      // },
      // 筛选供应商
      changeText(text) {
        if (text.length === 0) {
          this.supplierSelect.data = this.searchList
          return
        }
        let arr = []
        this.searchList.forEach((item) => {
          if (item.supplier_name.includes(text)) {
            arr.push(item)
          }
        })
        this.supplierSelect.data = arr
      },
      // 获取供应商列表
      _getSupplierData() {
        API.Product.getSupplier({page: 1}, false).then((res) => {
          if (res.error === this.$ERR_OK) {
            res.data.forEach((item) => {
              item.name = item.supplier_name
            })
            this.supplierSelect.data = res.data
            this.searchList = res.data
            // console.log(this.supplierSelect)
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      // 获取类目
      // getCategoriesData() {
      //   API.Product.getCategoryList(
      //     {parent_id: -1, goods_id: this.isCopy ? storage.get('goods_id') : this.id},
      //     false
      //   ).then((res) => {
      //     if (res.error === this.$ERR_OK) {
      //       this.categoriesSelect.data = res.data
      //       res.data.forEach((item) => {
      //         if (item.is_selected) {
      //           this.categoriesSelect.content = item.name
      //           this.categoriesSecondSelect.data = item.list
      //           this.categoriesSecondSelect.data.forEach((twomitem) => {
      //             if (twomitem.is_selected) {
      //               this.categoriesSecondSelect.content = twomitem.name
      //             }
      //           })
      //         }
      //       })
      //     } else {
      //       this.$toast.show(res.message)
      //     }
      //   })
      // },
      // 选择商品类目
      setGoodsTypeValue(data, type) {
        if (type) {
          this[type].content = '二级类目'
          this[type].data = data.list
        }
        this.goodsTypeId = data.id
      },
      // 获取商品分类
      _getGoodsCategory() {
        API.Product.getCategoryList({parent_id: -1, goods_id: this.id}, false)
          .then((res) => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            this.categoriesSelect.data = res.data
            this.searchCategoryList = res.data
            this.categoriesSelect.data.forEach((item) => {
              if (item.is_selected) {
                this.categoriesSelect.content = item.name
              }
            })
          })
      },
      // 筛选供应商
      changeCategoryText(text) {
        if (text.length === 0) {
          this.categoriesSelect.data = this.searchCategoryList
          return
        }
        let arr = []
        this.searchCategoryList.forEach((item) => {
          if (item.name.includes(text)) {
            arr.push(item)
          }
        })
        this.categoriesSelect.data = arr
      },
      // 选择二级类目
      // setSecondTypeValue(data) {
      //   // todo
      //   // this.thirdlySelect.content = '三级类目'
      //   // this.thirdlySelect.data = data.list
      //   this.msg.goods_material_category_id = data.id
      //   this.goodsTypeId = data.id
      // },
      // // 选择三级类目
      // setThirdlyValue(data) {
      //   this.msg.goods_material_category_id = data.id
      // },
      // 设置选项
      setCommonValue(data, key) {
        this[key] = data
        console.log(this[key], '-----')
      },
      // 选择基本单位
      // setBaseValue(data) {
      //   // this.goods_skus.base_unit = data.name
      //   this.basicUnit = data.name
      // },
      // 选择销售单位
      // saleSelectValue(data) {
      //   this.goods_skus.sale_unit = data.name
      // },
      // 选择采购单位
      // purchaseSelectValue(data) {
      //   this.purchaseUnit = data.name
      // },
      // 选择供应商
      // supplierSelectValue(data) {
      //   this.goods_skus.supplier_id = data.supplier_id
      // },
      // 切换称重
      // switchBtn() {
      //   this.goods_skus.is_weight = !this.goods_skus.is_weight ? 1 : 0
      // },
      // 选择一级分类
      // setStairCategoriesValue(data) {
      //   this.categoriesSecondSelect.content = '二级分类'
      //   this.categoriesSecondSelect.data = data.list
      //   this.saleMsg.goods_category_id = data.id
      // },
      // 选择二级分类
      // setSecondCategoriesValue(data) {
      //   this.saleMsg.goods_category_id = data.id
      // },
      // 修改采购规格编辑
      // changeEdit() {
      //   this.isSubmit = true
      //   API.Product.editGoodsDetail(this.id, this.msg).then((res) => {
      //     this.isSubmit = false
      //     if (res.error === this.$ERR_OK) {
      //       this.tabIndex = 1
      //       this.$toast.show('编辑基础信息成功')
      //       this.editSkus = _.cloneDeep(this.goods_skus)
      //     } else {
      //       this.$toast.show(res.message)
      //     }
      //     this.$loading.hide()
      //   })
      // },
      // _setSort() {},
      // // 添加基本信息图片
      // _addPic(type, length, e) {
      //   this.uploadImg = type
      //   let arr = Array.from(e.target.files)
      //   e.target.value = ''
      //   if (arr.length < 1) return
      //   if (this.msg[type].length) {
      //     arr = arr.slice(0, length - this.msg[type].length)
      //   } else {
      //     arr = arr.slice(0, length)
      //   }
      //   this.showLoading = true
      //   this.$cos.uploadFiles(this.$cosFileType.IMAGE_TYPE, arr).then((resArr) => {
      //     this.showLoading = false
      //     let imagesArr = []
      //     resArr.forEach((item) => {
      //       if (item.error !== this.$ERR_OK) {
      //         return this.$toast.show(item.message)
      //       }
      //       let obj = {
      //         id: 0,
      //         image_id: item.data.id,
      //         image_url: item.data.url
      //       }
      //       imagesArr.push(obj)
      //     })
      //     this.$set(this.msg, type, this.msg[type].concat(imagesArr))
      //   })
      // },
      // 删除媒体文件
      deleteMediaHandle(key, index) {
        this[key].splice(index, 1)
      },
      // 添加媒体文件
      addMediaHandle(key, data, fileType) {
        const arr = data.map(item => {
          let obj = {}
          if (fileType === 'image') {
            obj = {
              id: 0,
              image_id: item.data.id,
              image_url: item.data.url
            }
          }
          if (fileType === 'video') {
            obj = {
              id: 0,
              file_id: item.data.id,
              full_url: item.data.full_url
            }
          }
          return obj
        })
        this[key] = this[key].concat(arr)
      },
      // 拖拽媒体文件
      dragMediaHandle(key, data) {
        this[key] = data
      },
      // 添加销售信息图片
      // _addSalePic(type, length, e) {
      //   this.uploadImg = type
      //   let arr = Array.from(e.target.files)
      //   e.target.value = ''
      //   if (arr.length < 1) return
      //   if (this.saleMsg[type].length) {
      //     arr = arr.slice(0, length - this.saleMsg[type].length)
      //   } else {
      //     arr = arr.slice(0, length)
      //   }
      //   this.showLoading = true
      //   this.$cos.uploadFiles(this.$cosFileType.IMAGE_TYPE, arr).then((resArr) => {
      //     this.showLoading = false
      //     let imagesArr = []
      //     resArr.forEach((item) => {
      //       if (item.error !== this.$ERR_OK) {
      //         return this.$toast.show(item.message)
      //       }
      //       let obj = {
      //         id: 0,
      //         image_id: item.data.id,
      //         image_url: item.data.url
      //       }
      //       imagesArr.push(obj)
      //     })
      //     this.$set(this.saleMsg, type, this.saleMsg[type].concat(imagesArr))
      //   })
      // },
      // // 删除商品信息图片
      // delMainPic(index) {
      //   this.msg.goods_main_images.splice(index, 1)
      //   this.imgInput = ''
      // },
      // // 删除封面图片
      // delPic(index) {
      //   this.saleMsg.goods_banner_images.splice(index, 1)
      // },
      // // 删除详情图片
      // delPic2(index) {
      //   this.saleMsg.goods_detail_images.splice(index, 1)
      // },
      // // 删除视频
      // delVideo() {
      //   this.videoUrl = ''
      //   this.saleMsg.goods_videos = [{file_id: 0}]// 删除视频
      // },
      // failFile(msg) {
      //   this.$emit('showToast', msg)
      // },
      // async _addPic(type, e) {
      //   this.uploadImg = type
      //   this.showLoading = true
      //   let param = this._infoImage(e.target.files[0])
      //   e.target.value = ''
      //   await this._upImage(param)
      // },
      // 格式化图片流
      // getPic2(image) {
      //   let item = {id: 0, image_id: image.id, image_url: image.url}
      //   this.saleMsg.goods_detail_images.push(item)
      // },
      // getPic(image) {
      //   let item = {id: 0, image_id: image.id, image_url: image.url}
      //   this.saleMsg.goods_banner_images.push(item)
      // },
      // _infoImage(file) {
      //   let param = new FormData() // 创建form对象
      //   param.append('file', file, file.name) // 通过append向form对象添加数据
      //   return param
      // },
      // async _upImage(param) {
      //   let res = await API.Upload.UploadImg(param)
      //   this.showLoading = false
      //   if (res.error !== this.$ERR_OK) {
      //     this.failFile(res.message)
      //     return
      //   }
      //   if (this.uploadImg === 'pic1') {
      //     this.getPic(res.data)
      //   } else {
      //     this.getPic2(res.data)
      //   }
      // },
      // // 一键复制
      // _jumpCopyPage() {
      //   let pathname = window.location.href
      //   let url = pathname.split('?')
      //   let jumpUrl = url[0] + '?copy=true'
      //   storage.set('msg', this.msg)
      //   storage.set('goods_skus', this.goods_skus)
      //   storage.set('saleMsg', this.saleMsg)
      //   storage.set('sale_skus', this.sale_skus)
      //   storage.set('goods_id', this.id)
      //   storage.set('videoUrl', this.videoUrl)
      //   window.open(jumpUrl, '_blank')
      // },
      // loading(curr = 0, result) {
      //   this.timerVod = setInterval(() => {
      //     this.$loading.show('视频上传中' + curr + '%')
      //     curr += 10
      //     if (curr > 100) {
      //       clearInterval(this.timerVod)
      //       this.$loading.hide()
      //     }
      //   }, 500)
      // },
      // handleChange(e) {
      //   const file = e.target.files[0]
      //   if (!/^video/.test(file.type )) {
      //     this.$toast.show('请选择视频文件')
      //     return
      //   }
      //   this.$loading.show('视频上传中...')
      //   uploadFiles(e.target.files[0], (curr, result) => {
      //     this.$loading.showCurr(curr)
      //   }).then(res => {
      //     this.$loading.hide()
      //     if (res.error === this.$ERR_OK) {
      //       this.videoUrl = res.data.path
      //       this.saleMsg.goods_videos = [{file_id: res.data.id}]
      //     }
      //   })
      // }
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

  .edit-panel
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
      &.add-video
        icon-image('pic-video_upload')
      &.add-img-video
        icon-image('pic-videopic_upload')
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
      .icon-video
        width: 26px
        height: @width
        all-center()
      .video
        height: 90px
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

  // 编辑面板
  .edit-panel
    position: relative
    flex: 1
    background: $color-white
    padding: 0 20px 80px
    box-sizing: border-box

  // 进度条
  .process-wrapper
    padding 54px 0 62px
    display :flex
    align-items :center
    justify-content center
    .line
      margin : 0 10px
      width :282px
      height: 1px
      background  #DFDEDE
      &.active
        background : #4DBD65
    .title
      font-family: $font-family-regular
      font-size: 16px;
      color: #ACACAC;
      line-height: 1
      &.active
        color: #4DBD65
        & > .icon
          border: 1px solid  #4DBD65
          background : #4DBD65
          color: #ffffff
      .icon
        display :inline-block
        width: 24px
        height: @width
        border-radius :50%
        line-height :@width
        border: 1px solid #ACACAC;
        text-align :center
        margin-right :6px


  // input表单
  .edit-input-box
    margin-left: 40.9px
    position: relative
  .edit-input
    font-size: $font-size-14
    padding: 0 14px
    border-radius: 2px
    width: 400px
    height: 44px
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
  .edit-pla
    font-size: $font-size-14
    color: $color-text-assist
    font-family: $font-family-regular
    display: flex
    align-items: center
    margin-left: 10px

  .edit-pla-children
    color: #3E77C3
    text-decoration :underline
    padding-left :20px

  .edit-pla-children-default
    color: $color-text-assist
    padding-left :20px

  // 文本域
  .edit-textarea
    padding: 5px 14px
    height: 94px
    resize: none

  .c-#3E7
    color: #3E77C3

  .c-333
    color: #333333

  .c-text-assist
    color: $color-text-assist

  // 类目选择器
  .mini-edit-input-box
    layout(row)
    .mini-mr20
      margin-right: 20px

  // 采购规格
  .size-left
    width: 107px
    height: 44px
    background: #F9F9F9;
    border: 1px solid $color-line
    border-right :none
    box-sizing :border-box
    border-radius: 2px 0 0 2px;
    color: #333333;
    font-family: $font-family-regular
    line-height :@height
    padding-left :10px
  .size-equal
    width: 35px
    position :relative
    layout(column)
    justify-content :center
    align-items :center
    .line
      height 2px
      width: 15px
      background :#D3D8DC
      &.m-5
        margin-top:5px

  // 单选
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

  // step-button
  .step-button
    width :96px
    height: 38px
    box-sizing :border-box
    margin-right :20px
    font-size :16px
</style>
