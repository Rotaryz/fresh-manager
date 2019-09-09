<template>
  <default-modal ref="modal">
    <div slot="content" class="describe-box">
      <div class="describe-content">
        <div class="title-box">
          <div v-if="type === 'unit'" class="title">{{tipInfo.title}}</div>
          <div v-if="type === 'purchase'" class="title">什么是集采</div>
          <div v-if="type === 'code'" class="title"></div>
          <span class="close hand" @click="hide"></span>
        </div>
        <div class="content-text">
          <template v-if="type === 'unit'">
            <ul class="example-wrapper">
              <li v-for="(item, index) in tipInfo.list" :key="index" class="example">
                <p class="tip-icon">{{item.title}}</p>
                <p class="tip-text">
                  <span v-for="(ct, cIdx) in item.content" :key="cIdx" :class="ct.cname || ''">{{ct.text}}</span>
                </p>
              </li>
            </ul>
          </template>
          <template v-if="type === 'purchase'">
            <div class="context">
              集采是集中采购的简称，设置为集采的商品，可被添加到集采活动中进行售卖。
              消费者在活动期间下单支付，当活动结束后由商家统一采购商品，再统一配送
              给社区消费者。
            </div>
          </template>
          <template v-if="type === 'code'">
            <img src="./pic-tiaoma@2x.png" alt="" class="code-image">
          </template>
        </div>
      </div>
    </div>
  </default-modal>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'

  const COMPONENT_NAME = 'DESCRIBE_POP'

  const TPL = {
    unit: {
      title: '基本单位示例',
      list: [
        {
          title: '示例1',
          content: [
            {
              text: '苹果: 采购散装后自己包装，按“kg”存放在仓库，则'
            },
            {
              text: '基本单位',
              cname: 'mark'
            },
            {
              text: '建议设置为'
            },
            {
              text: 'kg',
              cname: 'mark'
            }
          ]
        },
        {
          title: '示例2',
          content: [
            {
              text: '苹果: 采购供应商已包装好的，按“份”存放在仓库，则'
            },
            {
              text: '基本单位',
              cname: 'mark'
            },
            {
              text: '建议设置为'
            },
            {
              text: '份',
              cname: 'mark'
            }
          ]
        },
        {
          title: '示例3',
          content: [
            {
              text: '酸奶: 采购1件30盒，按“盒”存放在仓库，则'
            },
            {
              text: '基本单位',
              cname: 'mark'
            },
            {
              text: '建议设置为'
            },
            {
              text: '盒',
              cname: 'mark'
            }
          ]
        }
      ]
    },
    purchaseUnit: {
      title: '采购单位示例',
      list: [
        {
          title: '示例1',
          content: [
            {
              text: '苹果，基本单位是“kg”，按份售卖则销售规格为'
            },
            {
              text: '1份=0.5kg',
              cname: 'mark'
            }
          ]
        },
        {
          title: '示例2',
          content: [
            {
              text: '苹果，基本单位是“份”，按份售卖则销售规格为'
            },
            {
              text: '1份=1份',
              cname: 'mark'
            }
          ]
        },
        {
          title: '示例3',
          content: [
            {
              text: '酸奶，基本单位是“盒”，按份售卖则销售规格为'
            },
            {
              text: '1件=1盒',
              cname: 'mark'
            }
          ]
        }
      ]
    },
    sellUnit: {
      title: '销售单位示例',
      list: [
        {
          title: '示例1',
          content: [
            {
              text: '苹果: 基本单位是“kg”，按件销售，则销售规格为'
            },
            {
              text: '1件=30kg',
              cname: 'mark'
            }
          ]
        },
        {
          title: '示例2',
          content: [
            {
              text: '苹果: 基本单位是“份”，按份销售，则销售规格为'
            },
            {
              text: '1份=1份',
              cname: 'mark'
            }
          ]
        },
        {
          title: '示例3',
          content: [
            {
              text: '酸奶: 基本单位是“盒”，按件销售，则销售规格为'
            },
            {
              text: '1件=30盒',
              cname: 'mark'
            }
          ]
        }
      ]
    }
  }

  export default {
    name: COMPONENT_NAME,
    components: {DefaultModal},
    props: {
      popType: {
        type: String,
        default: 'unit'
      }
    },
    data() {
      return {
        tipInfo: TPL['unit'],
        type: this.popType
      }
    },
    methods: {
      show(type = 'unit', textType = 'unit') {
        this.type = type
        this.tipInfo = TPL[textType]
        this.$refs.modal && this.$refs.modal.showModal()
      },
      hide() {
        this.$refs.modal && this.$refs.modal.hideModal()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .describe-box
    background: #fff
    border-radius: 3px
    box-shadow: 0 8px 14px 0 rgba(12, 6, 14, 0.08)
    text-align: center
    padding: 0 20px
    box-sizing: border-box
    position: relative
    .title-box
      display: flex
      box-sizing: border-box
      padding: 20px 0 0
      align-items: center
      justify-content: space-between
      .title
        font-size: $font-size-16
        font-family: $font-family-medium
        line-height: 1
        color: $color-text-main
      .close
        width: 12px
        height: @width
        icon-image('icon-close')

  /*基本单位示例*/
  .example-wrapper
    padding-bottom: 23px
    padding-top: 30px
    font-family: PingFangSC-Regular;
    font-size: 14px;
    text-align :left
    .example
      width: 494px
      background: #F5F7FA;
      border: 0.5px solid #E9ECEE;
      margin-bottom :20px
      &:last-child
        margin-bottom : 0
      .tip-icon
        height :24px
        width: 58px
        box-sizing:border-box
        background: #666666;
        color: #FFFFFF;
        border-radius: 0 0 20px 0;
        line-height :24px
        text-align :center
      .tip-text
        padding :18px 10px 19px
        line-height :1.2
        .mark
          color: $color-main


  /*什么是集采*/
  .context
    padding-top: 25px
    text-align: left
    padding-bottom: 30px
    width: 490px
    font-size: $font-size-14
    color: #666
    font-family: $font-family-regular
    line-height: 1.4
  /*条形码*/
  .code-image
    padding-top: 5px
    padding-bottom: 35px
    width: 282px
</style>
