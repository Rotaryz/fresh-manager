import request from '@utils/request'

export default {
  /**
   * 商城权限管理
   * @param data
   * @param loading
   * @returns {*}
   */
  getSocialMenu(data, loading = false) {
    let url = '/social-shopping/api/backend/permission/admin-menu'
    return request.get(url, data, loading)
  },
  /**
   * 供应链权限管理
   * @param data
   * @param loading
   * @returns {*}
   */
  getScmMenu(data, loading = false) {
    let url = '/scm/api/backend/permission/admin-menu'
    return request.get(url, data, loading)
  },
  /**
   * 账号列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getAccountData(data, loading = true) {
    let url = '/social-shopping/api/backend/permission/admin'
    return request.get(url, data, loading)
  },
  /**
   * 权限列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getPermissionsData(data, loading = true) {
    let url = '/social-shopping/api/backend/permission/permissions'
    return request.get(url, data, loading)
  },
  /**
   * 角色列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getRolesData(data, loading = false) {
    let url = '/social-shopping/api/backend/permission/all-roles'
    return request.get(url, data, loading)
  },
  /**
   * 新建账号
   * @param data
   * @param loading
   * @returns {*}
   */
  createAccount(data, loading = true) {
    let url = '/social-shopping/api/backend/permission/admin'
    return request.post(url, data, loading)
  },
  /**
   * 删除账号
   * @param data
   * @param loading
   * @returns {*}
   */
  delAccount(id, data, loading = true) {
    let url = `/social-shopping/api/backend/permission/admin/${id}`
    return request.delete(url, data, loading)
  },
  /**
   * 编辑账号
   * @param data
   * @param loading
   * @returns {*}
   */
  editAccount(id, data, loading = true) {
    let url = `/social-shopping/api/backend/permission/admin/${id}`
    return request.put(url, data, loading)
  }
}
