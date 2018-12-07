module.exports = [
  {
    type: 'input',
    name: 'name',
    message: '名称:',
    validate(value) {
      if (!value.length) {
        return '状态管理模块名称不能为空！'
      }
      return true
    }
  }
]
