import request from '@utils/request'

export default {
  /**
   * 内容詳情
   * @param data
   * @param loading
   * @returns {*}
   */
  getArticleDetail({id}, loading = true) {
    let url = `/social-shopping/api/backend/shop-manager/${id}`
    return request.get(url, {}, loading)
  },
  /**
   * 内容分類列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getCategoryList(data, loading = true) {
    let url = `/social-shopping/api/backend/shop-manager/`
    return request.get(url, data, loading)
  },
  /**
   * 商品列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getGoodsList(data, loading = true) {
    let url = `/social-shopping/api/backend/shop-manager/`
    return request.get(url, data, loading)
  },
  /**
   * 根據video 返回的 file_id获取cover_image
   * @param data
   * @param loading
   * @returns {*}
   */
  getCoverImage(data, loading = false) {
    let url = `/social-shopping/api/cos/get-file-info`
    return request.get(url, data, loading)
  }
}
