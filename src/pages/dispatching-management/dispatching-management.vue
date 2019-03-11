<template>
  <div class="dispatching-management table">
    <base-tab-select :infoTabIndex="infoTabIndex" :tabStatus="tabStatus" @getStatusTab="changeStatus"></base-tab-select>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img :src="infoTabIndex === 0 ? require('./icon-purchase_list@2x.png') : require('./icon-driver@2x.png')" class="identification-icon">
          <p class="identification-name">{{tabStatus[infoTabIndex].text}}</p>
        </div>
        <div class="function-btn">
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item" :style="{flex: item.flex}">{{item.title}}</div>
        </div>
        <div class="list">
          <div class="list-content list-box">
            <div v-for="(item,index) in commodities" :key="index" class="list-item" :style="{flex: item.flex}">
              {{item.operation ? '' : 'item'}}
              <div v-if="item.operation" class="list-operation" @click="_deal(item)">{{item.operation}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pages"></base-pagination>
      </div>
    </div>
    <default-confirm ref="confirm" @confirm="_del"></default-confirm>
    <!--<default-modal ref="modal">-->
    <!--<div slot="content" class="default-input">-->
    <!--<div class="title-input">-->
    <!--<div class="title">新建线路</div>-->
    <!--<div class="close-box" @click="cancel">-->
    <!--<div class="close"></div>-->
    <!--</div>-->
    <!--</div>-->
    <!--<div class="main-input">-->
    <!--<div class="main-left">-->
    <!--<div class="text">线路名称</div>-->
    <!--</div>-->
    <!--<div class="main-right">-->
    <!--<div class="main-input-big">-->
    <!--<input type="number" class="main-input-box" placeholder="请输入线路名称">-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--<div class="btn-group">-->
    <!--<div class="btn cancel" @click="cancel">取消</div>-->
    <!--<div class="btn confirm" @click="confirm">确定</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--</default-modal>-->
    <default-modal ref="modal">
      <div slot="content" class="default-input">
        <div class="title-input">
          <div class="title">新建司机</div>
          <div class="close-box" @click="cancel">
            <div class="close"></div>
          </div>
        </div>
        <div class="main-input">
          <div class="main-left">
            <div class="text">司机名字</div>
            <div class="text">手机号</div>
            <div class="text">车牌号</div>
            <div class="text">线路名称</div>
          </div>
          <div class="main-right">
            <div class="main-input-big">
              <input type="number" class="main-input-box" placeholder="请输入司机名字">
            </div>
            <div class="main-input-big">
              <input type="number" class="main-input-box" placeholder="请输入手机号">
            </div>
            <div class="main-input-big">
              <input type="number" class="main-input-box" placeholder="请输入车牌号">
            </div>
            <div class="main-input-big">
              <base-drop-down :width="333" :height="44"></base-drop-down>
            </div>
          </div>
        </div>
        <div class="btn-group">
          <div class="btn cancel" @click="cancel">取消</div>
          <div class="btn confirm" @click="confirm">确定</div>
        </div>
      </div>
    </default-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import DefaultModal from '@components/default-modal/default-modal'

  const PAGE_NAME = 'DISPATCHING_MANAGEMENT'
  const TITLE = '调度管理'
  const ORDERSTATUS = [{text: '线路', status: ''}, {text: '司机', status: 0}]
  const COMMODITIES_LIST = [
    {title: '创建时间', key: '', flex: 1},
    {title: '线路名称', key: '', flex: 1},
    {title: '商户配置', key: '', flex: 1},
    {title: '操作', key: '', operation: '删除', flex: 0.145}
  ]
  const COMMODITIES_LIST2 = [
    {title: '编号', key: '', flex: 1},
    {title: '司机', key: '', flex: 1},
    {title: '线路名称', key: '', flex: 1},
    {title: '车牌号码', key: '', flex: 1},
    {title: '手机号', key: '', flex: 1},
    {title: '操作', key: '', operation: '编辑', flex: 0.245}
  ]
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
        commodities: COMMODITIES_LIST,
        infoTabIndex: 0
      }
    },
    mounted() {
      this.$refs.modal.showModal()
    },
    methods: {
      _deal(item) {
        if (item.operation === '删除') {
          this.$refs.confirm.show(`确定删除该线路？`)
          return
        }
        console.log('fd')
      },
      _del() {

      },
      changeStatus(item, index) {
        this.infoTabIndex = index
        this.commodities = this.infoTabIndex === 0 ? COMMODITIES_LIST : COMMODITIES_LIST2
      },
      cancel() {
        this.$refs.modal.hideModal()
      },
      confirm() {

      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .dispatching-management
    width: 100%

  .default-input
    padding-bottom: 30px
    background: #fff
    width: 534px
    border-radius: 1px

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
        font-family: $font-family-regular
      .close-box
        padding: 17px
        cursor: pointer
        .close
          width: 22px
          height: 22px
          border-radius: 50%
          background-size: 22px
          bg-image('icon-close')

    .main-input
      padding: 29.5px 20px 0 40px
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
        border-radius: 1px
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

    .main-left
      min-width: 60px
      margin-right: 20px
      display: flex
      flex-direction: column
      align-items: flex-end
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
      margin-top: 20px
      text-align: center
      display: flex
      justify-content: center
      user-select: none
      .btn
        width: 96px
        height: 40px
        line-height: 40px
        border-radius: 1px
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
</style>
