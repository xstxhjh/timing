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

## VNode 渲染

```js
class MyComponent {
  // 有状态组件
  render() {
    // render 函数产出 VNode
    return {
      tag: 'div'
    }
  }
}
const elementVnode = {tag: 'div'}
const componentVnode = {tag: MyComponent}

function render(vnode, container) {
  if (typeof vnode.tag === 'string') {
    // html 标签
    mountElement(vnode, container)
  } else {
    // 组件
    mountComponent(vnode, container)
  }
}

// 根据 VNode 创建真实 DOM 并将其添加到容器中
function mountElement(vnode, container) {
  // 创建元素
  const el = document.createElement(vnode.tag)
  // 将元素添加到容器
  container.appendChild(el)
}

// 挂载组件
function mountComponent(vnode, container) {
  // 创建组件实例
  const instance = new vnode.tag()
  // 渲染
  instance.$vnode = instance.render()
  // 挂载
  mountElement(instance.$vnode, container)
}

// 把 elementVnode 渲染到 id 为 app 的元素下
render(elementVnode, document.getElementById('app'))
```

函数式组件：
 - 是一个纯函数
 - 没有自身状态，只接收外部数据
 - 产出 VNode 的方式：单纯的函数调用

有状态组件：
 - 是一个类，可实例化
 - 可以有自身状态
 - 产出 VNode 的方式：需要实例化，然后调用其 render 函数

---

 # VNode

## VNode 描述真实 DOM
一个 html 标签有它的名字、属性、事件、样式、子节点等诸多信息，这些内容都需要在 VNode 中体现

```js
const elementVNode = {
  tag: 'div',
  data: {
    style: {
      width: '100px',
      height: '100px',
      backgroundColor: 'red'
    }
  },
  children: {   // 子节点
    tag: 'span',
    data: null
  }
}
```

如果根元素并不是一个实实在在的真实 DOM，而是一个抽象的标识，即 Fragment 寓意是要渲染一个片段

```js
const Fragment = Symbol()
const fragmentVNode = {
  // tag 属性值是一个唯一标识
  tag: Fragment,
  data: null,
  children: [
    {
      tag: 'td',
      data: null
    },
    {
      tag: 'td',
      data: null
    },
    {
      tag: 'td',
      data: null
    }
  ]
}
```

Portal,它允许你把内容渲染到任何地方,不受 DOM 层级关系限制

## VNode 的种类

我们可以把 VNode 分成五类，分别是：html/svg 元素、组件、纯文本、Fragment 以及 Portal

<img class='router-post-body-image' src='../image/vnode-types.png' />

如上图所示，我们可以把组件细分为 有状态组件 和 函数式组件。同时有状态组件还可以细分为三部分：普通的有状态组件、需要被 keepAlive 的有状态组件 以及 已经被 keepAlive 的有状态组件 。

但无论是普通的有状态组件还是 keepAlive 相关的有状态组件，它们都是有状态组件。所以我们在设计 VNode 时可以将它们作为一类看待。

## 枚举值 VNodeFlags

```js
const VNodeFlags = {
  // html 标签
  ELEMENT_HTML: 1,
  // SVG 标签
  ELEMENT_SVG: 1 << 1,

  // 普通有状态组件
  COMPONENT_STATEFUL_NORMAL: 1 << 2,
  // 需要被keepAlive的有状态组件
  COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE: 1 << 3,
  // 已经被keepAlive的有状态组件
  COMPONENT_STATEFUL_KEPT_ALIVE: 1 << 4,
  // 函数式组件
  COMPONENT_FUNCTIONAL: 1 << 5,

  // 纯文本
  TEXT: 1 << 6,
  // Fragment
  FRAGMENT: 1 << 7,
  // Portal
  PORTAL: 1 << 8
}
```

