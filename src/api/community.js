import request from '@utils/request'

export default {
  /**
   * 微信群列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getCommunityList(data, loading = false) {
    let url = '/social-shopping/api/backend/community/groups'
    return request.get(url, data, loading)
  },
  /**
   * 编辑修改微信群
   * @param data
   * @param loading
   * @returns {*}
   */
  editCommunity(data, loading = false) {
    let url = `/social-shopping/api/backend/community/groups/${data.id}`
    return request.put(url, data, loading)
  },
  /**
   * 商品TOP10
   * @param data
   * @param loading
   * @returns {*}
   */
  getGoodsList(data, loading = false) {
    let url = `/social-shopping/api/backend/community/statistic/hot-sale`
    return request.get(url, data, loading)
  },
  /**
   * 群质量
   * @param data
   * @param loading
   * @returns {*}
   */
  getQualityData(data, loading = false) {
    let url = `/social-shopping/api/backend/community/statistic/summary`
    return request.get(url, data, loading)
  },
  /**
   * 群运营数据
   * @param data
   * @param loading
   * @returns {*}
   */
  getBusinessData(data, loading = false) {
    let url = `/social-shopping/api/backend/community/statistic/business`
    return request.get(url, data, loading)
  },
  /**
   * 群用户分组数据
   * @param data
   * @param loading
   * @returns {*}
   */
  getGroupData(data, loading = false) {
    let url = `/social-shopping/api/backend/community/statistic/customers`
    return request.get(url, data, loading)
  }

}
