<<<<<<< HEAD
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './permission' // 路由权限控制

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
=======
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
>>>>>>> 2bd88d7666daf780c8ffd292e0bae77d847c7a83
