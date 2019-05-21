import {getCorpId} from '@utils/tool'

export default {
  beforeRouteLeave(to, from, next) {
    if (to.path !== '/login' && from.path === '/home/advertisement' && !this._isSave) {
      this._isRouting = true
      this._next = next
      this.handleChangeType && this.handleChangeType(this._currentCms)
    } else {
      next()
    }
  },
  beforeDestroy() {
    this.$loading.hide()
  },
  methods: {
    getCurrentId() {
      return getCorpId()
    }
  }
}
