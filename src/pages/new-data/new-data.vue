<template>
  <div class="new-data">
    <div class="data-header-box">
      <div class="data-header-left">
        <div class="header-left-box">
          <div class="identification survey-box">
            <div class="identification-page">
              <img src="./icon-real_time@2x.png" class="identification-icon">
              <p class="identification-name">订单详情</p>
            </div>
            <div class="function-btn">
              <base-option-box :infoTab="1"></base-option-box>
            </div>
          </div>
          <div class="real-time-box">
            <div class="real-list-box">
              <img src="./icon-money_more@2x.png" class="real-list-box-icon">
              <div class="real-text-box">
                <div class="real-text-top">销售额</div>
                <div class="real-text-bottom">
                  <div class="real-text-number">222380.00</div>
                  <div class="real-text-sale">总销售额: 2222380.00</div>
                </div>
              </div>
            </div>
            <div class="real-list-box">
              <img src="./icon-money_more@2x.png" class="real-list-box-icon">
              <div class="real-text-box">
                <div class="real-text-top">销售额</div>
                <div class="real-text-bottom">
                  <div class="real-text-number">222380.00</div>
                  <div class="real-text-sale">总销售额: 2222380.00</div>
                </div>
              </div>
            </div>
            <div class="real-list-box">
              <img src="./icon-money_more@2x.png" class="real-list-box-icon">
              <div class="real-text-box">
                <div class="real-text-top">销售额</div>
                <div class="real-text-bottom">
                  <div class="real-text-number">222380.00</div>
                  <div class="real-text-sale">总销售额: 2222380.00</div>
                </div>
              </div>
            </div>
            <div class="real-list-box">
              <img src="./icon-money_more@2x.png" class="real-list-box-icon">
              <div class="real-text-box">
                <div class="real-text-top">销售额</div>
                <div class="real-text-bottom">
                  <div class="real-text-number">222380.00</div>
                  <div class="real-text-sale">总销售额: 2222380.00</div>
                </div>
              </div>
            </div>
            <div class="real-list-box">
              <img src="./icon-money_more@2x.png" class="real-list-box-icon">
              <div class="real-text-box">
                <div class="real-text-top">销售额</div>
                <div class="real-text-bottom">
                  <div class="real-text-number">222380.00</div>
                  <div class="real-text-sale">总销售额: 2222380.00</div>
                </div>
              </div>
            </div>
            <div class="real-list-box">
              <img src="./icon-money_more@2x.png" class="real-list-box-icon">
              <div class="real-text-box">
                <div class="real-text-top">销售额</div>
                <div class="real-text-bottom">
                  <div class="real-text-number">222380.00</div>
                  <div class="real-text-sale">总销售额: 2222380.00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="data-header-right">
        <div class="base-box">
          <div class="identification survey-box">
            <div class="identification-page">
              <img src="./icon-real_time@2x.png" class="identification-icon">
              <p class="identification-name">基础功能</p>
            </div>
          </div>
          <div class="base-function-box">
            <div class="base-list-item"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="data-middle-box">
      <div class="data-middle-left">
        <div class="middle-small-left">
          <div class="small-box"></div>
        </div>
        <div class="middle-small-right">
          <div class="small-box"></div>
        </div>
      </div>
      <div class="data-middle-right">
        <div class="small-box"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'NEW_DATA'
  const TITLE = '数据'

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

  .new-data
    overflow: hidden
    flex: 1
    display: flex
    box-sizing: border-box
    flex-direction: column
  .data-header-box
    layout(row)
    display: flex
    .data-header-left
      width: 66.66666%
      height: 260px
      padding-right: 7px
      box-sizing: border-box
      .header-left-box
        width: 100%
        height: 260px
        background: $color-white
        .real-time-box
          layout(row)
          .real-list-box
            height: 100px
            width: 33.33333%
            border-right: 0.5px solid #E9ECEE
            border-bottom: 0.5px solid #E9ECEE
            padding: 0 20px 0 20px
            box-sizing: border-box
            layout(row)
            align-items: center
            .real-list-box-icon
              width: 48px
              height: 48px
              display: block
              margin-right: 20px
            .real-text-box
              layout()
              display: flex
              flex: 1
              .real-text-top
                font-size: $font-size-14
                font-family: $font-family-regular
                color: $color-text-main
                margin-bottom: 10px
              .real-text-bottom
                layout(row)
                align-items: center
                justify-content: space-between
                .real-text-number
                  font-size: 26px
                  font-family: $font-family-din-bold
                  color: $color-text-main
                  line-height: 28px
                .real-text-sale
                  font-size: 12px
                  font-family: $font-family-regular
                  color: #999
          .real-list-box:nth-of-type(3n)
            border-right: 0 solid #E9ECEE
          .real-list-box:nth-of-type(4), .real-list-box:nth-of-type(5), .real-list-box:nth-of-type(6)
            border-bottom: 0 solid #E9ECEE
    .data-header-right
      width: 33.33333%
      height: 260px
      padding-left: 13px
      box-sizing: border-box
      .base-box
        width: 100%
        height: 260px
        background: $color-white
        .base-function-box
          layout(row)
          .base-list-item
            width: 33.3333%
            height: 100px
            border-right: 0.5px solid #E9ECEE
            border-bottom: 0.5px solid #E9ECEE
            padding: 17px 20px 0
  .data-middle-box
    layout(row)
    display: flex
    margin-top: 20px
    .data-middle-left
      width: 66.66666%
      height: 260px
      layout(row)
      display: flex
      padding-right: 7px
    .middle-small-left
      width: 50%
      height: 260px
      padding-right: 10px
      .small-box
        width: 100%
        height: 100%
        background: #333
    .middle-small-right
      width: 50%
      height: 260px
      padding-left: 10px
      .small-box
        width: 100%
        height: 100%
        background: #333
    .data-middle-right
      width: 33.33333%
      height: 260px
      padding-left: 13px
      box-sizing: border-box
      .small-box
        background: #333
        width: 100%
        height: 100%
  .survey-box
    padding: 0 20px
    border-bottom-1px(#E9ECEE)
  .z
    width: 1px
</style>
