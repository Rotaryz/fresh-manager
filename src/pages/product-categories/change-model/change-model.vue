<template>
  <default-modal ref="modal">
    <div slot="content" class="default-input">
      <div class="title-input">
        <div class="title">{{numberTitle}}</div>
        <div class="close-box" @click="cancel">
          <div class="close hand"></div>
        </div>
      </div>
      <div class="main-input">
        <div v-if="showCate" class="main-model-box">
          <div class="text">上级分类</div>
          <div class="categories-input-box">
            <base-drop-down :select="dispatchSelect" @setValue="setValue"></base-drop-down>
          </div>
        </div>
        <div class="main-model-box">
          <div class="text">分类名称</div>
          <input v-model="pointName" type="text" maxlength="10" class="main-input-box" :placeholder="numberPla">
        </div>
        <div v-if="showImg" class="main-model-box">
          <div class="text">分类图标</div>
          <div class="img-box hand" :style="{'background-image': 'url(' + (image_url || require('./pic-add_img@2x.png')) + ')'}">
            <div v-if="showLoading" class="loading-mask">
              <img src="./loading.gif" class="loading">
            </div>
            <input type="file" class="sendImage hand" accept="image/*" @change="_addPic($event)">
          </div>
          <span class="tip">建议上传1:1、大小2M以下的图片</span>
        </div>
        <div class="main-model-box">
          <div class="text no-before">排序号</div>
          <input v-model="pointNumber" type="number" class="main-input-box" placeholder="0">
        </div>
        <div class="btn-group">
          <div class="btn cancel" @click="cancel">取消</div>
          <div class="btn confirm" @click="confirm">确定</div>
        </div>
      </div>
    </div>
  </default-modal>
</template>
<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  import API from '@api'
  const COMPONENT_NAME = 'CHANGE_MODEL'

  export default {
    name: COMPONENT_NAME,
    components: {DefaultModal},
    props: {
      numberPla: {
        type: String,
        default: '长度不能超过5位'
      },
      showCate: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        numberTitle: '',
        pointName: '',
        pointNumber: '',
        dispatchSelect: {
          check: false,
          show: false,
          content: '分类',
          type: 'default',
          data: [{name: ''}]
        },
        typeId: 0,
        selectItem: {id: ''},
        showLoading: false,
        image_url: '',
        image_id: '',
        showImg: true
      }
    },
    methods: {
      show(title, {name, sort, imageUrl, imageId, type}) {
        this.numberTitle = title
        this.pointName = name
        this.image_url = imageUrl || ''
        this.pointNumber = sort
        this.image_id = imageId || ''
        this.showImg = type
        this.$refs.modal && this.$refs.modal.showModal()
      },
      hide() {
        this.$refs.modal && this.$refs.modal.hideModal()
      },
      // 添加图片
      async _addPic(e) {
        this.showLoading = true
        let param = this._infoImage(e.target.files[0])
        e.target.value = ''
        await this._upImage(param)
      },
      // 格式化图片流
      _infoImage(file) {
        let param = new FormData() // 创建form对象
        param.append('file', file, file.name) // 通过append向form对象添加数据
        return param
      },
      // 上传banner图片
      async _upImage(param) {
        let res = await API.Upload.UploadImg(param)
        this.showLoading = false
        if (res.error !== this.$ERR_OK) {
          this.$toast.show(res.message)
          return
        }
        this.image_url = res.data.url
        this.image_id = res.data.id
      },
      setData(item, data) {
        this.typeId = item.id
        this.dispatchSelect.content = item.name
        this.dispatchSelect.data = data
      },
      confirm() {
        this.$emit('confirm', {
          name: this.pointName,
          sort: this.pointNumber,
          id: this.typeId,
          imageId: this.image_id,
          imageUrl: this.image_url,
          type: this.showImg
        })
      },
      cancel() {
        this.hide()
        this.$emit('cancel')
      },
      setValue(item) {
        this.typeId = item.id
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
    .title-input
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
      .close
        width: 12px
        height: @width
        icon-image('icon-close')
    .main-input
      padding: 10px 0 16px
      .main-input-box
        width: 310px
        height: 44px
        border: 1px solid $color-line
        border-radius: 1px
        font-family: $font-family-regular
        color: $color-text-main
        font-size: $font-size-14
        padding-left: 14px
        transition: all 0.3s
        &::-webkit-inner-spin-button
          appearance: none
        &:hover
          border: 1px solid #ACACAC
        &::placeholder
          font-family: $font-family-regular
          color: $color-text-assist
        &:focus
          border-color: $color-main !important
  .btn-group
    margin-top: 40px
    text-align: center
    display: flex
    justify-content: flex-end
    user-select :none
    .btn
      width: 96px
      height: 40px
      line-height: 40px
      border-radius: 1px
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
    .one-btn
      margin-left :0
  .main-model-box
    layout(row)
    align-items: center
    margin-bottom: 24px
    .text
      color: #666
      font-size: $font-size-14
      font-family: $font-family-regular
      width: 68px
      margin-right: 13px
      &:before
        content: "*"
        color: #F52424
    .no-before
      padding-left: 7px
      box-sizing: border-box
      &:before
        content: ""
    .img-box
      height: 44px
      width: 44px
      background-repeat: no-repeat
      background-size: cover
      background-position: center
      background-image: url('./pic-add_img@2x.png')
      position: relative
      border: 0.5 pxsolid #F2F2F2
      border-radius: 1px
      box-sizing: border-box
      margin-right: 10px
      .sendImage
        position: absolute
        width: 100%
        left: 0
        height: 100%
        top: 0
        opacity: 0
        z-index: 1
      .loading-mask
        width: 100%
        height: 100%
        position: absolute
        top: 0
        left: 0
        background: rgba(0, 0, 0, .6)
      .loading
        all-center()
        width: 25px
        height: 25px
    .tip
      font-size: 14px
      font-family: $font-family-regular
      color: #ACACAC
</style>
