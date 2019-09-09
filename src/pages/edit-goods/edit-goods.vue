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
        <edit-header title="基础信息" btnText="导入商品图文" @button="showMaterial"></edit-header>
        <edit-options title="商品名称">
          <input slot="middle" v-model="goodsName" type="text" class="edit-input-box edit-input" maxlength="10">
          <p slot="right" class="edit-pla">展示在商城的名称，供消费者浏览</p>
        </edit-options>
        <edit-options title="推荐语" :importance="false">
          <textarea slot="middle" v-model="describe" type="text" class="edit-input-box edit-textarea edit-input" maxlength="50"></textarea>
        </edit-options>
        <edit-options title="商品类目">
          <div slot="middle" class="edit-input-box mini-edit-input-box">
            <div class="mini-mr20">
              <base-drop-down :height="inputHeight" :width="190" :select="firstTypeSelect" @setValue="setGoodsTypeValue($event, 'secondTypeSelect')"></base-drop-down>
            </div>
            <div class="mini-mr20">
              <base-drop-down :height="inputHeight" :width="190" :select="secondTypeSelect" @setValue="setGoodsTypeValue"></base-drop-down>
            </div>
          </div>
        </edit-options>
        <edit-options title="基本单位">
          <base-drop-down slot="middle" class="edit-input-box" :height="inputHeight" :width="400" :select="baseUnitSelect"
                          :isUse="!isFinish" @setValue="setCommonValue($event.name, 'basicUnit')"
          ></base-drop-down>
          <p slot="right" class="edit-pla">商品在仓库存放时的最小单位<span class="edit-pla-children hand" @click="openTipsHandle('unit')">查看示例</span></p>
        </edit-options>
        <edit-options title="封面图">
          <edit-media slot="middle" explain="建议图片的尺寸：750*750，支持png，jpeg，jpg格式，最多可上传5张，首张为封面。" mediaKey="coverImageList" :dataArray="coverImageList" :maxFiles="5"
                      @drag="dragMediaHandle" @gain="addMediaHandle" @del="deleteMediaHandle"
          ></edit-media>
        </edit-options>
        <edit-options title="主图视频" :importance="false">
          <edit-media slot="middle" explain="建议上传50M以内的清晰视频，内容突出商品1-2个核心卖点。" fileType="video" imgUrlKey="full_url" mediaKey="videoList"
                      :dataArray="videoList" :maxFiles="1" @drag="dragMediaHandle" @gain="addMediaHandle" @del="deleteMediaHandle"
          ></edit-media>
        </edit-options>
        <edit-options title="详情图">
          <edit-media slot="middle" explain="建议图片的尺寸：750*750，支持png，jpeg，jpg格式，最多可上传15张。" mediaKey="detailImageList" :dataArray="detailImageList" :maxFiles="15"
                      @drag="dragMediaHandle" @gain="addMediaHandle" @del="deleteMediaHandle"
          ></edit-media>
        </edit-options>
      </template>
      <template v-if="stepIndex === 1">
        <edit-header title="采购信息"></edit-header>
        <edit-options title="商品别名" :importance="false">
          <input slot="middle" v-model="aliasName" type="text" class="edit-input-box edit-input" maxlength="10">
          <p slot="right" class="edit-pla">展示在供应链的商品名称，供本部采购或仓管人员浏览</p>
        </edit-options>
        <edit-options title="供应商">
          <base-drop-down slot="middle" class="edit-input-box" :height="inputHeight" :width="400" :isInput="true"
                          :select="supplierSelect" isInputPla="请选择供应商" @setValue="setCommonValue($event.supplier_id, 'supply')" @changeText="changeText"
          ></base-drop-down>
          <p slot="right" class="edit-pla hand"><span
            style="text-decoration :underline;color: #3E77C3"
            @click="handleOpenNewWindow('edit-supplier')"
          >新增</span><span class="edit-pla-children" @click="_getSupplierData">刷新</span></p>
        </edit-options>
        <edit-options title="采购规格">
          <div slot="middle"
               class="edit-input-box mini-edit-input-box"
          >
            <p class="size-left">1</p>
            <base-drop-down :height="inputHeight" :width="131" :select="purchaseSelect" @setValue="setCommonValue($event.name, 'purchaseUnit')"></base-drop-down>
            <div class="size-equal">
              <p class="line"></p>
              <p class="line m-5"></p>
            </div>
            <input v-model="purchaseSize" class="edit-input mini-edit-input" type="number" style="width: 127px">
          </div>
          <p slot="right" class="edit-pla c-333">{{basicUnit || ''}}<span class="edit-pla-children hand" @click="openTipsHandle('unit', 'purchaseUnit')">查看示例</span></p>
        </edit-options>
        <edit-options title="采购单价">
          <input slot="middle" v-model="purchasePrice" type="number" class="edit-input-box edit-input">
          <p slot="right" class="edit-pla c-333">元/{{purchaseUnit || ''}}</p>
        </edit-options>
        <edit-options title="采购周期">
          <input slot="middle" v-model="purchaseCycle" type="number" class="edit-input-box edit-input">
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
          <p v-if="purchaseCollective" slot="right" class="edit-pla">集采类商品只可添加到集中采购活动中进行售卖，无法单独售卖，请谨慎选择<span class="edit-pla-children hand" @click="openTipsHandle('purchase')">什么是集采？</span></p>
          <p v-else slot="right" class="edit-pla hand" style="text-decoration :underline;color: #3E77C3" @click="openTipsHandle('purchase')">什么是集采？</p>
        </edit-options>
        <edit-header title="销售信息" style="margin-top: 25px"></edit-header>
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
          <p slot="right" class="edit-pla hand">{{preSell?'仓库中没有存货，待消费者下单，再进行采购的商品为预售商品' : '仓库中有存货，才可售卖的商品为非预售商品'}}</p>
        </edit-options>
        <edit-options title="商品分类">
          <base-drop-down slot="middle" class="edit-input-box" :height="inputHeight" :width="400" :isInput="true"
                          :select="categoriesSelect" isInputPla="请选择商品分类" @setValue="setCommonValue($event.id, 'goodsCategory')" @changeText="changeCategoryText"
          ></base-drop-down>
          <p slot="right" class="edit-pla hand"><span style="text-decoration :underline;color: #3E77C3" @click="handleOpenNewWindow('product-categories')">新增</span><span class="edit-pla-children" @click="_getGoodsCategory">刷新</span></p>
        </edit-options>
        <edit-options title="商品编码">
          <input slot="middle" v-model="goodsCode" type="text" class="edit-input-box edit-input" maxlength="50">
          <p slot="right" class="edit-pla">用于仓库扫码枪快速定位商品，标品时建议修改为图示中的编码<span class="edit-pla-children hand" @click="_createGoodsCode(true)">刷新</span><span class="edit-pla-children hand" @click="openTipsHandle('code')">查看图示</span></p>
        </edit-options>
        <edit-options title="销售规格">
          <div slot="middle"
               class="edit-input-box mini-edit-input-box"
          >
            <p class="size-left">1</p>
            <base-drop-down :height="inputHeight" :width="131" :select="saleSelect" @setValue="setCommonValue($event.name, 'sellUnit')"></base-drop-down>
            <div class="size-equal">
              <p class="line"></p>
              <p class="line m-5"></p>
            </div>
            <input v-model="sellSize" class="edit-input mini-edit-input" type="number" style="width: 127px">
          </div>
          <p slot="right" class="edit-pla c-333">{{basicUnit|| ''}}<span class="edit-pla-children hand" @click="openTipsHandle('unit', 'sellUnit')">查看示例</span></p>
        </edit-options>
        <edit-options title="销售单价">
          <input slot="middle" v-model="sellPriceShow" type="number" class="edit-input-box edit-input">
          <p slot="right" class="edit-pla c-333">元/{{sellUnit || ''}}<span style="padding-left: 20px">采购成本价：{{purchaseCost}}元/{{sellUnit || ''}}</span></p>
        </edit-options>
        <edit-options title="划线价">
          <input slot="middle" v-model="underlinePrice" type="number" class="edit-input-box edit-input" maxlength="10">
          <p slot="right" class="edit-pla">默认比销售单价高30%</p>
        </edit-options>
        <edit-options title="库存数量">
          <div slot="middle" class="edit-input-box" style="position: relative">
            <input v-model="stock" type="number" class="edit-input" maxlength="10">
            <div v-if="!preSell" class="edit-input-box edit-input disable-input">{{stock}}</div>
          </div>
        </edit-options>
        <edit-options title="初始销量" :importance="false">
          <input slot="middle" v-model="originSales" type="number" class="edit-input-box edit-input">
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
          <p slot="right" class="edit-pla">{{commissionType? '商品售卖后，按统一比率为团长计算佣金' :  '商品售卖后，按创建团长时所设置的佣金比率分别计算佣金'}}</p>
        </edit-options>
        <edit-options v-if="commissionType" title="" :importance="false">
          <input slot="middle" v-model="commission" type="number" class="edit-input-box edit-input">
          <p slot="right" class="edit-pla c-333">%</p>
        </edit-options>
      </template>
    </div>
    <div class="back">
      <div class="back-cancel back-btn hand" @click="backHandle">返回</div>
      <div class="btn-main step-button" @click="toggleStepHandle">{{stepIndex? '上一步': '下一步'}}</div>
      <div v-if="stepIndex" class="back-btn back-submit hand" @click="saveHandle">保存</div>
    </div>
    <goods-material ref="goodsMaterial" @selectMaterial="selectMaterial"></goods-material>
    <default-confirm ref="confirm" @confirm="changeEdit"></default-confirm>
    <default-confirm ref="confirmSubmit" @confirm="confirmSubmitHandle"></default-confirm>
    <describe-pop ref="describe" typeList="{unit: '基本单位示例', purchase: '什么是集采', code: '条形码'}"></describe-pop>
  </div>