```js
// html 和 svg 都是标签元素，可以用 ELEMENT 表示
VNodeFlags.ELEMENT = VNodeFlags.ELEMENT_HTML | VNodeFlags.ELEMENT_SVG
// 普通有状态组件、需要被keepAlive的有状态组件、已经被keepAlice的有状态组件 都是“有状态组件”，统一用 COMPONENT_STATEFUL 表示
VNodeFlags.COMPONENT_STATEFUL =
  VNodeFlags.COMPONENT_STATEFUL_NORMAL |
  VNodeFlags.COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE |
  VNodeFlags.COMPONENT_STATEFUL_KEPT_ALIVE
// 有状态组件 和  函数式组件都是“组件”，用 COMPONENT 表示
VNodeFlags.COMPONENT = VNodeFlags.COMPONENT_STATEFUL | VNodeFlags.COMPONENT_FUNCTIONAL
```

```js
// html 元素节点
const htmlVnode = {
  flags: VNodeFlags.ELEMENT_HTML,
  tag: 'div',
  data: null
}

// svg 元素节点
const svgVnode = {
  flags: VNodeFlags.ELEMENT_SVG,
  tag: 'svg',
  data: null
}

// 函数式组件
const functionalComponentVnode = {
  flags: VNodeFlags.COMPONENT_FUNCTIONAL,
  tag: MyFunctionalComponent
}

// 普通的有状态组件
const normalComponentVnode = {
  flags: VNodeFlags.COMPONENT_STATEFUL_NORMAL,
  tag: MyStatefulComponent
}

// Fragment
const fragmentVnode = {
  flags: VNodeFlags.FRAGMENT,
  // 注意，由于 flags 的存在，我们已经不需要使用 tag 属性来存储唯一标识
  tag: null
}

// Portal
const portalVnode = {
  flags: VNodeFlags.PORTAL,
  // 注意，由于 flags 的存在，我们已经不需要使用 tag 属性来存储唯一标识，tag 属性用来存储 Portal 的 target
  tag: target
}
```

---

# h 函数

## 在VNode创建时确定其类型 - flags

```js
function h(tag, data = null, children = null) {
  let flags = null
  if (typeof tag === 'string') {
    flags = tag === 'svg' ? VNodeFlags.ELEMENT_SVG : VNodeFlags.ELEMENT_HTML
  } else if (tag === Fragment) {
    flags = VNodeFlags.FRAGMENT
  } else if (tag === Portal) {
    flags = VNodeFlags.PORTAL
    tag = data && data.target
  } else {
    // 兼容 Vue2 的对象式组件
    if (tag !== null && typeof tag === 'object') {
      flags = tag.functional
        ? VNodeFlags.COMPONENT_FUNCTIONAL       // 函数式组件
        : VNodeFlags.COMPONENT_STATEFUL_NORMAL  // 有状态组件
    } else if (typeof tag === 'function') {
      // Vue3 的类组件
      flags = tag.prototype && tag.prototype.render
        ? VNodeFlags.COMPONENT_STATEFUL_NORMAL  // 有状态组件
        : VNodeFlags.COMPONENT_FUNCTIONAL       // 函数式组件
    }
  }

  return {
    flags,
    // 其他属性...
  }
}
```

## 在VNode创建时确定其children的类型

```js
function h(tag, data = null, children = null) {
  // 省略用于确定 flags 相关的代码

  let childFlags = null
  if (Array.isArray(children)) {
    const { length } = children
    if (length === 0) {
      // 没有 children
      childFlags = ChildrenFlags.NO_CHILDREN
    } else if (length === 1) {
      // 单个子节点
      childFlags = ChildrenFlags.SINGLE_VNODE
      children = children[0]
    } else {
      // 多个子节点，且子节点使用key
      childFlags = ChildrenFlags.KEYED_VNODES
      children = normalizeVNodes(children)
    }
  } else if (children == null) {
    // 没有子节点
    childFlags = ChildrenFlags.NO_CHILDREN
  } else if (children._isVNode) {
    // 单个子节点
    childFlags = ChildrenFlags.SINGLE_VNODE
  } else {
    // 其他情况都作为文本节点处理，即单个子节点，会调用 createTextVNode 创建纯文本类型的 VNode
    childFlags = ChildrenFlags.SINGLE_VNODE
    children = createTextVNode(children + '')
  }
}
```

