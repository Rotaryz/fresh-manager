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
          <div v-for="(item,index) in preferenceTitle" :key="index" class="list-item" :style="{flex: item.flex}">{{item.name}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in preferenceList" :key="index" class="list-content list-box">
            <div v-for="(val, ind) in preferenceTitle" :key="ind" :style="{flex: val.flex}" class="list-item">
              <div v-if="+val.type === 1 || +val.type === 2" :style="{flex: val.flex}" class="item">
                {{+val.type === 2 ? '¥' : ''}}{{item[val.value] || '0'}}
              </div>
              <img v-if="+val.type === 3" :src="item.goods_cover_image" alt="" class="img">
              <div v-if="+val.type === 4" :style="{flex: val.flex}" class="list-operation-box item">
                <span class="list-operation" @click="_deleteActivity(item.activity_id)">删除</span>
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
  import {activityComputed, activityMethods} from '@state/helpers'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import API from '@api'

  const PREFERENCE_TITLE = [
    {name: '商品图片', flex: 1, value: 'goods_cover_image', type: 3},
    {name: '商品名称', flex: 1.3, value: 'name', type: 1},
    {name: '商品编码', flex: 1.4, value: 'goods_sku_encoding', type: 1},
    {name: '商品分类', flex: 1, value: 'goods_category_name', type: 1},
    {name: '基本单位', flex: 1, value: 'base_unit', type: 1},
    {name: '销售规格', flex: 1, value: 'base_sale_rate', type: 1},
    {name: '销售单价', flex: 1, value: 'trade_price', type: 2},
    {name: '销售库存', flex: 1, value: 'goods_usable_stock', type: 1},
    {name: '活动库存', flex: 1, value: 'usable_stock', type: 1},
    {name: '操作', flex: 1, value: '', type: 4}
  ]
  export default {
    components: {
      DefaultConfirm
    },
    data() {
      return {
        preferenceTitle: PREFERENCE_TITLE,
        startTime: '',
        endTime: '',
        page: 1,
        delId: 0,
      }
    },
    computed: {
      ...activityComputed,
    },
    created() {
      this.getPreferenceList()
    },
    methods: {
      ...activityMethods,
      _deleteActivity(id) {
        this.delId = id
        this.$refs.confirm.show('确定删除该商品？')
      },
      async _sureConfirm() {
        let res = await API.Activity.delPreference({ids: [this.delId]})

        if (res.error !== this.$ERR_OK) {
          this.$toast.show(res.message)
          return
        } else {
          this.$toast.show('删除成功')
        }
        this.getPreferenceList()
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
      .img
        width: 40px
        height: 40px
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
