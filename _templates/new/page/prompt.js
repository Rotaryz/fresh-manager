module.exports = [
  {
    type: 'input',
    name: 'name',
    message: '名称:',
    validate(value) {
      if (!value.length) {
        return '页面组件名称不能为空！'
      }
      return true
    }
  },
  {
    type: 'input',
    name: 'note',
    message: '注释：',
    validate(value) {
      if (!value.length) {
        return '路由注释不能为空！'
      }
      return true
    }
  }
]
