<template>
  <div class="operation-allocation table">
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-setup_list2@2x.png" class="identification-icon">
          <p class="identification-name">运营时间设置</p>
        </div>
        <div class="function-btn">
        </div>
      </div>
      <div class="content-header">
        <div class="content-title">当前设置</div>
      </div>
      <div class="operation-tip">
        采购/分拣/出库/配送任务预计<span class="operation-time">{{`${operation.hour}:${operation.minute + 10}`}}</span>生成。
      </div>
      <div class="operation-tip">
        当下单时间早于当天
        <div class="drop">
          <base-drop-down :select="hour"></base-drop-down>
        </div>
        <div class="drop">
          <base-drop-down :select="min"></base-drop-down>
        </div>
        ，则次日配送；当下单时间晚于该时间点，则隔日配送。
      </div>
      <div class="operation-sub">
        (设置的下单时间需大于设置时的时间，设置完成后，将于当日生效。）
      </div>
    </div>
    <div class="back">
      <div class="back-btn back-submit" @click="submit">保存</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import {allocationComputed, allocationMethods} from '@state/helpers'
  import _ from 'lodash'

  const PAGE_NAME = 'OPERATION_ALLOCATION'
  const TITLE = '运营时间配置'
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        hour: {
          check: false,
          show: false,
          content: '23点',
          type: 'default',
          data: []
        },
        min: {
          check: false,
          show: false,
          content: '0分',
          type: 'default',
          data: [{name: '0分', value: 0}, {name: '30分', value: 30}]
        }
      }
    },
    computed: {
      ...allocationComputed
    },
    created() {
      this._getHour()
      this._infoTime()
    },
    methods: {
      ...allocationMethods,
      async submit() {
        let hourarr = this.hour.content.split('点')
        let minarr = this.min.content.split('分')
        let data = {hour: hourarr[0], minute: minarr[0]}
        let res = await API.Allocation.setRunTimeConfig(data)
        this.$loading.hide()
        this.$toast.show(res.message)
        if (res.error === this.$ERR_OK) {
          this.getOperation()
        }
      },
      _infoTime() {
        if (!_.isEmpty(this.operation)) {
          this.hour.content = `${this.operation.hour}点`
          this.min.content = `${this.operation.minute}分`
        }
      },
      _getHour() {
        for (let i = 12; i < 24; i++) {
          let item = {name: `${i}点`, status: i}
          this.hour.data.push(item)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/detail"

  .identification-icon
    transform: translateY(1px)
  .operation-tip
    display: flex
    align-items: center
    font-size: $font-size-14
    font-family: $font-family-regular
    color: $color-text-main
    margin-top: 30px
    line-height: 1
    .operation-time
      line-height: 1
      display: inline-block
      margin: 0 3px
      color: #4DBD65
    .drop
      margin-left: 10px
  .operation-sub
    font-size: $font-size-14
    font-family: $font-family-regular
    color: $color-text-assist
    margin-top: 14px
    line-height: 1
</style>
