<template>
  <div class="procurement-task table">
    <div class="table-content">
      <!--列表tab工具栏-->
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-order_list2@2x.png" class="identification-icon">
          <p class="identification-name">配货位列表</p>
        </div>
        <div class="function-btn">
          <div class="btn-main" @click="_export">导出</div>
        </div>
      </div>
      <!--列表部分-->
      <div class="concat-table-wrap">
        <!--<div class="sort-table-box">
          <div class="list-header list-box">
            <div v-for="(item,index) in commodities1" :key="index" :class="'list-item '+item.class" :style="{flex:item.flex}">{{item.title}}</div>
          </div>
          <div class="list">
            <div v-for="(row, index) in sortingConfig.list" :key="index" class="list-content list-box">
              <div class="list-item sort">
                <div class="index">
                  {{row.sort|format}}
                </div>
              </div>
            </div>
          </div>
        </div>-->
        <div class="drag-wrap">
          <!--<div class="list-header list-box">
            <div v-for="(item,index) in commodities2" :key="index" :class="'list-item '+item.class" :style="{flex:item.flex}">{{item.title}}</div>
          </div>-->
          <template v-if="dragList.length">
            <slick-list v-model="dragList"
                        axis="xy"
                        :distance="10"
                        lockAxis="xy"
                        class="drag-list"
                        helperClass="drag-item"
                        :useWindowAsScrollContainer="true"
                        @input="sortEndInput"
            >
              <slick-item v-for="(row, index) in dragList" :key="index" :index="index" class="drag-item">
                <span class="num">{{row.sort|format}}</span>
                <div class="road-line">
                  <p class="title">{{row.name}}</p>
                  <p class="text">{{row.road_name}}</p>
                  <div v-if="!row.road_name" class="list-operation" @click="_showSettingModel(row.id)">设置线路</div>
                </div>

              </slick-item>
            </slick-list>
          </template>
          <base-blank v-else></base-blank>

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
              <div class="back-cancel back-btn hand" @click.stop="_hideModal">取消</div>
              <div v-if="road.data.length>0" class="back-btn back-submit hand" @click.stop="_sureSetRoad">确定</div>
            </div>

          </div>
        </div>

      </div>
    </default-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {SlickList, SlickItem, HandleDirective} from 'vue-slicksort'
  import {authComputed, sortingComputed, sortingMethods} from '@state/helpers'
  import DefaultModal from '@components/default-modal/default-modal'
  import API from '@api'
  import _ from 'lodash'

  const PAGE_NAME = 'SORTING_CONFIG'
  const TITLE = '配货位-列表'
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    directives: {handle: HandleDirective},
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
      DefaultModal,
      SlickItem,
      SlickList
    },
    data() {
      return {
        items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7', 'Item 8'],
        commodities1: [
          {
            title: '配货位',
            key: 'sort',
            noShow: true,
            class: 'sort'
          }
        ],
        commodities2: [
          {
            title: '商户名称',
            key: 'name',
            flex: '2'
          },
          {
            title: '线路',
            key: 'road_name',
            replaceText: '設置路綫',
            flex: '1'
          },
          {
            title: '操作 ',
            key: 'road_id',
            type: 'operate',
            class: 'operate'
          }
        ],
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
        settingId: '',
        isChange: false
      }
    },
    computed: {
      ...authComputed,
      ...sortingComputed
    },
    created() {
      this.dragList = _.cloneDeep(this.sortingConfig.list)
    },
    mounted() {},
    methods: {
      ...sortingMethods,
      // 托拽结束后
      sortEndInput() {
        if (this.isChange) return
        this.isChange = true
        let trueChange = false
        let data = this.dragList.map((item, idx) => {
          if (item.sort !== this.sortingConfig.list[idx].sort) {
            trueChange = true
          }
          return {
            id: item.id,
            sort: this.sortingConfig.list[idx].sort
          }
        })
        if (trueChange) {
          this._changeAllocationPostion(data)
        } else {
          this.isChange = false
        }
      },
      // 更新托拽列表
      updateList() {
        this.getSortingConfigList({loading: false}).then((res) => {
          if (res) {
            this.dragList = _.cloneDeep(this.sortingConfig.list)
            this.$nextTick(() => {
              this.$loading.hide()
            })
          }
        })
      },
      // 托拽
      _changeAllocationPostion(arr) {
        this.$loading.show('修改配货位')
        API.Sorting.changeAllocationPostion(arr)
          .then((res) => {
            if (res.error === this.$ERR_OK) {
              this.$toast.show('修改配货位成功')
              this.isChange = false
            } else {
              this.$toast.show('修改配货位失败')
            }
          })
          .finally(() => {
            this.updateList()
          })
      },
      _getRoadList() {
        return API.Sorting.getRoadList().then((res) => {
          let resData = res.data || []
          this.road.data = resData.map((item) => {
            return {name: item.road_name, id: item.road_id}
          })
        })
      },
      //  显示弹框
      _showSettingModel(id) {
        this.road.content = ''
        this.selectRoad = {
          road_name: '',
          road_id: ''
        }
        this.settingId = id
        this._getRoadList().finally((res) => {
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
        API.Sorting.setRoad(this.settingId, params)
          .then((res) => {
            if (res.error === this.$ERR_OK) {
              this.$toast.show('线路设置成功')
              this._hideModal()
              this.updateList()
            } else {
              this.$toast.show(res.message)
            }
          })
          .finally(() => {
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
  .procurement-task
    min-width: 1400px
  .concat-table-wrap
    display: flex
    width:100%
    .sort-table-box
      flex-shrink 0
      .list-box .list-item
        padding-right:0px
        text-align: center
    .drag-wrap
      flex:1
      flex-wrap: wrap
      .drag-list
        display: flex
        flex-wrap: wrap
        &:hover
          user-select: none
  .drag-item
    width: 15.4%
    overflow: hidden
    height: 75px
    padding: 16px 13px
    box-sizing: border-box
    box-shadow: 0 0 4px 0 rgba(0,0,0,0.05)
    cursor: pointer
    margin-right: 20px
    margin-bottom: 20px
    border-radius: 2px
    border: 1px solid #F4F4F4
    display: flex
    &:hover
      border: 1px solid #c1c1c1
    &:nth-child(6n)
      margin-right: 0
    .road-line
      flex: 1
      overflow: hidden
      padding-left: 10px
      line-height: 1
    .num
      height: 18px
      padding: 0 6px
      border-radius: 20px
      background: #9FD5C6
      text-align: center
      line-height: 18px
      color: #52A18B
      font-size: $font-size-12
      font-family: $font-family-medium
    .title
      color: #333333
      font-size: $font-size-14
      font-family: $font-family-medium
      overflow: hidden
      line-height: 1.2
      text-overflow: ellipsis
      white-space: nowrap
      margin-bottom: 8px
      margin-top: 2px
    .text
      font-size: $font-size-14
      color: #999999
      font-family: $font-family-regular
    .list-operation
      font-family: $font-family-regular
      cursor pointer

  .table .table-content
    padding-bottom: 20px

  .operation-guide-text
    color: #4D77BD

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
        cursor pointer
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
      margin-bottom: 20px
      font-size: $font-size-16
      color: #666

    .btn-group-wrap
      height: auto
      layout(row)
      align-items: center
      justify-content: flex-end
      padding-top: 20px
      background: #fff
      position: relative
      left: 0

      .back-submit
        margin-right: 0

      &:before
        border-top: 0px solid #e9ecee;
</style>