首先，如果 children 是数组，则根据数组的长度来判断 children 的类型到底是 ChildrenFlags.NO_CHILDREN、ChildrenFlags.SINGLE_VNODE 还是 ChildrenFlags.KEYED_VNODES。

这里大家可能会有疑问：“为什么多个子节点时会直接被当做使用了 key 的子节点？”，这是因为 key 是可以人为创造的，如下是 normalizeVNodes 函数的简化

如果 children 不满足以上任何条件，则会把 children 作为纯文本节点的文本内容处理

```js
function normalizeVNodes(children) {
  const newChildren = []
  // 遍历 children
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    if (child.key == null) {
      // 如果原来的 VNode 没有key，则使用竖线(|)与该VNode在数组中的索引拼接而成的字符串作为key
      child.key = '|' + i
    }
    newChildren.push(child)
  }
  // 返回新的children，此时 children 的类型就是 ChildrenFlags.KEYED_VNODES
  return newChildren
}

function normalizeVNodes(children) {
  const newChildren = []
  // 遍历 children
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    if (child.key == null) {
      // 如果原来的 VNode 没有key，则使用竖线(|)与该VNode在数组中的索引拼接而成的字符串作为key
      child.key = '|' + i
    }
    newChildren.push(child)
  }
  // 返回新的children，此时 children 的类型就是 ChildrenFlags.KEYED_VNODES
  return newChildren
}
```

## 使用 h 函数创建 VNode

例子：
假设有如下模板：
```html
<template>
  <div>
    <span></span>
  </div>
</template>

<template>
  <div>我是文本</div>
</template>

<template>
  <td></td>
  <td></td>
</template>

<template>
  <Portal target="#box">
    <h1></h1>
  </Portal>
</template>

<template>
  <MyFunctionalComponent>
    <div></div>
  </MyFunctionalComponent>
</template>
```

用 h 函数来创建与之相符的 VNode：
```js
import { h, Fragment, Portal } from './h'

const elementVNode = h('div', null, h('span'))

const elementWithTextVNode = h('div', null, '我是文本')

const fragmentVNode = h(Fragment, null, [
  h('td'), h('td')
])

const portalVNode = h(
  Portal,
  {
    target: '#box'
  },
  h('h1')
)

// 一个函数式组件
function MyFunctionalComponent() {}
// 传递给 h 函数的第一个参数就是组件函数本身
const functionalComponentVNode = h(MyFunctionalComponent, null, h('div'))
```

得到的 VNode 对象如下：
```js
const elementVNode = {
  _isVNode: true,
  flags: 1, // VNodeFlags.ELEMENT_HTML
  tag: 'div',
  data: null,
  children: {
    _isVNode: true,
    flags: 1, // VNodeFlags.ELEMENT_HTML
    tag: 'span',
    data: null,
    children: null,
    childFlags: 1, // ChildrenFlags.NO_CHILDREN
    el: null
  },
  childFlags: 2, // ChildrenFlags.SINGLE_VNODE
  el: null
}

const elementWithTextVNode = {
  _isVNode: true,
  flags: 1, // VNodeFlags.ELEMENT_HTML
  tag: 'div',
  data: null,
  children: {
    _isVNode: true,
    flags: 64,  // VNodeFlags.TEXT
    tag: null,
    data: null,
    children: '我是文本',
    childFlags: 1, // ChildrenFlags.NO_CHILDREN
    el: null
  },
  childFlags: 2, // ChildrenFlags.SINGLE_VNODE
  el: null
}

const fragmentVNode = {
  _isVNode: true,
  flags: 128, // VNodeFlags.FRAGMENT
  data: null,
  children: [
    {
      _isVNode: true,
      flags: 1, // VNodeFlags.ELEMENT_HTML
      tag: 'td',
      data: null,
      children: null,
      childFlags: 1,  // ChildrenFlags.NO_CHILDREN
      key: '|0', // 自动生成的 key
      el: null
    },
    {
      _isVNode: true,
      flags: 1, // VNodeFlags.ELEMENT_HTML
      tag: 'td',
      data: null,
      children: null,
      childFlags: 1,  // ChildrenFlags.NO_CHILDREN
      key: '|1', // 自动生成的 key
      el: null
    }
  ],
  childFlags: 4, // ChildrenFlags.KEYED_VNODES
  el: null
}

const portalVNode = {
  _isVNode: true,
  flags: 256, // VNodeFlags.PORTAL
  tag: '#box',  // 类型为 Portal 的 VNode，其 tag 属性值等于 data.target
  data: { target: '#box' },
  children: {
    _isVNode: true,
    flags: 1, // VNodeFlags.ELEMENT_HTML
    tag: 'h1',
    data: null,
    children: null,
    childFlags: 1, // ChildrenFlags.NO_CHILDREN
    el: null
  },
  childFlags: 2, // ChildrenFlags.SINGLE_VNODE
  el: null
}

const functionalComponentVNode = {
  _isVNode: true,
  flags: 32,  // VNodeFlags.COMPONENT_FUNCTIONAL
  tag: MyFunctionalComponent, // tag 属性值引用组件函数
  data: null,
  children: {
    _isVNode: true,
    flags: 1,
    tag: 'div',
    data: null,
    children: null,
    childFlags: 1,
    el: null
  },
  childFlags: 2, // ChildrenFlags.SINGLE_VNODE
  el: null
}
```


