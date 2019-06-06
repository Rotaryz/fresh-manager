<template>
  <div class="logistics-monitoring">
    <div class="header-wrapper">
      <div class="title-wrapper">
        <i class="icon-task"></i>
        <span class="title">任务中心</span>
      </div>
      <div class="time-wrapper">
        <span class="time">{{start === end && start || `${start} ~ ${end}`}}</span>
        <div class="time-group">
          <span class="item" :class="{'active': time === 'today'}" @click="changeTime('today')">今天</span>
          <span class="item" :class="{'active': time === 'week'}" @click="changeTime('week')">7天</span>
          <span class="item" :class="{'active': time === 'month'}" @click="changeTime('month')">30天</span>
        </div>
      </div>
    </div>
    <div class="logistics-container">
      <div class="logistics-item">
        <div class="logistics-wrapper">
          <div class="content-container">
            <div class="title-wrapper">
              <i class="icon icon1"></i>
              <span class="title">采购</span>
              <div class="count-wrapper">
                <span class="big-count">{{purchase.finish_count}}</span>
                <span class="small-count">/{{purchase.all_count}}</span>
              </div>
            </div>
            <div class="content-wrapper">
              <div v-for="(item, index) in purchase.status" :key="index" class="item-wrapper">
                <p class="title">{{item.status_str}}</p>
                <p class="count">{{item.statistic}}</p>
                <i class="icon-arrow"></i>
              </div>
            </div>
            <div class="progress-wrapper">
              <div class="progress">
                <div v-for="(item, index) in purchase.status" :key="index" class="progress-item" :style="{width: `${item.statistic ? item.statistic / purchase.all_count * 100 : 0}%`, minWidth: `${item.statistic ? '44' : 0}px`, background: `rgba(120,121,251,${(index+1)/purchase.status.length})`}">{{item.status_str}}</div>
              </div>
            </div>
          </div>
          <div class="status-container" :class="{'normal': purchase.result_status === 0, 'success': purchase.result_status === 1, 'error': purchase.result_status === 2}">
            <div class="status-wrapper">
              <div class="status">{{purchase.result_status === 0 ? '执行中' : purchase.result_status === 1 ? '正常' : '异常'}}</div>
            </div>
            <div v-if="purchase.result_status === 2" class="detail-wrapper">
              <div class="detail">
                <p class="content">异常单：{{purchase.exception_count}}</p>
              </div>
              <i class="icon-arrow"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="logistics-item">
        <div class="logistics-wrapper">
          <div class="content-container">
            <div class="title-wrapper">
              <i class="icon icon2"></i>
              <span class="title">入库</span>
              <div class="count-wrapper">
                <span class="big-count">{{entry.finish_count}}</span>
                <span class="small-count">/{{entry.all_count}}</span>
              </div>
            </div>
            <div class="content-wrapper">
              <div v-for="(item, index) in entry.status" :key="index" class="item-wrapper">
                <p class="title">{{item.status_str}}</p>
                <p class="count">{{item.statistic}}</p>
                <i class="icon-arrow"></i>
              </div>
            </div>
            <div class="progress-wrapper">
              <div class="progress">
                <div v-for="(item, index) in entry.status" :key="index" class="progress-item" :style="{width: `${item.statistic ? item.statistic / entry.all_count * 100 : 0}%`, minWidth: `${item.statistic ? '44' : 0}px`, background: `rgba(120,121,251,${(index+1)/entry.status.length})`}">{{item.status_str}}</div>
              </div>
            </div>
          </div>
          <div class="status-container" :class="{'normal': entry.result_status === 0, 'success': entry.result_status === 1, 'error': entry.result_status === 2}">
            <div class="status-wrapper">
              <div class="status">{{entry.result_status === 0 ? '执行中' : entry.result_status === 1 ? '正常' : '异常'}}</div>
            </div>
            <div v-if="entry.result_status === 2" class="detail-wrapper">
              <div class="detail">
                <p class="content">异常单：{{entry.exception_count}}</p>
              </div>
              <i class="icon-arrow"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="logistics-item">
        <div class="logistics-wrapper">
          <div class="content-container">
            <div class="title-wrapper">
              <i class="icon icon3"></i>
              <span class="title">分拣</span>
              <div class="count-wrapper">
                <span class="big-count">{{picking.finish_count}}</span>
                <span class="small-count">/{{picking.all_count}}</span>
              </div>
            </div>
            <div class="content-wrapper">
              <div v-for="(item, index) in picking.status" :key="index" class="item-wrapper">
                <p class="title">{{item.status_str}}</p>
                <p class="count">{{item.statistic}}</p>
                <i class="icon-arrow"></i>
              </div>
            </div>
            <div class="progress-wrapper">
              <div class="progress">
                <div v-for="(item, index) in picking.status" :key="index" class="progress-item" :style="{width: `${item.statistic ? item.statistic / picking.all_count * 100 : 0}%`, minWidth: `${item.statistic ? '44' : 0}px`, background: `rgba(120,121,251,${(index+1)/picking.status.length})`}">{{item.status_str}}</div>
              </div>
            </div>
          </div>
          <div class="status-container" :class="{'normal': picking.result_status === 0, 'success': picking.result_status === 1, 'error': picking.result_status === 2}">
            <div class="status-wrapper">
              <div class="status">{{picking.result_status === 0 ? '执行中' : picking.result_status === 1 ? '正常' : '异常'}}</div>
            </div>
            <div v-if="picking.result_status === 2" class="detail-wrapper">
              <div class="detail">
                <p class="content">异常单：{{picking.exception_count}}</p>
              </div>
              <i class="icon-arrow"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="logistics-item">
        <div class="logistics-wrapper">
          <div class="content-container">
            <div class="title-wrapper">
              <i class="icon icon4"></i>
              <span class="title">出库</span>
              <div class="count-wrapper">
                <span class="big-count">{{out.finish_count}}</span>
                <span class="small-count">/{{out.all_count}}</span>
              </div>
            </div>
            <div class="content-wrapper">
              <div v-for="(item, index) in out.status" :key="index" class="item-wrapper">
                <p class="title">{{item.status_str}}</p>
                <p class="count">{{item.statistic}}</p>
                <i class="icon-arrow"></i>
              </div>
            </div>
            <div class="progress-wrapper">
              <div class="progress">
                <div v-for="(item, index) in out.status" :key="index" class="progress-item" :style="{width: `${item.statistic ? item.statistic / out.all_count * 100 : 0}%`, minWidth: `${item.statistic ? '44' : 0}px`, background: `rgba(120,121,251,${(index+1)/out.status.length})`}">{{item.status_str}}</div>
              </div>
            </div>
          </div>
          <div class="status-container" :class="{'normal': out.result_status === 0, 'success': out.result_status === 1, 'error': out.result_status === 2}">
            <div class="status-wrapper">
              <div class="status">{{out.result_status === 0 ? '执行中' : out.result_status === 1 ? '正常' : '异常'}}</div>
            </div>
            <div v-if="out.result_status === 2" class="detail-wrapper">
              <div class="detail">
                <p class="content">异常单：{{out.exception_count}}</p>
              </div>
              <i class="icon-arrow"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="logistics-item">
        <div class="logistics-wrapper">
          <div class="content-container">
            <div class="title-wrapper">
              <i class="icon icon5"></i>
              <span class="title">配送</span>
              <div class="count-wrapper">
                <span class="big-count">{{delivery.finish_count}}</span>
                <span class="small-count">/{{delivery.all_count}}</span>
              </div>
            </div>
            <div class="content-wrapper">
              <div v-for="(item, index) in delivery.status" :key="index" class="item-wrapper">
                <p class="title">{{item.status_str}}</p>
                <p class="count">{{item.statistic}}</p>
                <i class="icon-arrow"></i>
              </div>
            </div>
            <div class="progress-wrapper">
              <div class="progress">
                <div v-for="(item, index) in delivery.status" :key="index" class="progress-item" :style="{width: `${item.statistic ? item.statistic / delivery.all_count * 100 : 0}%`, minWidth: `${item.statistic ? '44' : 0}px`, background: `rgba(120,121,251,${(index+1)/delivery.status.length})`}">{{item.status_str}}</div>
              </div>
            </div>
          </div>
          <div class="status-container" :class="{'normal': delivery.result_status === 0, 'success': delivery.result_status === 1, 'error': delivery.result_status === 2}">
            <div class="status-wrapper">
              <div class="status">{{delivery.result_status === 0 ? '执行中' : delivery.result_status === 1 ? '正常' : '异常'}}</div>
            </div>
            <div v-if="delivery.result_status === 2" class="detail-wrapper">
              <div class="detail">
                <p class="content">异常单：{{delivery.exception_count}}</p>
              </div>
              <i class="icon-arrow"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="logistics-item">
        <div class="logistics-wrapper">
          <div class="content-container">
            <div class="title-wrapper">
              <i class="icon icon6"></i>
              <span class="title">售后</span>
              <div class="count-wrapper">
                <span class="big-count">{{afterSale.finish_count}}</span>
                <span class="small-count">/{{afterSale.all_count}}</span>
              </div>
            </div>
            <div class="content-wrapper">
              <div v-for="(item, index) in afterSale.status" :key="index" class="item-wrapper">
                <p class="title">{{item.status_str}}</p>
                <p class="count">{{item.statistic}}</p>
                <i class="icon-arrow"></i>
              </div>
            </div>
            <div class="progress-wrapper">
              <div class="progress">
                <div v-for="(item, index) in afterSale.status" :key="index" class="progress-item" :style="{width: `${item.statistic ? item.statistic / afterSale.all_count * 100 : 0}%`, minWidth: `${item.statistic ? '44' : 0}px`, background: `rgba(120,121,251,${(index+1)/afterSale.status.length})`}">{{item.status_str}}</div>
              </div>
            </div>
          </div>
          <div class="status-container" :class="{'normal': afterSale.result_status === 0, 'success': afterSale.result_status === 1, 'error': afterSale.result_status === 2}">
            <div class="status-wrapper">
              <div class="status">{{afterSale.result_status === 0 ? '执行中' : afterSale.result_status === 1 ? '正常' : '异常'}}</div>
            </div>
            <div v-if="afterSale.result_status === 2" class="detail-wrapper">
              <div class="detail">
                <p class="content">异常单：{{afterSale.exception_count}}</p>
              </div>
              <i class="icon-arrow"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  const PAGE_NAME = 'LOGISTICS_MNITORING'
  const TITLE = '物流监控'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        time: 'today',
        start: '',
        end: '',
        purchase: {
          all_count: 0,
          finish_count: 0,
          result_status: 0,
          exception_count: 0,
          status: [
            {status: 1, status_str: "待发布", statistic: 0},
            {status: 2, status_str: "待采购", statistic: 0},
            {status: 3, status_str: "已完成", statistic: 0}
          ]
        },
        entry: {
          all_count: 0,
          finish_count: 0,
          result_status: 0,
          exception_count: 0,
          status: [
            {status: 0, status_str: "待进库", statistic: 0},
            {status: 2, status_str: "待理货", statistic: 0},
            {status: 3, status_str: "待上架", statistic: 0},
            {status: 1, status_str: "已完成", statistic: 0}
          ]
        },
        picking: {
          all_count: 0,
          finish_count: 0,
          result_status: 0,
          exception_count: 0,
          status: [
            {status: 0, status_str: "待分拣", statistic: 0},
            {status: 2, status_str: "待配货", statistic: 0},
            {status: 1, status_str: "已完成", statistic: 0}
          ]
        },
        out: {
          all_count: 0,
          finish_count: 0,
          result_status: 0,
          exception_count: 0,
          status: [
            {status: 2, status_str: "待复核", statistic: 0},
            {status: 0, status_str: "待出库", statistic: 0},
            {status: 1, status_str: "已完成", statistic: 0}
          ]
        },
        delivery: {
          all_count: 0,
          finish_count: 0,
          result_status: 0,
          exception_count: 0,
          status: [
            {status: 1, status_str: "待配送", statistic: 0},
            {status: 2, status_str: "待签收", statistic: 0},
            {status: 3, status_str: "已完成", statistic: 0}
          ]
        },
        afterSale: {
          all_count: 0,
          finish_count: 0,
          result_status: 0,
          exception_count: 0,
          status: [
            {status: 1, status_str: "待处理", statistic: 0},
            {status: 2, status_str: "已处理", statistic: 0}
          ]
        }
      }
    },
    created() {
      this._getInitData()
    },
    methods: {
      _getInitData() {
        this._getPurchase()
        this._getEntryWarehouse()
        this._getPicking()
        this._getOutWarehouse()
        this._getDelivery()
        this._getAfterSale()
      },
      _getPurchase() {
        API.Monitor.getPurchase({time: this.time})
          .then((res) => {
            if (res.error !== this.$ERR_OK) {
              return
            }
            this.start = res.data.start_time
            this.end = res.data.end_time
            this.purchase = res.data
          })
      },
      _getEntryWarehouse() {
        API.Monitor.getEntryWarehouse({time: this.time})
          .then((res) => {
            if (res.error !== this.$ERR_OK) {
              return
            }
            this.entry = res.data
          })
      },
      _getPicking() {
        API.Monitor.getPicking({time: this.time})
          .then((res) => {
            if (res.error !== this.$ERR_OK) {
              return
            }
            this.picking = res.data
          })
      },
      _getOutWarehouse() {
        API.Monitor.getOutWarehouse({time: this.time})
          .then((res) => {
            if (res.error !== this.$ERR_OK) {
              return
            }
            this.out = res.data
          })
      },
      _getDelivery() {
        API.Monitor.getDelivery({time: this.time})
          .then((res) => {
            if (res.error !== this.$ERR_OK) {
              return
            }
            this.delivery = res.data
          })
      },
      _getAfterSale() {
        API.Monitor.getAfterSale({time: this.time})
          .then((res) => {
            if (res.error !== this.$ERR_OK) {
              return
            }
            this.afterSale = res.data
          })
      },
      changeTime(time) {
        if (this.time === time) {
          return
        }
        this.time = time
        this._getInitData()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  $border-color = #e6eaed

  .logistics-monitoring
    width: 100%
    .header-wrapper
      height: 115px
      box-sizing: border-box
      padding: 0 20px
      border: 1px solid $border-color
      background: $color-white
      .title-wrapper
        display: flex
        align-items: center
        height: 58px
        border-bottom: 0.5px solid $border-color
        .icon-task
          width: 14px
          height: 14px
          background: url("./icon-qundata@2x.png") no-repeat
          background-size: 100% 100%
        .title
          margin-left: 6px
          font-family: $font-family-bold
          font-size: $font-size-16
          color: $color-text-main
      .time-wrapper
        display: flex
        height: 56px
        align-items: center
        justify-content: space-between
        .time
          font-size: $font-size-16
          color: $color-text-main
        .time-group
          font-size: $font-size-14
          .item
            cursor: pointer
            margin-left: 21px
            color: #666666
            transition: color .3s
            &.active
              color: #4DBD65
    .logistics-container
      width: 100%
      box-sizing: border-box
      .logistics-item
        display: inline-block
        width: 50%
        height: 224px
        box-sizing: border-box
        margin-top: 20px
        &:nth-child(odd)
          padding-right: 10px
        &:nth-child(even)
          padding-left: 10px
        .logistics-wrapper
          position: relative
          width: 100%
          height: 100%
          border-radius: 2px
          overflow: hidden
          background-color: $color-white
          transition: all .3s
          &:hover
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
          .content-container
            position: absolute
            top: 0
            left: 0
            bottom: 0
            right: 22px
            .title-wrapper
              display: flex
              align-items: center
              height:59.7px
              padding: 0 20px
              border-bottom: .5px solid $border-color
              .icon
                width: 15px
                height: 14px
                &.icon1
                  background: url("./icon-procurement@2x.png") no-repeat
                  background-size: 100% 100%
                &.icon2
                  background: url("./icon-instorage@2x.png") no-repeat
                  background-size: 100% 100%
                &.icon3
                  background: url("./icon-sorting@2x.png") no-repeat
                  background-size: 100% 100%
                &.icon4
                  background: url("./icon-outbound@2x.png") no-repeat
                  background-size: 100% 100%
                &.icon5
                  background: url("./icon-delivery@2x.png") no-repeat
                  background-size: 100% 100%
                &.icon6
                  background: url("./icon-aftersales@2x.png") no-repeat
                  background-size: 100% 100%
              .title
                margin-left: 6px
                font-family: $font-family-bold
                font-size: $font-size-16
                color: $color-text-main
              .count-wrapper
                margin-left: 30px
                .big-count
                  font-size: $font-size-16
                  color: $color-text-main
                .small-count
                  font-size: $font-size-14
                  color: #2a2a2a
            .content-wrapper
              display: flex
              height: 110px
              border-bottom: .5px solid $border-color
              .item-wrapper
                position: relative
                cursor: pointer
                flex: 1
                padding-top: 20px
                padding-left: 20px
                border-right: .5px solid $border-color
                &:last-child
                  border: none
                .title
                  line-height: 16px
                  font-size: $font-size-14
                .count
                  margin-top: 22px
                  line-height: 28px
                  font-family: $font-family-din-bold
                  font-size: 30px
                .icon-arrow
                  position: absolute
                  right: 19px
                  bottom: 22px
                  width: 20px
                  height: 20px
                  background: url("./icon-rightward_2@2x.png") no-repeat
                  background-size: 100% 100%
            .progress-wrapper
              display: flex
              align-items: center
              justify-content: center
              height: 53.5px
              box-sizing: border-box
              padding: 0 20px
              .progress
                display: inline-flex
                align-items: center
                justify-content: flex-start
                width: 100%
                height: 18px
                border-radius: 18px
                overflow: hidden
                background-color: $color-line
                .progress-item
                  width: 0
                  height: 18px
                  line-height: 18px
                  text-align: center
                  font-size: $font-size-12
                  color: $color-white
                  overflow: hidden
                  transition: all 1s
                  &:first-child
                    border-top-left-radius: 9px
                    border-bottom-left-radius: 9px
                  &:last-child
                    border-top-right-radius: 9px
                    border-bottom-right-radius: 9px
          .status-container
            position: absolute
            top: 0
            bottom: 0
            right: 0
            width: 22px
            transition: all .5s
            &.success
              background-color: #4DBD65
            &.error
              background-color: #F84E3C
              &:hover
                width: 128px
                .status-wrapper
                  opacity: 0
                  visibility: hidden
                .detail-wrapper
                  visibility: initial
                  right: 0
                  display: flex
                  opacity: 1
            &.normal
              background-color: #FFA700
            .status-wrapper
              display: flex
              align-items: center
              justify-content: flex-end
              visibility: initial
              width: 100%
              height: 100%
              opacity: 1
              transition: all .3s
              .status
                width: 12px
                margin-right: 5px
                font-size: $font-size-12
                color: $color-white
            .detail-wrapper
              position: absolute
              top: 0
              bottom: 0
              right: -128px
              visibility: hidden
              display: flex
              flex-direction: column
              justify-content: space-between
              width: 128px
              height: 100%
              padding: 44px 20px
              opacity: 0
              transition: all .3s
              .detail
                .content
                  margin-bottom: 10px
                  font-size: $font-size-14
                  color: $color-white
                  &:last-child
                    margin-bottom: 0
              .icon-arrow
                cursor: pointer
                width: 20px
                height: 20px
                background: url("./icon-enter_normal@2x.png")
                background-size: 100% 100%
                &:hover
                  background: url("./icon-enter_hover@2x.png")
                  background-size: 100% 100%
</style>
