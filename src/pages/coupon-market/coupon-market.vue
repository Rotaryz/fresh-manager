<template>
  <div class="coupon-market table">
    <div class="down-content">
      <span class="down-tip">平台发放 </span>
      <div class="down-item">
        <div v-for="(item, index) in topBtn" :key="index" class="top-btn" @click="newMarket(index)">{{item}}<span class="icon"></span></div>
      </div>
      <span class="down-tip">团长发放</span>
      <div class="down-item">
        <div class="top-btn" @click="newMarket(3)">社群福利券<span class="icon"></span></div>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-marketing_list@2x.png" class="identification-icon">
          <p class="identification-name">营销列表</p>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in marketTitle" :key="index" class="list-item" :style="{flex: item.flex}">{{item.name}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in marketList" :key="index" class="list-content list-box">
            <div v-for="(val, ind) in marketTitle" :key="ind" :style="{flex: val.flex}" class="list-item">
              <div v-if="+val.type === 1" :style="{flex: val.flex}" class="item">
                {{item[val.value] || '---'}}
              </div>
              <div v-if="+val.type === 4" :style="{flex: val.flex}" class="item">
                {{item[val.value] || 0}}
              </div>
              <div v-if="+val.type === 2" :style="{flex: val.flex}" class="item">
                {{type[item[val.value]]}}
              </div>
              <!--状态-->
              <div v-if="+val.type === 3" class="list-item-btn" @click="switchBtn(item, index)">
                <base-switch :status="item.status" confirmText="开启" cancelText="关闭"></base-switch>
              </div>
              <div v-if="+val.type === 5" :style="{flex: val.flex}" class="list-operation-box item">
                <router-link tag="span" :to="'new-market?id=' + item.id + '&index=' + (item.type -1)" append class="list-operation">查看</router-link>
                <span class="list-operation" @click="_deleteMarket(item)">删除</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pages" :pageDetail="pageDetail" @addPage="addPage"></base-pagination>
      </div>
    </div>
    <market-confirm ref="confirm" @confirm="_sureConfirm"></market-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import MarketConfirm from './market-confirm/market-confirm'
  import {marketComputed, marketMethods} from '@state/helpers'
  import API from '@api'

  const PAGE_NAME = 'COUPON_MARKET'
  const TITLE = '营销计划'
  const MARKET_TITLE = [
    {name: '营销名称', flex: 1.6, value: 'title', type: 1},
    {name: '类型', flex: 1, value: 'type', type: 2},
    {name: '领取数', flex: 1, value: 'take_count', type: 4},
    {name: '状态', flex: 1, value: 'status', type: 3},
    {name: '操作', flex: 1, value: '', type: 5}
  ]
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      MarketConfirm
    },
    data() {
      return {
        marketTitle: MARKET_TITLE,
        topBtn: ['新客有礼', '复购有礼', '唤醒流失客户'],
        type: ['未知', '新客有礼', '复购有礼', '唤醒流失客户', '社群福利券'],
        page: 1,
        delId: 0
      }
    },
    computed: {
      ...marketComputed
    },
    created() {
    },
    mounted() {
    },
    methods: {
      ...marketMethods,
      newMarket(index) {
        this.$router.push(`/home/coupon-market/new-market?index=${index}`)
      },
      addPage(page) {
        this.page = page
        this.getMarketList({page: this.page})
      },
      switchBtn(item, index) {
        let data = {
          status: item.status ? 0 : 1,
          id: item.id
        }
        API.Market.switchMarket(data)
          .then(res => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            this.getMarketList({page: this.page})
          })
      },
      _deleteMarket(item) {
        this.delId = item.id
        this.$refs.confirm.show(`删除${item.title || ''}营销计划`)
      },
      async _sureConfirm() {
        let res = await API.Market.deleteMarket(this.delId)
        if (res.error !== this.$ERR_OK) {
          this.$toast.show(res.message)
          return
        }
        this.$toast.show('删除成功')
        this.getMarketList({page: this.page})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .list-box
    flex: 1
    .list-item
      font-size: $font-size-14
      &:last-child
        padding-right: 0
        max-width: 75px
      .item
        text-overflow: ellipsis
        overflow: hidden
        white-space: nowrap
        font-size: 14px
  .btn-main
    margin-right: 10px
  .list-item
    font-size: $font-size-14
    .item
      text-overflow: ellipsis
      overflow: hidden
      white-space: nowrap
      font-size: 14px
  .down-tip
    font-family: $font-family-regular
  .down-item
    .top-btn
      height: 30px
      line-height: 30px
      padding: 0 10px
      border-radius: 1px
      display: flex
      justify-content: center
      align-items: center
      border-width: 1px
      border-style: solid
      border-color: #E6EAED
      background: #FFF
      margin-right: 10px
      font-family: $font-family-regular
      cursor: pointer
      transition: all 0.3s
      &:last-child
        margin-right: 0
      &:hover
        color: #FFF
        border-color: $color-main
        background: $color-main
        .icon
          icon-image(icon-new_built2)
      .icon
        width: 16px
        height: 16px
        margin-left: 5px
        icon-image(icon-new_built)
        transition: all 0.3s
    .select-btn
      border: 1px solid $color-main
      background: $color-main
      color: $color-white
      .icon
        icon-image(icon-new_built2)
</style>
