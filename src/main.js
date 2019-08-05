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
