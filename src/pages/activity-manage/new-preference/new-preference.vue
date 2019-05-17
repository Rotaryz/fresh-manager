<template>
  <div class="data-content">
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-new_people@2x.png" class="identification-icon">
          <p class="identification-name">新人特惠</p>
          <p class="tip">新人定义：从未在站点成功下过单的用户(不包括拓展活动订单)</p>
        </div>
        <div class="function-btn">
          <router-link tag="div" to="edit-preference" append class="btn-main">编辑活动<span class="add-icon"></span></router-link>
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
                <span class="list-operation" @click="_deleteActivity(item.id)">删除</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--<div class="pagination-box">
        <base-pagination ref="pages" :pageDetail="salePage" @addPage="addPage"></base-pagination>
      </div>-->
    </div>
    <default-confirm ref="confirm" @confirm="_sureConfirm"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import {saleComputed, saleMethods} from '@state/helpers'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import API from '@api'

  const SALE_TITLE = [
    {name: '商品图片', flex: 1, value: 'activity_name', type: 1},
    {name: '商品名称', flex: 1.3, value: 'start_at', type: 2},
    {name: '商品编码', flex: 1.4, value: 'goods_count', type: 1},
    {name: '商品分类', flex: 1, value: 'sale_count', type: 1},
    {name: '基本单位', flex: 1, value: 'pay_amount', type: 3},
    {name: '销售规格', flex: 1, value: 'status', type: 1},
    {name: '销售单价', flex: 1, value: 'status', type: 1},
    {name: '销售库存', flex: 1, value: 'status', type: 1},
    {name: '活动库存', flex: 1, value: 'status', type: 1},
    {name: '操作', flex: 1.4, value: '', type: 5}
  ]
  export default {
    components: {
      DefaultConfirm
    },
    data() {
      return {
        saleTitle: SALE_TITLE,
        startTime: '',
        endTime: '',
        page: 1,
        delId: 0,
      }
    },
    computed: {
      ...saleComputed,
    },
    created() {
    },
    methods: {
      ...saleMethods,
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
        this.getSaleStatus()
        this.getSaleList({
          page: this.page,
          startTime: this.startTime,
          endTime: this.endTime,
          status: this.status,
          loading: false
        })
      }
    }
  }
</script>

<style scoped lang="stylus"  rel="stylesheet/stylus">
  @import "~@design"
  .data-content
    flex: 1
    display: flex
    flex-direction: column
  .identification-page .tip
    font-size: $font-size-14
    margin-left: 10px
    font-family: $font-family-regular
    color: $color-text-assist
  .list-box
    .list-item:last-child
      max-width: 30px
      padding-right: 0
  .list
    flex: 1
    .list-item
      font-size: $font-size-14
      &:last-child
        max-width: 30px
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
    &:hover
      .add-icon
        background-image: url('./icon-edit_activity2@2x.png')
    .add-icon
      width: 9px
      height: 9px
      background-image: url('./icon-edit_activity@2x.png')
      background-repeat: no-repeat
      background-size: 100% 100%
      transition: all 0.3s

      &:before,&:after
        display: none

</style>
