<template>
  <div class="coupon-used-detail table">
    <div class="content-wrap table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-coupon_list@2x.png" class="identification-icon">
          <p class="identification-name">使用明细</p>
        </div>
      </div>
      <div class="table-content">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item" :style="{flex: item.flex}">{{item.title}}</div>
        </div>
        <div class="list">
          <template v-if="usedList.length">
            <div v-for="(row, key) in usedList" :key="key" class="list-content list-box">
              <div v-for="item in commodities" :key="item.title" :style="{flex: item.flex}" class="list-item">
                <div v-if="item.key" :class="{red:row[item.type]}">
                  {{row[item.key]}}
                </div>
              </div>
            </div>
          </template>
          <base-blank v-else></base-blank>
        </div>
        <div class="pagination-box">
          <base-pagination ref="pagination" :pageDetail="pageDetail" :pagination="page" @addPage="changePage"></base-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'

  const PAGE_NAME = 'COUPON_USED_DETAIL'
  const TITLE = '使用明细'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        commodities: [
          {title: '兑换券别名', key: 'coupon_name', flex: 1.8},
          {title: '客户昵称', key: 'nickname', flex: 1},
          {title: '客户手机', key: 'mobile', flex: 1},
          {title: '使用社区', key: 'social_name', flex: 1},
          {title: '使用时间', key: 'updated_at', flex: 1}
        ],
        usedList: [1, 2],
        pageDetail: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        page: 1,
        id: ''
      }
    },
    created() {
      this.id = this.$route.query.id || ''
      this.getUsedList()
    },
    methods: {
      getUsedList() {
        API.Coupon.getUsedList({is_used: 1, coupon_id: this.id})
          .then(res => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            this.usedList = res.data
          })
      },
      changePage(page) {
        this.page = page
        this.getUsedList()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .coupon-used-detail
    width: 100%
</style>
