[title]: # (Vue、React的异同)
[date]: # (2020-05-08 &nbsp; 21:36:53)
[categories]: # (VUE)
[description]: # (思考及总结Vue和React编程方式上的一些差异)
[image]: # (https://i.loli.net/2020/05/27/mNj9uaV3Z7rz5lC.jpg)

---

# 编程思想对比

React就是MVC里的V,只专注视图层，而Vue才算是MVVM框架，双向绑定是特色之一。

**React**
- React + Redux 可以实现 MVC  的思想
- React + Mobx  可以实现 MVVM 的思想
- 整体思想偏向函数式编程，all in js

**Vue**
- Vue 本质是MVVM框架，由MVC发展而来
- 整体思想拥抱经典web应用 html(结构)、css(表现)、js(行为) 的分离

# 组件化

Vue 与 React 都推崇组件式的开发理念，数据传递都是单向的。

## 组件的运用

Vue 组件定义使用 *.vue 文件将 html、css、js 结合在一起。templates 模板语法内置了很多强大的功能，需要阅读文档，但后续便捷开发。

React 使用 jsx/js 文件来表示组件，通过 js 来操作一切。

## 父子组件数据传递

Vue 使用 props 传递数据，$emit触发自定义事件 的方式

React 使用 props 传递数据和回调函数 的方式

## 跨组件数据传递

Vue 通过 provide / inject 实现

React 通过 context 实现

## class与style处理

Vue 对 class 与 style 特意做了增强，可以传字符串、对象、数组

React 使用 className 用于指定 class，不能直接为组件指定 class

## 组件生命周期

Vue 的生命周期
- beforeCreate
- created
- beforeMount
- mounted
- beforeUpdate
- updated
- beforeDestroy
- destroyed

React 的生命周期
- constructor
- getDerivedStateFromProps
- shouldComponentUpdate
- componentWillUnmount
- componentDidUnMount
- componentDidUpdate
- render

## 阻止默认行为/阻止冒泡
Vue 事件修饰符
 - stop
 - prevent
或者类似于react的方式，使用 $event

React
- e.preventDefault()
- e.stopPropagation()

Vue 通过各种修饰符来帮助开发人员，React 贴近于原生 Dom 元素的事件处理。


# Portal、Fragment 方式的挂载

## 传送门 Portal

React v16之前 unstable_renderSubtreeIntoContainer

React v16 createPortal，不需要牵扯到componentDidMount、componentDidUpdate，也不用调用API清理Portal

在vue2 中 无原生支持 Portal 的实现，只能通过三方/手写插件。
vue3 已经实现。

## 片段 Fragment

React v16 <React.Fragment></React.Fragment>

vue2 无原生支持，vue3 已实现。


# 路由 Router

vue-cli 通过配置统一管理页面路由，通过全局配置的router直接调用

create-react-app 嵌入到组件里面分配路由，使用方法:
- 父组件需要把 history 传递给子组件
- 或者 withRouter 高阶组件将 history, location, match 放入 props 属性中
- 或者 React-Router 的 Hooks， useHistory, useLocation, useParams, useRouteMatch 

umi (react)  通过配置统一管理页面路由，使用方法：
- 同 create-react-app

# 搜索引擎优化

Google/Yahoo/Bing/Duck Duck Go 都能抓取出 JS 渲染后的内容作为文章的描述
但百度的搜索引擎不能

https://www.freecodecamp.org/news/seo-vs-react-is-it-neccessary-to-render-react-pages-in-the-backend-74ce5015c0c9/

# 防止注入攻击

JSX、templates 渲染之前, virtual DOM 会转义渲染的数据。 从而保证用户无法注入任何应用之外的代码。在被渲染之前，所有的数据都被转义成为了字符串处理。 以避免 XSS(跨站脚本) 攻击。