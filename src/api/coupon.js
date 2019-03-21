import request from '@utils/request'

export default {
  /**
   * 优惠券列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getCouponList(data, loading = true) {
    let url = '/social-shopping/api/backend/coupon-manage/coupon'
    return request.get(url, data, loading)
  },
  /**
   * 优惠券详情
   * @param data
   * @param loading
   * @returns {*}
   */
  getCouponDetail(id, loading = true) {
    let url = `/social-shopping/api/backend/coupon-manage/coupon/${id}`
    return request.get(url, {}, loading)
  },
  /**
   * 删除优惠券
   * @param data
   * @param loading
   * @returns {*}
   */
  deleteCoupon(id, loading = false) {
    let url = `/social-shopping/api/backend/coupon-manage/coupon/${id}`
    return request.delete(url, null, loading)
  },
  /**
   * 品类列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getCategoryList(data, loading = false) {
    let url = `/api/backend/goods-manage/goods-category`
    return request.get(url, data, loading)
  },
  /**
   * 商品列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getGoodsList(data, loading = false) {
    let url = `/social-shopping/api/backend/activity-manage/activity-goods`
    return request.get(url, data, loading)
  },
  /**
   * 二级分类列表
   * @param data
   * @param loading
   * @returns {*}
   */
  goodsCategory(data, loading = false) {
    let url = `/social-shopping/api/backend/goods-manage/goods-category`
    return request.get(url, data, loading)
  },
  /**
   * 新建优惠券
   * @param data
   * @param loading
   * @returns {*}
   */
  storeCoupon(data, loading = false) {
    let url = `/social-shopping/api/backend/coupon-manage/coupon`
    return request.post(url, data, loading)
  }
}
