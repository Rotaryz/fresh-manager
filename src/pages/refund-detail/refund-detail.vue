<template>
  <div class="refund-detail">
    <div class="detail-item">
      <div class="top">
        <div class="title">基本信息</div>
        <div class="line"></div>
      </div>
      <div class="bot sobot">
        <div class="info-item">退货单号：{{detail.after_sale_order_sn}}</div>
        <div class="info-item">申请时间：{{detail.created_at}}</div>
        <div class="info-item">退货原因：{{detail.remark}}</div>
        <div class="info-item">原订单号：{{detail.order_sn}}</div>
        <div class="info-item">会员名称：{{detail.nickname}}</div>
        <div class="info-item">会员手机：{{detail.mobile}}</div>
        <div class="info-item">退款金额：{{detail.after_sale_total && `¥ ${detail.after_sale_total}`}}</div>
        <div class="info-item">退货单类型：全额退款</div>
      </div>
    </div>
    <div class="detail-item">
      <div class="top">
        <div class="title">审核信息</div>
        <div class="line"></div>
      </div>
      <div class="bot sobot">
        <div class="info-item">社区名称：{{detail.social_name}}</div>
        <div class="info-item">团长名称：{{detail.shop_name}}</div>
        <div class="info-item">团长手机：{{detail.shop_mobile}}</div>
        <div class="info-item">审核时间：{{detail.updated_at}}</div>
        <div class="info-item">退货单状态：{{detail.status_str}}</div>
        <div class="info-item">提货地址：{{detail.shop_address}}</div>
      </div>
    </div>
    <div class="detail-item">
      <div class="top">
        <div class="title">商品清单</div>
        <div class="line"></div>
      </div>
      <div class="bot goods-list">
        <div class="list-header">
          <div v-for="(item, index) in titleList" :key="index" class="list-item">
            {{item}}
          </div>
        </div>
        <div class="list">
          <div class="list-box">
            <div class="list-item list-text">{{detail.goods_name}}</div>
            <div class="list-item list-text">{{detail.goods_units}}</div>
            <div class="list-item list-text">{{detail.num}}</div>
            <div class="list-item list-text">{{detail.price && `¥ ${detail.price}`}}</div>
            <div class="list-item list-text">{{detail.total && `¥ ${detail.total}`}}</div>
            <div class="list-item list-text">{{detail.after_sale_num}}</div>
            <div class="list-item list-text">{{detail.after_sale_total && `¥ ${detail.after_sale_total}`}}</div>
          </div>
        </div>
        <div class="list-footer">
          <div class="list-foot-box">
            <div v-if="false" class="foot-item">退款总金额：{{detail.after_sale_total && `¥ ${detail.after_sale_total}`}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="back">
      <div class="back-btn btn-main" @click="_back">返回</div>
    </div>
    <default-modal ref="modal">
      <div slot="content">
        <div class="Auditing">
          <div class="top">
            <div class="title">审核</div>
            <div class="close" @click.stop="hideModal"><img class="close-img" src="./icon-close@2x.png" alt=""></div>
          </div>
          <div class="textarea-box">
            <span class="after"></span>
            <textarea v-model="remark" placeholder="备注原因" class="modelarea"></textarea>
            <span class="before"></span>
          </div>
          <div class="btn-group">
            <div class="btn-item" @click.stop="hideModal">取消</div>
            <div class="btn-item" @click.stop="auditing(0)">驳回</div>
            <div class="btn-item" @click.stop="auditing(1)">批准退款</div>
          </div>
        </div>
      </div>
    </default-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import {returnsComputed} from '@state/helpers'
  import DefaultModal from '@components/default-modal/default-modal'
  import API from '@api'

  const PAGE_NAME = 'REFUND_DETAIL'
  const TITLE = '退款详情'
  const TITLELIST = ['商品名称', '下单单位', '下单数量', '下单单价', '下单金额', '退款数量', '退款金额']

  export default {
    name: PAGE_NAME,
    components: {
      DefaultModal
    },
    page: {
      title: TITLE
    },
    data() {
      return {
        titleList: TITLELIST,
        remark: ''
      }
    },
    computed: {
      ...returnsComputed
    },
    methods: {
      auditing(isAgree) {
        let data = {
          id: this.checkId,
          remark: this.remark,
          is_agree: isAgree
        }
        this.hideModal()
        API.Order.checkApply(data)
          .then((res) => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            this.$toast.show(res.message)
          })
          .catch((error) => {
            this.$toast.show(error)
          })
          .finally(() => {
            this.$loading.hide()
          })
      },
      checkApply(id) {
        this.checkId = id
        this.$refs.modal.showModal()
      },
      hideModal() {
        this.$refs.modal.hideModal()
      },
      _back() {
        this.$router.back()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .refund-detail
    width: 100%
    padding-bottom: 80px
    .detail-item
      layout()
      .top
        height: 62px
        border-bottom: 1px solid $color-line
        layout(row)
        position: relative
        .title
          padding-top: 30px
          padding-bottom: 16px
          height: 62px
          box-sizing: border-box
          font-family: $font-family-medium
          font-size: $font-size-16
          color: $color-text-main
        .line
          transition: all .3s
          background: $color-positive
          height: 2px
          width: 34px
          position: absolute
          left: 0
          bottom: 0
      .bot
        layout(row)
        flex-wrap: warp
        .info-item
          font-family: $font-family-regular
          font-size: $font-size-14
          color: $color-text-main
          line-height: 18px
          width: 220px
          padding-bottom: 20px
          margin-right: 80px
          word-break: break-all
          &:last-child
            width: 320px
            margin-right: 0
      .sobot
        padding: 30px 0 0px 15px
        width: 1280px
        box-sizing: border-box
      .goods-list
        margin: 28px 0px 0px
        width: 100%
        padding: 0 15px
        box-sizing: border-box
        .list-footer
          background: $color-white
          layout(row)
          align-items: center
          justify-content: flex-end
          width: 100%
          padding: 20px 0 102px
          .list-foot-box
            width: 136px
            layout(row)
          .foot-item
            font-family: $font-family-regular
            font-size: $font-size-14
            color: $color-text-main
            margin-left: 48px
            &:first-child
              margin-left: 0
        .list
          width: 100%
          background: $color-white
          .list-box
            width: 100%
            padding-left: 30px
            layout(row)
            white-space: nowrap
            height: 60px
            box-sizing: border-box
            align-items: center
            background: $color-white
            border-bottom: 1px solid $color-line
            .list-item
              font-family: $font-family-regular
              font-size: $font-size-14
              color: $color-text-main
        .list-header
          width: 100%
          layout(row)
          padding-left: 30px
          white-space: nowrap
          box-sizing: border-box
          align-items: center
          height: 50px
          background: #F9F9F9
          border-bottom: 1px solid $color-line
          .list-item
            font-family: $font-family-regular
            font-size: $font-size-16
            color: $color-text-main
            line-height: 16px
    .list-text
      no-wrap()
      width: 90%
    .list-item
      &:nth-child(1)
        flex: 1.5
        no-wrap()
        box-sizing: border-box
        padding-right: 30px
      &:nth-child(2), &:nth-child(3), &:nth-child(4), &:nth-child(5), &:nth-child(6)
        flex: 1
        white-space: normal !important
        word-break: break-all
      &:last-child
        flex: 0.5

  .go-btn
    position: fixed
    bottom: 50px
    height: 80px
    layout(row)
    align-items: center
    padding: 15px
    .btn-item
      background: $color-positive
      border: 1px solid $color-positive
      border-radius: 4px
      width: 90px
      cursor: pointer
      color: $color-white
      font-family: $font-family-regular
      font-size: $font-size-16
      line-height: 40px
      text-align: center
      height: 40px

  textarea::-webkit-input-placeholder
    font-size: $font-size-14
    color: #ACACAC

  .Auditing
    width: 534px
    height: 261px
    background: $color-white
    border-radius: 3px
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.6)
    text-align: center
    .top
      height: 59.5px
      border-bottom: 1px solid $color-line
      align-items: center
      justify-content: space-between
      padding: 0 20px
      layout(row)
      .title
        font-family: $font-family-medium
        font-size: $font-size-16
        color: $color-text-main
      .close
        width: 16px
        height: 16px
        .close-img
          width: 16px
          height: 16px
          display: block
    .textarea-box
      .modelarea
        font-size: $font-size-14
        width: 494px
        resize: none
        height: 80px
        padding: 12px
        margin: 30px auto 30px
        border: 1px solid $color-line
    .btn-group
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
        border-radius: 4px
        font-family: $font-family-regular
        font-size: $font-size-16
        color: $color-text-main
        height: 40px
        &:nth-child(2)
          color: $color-positive
          border-color: $color-positive
        &:nth-child(3)
          background: $color-positive
          color: $color-white
          border-color: $color-positive

  .back
    justify-content: center
    position: fixed
    left: 200px
    right: 0px
    bottom: 0
    z-index: 10
    background: #F9F9F9
    height: 80px
    border-radius: 0 0 6px 6px
    display: flex
    align-items: center
    .back-btn
      font-size: $font-size-16
      margin-left: 40px
      padding: 12px 32px
</style>