</template>

<script type="text/ecmascript-6">
  import EditOptions from '@components/edit-options/edit-options'
  import EditHeader from '@components/edit-header/edit-header'
  import EditMedia from '@components/edit-media/edit-media'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import GoodsMaterial from '@components/goods-material/goods-material'
  import DescribePop from './describe-pop/describe-pop'
  import * as GoodsHandle from './goods-handle'
  import API from '@api'
  import storage from 'storage-controller'

  const PAGE_NAME = 'EDIT_GOODS'
  const TITLE = '新建商品'

  const STEP_INFO = {
    0: {
      show_type: 'base',
      resolveData: GoodsHandle.RBaseData,
      formatData: GoodsHandle.FBaseData,
      checkData: GoodsHandle.BASE_FORM_REG
    },
    1: {
      show_type: 'sale',
      resolveData: GoodsHandle.RSellData,
      formatData: GoodsHandle.FSellData,
      checkData: GoodsHandle.SALE_FORM_REG
    }
  }

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultConfirm,
      EditOptions,
      EditHeader,
      EditMedia,
      GoodsMaterial,
      DescribePop
    },
    data() {
      this._isAgain2StepTwo = false
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
        id: this.$route.query.id || storage.get('$editGoodsId', null),
        isFinish: false,
        firstTypeSelect: {check: false, show: false, content: '一级类目', type: 'default', data: []},
        secondTypeSelect: {check: false, show: false, content: '二级类目', type: 'default', data: []},
        baseUnitSelect: {check: false, show: false, content: '基本单位', type: 'default', data: []},
        saleSelect: {check: false, show: false, content: '销售单位', type: 'default', data: []},
        purchaseSelect: {check: false, show: false, content: '采购单位', type: 'default', data: []},
        supplierSelect: {check: false, show: false, content: '选择供应商', type: 'default', data: []},
        categoriesSelect: {check: false, show: false, content: '选择分类', type: 'default', data: []},
        searchCategoryList: [], // 商品分类筛选临时数组
        searchList: [], // 供应商筛选临时数组
        goods_sku_id: '', // sku_id
        supplier_name: '' // 供应商名称
      }
    },
    computed: {
      stepInfo() {
        return STEP_INFO[this.stepIndex]
      },
      // 采购成本\
      /**
       *  采购成本价=基本价*销售规格
          基本价=采购价/采购规格
          合并公式：采购成本价=（采购价*销售规格）/采购规格
       * @returns {number}
       */
      purchaseCost() {
        let number = (this.purchasePrice * this.sellSize) / this.purchaseSize
        return isNaN(number) ? '' : number.toFixed(2)
      },
      sellPriceShow: {
        get() {
          return this.sellPrice
        },
        set(price) {
          this.sellPrice = price
          if (price > 0) {
            price = (+price * 1.3).toFixed(2)
            this.underlinePrice = price
          }
        }
      }
    },
    watch: {
      preSell(val) {
        this.stock = 0
      }
    },
    beforeRouteEnter(to, from, next) {
      const id = to.query.id || storage.get('$editGoodsId', null)
      if (!id) {
        next((vm) => {
          vm._getSupplierData()
          vm._getGoodsTypeList()
          vm._getBasicUnitList()
          vm._getGoodsCategory()
        })
        return
      }
      API.Product.getDetail({id}, true)
        .then((res) => {
          next((vm) => {
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
        })
        .catch((e) => {
          console.error(e)
          next()
        })
    },
    beforeRouteLeave(to, from, next) {
      storage.remove('$editGoodsId')
      next()
    },
    methods: {
      // 表单验证模块 true 验证不同过， false 为验证通过
      checkModule() {
        const checkObj = this.stepInfo.checkData
        for (let key in checkObj) {
          let flag = ''
          if (key === 'commission') {
            flag = this.commissionType
          }
          const msg = checkObj[key](this[key], flag)
          if (msg) {
            this.$toast.show(msg)
            return true
          }
        }
        return false
      },
      // 弹窗提示
      openTipsHandle(type, textType) {
        this.$refs.describe && this.$refs.describe.show(type, textType)
      },
      // 新增供应商
      handleOpenNewWindow(type) {
        let flag = /#/.test(window.location.href) ? '#' : ''
        let url = {
          'edit-supplier': '/home/basics-set/supplier/edit-supplier',
          'product-categories': '/home/product-categories'
        }
        window.open(flag + url[type])
      },
      // 覆盖基础信息start
      changeEdit() {
        this.copyToast()
        const data = GoodsHandle.RCopyBaseData(this.copyItem)
        Object.assign(this, data)
        this.findGoodsTypeList()
        this.findBasicUnit()
      },
      // 检查原基本信息是否存在 // true 有 false 没有
      checkOriginBaseIsNotEmpty() {
        return this.goodsName || this.describe || this.goodsTypeId || this.basicUnit || this.coverImageList.length || this.videoList.length || this.detailImageList.length
      },
      copyToast() {
        if (!this.checkOriginBaseIsNotEmpty()) return
        this.$toast.show('信息覆盖成功！')
      },
      findBasicUnit() {
        const unit = this.baseUnitSelect.data.find((val) => val.name === this.basicUnit)
        if (!unit) {
          this.baseUnitSelect.data.unshift({id: 0, name: this.basicUnit})
          this.saleSelect.data = this.baseUnitSelect.data
          this.purchaseSelect.data = this.baseUnitSelect.data
        }
        this.initSelectName('baseUnitSelect', 'basicUnit')
      },
      findGoodsTypeList() {
        let obj = this.firstTypeSelect.data.find((val) => val.id === this.goodsTypeId)
        if (obj) {
          this.firstTypeSelect.content = obj.name
          this.secondTypeSelect.content = '二级类目'
          this.secondTypeSelect.data = obj.list
        } else {
          this.firstTypeSelect.data.forEach((item) => {
            let second = item.list.find((val) => val.id === this.goodsTypeId)
            if (second) {
              this.secondTypeSelect.content = second.name
              this.firstTypeSelect.content = item.name
              this.secondTypeSelect.data = item.list
            }
          })
        }
      },
      showMaterial(item) {
        this.$refs.goodsMaterial && this.$refs.goodsMaterial.show()
      },
      selectMaterial(item) {
        this.copyItem = item
        if (!this.checkOriginBaseIsNotEmpty()) {
          this.changeEdit()
          return
        }
        setTimeout(() => {
          this.$refs.confirm && this.$refs.confirm.show('商品标题和图片将覆盖原基础信息，确定吗？')
        }, 500)
      },
      // 覆盖基础信息end
      // 单选切换
      toggleRadios(key) {
        this[key] = !this[key]
      },
      // 切换步骤
      toggleStepHandle() {
        // 复制模式
        if (this.$route.query.isCopy) {
          this.copyToggle()
          return
        }
        /**
         * 正常上一步下一步
         */
        // 返回第一步
        if (this.stepIndex === 1) {
          this.actionStep()
          this._getDetail(() => {
            this.setAliasName()
            window.scrollTo(0, 0)
          })
          return
        }
        // 去第二步
        // 表单验证
        if (this.checkModule()) {
          return
        }
        window.scrollTo(0, 0)
        this._updateGoodsInfo(() => {
          this.actionStep()
          this._getDetail(false, () => {
            this.setAliasName()
            this._createGoodsCode()
            this.resetSelectName('supplierSelect', '选择供应商')
            this.resetSelectName('purchaseSelect', '采购单位')
            this.resetSelectName('categoriesSelect', '分类选择')
            this.resetSelectName('saleSelect', '销售单位')
            this.initSelectName('supplierSelect', 'supplier_name')
            this.initSelectName('saleSelect', 'sellUnit')
            this.initSelectName('purchaseSelect', 'purchaseUnit')
          })
        })
      },
      // 还原筛选器的
      resetSelectName(select, content) {
        this[select].content = content
      },
      // 设置商品别名
      setAliasName() {
        let name = this.aliasName
        if (!name.trim()) {
          name = this.goodsName
        }
        this.aliasName = name
      },
      // 复制模式切换
      copyToggle() {
        if (this.stepIndex === 0 && this.checkModule()) {
          return
        }
        this.actionStep()
        window.scrollTo(0, 0)
        if (this._isAgain2StepTwo) {
          return
        }
        this._isAgain2StepTwo = true
        this._getDetail(false, () => {
          this.setAliasName()
          this._createGoodsCode(true)
          this.initSelectName('supplierSelect', 'supplier_name')
          this.initSelectName('saleSelect', 'sellUnit')
          this.initSelectName('purchaseSelect', 'purchaseUnit')
        })
      },
      // 保存按钮
      saveHandle() {
        if (this.checkModule()) {
          return
        }
        if (this.sellPrice < this.purchaseCost) {
          this.$refs.confirmSubmit && this.$refs.confirmSubmit.show('销售单价小于采购成本价会亏损的，确定这样吗？')
          return
        }
        this._updateGoodsInfo(() => {
          this.backHandle()
        })
      },
      confirmSubmitHandle() {
        this._updateGoodsInfo(() => {
          this.backHandle()
        })
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
      _createGoodsCode(force) {
        const flag = force ? false : this.goodsCode
        if (flag) {
          return
        }
        API.Product.createCode().then((res) => {
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return
          }
          this.goodsCode = res.data.code
        })
      },
      // 提交数据
      _updateGoodsInfo(cb) {
        // 复制模板
        if (this.$route.query.isCopy) {
          this._updateGoodsInfoCopy(cb)
          return
        }
        const data = this.stepInfo.formatData(this)
        data.id = this.id
        API.Product.updateGoods(data, true)
          .then((res) => {
            this.$loading.hide()
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            if (res.data && res.data.goods_id) {
              this.goods_sku_id = res.data.goods_sku_id
              this.id = res.data.goods_id
              storage.set('$editGoodsId', this.id)
            }
            cb && cb()
          })
          .catch((e) => {
            this.$loading.hide()
          })
      },
      // 提交数据复制商品
      async _updateGoodsInfoCopy(cb) {
        const data = STEP_INFO[0].formatData(this, this.$route.query.isCopy)
        data.id = this.id
        data.isCopy = this.$route.query.isCopy
        try {
          let res = await API.Product.updateGoods(data, true)
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return
          }
          if (res.data && res.data.goods_id) {
            this.goods_sku_id = res.data.goods_sku_id
            this.id = res.data.goods_id
            storage.set('$editGoodsId', this.id)
            const data2 = STEP_INFO[1].formatData(this)
            data2.id = this.id
            await API.Product.updateGoods(data2, true)
            this.$loading.hide()
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            cb && cb()
          }
        } catch (e) {
          console.error(e)
          this.$loading.hide()
        }
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
      setData(res, cb) {
        const data = this.stepInfo.resolveData(res.data, this.$route.query.isCopy)
        Object.assign(this, data)
        cb && cb()
      },
      // 获取商品类目列表
      _getGoodsTypeList() {
        API.Product.getScmCategoryList({parent_id: -1, goods_id: this.id}, false).then((res) => {
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return
          }
          this.firstTypeSelect.data = res.data
          this.firstTypeSelect.data.forEach((child) => {
            if (child.is_selected) {
              this.firstTypeSelect.content = child.name
              this.secondTypeSelect.data = child.list
              const obj = child.list.find((val) => val.is_selected)
              obj && (this.secondTypeSelect.content = obj.name)
            }
          })
        })
      },
      // 返回上一页
      backHandle() {
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
      // 初始化选择器的名称
      initSelectName(select, field) {
        const obj = this[select].data.find((val) => val.name === this[field])
        obj && (this[select].content = obj.name)
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
      // 选择商品类目
      setGoodsTypeValue(data, type) {
        if (type) {
          this[type].content = '二级类目'
          this[type].data = data.list
        }
        this.goodsTypeId = data.id
      },
      // 获取商品分类
      _getGoodsCategory(cb) {
        API.Product.getCategoryList({parent_id: -1, goods_id: this.id}, false).then((res) => {
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
          cb && cb()
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
      },
      // 删除媒体文件
      deleteMediaHandle(key, index) {
        this[key].splice(index, 1)
      },
      // 添加媒体文件
      addMediaHandle(key, data, fileType) {
        const arr = data.map((item) => {
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
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/detail"

  .disable-input
    background: #f5f5f5;
    color: #acacac;
    position: absolute !important
    top:0
    left: 0
    margin-left :0 !important
    line-height :44px
    font-size :16px
    cursor : not-allowed

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