在设计有状态组件时，我们会设计一个基础组件，所有组件都会继承基础组件，并且基础组件拥有用来报告错误信息的 render 函数，这就是我们可以通过以下代码来区分函数式组件和有状态组件的原因：

```js
// Vue3 的类组件
flags =
  tag.prototype && tag.prototype.render
    ? VNodeFlags.COMPONENT_STATEFUL_NORMAL // 有状态组件
    : VNodeFlags.COMPONENT_FUNCTIONAL // 函数式组件

// 我们再来使用 h 函数创建有状态组件的 VNode，如下：
// 有状态组件应该继承 Component
class MyStatefulComponent extends Component {}
const statefulComponentVNode = h(MyStatefulComponent, null, h('div'))

// 此时我们得到的 VNode 对象如下：
const statefulComponentVNode = {
  _isVNode: true,
  flags: 4, // VNodeFlags.COMPONENT_STATEFUL_NORMAL
  data: null,
  children: {
    _isVNode: true,
    flags: 1,
    tag: 'div',
    data: null,
    children: null,
    childFlags: 1,
    el: null
  },
  childFlags: 2,
  el: null
}
```

---

# 渲染器之挂载

## 责任重大的渲染器

所谓渲染器，简单的说就是将 Virtual DOM 渲染成特定平台下真实 DOM 的工具(就是一个函数，通常叫 render)，渲染器的工作流程分为两个阶段：mount 和 patch，如果旧的 VNode 存在，则会使用新的 VNode 与旧的 VNode 进行对比，试图以最小的资源开销完成 DOM 的更新，这个过程就叫 patch，或“打补丁”。如果旧的 VNode 不存在，则直接将新的 VNode 挂载成全新的 DOM，这个过程叫做 mount。

通常渲染器接收两个参数，第一个参数是将要被渲染的 VNode 对象，第二个参数是一个用来承载内容的容器(container)，通常也叫挂载点。

```js
function render(vnode, container) {
  const prevVNode = container.vnode
  if (prevVNode == null) {
    if (vnode) {
      // 没有旧的 VNode，只有新的 VNode。使用 `mount` 函数挂载全新的 VNode
      mount(vnode, container)
      // 将新的 VNode 添加到 container.vnode 属性下，这样下一次渲染时旧的 VNode 就存在了
      container.vnode = vnode
    }
  } else {
    if (vnode) {
      // 有旧的 VNode，也有新的 VNode。则调用 `patch` 函数打补丁
      patch(prevVNode, vnode, container)
      // 更新 container.vnode
      container.vnode = vnode
    } else {
      // 有旧的 VNode 但是没有新的 VNode，这说明应该移除 DOM，在浏览器中可以使用 removeChild 函数。
      container.removeChild(prevVNode.el)
      container.vnode = null
    }
  }
}
```

