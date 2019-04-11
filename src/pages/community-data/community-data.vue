<template>
  <div class="community-data">
    <div class="data-caption data-caption-line">
      <div class="content-title">
        <img src="./icon-qundata@2x.png" alt="" class="title-icon">
        <div class="data-title">微信群运营数据概况</div>
      </div>
      <base-option-box @checkTime="_getData"></base-option-box>
    </div>
    <div class="data-content">
      <left-tab :tabArr="tabArr" :name="name" @editGroup="editGroup" @changeCommunity="changeCommunity"></left-tab>
      <div class="right-data">
        <div class="top-sec">
          <section class="data-sec quality-data">
            <div class="sec-title">
              <p class="text">群质量数据<span>(当前等级Lv4)</span></p>
              <p class="right-text hand" @click="showDescription">等级说明 <img class="text-icon" src="./icon-help_lv@2x.png" alt=""></p>
            </div>
            <quality-data :time="msg.time"></quality-data>
          </section>
          <section class="data-sec business-data">
            <div class="sec-title">
              <p class="text">群运营数据</p>
            </div>
            <business-data :time="msg.time"></business-data>
          </section>
        </div>
        <div class="bottom-sec">
          <section class="data-sec group-data">
            <div class="sec-title">
              <p class="text">群用户分组<span>(群总人数500)</span></p>
            </div>
            <group-data :time="msg.time"></group-data>
          </section>
          <section class="data-sec goods-list">
            <div class="sec-title">
              <p class="text">最受欢迎商品Top10</p>
            </div>
            <goods-list></goods-list>
          </section>
        </div>
      </div>
    </div>
    <description-modal ref="description"></description-modal>
    <edit-modal ref="editModal" @confirm="confirm" @cancel="cancel"></edit-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {communityComputed, communityMethods} from '@state/helpers'
  import LeftTab from './left-tab/left-tab'
  import QualityData from './quality-data/quality-data'
  import GoodsList from './goods-list/goods-list'
  import BusinessData from './business-data/business-data'
  import GroupData from './group-data/group-data'
  import EditModal from './edit-modal/edit-modal'
  import DescriptionModal from './description-modal/description-modal'

  const PAGE_NAME = 'COMMUNITY-DATA'
  const TITLE = '社群数据'
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      LeftTab,
      QualityData,
      GoodsList,
      BusinessData,
      GroupData,
      EditModal,
      DescriptionModal
    },
    data() {
      return {
        letTab: 0,
        tabArr: [],
        msg: {
          time: 'today'
        },
        name: '社区A微信群',
        groupId: ''
      }
    },
    computed: {
      ...communityComputed
    },
    created() {

    },

    methods: {
      ...communityMethods,
      _getData(value) {
        if (typeof value === 'string') {
          this.msg.time = value
          // this.getOrderDetail({startTime: '', endTime: '', time: value, loading: true})
          return
        }
        this.msg.startTime = value[0]
        this.msg.endTime = value[1]
        console.log(this.msg)
        // this.getOrderDetail({startTime: value[0], endTime: value[1], time: '', loading: true})
      },
      changeCommunity(item) {
        this.groupId = item.id
      },
      showDescription() {
        this.$refs.description.show()
      },
      editGroup(name) {
        this.$refs.editModal.show({groupName: name})
        // groupAccount帐号  groupName群名  personNumber群人数 id//
      },
      confirm(data) {
        this.name = data.groupName
        this.$refs.editModal.hide()
      },
      cancel() {

      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .community-data
    overflow: hidden
    flex: 1
    display: flex
    box-sizing: border-box
    flex-direction: column
    background: #FFF
    border: 0.5px solid $color-line
  .data-caption
    padding: 20px
    display: flex
    justify-content: space-between
    align-items: center
    box-sizing: border-box
    .content-title
      display: flex
      align-items: center
    .title-icon
      width: 14px
      height: 14px
      margin-right: 5px
    .data-title
      font-family: $font-family-regular
      color: $color-text-main
      font-size: $font-size-16
  .data-caption-line
    border-bottom-1px($color-line)
  .data-content
    display: flex
  .right-data
    margin-left: 20px
    margin-bottom: 20px
    flex: 1
    display: flex
    flex-wrap: wrap
    .top-sec
      width: 100%
      display: flex
    .bottom-sec
      width: 100%
      display: flex
    .data-sec
      width: 50%
      margin-right: 20px
      margin-top: 20px
      border: 1px solid #E6EAED
      height: 405px
      display: flex
      flex-direction: column
      .sec-title
        height: 60px
        display: flex
        padding: 0 20px
        justify-content: space-between
        align-items: center
        font-family: $font-family-regular
        .text
          font-size: $font-size-16
          color: $color-text-main
        .right-text
          display: flex
          align-items: center
          font-size: $font-size-14
          color: #666
          .text-icon
            width: 14px
            height: 14px
            margin-left: 4px
    .bottom
      height: 0


</style>
