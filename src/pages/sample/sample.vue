<template>
  <div class="sample">
    <h1>截图上传</h1>
    <cropper ref="cropper" @confirm="cropperConfirm($event)"></cropper>
    <input type="file" accept="image/*" @change="_fileChange($event, 'images')">
    <hr>
    <h1>直接上传</h1>
    <input type="file" accept="image/*" @change="_fileChange($event, 'images-only')">
    <img v-if="testSrc" style="width: 100%" :src="testSrc" alt="">
    <hr>
    <h1>点播上传</h1>
    <input type="file" accept="video/*" @change="_fileChange($event, 'video')">
    <video v-if="testVideo" :src="testVideo" style="width: 100vw"></video>
    <hr>
    <h1>二维码</h1>
    <button @click="createQrCode">生成二维码</button>
    <router-link tag="h1" to="/hello-world/other-pages">
      跳其他页面
    </router-link>
    <base-router-view></base-router-view>
  </div>
</template>

<script>
  import Cropper from '@components/cropper/cropper'
  import API from '@api'
  import wx from 'weixin-js-sdk'

  const PAGE_NAME = 'SAMPLE'

  export default {
    name: PAGE_NAME,
    components: {
      Cropper
    },
    data() {
      return {
        testSrc: '',
        testVideo: ''
      }
    },
    created() {
      console.log(process.env)
      this.$loading.show()
      setTimeout(() => {
        this.$loading.hide()
      }, 1500)
      this._getWxSdk()
    },
    methods: {
      createQrCode() {
        let str = JSON.stringify({code: 8297128291, store_id: 8}) // todo
        let img = this.$createQrCode.png(str) // png
        // img = this.$createQrCode.svg(str) // svg
        this.testSrc = img
      // this.$createQrCode.pngAsync(str, pic => { // 异步 todo
      //   this.testSrc = pic
      // })
      },
      _getWxSdk() {
        let url = window.location.href
        API.Global.jssdkConfig({url}).then((res) => {
          if (res.error === this.$ERR_OK) {
            res = res.data
            wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: '' + res.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
              timestamp: '' + res.timestamp, // 必填，生成签名的时间戳
              nonceStr: '' + res.nonceStr, // 必填，生成签名的随机串
              signature: '' + res.signature, // 必填，签名，见附录1
              jsApiList: ['previewImage', 'scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            })
          }
        })
      },
      _fileChange(e, type) {
        let arr = Array.from(e.target.files)
        if (arr.length <= 0) {
          return
        }
        switch (type) {
        case 'images':
          this.$refs.cropper.show(arr[0])
          break
        case 'images-only':
          this.$cos.uploadFiles(this.$cosFileType.IMAGE_TYPE, arr).then((resArr) => {
            this.$loading.hide()
            let arr = []
            resArr.map((item) => {
              if (item.error !== this.$ERR_OK) {
                return this.$toast.show(item.message)
              }
              let obj = {
                image_id: item.data.id,
                image_url: item.data.url,
                id: 0
              }
              arr.push(obj)
            })
            this.testSrc = arr[0].image_url
          })
          break
        case 'video':
          this.$loading.show('视频上传中...')
          this.$vod
            .uploadFiles(arr[0], (curr) => {
              this.$loading.showCurr(curr)
            })
            .then((res) => {
              this.$loading.hide()
              if (res.error !== this.$ERR_OK) {
                this.$toast.show(res.message)
                return
              }
              this.testVideo = res.vod.videoUrl
            })
          break
        default:
          break
        }
      },
      async cropperConfirm(e) {
        this.$loading.show()
        let resArr = await this.$cos.uploadFiles(this.$cosFileType.IMAGE_TYPE, [e.file])
        let res = resArr[0]
        if (res.error !== this.$ERR_OK) {
          return this.$toast.show(res.message)
        }
        let obj = {
          image_id: res.data.id,
          image_url: res.data.url,
          id: 0
        }
        this.testSrc = obj.image_url
        this.$loading.hide()
        this.$refs.cropper.cancel()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .sample
    fill-box()
      bottom: $tab-height
</style>
