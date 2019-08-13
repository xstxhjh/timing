import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/components/layout/Layout'
// import RouteView from '@/components/layout/RouteView' // 递归菜单路由时，使用的component

import MarkdownView from '@/components/layout/MarkdownView' // Markdown 使用 vue 组件的路由
import mdRoute from '@/utils/markdown'
let mdRouteArr = mdRoute.mdRouteArr

Vue.use(VueRouter)

let constantRouterMap = [
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
                component: MarkdownView,
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
    mode: 'hash',
    base: '/',
    routes: constantRouterMap
})
