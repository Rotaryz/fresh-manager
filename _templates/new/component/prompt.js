const _ = require('lodash')

module.exports = [
  {
    type: 'input',
    name: 'name',
    message: '名称:',
    validate(value) {
      if (!value.length) {
        return '组件名称不能为空！'
      }
      const fileName = _.kebabCase(value)
      if (fileName.indexOf('-') === -1) {
        return '为了防止与HTML原生标签冲突，所以组件名必须由两个单词组成！'
      }
      return true
    }
  }
]
