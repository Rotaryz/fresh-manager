import request from './request'
const _this = window.__app__

// 通用的api请求方式
export function defaultProcess(...args) {
  const [method, url, data, loading = true, toast = true] = args
  let fn = args[args.length - 1]
  return new Promise((resolve, reject) => {
    request[method](url, data, loading)
      .then((res) => {
        console.log(loading)
        if (loading) {
          _this.$loading.hide()
        }
        if (_this.$ERR_OK !== res.error) {
          toast && _this.$toast.show(res.message)
          return reject
        }
        if (typeof fn === 'function') {
          res = fn(res)
        }
        resolve(res)
      })
      .catch(reject)
  })
}
