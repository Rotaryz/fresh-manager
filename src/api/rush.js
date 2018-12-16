import request from '@utils/request'

export default {
  /**
   * 今日抢购列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getRushList(data, loading = true) {
    let url = '/social-shopping/api/backend/shelf-manage/shelf'
    return request.get(url, data, loading)
  },
  /**
   * 今日抢购列表
   * @param data
   * @param loading
   * @returns {*}
   */
  rushDetail(id, loading = true) {
    let url = `/social-shopping/api/backend/shelf-manage/shelf/${id}`
    return request.get(url, {}, loading)
  },
  /**
   * 仓库货架详情
   * @param data
   * @param loading
   * @returns {*}
   */
  shelfTag(id, loading = true) {
    let url = `/social-shopping/api/backend/shelf-manage/shelf-tag/${id}`
    return request.get(url, {}, loading)
  },
  /**
   * 仓库货架详情
   * @param data
   * @param loading
   * @returns {*}
   */ tagList(data, loading = false) {
    let url = `/social-shopping/api/backend/shelf-manage/shelf-tag`
    return request.get(url, data, loading)
  },
  /**
   * 仓库货架详情
   * @param data
   * @param loading
   * @returns {*}
   */
  storeTag(data, loading = false) {
    let url = `/social-shopping/api/backend/shelf-manage/shelf-tag`
    return request.post(url, data, loading)
  },
  /**
   * 仓库货架详情
   * @param data
   * @param loading
   * @returns {*}
   */
  updateTag(data, id, loading = false) {
    let url = `/social-shopping/api/backend/shelf-manage/shelf-tag/${id}`
    return request.put(url, data, loading)
  },
  /**
   * 仓库货架详情
   * @param data
   * @param loading
   * @returns {*}
   */
  deleteTag(id, loading = false) {
    let url = `/social-shopping/api/backend/shelf-manage/shelf-tag/${id}`
    return request.delete(url, {}, loading)
  },
  /**
   * 仓库货架详情
   * @param data
   * @param loading
   * @returns {*}
   */
  getGoodsList(data, loading = false) {
    let url = `/social-shopping/api/backend/goods-manage/goods`
    return request.get(url, data, loading)
  },
  /**
   * 仓库货架详情
   * @param data
   * @param loading
   * @returns {*}
   */
  goodsCategory(data, loading = false) {
    let url = `/social-shopping/api/backend/goods-manage/goods-category`
    return request.get(url, data, loading)
  },
  /**
   * 仓库货架编辑
   * @param data
   * @param loading
   * @returns {*}
   */
  updateGoods(data, id, loading = false) {
    let url = `/social-shopping/api/backend/shelf-manage/shelf/${id}`
    return request.put(url, data, loading)
  }
}
