import storage from 'storage-controller'
import {app as _this} from '@src/main'

// 错误码检查
export function handleErrorType(code) {
  switch (code) {
    case 404: {
      _toErrorPage(`404`)
      break
    }
    case 10000: {
      _handleLoseEfficacy()
      break
    }
    default:
      break
  }
}

function _toErrorPage(useType) {}

function _handleLoseEfficacy() {
  const currentRoute = _this.$route.path
  if (currentRoute !== '/') {
    storage.set('beforeLoginRoute', currentRoute)
  }
  storage.remove('token')
}

export function showLoading(loading) {
  if (loading) {
    _this.$loading.show()
  }
}
