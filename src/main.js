import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from './utils/request'
import './permission' // 路由权限控制
import '@/utils/icons' // svg-icon组件


Vue.prototype.$axios = axios


Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
