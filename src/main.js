import Vue from 'vue'
import App from './App.vue'
import router from '@router'
import store from '@state/store'
import '@components/_globals'
import {Plugins} from '@utils/plugins'
import 'iview/dist/styles/iview.css'
import 'element-ui/lib/theme-chalk/index.css'
import './design/date-picker.css'
import Print from 'vue-print-nb'
Vue.use(Plugins)
Vue.use(Print)
Vue.config.productionTip = process.env.NODE_ENV === 'production'

if (window.Cypress) {
  Vue.config.errorHandler = window.Cypress.cy.onUncaughtException
}

const app = new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')

export default app

window.__app__ = app
console.warn('运行环境:', process.env.VUE_APP_ENV)
