/**
 * 获取当前的corpId
 * @returns {string}
 */
export function getCorpId() {
  // 设置固定切割的字符串
  const SPLIT_DOMAIN = `-fresh-manager.jkweixin.${process.env.NODE_ENV === 'production' ? 'com' : 'net'}`
  const host = window.location.host
  let corp = ''
  // 判断是否在.jkweixin的域名下
  if (host.includes('.jkweixin.')) {
    let splitHost = host.split(SPLIT_DOMAIN)
    corp = splitHost[0]
  }
  // 根据corp返回不同环境下的corpId
  switch (corp) {
    case 'retuan':
      return process.env.VUE_APP_RETUAN_CORP
    case 'guojidanwei':
      return process.env.VUE_APP_GUOJIDANWEI_CORP
    default:
      return process.env.VUE_APP_CURRENT_CORP
  }
}
