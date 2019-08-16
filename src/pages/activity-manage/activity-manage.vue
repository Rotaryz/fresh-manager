<template>
  <div class="activity-manage table">
    <base-tab-select :infoTabIndex="tabIndex" :tabStatus="tabStatus" @getStatusTab="changeTab"></base-tab-select>
    <article class="data-content">
      <div class="down-content">
        <span class="down-tip">活动时间</span>
        <div class="down-item">
          <base-date-select :dateInfo="[requestData.start_at, requestData.end_at]" placeHolder="选择日期" @getTime="_setTime"></base-date-select>
        </div>
      </div>
      <div class="table-content">
        <div class="identification">
          <div class="identification-page">
            <img :src="currentTab.icon" class="identification-icon">
            <p class="identification-name">{{currentTab.text}}</p>
            <base-status-tab ref="statusTab" :infoTabIndex="defaultIndex" :statusList="statusTab" @setStatus="changeStatus"></base-status-tab>
          </div>
          <div class="function-btn">
            <div class="btn-main" @click="handleNav">新建活动<span class="add-icon"></span></div>
          </div>
        </div>
        <div class="big-list">
          <div class="list-header list-box">
            <div v-for="(item,index) in saleTitle" :key="index" class="list-item" :style="{flex: item.flex}">{{item.name}}</div>
          </div>
          <div v-if="activeList.length" class="list">
            <div v-for="(item, index) in activeList" :key="index" class="list-content list-box">
              <div v-for="(val, ind) in saleTitle" :key="ind" :style="{flex: val.flex}" class="list-item">
                <div v-if="+val.type === 1 || +val.type === 3" :style="{flex: val.flex}" class="item">
                  {{+val.type === 3 ? '¥' : ''}}{{item[val.value] || '0'}}
                </div>
                <div v-if="+val.type === 2" :style="{flex: val.flex}" class="list-double-row item">
                  <p class="item-dark">{{item.start_at}}</p>
                  <p class="item-sub">{{item.end_at}}</p>
                </div>

                <!--状态-->
                <div v-if="+val.type === 4" :style="{flex: val.flex}" class="status-item item" :class="item.status === 1 ? 'status-success' : item.status === 0 ? '' : 'status-fail'">{{statusHandle(item.status)}}</div>

                <div v-if="+val.type === 5" :style="{flex: val.flex}" class="list-operation-box item">
                  <span class="list-operation" @click="handleNav(item, 'id')">查看</span>
                  <span class="list-operation" @click="_deleteActivity(item)">删除</span>
                  <span class="list-operation" @click="handleNav(item, 'editId')">复制活动</span>
                  <span v-if="+item.status !== 2 && +item.status !== 3" class="list-operation" @click="stopActive(item)">终止活动</span>
                </div>
                <div v-if="+val.type === 6" :style="{flex: val.flex}" class="item">
                  {{item[val.value] || '0'}}/{{item[val.value2] || '0'}}
                </div>
              </div>
            </div>
          </div>
          <base-blank v-else blackStyle="margin-top:15%"></base-blank>
        </div>
        <div class="pagination-box">
          <base-pagination ref="pages" :pagination="requestData.page" :pageDetail="activePage" @addPage="addPage"></base-pagination>
        </div>
      </div>
      <default-confirm ref="confirm" @confirm="_sureConfirm"></default-confirm>
    </article>
  </div>
</template>

