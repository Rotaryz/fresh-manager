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
   * 创建商品系统分类
   * @returns {*}
   */
  createCategory(data, loading = false) {
    let url = `/social-shopping/api/backend/goods-manage/goods-category`
    return request.post(url, data, loading)
  },
  /**
   * 更新商品系统分类
   * @returns {*}
   */
  editCategory(id, data, loading = false) {
    let url = `/social-shopping/api/backend/goods-manage/goods-category/${id}`
    return request.put(url, data, loading)
  },
  /**
   * 删除商品系统分类
   * @returns {*}
   */
  delCategory(id, loading = false) {
    let url = `/social-shopping/api/backend/goods-manage/goods-category/${id}`
    return request.delete(url, null, loading)
  },
  /**
   * 获取商品详情
   * @param id
   * @param loading
   * @returns {*}
   */
  getGoodsDetail(id, loading = true) {
    let url = `/social-shopping/api/backend/goods-manage/goods/${id}`
    return request.get(url, null, loading)
  },
  /**
   * 创建商品
   * @param id
   * @param loading
   * @returns {*}
   */
  createGoodsDetail(data, loading = true) {
    let url = `/social-shopping/api/backend/goods-manage/goods`
    return request.post(url, data, loading)
  },
  /**
   * 获取商品列表
   * @param id
   * @param loading
   * @returns {*}
   */
  getGoodsList(data, loading = true) {
    let url = `/social-shopping/api/backend/goods-manage/goods`
    return request.get(url, data, loading)
  },
  /**
   * 编辑商品详情
   * @param id
   * @param loading
   * @returns {*}
   */
  editGoodsDetail(id, data, loading = true) {
    let url = `/social-shopping/api/backend/goods-manage/goods/${id}`
    return request.put(url, data, loading)
  }
}
