<template>
  <div class="dispatching-management table">
    <base-tab-select :infoTabIndex="tabIndex" :tabStatus="tabStatus" @getStatusTab="changeStatus"></base-tab-select>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img :src="tabIndex === 0 ? require('./icon-purchase_list@2x.png') : require('./icon-driver@2x.png')" class="identification-icon">
          <p class="identification-name">{{tabStatus[tabIndex].text}}</p>
        </div>
        <div class="function-btn" @click="handleAdd">
          <div class="btn-main">新建{{tabStatus[tabIndex].text}}</div>
        </div>
      </div>
      <div class="dispatching-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item" :style="{flex: item.flex}">{{item.title}}</div>
        </div>
        <div class="list">
          <div v-if="tabIndex === 0">
            <div v-if="roads.length">
              <div v-for="(road, key) in roads" :key="key" class="list-content list-box">
                <div v-for="(item,index) in commodities" :key="index" class="list-item" :style="{flex: item.flex}">
                  {{item.operation ? '' : road[item.key]}}
                  <div v-if="item.operation === '删除'" class="list-operation" @click="handleOperation(item.operation, road)">{{item.operation}}</div>
                  <div v-if="item.operation === '商户配置'" class="list-operation" @click="handleOperation(item.operation, road)">{{`${item.operation}(${road[item.key]})`}}</div>
                </div>
              </div>
            </div>
            <base-blank v-else></base-blank>
          </div>
          <div v-if="tabIndex === 1">
            <div v-if="driverList.length">
              <div v-for="(driver, key) in driverList" :key="key" class="list-content list-box">
                <div v-for="(item,index) in commodities" :key="index" class="list-item" :style="{flex: item.flex}">
                  {{item.operation ? '' : driver[item.key]}}
                  <div v-if="item.operation" class="list-operation" @click="handleOperation(item.operation, driver)">{{item.operation}}</div>
                </div>
              </div>
            </div>
            <base-blank v-else></base-blank>
          </div>
        </div>
      </div>
      <!--<div class="pagination-box">-->
      <!--<base-pagination ref="pages"></base-pagination>-->
      <!--</div>-->
    </div>
    <default-confirm ref="confirm" @confirm="handleRoad"></default-confirm>
    <default-modal ref="line">
      <div slot="content" class="default-input">
        <div class="title-box">
          <div class="title">
            新建线路
          </div>
          <span class="close hand" @click="cancel"></span>
        </div>
        <div class="main-input">
          <div class="main-left">
            <div class="text">线路名称</div>
          </div>
          <div class="main-right">
            <div class="main-input-big">
              <input v-model="roadName" type="text" class="main-input-box" placeholder="请输入线路名称" maxlength="10">
            </div>
          </div>
        </div>
        <div class="btn-group">
          <div class="btn cancel" @click="cancel">取消</div>
          <div class="btn confirm" @click="handleRoad">确定</div>
        </div>
      </div>
    </default-modal>
    <default-modal ref="driver">
      <div slot="content" class="default-input">
        <div class="title-box">
          <div class="title">
            {{handleDriverType === 0 ? '新建' : '编辑'}}司机
          </div>
          <span class="close hand" @click="cancel"></span>
        </div>
        <div class="main-input">
          <div class="main-left">
            <div class="text">司机名字</div>
            <div class="text">手机号</div>
            <div class="text">车牌号</div>
            <div class="text">密码</div>
            <div class="text">线路名称</div>
          </div>
          <div class="main-right">
            <div class="main-input-big">
              <input v-model="driverForm.true_name" type="text" class="main-input-box" placeholder="请输入司机名字" maxlength="6">
            </div>
            <div class="main-input-big">
              <input v-model="driverForm.mobile" type="text" class="main-input-box" placeholder="请输入手机号" maxlength="11"
                     :disabled="driverForm.driver_id.length !== 0"
              >
            </div>
            <div class="main-input-big">
              <input v-model="driverForm.plate_number" type="text" class="main-input-box" placeholder="请输入车牌号" maxlength="10">
            </div>
            <div class="main-input-big">
              <input
                v-if="!driverForm.driver_id || (driverForm.driver_id && changePass)"
                v-model="driverForm.password"
                type="password"
                class="main-input-box"
                placeholder="请输入密码"
                maxlength="6"
              >
              <div v-else class="list-operation edit-change" @click="changePass = true">修改密码</div>
            </div>
            <div class="main-input-big">
              <base-drop-down :width="333" :height="44" :select="roadSelect" @setValue="setRoadSelect"></base-drop-down>
            </div>
          </div>
        </div>
        <div class="btn-group">
          <div class="btn cancel" @click="cancel">取消</div>
          <div class="btn confirm" @click="handleDriver">确定</div>
        </div>
      </div>
    </default-modal>
    <default-modal ref="addressModal">
      <div slot="content" class="shade-box">
        <div class="title-box">
          <div class="title">
            选择商户
          </div>
          <span class="close hand" @click="cancel"></span>
        </div>
        <div class="shade-tab">
          <div class="tab-item">
            <base-search ref="search" placeHolder="商户名称" @search="search"></base-search>
          </div>
          <div class="select-text">已选中{{selectList.length}}个商户</div>
        </div>
        <div class="goods-content">
          <div class="big-list">
            <div class="list-header list-box">
              <div class="pro-select pro-text">选择</div>
              <div v-for="(item,index) in merchant" :key="index" class="list-item" :style="{flex: item.flex}">{{item.title}}</div>
            </div>
            <div class="list shade-list">
              <div v-for="(delivery, key) in deliveryAddress" :key="key" class="list-content list-box">
                <div :class="{'pro-select-icon-active': delivery.checked === 1}" class="pro-select pro-select-icon hand" @click="selectDeliveryAddress(delivery)"></div>
                <!--list-item-disable-->
                <div v-for="(item, index) in merchant" :key="index" :class="{'none': delivery[item.key] === '未分配'}" class="list-item" :style="{flex: item.flex}">
                  {{item.operation ? '' : delivery[item.key]}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--<div class="page-box">-->
        <!--<base-pagination ref="shopPage"></base-pagination>-->
        <!--</div>-->
        <div class="back">
          <div class="back-cancel back-btn hand" @click="cancel">取消</div>
          <div class="back-btn back-submit hand" @click="handleRoad">确定</div>
        </div>
      </div>
    </default-modal>

  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import {deliveryComputed, deliveryMethods} from '@state/helpers'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import DefaultModal from '@components/default-modal/default-modal'

  const PAGE_NAME = 'DISPATCHING_MANAGEMENT'
  const TITLE = '调度管理'
  const ORDERSTATUS = [{text: '线路', status: 0}, {text: '司机', status: 1}]
  const COMMODITIES_LIST = [
    {title: '创建时间', key: 'created_at', flex: 1},
    {title: '线路名称', key: 'road_name', flex: 1},
    {title: '商户配置', key: 'addresses_count', operation: '商户配置', flex: 1},
    {title: '操作', key: '', operation: '删除', flex: 0.145}
  ]
  const COMMODITIES_LIST2 = [
    {title: '创建时间', key: 'created_at', flex: 1},
    {title: '司机', key: 'true_name', flex: 1},
    {title: '线路名称', key: 'road_name', flex: 1},
    {title: '车牌号码', key: 'plate_number', flex: 1},
    {title: '手机号', key: 'mobile', flex: 1},
    {title: '操作', key: '', operation: '编辑', flex: 0.245}
  ]
  const MERCHANT = [{title: '商户名称', key: 'name', flex: 3}, {title: '线路', key: 'road_name', flex: 1}]
  const ROAD_SELECT = {
    check: false,
    show: false,
    content: '请选择',
    type: 'default',
    data: []
  }
  const ADD_DRIVER = 0
  const EDIT_DRIVER = 1
  const ADD_ROAD = 0
  const DELETE_ROAD = 1
  const EDIT_ROAD = 2
  const TEL_REG = /^(13[0-9]|14[0-9]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultConfirm,
      DefaultModal
    },
    data() {
      return {
        tabStatus: ORDERSTATUS,
        commodities: [],
        merchant: MERCHANT,
        handleRoadId: '',
        roadName: '',
        driverForm: {
          driver_id: '',
          true_name: '',
          mobile: '',
          plate_number: '',
          road_id: '',
          password: ''
        },
        roadSelect: ROAD_SELECT,
        handleDriverType: ADD_DRIVER,
        handleRoadType: ADD_ROAD,
        deliveryAddress: [],
        isRoadSubmit: false,
        isDriverSubmit: false,
        changePass: false,
        selectList: []
      }
    },
    computed: {
      ...deliveryComputed
    },
    watch: {
      roads() {
        this._setRoadsSelect()
      }
    },
    created() {
      this.commodities = this.tabIndex === 0 ? COMMODITIES_LIST : COMMODITIES_LIST2
      this._setRoadsSelect()
    },
    methods: {
      ...deliveryMethods,
      _setRoadsSelect() {
        let selectData = this.roads.map((item) => {
          item.name = item.road_name
          return item
        })
        selectData.unshift({name: '请选择', road_id: ''})
        this.roadSelect.data = selectData
      },
      handleAdd() {
        if (this.tabIndex === 0) {
          this.handleRoadType = ADD_ROAD
          this.handleRoadId = ''
          this.roadName = ''
          this.$refs.line.showModal()
        } else if (this.tabIndex === 1) {
          this.handleDriverType = ADD_DRIVER
          this.driverForm = {
            driver_id: '',
            true_name: '',
            mobile: '',
            plate_number: '',
            road_id: '',
            password: ''
          }
          this.roadSelect.content = '请选择'
          this.changePass = false
          this.$refs.driver.showModal()
        }
      },
      handleOperation(operation, detail) {
        if (this.tabIndex === 0) {
          if (operation === '删除') {
            this.handleRoadId = detail.road_id
            this.handleRoadType = DELETE_ROAD
            this.$refs.confirm.show(`确定删除该线路？`)
          }
          if (operation === '商户配置') {
            this.handleRoadId = detail.road_id
            this.handleRoadType = EDIT_ROAD
            API.Delivery.getDeliveryAddress({road_id: detail.road_id}).then((res) => {
              this.$loading.hide()
              if (res.error !== this.$ERR_OK) {
                this.$toast.show(res.message)
                return
              }
              this.deliveryAddress = res.data
              let selectAddress = this.deliveryAddress.filter((res) => {
                return res.checked
              })
              this.selectList = selectAddress.map((item) => item.id)
              this.$refs.addressModal.showModal()
            })
          }
        } else if (this.tabIndex === 1) {
          this.handleDriverType = EDIT_DRIVER
          const {
            driver_id: driverId,
            true_name: trueName,
            mobile,
            plate_number: plateNumber,
            road_id: roadId,
            road_name: roadName,
            password
          } = detail
          this.driverForm = {
            driver_id: driverId,
            true_name: trueName,
            mobile,
            plate_number: plateNumber,
            road_id: roadId,
            password: password || ''
          }
          this.roadSelect.content = roadName
          this.$refs.driver.showModal()
        }
      },
      changeStatus(item, index) {
        this.commodities = index === 0 ? COMMODITIES_LIST : COMMODITIES_LIST2
        this.setTabIndex(index)
      },
      cancel() {
        if (this.tabIndex === 0) {
          if (this.handleRoadType === ADD_ROAD) {
            this.$refs.line.hideModal()
          } else if (this.handleRoadType === EDIT_ROAD) {
            this.$refs.search.infoTextMethods()
            this.$refs.addressModal.hideModal()
          }
        } else if (this.tabIndex === 1) {
          this.$refs.driver.hideModal()
        }
        setTimeout(() => {
          this.changePass = false
        }, 300)
      },
      handleRoad() {
        if (this.handleRoadType === ADD_ROAD) {
          if (!this.roadName) {
            this.$toast.show('线路名称不能为空!')
            return
          }
          if (this.isRoadSubmit) return
          this.isRoadSubmit = true
          API.Delivery.addRoad({road_name: this.roadName}).then((res) => {
            const LOADING = false
            this.$loading.hide()
            this.cancel()
            this.$toast.show(res.message)
            this.isRoadSubmit = false
            if (res.error === this.$ERR_OK) {
              this.getRoads(LOADING)
            }
          })
        } else if (this.handleRoadType === DELETE_ROAD) {
          if (this.isRoadSubmit) return
          this.isRoadSubmit = true
          API.Delivery.deleteRoad(this.handleRoadId).then((res) => {
            const LOADING = false
            this.$loading.hide()
            this.cancel()
            this.$toast.show(res.message)
            this.isRoadSubmit = false
            if (res.error === this.$ERR_OK) {
              this.getRoads(LOADING)
            }
          })
        } else if (this.handleRoadType === EDIT_ROAD) {
          // let selectAddress = this.deliveryAddress.filter((res) => {
          //   return res.checked
          // })
          if (this.selectList.length === 0) {
            this.$toast.show('请选择商户')
            return
          }
          let data = {
            // delivery_address_ids: selectAddress.map((item) => item.id),
            delivery_address_ids: this.selectList,
            road_id: this.handleRoadId,
            road_name: this.roadName
          }
          if (this.isRoadSubmit) return
          this.isRoadSubmit = true
          API.Delivery.setAddress(data).then((res) => {
            const LOADING = false
            this.$loading.hide()
            this.cancel()
            this.$toast.show(res.message)
            this.isRoadSubmit = false
            if (res.error === this.$ERR_OK) {
              this.getRoads(LOADING)
            }
          })
        }
      },
      checkDriverValidate() {
        let data = this.driverForm
        if (!data.true_name) {
          this.$toast.show('请输入司机名称')
          return
        } else if (!data.mobile) {
          this.$toast.show('请输入手机号')
          return
        } else if (!TEL_REG.test(data.mobile)) {
          this.$toast.show('请输入正确的手机号')
          return
        } else if (!data.plate_number) {
          this.$toast.show('请输入车牌号')
          return
        } else if ((data.driver_id && this.changePass && !data.password) || (!data.driver_id && !data.password)) {
          this.$toast.show('请输入密码')
          return
        } else if (!data.road_id) {
          this.$toast.show('请选择线路名称')
          return
        }
        return true
      },
      handleDriver() {
        if (!this.checkDriverValidate()) {
          return
        }
        if (this.handleDriverType === ADD_DRIVER) {
          if (this.isDriverSubmit) return
          this.isDriverSubmit = true
          API.Delivery.addDriver(this.driverForm).then((res) => {
            const LOADING = false
            this.$loading.hide()
            this.cancel()
            this.$toast.show(res.message)
            this.isDriverSubmit = false
            if (res.error === this.$ERR_OK) {
              this.getDriverList(LOADING)
            }
          })
        } else if (this.handleDriverType === EDIT_DRIVER) {
          if (this.isDriverSubmit) return
          this.isDriverSubmit = true
          API.Delivery.editDriver(this.driverForm.driver_id, this.driverForm).then((res) => {
            const LOADING = false
            this.$loading.hide()
            this.cancel()
            this.$toast.show(res.message)
            this.isDriverSubmit = false
            if (res.error === this.$ERR_OK) {
              this.getDriverList(LOADING)
            }
          })
        }
      },
      setRoadSelect(select) {
        this.driverForm = {
          ...this.driverForm,
          road_id: select.road_id,
          road: select
        }
      },
      selectDeliveryAddress(delivery) {
        this.deliveryAddress.forEach((item) => {
          if (item.id === delivery.id) {
            if (item.checked) {
              item.checked = 0
              let number = 0
              this.selectList.forEach((selectItem, selectIndex) => {
                if (selectItem === delivery.id) {
                  number = selectIndex
                }
              })
              this.selectList.splice(number, 1)
            } else {
              item.checked = 1
              this.selectList.push(item.id)
            }
          }
        })
      },
      search(text) {
        API.Delivery.getDeliveryAddress({road_id: this.handleRoadId, keyword: text}).then((res) => {
          this.$loading.hide()
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return
          }
          this.deliveryAddress = res.data
          this.deliveryAddress.forEach((item, index) => {
            let isChecked = false
            this.selectList.forEach((selectItem) => {
              if (item.id === selectItem) {
                isChecked = true
              }
            })
            if (isChecked) {
              this.deliveryAddress[index].checked = 1
            } else {
              this.deliveryAddress[index].checked = 0
            }
          })
          this.$refs.addressModal.showModal()
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .table-content
    .list-box
      .list-item
        &:last-child
          max-width: 50px
          padding: 0
  .pro-select-icon
    border-radius: 2px
    border: 1px solid $color-line
    height: 14px
    width: 14px
    transition: all 0.3s
    margin-right: 50px

  .pro-text
    width: 64px

  .pro-select-icon-disable
    border: 1px solid transparent
    cursor: not-allowed
    icon-image('icon-check_ash')

  .pro-select-icon-active
    border: 1px solid transparent
    icon-image('icon-check')

  .dispatching-management
    width: 100%

  .default-input
    padding: 0 20px
    padding-bottom: 80px
    background: #fff
    width: 534px
    border-radius: 2px

    .main-input
      padding: 0px 0px 0 6px
      display: flex
      .main-input-big
        display: flex
        .main-input-tip
          line-height: 44px
          font-size: $font-size-14
          font-family: $font-family-regular
          color: $color-text-main
          margin-left: 10px
      .main-input-box
        display: flex
        align-items: center
        width: 333px
        height: 44px
        border: 1px solid $color-line
        border-radius: 2px
        font-family: $font-family-regular
        color: $color-text-main
        font-size: $font-size-14
        padding-left: 11px
        transition: all 0.3s
        margin-bottom: 20px
        &::-webkit-inner-spin-button
          appearance: none
        &:hover
          border: 1px solid #ACACAC
        &::placeholder
          font-family: $font-family-regular
          color: $color-text-assist
        &:focus
          border-color: $color-main !important
        .main-input-box-add
          width: 84px
          height: 24px
          background: #F5F7FA
          line-height: 24px
          padding-left: 8px
          box-sizing: border-box
          font-family: PingFangSC-Regular
          font-size: $font-size-14
          color: #ACACAC
          margin-left: 3px
          position: relative
          transition: all 0.3s
          &:after
            content: ''
            position: absolute
            right: 11px
            top: 8px
            width: 2px
            height: 8px
            background: #ACACAC
            transition: all 0.3s
          &:before
            content: ''
            position: absolute
            right: 8px
            top: 11px
            width: 8px
            height: 2px
            background: #ACACAC
            transition: all 0.3s

      .edit-change
        margin-bottom: 20px
        height: 44px
        line-height: 44px
  .main-left
    min-width: 60px
    margin-right: 20px
    display: flex
    flex-direction: column
    .text
      line-height: 44px
      color: #666
      font-size: $font-size-14
      font-family: $font-family-regular
      position: relative
      margin-bottom: 20px
      &:after
        content: '*'
        left: -7px
        position: absolute
        margin-right: -2px
        color: #F52424

  .main-model-box
    layout(row)
    align-items: center
    margin-bottom: 24px

  .btn-group
    text-align: center
    display: flex
    justify-content: flex-end
    user-select: none
    .btn
      width: 96px
      height: 40px
      line-height: 40px
      border-radius: 2px
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
        opacity: 0.8
    .one-btn
      margin-left: 0


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
  //  弹窗
  .shade-box
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
    border-radius: 2px
    background: $color-white
    height: 675px
    max-width: 1000px
    width: 1000px
    position: relative
    overflow-x: hidden
    flex-wrap: wrap
    padding: 0 20px
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
    .shade-list
      height: 420px
      overflow-y: auto
      .none
        color: $color-text-assist
      &::-webkit-scrollbar
        width: 4px
        height: 10px
      &::-webkit-scrollbar-thumb
        background-color: rgba(0, 0, 0, .15)
        border-radius: 10px
      &::-webkit-scrollbar-thumb:hover
        background-color: rgba(0, 0, 0, .3)
      &::-webkit-scrollbar-track
        box-shadow: inset 0 0 6px rgba(0, 0, 0, .15)
        border-radius: 10px
    .back
      background: $color-white
      justify-content: flex-end
      position: absolute
      left: 0
      right: 0
      bottom: 0

    /*分类弹窗*/
    .default-input
      box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
      background: #fff
      border-radius: 2px
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
        padding: 0 20px 30px 20px
        .main-input-box
          width: 310px
          height: 44px
          border-radius: 2px
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
      text-align: center
      display: flex
      justify-content: flex-end
      user-select: none
      .btn
        width: 96px
        height: 40px
        line-height: 40px
        border-radius: 2px
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

  /*选择商品样式*/
  .shade-tab
    margin-bottom: 20px
    box-sizing: border-box
    layout(row)
    align-items: center
    .tab-item
      margin-right: 10px
    .select-text
      font-size: $font-size-14
      color: $color-main
      font-family: $font-family-regular

  .page-box
    padding: 0 20px
    box-sizing: border-box
    height: 66px
    align-items: center
    display: flex

  .goods-content
    border-radius: 2px
    height: 400px
    .rush-goods-list
      flex-wrap: wrap
      display: flex
    .big-list
      height: 465px
  .list-item-disable
    color: #ACACAC

  .dispatching-list
    padding-bottom: 20px
</style>
