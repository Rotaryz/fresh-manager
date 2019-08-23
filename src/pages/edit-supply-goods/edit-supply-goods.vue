<template>
  <div class="table">
    <base-tab-select :infoTabIndex="tabIndex" :tabStatus="tabStatus" :lineWidth="104"></base-tab-select>
    <template>
      <div class="edit-supply-goods">
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
                    <span class="close" @click="delPic(index)"></span>
                  </div>
                </draggable>
                <div v-if="msg.goods_main_images.length < picNum" class="add-image hand">
                  <input type="file" class="sendImage hand" multiple="multiple" accept="image/*" @change="_addPic('goods_main_images', picNum, $event)">
                  <div v-if="showLoading && uploadImg === 'goods_main_images'" class="loading-mask">
                    <img src="./loading.gif" class="loading">
                  </div>
                </div>
              </div>
              <div class="tip">上传图片的最佳尺寸：1:1，其他尺寸会影响页效果，格式png，jpeg，jpg，最多可上传5张，首张为封面。</div>
            </div>
          </div>
          <div class="edit-item">
            <div class="edit-title">
              <span class="start">*</span>
              商品类型
            </div>
            <div class="edit-input-box goods-select-box">
              <div class="goods-select-left" @click="selectGoodsType(1)">
                <div class="goods-select-icon" :class="msg.goods_type * 1 === 1 ? 'goods-select-icon-active' : ''"></div>
                <div class="goods-select-text">普通商品</div>
              </div>
              <div class="goods-select-left" style="margin-left: 44px" @click="selectGoodsType(2)">
                <div class="goods-select-icon" :class="msg.goods_type * 1 === 1 ? '' : 'goods-select-icon-active'"></div>
                <div class="goods-select-text">集采商品<span class="tip" style="margin-left: 10px">通过【产地集采】活动时间控制商品在小程序的上下架展示</span></div>
              </div>
            </div>
          </div>
        </div>
        <div class="content-header procurement-top">
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
              <base-drop-down :height="40" :width="133" :select="saleSelect" :isUse="completeStatus * 1 === 0" @setValue="saleSelectValue"></base-drop-down>
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
              采购周期
            </div>
            <div class="edit-input-box">
              <input v-model="msg.purchase_cycle" type="number" class="edit-input" :disabled="msg.purchase_cycle_disabled">
            </div>
            <div class="edit-pla">用户下单时间+采购周期=用户提货日期</div>
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
        <div class="back">
          <div class="back-cancel back-btn hand" @click="_back">返回</div>
          <div class="back-btn back-submit hand" @click="_submit">保存</div>
        </div>
      </div>
    </template>
    <default-confirm ref="confirm" @confirm="changeEdit"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import API from '@api'
  import Draggable from 'vuedraggable'
  import _ from 'lodash'
  const PAGE_NAME = 'EDIT_SUPPLY_GOODS'
  const TITLE = '新建商品'
  const ORDERSTATUS = [{text: '基础信息', status: 0}]

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
          goods_type: 1,
          purchase_cycle: '',
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
        showLoading: false,
        uploadImg: '',
        picNum: 5,
        isSubmit: false,
        editRurchasePrice: 0,
        editRurchaseUnit: '',
        tabStatus: ORDERSTATUS,
        complete: this.$route.query.complete || null,
        tabIndex: 0,
        searchList: [],
        completeStatus: 0
      }
    },
    created() {
      this._setData()
      this.getCategoriesData()
      this.getSupplierData()
      this.getSelectData()
    },
    methods: {
      /**
       * 设置默认数据 -> 编辑状态
       * @private
       */
      _setData() {
        if (!_.isEmpty(this.detail)) {
          this.msg = _.cloneDeep(this.detail)
          this.goods_skus = this.msg.goods_skus[0]
          this.dispatchSelect.content = this.goods_skus.base_unit
          this.saleSelect.content = this.goods_skus.sale_unit
          this.purchaseSelect.content = this.goods_skus.purchase_unit
          this.editRurchaseUnit = this.goods_skus.purchase_unit
          this.supplierSelect.content = this.goods_skus.supplier_name
          this.editRurchasePrice = this.goods_skus.base_purchase_rate
          this.completeStatus = this.msg.complete_status
        }
      },
      // 获取类目列表
      getCategoriesData() {
        API.Product.getScmCategoryList({parent_id: -1, goods_id: this.id}, false).then((res) => {
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
                      if (thritem.is_selected) {
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
      getSupplierData() {
        API.Product.getSupplier({page: 1, limit: 100}, false).then((res) => {
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
      // 选择供应商
      supplierSelectValue(data) {
        this.goods_skus.supplier_id = data.supplier_id
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
      // 切换称重
      switchBtn() {
        this.goods_skus.is_weight = !this.goods_skus.is_weight ? 1 : 0
      },
      // 添加图片
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
      // 删除图片
      delPic(index) {
        this.msg.goods_main_images.splice(index, 1)
      },
      // 提交商品信息
      _submit() {
        this.goods_skus.presale_usable_stock += ''
        if (this.isSubmit) {
          return
        }
        if (this.goods_skus.goods_material_name.length === 0 || this.goods_skus.goods_material_name.length >= 30) {
          this.$toast.show('请输入商品名称且小于30字')
          return
        } else if (this.msg.goods_material_category_id <= 0) {
          this.$toast.show('请选择商品类目')
          return
        }  else if (this.goods_skus.base_unit === '') {
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
        } else if (this.msg.purchase_cycle.length === 0) {
          this.$toast.show('请输入采购周期')
          return
        }  else if (this.msg.purchase_cycle < 1) {
          this.$toast.show('请输入采购周期不能小于1天')
          return
        } else if (+this.msg.purchase_cycle > 30) {
          this.$toast.show('请输入采购周期不能大于30天')
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
                this.$toast.show('编辑成功')
                setTimeout(() => {
                  this._back()
                }, 1000)
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
                    this.$toast.show('编辑成功')
                    setTimeout(() => {
                      this._back()
                    }, 1000)
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
          if (res.error === this.$ERR_OK) {
            this.$toast.show('创建成功')
            setTimeout(() => {
              this._back()
            }, 1000)
          } else {
            this.isSubmit = false
            this.$toast.show(res.message)
          }
          this.$loading.hide()
        })
      },
      // 切换商品类型
      selectGoodsType(index) {
        if (!this.id || this.complete * 1 === 1) {
          this.msg.goods_type = index
        }
      },
      // 修改采购规格编辑
      changeEdit() {
        this.isSubmit = true
        API.Product.editGoodsDetail(this.id, this.msg).then((res) => {
          this.isSubmit = false
          if (res.error === this.$ERR_OK) {
            this.$toast.show('编辑成功')
            setTimeout(() => {
              this._back()
            }, 1000)
          } else {
            this.$toast.show(res.message)
          }
          this.$loading.hide()
        })
      },
      _back() {
        this.$router.back()
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

  .edit-supply-goods
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

</style>
