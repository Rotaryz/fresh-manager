import API from '@api'
import app from '@src/main'

const TYPE = ['common', 'video', 'cookbook']

export const state = {
  /**
   * -------------------------------
   * 内容分类
   */
  contentClassList: [],
  contentClassPage: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  contentPage: 1,
  /**
   * -------------------------------
   * 我的作品
   */
  workList: [{id: 1}],
  workPage: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  workStatus: 1,
  contentWorkPage: 1,
  workKeyword: '',
  workTabIndex: 0,
  workCategoryId: '',
  workType: 'common',
  /**
   * -------------------------------
   * 内容中心
   */
  centerList: [],
  centerPage: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  contentCenterPage: 1,
  centerStatus: 1,
  centerKeyword: '',
  centerTabIndex: 0,
  centerType: 'common',
  centerCategoryId: ''
}

export const getters = {
  contentClassList: (state) => state.contentClassList,
  contentClassPage: (state) => state.contentClassPage,
  contentPage: (state) => state.contentPage,
  workList: (state) => state.workList,
  workPage: (state) => state.workPage,
  workStatus: (state) => state.workStatus,
  workKeyword: (state) => state.workKeyword,
  workTabIndex: (state) => state.workTabIndex,
  workCategoryId: (state) => state.workCategoryId,
  workType: (state) => state.workType,
  centerCategoryId: (state) => state.centerCategoryId,
  centerList: (state) => state.centerList,
  centerPage: (state) => state.centerPage,
  contentCenterPage: (state) => state.contentCenterPage,
  contentWorkPage: (state) => state.contentWorkPage,
  centerStatus: (state) => state.centerStatus,
  centerKeyword: (state) => state.centerKeyword,
  centerType: (state) => state.centerType,
  centerTabIndex: (state) => state.centerTabIndex
}

export const mutations = {
  /**
   * -------------------------------
   * 内容分类
   * @param state
   * @param workPage
   * @constructor
   */
  SET_CONTENT_CLASS_LIST(state, contentClassList) {
    state.contentClassList = contentClassList
  },
  SET_CONTENT_CLASS_PAGE(state, contentClassPage) {
    state.contentClassPage = contentClassPage
  },
  SET_CONTENT_PAGE(state, contentPage) {
    state.contentPage = contentPage
  },
  /**
   * -------------------------------
   * 我的作品
   * @param state
   * @param workPage
   * @constructor
   */
  SET_WORK_LIST(state, workList) {
    state.workList = workList
  },
  SET_WORK_PAGE(state, workPage) {
    state.workPage = workPage
  },
  SET_WORK_CONTENT_PAGE(state, contentWorkPage) {
    state.contentWorkPage = contentWorkPage
  },
  SET_WORK_STATUS(state, workStatus) {
    state.workStatus = workStatus
  },
  SET_WORK_KEYWORD(state, workKeyword) {
    state.workKeyword = workKeyword
  },
  SET_WORK_TAB_INDEX(state, workTabIndex) {
    state.workTabIndex = workTabIndex
    state.workType = TYPE[workTabIndex]
  },
  SET_WORK_CATEGORY_ID(state, workCategoryId) {
    state.workCategoryId = workCategoryId
  },
  /**
   * -------------------------------
   * 内容中心
   * @param state
   * @param workPage
   * @constructor
   */
  SET_CENTER_PAGE(state, centerPage) {
    state.centerPage = centerPage
  },
  SET_CENTER_LIST(state, centerList) {
    state.centerList = centerList
  },
  SET_CENTER_CONTENT_PAGE(state, contentCenterPage) {
    state.contentCenterPage = contentCenterPage
  },
  SET_CENTER_STATUS(state, centerStatus) {
    state.centerStatus = centerStatus
  },
  SET_CENTER_KEYWORD(state, centerKeyword) {
    state.centerKeyword = centerKeyword
  },
  SET_CENTER_TAB_INDEX(state, centerTabIndex) {
    state.centerTabIndex = centerTabIndex
    state.centerType = TYPE[centerTabIndex]
  },
  SET_CENTER_CATEGORY_ID(state, centerCategoryId) {
    state.centerCategoryId = centerCategoryId
  }
  /**
   * ---------------------------------
   */
}

