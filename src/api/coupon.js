import request from '@utils/request'
// todo记得删除v1
let verson = 'v1/'
export default {
  /**
   * 优惠券列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getCouponList(data, loading = true) {
    let url = `/social-shopping/${verson}api/backend/coupon-manage/coupon`
    return request.get(url, data, loading)
  },
  /**
   * 优惠券详情
   * @param data
   * @param loading
   * @returns {*}
   */
  getCouponDetail(data, id, loading = true) {
    let url = `/social-shopping/${verson}api/backend/coupon-manage/coupon/${id}`
    return request.get(url, data, loading)
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
    let url = `/social-shopping/${verson}api/backend/coupon-manage/coupon`
    return request.post(url, data, loading)
  },
  /**
   * 优惠券分类统计
   * @param loading
   * @returns {*}
   */
  getCouponStatus(data, loading = false) {
    let url = '/social-shopping/api/backend/coupon-manage/coupon-status'
    return request.get(url, data, loading)
  }
}
