import request from '@utils/request'

export default {
  /**
   * 获取签名
   * @returns {Promise.<*>}
   */
  getUploadSign() {
    const url = `/post_vod_sign`
    return request.post(url, {}, false)
  },
  /**
   * 数据入库
   * @param data
   * @returns {Promise.<*>}
   */
  saveFile(data) {
    const url = `/api/merchant/check_default_image`
    return request.post(url, data)
  }
}
