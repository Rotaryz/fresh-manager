import request from '@utils/request'

export default {
  // 获取组织列表
  getGroupList(data, loading = true) {
    let url = '/social-shopping/api/backend/activity-manage/department'
    return request.get(url, data, loading)
  },
  // 新建部门
  createDepartment(data, loading = true) {
    let url = '/social-shopping/api/backend/activity-manage/department'
    return request.post(url, data, loading)
  },
  // 删除部门
  deleteDepartment(data, loading = true) {
    let url = `/social-shopping/api/backend/activity-manage/department/${data.id}`
    data = ''
    return request.delete(url, data, loading)
  },
  // 编辑部门
  editDepartment(data, loading = true) {
    let url = `/social-shopping/api/backend/activity-manage/department/${data.id}`
    return request.put(url, data, loading)
  },
  // 移动部门
  moveDepartment(data, loading = true) {
    let url = `/social-shopping/api/backend/activity-manage/department/sort`
    return request.post(url, data, loading)
  },
  // 新建成员
  createStaff(data, loading = true) {
    let url = `/social-shopping/api/backend/activity-manage/member`
    return request.post(url, data, loading)
  },
  // 新建成员
  updateStaff(data, loading = true) {
    let url = `/social-shopping/api/backend/activity-manage/member/${data.id}`
    return request.put(url, data, loading)
  },
  // 获取成员列表
  getStaffList(data, loading = false) {
    let url = `/social-shopping/api/backend/activity-manage/department-offline-members/${data.id}`
    return request.get(url, data, loading)
  },
  // 删除成员
  deleteStaff(data, loading = true) {
    let url = `/social-shopping/api/backend/activity-manage/member/${data.id}`
    data = ''
    return request.delete(url, data, loading)
  }
}
