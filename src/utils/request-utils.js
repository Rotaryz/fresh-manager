import storage from 'storage-controller'
import app from '@src/main'

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
    case 13004: {
      // 系统升级
      _handUpgrade()
      break
    }
    case 13006: {
      // 暂无权限
      _handleLosePermissions()
      break
    }
    default:
      break
  }
}

function _toErrorPage(useType) {}

/**
 * 登录凭证失效
 * @private
 */
function _handleLoseEfficacy() {
  const currentRoute = app.$route.path
  if (currentRoute !== '/') {
    storage.set('beforeLoginRoute', currentRoute)
  }
  storage.remove('token')
}

/**
 * 暂无权限
 * @private
 */
function _handleLosePermissions() {
  storage.set('beforeLoginRoute', '/')
  storage.set('losePermissions', 1)
  storage.remove('auth.currentUser', null)
  storage.remove('menu')
  storage.remove('permissions')
  app.$router.replace('/login')
}

/**
 * 系统升级
 * @private
 */
function _handUpgrade() {
  const currentRoute = app.$route.path
  if (currentRoute !== '/upgrade') {
    storage.set('upgradeRoute', currentRoute)
    app.$router.replace('/upgrade')
  }
}

export function showLoading(loading) {
  if (loading) {
    app.$loading.show()
  }
}
