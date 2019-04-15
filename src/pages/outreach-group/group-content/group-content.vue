<template>
  <div class="group-content">
    <header class="header">
      <div v-for="(item, index) in topItem" :key="index" class="top-item">
        <img class="img" :src="require('./'+ item.icon +'@2x.png')" alt="">
        <span class="name">{{item.name}}</span>
        <span class="num">{{item.icon === 'icon-deal' ? '¥' : ''}}{{teamData[item.value] || 0}}</span>
      </div>
    </header>
    <div class="big-list">
      <div class="list-header list-box">
        <div v-for="(item,index) in activityTitle" :key="index" class="list-item" :style="{flex: item.flex}">{{item.name}}</div>
      </div>
      <div class="list">
        <div v-for="(item, index) in staffList" :key="index" class="list-content list-box">
          <div v-for="(val, ind) in activityTitle" :key="ind" :style="{flex: val.flex}" class="list-item" :class="{'list-about':val.type === 4}">
            <div v-if="+val.type === 1" :style="{flex: val.flex}" class="item">
              {{val.value === 'pay_amount' ? '¥' : ''}}{{(val.value === 'pay_num' || val.value === 'pay_amount') ? (item[val.value] || '0') : (item[val.value] || '---')}}
            </div>
            <div v-if="+val.type === 2" :style="{flex: val.flex}" class="list-double-row item">
              <p class="item-dark">{{item.start_at}}</p>
              <p class="item-sub-time">{{item.end_at}}</p>
            </div>
            <div v-if="+val.type === 6" :style="{flex: val.flex}" class="list-item-double">
              {{(val.value === 'pay_num' || val.value === 'pay_amount') ? (item[val.value] || '0') : (item[val.value] || '---')}}
            </div>
            <!--状态-->
            <div v-if="+val.type === 3" :style="{flex: val.flex}" class="item">{{item.status === 0 ? '未开始' : item.status === 1 ? '进行中' : item.status === 2 ? '已结束' : ''}}</div>
            <!--复购率-->
            <div v-if="+val.type === 4" :style="{flex: val.flex}" class="tip-box">
              <div class="tip-main" @mouseenter="showTip(index)" @mouseleave="hideTip">
                {{item[val.value] || '0%'}}
                <!--                <transition name="fade">-->
                <!--                  <div v-if="tipShow === index" class="tip-content">-->
                <!--                    <span class="text">比昨天上升2%</span>-->
                <!--                    <img v-if="false" :src="require('./'+ iconArr[0] +'@2x.png')" alt="" class="tip-icon">-->
                <!--                    <img v-if="true" :src="require('./'+ iconArr[1] +'@2x.png')" alt="" class="tip-icon down">-->
                <!--                    <img v-if="false" :src="require('./'+ iconArr[2] +'@2x.png')" alt="" class="tip-icon equal">-->
                <!--                  </div>-->
                <!--                </transition>-->
              </div>
            </div>

            <div v-if="+val.type === 5" :style="{flex: val.flex}" class="list-operation-box item">
              <router-link tag="a" :to="'/home/outreach-group/outreach-group-staff?id=' + (item.id || 0)" class="list-operation">详情</router-link>
              <!--              <router-link tag="span" :to="'/home/outreach-activity/outreach-activity-staff?id=' + (item.id || 0)" class="list-operation">编辑</router-link>-->
              <p class="list-operation" @click="handleEditor(item)">编辑</p>
              <span class="list-operation" @click="_deleteActivity(item.id)">删除</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pagination-box">
      <base-pagination ref="pages" :pageDetail="pageDetail" @addPage="addPage"></base-pagination>
    </div>
    <default-confirm ref="confirm" @confirm="_sureConfirm"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import {outreachGroupComputed, outreachGroupMethods} from '@state/helpers'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import API from '@api'

  const COMPONENT_NAME = 'GROUP_CONTENT'
  const TOP_ITEM = [
    {name: '订单', icon: 'icon-order', value: 'order_counts'},
    {name: '交易额', icon: 'icon-deal', value: 'total_sum'},
    {name: '复购率', icon: 'icon-repeat', value: 'repurchase_rate'}
  ]
  const ICON = ['icon-rising', 'icon-up_hover', 'icon-flat']
  const ACTIVITI_TITLE = [
    {name: '姓名', flex: 1.2, value: 'name', type: 6},
    {name: '手机号', flex: 1.2, value: 'mobile', type: 6},
    {name: '所属团队', flex: 1.2, value: 'department_name', type: 1},
    {name: '订单', flex: 1, value: 'order_counts', type: 1},
    {name: '交易额(元)', flex: 1, value: 'total_sum', type: 1},
    {name: '复购率', flex: 1, value: 'rate', type: 4},
    // {name: '状态', flex: 1, value: 'status', type: 3},
    // {name: '二维码', flex: 1, value: '', type: 4},
    {name: '操作', flex: 1, value: '', type: 5}
  ]
  export default {
    name: COMPONENT_NAME,
    components: {
      DefaultConfirm
    },
    data() {
      return {
        activityTitle: ACTIVITI_TITLE,
        iconArr: ICON,
        topItem: TOP_ITEM,
        status: 0,
        tipShow: '',
        qrUrl: process.env.VUE_APP_API
      }
    },
    computed: {
      ...outreachGroupComputed
    },
    beforeDestroy() {
      this.restPage()
    },
    methods: {
      ...outreachGroupMethods,
      showTip(index) {
        clearTimeout(this.timer)
        this.tipShow = index
      },
      hideTip() {
        this.timer = setTimeout(() => {
          this.tipShow = ''
        }, 500)
      },
      addPage(page) {
        this.setPage(page)
        this.reqStaffList({page})
      },
      handleEditor(item) {
        this.setCurrentStaff(item)
        this.handleModal({
          ...item,
          isShow: true,
          title: '编辑成员',
          useType: 'editorStaff',
          modalType: 'addStaff',
          groupList: this.groupList
        })
      },
      _deleteActivity(id) {
        this.delId = id
        this.$refs.confirm.show('确定删除该成员？')
      },
      async _sureConfirm() {
        try {
          let res = await API.OutreachGroup.deleteStaff({id: this.delId})
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
          } else {
            this.reqStaffList()
            this.$toast.show('删除成功')
          }
        } catch (e) {
        } finally {
          this.$loading.hide()
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .group-content
    flex: 1
    padding :0 19px
    layout(column,block,nowrap)
    .header
      height :68px
      display :flex
      align-items :center
      .top-item
        display: flex
        align-items: center
      .img
        height: 12px
        object-fit: cover
      .name
        font-size: $font-size-12
        font-family: $font-family-regular
        color: $color-text-main
        margin-left: 5px
        line-height: 14px
      .num
        font-size: $font-size-16
        color: #FF8282
        line-height: 16px
        font-family: $font-family-din-bold
        margin-left: 8px
        margin-right: 88px

  .list
    flex: 1
    .list-item
      font-size: $font-size-14
      .item
        text-overflow: ellipsis
        overflow: hidden
        white-space: nowrap
        font-size: 14px
      .tip-box
        display: flex
        align-items: center
        .tip-main
          position: relative
          margin-left: -15px
          padding-left: 15px
          height: 16px

      .tip-content
        position: absolute
        right: -125px
        top: -6px
        width: 116px
        height: 32px
        border-radius: 4px
        padding-left: 10px
        box-shadow: 0 0 8px 0 #E9ECEE
        border: 1px solid #E9ECEE
        background: rgba(50,50,50,0.8)
        z-index: 1
        display: flex
        align-items: center
        &:before
          content: ""
          width: 9px
          height: 10px
          border: 5px solid rgba(50,50,50,0.8)
          border-top: 4px solid transparent
          border-bottom: 5px solid transparent
          border-left: 4px solid transparent
          col-center()
          left: -9px
        .text
          font-size: $font-size-12
          color: #FFF
          font-family: $font-family-regular
          line-height: 32px
          height: 32px
        .tip-icon
          width: 8px
          height: 10px
          margin-left: 5px
        .down
          transform: rotate(180deg)
        .equal
          width: 8px
          height: 2px
    .list-content .list-about
      overflow: inherit


  .list-box
    .list-item
      box-sizing: border-box
      flex: 1
      &:last-child
        padding: 0
        max-width: 122px
</style>
