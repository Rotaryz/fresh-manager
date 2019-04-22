import request from '@utils/request'

export default {
  /**
   * 分拣列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getMerchantOrderList(data, loading = true) {
    // let url = '/scm/api/backend/oms/orders'
    let url = '/mock/merchantOrderList.json'
    return request.get(url, data, loading)
  },
  // 明細
  getMerchantOrderDetail({id}, loading = true) {
    //  let url = `/scm/api/backend/sorting/allocation-detail/${id}`
    let url = '/mock/orderDetail.json'
    return request.get(url, loading)
  },
  // 详情的详情 （商品的详情）
  getConsumerOrderDetail(data,loading = false){
    //  let url = `/scm/api/backend/oms/order-details`
    let url = '/mock/consumerOrderDetail.json'
    return request.get(url,data, loading)
  },
  // 分类列表
  getTypeList() {
    // let url = '/scm/api/backend/oms/order-types'
    let url = '/mock/orderTypeList.json'
    return request.get(url)
  },
  // 状态
  getStausData() {
    let url = '/mock/StausData.json'
    return request.get(url)
  },
  getMergeOrderslist(){
    // let url = '/scm/api/backend/oms/merge-orders'
    let url = '/mock/mergeOrderslist.json'
    return request.get(url)
  },
  getMergerOrderDetail({id}, loading = true){
    //  let url =`/scm/api/backend/oms/merge-orders/${id}`
    let url = '/mock/mergerDetail.json'
    return request.get(url, loading)
  }
}
