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
                     @button="showMaterial"
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
                          :isUse="!isFinish"
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
                 type="text"
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
      <div v-if="stepIndex" class="back-btn back-submit hand" @click="saveHandle">保存</div>
    </div>
    <goods-material ref="goodsMaterial" @selectMaterial="selectMaterial"></goods-material>
    <!--    <default-confirm ref="confirm" @confirm="changeEdit"></default-confirm>-->
  </div>
</template>

<script type="text/ecmascript-6">
  import EditOptions from '@components/edit-options/edit-options'
  import EditHeader from '@components/edit-header/edit-header'
  import EditMedia from '@components/edit-media/edit-media'
  // import DefaultConfirm from '@components/default-confirm/default-confirm'
  import API from '@api'
  // import storage from 'storage-controller'
  import _ from 'lodash'
  import * as GoodsHandle from './goods-handle'
  // import {uploadFiles} from '../../utils/vod/vod'
  import GoodsMaterial from '@components/goods-material/goods-material'


  const PAGE_NAME = 'EDIT_GOODS'
  const TITLE = '新建商品'
  // const ORDERSTATUS = [{text: '基础信息', status: 0}, {text: '销售信息', status: 1}]

  const STEP_INFO = {
    0: {
      show_type: 'base',
      resolveData: GoodsHandle.RBaseData,
      formatData: GoodsHandle.FBaseData
    },
    1: {
      show_type: 'sale',
      resolveData: GoodsHandle.RSellData,
      formatData: GoodsHandle.FSellData
    }
  }

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      // DefaultConfirm,
      EditOptions,
      EditHeader,
      EditMedia,
      GoodsMaterial
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
        stepIndex: 0, // 步骤Index
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
        isFinish: false,
        firstTypeSelect: {check: false, show: false, content: '一级类目', type: 'default', data: []},
        secondTypeSelect: {check: false, show: false, content: '二级类目', type: 'default', data: []},
        baseUnitSelect: {check: false, show: false, content: '基本单位', type: 'default', data: []},
        saleSelect: {check: false, show: false, content: '销售单位', type: 'default', data: []},
        purchaseSelect: {check: false, show: false, content: '采购单位', type: 'default', data: []},
        supplierSelect: {check: false, show: false, content: '选择供应商', type: 'default', data: []},
        categoriesSelect: {check: false, show: false, content: '选择分类', type: 'default', data: []},
        searchList: [],
        goods_sku_id: '',
        supplier_name: '',
      }
    },
    computed: {
      stepInfo() {
        return STEP_INFO[this.stepIndex]
      }
    },
    beforeRouteEnter(to, from, next) {
      const id = to.query.id
      if (!id) {
        next()
        return
      }
      API.Product.getDetail({id}, true).then((res) => {
        next(vm => {
          vm.$loading.hide()
          if (res && res.error !== vm.$ERR_OK) {
            vm.$toast.show(res.message)
            return
          }
          vm.setData(res)
          vm._getSupplierData()
          vm._getGoodsTypeList()
          vm._getBasicUnitList()
          vm._getGoodsCategory()
        })
      }).catch(e => {
        console.error(e)
        next()
      })
    },
    // mounted() {
    //   this._getSupplierData()
    //   this._getGoodsTypeList()
    //   this._getBasicUnitList()
    //   this._getGoodsCategory()
    //   this._createGoodsCode()
    // },
    destroyed() {
      console.log('destroyed')
      // clearInterval(this.timerVod)
      // if (this.isCopy) {
      //   storage.remove('msg')
      //   storage.remove('goods_skus')
      //   storage.remove('saleMsg')
      //   storage.remove('sale_skus')
      //   storage.remove('videoUrl')
      // }
    },
    methods: {
      showMaterial() {
        this.$refs.goodsMaterial && this.$refs.goodsMaterial.show()
      },
      selectMaterial(item) {
        console.log(item)
      },
      // 单选切换
      toggleRadios(key) {
        this[key] = !this[key]
      },
      // 切换步骤
      toggleStepHandle() {
        if (this.stepIndex === 1) {
          this.actionStep()
          this._getDetail()
          return
        }
        this._updateGoodsInfo(() => {
          this.actionStep()
          this._getDetail(false, () => {
            this._createGoodsCode()
            this.initSelectName('supplierSelect', 'supplier_name')
            this.initSelectName('saleSelect', 'sellUnit')
            this.initSelectName('purchaseSelect', 'purchaseUnit')
          })
        })
      },
      saveHandle() {
        // const data = this.stepInfo.formatData(this)
        // data.id = this.id
        // console.log(data)
        this._updateGoodsInfo()
      },
      // 步骤切换
      actionStep() {
        const maxStep = 1
        const minStep = 0
        this.stepIndex++
        if (this.stepIndex > maxStep) {
          this.stepIndex = minStep
        }
      },
      // 生成商品编码
      _createGoodsCode() {
        if (this.goodsCode) {
          return
        }
        API.Product.createCode().then(res => {
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return
          }
          this.goodsCode = res.data.code
        })
      },
      // 提交数据
      _updateGoodsInfo(cb) {
        const data = this.stepInfo.formatData(this)
        data.id = this.id
        API.Product.updateGoods(data, true).then(res => {
          this.$loading.hide()
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return
          }
          if (res.data && res.data.goods_id) {
            this.goods_sku_id = res.data.goods_sku_id
            this.id = this.goods_id
          }
          cb && cb()
        }).catch(e => {
          this.$loading.hide()
        })
      },
      // 获取详情
      _getDetail(loading = false, cb) {
        const data = {
          id: this.id,
          show_type: this.stepInfo.show_type
        }
        API.Product.getDetail(data, loading).then((res) => {
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return
          }
          this.setData(res, cb)
        })
      },
      // 设置数据
      setData(res,cb) {
        const data = this.stepInfo.resolveData(res.data)
        Object.assign(this, data)
        cb && cb()
      },
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
                const obj = child.list.find(val => val.is_selected)
                obj && (this.secondTypeSelect.content = obj.name)
              }
            })
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
          this.initSelectName('baseUnitSelect', 'basicUnit')
        })
      },
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
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      initSelectName(select, field) {
        const obj = this[select].data.find(val => val.name === this[field])
        obj && (this[select].content = obj.name)
      },
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
      // 设置选项
      setCommonValue(data, key) {
        this[key] = data
        console.log(this[key], '-----')
      },
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
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/detail"

  .edit-panel
    position: relative
    flex: 1
    background: $color-white
    padding: 0 20px 80px
    box-sizing: border-box


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
