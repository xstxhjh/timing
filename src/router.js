import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/components/layout/Layout'
import RouteView from '@/components/layout/RouteView' // 递归菜单路由时，使用的component
<<<<<<< HEAD
import mdRoute from '@/utils/markdown'
=======
import mdRoute from '@/components/markdown'
>>>>>>> 2bd88d7666daf780c8ffd292e0bae77d847c7a83
let mdRouteArr = mdRoute.mdRouteArr

Vue.use(VueRouter)

let constantRouterMap = [
<<<<<<< HEAD
    {
        path: '/',
        name: 'Layout',
        meta: {
            title: 'Layout'
        },
        component: Layout,
        redirect: '/home',
        children: [
            {
                path: 'home',
                name: 'home',
                meta: {
                    title: '首页'
                },
                component: () => import('@/views/home.vue')
            }
        ]
    },
    {
        path: '/md',
        name: 'md',
        component: Layout,
        redirect: `/md/posts/${mdRouteArr[0].path}`,
        children: [
            {
                path: 'posts',
                name: 'posts',
                component: RouteView,
                children: mdRouteArr
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
=======
  {
    path: '/',
    name: 'Layout',
    meta: {
      title: 'Layout'
    },
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        meta: {
          title: '首页'
        },
        component: () => import('@/views/home.vue')
      }
    ]
  },
  {
    path: '/md',
    name: 'md',
    component: Layout,
    redirect: `/md/posts/${mdRouteArr[0].path}`,
    children: [
      {
        path: 'posts',
        name: 'posts',
        component: RouteView,
        children: mdRouteArr
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
>>>>>>> 2bd88d7666daf780c8ffd292e0bae77d847c7a83
]

// {
//   path: '/timing',
//   name: 'timing',
//   meta: {
//     title: '天时',
//     icon: 'timing',
//   },
//   component: RouteView,
//   children: []
// }

export default new VueRouter({
<<<<<<< HEAD
    mode: 'history',
    base: '/',
    routes: constantRouterMap
=======
  mode: 'history',
  base: '/',
  routes: constantRouterMap
>>>>>>> 2bd88d7666daf780c8ffd292e0bae77d847c7a83
})
