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
  }
}
