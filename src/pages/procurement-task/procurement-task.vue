<template>
  <div class="procurement-task table">
    <div class="down-content">
      <!--时间选择-->
      <span class="down-tip">生成时间</span>
      <div class="down-item">
        <base-date-select placeHolder="请选择时间" @getTime="changeStartTime"></base-date-select>
      </div>
      <!--下拉选择-->
      <span class="down-tip">供应商</span>
      <div class="down-item">
        <base-drop-down :select="supplyTask" @setValue="_setValue"></base-drop-down>
      </div>
      <!--搜索-->
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="商品名称搜索" @search="_search"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-purchase_list@2x.png" class="identification-icon">
          <p class="identification-name">采购任务列表</p>
          <base-status-tab :statusList="dispatchSelect" :infoTabIndex="statusTab" @setStatus="_setStatus"></base-status-tab>
        </div>
        <div class="function-btn">
          <div class="btn-main" :class="{'btn-disable-store': status !== 1}" @click="_sendPublish">发布给采购员</div>
          <div class="btn-main g-btn-item" :class="{'btn-disable-store': status !== 2}" @click="_createNewPublish">生成采购单</div>
          <div class="btn-main g-btn-item" @click="_addTask">新建采购任务<span class="add-icon"></span></div>
          <a :href="downUrl" class="btn-main g-btn-item" target="_blank">导出</a>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box list-box-goods">
          <!--<div class="pro-select-icon hand" :class="{'pro-select-icon-active': select, 'pro-select-icon-disable': status !== 1 && status !== 2}" @click="selectPurchase({type: 'all', status: status})"></div>-->
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-if="purchaseTaskList.length">
            <div v-for="(item, index) in purchaseTaskList" :key="index" class="list-content list-box list-box-goods">
              <!--<div class="pro-select-icon hand" :class="{'pro-select-icon-active': item.select, 'pro-select-icon-disable': item.status !== 1 && item.status !== 2, 'pro-select-icon-disable': status !== 1 && status !== 2}" @click="selectPurchase({type: index, status: status})"></div>-->
              <div class="list-item list-double-row">
                <div class="item-dark">{{item.goods_name}}</div>
                <div class="item-dark">{{item.goods_sku_encoding}}</div>
              </div>
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
          <base-blank v-else></base-blank>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pages" :pageDetail="pageTotal" @addPage="_getMoreList"></base-pagination>
      </div>
    </div>
    <default-modal ref="modal">
      <div slot="content" class="default-input">
        <div class="title-box">
          <div class="title">
            新建采购任务
          </div>
          <span class="close hand" @click="cancel"></span>
        </div>
        <div class="main-input">
          <div class="main-input-item">
            <div class="text">采购商品</div>
            <div class="main-input-box">
              <div v-if="goodsItem.goods_sku_code" class="main-goods">
                <span>{{goodsItem.goods_name}}</span>
                <span class="main-close hand" @click="delGoods"></span>
              </div>
              <span v-else class="main-input-box-add hand" @click="_showGoods">点击添加</span>
            </div>
          </div>
          <div class="main-input-item">
            <div class="text">采购量</div>
            <div class="main-input-big">
              <input v-model="taskNum" type="number" class="main-input-box" placeholder="请输入采购数量">
              <span v-if="goodsItem.purchase_unit" class="main-input-unit">{{goodsItem.purchase_unit}}</span>
            </div>
          </div>
        </div>
        <!--<p class="main-input-tip">生成采购任务时，将加上商品损耗比</p>-->
        <div class="btn-group">
          <div class="btn cancel" @click="cancel">取消</div>
          <div class="btn confirm" @click="confirm">确定</div>
        </div>
      </div>
    </default-modal>
    <!--商品弹窗-->
    <default-modal ref="goods">
      <div slot="content" class="shade-box">
        <div class="title-box">
          <div class="title">
            选择商品
          </div>
          <span class="close hand" @click="_hideGoods"></span>
        </div>
        <!--<div class="shade-header">-->
        <!--<div class="shade-title">选择商品</div>-->
        <!--<span class="close hand" @click="_hideGoods"></span>-->
        <!--</div>-->
        <!--商品详情-->
        <div>
          <div class="shade-tab">
            <div class="tab-item">
              <base-drop-down :width="218" :select="assortment" @setValue="_secondAssortment"></base-drop-down>
            </div>
            <div class="tab-item">
              <base-drop-down :width="140" :select="secondAssortment" @setValue="_choessSecondAssortment"></base-drop-down>
            </div>
            <div class="tab-item">
              <base-search placeHolder="请输入商品名称" @search="_searchGoods"></base-search>
            </div>
          </div>
          <div class="goods-content">
            <div class="goods-list" :class="{'goods-list-border':choiceGoods.length}">
              <div v-for="(item, index) in choiceGoods" :key="index" class="goods-item">
                <div class="select-icon hand" :class="{'select-icon-active': showSelectIndex === index}" @click="_selectGoods(item, index)">
                  <span class="after"></span>
                </div>
                <div class="goods-img" :style="{'background-image': 'url(' +item.goods_cover_image+ ')'}"></div>
                <div class="goods-msg">
                  <div class="goods-name">{{item.goods_name}}</div>
                  <div class="goods-money">{{item.goods_sku_code}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="page-box">
            <base-pagination ref="goodsPage" :pageDetail="goodsPage" @addPage="_getMoreGoods"></base-pagination>
          </div>
        </div>
        <div class="back back-box">
          <div class="back-cancel back-btn hand" @click="_hideGoods">取消</div>
          <div class="back-btn back-submit hand" @click="_miniGoods">确定</div>
        </div>
      </div>
    </default-modal>
    <default-modal ref="selectSupplier">
      <div slot="content" class="supplier-box">
        <div class="title-box">
          <div class="title">
            选择供应商
          </div>
          <span class="close hand" @click="supplierCancel"></span>
        </div>
        <div class="supplier-sub">请选择供应商，生成对应采购单</div>
        <div class="big-list">
          <div class="list-header list-box-supplier list-box">
            <div v-for="(item,index) in supplierList" :key="index" class="list-item">{{item}}</div>
          </div>
          <div class="list">
            <div v-for="(item, index) in supplierSortList" :key="index" class="list-content list-box-supplier list-box">
              <div class="list-item">{{item.supplier_name}}</div>
              <div class="list-item">{{item.task_count}}</div>
              <div class="list-item">
                <div class="btn-main" @click="jumpTaskList(item)">生成采购单</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </default-modal>
    <default-confirm ref="confirmMsg" :oneBtn="oneBtn" @confirm="confirmMsg"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import {proTaskComputed, proTaskMethods} from '@state/helpers'
  import API from '@api'
  import _ from 'lodash'

  const PAGE_NAME = 'PROCUREMENT_TASK'
  const TITLE = '采购任务'
  const COMMODITIES_LIST = ['商品', '分类', '供应商', '采购员', '计划采购', '已采购', '采购进度', '发布时间', '状态']
  const SUPPLIER_LIST = ['供应商', '采购任务数', '操作']
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultModal,
      DefaultConfirm
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        supplierList: SUPPLIER_LIST,
        page: 1,
        startTime: '',
        endTime: '',
        keyword: '',
        time: '',
        status: '',
        supplyId: '',
        selectList: [],
        dispatchSelect: [
          {name: '全部', value: '', key: 'all', num: 0},
          {name: '锁定中', value: 1, key: 'wait_release', num: 0},
          {name: '待发布', value: 1, key: 'wait_release', num: 0},
          {name: '待采购', value: 2, key: 'wait_purchase', num: 0},
          {name: '已完成', value: 3, key: 'success', num: 0}
        ],
        supplyTask: {
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
        statusTab: 2,
        downUrl: '',
        taskTime: ['', ''],
        supplierSortList: []
      }
    },
    computed: {
      ...proTaskComputed
    },
    async created() {
      this._getUrl()
      this.startTime = this.$route.params.start
      this.endTime = this.$route.params.end
      if (this.$route.query.status) {
        this.statusTab = this.$route.query.status * 1 + 1
        this.status = this.$route.query.status
      }
      this.status = this.$route.params.status
      if (this.goBackNumber > 0) {
        this.statusTab = 3
        this.status = 2
        this._createNewPublish()
      }
      await this._getFirstAssortment()
      await this._getGoodsList()
      await this._getSupplierList()
      await this._statistic()
    },
    mounted() {
    },
    methods: {
      ...proTaskMethods,
      // 选择商品
      _selectGoods(item, index) {
        this.showSelectIndex = index
      },
      _getUrl() {
        let currentId = this.getCurrentId()
        let token = this.$storage.get('auth.currentUser', '')
        let params = `access_token=${token.access_token}&start_time=${this.startTime}&end_time=${this.endTime}&status=${this.status}&keyword=${this.keyword}&supplier_id=${this.supplyId}&current_corp=${currentId}`
        this.downUrl = process.env.VUE_APP_SCM_API + `/scm/api/backend/purchase/purchase-task-export?${params}`
      },
      // 获取商品列表
      async _getGoodsList() {
        let res = await API.Store.getGoodsList({
          keyword: this.text,
          goods_category_id: this.parentId,
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
        this.choiceGoods = res.data
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
      cancel() {
        this.goodsItem = {}
        this.taskNum = ''
        this.$refs.modal.hideModal()
      },
      supplierCancel() {
        this.setGoBackNumber(0)
        this.$refs.selectSupplier.hideModal()
      },
      async confirm() {
        if (!this.goodsItem.goods_sku_code) {
          this.$toast.show('请添加商品')
          return
        } else if (!this.taskNum || +this.taskNum <= 0) {
          this.$toast.show('请输入正确的采购数量')
          return
        }
        let res = await API.Supply.storePurchaseTask({
          goods_sku_code: this.goodsItem.goods_sku_code,
          plan_num: this.taskNum
        })
        this.$toast.show(res.message)
        if (res.error !== this.$ERR_OK) {
          return
        }
        // console.log(this.dispatchSelect, this.statusTab)
        // let index = 2
        // this.status = this.dispatchSelect[index].status
        // this.statusTab = 2
        // this.page = 1
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
        this.$forceUpdate()
        await this._statistic()
        this.cancel()
      },
      _addTask() {
        this.taskNum = ''
        this.$refs.modal.showModal()
      },
      async _setStatus(item) {
        this.status = item.status
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
        this._getUrl()
      },
      async _setValue(item) {
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
        this._getUrl()
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
        this._getUrl()
        await this._statistic()
      },
      async changeStartTime(value) {
        this.taskTime = value
        this.page = 1
        this.startTime = value[0]
        this.endTime = value[1]
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
        this._getUrl()
        await this._statistic()
      },
      async _sendPublish() {
        if (this.status !== 1) return
        let selectArr = []
        this.purchaseTaskList.forEach((item) => {
          if (item.select) {
            selectArr.push(item.id)
          }
        })
        if (this.purchaseTaskList.length === 0) {
          this.$toast.show('暂无任务可发布')
          return
        }
        if (!selectArr.length) {
          this.oneBtn = false
          this.confirmType = 1
          this.$refs.confirmMsg.show('是否发布全部任务给采购员？')
          return
        }
        let res = await API.Supply.purchaseTaskPublish({ids: selectArr})
        this.$toast.show(res.message)
        this.$loading.hide()
        if (res.error === this.$ERR_OK) {
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
        }
        await this._statistic()
      },
      async _createPublish() {
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
            start_time: this.startTime,
            end_time: this.endTime,
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
      async _createNewPublish() {
        if (this.status !== 2) return
        let res = await API.Supply.getSortSupplier({
          keyword: this.keyword,
          start_time: this.startTime,
          end_time: this.endTime,
          supplier_id: this.supplyId
        })
        if (res.error !== this.$ERR_OK) {
          this.$toast.show(res.message)
          return
        }
        this.supplierSortList = res.data
        this.$refs.selectSupplier.showModal()
      },
      async jumpTaskList(item) {
        let supplyRes = await API.Supply.purchaseTask({
          time: this.time,
          start_time: this.startTime,
          end_time: this.endTime,
          keyword: this.keyword,
          status: this.status,
          page: this.page,
          supplier_id: item.supplier_id,
          loading: false
        })
        this.$loading.hide()
        if (supplyRes.error !== this.$ERR_OK) {
          this.$toast.show(supplyRes.message)
          return
        }
        this.setGoBackNumber(this.supplierSortList.length)
        this.setTaskList(supplyRes.data)
        this.$router.push('/home/procurement-task/edit-task')
      },
      async _getMoreList(page) {
        if (this.page === page) {
          return
        }
        this.page = page
        await this.getPurchaseTaskList({
          time: this.time,
          startTime: this.startTime,
          endTime: this.endTime,
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
            start_time: this.startTime,
            end_time: this.endTime,
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
              startTime: this.taskTime[0],
              endTime: this.taskTime[1],
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
            start_time: this.startTime,
            end_time: this.endTime,
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
          start_time: this.startTime,
          end_time: this.endTime,
          keyword: this.keyword,
          supplier_id: this.supplyId
        })
        this.statistic = res.error === this.$ERR_OK ? res.data : {}
        let selectData = res.data.map((item) => {
          return {
            name: item.status_str,
            status: item.status,
            num: item.statistic
          }
        })
        this.dispatchSelect = selectData
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
    icon-image('icon-check')

  .procurement-task
    min-width: 1150px
    .list-box-goods
      .list-item
        padding-right: 14px
        &:last-child
          max-width: 60px
          padding: 0
        /*&:nth-child(8), &:nth-child(2)*/
        &:nth-child(7), &:nth-child(1)
          flex: 1.5

  .procurement-task
    .list-box-supplier
      .list-item
        padding-right: 14px
        &:nth-child(3)
          max-width: 90px
          .btn-main
            width: 80px
            min-width: 80px

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
        icon-image('icon-close')
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
            icon-image('icon-close_content1')
            transition: all 0.2s
            &:hover
              icon-image('icon-close_content2')
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

  //  商品弹窗
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
    .shade-tab
      margin-bottom: 20px
      align-items: center
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
        padding: 5px 0
        width: 56px
        text-align: center
      .add-btn-disable
        border-radius: 2px
        margin-left: 88px
        padding: 5px 0
        width: 56px
        box-sizing: border-box
        text-align: center
        font-size: $font-size-14
        line-height: 1
        cursor: not-allowed
        background: $color-line
        color: $color-text-assist
    .page-box
      padding: 0 20px
      box-sizing: border-box
      height: 77px
      align-items: center
      display: flex

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
  .back-box
    background: $color-white
    height: 70px
    border-top-1px($color-line)
    justify-content: flex-end
    position: absolute
    left: 0
    bottom: 0

  // 选择供应商
  .supplier-box
    background: $color-white
    width: 1000px
    min-height: 650px
    border-radius: 3px
    padding: 0 20px
    .title-box
      display: flex
      box-sizing: border-box
      padding: 24px 0 27px
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
    .supplier-sub
      font-family: $font-family-regular
      color: $color-text-main
      font-size: $font-size-14
      padding-bottom: 27px
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
