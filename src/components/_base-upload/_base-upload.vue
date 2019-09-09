<template>
  <div class="disabled">
    <div v-if="fileType === 'image-custom'" class="custom-item edit-image">
      <div v-if="showLoading" class="loading-mask">
        <img src="./loading.gif" class="loading">
      </div>
      <input :multiple="multiple" type="file" class="sendImage hand" accept="image/*" @change="_addPic">
      <slot>
        上传图片
      </slot>
    </div>
    <div v-if="fileType === 'video-custom'" class="custom-item edit-image">
      <div v-if="showLoading" class="loading-mask">
        <img src="./loading.gif" class="loading">
      </div>
      <input type="file" class="sendImage hand" :accept="videoType" @change="_addVideo">
      <slot>
        上传视频
      </slot>
    </div>
    <div v-if="fileType === 'image-video'" class="edit-image">
      <div v-if="videoUrl || imageUrl" class="show-image hand" :style="{'background-image': 'url(\'' + imageUrl + '\')'}">
        <span v-if="!disabled" class="close" @click="_del()"></span>
        <video v-if="videoUrl" :src="videoUrl" class="video-tag"></video>
      </div>
      <div v-else class="add-image add-image-video">
        <div v-if="showLoading" class="loading-mask">
          <img src="./loading.gif" class="loading">
        </div>
        <div class="operate-wrap">
          <div class="operate-item hand">
            上传图片
            <input type="file" class="sendImage hand" accept="image/*" @change="_addPic">
          </div>
          <div class="operate-item hand">
            上传视频
            <input type="file" class="sendImage hand" :accept="videoType" @change="_addVideo">
          </div>
        </div>
      </div>
    </div>
    <div v-if="fileType === 'image'" class="edit-image">
      <div v-if="imageUrl" class="show-image hand" :style="{'background-image': 'url(\'' + imageUrl + '\')'}">
        <span v-if="!disabled" class="close" @click="_del()"></span>
      </div>
      <div v-else :class="['add-image','hand',imageIconClassName]">
        <input type="file" :multiple="multiple" class="sendImage hand" accept="image/*" @change="_addPic">
        <div v-if="showLoading" class="loading-mask">
          <img src="./loading.gif" class="loading">
        </div>
      </div>
    </div>
    <div v-if="fileType === 'video'" class="edit-image">
      <div v-if="videoUrl" width="90px" class="show-image hand">
        <video class="video-tag" :src="item.image_url"></video>
        <span v-if="!disabled" class="close" @click="_del()"></span>
      </div>
      <div v-else class="add-image add-video hand">
        <input type="file" class="sendImage hand" accept="video/*" @change="_addVideo">
        <div v-if="showLoading" class="loading-mask">
          <img src="./loading.gif" class="loading">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {uploadFiles as vod} from '@utils/vod/vod'
  import {uploadFiles as cos} from '@utils/cos/cos'
  const EDIT_IMAGE = 'BASE_EDIT_IMAGE'

  export default {
    name: EDIT_IMAGE,
    props: {
      multiple: {
        type: Boolean,
        default: false
      },
      uploadCount: {
        type: Number,
        default: 1
      },
      videoUrl: {
        type: String,
        default: ''
      },
      imageUrl: {
        type: String,
        default: ''
      },
      ratioImage: {
        type: Array, // 图片比例范围
        default: () => []
      },
      width: {
        type: String,
        default: ''
      },
      height: {
        type: String,
        default: ''
      },
      imageIconClassName: {
        type: String,
        default: ''
      },
      showMorePic: {
        type: Boolean, // 是否多个图/视频
        default: true
      },
      fileType: {
        type: String,
        default: 'image'
      },
      disabled: {
        type: Boolean, // 1 为开启  0为关闭
        default: false
      },
      videoSize: {
        type: Number, // 单位 m
        default: 100
      },
      imageSize: {
        type: Number, // 单位 m
        default: 10
      },
      videoType: {
        type: String,
        default: 'video/mp4,video/3gp,video/m3u8,video/webm'
      }
    },
    data() {
      return {
        coverImage: '',
        showLoading: false
      }
    },
    methods: {
      _del() {
        if (this.disabled) {
          return
        }
        this.$emit('delPic')
      },
      async _addPic(e) {
        this.showLoading = true
        await cos('image', Array.from(e.target.files))
          .then((arr) => {
            this.showLoading = false
            arr.length &&
              arr.forEach((item) => {
                if (item.error !== this.$ERR_OK) {
                  this.$emit('failFile', item.message)
                  return
                }
                this.$emit('getPic', item.data)
              })
          })
          .catch((err) => {
            this.$emit('failFile', err)
            this.showLoading = false
          })
      },
      _addVideo(e) {
        let arr = Array.from(e.target.files)
        e.target.value = ''
        let size = arr[0].size / 1024 / 1024
        if (size > this.videoSize) {
          this.$loading.hide()
          this.$emit('failFile', '视频大小不能超过' + this.videoSize + 'M')
          return
        }
        this.$loading.show('视频上传中...')
        vod(arr[0], (curr) => {
          this.$loading.showCurr(curr)
        })
          .then((res) => {
            this.$loading.hide()
            if (res.error !== this.$ERR_OK) {
              this.$emit('failFile', res.message)
              return
            }
            this.$emit('successVideo', res.data)
          })
          .catch((err) => {
            this.$loading.hide()
            this.$emit('failFile', err)
          })
      }
    }
  }
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .hand
    cursor pointer

  .custom-item
    position: relative

  .edit-image
    flex-wrap: wrap
    display: flex

    .draggable
      flex-wrap: wrap
      display: flex

  .add-image
    icon-image('pic-picture1')
    height: 90px
    width: @height
    position: relative
    border-radius: 2px
    overflow: hidden
    position: relative

  .input-wrap
    width: 100%
    height: 100%
    position: relative

  .sendImage
    height: 100%
    width: 100%
    top: 0
    left: 0
    opacity: 0
    z-index: 1
    position: absolute
    font-size: 0

  .add-image-head-photo
    icon-image('pic-head_author')

  .add-video
    icon-image('pic-video')

  .add-image-video
    margin-bottom: 0px
    icon-image('pic-select_pic')

    .operate-wrap
      cursor pointer
      visibility hidden
      position: absolute
      top: 0
      right: 0
      bottom: 0
      left: 0
      background rgba(0, 0, 0, 0.5)
      display: flex
      flex-direction column
      align-items center
      justify-content: space-between
      padding: 17px 10px

      .operate-item
        position: relative
        width: 70px
        height: 22px
        line-height: 22px
        border-radius 11px
        text-align center
        background #FFFFFF
        cursor pointer
        font-size $font-size-12

    &:hover
      .operate-wrap
        visibility: visible

  .show-image
    background-color $color-np-content
    background-repeat: no-repeat
    background-size: cover
    background-position: center
    height: 90px
    margin-right: 20px
    width: @height
    border-radius: 2px
    position: relative
    overflow: hidden

    &:last-child
      margin-right: 0px

    .video-tag
      width: 100%
      height: 100%
      object-fit: cover
      background-color $color-np-content

    .full-video
      visibility hidden

  .close
    icon-image('pic-delete')
    width: 15px
    height: 15px
    position: absolute
    top: 0
    right: 0
    z-index: 100

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
</style>
