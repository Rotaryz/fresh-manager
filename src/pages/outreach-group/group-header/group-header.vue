<template>
  <div class="group-header">
    <div class="icon"></div>
    <p class="title">拓展团队</p>
    <div class="function-btn">
      <div v-if="showContent && isLastDepartment" class="btn-main" @click="handleAdd">添加成员<span class="add-icon"></span></div>
    </div>
    <div style="width: 20px"></div>
    <div class="function-btn">
      <div class="btn-main" @click="exportExcel">导出Excel</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {outreachGroupComputed, outreachGroupMethods, outreachGroupDetailComputed} from '@state/helpers'
  const COMPONENT_NAME = 'GROUP_HEADER'

  export default {
    name: COMPONENT_NAME,
    computed: {
      ...outreachGroupComputed,
      ...outreachGroupDetailComputed,
      exportUrl() {
        let currentId = this.getCurrentId()
        let token = this.$storage.get('auth.currentUser', '')
        let data = {
          current_corp: currentId,
          current_shop: process.env.VUE_APP_CURRENT_SHOP,
          access_token: token.access_token,
          page: this.page
        }
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        if (this.showContent) {
          return process.env.VUE_APP_API + '/social-shopping/api/backend/activity-manage/department-offline-members-excel/' + this.current.id + '?' + search.join('&')
        } else {
          return process.env.VUE_APP_API + '/social-shopping/api/backend/activity-manage/member-activity-excel/' + this.staffId + '?' + search.join('&')
        }
      }
    },
    methods: {
      ...outreachGroupMethods,
      handleAdd() {
        this.handleModal({
          isShow: true,
          title: '新建成员',
          useType: 'addStaff',
          modalType: 'addStaff',
          groupList: this.groupList
        })
      },
      exportExcel() {
        // console.log(this.ex)
        window.open(this.exportUrl, '_blank')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .group-header
    height :68px
    padding :0 20px
    layout(row,block,nowrap)
    align-items :center
    justify-content :center
    font-family: $font-family-regular
    font-size: 16px
    color: $color-text-main
    border-bottom: 0.5px solid $color-line
    .icon
      width:17px
      height :12px
      icon-image(icon-team)
    .title
      padding-left :6.5px
      flex: 1
</style>
