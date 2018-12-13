import Vue from 'vue'
import App from './App.vue'
import router from '@router'
import store from '@state/store'
import '@components/_globals'
import {Plugins} from '@utils/plugins'
import 'iview/dist/styles/iview.css'

Vue.use(Plugins)

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
