<template>
      <!--列表部分-->
      <div class="big-list">
        <div class="list-header list-box">
          <div class="pro-select-icon hand" :class="{'pro-select-icon-active': select, 'pro-select-icon-disable': status !== 1 && status !== 2}" @click="selectPurchase({type: 'all', status: status})"></div>
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in purchaseTaskList" :key="index" class="list-content list-box">
            <div class="pro-select-icon hand" :class="{'pro-select-icon-active': item.select, 'pro-select-icon-disable': item.status !== 1 && item.status !== 2, 'pro-select-icon-disable': status !== 1 && status !== 2}" @click="selectPurchase({type: index, status: status})"></div>
            <div class="list-item">{{item.goods_name}}</div>
            <div class="list-item">{{item.goods_category}}</div>
            <div class="list-item">{{item.supplier}}</div>
            <div class="list-item">{{item.purchase_user}}</div>
            <div class="list-item">{{item.plan_num}}{{item.purchase_unit}}({{item.plan_base_num}}{{item.base_unit}})</div>
            <div class="list-item">{{item.finish_num}}{{item.purchase_unit}}({{item.finish_base_num}}{{item.base_unit}})</div>
            <div class="list-item list-item-progress">
              <div class="progress-content">
                <div class="progress-num">{{item.finish_num}}{{item.purchase_unit}}/{{item.plan_num}}{{item.purchase_unit}}</div>
                <div class="progress-bar">
                  <span class="progress-bar-active" :style="{width: item.finish_percent}"></span>
                </div>
              </div>
              <div class="progress-percentage">{{item.finish_percent}}</div>
            </div>
            <div class="list-item">{{item.publish_at}}</div>
            <div class="list-item"><span class="list-status" :class="{'list-status-success': item.status === 3, 'list-status-warn': item.status === 2}"></span>{{item.status_str}}</div>
          </div>
        </div>
      </div>
</template>

