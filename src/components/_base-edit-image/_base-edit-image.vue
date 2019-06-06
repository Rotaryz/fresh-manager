<template>
  <div>
    <div v-if="fileType === 'image'" class="edit-image">
      <draggable v-model="picList" class="draggable" @update="_setSort()">
        <div v-for="(item, index) in picList" :key="index" class="show-image hand" :style="{'background-image': 'url(\'' + item.image_url + '\')'}">
          <span v-if="isEdit" class="close" @click="_del(index)"></span>
        </div>
      </draggable>
      <div v-if="picList.length < picNum" class="add-image hand">
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
  const EDIT_IMAGE = 'BASE_EDIT_IMAGE'

  export default {
    name: EDIT_IMAGE,
    components: {
      Draggable
    },
    props: {
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
        showLoading: false
      }
    },
    methods: {
      _setSort() {},
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
        let param = new FormData() // 创建form对象
        param.append('file', file, file.name) // 通过append向form对象添加数据
        return param
      },
      async _upImage(param) {
        let res = await API.Upload.UploadImg(param)
        this.showLoading = false
        if (res.error !== this.$ERR_OK) {
          this.$emit('failFile', res.message)
          return
        }
        this.$emit('getPic', res.data)
      },
      _addVideo(e) {
      // this.showLoading = true
      // let arr = Array.from(e.target.files)
      // e.target.value = ''
      // let size = (arr[0].size / 1024 / 1024)
      // console.log(size)
      // if (size > 30) {
      //   this.showLoading = false
      //   this.$emit('failFile', '视频大小不能超过30M')
      //   return
      // }
      // this.$vod.uploadFiles(arr[0], curr => {
      // }).then(res => {
      //   this.showLoading = false
      //   if (res.error !== ERR_OK) {
      //     this.$emit('failFile', res.message)
      //     return
      //   }
      //   this.$emit('successVideo', res.data)
      // }).catch(err => {
      //   this.showLoading = false
      //   this.$emit('failFile', err)
      // })
      }
    }
  }
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

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
    .sendImage
      height: 100%
      width: 100%
      top: 0
      left: 0
      opacity: 0
      z-index: 1
      position: absolute

  .add-video
    icon-image('pic-video')

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

    .video-tag
      width: 100%
      height: 100%
      object-fit: cover

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
