module.exports = [
  {
    type: 'input',
    name: 'name',
    message: '名称:',
    validate(value) {
      if (!value.length) {
        return '自动化测试名称不能为空'
      }
      return true
    }
  }
]
