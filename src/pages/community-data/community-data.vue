<template>
  <div class="community-data">
    <div class="data-caption data-caption-line">
      <div class="content-title">
        <img src="./icon-qundata@2x.png" alt="" class="title-icon">
        <div class="data-title">微信群运营数据概况</div>
      </div>
      <base-option-box :arrTitle="arrTitle" :infoTab="2" :tabActive="2" @checkTime="_getData"></base-option-box>
    </div>
    <div class="data-content">
      <left-tab @editGroup="editGroup" @changeCommunity="changeCommunity"></left-tab>
      <div class="right-data">
        <div class="top-sec">
          <section class="data-sec quality-data">
            <div class="sec-title">
              <p class="text">群质量数据<span v-if="+letTab !== 0">(当前等级Lv{{leftTabItem.level || 0}})</span></p>
              <p class="right-text hand" @click="showDescription('quality')">等级说明 <img class="text-icon" src="./icon-help_lv@2x.png" alt=""></p>
            </div>
            <!--群质量数据-->
            <quality-data ref="qualityData" :time="request.day_type" @changeQuality="changeQuality"></quality-data>
          </section>
          <section class="data-sec business-data">
            <div class="sec-title">
              <p class="text">群运营数据</p>
              <p class="right-text hand" @click="showDescription('business')">数据说明 <img class="text-icon" src="./icon-help_lv@2x.png" alt=""></p>
            </div>
            <!--群运营数据-->
            <business-data ref="businessData" :time="request.day_type" @changeBusiness="changeBusiness"></business-data>
          </section>
        </div>
        <div class="bottom-sec">
          <section class="data-sec group-data">
            <div class="sec-title">
              <p class="text">群用户分组<span v-if="+letTab !== 0">(群总人数{{leftTabItem.total || 0}})</span></p>
            </div>
            <!--用户分组-->
            <group-data ref="groupData" :time="request.day_type" @changeGroup="changeGroup"></group-data>
          </section>
          <section class="data-sec goods-list">
            <div class="sec-title">
              <p class="text">最受欢迎商品Top10</p>
            </div>
            <!--商品TOP10-->
            <goods-list></goods-list>
          </section>
        </div>
      </div>
    </div>
    <description-modal ref="description"></description-modal>
    <edit-modal ref="editModal" @confirm="confirm"></edit-modal>
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

  import API from '@api'
  const ARR_TITLE = [
    {title: '今天', status: 'today'},
    {title: '昨天', status: 'yesterday'},
    {title: '7天', status: 'week'},
    {title: '30天', status: 'month'}
  ]
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
        arrTitle: ARR_TITLE,
        letTab: 0,
        tabArr: [],
        request: {
          wx_group_id: null,
          day_type: 'week'
        },
        editGroupItem: {},
        leftTabItem: {}
      }
    },
    computed: {
      ...communityComputed
    },
    created() {
      this.getAllData()
    },
    methods: {
      ...communityMethods,
      _getData(value) {
        this.request.day_type = value
        this.getAllData()
        // this.$refs.qualityData.drawLine()
        // this.$refs.businessData.drawLine()
        // this.$refs.groupData.drawLine()
      },
      // 切换质量数据tab栏
      changeQuality(item) {
        // this.getQualityData(this.request)
      },
      // 切换运营数据tab栏
      changeBusiness(item) {
        // this.getBusinessData(this.request)
      },
      // 切换用户分组tab栏
      changeGroup(item) {
        // this.getGroupData(this.request)
      },
      // 切换左侧tab栏
      changeCommunity(index, item) {
        this.leftTabItem = item
        this.letTab = index
        this.request.wx_group_id = item.id
        this.$refs.qualityData.setTab()
        this.$refs.businessData.setTab()
        this.$refs.groupData.setTab()
        this.getAllData()
      },
      showDescription(type) {
        this.$refs.description.show(type)
      },
      async editGroup(item) {
        this.editGroupItem = item
        this.$refs.editModal.show(item)
        // groupAccount帐号  groupName群名  personNumber群人数 id//
      },
      async confirm(data) {
        this.name = data.name
        let res = await API.Community.editCommunity(data)
        if (res.error !== this.$ERR_OK) {
          this.$toast.show(res.message)
          return
        }
        this.getCommunityList({page: 1})

      },
      getAllData() {
        this.getQualityData(this.request)
        this.getBusinessData(this.request)
        this.getGroupData(this.request)
        this.getGoodsList(this.request)
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
    border-bottom: 0.5px solid $color-line
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
      border-1px($color-line, 0)
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
