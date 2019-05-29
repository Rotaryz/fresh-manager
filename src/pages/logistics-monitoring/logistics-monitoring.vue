<template>
  <div class="logistics-monitoring">
    <div class="header-wrapper">
      <div class="title-wrapper">
        <i class="icon-task"></i>
        <span class="title">任务中心</span>
      </div>
      <div class="time-wrapper">
        <span class="time">2019.05.22</span>
        <div class="time-group">
          <span class="item active">今天</span>
          <span class="item">7天</span>
          <span class="item">30天</span>
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
                <span class="big-count">96</span>
                <span class="small-count">/117</span>
              </div>
            </div>
            <div class="content-wrapper">
              <div class="item-wrapper">
                <p class="title">待发布</p>
                <p class="count">11</p>
                <i class="icon-arrow"></i>
              </div>
              <div class="item-wrapper">
                <p class="title">待采购</p>
                <p class="count">10</p>
                <i class="icon-arrow"></i>
              </div>
              <div class="item-wrapper">
                <p class="title">已完成</p>
                <p class="count">96</p>
                <i class="icon-arrow"></i>
              </div>
            </div>
            <div class="progress-wrapper">
              <div class="progress">
                <div class="progress-item" :style="{width: `${11 / 117 * 100}%`, background: `rgba(120,121,251,${1/3})`}">待发布</div>
                <div class="progress-item" :style="{width: `${10 / 117 * 100}%`, background: `rgba(120,121,251,${2/3})`}">待采购</div>
                <div class="progress-item" :style="{width: `${96 / 117 * 100}%`, background: `rgba(120,121,251,${3/3})`}">已完成</div>
              </div>
            </div>
          </div>
          <div class="status-container success">
            <div class="status-wrapper">
              <div class="status">正常</div>
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
                <span class="big-count">60</span>
                <span class="small-count">/99</span>
              </div>
            </div>
            <div class="content-wrapper">
              <div class="item-wrapper">
                <p class="title">待进库</p>
                <p class="count">11</p>
                <i class="icon-arrow"></i>
              </div>
              <div class="item-wrapper">
                <p class="title">待理货</p>
                <p class="count">10</p>
                <i class="icon-arrow"></i>
              </div>
              <div class="item-wrapper">
                <p class="title">待上架</p>
                <p class="count">18</p>
                <i class="icon-arrow"></i>
              </div>
              <div class="item-wrapper">
                <p class="title">已完成</p>
                <p class="count">60</p>
                <i class="icon-arrow"></i>
              </div>
            </div>
            <div class="progress-wrapper">
              <div class="progress">
                <div class="progress-item" :style="{width: `${11 / 99 * 100}%`, background: `rgba(120,121,251,${1/4})`}">待进库</div>
                <div class="progress-item" :style="{width: `${10 / 99 * 100}%`, background: `rgba(120,121,251,${2/4})`}">待理货</div>
                <div class="progress-item" :style="{width: `${18 / 99 * 100}%`, background: `rgba(120,121,251,${3/4})`}">待上架</div>
                <div class="progress-item" :style="{width: `${60 / 99 * 100}%`, background: `rgba(120,121,251,${4/4})`}">已完成</div>
              </div>
            </div>
          </div>
          <div class="status-container error">
            <div class="status-wrapper">
              <div class="status">异常</div>
            </div>
            <div class="detail-wrapper">
              <div class="detail">
                <p class="content">异常单：5</p>
                <p class="content">异常品：8</p>
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
                <span class="big-count">144</span>
                <span class="small-count">/144</span>
              </div>
            </div>
            <div class="content-wrapper">
              <div class="item-wrapper">
                <p class="title">待分拣</p>
                <p class="count">0</p>
                <i class="icon-arrow"></i>
              </div>
              <div class="item-wrapper">
                <p class="title">待配货</p>
                <p class="count">0</p>
                <i class="icon-arrow"></i>
              </div>
              <div class="item-wrapper">
                <p class="title">已完成</p>
                <p class="count">144</p>
                <i class="icon-arrow"></i>
              </div>
            </div>
            <div class="progress-wrapper">
              <div class="progress">
                <div class="progress-item" :style="{width: `${0 / 144 * 100}%`, background: `rgba(120,121,251,${1/3})`}">待分拣</div>
                <div class="progress-item" :style="{width: `${0 / 144 * 100}%`, background: `rgba(120,121,251,${2/3})`}">待配货</div>
                <div class="progress-item" :style="{width: `${144 / 144 * 100}%`, background: `rgba(120,121,251,${3/3})`}">已完成</div>
              </div>
            </div>
          </div>
          <div class="status-container success">
            <div class="status-wrapper">
              <div class="status">正常</div>
            </div>
            <div v-if="false" class="detail-wrapper">
              <div class="detail">
                <p class="content">异常单：5</p>
                <p class="content">异常品：8</p>
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
                <span class="big-count">0</span>
                <span class="small-count">/75</span>
              </div>
            </div>
            <div class="content-wrapper">
              <div class="item-wrapper">
                <p class="title">待复核</p>
                <p class="count">0</p>
                <i class="icon-arrow"></i>
              </div>
              <div class="item-wrapper">
                <p class="title">待出库</p>
                <p class="count">75</p>
                <i class="icon-arrow"></i>
              </div>
              <div class="item-wrapper">
                <p class="title">已完成</p>
                <p class="count">0</p>
                <i class="icon-arrow"></i>
              </div>
            </div>
            <div class="progress-wrapper">
              <div class="progress">
                <div class="progress-item" :style="{width: `${0 / 75 * 100}%`, background: `rgba(120,121,251,${1/3})`}">待复核</div>
                <div class="progress-item" :style="{width: `${75 / 75 * 100}%`, background: `rgba(120,121,251,${2/3})`}">待出库</div>
                <div class="progress-item" :style="{width: `${0 / 75 * 100}%`, background: `rgba(120,121,251,${3/3})`}">已完成</div>
              </div>
            </div>
          </div>
          <div class="status-container error">
            <div class="status-wrapper">
              <div class="status">异常</div>
            </div>
            <div v-if="true" class="detail-wrapper">
              <div class="detail">
                <p class="content">异常单：11</p>
                <p class="content">异常品：6</p>
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
                <span class="big-count">0</span>
                <span class="small-count">/99</span>
              </div>
            </div>
            <div class="content-wrapper">
              <div class="item-wrapper">
                <p class="title">待拣货</p>
                <p class="count">99</p>
                <i class="icon-arrow"></i>
              </div>
              <div class="item-wrapper">
                <p class="title">待配送</p>
                <p class="count">0</p>
                <i class="icon-arrow"></i>
              </div>
              <div class="item-wrapper">
                <p class="title">已完成</p>
                <p class="count">0</p>
                <i class="icon-arrow"></i>
              </div>
            </div>
            <div class="progress-wrapper">
              <div class="progress">
                <div class="progress-item" :style="{width: `${99 / 99 * 100}%`, background: `rgba(120,121,251,${1/3})`}">待拣货</div>
                <div class="progress-item" :style="{width: `${0 / 99 * 100}%`, background: `rgba(120,121,251,${2/3})`}">待配送</div>
                <div class="progress-item" :style="{width: `${0 / 99 * 100}%`, background: `rgba(120,121,251,${3/3})`}">已完成</div>
              </div>
            </div>
          </div>
          <div class="status-container normal">
            <div class="status-wrapper">
              <div class="status">执行中</div>
            </div>
            <div v-if="false" class="detail-wrapper">
              <div class="detail">
                <p class="content">异常单：11</p>
                <p class="content">异常品：6</p>
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
                <span class="big-count">4</span>
                <span class="small-count">/48</span>
              </div>
            </div>
            <div class="content-wrapper">
              <div class="item-wrapper">
                <p class="title">待处理</p>
                <p class="count">44</p>
                <i class="icon-arrow"></i>
              </div>
              <div class="item-wrapper">
                <p class="title">已完成</p>
                <p class="count">4</p>
                <i class="icon-arrow"></i>
              </div>
            </div>
            <div class="progress-wrapper">
              <div class="progress">
                <div class="progress-item" :style="{width: `${44 / 48 * 100}%`, background: `rgba(120,121,251,${1/2})`}">待处理</div>
                <div class="progress-item" :style="{width: `${4 / 48 * 100}%`, background: `rgba(120,121,251,${2/2})`}">已完成</div>
              </div>
            </div>
          </div>
          <div class="status-container normal">
            <div class="status-wrapper">
              <div class="status">执行中</div>
            </div>
            <div v-if="false" class="detail-wrapper">
              <div class="detail">
                <p class="content">异常单：11</p>
                <p class="content">异常品：6</p>
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
  const PAGE_NAME = 'LOGISTICS_MNITORING'
  const TITLE = '物流监控'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {

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
            margin-left: 21px
            color: #666666
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
                justify-content: center
                width: 100%
                height: 18px
                border-radius: 18px
                overflow: hidden
                .progress-item
                  width: 0
                  height: 18px
                  line-height: 18px
                  text-align: center
                  font-size: $font-size-12
                  color: $color-white
                  transition: all 0.5s
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
            transition: width .5s
            &.success
              background-color: #4dbd65
            &.error
              background-color: #fc5a61
              &:hover
                width: 180px
                .status-wrapper
                  opacity: 0
                  visibility: hidden
                .detail-wrapper
                  visibility: initial
                  right: 0
                  display: flex
                  opacity: 1
            &.normal
              background-color: #c6c6c6
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
              right: -180px
              visibility: hidden
              display: flex
              align-items: center
              justify-content: space-between
              width: 180px
              height: 100%
              padding: 0 20px
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
                width: 26px
                height: 26px
                background: url("./icon-enter_normal@2x.png")
                background-size: 100% 100%
                &:hover
                  background: url("./icon-enter_hover@2x.png")
                  background-size: 100% 100%
</style>