export const actions = {
  getContentClassList({commit, state}, loading = true) {
    let {contentPage} = state
    return API.Content.getContentClassList({page: contentPage}, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          app.$toast.show(res.message)
          return
        }
        let list = res.data
        let pages = res.meta
        let pageDetail = {
          total: pages.total,
          per_page: pages.per_page,
          total_page: pages.last_page
        }
        commit('SET_CONTENT_CLASS_LIST', list)
        commit('SET_CONTENT_CLASS_PAGE', pageDetail)
        return list
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  contentAddPage({commit, dispatch}, obj) {
    obj.page && commit('SET_CONTENT_PAGE', obj.page)
    dispatch('getContentClassList')
  },
  infoContent({commit, dispatch}, obj) {
    commit('SET_CONTENT_PAGE', 1)
  },
  getWorkList({commit}, loading = true) {
    let {contentWorkPage, workStatus, workKeyword, workCategoryId, workType} = state
    let data = {
      page: contentWorkPage,
      status: workStatus,
      keyword: workKeyword,
      category_id: workCategoryId,
      type: workType
    }
    return API.Content.getWorkList(data, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          app.$toast.show(res.message)
          return
        }
        let list = res.data
        let pages = res.meta
        let pageDetail = {
          total: pages.total,
          per_page: pages.per_page,
          total_page: pages.last_page
        }
        // [{id: 1, status: 1, title: 'dfs', list_date: 'sd', status_str: 'sds'}]
        commit('SET_WORK_LIST', list)
        commit('SET_WORK_PAGE', pageDetail)
        return list
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  selectWork({commit, state}, obj) {
    let {type, index, value, ids} = obj
    let arr = JSON.parse(JSON.stringify(state.workList))

    if (type === 'all') {
      arr = arr.map((item) => {
        item.select = value
        if (value) {
          ids.push(item.id)
        }
        return item
      })
    } else {
      arr[index].select = !arr[index].select
      if (arr[index].select) {
        ids.push(arr[index].id)
      } else {
        let idIndex = ids.findIndex((item) => item.id === arr[index].id)
        ids.splice(idIndex, 1)
      }
    }
    commit('SET_WORK_LIST', arr)
    return ids
  },
  /**
   * -------------------------------
   * 内容中心
   * @param state
   * @param workPage
   * @constructor
   */
  getCenterList({commit}, loading = true) {
    let {contentCenterPage, centerStatus, centerCategoryId, centerKeyword, centerType} = state
    let data = {
      page: contentCenterPage,
      status: centerStatus,
      keyword: centerKeyword,
      type: centerType,
      category_id: centerCategoryId,
      is_cate_show: 1,
      limit: 12
    }
    return API.Content.getCenterList(data, loading)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          app.$toast.show(res.message)
          return
        }
        let list = res.data
        let pages = res.meta
        let pageDetail = {
          total: pages.total,
          per_page: pages.per_page,
          total_page: pages.last_page
        }
        commit('SET_CENTER_LIST', list)
        commit('SET_CENTER_PAGE', pageDetail)
        return list
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  setCenterIndex({commit, dispatch}, index) {
    commit('SET_CENTER_TAB_INDEX', index)
  },
  infoCenter({commit}, obj) {
    commit('SET_CENTER_TAB_INDEX', 0)
    commit('SET_CENTER_CONTENT_PAGE', 1)
    commit('SET_CENTER_STATUS', 1)
    commit('SET_CENTER_KEYWORD', '')
    commit('SET_CENTER_CATEGORY_ID', '')
  },
  getCenterListMore({commit, dispatch}, obj) {
    typeof obj.tabIndex === 'number' && commit('SET_CENTER_TAB_INDEX', obj.tabIndex)
    typeof obj.page !== 'undefined' && commit('SET_CENTER_CONTENT_PAGE', obj.page)
    typeof obj.status !== 'undefined' && commit('SET_CENTER_STATUS', obj.status)
    typeof obj.keyword !== 'undefined' && commit('SET_CENTER_KEYWORD', obj.keyword)
    typeof obj.centerCategoryId !== 'undefined' && commit('SET_CENTER_CATEGORY_ID', obj.centerCategoryId)
    dispatch('getCenterList', false)
  },
  infoWork({commit}, obj) {
    commit('SET_WORK_CONTENT_PAGE', 1)
    commit('SET_WORK_STATUS', 1)
    commit('SET_WORK_TAB_INDEX', 0)
    commit('SET_WORK_KEYWORD', '')
    commit('SET_WORK_CATEGORY_ID', '')
  },
  setWorkIndex({commit, dispatch}, index) {
    commit('SET_WORK_TAB_INDEX', index)
  },
  getWorkListMore({commit, dispatch}, obj) {
    typeof obj.tabIndex === 'number' && commit('SET_WORK_TAB_INDEX', obj.tabIndex)
    typeof obj.page !== 'undefined' && commit('SET_WORK_CONTENT_PAGE', obj.page)
    typeof obj.status !== 'undefined' && commit('SET_WORK_STATUS', obj.status)
    typeof obj.keyword !== 'undefined' && commit('SET_WORK_KEYWORD', obj.keyword)
    typeof obj.workCategoryId !== 'undefined' && commit('SET_WORK_CATEGORY_ID', obj.workCategoryId)
    dispatch('getWorkList', false)
  }
}
