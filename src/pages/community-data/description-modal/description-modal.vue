<template>
  <default-modal ref="modal">
    <div slot="content" class="default-input">
      <div class="title-box">
        <div class="title">
          {{type === 'quality' ? '群等级说明' : '数据说明'}}
        </div>
        <span class="close hand" @click="cancel"></span>
      </div>
      <p class="table-title">社群等级条件:</p>
      <div v-if="type === 'quality'" class="main-data">
        <div class="data-table">
          <div v-for="(item, index) in data.qualification" :key="index" class="table-list">
            <span v-for="(lv, ind) in item" :key="ind" class="cell" :class="{'grey': index === 0}">{{lv}}</span>
          </div>
        </div>
      </div>
      <p class="table-title">社群评级考核指标:</p>
      <div v-if="type === 'quality'" class="main-data">
        <div class="data-table">
          <div class="table-list">
            <span class="item item-title grey">名称</span>
            <span class="item grey">分数占比</span>
            <span class="item grey">指标</span>
          </div>
          <div v-for="(val, ind) in data.quote" :key="ind" class="table-list">
            <span class="item title">{{val.name}}</span>
            <span v-for="(item, index) in val.data" :key="index" class="item">{{item}}</span>
          </div>
        </div>
        <div class="text-list">
          <p v-for="(txt, index) in text" :key="index" class="text" :class="{'text-margin': index === 2}">{{txt}}</p>
        </div>
        <div class="btn-group">
          <div class="btn confirm" @click="confirm">确定</div>
        </div>
      </div>

      <div v-if="type === 'business'" class="main-data">
        <p class="main-text">如何增加营收金额？</p>
        <p class="main-text">营收金额 = 主力客户 x 复购率 x 笔单价(主力客户、复购率、笔单价的各项数值持续上升，营收金额也持续增长)</p>
        <div class="btn-group">
          <div class="btn confirm" @click="confirm">确定</div>
        </div>
      </div>
    </div>
  </default-modal>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'

  const COMPONENT_NAME = 'EDIT_MODAL'

  const DATA = {
    qualification: [
      ['Lv1', 'Lv2', 'Lv3', 'Lv4'],
      ['1~39分', '40~59分', '60~79分', '80~100分']
    ],
    quote: [
      {
        name: '分享链接的浏览数',
        data: ['20分', '4000']
      },
      {
        name: '访客数',
        data: ['20分', '200']
      },
      {
        name: '交易额',
        data: ['20分', '3000']
      },
      {
        name: '支付用户数',
        data: ['20分', '200']
      },
      {
        name: '支付订单数',
        data: ['20分', '200']
      }
    ]
  }

  const TEXT = [
    'A社群(分数计算方式：D=天；Y=指标数值；M=占比分数；Z=获得分数)',
    '计算公式：Z=(D1+D2+D3)÷Y×M',
    '例如：浏览数第一天840、第二天1200、第三天734',
    '(840+1200+734)÷400x20=13.8'
  ]


  export default {
    name: COMPONENT_NAME,
    components: {DefaultModal},
    props: {
      numberPla: {
        type: String,
        default: '请输入团长账号'
      }
    },
    data() {
      return {
        data: DATA,
        text: TEXT,
        type: ''
      }
    },
    methods: {
      show(type) {
        this.type = type
        this.$refs.modal && this.$refs.modal.showModal()
      },
      hide() {
        this.$refs.modal && this.$refs.modal.hideModal()
      },
      confirm() {
        this.hide()
      },
      cancel() {
        this.hide()
        this.$emit('cancel')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .default-input
    background: #fff
    width: 534px
    border-radius: 2px
    padding: 0 20px 60px
    .title-box
      display: flex
      box-sizing: border-box
      padding: 23px 0
      align-items: center
      justify-content: space-between
      .title
        font-size: $font-size-16
        font-family: $font-family-medium
        line-height: 1
        color: $color-text-main
        font-weight: 600
      .close
        width: 12px
        height: @width
        icon-image('icon-close')
    .table-title
      font-size: $font-size-14
      color: #333
      font-family: $font-family-regular
    .main-data
      padding: 8px 0 28px
      .data-table
        border-radius: 2px
        border-1px($color-line)
        font-size: $font-size-12
        font-family: $font-family-regular
        color: #666
        .cell
          display: inline-block
          width: 25%
          height: 50px
          line-height: 50px
          text-align: center
          box-sizing: border-box
          border-bottom-1px($color-line)
          border-left-1px($color-line)
          font-size: $font-size-12
      .table-list
        height: 50px
        display: flex
        &:last-child .item,&:last-child .cell
          &:after
            border-bottom: 0
        &:first-child .item,.table-title
          border-top-1px($color-line)
      .item
        width: 30%
        height: 50px
        line-height: 50px
        text-align: center
        border-bottom-1px($color-line)
        border-left-1px($color-line)
        font-size: $font-size-12
      .title,.item-title
        width: 40%
        height: 50px
        background: #F5F7FA
        line-height: 16px
        padding: 0 20px
        display: flex
        align-items: center
        border-left: 0
        text-align: left
      .grey
        background: #F5F7FA
      .main-text
        color: #666
        font-family: $font-family-regular
        font-size: $font-size-16
        display: block
        &:first-child
          margin-bottom: 10px
    .text-list
      margin-top: 14px
      color: #999
      font-family: $font-family-regular
      font-size: $font-size-14
      .text-margin
        margin-top: 8px
  .btn-group
    text-align: center
    display: flex
    justify-content: flex-end
    user-select: none
    .btn
      width: 96px
      height: 40px
      line-height: 40px
      border-radius: 2px
      border: 1px solid $color-text-D9
      cursor: pointer
      transition: all 0.3s
    .cancel
      border: 1px solid $color-line
      &:hover
        color: $color-text-sub
        border-color: $color-text-sub
    .confirm
      border: 1px solid $color-main
      background: $color-main
      color: $color-white
      margin-left: 20px
      &:hover
        opacity: 0.8
  .main-model-box
    layout(row)
    align-items: center
    margin-bottom: 24px
    .text
      color: #666
      font-size: $font-size-14
      font-family: $font-family-regular
      width: 80px
      margin-right: 20px
      &:before
        content: "*";
        color: #f52424;
</style>