- 控制部分组件生命周期钩子的调用
在整个渲染周期中包含了大量的 DOM 操作、组件的挂载、卸载，控制着组件的生命周期钩子调用的时机。

- 多端渲染的桥梁
渲染器也是多端渲染的桥梁，自定义渲染器的本质就是把特定平台操作“DOM”的方法从核心算法中抽离，并提供可配置的方案。

- 与异步渲染有直接关系
Vue3 的异步渲染是基于调度器的实现，若要实现异步渲染，组件的挂载就不能同步进行，DOM的变更就要在合适的时机，一些需要在真实DOM存在之后才能执行的操作(如 ref)也应该在合适的时机进行。对于时机的控制是由调度器来完成的，但类似于组件的挂载与卸载以及操作 DOM 等行为的入队还是由渲染器来完成的，这也是为什么 Vue2 无法轻易实现异步渲染的原因。

- 包含最核心的 Diff 算法
Diff 算法是渲染器的核心特性之一，可以说正是 Diff 算法的存在才使得 Virtual DOM 如此成功。

## 挂载标签元素

mount 函数的作用是把一个 VNode 渲染成真实 DOM

```js
function mount(vnode, container) {
  const { flags } = vnode
  if (flags & VNodeFlags.ELEMENT) {
    // 挂载普通标签
    mountElement(vnode, container)
  } else if (flags & VNodeFlags.COMPONENT) {
    // 挂载组件
    mountComponent(vnode, container)
  } else if (flags & VNodeFlags.TEXT) {
    // 挂载纯文本
    mountText(vnode, container)
  } else if (flags & VNodeFlags.FRAGMENT) {
    // 挂载 Fragment
    mountFragment(vnode, container)
  } else if (flags & VNodeFlags.PORTAL) {
    // 挂载 Portal
    mountPortal(vnode, container)
  }
}
```

```js
function mountElement(vnode, container) {
  const isSVG = vnode.flags & VNodeFlags.ELEMENT_SVG
  const el = isSVG
    ? document.createElementNS('http://www.w3.org/2000/svg', vnode.tag)
    : document.createElement(vnode.tag)
  // 解决 不能严谨地处理 SVG 标签
    
  vnode.el = el
  // 解决 VNode 被渲染为真实DOM之后，没有引用真实DOM元素

  // 拿到 VNodeData
  const data = vnode.data
  if (data) {
    // 如果 VNodeData 存在，则遍历之
    for(let key in data) {
      // key 可能是 class、style、on 等等
      switch(key) {
        case 'style':
          // 如果 key 的值是 style，说明是内联样式，逐个将样式规则应用到 el
          for(let k in data.style) {
            el.style[k] = data.style[k]
          }
        break
      }
    }
  }
  // 解决 没有将 VNodeData 应用到元素上

  // 递归挂载子节点
  // 拿到 children 和 childFlags
  const childFlags = vnode.childFlags
  const children = vnode.children
  // 检测如果没有子节点则无需递归挂载
  if (childFlags !== ChildrenFlags.NO_CHILDREN) {
    if (childFlags & ChildrenFlags.SINGLE_VNODE) {
      // 如果是单个子节点则调用 mount 函数挂载
      mount(children, el)
    } else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
      // 如果是单多个子节点则遍历并调用 mount 函数挂载
      for (let i = 0; i < children.length; i++) {
        mount(children[i], el)
      }
    }
  }
  // 解决 没有继续挂载子节点，即 children

  const childFlags = vnode.childFlags
  if (childFlags !== ChildrenFlags.NO_CHILDREN) {
    if (childFlags & ChildrenFlags.SINGLE_VNODE) {
      // 这里需要把 isSVG 传递下去
      mount(children, el, isSVG)
    } else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
      for (let i = 0; i < children.length; i++) {
        // 这里需要把 isSVG 传递下去
        mount(children[i], el, isSVG)
      }
    }
  }
  // 解决 svg 标签的子代元素挂载

  container.appendChild(el)
}
```

