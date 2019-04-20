<template>
  <div class="procurement-task table">
    <div class="table-content">
      <!--列表tab工具栏-->
      <div class="identification">
        <div class="identification-page">
        </div>
        <div class="function-btn">
          <div class="btn-main" @click="_export">导出</div>
        </div>
      </div>
      <!--列表部分-->
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in dragList"
               :key="index"
               v-dragging="{ item: item, list: dragList, group: 'sortingTask' }"
               class="list-content list-box"
          >
            <div class="list-item">{{sortingConfig.list[index].sort}}</div>
            <div class="list-item">{{item.name}}</div>
            <div class="list-item">{{item.road_name}}<div class="list-operation" @click.stop="showSettingModel(item.id)">设置线路</div></div>
            <div class="list-item">
              <div class="list-operation-wrap">
                <div class="drag-operation">托拽</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 设置路线弹框 -->
      <default-modal ref="modal">
        <div slot="content">
          <div class="model-wrap">
            <div class="top">
              <div class="title">{{road.data.length?'线路设置' :'温馨提示'}}</div>
              <div class="close" @click.stop="hideModal"><img class="close-img" src="./icon-close@2x.png" alt=""></div>
            </div>
            <div class="model-content">
              <div v-if="road.data.length>0" class="model-body">
                <div class="edit-item">
                  <div class="edit-title">
                    <span class="start">*</span>
                    线路名称
                  </div>
                  <div class="edit-input-box mini-edit-input-box">
                    <base-drop-down :select="road" :height="40" :width="410" @setValue="_selectRoad"></base-drop-down>
                  </div>
                </div>
              </div>
              <div v-if="road.data.length===0" class="prompt-content">
                暂无线路，请在 <span class="operation-guide-text">配送-调度管理-线路</span>中新建
              </div>
              <div class="btn-group-wrap">
                <div class="btn-item" @click.stop="hideModal">关闭</div>
                <!--<div class="btn-item" @click.stop="sureSetRoad">确定</div>-->
              </div>
            </div>
          </div>

        </div>
      </default-modal>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {sortingComputed, sortingMethods} from '@state/helpers'
  import DefaultModal from '@components/default-modal/default-modal'
  import API from '@api'
  import _ from 'lodash'

  const PAGE_NAME = 'SORTING_CONFIG'
  const TITLE = '配货位-列表'
  const COMMODITIES_LIST = ['配货位', '商户名称', '线路', '操作']
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultModal
    },
    data() {
      return {
        commodities: COMMODITIES_LIST,
        dragList: [],
        road: {
          check: false,
          show: false,
          content: '',
          type: 'default',
          data: []
        },
        selectRoad: {
          road_name: '',
          road_id: ''
        },
        settingId: ""
      }
    },
    computed: {
      ...sortingComputed
    },
    created(){
      this.dragList = _.cloneDeep(this.sortingConfig.list)
    },
    mounted() {
      console.log(this.sortingConfig, 'this.sortingConfig.list')
      this.$dragging.$on('dragged', ({value}) => {
        console.log(value.item)
        console.log(value.list)
        console.log(value.otherData)
      })

      this.$dragging.$on('dragend', (res) => {
        let data = this.dragList.map((item, idx) => {
          let oldSort = {sort: this.sortingConfig.list[idx].sort}
          return {...item, ...oldSort}
        })
        API.Sorting.changeAllocationPostion(data).then(res=>{
          this.getSortingConfigList()
        })
      })
    },
    methods: {
      ...sortingMethods,
      getRoadList() {
        API.Sorting.getRoadList().then(res => {
          let resData = res.data || []
          this.road.data = resData.map(item => {
            return {name: item.road_name, id: item.road_id}
          })
        })
      },
      showSettingModel(id) {
        this.road.content = ""
        this.selectRoad = {
          road_name: "",
          road_id: ""
        }
        this.getRoadList()
        this.settingId = id
        this.$refs.modal.showModal()
      },
      hideModal() {
        this.$refs.modal.hideModal()
      },
      _selectRoad(item) {
        this.selectRoad = item
        console.log(this.road, 'roadroadroadroad', this.selectRoad)
      },
      sureSetRoad() {
        if (this.selectRoad.id) {
          let params = {
            road_name: this.selectRoad.name,
            road_id: this.selectRoad.id
          }
          API.Sorting.setRoad(this.settingId, params).then(res => {
            if (res.error === this.$ERR_OK) {
              this.$toast.show('线路设置成功')
            } else {
              this.$toast.show(res.message)
            }
          })
        } else {
          this.$toast.show('请选择线路')
        }
      },
      // 导出
      _export() {

      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .operation-guide-text
    color: #4D77BD

  .list-operation
    text-decoration: underline

  .drag-operation
    width: 18px
    height: 18px

  /*icon-image($name)
  &.disable
   icon-image($name) */
  .model-wrap
    background: $color-white
    border-radius: 2px
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.6)
    text-align: center

    .top
      height: 59.5px
      border-bottom: 0.5px solid $color-line
      align-items: center
      justify-content: space-between
      padding: 0 20px
      layout(row)

      .title
        font-family: $font-family-regular
        font-size: $font-size-16
        color: $color-text-main

      .close
        width: 16px
        height: 16px

        .close-img
          width: 16px
          height: 16px
          display: block

  .model-content
    padding: 20px

    .model-body
      height: 65px

      .edit-item
        display: flex
        color: #2A2A2A
        min-height: 40px
        margin-top: 24px

        .edit-title
          margin-top: 7.5px
          font-size: $font-size-14
          font-family: $font-family-regular
          white-space: nowrap
          text-align: left
          width: 64px

        .start
          display: inline-block
          margin-right: -2px
          color: #F52424

        .edit-input-box
          margin-left: 20px

        .edit-input
          font-size: $font-size-14
          padding: 0 14px
          border-radius: 2px
          width: 400px
          height: 40px
          border: 0.5px solid $color-line
          transition: all 0.3s

          &:disabled
            color: $color-text-assist
            background: $color-white

          &::-webkit-inner-spin-button
            appearance: none

          &:hover
            border: 1px solid #ACACAC

          &::placeholder
            font-family: $font-family-regular
            color: $color-text-assist

          &:focus
            border-color: $color-main !important

    .prompt-content
      width: 340px
      height: 50px
      font-size: $font-size-16

    .btn-group-wrap
      layout(row)
      align-items: center
      justify-content: flex-end
      padding-right: 20px

      .btn-item
        width: 96px
        line-height: 40px
        margin-left: 10px
        cursor: pointer
        text-align: center
        border: 1px solid $color-text-assist
        border-radius: 2px
        font-family: $font-family-regular
        font-size: $font-size-16
        color: $color-text-main
        height: 40px

        &:nth-child(1)
          color: $color-positive
          border-color: $color-positive

        &:nth-child(2)
          background: $color-positive
          color: $color-white
          border-color: $color-positive

</style>
