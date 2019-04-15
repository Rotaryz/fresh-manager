import request from '@utils/request'

export default {
  /**
   * 部门列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getGroupList(data, loading = true) {
    let url = '/social-shopping/api/backend/activity-manage/department'
    return request.get(url, data, loading)
  },
  // 新建部门
  createDepartment(data, loading = true) {
    let url = '/social-shopping/api/backend/activity-manage/department'
    return request.post(url, data, loading)
  },
  // 新建部门
  deleteDepartment(data, loading = true) {
    let url = `/social-shopping/api/backend/activity-manage/department/${data.id}`
    data = ''
    return request.delete(url, data, loading)
  },
  // 新建成员
  createStaff(data, loading = true) {
    let url = `/social-shopping/api/backend/activity-manage/member`
    return request.post(url, data, loading)
  },
  // 获取成员列表
  getStaffList(data, loading = false) {
    let url = `/social-shopping/api/backend/activity-manage/department-offline-members/${data.id}`
    data = ''
    return request.get(url, data, loading)
  }
}
