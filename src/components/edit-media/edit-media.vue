<template>
  <div slot="middle" class="edit-media">
    <div class="edit-image">
      <draggable v-model="dragList" class="draggable">
        <div v-for="(item, index) in dataArray" :key="index" class="show-image hand" :class="fileType">
          <img v-if="fileType==='image'" class="img" :src="item[imgUrlKey]" alt="">
          <video v-if="fileType==='video'" class="img" :src="item[imgUrlKey]"></video>
          <img v-if="fileType==='video'" src="./icon-play_upload.png" alt="" class="icon-video-button">
          <span class="close" @click="deleteMediaHandle(index)"></span>
        </div>
      </draggable>
      <div v-if="dataArray.length < maxFiles" class="add-image hand" :class="fileType">
        <input type="file" class="sendImage hand" :multiple="maxFiles > 1" :accept="fileType + '/*'" @change="addMediaHandle">
        <div v-if="showLoading" class="loading-mask">
          <img src="./loading.gif" class="loading">
        </div>
      </div>
    </div>
    <div v-if="explain" class="tip">{{explain}}</div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Draggable from 'vuedraggable'

  const COMPONENT_NAME = 'EDIT_MEDIA'

  export default {
    name: COMPONENT_NAME,
    components: {
      Draggable
    },
    props: {
      dataArray: {
        type: Array,
        default: () => []
      },
      imgUrlKey: {
        type: String,
        default: 'image_url'
      },
      fileType: {
        type: String,
        default: 'image'
      },
      maxFiles: {
        type: Number,
        default: 1
      },
      mediaKey: {
        type: String,
        default: ''
      },
      explain: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        showLoading: false
      }
    },
    computed: {
      dragList: {
        get() {
          return this.dataArray
        },
        set(value) {
          this.$emit('drag', this.mediaKey, value)
        }
      }
    },
    methods: {
      deleteMediaHandle(index) {
        this.$emit('del', this.mediaKey, index)
      },
      addMediaHandle(e) {
        this.showLoading = true
        let arr = Array.from(e.target.files)
        if (this.dataArray.length) {
          arr = arr.slice(0, this.maxFiles - this.dataArray.length)
        } else {
          arr = arr.slice(0, this.maxFiles)
        }
        if (this.fileType === 'image') {
          this.$cos.uploadFiles(this.$cosFileType.IMAGE_TYPE, arr).then((resArr) => {
            this.showLoading = false
            this.$emit('gain', this.mediaKey, resArr, this.fileType)
          }).catch(() => {
            this.showLoading = false
          })
        } else {
          Promise.all(arr.map(item => {
            return this.$vod.uploadFiles(item)
          })).then((resArr) => {
            this.showLoading = false
            this.$emit('gain', this.mediaKey, resArr, this.fileType)
          }).catch(() => {
            this.showLoading = false
          })
        }
        e.target.value = ''
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .edit-media
    margin-left: 40.9px
  .edit-image
    flex-wrap: wrap
    display: flex
    .draggable
      flex-wrap: wrap
      display: flex
    .add-image
      margin-bottom: 20px
      icon-image('pic-picture1')
      height: 90px
      width: @height
      position: relative
      border-radius: 2px
      overflow: hidden
      &.add-video
        icon-image('pic-video_upload')
      &.add-img-video
        icon-image('pic-videopic_upload')
      .sendImage
        height: 100%
        width: 100%
        top: 0
        left: 0
        opacity: 0
        z-index: 1
        position: absolute
    .show-image
      margin-bottom: 20px
      background-repeat: no-repeat
      background-size: cover
      background-position: center
      height: 90px
      margin-right: 20px
      width: @height
      border-radius: 2px
      position: relative
      overflow: hidden
      .icon-video-button
        width: 26px
        height: @width
        all-center()
      .video
        height: 90px
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

  .add-image
    margin-bottom: 20px
    height: 90px
    width: @height
    position: relative
    border-radius: 2px
    overflow: hidden
    &.image
      icon-image('pic-picture1')
    &.video
      icon-image('pic-video_upload')
    .sendImage
      height: 100%
      width: 100%
      top: 0
      left: 0
      opacity: 0
      z-index: 1

  .img
    width :100%
    height :@width
    display :block
    object-fit :cover

  .tip
    text-align: left
    margin-top: -6px
    font-size: $font-size-14
    color: $color-text-assist
    font-family: $font-family-regular
</style>
