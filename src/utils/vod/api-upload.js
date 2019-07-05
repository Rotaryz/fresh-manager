import request from '@utils/request'

export default {
  /**
   * 获取签名
   * @returns {Promise.<*>}
   */
  getUploadSign() {
    const url = `/social-shopping/api/cos/upload-sign`
    return request.get(url, {}, false)
  },
  /**
   * 数据入库
   * @param data
   * @returns {Promise.<*>}
   */
  saveFile(data) {
    const url = `/social-shopping/api/cos/save-file`
    return request.post(url, data)
  }
}
