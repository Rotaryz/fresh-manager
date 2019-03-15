const appConfig = require('./src/app.config')

module.exports = {
  configureWebpack: {
    name: appConfig.title,
    resolve: {
      alias: require('./aliases.config').webpack
    }
  },
  css: {
    sourceMap: true
  },
  productionSourceMap: false,
  devServer: {
    port: 9001,
    ...(process.env.VUE_APP_API
      ? // 代理生产地址.
        {
          proxy: {
            '/social-shopping': {
              target: process.env.VUE_APP_API
            },
            '/scm': {
              target: process.env.VUE_APP_SCM_API
            }
          }
        }
      : // 代理本地地址.
        {})
    // { before: require('./tests/mock-api') }),
  }
}
