<template>
  <div>
    <div v-if="fileType === 'image-custom'" class="custom-item edit-image">
      <div v-if="showLoading" class="loading-mask">
        <img src="./loading.gif" class="loading">
      </div>
      <input type="file" class="sendImage hand" accept="image/*" @change="_addPic">
      <slot>
        上传图片
      </slot>
    </div>
    <div v-if="fileType === 'video-custom'" class="custom-item edit-image">
      <div v-if="showLoading" class="loading-mask">
        <img src="./loading.gif" class="loading">
      </div>
      <input type="file" class="sendImage hand" accept="video/*" @change="_addVideo">
      <slot>
        上传视频
      </slot>
    </div>
    <div v-if="fileType === 'image-video'" class="edit-image">
      <draggable v-model="picList" class="draggable" @update="_setSort()">
        <div v-for="(item, index) in picList" :key="index" class="show-image hand" :style="{'background-image': 'url(\'' + item.image_url + '\')'}">
          <span v-if="isEdit" class="close" @click="_del(index)"></span>
          <video v-if="item.video_url" :src="item.video_url" class="video-tag"></video>
          <video v-if="item.video_url && isGetVedioCoverImage"
                 ref="fullVideo"
                 :src="item.video_url"
                 crossOrigin="anonymous" class="full-video"
                 @loadeddata="loadedVedio"
          ></video>
        </div>
      </draggable>
      <div v-if="picList.length < picNum" class="add-image add-image-video">
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
            <input type="file" class="sendImage hand" accept="video/*" @change="_addVideo">
          </div>
        </div>
      </div>
    </div>
    <div v-if="fileType === 'image'" class="edit-image">
      <draggable v-model="picList" class="draggable" @update="_setSort()">
        <div v-for="(item, index) in picList" :key="index" class="show-image hand" :style="{'background-image': 'url(\'' + item.image_url + '\')'}">
          <span v-if="isEdit" class="close" @click="_del(index)"></span>
        </div>
      </draggable>
      <div v-if="picList.length < picNum" :class="['add-image','hand',imageIconClassName]">
        <input type="file" class="sendImage hand" accept="image/*" @change="_addPic">
        <div v-if="showLoading" class="loading-mask">
          <img src="./loading.gif" class="loading">
        </div>
      </div>
    </div>
    <div v-if="fileType === 'video'" class="edit-image">
      <div v-for="(item, index) in picList" :key="index" width="90px" class="show-image hand">
        <video class="video-tag" :src="item.image_url"></video>
        <span v-if="isEdit" class="close" @click="_del(index)"></span>
      </div>
      <div v-if="picList.length < picNum" class="add-image add-video hand">
        <input type="file" class="sendImage hand" accept="video/*" @change="_addVideo">
        <div v-if="showLoading" class="loading-mask">
          <img src="./loading.gif" class="loading">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import API from '@api'
  import Draggable from 'vuedraggable'
  import {uploadFiles} from '../../utils/vod/vod'

  const EDIT_IMAGE = 'BASE_EDIT_IMAGE'

  export default {
    name: EDIT_IMAGE,
    components: {
      Draggable
    },
    props: {
      isGetVedioCoverImage:{
        type: Boolean,
        default: true
      },
      imageIconClassName: {
        type: String,
        default: ''
      },
      showMorePic: {
        type: Boolean, // 是否多个图/视频
        default: true
      },
      picList: {
        type: Array, // 图片/视频列表
        default: () => []
      },
      picNum: {
        // 图片/视频数量
        type: Number,
        default: 5
      },
      fileType: {
        type: String,
        default: 'image'
      },
      isEdit: {
        type: Number, // 1 为开启  0为关闭
        default: 1
      }
    },
    data() {
      return {
        coverImage:'',
        showLoading: false
      }
    },
    methods: {
      async loadedVedio() {
        var canvas = document.createElement("canvas");
        let video = this.$refs.fullVideo[0]
        console.log('video', video)
        let scale =1
        canvas.width = video.videoWidth * scale
        canvas.height = video.videoHeight * scale
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        let imgsrc = canvas.toDataURL("image/png")
        this.coverImage = imgsrc
        let param = this._infoImage(this.coverImage)
        console.log(this.coverImage)

        await this._upImage(param)
      },
      _setSort() {
      },
      _del(index) {
        if (!this.isEdit) {
          return
        }
        this.$emit('delPic', index)
      },
      async _addPic(e) {
        this.showLoading = true
        let param = this._infoImage(e.target.files[0])
        e.target.value = ''
        await this._upImage(param)
      },
      // 格式化图片流
      _infoImage(file) {
        console.log(file)
        let param = new FormData() // 创建form对象
        param.append('file', file, file.name) // 通过append向form对象添加数据
        return param
      },
      async _upImage(param) {
        console.log(param)
        let res = await API.Upload.UploadImg(param)
        this.showLoading = false
        if (res.error !== this.$ERR_OK) {
          this.$emit('failFile', res.message)
          return
        }
        console.log('successImage', res)
        this.$emit('getPic', res.data)
      },
      _addVideo(e) {
        this.showLoading = true
        console.log(e.target.files)
        let arr = Array.from(e.target.files)
        e.target.value = ''
        let size = (arr[0].size / 1024 / 1024)
        console.log(size)
        if (size > 30) {
          this.showLoading = false
          this.$emit('failFile', '视频大小不能超过30M')
          return
        }
        uploadFiles(arr[0], curr => {
        }).then(res => {
          this.showLoading = false
          if (res.error !== this.$ERR_OK) {
            this.$emit('failFile', res.message)
            return
          }
          this.$emit('successVideo', res.data)
          console.log('successVideo111', res)
        }).catch(err => {
          this.showLoading = false
          this.$emit('failFile', err)
        })
      }
    }
  }
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .custom-item
    position: relative

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
    position: relative


  .sendImage
    height: 100%
    width: 100%
    top: 0
    left: 0
    opacity: 0
    z-index: 1
    position: absolute

  .add-image-head-photo
    icon-image('pic-head_author')

  .add-video
    icon-image('pic-video')

  .add-image-video
    margin-bottom: 0px
    icon-image('pic-select_pic')

    .operate-wrap
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
      justify-content: space-around

      .operate-item
        position: relative
        width: 70px
        height: 22px
        line-height: 22px
        border-radius 11px
        text-align center
        background #FFFFFF
        cursor pointer

    &:hover
      .operate-wrap
        visibility: visible

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

    &:last-child
      margin-right: 0px

    .video-tag
      width: 100%
      height: 100%
      object-fit: cover
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
