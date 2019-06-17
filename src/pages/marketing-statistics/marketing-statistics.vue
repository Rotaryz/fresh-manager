<template>
  <div class="marketing-statistics table">
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-marketing_list@2x.png" class="identification-icon">
          <p class="identification-name">
            统计邀请排行榜
            <span class="identification-tip">
              (合计邀请成功 {{marketStaPageDetail.total}}人)
            </span>
          </p>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-if="marketStaList.length">
            <div v-for="(item, index) in marketStaList" :key="index" class="list-content list-box list-box-goods">
              <div class="list-item">
                <!---->
                <img :src="item.avatar" class="list-img">
              </div>
              <div class="list-item">{{item.nickname}}</div>
              <div class="list-item">{{item.user_count}}</div>
            </div>
          </div>
          <base-blank v-else></base-blank>
        </div>
        <div class="pagination-box">
          <base-pagination ref="pages" :pageDetail="marketStaPageDetail" @addPage="_getMoreList"></base-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {marketComputed, marketMethods} from '@state/helpers'

  const PAGE_NAME = 'MARKETING_STATISTICS'
  const TITLE = '营销统计、'
  const COMMODITIES_LIST = ['用户头像', '用户名称', '成功邀请用户数']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        people: 102,
        commodities: COMMODITIES_LIST,
        id: this.$route.query.id,
        page: 1
      }
    },
    computed: {
      ...marketComputed
    },
    methods: {
      ...marketMethods,
      _getMoreList(page) {
        this.page = page
        this.getMarketingStatisticsList({id: this.id, page: this.page, loading: false})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .identification-tip
    margin-left: 10px
  .list-box
    .list-item
      font-size: $font-size-14
      &:nth-child(1)
        max-width: 136px
      &:nth-child(2)
        max-width: 260px
  .big-list
    max-height: 765px
</style>
