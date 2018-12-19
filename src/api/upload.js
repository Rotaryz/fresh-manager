import request from '@utils/request'

export default {
  UploadImg(data, loading = false) {
    let url = '/social-shopping/api/cos/upload-image'
    return request.post(url, data, loading)
  },
  /**
   * 导入
   * @param data
   * @param loading
   * @returns {*}
   * @constructor
   */
  importFile(data, loading = false) {
    let url = '/social-shopping/api/backend/store-purchase-import'
    return request.post(url, data, loading)
  }
}
