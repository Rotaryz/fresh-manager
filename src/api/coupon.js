import request from '@utils/request'

export default {
  /**
   * 优惠券列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getCouponList(data, loading = false) {
    let url = `/social-shopping/api/backend/coupon-manage/coupon`
    return request.get(url, data, loading)
  },
  /**
   * 优惠券详情
   * @param data
   * @param loading
   * @returns {*}
   */
  getCouponDetail(data, id, loading = true) {
    let url = `/social-shopping/api/backend/coupon-manage/coupon/${id}`
    return request.get(url, data, loading)
  },
  /**
   * 停止优惠券
   * @param loading
   * @returns {*}
   */
  stopCoupon(id, loading = false) {
    let url = `/social-shopping/api/backend/coupon-manage/coupon/offline/${id}`
    return request.post(url, null, loading)
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
    let url = `/api/backend/goods-manage/goods-category-list`
    return request.get(url, data, loading)
  },
  /**
   * 商品列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getGoodsList(data, loading = false) {
    let url = `/social-shopping/api/backend/goods-manage/goods`
    return request.get(url, data, loading)
  },
  /**
   * 二级分类列表
   * @param data
   * @param loading
   * @returns {*}
   */
  goodsCategory(data, loading = false) {
    let url = `/social-shopping/api/backend/goods-manage/goods-category-list`
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
  },

  /**
   * 编辑优惠券
   * @param data
   * @param loading
   * @returns {*}
   */
  editCoupon(data, loading = false) {
    let url = `/social-shopping/api/backend/coupon-manage/coupon/${data.id}`
    return request.put(url, data, loading)
  },
  /**
   * 优惠券分类统计
   * @param loading
   * @returns {*}
   */
  getCouponStatus(data, loading = false) {
    let url = '/social-shopping/api/backend/coupon-manage/coupon-status'
    return request.get(url, data, loading)
  },
  /**
   * 优惠券报表
   * @param loading
   * @returns {*}
   */
  getCouponData(data, loading = false) {
    let url = '/social-shopping/api/backend/coupon-manage/coupon/coupon-report/day-report'
    return request.get(url, data, loading)
  },
  /**
   * 导出报表
   * @param loading
   * @returns {*}
   */
  exportData(data, loading = false) {
    let url = '/social-shopping/api/backend/coupon-manage/coupon/coupon-report/day-report-export'
    return request.get(url, data, loading)
  },
  /**
   * 兑换券使用明细
   * @param data
   * @param loading
   * @returns {*}
   */
  getUsedList(data, loading = false) {
    let url = `/social-shopping/api/backend/coupon-manage/customer-coupon`
    return request.get(url, data, loading)
  },
}