<script type="text/ecmascript-6">
// import FlashSale from './flash-sale/flash-sale'
// import PopularToday from './popular-today/popular-today'
// import NewPreference from './new-preference/new-preference'
// import CollageReturn from './collage-return/collage-return'
  import {activityComputed, activityMethods} from '@state/helpers'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import API from '@api'
  import { TAB_STATUS } from './config'
  // import { activityMethods, activityComputed, saleMethods } from '@state/helpers'

  const PAGE_NAME = 'ACTIVITY_MANAGE'
  const TITLE = '活动管理'
  const SALE_TITLE = [
    {name: '活动时间', flex: 1.3, value: 'start_at', type: 2},
    {name: '活动名称', flex: 1.3, value: 'activity_name', type: 1},
    {name: '商品', flex: 1.4, value: 'goods_count', type: 1},
    {name: '销量', flex: 1, value: 'sale_count', type: 1},
    {name: '交易额(元)', flex: 1, value: 'pay_amount', type: 3},
    {name: '状态', flex: 1, value: 'status', type: 4},
    {name: '操作', flex: 2, value: '', type: 5}
  ]
  const COLLAGE_TITLE = [
    {name: '活动时间', flex: 1.5, value: 'start_at', type: 2},
    {name: '活动名称', flex: 1.5, value: 'activity_name', type: 1},
    {name: '活动商品数', flex: 1, value: 'goods_count', type: 1},
    {name: '销量', flex: 1, value: 'sale_count', type: 1},
    {name: '交易额(元)', flex: 1, value: 'pay_amount', type: 3},
    {name: '成团数/模拟成团数', flex: 1.5, value: 'groupon_success_num', type: 6, value2: 'groupon_imitate_success_num'},
    {name: '参团人员', flex: 1, value: 'groupon_all_people_num', type: 1},
    {name: '状态', flex: 1, value: 'status', type: 4},
    {name: '创建时间', flex: 1.5, value: 'start_at', type: 1},
    {name: '操作', flex: 1.9, value: '', type: 5}
  ]
  // export const TAB_STATUS = [
  //   {text: '限时抢购', icon: require('./icon-today_rob@2x.png') ,status: 'one', activity_theme: 'fixed'},
  //   {text: '今日爆款', icon: require('./icon-today_hot@2x.png'), status: 'two', activity_theme: 'hot_tag'},
  //   {text: '新人特惠', icon: require('./icon-new_people@2x.png'), status: 'three', activity_theme: 'new_client'},
  //   {text: '拼团返现', icon: require('./icon-group_return@2x.png'), status: 'four', activity_theme: 'groupon'},
  // ]
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      // CollageReturn,
      DefaultConfirm
    },
    data() {
      const params = this.$route.meta.params
      return {
        tabStatus: TAB_STATUS,
        defaultStatus: 'one',
        activeList: params.dataInfo,
        activePage: params.pageInfo,
        statusTab: [
          {name: '全部', value: '', key: 'all', num: 0},
          {name: '未开始', value: 1, key: 'wait_submit', num: 0},
          {name: '进行中', value: 1, key: 'success', num: 0},
          {name: '已结束', value: 1, key: 'success', num: 0}
        ],
        saleTitle: SALE_TITLE,
        startTime: '',
        endTime: '',
        page: 1,
        status: '',
        statusIndex: 0,
        currentItem: {},
        confirmType: ''
      }
    },
    computed: {
      ...activityComputed,
      // infoTabIndex() {
      //   return this.tabStatus.findIndex((item) => item.status === this.defaultStatus)
      // },
      currentTab() {
        return TAB_STATUS[this.tabIndex]
      }
    },
    watch: {
      currentTab(val) {
        if (val.activity_theme === 'groupon') {
          this.saleTitle = COLLAGE_TITLE
        } else {
          this.saleTitle = SALE_TITLE
        }
      }
    },
    created() {
      this.$loading.hide()
      if (this.currentTab.activity_theme === 'groupon') {
        this.saleTitle = COLLAGE_TITLE
      } else {
        this.saleTitle = SALE_TITLE
      }
      this.status = this.$route.query.status * 1 || 0
      this._getActiveStatus()
    },
    mounted() {

    },
    methods: {
      ...activityMethods,
      handleNav(item = {}, key = 'id') {
        const path = this.currentTab.activity_theme === 'groupon' ? 'new-collage' : 'new-sale'
        const url = `${this.$route.path}/${path}?${key}=${item.id || 0}&activity_theme=${this.currentTab.activity_theme}`
        // window.$$tabIndex = this.tabIndex
        this.$router.push(url)
      },
      statusHandle(status) {
        switch (+status) {
        case 0:
          return '未开始'
        case 1:
          return '进行中'
        case 2:
          return '已结束'
        default:
          return '已终止'
        }
      },
      async _getActiveStatus() {
        try {
          const res = await API.Activity.getActiveStatus({
            start_at: this.requestData.start_at,
            end_at: this.requestData.end_at,
            activity_theme: this.requestData.activity_theme
            // activity_theme: this.currentTab.activity_theme
          })
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return
          }
          this.statusTab = res.data.map((item, index) => {
            return {
              name: item.status_str,
              value: item.status,
              num: item.statistic
            }
          })
          let index = this.statusTab.findIndex((item) => +item.value === +this.requestData.status)
          this.firstIn && this.status && this.setDefaultIndex({status: this.status, index: index > 0 ? index : 0})
          if (this.status) {
            this.setFirstIn()
          }
        } catch (e) {
          console.warn(e)
        }
      },
      async _getActiveList() {
        try {
          const res = await API.Activity.getActiveList(this.requestData)
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return
          }
          this.activeList = res.data
          this.activePage = {
            total: res.meta.total,
            per_page: res.meta.per_page,
            total_page: res.meta.last_page
          }
        } catch (e) {
          console.warn(e)
        }
      },
      _resetPage() {
        this.$refs.pages && this.$refs.pages.beginPage()
      },
      changeTab(tab, index) {
        this.setTabIndex(index)
        this.setDefaultIndex(0)
        this.setRequestData({
          page: 1,
          start_at: '',
          end_at: '',
          status: '',
          activity_theme: this.currentTab.activity_theme
        })
        this._getActiveList()
        this._getActiveStatus()
        this._resetPage()
      },
      async changeStatus(selectStatus, index) {
        this._resetPage()
        this.setDefaultIndex({status: selectStatus.value, index})
        // this.status = selectStatus.value
        // this.page = 1
        this._getActiveList()
        // this._getActiveStatus()
      },
      async _setTime(arr) {
        // this.startTime = arr[0]
        // this.endTime = arr[1]
        // this.page = 1
        this.setRequestData({start_at: arr[0], end_at: arr[1], page: 1})
        this._getActiveList()
        this._getActiveStatus()
        this._resetPage()
      },
      addPage(page) {
        // this.page = page
        this.setRequestData({page})
        this._getActiveList()
        // this._getActiveStatus()
      },
      _deleteActivity(item) {
        this.currentItem = item
        this.confirmType = 'del'
        this.$refs.confirm.show('确定删除该活动？')
      },
      async _sureConfirm() {
        if (this.confirmType === 'del') {
          let res = await API.Sale.saleDelete(this.currentItem.id)

          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return
          } else {
            this.$toast.show('删除成功')
          }
          if (+this.activePage.total%10 === 1 && +this.requestData.page === +this.activePage.total_page) {
            this.setRequestData({page: this.activePage.total_page - 1})
          } else {
            this._getActiveList()
          }
          this._getActiveStatus()
        } else {
          let res = await API.Sale.stopActive(this.currentItem.id)

          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return
          } else {
            this.$toast.show('终止活动成功')
          }
          if (+this.activePage.total%10 === 1 && +this.requestData.page === +this.activePage.total_page) {
            this.setRequestData({page: this.activePage.total_page - 1})
          } else {
            this._getActiveList()
          }
          this._getActiveStatus()
        }

      },
      stopActive(item) {
        this.currentItem = item
        this.confirmType = 'stop'
        this.$refs.confirm.show('确定提前终止活动吗？')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .data-content
    flex: 1
    display: flex
    flex-direction: column
  .list-box
    .list-item:last-child
      max-width: 228px
      min-width: 228px
      padding-right: 0
  .list
    flex: 1
    .list-item
      font-size: $font-size-14
      &:last-child
        max-width: 228px
        min-width: 228px
        padding-right: 0
      .item
        text-overflow: ellipsis
        overflow: hidden
        white-space: nowrap
        font-size: 14px
      .status-item:before
        content: ""
        display: inline-block
        width: 9px
        height: 9px
        border-radius: 50%
        margin-right: 6px
        background: $color-negative
      .status-fail:before
        background: #E1E1E1
      .status-success:before
        background: $color-positive
      .list-double-row
        .item-sub
          color: #333
</style>