<script type="text/ecmascript-6">
  import {DatePicker} from 'iview'
  import {proTaskComputed, proTaskMethods} from '@state/helpers'
  import API from '@api'
  import _ from 'lodash'
  const PAGE_NAME = 'PROCUREMENT_TASK'
  const TITLE = '拣货任务列表'
  const COMMODITIES_LIST = ['商品名称',  '分类', '下单数']
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DatePicker
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        page: 1,
        startTime: '',
        endTime: '',
        keyword: '',
        time: '',
        status: '',
        supplyId: '',
        selectList: [],
        dispatchSelect: [
          {
            "status": "",
            "status_str": "全部",
            "statistic": 1
          },
          {
            "status": 0,
            "status_str": "待分拣",
            "statistic": 1
          },
          {
            "status": 1,
            "status_str": "已分拣",
            "statistic": 0
          }
        ],
        filterTaskFrist: {
          check: false,
          show: false,
          content: '全部',
          type: 'default',
          data: [{name: '全部', id: ''}]
        },
        filterTaskSecond: {
          check: false,
          show: false,
          content: '全部',
          type: 'default',
          data: [{name: '全部', id: ''}]
        },
        parentId: '',
        taskNum: '',
        showSelectIndex: -1,
        choiceGoods: [],
        goodsPage: {total: 1, per_page: 10, total_page: 1},
        text: '',
        assortment: {check: false, show: false, content: '选择分类', type: 'default', data: []}, // 格式：{title: '55'
        secondAssortment: {check: false, show: false, content: '选择二级分类', type: 'default', data: []}, // 格式：{title: '55'}}
        goodsItem: {},
        choicePage: 1,
        oneBtn: false,
        confirmType: '',
        statusTab: 0
      }
    },
    computed: {
      ...proTaskComputed
    },
    async created() {
      this.startTime = this.$route.params.start
      this.endTime = this.$route.params.end
      if (this.$route.query.status) {
        this.statusTab = this.$route.query.status * 1
        this.status = this.$route.query.status * 1
      }
      // await this._getFirstAssortment()
      await this._getGoodsList()
      // await this._getSupplierList()
      // await this._statistic()
    },
    methods: {
      ...proTaskMethods,
      // 选择商品
      _selectGoods(item, index) {
        this.showSelectIndex = index
      },
      // 获取商品列表
      async _getGoodsList() {
        let res = await API.Sorting.getSortingTaskList({
          // keyword: this.text,
          // goods_category_id: this.parentId,
          page: this.choicePage,
          limit: 7
        })
        if (res.error !== this.$ERR_OK) {
          return
        }

        this.goodsPage = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        console.log(res,'red')
        // this.choiceGoods = res.data
      },
      // 搜索商品
      async _searchGoods(text) {
        this.text = text
        this.choicePage = 1
        this.$refs.goodsPage.beginPage()
        await this._getGoodsList()
        await this._statistic()
      },
      // 获取分页商品列表
      async _getMoreGoods(page) {
        this.choicePage = page
        await this._getGoodsList()
        await this._statistic()
      },
      // 弹窗确定选择链接
      async _miniGoods() {
        this.goodsItem = this.choiceGoods[this.showSelectIndex]
        this._hideGoods()
      },
      delGoods() {
        this.goodsItem = {}
      },
      // 选择一级分类
      async _secondAssortment(item) {
        this.parentId = item.id
        if (item.id === '') {
          this.secondAssortment.data = []
        } else {
          let res = await API.Store.goodsCategory({parent_id: this.parentId})
          this.secondAssortment.data = res.error === this.$ERR_OK ? res.data : []
          this.secondAssortment.data.unshift({name: '全部', id: this.parentId})
        }
        this.secondAssortment.content = '选择二级分类'
        this.choicePage = 1
        this.$refs.goodsPage.beginPage()
        await this._getGoodsList()
      },
      // 选择二级分类
      async _choessSecondAssortment(item) {
        this.parentId = item.id
        this.choicePage = 1
        this.$refs.goodsPage.beginPage()
        await this._getGoodsList()
      },
      // 获取一级分类
      async _getFirstAssortment() {
        let res = await API.Store.goodsCategory({parent_id: this.parentId})
        this.goodsCate = res.error === this.$ERR_OK ? _.cloneDeep(res.data) : []
        this.assortment.data = res.error === this.$ERR_OK ? res.data : []
        this.assortment.data.unshift({name: '全部', id: ''})
      },
      // 隐藏商品弹窗
      _hideGoods() {
        this.showSelectIndex = -1
        this.text = ''
        this.choicePage = 1
        this.$refs.goods.hideModal()
      },
      _showGoods() {
        this.$refs.goods.showModal()
      },
      // 列表状态栏选择
      async _setStatus(item) {
        // this.status = item.value
        // this.page = 1
        // this.$refs.pages.beginPage()
        // this.getPurchaseTaskList({
        //   time: this.time,
        //   startTime: this.startTime,
        //   endTime: this.endTime,
        //   keyword: this.keyword,
        //   status: this.status,
        //   page: this.page,
        //   supplyId: this.supplyId,
        //   loading: false
        // })
      },
      async _setValueFrist(item) {
        this.supplyId = item.id
        this.page = 1
        this.$refs.pages.beginPage()
        this.getPurchaseTaskList({
          time: this.time,
          startTime: this.startTime,
          endTime: this.endTime,
          keyword: this.keyword,
          status: this.status,
          page: this.page,
          supplyId: this.supplyId,
          loading: false
        })
        await this._statistic()
      },
      async _setValueSecond(item) {
        this.supplyId = item.id
        this.page = 1
        this.$refs.pages.beginPage()
        this.getPurchaseTaskList({
          time: this.time,
          startTime: this.startTime,
          endTime: this.endTime,
          keyword: this.keyword,
          status: this.status,
          page: this.page,
          supplyId: this.supplyId,
          loading: false
        })
        await this._statistic()
      },
      async _getStartTime(time) {
        this.startTime = time
        if (Date.parse(this.startTime) > Date.parse(this.endTime)) {
          this.$toast.show('开始时间不能大于结束时间')
          return
        }
        this.page = 1
        this.$refs.pages.beginPage()
        this.getPurchaseTaskList({
          time: this.time,
          startTime: this.startTime,
          endTime: this.endTime,
          keyword: this.keyword,
          status: this.status,
          page: this.page,
          supplyId: this.supplyId,
          loading: false
        })
        await this._statistic()
      },
      async _search(word) {
        this.keyword = word
        this.page = 1
        this.$refs.pages.beginPage()
        this.getPurchaseTaskList({
          time: this.time,
          startTime: this.startTime,
          endTime: this.endTime,
          keyword: this.keyword,
          status: this.status,
          page: this.page,
          supplyId: this.supplyId,
          loading: false
        })
        await this._statistic()
      },
      async _getEndTime(time) {
        this.endTime = time
        if (Date.parse(this.startTime) > Date.parse(this.endTime)) {
          this.$toast.show('结束时间不能小于开始时间')
          return
        }
        this.page = 1
        this.$refs.pages.beginPage()
        this.getPurchaseTaskList({
          time: this.time,
          startTime: this.startTime,
          endTime: this.endTime,
          keyword: this.keyword,
          status: this.status,
          page: this.page,
          supplyId: this.supplyId,
          loading: false
        })
        await this._statistic()
      },
      async _exportPickingOrder() {
        // let selectArr = []
        // this.purchaseTaskList.forEach((item) => {
        //   if (item.select) {
        //     selectArr.push(item.id)
        //   }
        // })
        // if (this.purchaseTaskList.length === 0) {
        //   this.$toast.show('暂无任务可发布')
        //   return
        // }
        // if (!selectArr.length) {
        //   this.oneBtn = false
        //   this.confirmType = 1
        //   this.$refs.confirmMsg.show('是否发布全部任务给采购员？')
        //   return
        // }
        // let res = await API.Supply.purchaseTaskPublish({ids: selectArr})
        // this.$toast.show(res.message)
        // this.$loading.hide()
        // if (res.error === this.$ERR_OK) {
        //   this.getPurchaseTaskList({
        //     time: this.time,
        //     startTime: this.startTime,
        //     endTime: this.endTime,
        //     keyword: this.keyword,
        //     status: this.status,
        //     page: this.page,
        //     supplyId: this.supplyId,
        //     loading: false
        //   })
        // }
        // await this._statistic()
      },
      async _exportDeliveryOrder() {
        if (this.status !== 2) return
        let selectArr = []
        this.purchaseTaskList.forEach((item) => {
          if (item.select) {
            selectArr.push(item)
          }
        })
        if (this.purchaseTaskList.length === 0) {
          this.$toast.show('暂无任务可生成')
          return
        }
        if (!selectArr.length) {
          let res = await API.Supply.getDiffSupplier({
            keyword: this.keyword,
            start_time: this.startTime ? this.startTime + ' ' + this.timeStart : '',
            end_time: this.endTime ? this.endTime + ' ' + this.timeEnd : '',
            supplier_id: this.supplyId
          })
          if (res.error !== this.$ERR_OK) {
            this.oneBtn = true
            this.$refs.confirmMsg.show(res.message)
            return
          }
          this.oneBtn = false
          this.confirmType = 2
          this.$refs.confirmMsg.show('是否将全部任务生成采购单？')
          return
        }
        let isMoreSupplier = false
        let isMoreId = selectArr[0].supplier_id
        selectArr.forEach((item) => {
          if (item.supplier_id !== isMoreId) {
            isMoreSupplier = true
          }
        })
        if (isMoreSupplier) {
          this.oneBtn = true
          this.$refs.confirmMsg.show('存在不同供应商，无法生成采购单！')
          return
        }
        this.setTaskList(selectArr)
        this.$router.push('/home/procurement-task/edit-task')
      },
      async _getMoreList(page) {
        if (this.page === page) {
          return
        }
        this.page = page
        await this.getPurchaseTaskList({
          time: this.time,
          startTime: this.startTime ? this.startTime + ' ' + this.timeStart : '',
          endTime: this.endTime ? this.endTime + ' ' + this.timeEnd : '',
          keyword: this.keyword,
          status: this.status,
          page: this.page,
          supplyId: this.supplyId,
          loading: false
        })
      },
      // 获取供应商列表
      async _getSupplierList() {
        let res = await API.Supply.getSupplier({
          keyword: ''
        })
        if (res.error !== this.$ERR_OK) {
          return
        }
        res.data.forEach((item) => {
          item.name = item.supplier_name
        })
        this.supplyTask.data = this.supplyTask.data.concat(res.data)
      },
      async confirmMsg() {
        switch (this.confirmType) {
        case 1:
          let res = await API.Supply.purchaseTaskPublish({
            time: this.time,
            start_time: this.startTime ? this.startTime + ' ' + this.timeStart : '',
            end_time: this.endTime ? this.endTime + ' ' + this.timeEnd : '',
            keyword: this.keyword,
            status: this.status,
            page: this.page,
            supplier_id: this.supplyId,
            loading: false,
            ids: []
          })
          this.$toast.show(res.message)
          this.$loading.hide()
          if (res.error === this.$ERR_OK) {
            this.getPurchaseTaskList({
              time: this.time,
              startTime: this.startTime ? this.startTime + ' ' + this.timeStart : '',
              endTime: this.endTime ? this.endTime + ' ' + this.timeEnd : '',
              keyword: this.keyword,
              status: this.status,
              page: this.page,
              supplyId: this.supplyId,
              loading: false
            })
          }
          await this._statistic()
          break
        case 2:
          let supplyRes = await API.Supply.purchaseTask({
            time: this.time,
            start_time: this.startTime ? this.startTime + ' ' + this.timeStart : '',
            end_time: this.endTime ? this.endTime + ' ' + this.timeEnd : '',
            keyword: this.keyword,
            status: this.status,
            page: this.page,
            supplier_id: this.supplyId,
            loading: false
          })
          this.$loading.hide()
          if (supplyRes.error !== this.$ERR_OK) {
            this.$toast.show(supplyRes.message)
            return
          }
          this.setTaskList(supplyRes.data)
          this.$router.push('/home/procurement-task/edit-task')
          break
        }
      },
      async _statistic() {
        let res = await API.Supply.getTaskStatusNumber({
          start_time: this.startTime ? this.startTime + ' ' + this.timeStart : '',
          end_time: this.endTime ? this.endTime + ' ' + this.timeEnd : '',
          keyword: this.keyword,
          supplier_id: this.supplyId
        })
        this.statistic = res.error === this.$ERR_OK ? res.data : {}
        for (let key in this.statistic) {
          let index = this.dispatchSelect.findIndex((item) => item.key === key)
          this.dispatchSelect[index].num = this.statistic[key]
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .pro-select-icon
    border-radius: 2px
    border: 1px solid $color-line
    height: 14px
    width: 14px
    margin-right: 18px
    background: $color-white
    transition: all 0.3s

  .pro-select-icon-disable
    cursor: not-allowed
    background: #eee
    border: 1px solid #e9ecee

  .pro-select-icon-active
    border: 1px solid transparent

  /* icon-image('icon-check') */

  .procurement-task
    .down-content
      .down-item
        margin-right:20px
        &.down-group-item
          margin-right:10px
    .list-box
      .list-item
        padding-right: 14px

        &:last-child
          max-width: 60px
          padding: 0

        &:nth-child(8), &:nth-child(2)
          flex: 1.5

  .list-item-progress
    display: flex
    align-items: flex-end

    .progress-content
      .progress-num
        font-size: $font-size-10
        color: $color-text-main
        line-height: 1
        margin-bottom: 5px
        font-family: $font-family-regular

      .progress-bar
        margin: 0
        width: 100px
        height: 5px
        border-radius: 3px
        background: #EBEBEB
        position: relative

        .progress-bar-active
          height: 100%
          position: absolute
          top: 0
          left: 0
          border-radius: 3px
          background: $color-main
          max-width: 100%

    .progress-percentage
      margin-left: 8px
      line-height: 1
      font-size: $font-size-14

  .default-input
    padding: 0 20px 30px
    background: #fff
    width: 534px
    border-radius: 2px
    height: 302px
    box-sizing: border-box

    .main-input-tip
      line-height: 1
      font-size: $font-size-14
      color: #ACACAC
      position: absolute
      bottom: 100px
      left: 104px

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

    /*icon-image('icon-close')*/

    .main-input
      box-sizing: border-box
      padding: 10px 6px 0

      .main-input-item
        display: flex

        .text
          line-height: 44px
          color: #151515
          font-size: $font-size-14
          font-family: $font-family-regular
          position: relative
          margin-bottom: 20px
          width: 56px
          margin-right: 20px

          &:after
            content: '*'
            left: -7px
            position: absolute
            margin-right: -2px
            color: #F52424

      .main-input-big
        display: flex

        .main-input-unit
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
        padding: 0 11px
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
          display: inline-block
          width: 92px
          border-radius: 12px
          height: 24px
          background: #F5F7FA
          line-height: 24px
          padding-left: 12px
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
            right: 15px
            top: 8px
            width: 2px
            height: 8px
            background: #ACACAC
            transition: all 0.3s

          &:before
            content: ''
            position: absolute
            right: 12px
            top: 11px
            width: 8px
            height: 2px
            background: #ACACAC
            transition: all 0.3s


        .main-goods
          display: flex
          flex: 1
          justify-content: space-between
          align-items: center

          .main-close
            width: 16px
            height: 16px
            border-radius: 50%
            /*icon-image('icon-close_content1')*/
            transition: all 0.2s

    /*&:hover
    icon-image('icon-close_content2')*/


  //  单选框
  .select-icon
    width: 16px
    height: 16px
    border-radius: 50%
    background: $color-white
    border: 1px solid $color-line
    transition: all, 0.3s
    position: relative
    transform-origin: 50%
    margin-right: 20px

    .after
      all-center()
      transform-origin: 50%
      transition: all, 0.3s
      width: 0
      height: 0
      border-radius: 50%

  .select-icon-active
    border: 5px solid $color-main
</style>
