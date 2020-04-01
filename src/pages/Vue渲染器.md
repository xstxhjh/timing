[title]: # (Vue渲染器)
[date]: # (2019-12-05 &nbsp; 22:35:53)
[categories]: # (VUE)
[description]: # (前方总有一条路,只是有时平坦,有时泥泞。)
[image]: # (https://i.loli.net/2020/04/01/PEpLVY64bvAurDq.jpg)

---

# 组件

## 模板引擎

模板引擎的概念是：模板字符串 + 数据 => html

在 JQuery 盛行的年代,模板引擎的概念流行

```js
import { template } from 'lodash'

const compiler = template('<h1><%= title %></h1>')
const html = compiler({ title: 'My Component' })

document.getElementById('app').innerHTML = html
```

我们将模板字符串传递给 template 函数,该函数返回一个编译器 compiler,只要把数据传入 compiler 函数,便能得到最终想要渲染的内容。

当数据发生变化时，我们需要使用新的数据重新编译模板：

```js
const newHtml = compiler({ title: 'New Component' })
```

## 模板引擎 ——> 组件

封装一下就得到了 组件！

```js
const MyComponent = props => {
  const compiler = MyComponent.cache || (MyComponent.cache = template('<h1><%= title %></h1>'))
  return compiler(props)
}
MyComponent.cache = null
```

使用

```js
document.getElementById('app').innerHTML = MyComponent({ title: 'MyComponent' })
```

## Virtual DOM

Vue 和 React： 模板字符串 + 数据 => Virtual DOM

借助 snabbdom 的 API , 使用 render 函数返回 Virtual DOM

```js
import { h } from 'snabbdom'

// h 函数用来创建 VNode，组件的产出是 VNode
const MyComponent = props => {
  return h('h1', props.title)
}
```

渲染真实DOM,模板引擎是的完全替换 html, 而虚拟DOM会替换部分,这个过程叫 patch

```js
import { h, init } from 'snabbdom'
// init 方法用来创建 patch 函数
const patch = init([])

const MyComponent = props => {
  // 函数式组件
  return h('h1', props.title)
}

// 组件的产出是 VNode
const prevVnode = MyComponent({ title: 'prev' })
// 将 VNode 渲染成真实 DOM
patch(document.getElementById('app'), prevVnode)
```

当数据变更时，组件会产出新的 VNode，我们只需再次调用 patch 函数即可：

```js
// 数据变更，产出新的 VNode
const nextVnode = MyComponent({ title: 'next' })
// 通过对比新旧 VNode，高效地渲染真实 DOM
patch(prevVnode, nextVnode)
```

为何组件要从直接产出 html 变成产出 Virtual DOM 呢？
其原因是 Virtual DOM 带来了 分层设计，它对渲染过程的抽象，使得框架可以渲染到 web(浏览器) 以外的平台，以及能够实现 SSR 等。