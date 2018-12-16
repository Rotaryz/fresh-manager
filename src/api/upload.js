import request from '@utils/request'

export default {
  UploadImg(data, loading = false) {
    let url = '/social-shopping/api/cos/upload-image'
    return request.post(url, data, loading)
  }
}
