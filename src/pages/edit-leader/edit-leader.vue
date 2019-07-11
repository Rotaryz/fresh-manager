<template>
  <div class="edit-leader detail-content">
    <div class="identification">
      <div class="identification-page">
        <img src="./icon-bandit_list@2x.png" class="identification-icon">
        <p class="identification-name">{{id ? '编辑团长' : '新建团长'}}</p>
      </div>
      <div class="function-btn">
      </div>
    </div>
    <div class="content-header">
      <div class="content-title">基本信息</div>
    </div>
    <div class="leader-box">
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          团长账号
        </div>
        <div class="edit-input-box">
          <input v-model="leaderData.mobile"
                 oninput="if(value.length > 11)value = value.slice(0, 11)"
                 type="number"
                 class="edit-input"
                 :disabled="id"
                 @mousewheel.native.prevent
          >
        </div>
        <div class="edit-msg">团长账号为手机号，绑定微信，不能修改</div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          社区名称
        </div>
        <div class="edit-input-box">
          <input v-model="leaderData.social_name" type="text" class="edit-input" maxlength="20">
        </div>
      </div>
    </div>
    <div class="content-header">
      <div class="content-title">收货信息</div>
    </div>
    <div class="leader-box">
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          团长名称
        </div>
        <div class="edit-input-box">
          <input v-model="leaderData.name" type="text" class="edit-input" maxlength="10">
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          微信号
        </div>
        <div class="edit-input-box">
          <input v-model="leaderData.wx_account" type="text" class="edit-input">
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          社区地址
        </div>
        <div class="edit-input-box">
          <city-select ref="city" @setValue="_getCity"></city-select>
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          详细地址
        </div>
        <div class="edit-input-box">
          <textarea v-model="leaderData.address" class="edit-text" maxlength="50"></textarea>
        </div>
      </div>
    </div>

    <!--佣金设置-->
    <div class="content-header">
      <div class="content-title">佣金设置<span class="text"></span></div>
    </div>
    <div class="activity-box">
      <div class="activity-tab">
        <div class="edit-title">
          <span class="start">*</span>
          <span>选择类型</span>
        </div>
        <div class="check-box hand" @click="selectCommission">
          <span class="check" :class="{'checked': +leaderData.commission_type === 1}"></span>
          <span class="text">固定比例佣金</span>
        </div>
        <div class="check-box hand" @click="selectCommission">
          <span class="check" :class="{'checked': +leaderData.commission_type === 2}"></span>
          <span class="text">阶梯比例佣金</span>
          <div class="explain-wrapper">
            <img src="./icon-help@2x.png" alt="" class="detail-icon hand">
            <div class="static-explain">
              <div class="explain">
                1.根据团长上月销售额，计算下月佣金比例；<br>
                2.如果是新创建的团长，第一个月，佣金比例按照最低一档计算。<br>
                3.设置完成立即生效。<br><br>
                例：满1000，佣金7%；满2000，佣金9%<br>
                团长上个月销售额为2000以上（含2000），那他下个月的佣金比例为9%
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="+leaderData.commission_type === 1" class="fixed-main">
        <input v-model="leaderData.fixed_rate" placeholder="佣金结算以实际交易价为准" type="text" class="fixed-commission">
        <span class="mark">%</span>
      </div>
      <div v-if="+leaderData.commission_type === 2" class="rate-main">
        <p class="title">
          <span class="left">月度销售金额</span>
          <span class="right">佣金比例</span>
        </p>
        <transition-group>
          <div v-for="(item, index) in ladder_rules" :key="index" class="rate-list">
            <div class="left">
              <input v-model="item.money"
                     type="text"
                     :placeholder="index === 0 ? 0 : ''"
                     :readonly="index === 0"
                     class="left-input"
                     :class="{'disabled': index === 0}"
                     @blur="numBlur(index)"
              >
              <img src="./icon-ride@2x.png" alt="" class="icon">
              <span class="text">大于{{index === 0 ? '等于' : '（不含）'}}</span>
            </div>
            <div class="right">
              <input v-model="item.rate" type="text" class="right-input" @blur="rateBlur(index)">
              <span class="mark">%</span>
              <img v-if="index > 1" src="./icon-trash@2x.png" class="del-icon hand" @click="delCommission(index)">
            </div>
          </div>
        </transition-group>
        <p class="add-list hand" @click="addCommission">添加阶梯佣金</p>
      </div>
      <!--<p class="add-list hand" @click="testData">测试数据</p>-->
    </div>
    <div class="back">
      <div class="back-cancel back-btn hand" @click="_back">返回</div>
      <div class="back-btn back-submit" @click="submit">保存</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import CitySelect from '@components/city-select/city-select'
  import API from '@api'
  import _ from 'lodash'

  const PAGE_NAME = 'EDIT_LEADER'
  const TITLE = '新建团长'
  const NUM = /^(([1-9][0-9]*)|([1-9][0-9]*\.\d{1,2}))$/
  const REG_NUM = /^(([1-9][0-9]*)|([1-9][0-9]*\.\d{1,2})|([0-9])|([0-9]*\.\d{1,2}))$/

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      CitySelect
    },
    props: {
      detail: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        id: null,
        leaderData: {
          mobile: '',
          social_name: '',
          name: '',
          wx_account: '',
          province: '',
          city: '',
          district: '',
          address: '',
          longitude: '',
          latitude: '',
          fixed_rate: '7',
          commission_type: 1
        },
        isSubmit: false,
        checked: true,
        ladder_rules: [{money: '0', rate: ''}, {money: '', rate: ''}]
      }
    },
    created() {
      this.id = this.$route.query.id || null
    },
    mounted() {
      this._setData()
      if (this.id) {
        this.leaderData = _.cloneDeep(this.detail)
        this.ladder_rules = this.leaderData.ladder_rules
        if (this.ladder_rules.length < 2) {
          this.ladder_rules = [{money: '0', rate: ''}, {money: '', rate: ''}]
        }
        if (+this.leaderData.commission_type === 2) {
          this.$set(this.leaderData, 'fixed_rate', '7')
        } else if (+this.leaderData.commission_type === 1) {
          this.ladder_rules = [{money: '0', rate: ''}, {money: '', rate: ''}]
        }
      }
    },
    methods: {
      _back() {
        this.$router.back()
      },
      selectCommission() {
        this.leaderData.commission_type = +this.leaderData.commission_type === 1 ? 2 : 1
      },
      addCommission() {
        this.ladder_rules.push({})
      },
      delCommission(index) {
        this.ladder_rules.splice(index, 1)
      },
      numBlur(index) {
        if (this.ladder_rules[index].rate && index > 1) {
          for (let i = 0; i < this.ladder_rules.length; i++) {
            for (let j = i + 1; j < this.ladder_rules.length; j++) {
              if (+this.ladder_rules[i].money > +this.ladder_rules[j].money) {
                let obj = this.ladder_rules[i]
                this.$set(this.ladder_rules, i, this.ladder_rules[j])
                this.$set(this.ladder_rules, j, obj)
              }
            }
          }
        }
      },
      rateBlur(index) {
        if (this.ladder_rules[index].money && index > 1) {
          for (let i = 0; i < this.ladder_rules.length; i++) {
            for (let j = i + 1; j < this.ladder_rules.length; j++) {
              if (+this.ladder_rules[i].money > +this.ladder_rules[j].money) {
                let obj = this.ladder_rules[i]
                this.$set(this.ladder_rules, i, this.ladder_rules[j])
                this.$set(this.ladder_rules, j, obj)
              }
            }
          }
        }
      },
      submit() {
        if (this.isSubmit) {
          return
        }
        if (!this._isDataValidate()) {
          return
        }
        let result = this.testRateData()
        if (!result && +this.leaderData.commission_type === 2) return
        this.isSubmit = false
        let address = this.leaderData.province + this.leaderData.city + this.leaderData.district + this.leaderData.address
        let oAjax = new XMLHttpRequest()
        oAjax.open(
          'GET',
          `https://restapi.amap.com/v3/geocode/geo?address=${address}&key=${process.env.VUE_APP_KEY}`,
          true
        )
        oAjax.send()
        oAjax.onreadystatechange = async () => {
          if (oAjax.readyState === 4 && oAjax.status === 200) {
            let res = JSON.parse(oAjax.responseText)
            let location = res.geocodes[0].location.split(',')
            this.leaderData.longitude = location[0]
            this.leaderData.latitude = location[1]
            let data = Object.assign(this.leaderData, {ladder_rules: this.ladder_rules})
            if (this.id) {
              // 编辑团长
              res = await API.Leader.editLeader(this.id, data)
            } else {
              // 新建团长
              res = await API.Leader.storeLeader(data)
            }

            this.$loading.hide()
            this.$toast.show(res.message)
            if (res.error !== this.$ERR_OK) {
              this.isSubmit = false
              this.$toast.show(res.message)
              return
            }
            setTimeout(() => {
              this.isSubmit = false
            }, 2000)
            setTimeout(() => {
              this._back()
            }, 1000)
          }
        }
      },
      testData() {
        this.testRateData()
      },
      testRateData() {
        let testArr = this.ladder_rules.map((item, index) => {
          if (
            index > 0 &&
            +this.leaderData.commission_type === 2 &&
            (!item.money || item.money < 0 || !NUM.test(item.money) || +item.money.split('.')[1] > 0)
          ) {
            this.$toast.show('请输入正整数销售金额')
            return 'false'
          } else if (+this.leaderData.commission_type === 2 && !REG_NUM.test(item.rate)) {
            this.$toast.show('请输入0%-100%之间的佣金值,保留2位小数。')
            return 'false'
          } else if (+this.leaderData.commission_type === 2 && item.rate > 100) {
            this.$toast.show('请输入0%-100%之间的佣金值')
            return 'false'
          } else if (+this.leaderData.commission_type === 2 && item.rate < 0) {
            this.$toast.show('请输入0%-100%之间的佣金值')
            return 'false'
          }
        })
        let repeat = this.ladder_rules.map((item) => {
          let findArr = this.ladder_rules.filter((val) => {
            return item.money === val.money
          })
          if (findArr.length > 1) {
            this.$toast.show('销售金额输入重复')
            return 'false'
          }
        })
        testArr = testArr.concat(repeat)
        let result = testArr.every((item) => {
          return item !== 'false'
        })
        return result
      },
    /**
     * 设置默认数据 -> 编辑状态
     * @private
     */ _setData() {
      if (!_.isEmpty(this.detail)) {
        this.$refs.city.infoCity([this.detail.province, this.detail.city, this.detail.district])
        this.leaderData = this.detail
      }
    },
      _isDataValidate() {
        if (!this.leaderData.mobile || this.leaderData.mobile.length !== 11) {
          this.$toast.show('请输入正确的团长账号')
          return
        } else if (!this.leaderData.social_name) {
          this.$toast.show('请输入正确的社区名称')
          return
        } else if (!this.leaderData.name) {
          this.$toast.show('请输入正确的团长名称')
          return
        } else if (!this.leaderData.wx_account) {
          this.$toast.show('请输入正确的微信号')
          return
        } else if (!this.leaderData.province) {
          this.$toast.show('请选择正确的省份')
          return
        } else if (!this.leaderData.city) {
          this.$toast.show('请选择正确的城市')
          return
        } else if (!this.leaderData.district) {
          this.$toast.show('请选择正确的区/县')
          return
        } else if (!this.leaderData.address) {
          this.$toast.show('请输入正确的详情地址')
          return
        } else if (!REG_NUM.test(this.leaderData.fixed_rate) && +this.leaderData.commission_type === 1) {
          this.$toast.show('请输入0%-100%之间的佣金比例，保留2位小数')
          return
        } else if (+this.leaderData.fixed_rate < 0 && +this.leaderData.commission_type === 1) {
          this.$toast.show('请输入0%-100%之间的佣金比例')
          return
        } else if (+this.leaderData.fixed_rate > 100 && +this.leaderData.commission_type === 1) {
          this.$toast.show('请输入0%-100%之间的佣金比例')
          return
        }
        return true
      },
      _getCity(data) {
        // 获取地址
        this.leaderData.province = data[0].includes('请选择') ? '' : data[0]
        this.leaderData.city = data[1].includes('请选择') ? '' : data[1]
        this.leaderData.district = data[2].includes('请选择') ? '' : data[2]
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/detail"

  .edit-leader
    padding-bottom: 80px
    position: relative
    flex: 1

  .leader-box
    padding: 0 20px
    box-sizing: border-box
    margin-bottom: 35px
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
        margin-left: 40.9px
      .edit-input
        font-size: $font-size-14
        padding: 0 14px
        border-radius: 2px
        width: 400px
        height: 40px
        border: 0.5px solid $color-line
        transition: all 0.3s
        box-sizing: border-box
        &::-webkit-inner-spin-button
          appearance: none
        &:hover
          border: 0.5px solid #ACACAC
        &::placeholder
          font-family: $font-family-regular
          color: $color-text-assist
        &:focus
          border-color: $color-main !important
      .edit-text
        font-size: $font-size-14
        padding: 10px 14px
        border-radius: 2px
        width: 400px
        height: 70px
        border: 0.5px solid $color-line
        transition: all 0.3s
        resize: none
        outline: none
        &:hover
          border: 1px solid #ACACAC
        &::placeholder
          font-family: $font-family-regular
          color: $color-text-assist
        &:focus
          border-color: $color-main !important
      .edit-msg
        line-height: 40px
        font-size: $font-size-14
        color: #acacac
        margin-left: 10px
  .content-title .text
    color: $color-text-assist
    font-size: $font-size-14
  .activity-box
    margin-top: 25px
    position: relative
    .activity-tab
      display: flex
      algin-items: center
      .edit-title
        color: #2A2A2A
        font-size: $font-size-14
        font-family: $font-family-regular
        text-align: right
        width: 90px
        margin-right: 40px
        .start
          display: inline-block
          color: #F52424
      .check-box
        display: flex
        align-items: center
        margin-right: 50px
        .check
          width: 16px
          height: 16px
          border: 1px solid #E1E1E1
          border-radius: 50%
          transition: all 0.3s
          display: flex
          justify-content: center
          align-items: center
          margin-right: 10px
        .checked
          border: 5px solid $color-main
        .text
          color: $color-text-main
          font-family: $font-family-regular
          font-size: $font-size-14
        .explain-wrapper
          position: relative
          width: 16px
          height: 16px
          margin-left: 4px
          display: flex
          flex-direction: column
          align-items: center
          opacity: .8
          .detail-icon
            width: 16px
            height: 16px
          &:hover .static-explain
            opacity: .8
            visibility: initial
          .static-explain
            position: absolute
            display: flex
            justify-content: center
            bottom: 25px
            width: 374px
            visibility: hidden
            opacity: 0
            transition: opacity .3s
            &:after
              position: absolute
              bottom: -6px
              display: block
              content: ''
              width: 0
              height: 0
              border-left: 4px solid transparent
              border-right: 4px solid transparent
              border-top: 6px solid #32323A
            .explain
              padding: 12px
              border-radius: 4px
              line-height: 20px
              font-family: $font-family-regular
              font-size: $font-size-12
              white-space: normal
              transition: opacity .3s
              color: $color-white
              background: #32323A
              z-index: 111

    .fixed-main
      width: 523px
      height: 80px
      background: #F5F7FA
      display: flex
      align-items: center
      padding-left: 28px
      box-sizing: border-box
      margin-left: 128px
      margin-top: 20px
      border: 0.5px solid #E9ECEE
      .fixed-commission
        width: 278px
        height: 40px
        padding: 0 12px
        box-sizing: border-box
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-text-main
        margin-right: 10px
        border: 0.5px solid $color-line
        &:hover
          border: 1px solid #ACACAC
        &::placeholder
          font-family: $font-family-regular
          color: $color-text-assist
        &:focus
          border-color: $color-main !important
        &::-webkit-input-placeholder{
          font-family: $font-family-regular
          color: $color-text-assist
        }
    .rate-main
      width: 564px
      background: #F5F7FA
      padding: 20px 28px
      box-sizing: border-box
      margin-left: 128px
      margin-top: 20px
      border: 0.5px solid #E9ECEE
      font-family: $font-family-regular
      font-size: $font-size-14
      .title
        display: flex
        align-items: center
        color: #999
        font-family: $font-family-regular
        .left
          width: 184px
        .right
          width: 317px
      .rate-list
        display: flex
        align-items: center
        margin-top: 15px
        .left
          width: 184px
          position: relative
          .left-input
            width: 163px
            height: 40px
            padding-left: 87px
            padding-right: 9px
            color: $color-text-main
            font-family: $font-family-regular
            border: 0.5px solid $color-line
            box-sizing: border-box
            &:hover
              border: 1px solid #ACACAC
            &::placeholder
              font-family: $font-family-regular
              color: $color-text-assist
            &:focus
              border-color: $color-main !important
          .disabled
            color: $color-text-assist
          .text
            color: $color-text-assist
            col-center()
            left: 10px
          .icon
            width: 14px
            height: 14px
            margin: 0 3px
        .right
          width: 325px
          .right-input
            width: 266px
            height: 40px
            padding: 0 9px
            color: $color-text-main
            font-family: $font-family-regular
            border: 0.5px solid $color-line
            &:hover
              border: 1px solid #ACACAC
            &::placeholder
              font-family: $font-family-regular
              color: $color-text-assist
            &:focus
              border-color: $color-main !important
          .mark
            margin-left: 10px
            color: #333
          .del-icon
            width: 13px
            height: 14px
            margin-left: 20px
      .add-list
        color: #3E77C3
        text-decoration: underline
        margin-top: 20px
        display: inline-block
</style>
