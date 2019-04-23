<template>
  <default-modal ref="memberModal">
    <div slot="content" class="shade-box">
      <div class="title-box">
        <div class="title">
          添加成员
        </div>
        <span class="close hand" @click="_cancelMember"></span>
      </div>
      <div class="shade-tab">
        <div class="tab-item">
          <base-drop-down :width="218" :select="assortment" @setValue="_choiceFirstAssortment"></base-drop-down>
        </div>
        <div class="tab-item">
          <base-drop-down :width="140" :select="secondAssortment" @setValue="_choiceSecondAssortment"></base-drop-down>
        </div>
        <div class="tab-item">
          <base-search ref="goodsSearch" placeHolder="成员姓名" @search="_searchMember"></base-search>
        </div>
      </div>
      <div class="goods-content">
        <div class="outreach-goods-list">
          <div v-for="(item, index) in memberList" :key="index" class="goods-item">
            <span class="select-icon hand" :class="{'select-icon-disable': checkSelect(item), 'select-icon-active': checkChoice(item)}" @click="_selectMember(item,index, checkSelect(item))"></span>
            <div class="member-name">{{item.name}}</div>
            <div class="member-tel">{{item.mobile}}</div>
            <div class="add-btn btn-main" :class="{'add-btn-disable': checkSelect(item)}" @click="_additionOne(item, index, checkSelect(item))">{{formatBtn(item)}}</div>
          </div>
        </div>
      </div>
      <div class="page-box">
        <base-pagination ref="pagination" :pageDetail="memberPage" @addPage="_getMoreMember"></base-pagination>
      </div>
      <div class="back">
        <div class="back-cancel back-btn hand" @click="_cancelMember">取消</div>
        <div class="back-btn back-submit hand" @click="_memberAddition">批量添加</div>
      </div>
    </div>
  </default-modal>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  import API from '@api'

  const NAME = 'MEMBER_MODAL'

  export default {
    name: NAME,
    components: {
      DefaultModal
    },
    props: {
      selectMembers: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data() {
      return {
        memberList: [], // 成员列表
        checkedMembers: [], // 选中的成员列表
        assortment: {
          check: false,
          show: false,
          content: '选择部门',
          type: 'default',
          data: []
        },
        secondAssortment: {
          check: false,
          show: false,
          content: '选择团队',
          type: 'default',
          data: []
        },
        departmentId: 0, // 部门ID
        firstAssortmentId: -2,
        page: 1,
        keyword: '',
        memberPage: {
          total: 1,
          per_page: 7,
          total_page: 1
        }
      }
    },
    created() {},
    methods: {
      _initData() {
        this.memberList = []
        this.departmentId = 0
        this.page = 1
        this.keyword = ''
        this.checkedMembers = []
        this.assortment = {
          check: false,
          show: false,
          content: '选择部门',
          type: 'default',
          data: []
        }
        this.secondAssortment = {
          check: false,
          show: false,
          content: '选择团队',
          type: 'default',
          data: []
        }
      },
      _memberAddition() {
        this.$emit('_memberAddition', this.checkedMembers)
        this.$refs.memberModal.hideModal()
      },
      async showModal() {
        this.$refs.goodsSearch._setText('')
        this._initData()
        await this._getMemberList()
        this.$refs.memberModal.showModal()
        this._getFirstAssortment(-2)
      },
      _cancelMember() {
        this.$refs.goodsSearch._setText('')
        this._initData()
        this.$refs.memberModal.hideModal()
      },
      // 获取部门列表
      async _getFirstAssortment(id) {
        let res = await API.Outreach.getBranchList({parent_id: id})
        this.assortment.data = res.error === this.$ERR_OK ? res.data : []
        this.assortment.data.unshift({name: '全部', id: ''})
      },
      // 获取团队列表
      async _getSecondAssortment(id) {
        let res = await API.Outreach.getBranchList({parent_id: id})
        this.secondAssortment.data = res.error === this.$ERR_OK ? res.data : []
        this.secondAssortment.data.unshift({name: '全部', id: ''})
      },
      // 获取成员列表
      async _getMemberList() {
        let data = {
          department_id: this.departmentId,
          name: this.keyword,
          page: this.page,
          limit: 7
        }
        let res = await API.Outreach.getTeamList(data)
        if (res.error === this.$ERR_OK) {
          this.memberList = res.data
          this.memberPage = {
            total: res.meta.total,
            per_page: res.meta.per_page,
            total_page: res.meta.last_page
          }
        }
      },
      _choiceFirstAssortment(item) {
        if (item.id) {
          this.departmentId = item.id
          this.firstAssortmentId = item.id
          this._getSecondAssortment(item.id)
          this._getMemberList()
        } else {
          this.secondAssortment = {
            check: false,
            show: false,
            content: '选择团队',
            type: 'default',
            data: []
          }
          this.departmentId = ''
          this.firstAssortmentId = -2
          this._getSecondAssortment(-2)
          this._getMemberList()
        }
      },
      _choiceSecondAssortment(item) {
        if (item.id) {
          this.departmentId = item.id
          this._getMemberList()
        } else {
          this.departmentId = this.firstAssortmentId
          this._getMemberList()
        }
      },
      _searchMember(text) {
        this.keyword = text
        this.page = 1
        this.$refs.pagination.beginPage()
        this._getMemberList()
      },
      _selectMember(item, idx, type) {
        if (type) return
        let hasIn = this.checkedMembers.some((item1) => {
          return +item.id === +item1.id
        })
        if (hasIn) {
          this.checkedMembers = this.checkedMembers.filter((item2) => {
            return +item2.id !== +item.id
          })
        } else {
          this.checkedMembers.push(item)
        }
      },
      _additionOne(item, idx, type) {
        if (type) return
        this.$emit('addMemberOne', item)
      },
      _getMoreMember(page) {
        this.page = page
        this._getMemberList()
      },
      // 是否确定选择过
      checkSelect(item) {
        return this.selectMembers.some((item1) => {
          return +item.id === +item1.id
        })
      },
      // 是否临时勾选
      checkChoice(item) {
        return this.checkedMembers.some((item1) => {
          return +item.id === +item1.id
        })
      },
      // 按钮文字
      formatBtn(item) {
        let hasIn = this.selectMembers.some((item1) => {
          return +item.id === +item1.id
        })
        if (hasIn) {
          return '已添加'
        } else {
          return '添加'
        }
      }
    }
  }
</script>

<style  scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

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
    .back
      border-top-1px($color-line)
      position: absolute
      left: 0
      right: 0
      bottom: 0
      background: $color-white
      justify-content: flex-end
      height: 70px
    /*小弹窗盒子*/
    .default-modal-small
      position: absolute
      width: 100%
      height: 100%
      background: rgba(0, 0, 0, 0.50)
      top: 0
      bottom: 0
      right: 0
      z-index: 10
      layout()
      justify-content: center
      align-items: center
      .model-active
        animation: layerFadeIn .3s
      .model-un-active
        animation: hideFadeIn .4s

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
        padding: 42px 20px 30px 20px
        .main-input-box
          width: 310px
          height: 40px
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

  .shade-tab
    height: 48px
    box-sizing: border-box
    display: flex
    .tab-item
      margin-right: 10px

  .page-box
    box-sizing: border-box
    height: 76px
    align-items: center
    display: flex

  .goods-content
    border-radius: 4px
    height: 420px
    .goods-list
      flex-wrap: wrap
      display: flex
    .goods-item
      box-sizing: border-box
      padding: 0 30px 0 20px
      width: 100%
      height: 60px
      display: flex
      justify-content: space-between
      align-items: center
      position: relative
      &:last-child
        border-bottom-1px($color-line)
      &:before
        content: ""
        pointer-events: none // 解决iphone上的点击无效Bug
        display: block
        position: absolute
        left: 0
        top: 0
        transform-origin: 0 0
        border-right: 1px solid #E9ECEE
        border-left: 1px solid #E9ECEE
        border-top: 1px solid #E9ECEE
        box-sizing border-box
        width: 200%
        height: 100%
        transform: scaleX(.5) translateZ(0)
        @media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3)
          width: 100%
          height: 300%
          transform: scaleX(1 / 3) translateZ(0)
      &:nth-child(2n - 1)
        background: #f5f7fa
      .goods-img
        margin-right: 10px
        width: 40px
        height: @width
        overflow: hidden
        background-repeat: no-repeat
        background-size: cover
        background-position: center
        background-color: $color-background
      .select-icon
        margin-right: 20px
        border-radius: 1px
        border: 1px solid #e9ecee
        height: 16px
        width: 16px
        -webkit-transition: all .3s
        transition: all .3s
      .select-icon-active
        border: 1px solid transparent
        display: inline-block
        background-size: 100% 100%
        background-image: url("./icon-check@2x.png")
      .select-icon-disable
        border: 1px solid transparent
        cursor: not-allowed
        display: inline-block
        background-size: 100% 100%
        background-image: url("./icon-check_ash@2x.png")
      .member-tel
        flex: 1
        margin-left: 280px
      .member-name
        width: 100px
        margin-right: 50px
      .goods-msg
        flex: 1
        display: flex
        color: $color-text-main
        font-family: $font-family-regular
        justify-content: space-between
        height: 100%
        align-items: center
        .goods-name
          width: 500px
          no-wrap()
        .goods-name, .goods-money
          line-height: 1
          font-size: $font-size-14
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
    .page-box
      padding: 0 20px
      box-sizing: border-box
      height: 77px
      align-items: center
      display: flex


</style>