## class的处理

```js
// 数组
dynamicClass = ['class-b', 'class-c']

// 对象
dynamicClass = {
  'class-b': true,
  'class-c': true
}

h('div', {
  class: ['class-a', dynamicClass]
})
```

在框架设计中比较重要的概念：应用层的设计，这是框架设计的核心，在设计一个功能的时候，你首先要考虑的应该是应用层的使用，然后再考虑如何与底层衔接。还是以 class 为例，为一个标签元素设置类名的方法是可定的(调用 el.className 或 setAttribute)，关键就在于你想在应用层做出怎样的设计，很自然的你要思考如何转化应用层的数据结构与底层衔接。

## Attributes 和 DOM Properties

DOM的 Attributes 以及 Properties， 分别简称他们为 attr 和 DOM Prop。

Attr 指的就是那些存在于标签上的属性，而 DOM Prop 就是存在于DOM对象上的属性。但是当标签上存在非标准属性时，该属性不会被转化为 DOM Prop

```js
// checkbox 元素
const checkboxEl = document.querySelector('input')
// 使用 setAttribute 设置 checked 属性为 false
checkboxEl.setAttribute('checked', false)

console.log(checkboxEl.checked) // true
```

可以看到虽然我们使用 setAttribute 函数将复选框的 checked 属性设置为 false，但是当我们访问 checkboxEl.checked 时得到的依然是 true，这是因为在 setAttribute 函数为元素设置属性时，无论你传递的值是什么类型，它都会将该值转为字符串再设置到元素上，所以如下两句代码是等价的：

```js
checkboxEl.setAttribute('checked', false)
// 等价于
checkboxEl.setAttribute('checked', 'false')
```

```js
const domPropsRE = /\[A-Z]|^(?:value|checked|selected|muted)$/
function mountElement(vnode, container, isSVG) {
  // 省略...

  const data = vnode.data
  if (data) {
    for (let key in data) {
      switch (key) {
        case 'style':
          for (let k in data.style) {
            el.style[k] = data.style[k]
          }
          break
        case 'class':
          el.className = data[key]
          break
        default:
          if (domPropsRE.test(key)) {
            // 当作 DOM Prop 处理
            el[key] = data[key]
          } else {
            // 当作 Attr 处理
            el.setAttribute(key, data[key])
          }
          break
      }
    }
  }

  // 省略...
}
```

## 事件的处理
```js
function mountElement(vnode, container, isSVG) {
  // 省略...

  const data = vnode.data
  if (data) {
    for (let key in data) {
      switch (key) {
        case 'style':
          for (let k in data.style) {
            el.style[k] = data.style[k]
          }
          break
        case 'class':
          if (isSVG) {
            el.setAttribute('class', data[key])
          } else {
            el.className = data[key]
          }
          break
        default:
          if (key[0] === 'o' && key[1] === 'n') {
            // 事件
            el.addEventListener(key.slice(2), data[key])
          } else if (domPropsRE.test(key)) {
            // 当作 DOM Prop 处理
            el[key] = data[key]
          } else {
            // 当作 Attr 处理
            el.setAttribute(key, data[key])
          }
          break
      }
    }
  }

  // 省略...
}
```


## 挂载纯文本、Fragment 和 Portal

### 挂载文本节点

```js
function mountText(vnode, container) {
  const el = document.createTextNode(vnode.children)
  vnode.el = el
  container.appendChild(el)
}
```


### 挂载 Fragment
```js
function mountFragment(vnode, container, isSVG) {
  const { children, childFlags } = vnode
  switch (childFlags) {
    case ChildrenFlags.SINGLE_VNODE:
      mount(children, container, isSVG)
      // 单个子节点，就指向该节点
      vnode.el = children.el
      break
    case ChildrenFlags.NO_CHILDREN:
      const placeholder = createTextVNode('')
      mountText(placeholder, container)
      // 没有子节点指向占位的空文本节点
      vnode.el = placeholder.el
      break
    default:
      for (let i = 0; i < children.length; i++) {
        mount(children[i], container, isSVG)
      }
      // 多个子节点，指向第一个子节点
      vnode.el = children[0].el
  }
}
```

