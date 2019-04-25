<template>
  <div class="procurement-task table">
    <div class="table-content">
      <!--列表tab工具栏-->
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-warehousing@2x.png" class="identification-icon">
          <p class="identification-name">配货位列表</p>
        </div>
        <div class="function-btn">
          <div class="btn-main" @click="_export">导出</div>
        </div>
      </div>
      <!--列表部分-->
      <div>
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" :class="'list-item '+item.class" :style="{flex:item.flex}">{{item.title}}</div>
        </div>
        <div class="list">
          <div v-for="(row, index) in dragList"
               :key="index"
               v-dragging="{ item: row, list: dragList, group: 'sortingTask' }"
               class="list-content list-box"
          >
            <div class="list-item sort">
              <div class="index">
                {{sortingConfig.list[index].sort|format}}
              </div>
            </div>
            <div class="list-item" :style="{flex:2}">{{row[commodities[1].key]}}</div>
            <div class="list-item">
              {{row[commodities[2].key]}}
              <div v-if="!row[commodities[2].key]" class="list-operation" @click.stop="_showSettingModel(row.id)">设置线路</div>
            </div>
            <div class="list-item  operate">
              <div class="list-operation-wrap">
                <div class="drag-operation">
                </div>
              </div>
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
            <div class="close" @click.stop="_hideModal">
            </div>
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

            <div class="back btn-group-wrap">
              <div class="back-cancel back-btn hand" @click.stop="_hideModal">关闭</div>
              <div v-if="road.data.length>0" class="back-btn back-submit hand" @click.stop="_sureSetRoad">确定</div>
            </div>

          </div>
        </div>

      </div>
    </default-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {authComputed, sortingComputed, sortingMethods} from '@state/helpers'
  import DefaultModal from '@components/default-modal/default-modal'
  import API from '@api'
  import _ from 'lodash'

  const PAGE_NAME = 'SORTING_CONFIG'
  const TITLE = '配货位-列表'
  const COMMODITIES_LIST = [
    {title: '配货位', key: 'sort', noShow: true, class: 'sort'},
    {title: '商户名称', key: 'name', flex: '2'},
    {title: '线路', key: 'road_name', replaceText: '設置路綫', flex: '1'},
    {title: '操作 ', key: 'road_id', type: "operate", class: 'operate'},
  ]
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    filters: {
      format(str) {
        let arr = str.split('#')
        if (arr[1]) {
          return arr[1]
        } else {
          return str
        }
      }
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
        settingId: "",
        isChange: false
      }
    },
    computed: {
      ...authComputed,
      ...sortingComputed,
    },
    created() {
      this.dragList = _.cloneDeep(this.sortingConfig.list)
    },
    mounted() {
      this.$dragging.$on('dragged', (res) => {

      })
      this.$dragging.$on('dragend', (res) => {
        if (this.isChange) return
        this.isChange = true
        let data = this.dragList.map((item, idx) => {
          return {...item, ...{sort: this.sortingConfig.list[idx].sort}}
        })
        this._changeAllocationPostion(data)
      })
    },
    methods: {
      ...sortingMethods,
      // 更新托拽列表
      updateList() {
        this.getSortingConfigList().then(res => {
          if (res) {
            this.dragList = _.cloneDeep(this.sortingConfig.list)
          }
        })
      },
      // 托拽
      _changeAllocationPostion(arr) {
        this.$loading.show('修改配货位')
        API.Sorting.changeAllocationPostion(arr).then(res => {

          if (res.error === this.$ERR_OK) {
            this.$toast.show('修改配货位成功')
            this.isChange = false
          } else {
            this.$toast.show('修改配货位失败')
          }
        })
          .finally(() => {
            this.updateList()
            this.$loading.hide()
          })
      },
      _getRoadList() {
        return API.Sorting.getRoadList().then(res => {
          let resData = res.data || []
          this.road.data = resData.map(item => {
            return {name: item.road_name, id: item.road_id}
          })
        })
      },
      //  显示弹框
      _showSettingModel(id) {
        this.road.content = ""
        this.selectRoad = {
          road_name: "",
          road_id: ""
        }
        this.settingId = id
        this._getRoadList().finally(res => {
          this.$refs.modal.showModal()
        })
      },
      //  隐藏弹框
      _hideModal() {
        this.$refs.modal.hideModal()
      },
      // 选择路线
      _selectRoad(item) {
        this.selectRoad = item
      },
      // 确定设置路线
      _sureSetRoad() {
        if (!this.selectRoad.id) {
          this.$toast.show('请选择线路')
          return
        }
        let params = {
          road_name: this.selectRoad.name,
          road_id: this.selectRoad.id
        }
        this.$loading.show('设置线路')
        API.Sorting.setRoad(this.settingId, params).then(res => {
          if (res.error === this.$ERR_OK) {
            this.$toast.show('线路设置成功')
            this._hideModal()
            this.updateList()
          } else {
            this.$toast.show(res.message)
          }
        }).finally(() => {
          this.$loading.hide()
        })
      },
      // 导出
      _getUrl() {
        if (!this.exportParamsStr) {
          let data = {
            current_corp: this.getCurrentId(),
            access_token: this.currentUser.access_token
          }
          let search = []
          for (let key in data) {
            search.push(`${key}=${data[key]}`)
          }
          return '?' + search.join('&')
        }
      },
      _export() {
        API.Sorting.exportAllocationList(this._getUrl())
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .table .table-content
    padding-bottom: 20px

    .list-content:hover
      cursor pointer

    .list-item
      &.sort
        max-width: 100px

      &.operate
        max-width: 50px

      .index
        display inline-block
        padding: 0px 5px
        heigth: 20px
        line-height 20px
        text-align center
        background: #888888
        border-radius: 10px
        border-radius: 10px
        font-family: PingFangSC-Medium
        font-size: 16px
        color: #FFFFFF

  .operation-guide-text
    color: #4D77BD

  .list-operation
    text-decoration: underline

  .drag-operation
    width: 18px
    height: 18px
    icon-image(icon-drag)

    &:hover
      icon-image(icon-drag_hover)

  .model-wrap
    background: $color-white
    border-radius: 2px
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.6)
    /*text-align: center*/

    .top
      align-items: center
      justify-content: space-between
      padding: 20px
      layout(row)

      .title
        font-family: $font-family-regular
        font-size: $font-size-16
        color: $color-text-main

      .close
        width: 12px
        height: 12px
        icon-image(icon-close)

  .model-content
    padding: 20px

    .model-body
      height: 65px
      padding-top: 10px

      .edit-item
        display: flex
        color: #2A2A2A
        min-height: 40px

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
      height:auto
      layout(row)
      align-items: center
      justify-content: flex-end
      padding-top: 20px
      background: #fff
      position: relative
      left: 0
      .back-submit
          margin-right:0
      &:before
        border-top: 0px solid #e9ecee;
</style>
