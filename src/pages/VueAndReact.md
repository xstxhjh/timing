

# 传送门 Portal

React v16之前 unstable_renderSubtreeIntoContainer，
React v16 createPortal，不需要牵扯到componentDidMount、componentDidUpdate，也不用调用API清理Portal

在vue2 中 无原生支持 Portal 的实现，只能通过三方/手写插件。
vue3 已经实现。


# 片段 Fragment

React v16 <React.Fragment></React.Fragment>

vue2 无原生支持。
vue3 已实现。


# 路由 Router

vue-cli 通过配置统一管理页面路由
通过全局配置的router直接调用

create-react-app 嵌入到组件里面分配路由
使用方法:
父组件需要把 history 传递给子组件
或者 withRouter 高阶组件将 history, location, match 放入 props 属性中
或者 React-Router 的 Hooks， useHistory, useLocation, useParams, useRouteMatch 

umi(react)  通过配置统一管理页面路由
使用方法:
同 create-react-app


# 阻止默认行为/阻止冒泡

react
e.preventDefault()
e.stopPropagation()

vue
事件修饰符
  stop
  prevent
或者同react的方式


# templates/jsx

vue 的 templates，模板指令更为简单方便、直观

react 的jsx，相比而言不那么优雅，但灵活性会高一些。
