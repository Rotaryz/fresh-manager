import request from '@utils/request'

export default {
  /**
   * 单位列表
   * @returns {*}
   */
  getUnitsList(data, loading = true) {
    let url = `/social-shopping/api/backend/goods-manage/goods-units`
    return request.get(url, data, loading)
  },
  /**
   * 创建单位
   * @returns {*}
   */
  createUnits(data, loading = false) {
    let url = `/social-shopping/api/backend/goods-manage/goods-units`
    return request.post(url, data, loading)
  },
  /**
   * 编辑单位
   * @returns {*}
   */
  delUnits(id, data, loading = false) {
    let url = `/social-shopping/api/backend/goods-manage/goods-units/${id}`
    return request.delete(url, data, loading)
  },
  /**
   * 删除单位
   * @returns {*}
   */
  editUnits(id, data, loading = false) {
    let url = `/social-shopping/api/backend/goods-manage/goods-units/${id}`
    return request.put(url, data, loading)
  },
  /**
   * 商品系统分类列表
   * @returns {*}
   */
  getCategory(data, loading = true) {
    let url = `/social-shopping/api/backend/goods-manage/goods-category`
    return request.get(url, data, loading)
  },
  /**
   * 商品系统分类列表
   * @returns {*}
   */
  createCategory(data, loading = false) {
    let url = `/social-shopping/api/backend/goods-manage/goods-category`
    return request.post(url, data, loading)
  }
}
