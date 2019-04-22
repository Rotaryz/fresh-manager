<template>
  <div class="flash-sale table">
    <div class="down-content">
      <span class="down-tip">活动时间</span>
      <div class="down-item">
        <base-date-select placeHolder="选择日期" @getTime="_setTime"></base-date-select>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-today_rob@2x.png" class="identification-icon">
          <p class="identification-name">限时抢购</p>
          <base-status-tab :statusList="statusTab" @setStatus="changeStatus"></base-status-tab>
        </div>
        <div class="function-btn">
          <router-link tag="div" to="new-sale" append class="btn-main">新建活动<span class="add-icon"></span></router-link>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in saleTitle" :key="index" class="list-item" :style="{flex: item.flex}">{{item.name}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in saleList" :key="index" class="list-content list-box">
            <div v-for="(val, ind) in saleTitle" :key="ind" :style="{flex: val.flex}" class="list-item">
              <div v-if="+val.type === 1 || +val.type === 3" :style="{flex: val.flex}" class="item">
                {{+val.type === 3 ? '¥' : ''}}{{item[val.value] || '0'}}
              </div>
              <div v-if="+val.type === 2" :style="{flex: val.flex}" class="list-double-row item">
                <p class="item-dark">{{item.start_at}}</p>
                <p class="item-sub">{{item.end_at}}</p>
              </div>

              <!--状态-->
              <div v-if="+val.type === 4" :style="{flex: val.flex}" class="status-item item" :class="item.status === 1 ? 'status-success' : item.status === 2 ? 'status-fail' : ''">{{item.status === 0 ? '未开始' : item.status === 1 ? '进行中' : item.status === 2 ? '已结束' : ''}}</div>

              <div v-if="+val.type === 5" :style="{flex: val.flex}" class="list-operation-box item">
                <router-link tag="span" :to="'new-sale?id=' + (item.id || 0)" append class="list-operation">查看</router-link>
                <span class="list-operation" @click="_deleteActivity(item.id)">删除</span>
                <span class="list-operation" @click="_deleteActivity(item.id)">复制活动</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pages" :pageDetail="salePage" @addPage="addPage"></base-pagination>
      </div>
    </div>
    <default-confirm ref="confirm" @confirm="_sureConfirm"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import {saleComputed, saleMethods} from '@state/helpers'
  import API from '@api'

  const PAGE_NAME = 'FLASH_SALE'
  const TITLE = '限时抢购'
  const SALE_TITLE = [
    {name: '活动名称', flex: 1.2, value: 'activity_name', type: 1},
    {name: '活动时间', flex: 1.2, value: 'start_at', type: 2},
    {name: '商品', flex: 1.4, value: 'goods_count', type: 1},
    {name: '销量', flex: 1, value: 'sale_count', type: 1},
    {name: '交易额(元)', flex: 1, value: 'pay_amount', type: 3},
    {name: '状态', flex: 1, value: 'status', type: 4},
    {name: '操作', flex: 1, value: '', type: 5}
  ]
  // const SALE_LIST = [
  //   {name: '名称', start_at: '2019-03-01', end_at: '2019-03-05', pay_num: 20, pay_amount: 100, status: 1}
  // ]
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultConfirm
    },
    data() {
      return {
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
        delId: 0
      }
    },
    computed: {
      ...saleComputed
    },
    created() {},
    mounted() {},
    methods: {
      ...saleMethods,
      changeStatus(selectStatus) {
        console.log(selectStatus)
        this.$refs.page.beginPage()
      },
      async _setTime(arr) {
        this.$refs.pages.beginPage()
        this.page = 1
        this.startTime = arr[0]
        this.endTime = arr[1]
        await this.getSaleList({page: this.page, startTime: this.startTime, endTime: this.endTime})
      },
      addPage(page) {
        this.page = page
        this.getSaleList({page: this.page, startTime: this.startTime, endTime: this.endTime})
      },
      _deleteActivity(id) {
        this.delId = id
        this.$refs.confirm.show('确定删除该活动？')
      },
      async _sureConfirm() {
        let res = await API.Sale.saleDelete(this.delId)

        if (res.error !== this.$ERR_OK) {
          this.$toast.show(res.message)
          return
        } else {
          this.$toast.show('删除成功')
        }
        this.getSaleList({page: this.page, startTime: this.startTime, endTime: this.endTime})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .list-box
    .list-item:last-child
      max-width: 150px
      padding-right: 0
  .list
    flex: 1
    .list-item
      font-size: $font-size-14
      &:last-child
        max-width: 150px
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

  .btn-main
    margin-right: 10px
</style>
