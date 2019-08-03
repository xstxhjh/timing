import Vue from 'vue'
import VueRouter  from 'vue-router'
import Layout from '@/components/layout/Layout'
import RouteView from '@/components/layout/RouteView' // 递归菜单路由时，使用的component

Vue.use(VueRouter )

let constantRouterMap = [
  {
    path: '/',
    name: 'Layout',
    meta: {
      title: 'Layout'
    },
    component: Layout,
    redirect: '/timing/home',
    children: [
      {
        path: '/timing',
        name: 'timing',
        meta: {
          title: '天时',
          icon: 'timing',
        },
        component: RouteView,
        children: [
          {
            path: 'home',
            name: 'home',
            meta: {
                title: '首页',
            },
            component: () => import('@/views/home.vue')
        },
        ]
      }
    ]
  }
  // {
  //   path: '*',
  //   name: '/errors',
  //   meta: {
  //     title: 'errors'
  //   },
  //   component: () => import('@/views/errors')
  // }
]

export default new VueRouter ({
  mode: 'history',
  base: '/',
  routes: constantRouterMap
})
