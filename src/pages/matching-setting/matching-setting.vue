<template>
  <div class="matching-setting table">
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-setup_list2@2x.png" class="identification-icon">
          <p class="identification-name">配货设置</p>
        </div>
        <div class="function-btn">
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in titleList" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in allocationList" :key="index" class="list-content list-box">
            <div class="list-item list-select-box">
              <span class=" list-select hand" :class="{'list-select-active': item.is_used}" @click="setUse(item)">
                <span class="select-icon"></span>
                <span class="select-item">{{item.is_used ? '当前配货方式' : '设为配货方式'}}</span>
              </span>
            </div>
            <div class="list-item">{{item.name}}</div>
            <div class="list-item">{{item.type_str}}</div>
            <div class="list-item">{{item.sortord_str}}</div>
            <div class="list-item">{{item.describe}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {allocationComputed, allocationMethods} from '@state/helpers'
  import API from '@api'

  const PAGE_NAME = 'MATCHING_SETTING'
  const TITLE = '配货设置'
  const DISPATCHING_LIST = ['', '配货策略名称', '类型', '策略', '说明']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        titleList: DISPATCHING_LIST,
        select: false
      }
    },
    computed: {
      ...allocationComputed
    },
    methods: {
      ...allocationMethods,
      async setUse(item) {
        let res = await API.Allocation.setSiteConfig({allocation_stock_config_id: item.allocation_stock_config_id})
        this.$toast.show(res.message, 2000)
        this.getAllocationList(false)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .identification-icon
    transform: translateY(1px)
  .list-item
    line-height: 20px
    height: 20px
  .list-box
    .list-item
      &:nth-child(2)
        flex: 1.4
      &:last-child
        flex: 1.8
  .list-select-box
    display: flex
    .list-select
      display: flex
      align-items: center
      .select-icon
        display: inline-block
        width: 18px
        height: 18px
        border-radius: 50%
        border-1px($color-line, 50%)
        margin-right: 10px
        transition: all 0.3s
        box-sizing: border-box
        background: $color-white
      .select-item
        color: #888888
    .list-select-active
      .select-icon
        border-none()
        transition: all 0.3s
        icon-image('icon-selected_list')
      .select-item
        color: #4DBD65

</style>
