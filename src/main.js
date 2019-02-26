import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Import plugins
import BootstrapVue from 'bootstrap-vue'
import '@/assets/_custom.scss'

Vue.use(BootstrapVue)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