那么这样设计有什么意义呢？这是因为在 patch 阶段对DOM元素进行移动时，应该确保将其放到正确的位置，而不应该始终使用 appendChild 函数，有时需要使用 insertBefore 函数，这时候我们就需要拿到相应的节点引用，这时候 vnode.el 属性是必不可少的，就像上面的代码中即使 Fragment 没有子节点我们依然需要一个占位的空文本节点作为位置的引用。


### 挂载 Portal

Portal 可以不严谨地认为是可以被到处挂载的 Fragment

```js
function mountPortal(vnode, container) {
  const { tag, children, childFlags } = vnode
  const target = typeof tag === 'string' ? document.querySelector(tag) : tag
  if (childFlags & ChildrenFlags.SINGLE_VNODE) {
    mount(children, target)
  } else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
    for (let i = 0; i < children.length; i++) {
      mount(children[i], target)
    }
  }

  // 占位的空文本节点
  const placeholder = createTextVNode('')
  // 将该节点挂载到 container 中
  mountText(placeholder, container, null)
  // el 属性引用该节点
  vnode.el = placeholder.el
}
```


### 有状态组件的挂载和原理

第一步：创建组件实例
如果一个 VNode 描述的是有状态组件，那么 vnode.tag 属性值就是组件类的引用，所以通过 new 关键字创建组件实例。

第二步：获取组件产出的 VNode
一个组件的核心就是其 render 函数，通过调用 render 函数可以拿到该组件要渲染的内容。

第三步：mount 挂载
既然已经拿到了 VNode，那么就将其挂载到 container 上就可以了。

第四步：让组件实例的 $el 属性和 vnode.el 属性的值引用组件的根DOM元素
组件的 render 函数会返回该组件产出的 VNode，当该 VNode 被挂载为真实DOM之后，就可以通过 instance.$vnode.el 元素拿到组件的根DOM元素，接着我们就可以让组件实例的 $el 属性和 vnode.el 属性的值都引用该DOM元素。如果组件的 render 返回的是一个片段(Fragment)，那么 instance.$el 和 vnode.el 引用的就是该片段的第一个DOM元素。

```js
function mountComponent(vnode, container, isSVG) {
  if (vnode.flags & VNodeFlags.COMPONENT_STATEFUL) {
    mountStatefulComponent(vnode, container, isSVG)
  } else {
    mountFunctionalComponent(vnode, container, isSVG)
  }
}

function mountStatefulComponent(vnode, container, isSVG) {
  // 创建组件实例
  const instance = new vnode.tag()
  // 渲染VNode
  instance.$vnode = instance.render()
  // 挂载
  mount(instance.$vnode, container, isSVG)
  // el 属性值 和 组件实例的 $el 属性都引用组件的根DOM元素
  instance.$el = vnode.el = instance.$vnode.el
}
```


### 函数式组件的挂载和原理

在挂载函数式组件的时候，比挂载有状态组件少了一个实例化的过程，如果一个 VNode 描述的是函数式组件，那么其 tag 属性值就是该函数的引用

```js
function mountFunctionalComponent(vnode, container, isSVG) {
  // 获取 VNode
  const $vnode = vnode.tag()
  // 挂载
  mount($vnode, container, isSVG)
  // el 元素引用该组件的根元素
  vnode.el = $vnode.el
}
```

实际上如果对于 有状态组件 和 函数式组件 具体的区别不太了解的同学看到这里或许会产生疑问，觉得 有状态组件 的实例化很多余，实际上实例化是必须的，因为 有状态组件 在实例化的过程中会初始化一系列 有状态组件 所特有的东西，诸如 data(或state)、computed、watch、生命周期等等。而函数式组件只有 props 和 slots，它要做的工作很少，所以性能上会更好。

