[title]: # (Vue渲染器)
[date]: # (2020-03-05 &nbsp; 22:35:53)
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


---


# 渲染器之patch

渲染器除了将全新的 VNode 挂载成真实DOM之外，它的另外一个职责是负责对新旧 VNode 进行比对，并以合适的方式更新DOM，也就是我们常说的 patch。

## 基本原则

通常重渲染(re-render)是由组件的更新开始的，因为在框架的使用层面开发者通过变更数据状态从而引起框架内部对UI的自动更新，但是组件的更新本质上还是对真实DOM的更新，或者说是对标签元素的更新。

```js
function render(vnode, container) {
  const prevVNode = container.vnode
  if (prevVNode == null) {
    if (vnode) {
      // 没有旧的 VNode，使用 `mount` 函数挂载全新的 VNode
      mount(vnode, container)
      // 将新的 VNode 添加到 container.vnode 属性下，这样下一次渲染时旧的 VNode 就存在了
      container.vnode = vnode
    }
  } else {
    if (vnode) {
      // 有旧的 VNode，则调用 `patch` 函数打补丁
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

```js
// 旧的 VNode
const prevVNode = h('div')

// 新的 VNode
const nextVNode = h('span')

// 第一次渲染 VNode 到 #app，此时会调用 mount 函数
render(prevVNode, document.getElementById('app'))

// 第二次渲染新的 VNode 到相同的 #app 元素，此时会调用 patch 函数
render(nextVNode, document.getElementById('app'))
```

不同的 VNode 之间第一个比对原则就是：只有相同类型的 VNode 才有比对的意义，例如我们有两个 VNode，其中一个 VNode 的类型是标签元素，而另一个 VNode 的类型是组件，当这两个 VNode 进行比对时，最优的做法是使用新的 VNode 完全替换旧的 VNode。

```js
function patch(prevVNode, nextVNode, container) {
  // 分别拿到新旧 VNode 的类型，即 flags
  const nextFlags = nextVNode.flags
  const prevFlags = prevVNode.flags

  // 检查新旧 VNode 的类型是否相同，如果类型不同，则直接调用 replaceVNode 函数替换 VNode
  // 如果新旧 VNode 的类型相同，则根据不同的类型调用不同的比对函数
  if (prevFlags !== nextFlags) {
    replaceVNode(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.ELEMENT) {
    patchElement(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.COMPONENT) {
    patchComponent(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.TEXT) {
    patchText(prevVNode, nextVNode)
  } else if (nextFlags & VNodeFlags.FRAGMENT) {
    patchFragment(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.PORTAL) {
    patchPortal(prevVNode, nextVNode)
  }
}
```

核心原则是：如果类型不同，则直接调用 replaceVNode 函数使用新的 VNode 替换旧的 VNode，否则根据不同的类型调用与之相符的比对函数。


## 替换 VNode

```js
// 旧的 VNode 是一个 div 标签
const prevVNode = h('div', null, '旧的 VNode')

class MyComponent {
  render () {
    return h('h1', null, '新的 VNode')
  }
}
// 新的 VNode 是一个组件
const nextVNode = h(MyComponent)

// 先后渲染新旧 VNode 到 #app
render(prevVNode, document.getElementById('app'))
render(nextVNode, document.getElementById('app'))
```

替换操作并不复杂，本质就是把旧的 VNode 所渲染的DOM移除，再挂载新的 VNode

```js
function replaceVNode(prevVNode, nextVNode, container) {
  // 将旧的 VNode 所渲染的 DOM 从容器中移除
  container.removeChild(prevVNode.el)
  // 再把新的 VNode 挂载到容器中
  mount(nextVNode, container)
}
```


## 更新标签元素

### 更新标签元素的基本原则

我们认为不同的标签渲染的内容不同。

相同标签拥有不同样式时,先将红色背景从元素上移除，再为元素添加绿色边框。

宏观化：将新的 VNodeData 全部应用到元素上，再把那些已经不存在于新的 VNodeData 上的数据从元素上移除。

```js
// 旧的 VNode
const prevVNode = h('div', {
  style: {
    width: '100px',
    height: '100px',
    backgroundColor: 'red'
  }
})

// 新的 VNode
const nextVNode = h('div', {
  style: {
    width: '100px',
    height: '100px',
    border: '1px solid green'
  }
})
```

```js
function patchElement(prevVNode, nextVNode, container) {
  // 如果新旧 VNode 描述的是不同的标签，则调用 replaceVNode 函数，使用新的 VNode 替换旧的 VNode
  if (prevVNode.tag !== nextVNode.tag) {
    replaceVNode(prevVNode, nextVNode, container)
    return
  }

  // 拿到 el 元素，注意这时要让 nextVNode.el 也引用该元素
  const el = (nextVNode.el = prevVNode.el)
  // 拿到 新旧 VNodeData
  const prevData = prevVNode.data
  const nextData = nextVNode.data
  // 新的 VNodeData 存在时才有必要更新
  if (nextData) {
    // 遍历新的 VNodeData
    for (let key in nextData) {
      // 根据 key 拿到新旧 VNodeData 值
      const prevValue = prevData[key]
      const nextValue = nextData[key]
      switch (key) {
        case 'style':
          // 遍历新 VNodeData 中的 style 数据，将新的样式应用到元素
          for (let k in nextValue) {
            el.style[k] = nextValue[k]
          }
          // 遍历旧 VNodeData 中的 style 数据，将已经不存在于新的 VNodeData 的数据移除
          for (let k in prevValue) {
            if (!nextValue.hasOwnProperty(k)) {
              el.style[k] = ''
            }
          }
          break
        default:
          break
      }
    }
  }
}
```

我们在更新 VNodeData 时的思路分为以下几步：
第 1 步：当新的 VNodeData 存在时，遍历新的 VNodeData。
第 2 步：根据新 VNodeData 中的 key，分别尝试读取旧值和新值，即 prevValue 和 nextValue。
第 3 步：使用 switch...case 语句匹配不同的数据进行不同的更新操作

以样式(style)的更新为例，如上代码所展示的更新过程是：
1 ：遍历新的样式数据(prevValue)，将新的样式数据全部应用到元素上
2 ：遍历旧的样式数据(nextValue)，将那些已经不存在于新的样式数据中的样式从元素上移除，最终我们完成了元素样式的更新。


### 更新 VNodeData

patchData 函数修改 patchElement 函数的代码

```js
function patchElement(prevVNode, nextVNode, container) {
  // 如果新旧 VNode 描述的是不同的标签，则调用 replaceVNode 函数，使用新的 VNode 替换旧的 VNode
  if (prevVNode.tag !== nextVNode.tag) {
    replaceVNode(prevVNode, nextVNode, container)
    return
  }

  // 拿到 el 元素，注意这时要让 nextVNode.el 也引用该元素
  const el = (nextVNode.el = prevVNode.el)
  const prevData = prevVNode.data
  const nextData = nextVNode.data

  if (nextData) {
    // 遍历新的 VNodeData，将旧值和新值都传递给 patchData 函数
    for (let key in nextData) {
      const prevValue = prevData[key]
      const nextValue = nextData[key]
      patchData(el, key, prevValue, nextValue)
    }
  }
  if (prevData) {
    // 遍历旧的 VNodeData，将已经不存在于新的 VNodeData 中的数据移除
    for (let key in prevData) {
      const prevValue = prevData[key]
      if (prevValue && !nextData.hasOwnProperty(key)) {
        // 第四个参数为 null，代表移除数据
        patchData(el, key, prevValue, null)
      }
    }
  }
}
```

历新的 VNodeData，将旧值和新值都传递给 patchData 函数，并由 patchData 函数负责更新数据；同时也需要遍历旧的 VNodeData，将已经不存在于新的 VNodeData 中的数据从元素上移除。

patchData 函数：

```js
export function patchData(el, key, prevValue, nextValue) {
  switch (key) {
    case 'style':
      for (let k in nextValue) {
        el.style[k] = nextValue[k]
      }
      for (let k in prevValue) {
        if (!nextValue.hasOwnProperty(k)) {
          el.style[k] = ''
        }
      }
      break
    case 'class':
      el.className = nextValue
      break
    default:
      if (key[0] === 'o' && key[1] === 'n') {
        // 事件
        el.addEventListener(key.slice(2), nextValue)
      } else if (domPropsRE.test(key)) {
        // 当作 DOM Prop 处理
        el[key] = nextValue
      } else {
        // 当作 Attr 处理
        el.setAttribute(key, nextValue)
      }
      break
  }
}
```

这样 patchData 函数就能够用来处理 style、class、DOM Prop 以及 Attr 的更新操作，并且可以同时满足 mountElement 和 patchElement 的需求。但 patchData 函数还不能够满足事件的更新操作，因为当新的 VNodeData 中已经不包含某个事件时，我们需要将旧的事件回调函数移除.

```js
export function patchData(el, key, prevValue, nextValue) {
  switch (key) {
    case 'style':
      // 省略处理样式的代码...
    case 'class':
      // 省略处理 class 的代码...
    default:
      if (key[0] === 'o' && key[1] === 'n') {
        // 事件
        // 移除旧事件
        if (prevValue) {
          el.removeEventListener(key.slice(2), prevValue)
        }
        // 添加新事件
        if (nextValue) {
          el.addEventListener(key.slice(2), nextValue)
        }
      } else if (domPropsRE.test(key)) {
        // 当作 DOM Prop 处理
        el[key] = nextValue
      } else {
        // 当作 Attr 处理
        el.setAttribute(key, nextValue)
      }
      break
  }
}
```

### 更新子节点

patchElement 函数中最后一步需要做的事情就是递归地更新子节点

```js
function patchElement(prevVNode, nextVNode, container) {
  // 如果新旧 VNode 描述的是不同的标签，则调用 replaceVNode 函数，使用新的 VNode 替换旧的 VNode
  if (prevVNode.tag !== nextVNode.tag) {
    replaceVNode(prevVNode, nextVNode, container)
    return
  }

  // 拿到 el 元素，注意这时要让 nextVNode.el 也引用该元素
  const el = (nextVNode.el = prevVNode.el)
  const prevData = prevVNode.data
  const nextData = nextVNode.data

  if (nextData) {
    // 遍历新的 VNodeData，将旧值和新值都传递给 patchData 函数
    for (let key in nextData) {
      const prevValue = prevData[key]
      const nextValue = nextData[key]
      patchData(el, key, prevValue, nextValue)
    }
  }
  if (prevData) {
    // 遍历旧的 VNodeData，将已经不存在于新的 VNodeData 中的数据移除
    for (let key in prevData) {
      const prevValue = prevData[key]
      if (prevValue && !nextData.hasOwnProperty(key)) {
        // 第四个参数为 null，代表移除数据
        patchData(el, key, prevValue, null)
      }
    }
  }

  // 调用 patchChildren 函数递归地更新子节点
  patchChildren(
    prevVNode.childFlags, // 旧的 VNode 子节点的类型
    nextVNode.childFlags, // 新的 VNode 子节点的类型
    prevVNode.children,   // 旧的 VNode 子节点
    nextVNode.children,   // 新的 VNode 子节点
    el                    // 当前标签元素，即这些子节点的父节点
  )
}
```

```js
function patchChildren(
  prevChildFlags,
  nextChildFlags,
  prevChildren,
  nextChildren,
  container
) {
  switch (prevChildFlags) {
    case ChildrenFlags.SINGLE_VNODE:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          // 此时 prevChildren 和 nextChildren 都是 VNode 对象
          patch(prevChildren, nextChildren, container)
          break
        case ChildrenFlags.NO_CHILDREN:
          // 新的 children 中没有子节点时，会执行该 case 语句块
          break
        default:
          // 新的 children 中有多个子节点时，会执行该 case 语句块
          break
      }
      break

    // 省略...
  }
}
```

想办法把已经渲染好了的 DOM 元素从页面上移除。

```js
function patchChildren(
  prevChildFlags,
  nextChildFlags,
  prevChildren,
  nextChildren,
  container
) {
  switch (prevChildFlags) {
    // 旧的 children 是单个子节点，会执行该 case 语句块
    case ChildrenFlags.SINGLE_VNODE:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          // 新的 children 也是单个子节点时，会执行该 case 语句块
          patch(prevChildren, nextChildren, container)
          break
        case ChildrenFlags.NO_CHILDREN:
          // 新的 children 中没有子节点时，会执行该 case 语句块
          container.removeChild(prevChildren.el)
          break
        default:
          // 新的 children 中有多个子节点时，会执行该 case 语句块
          break
      }
      break

    // 省略...
  }
}
```

将旧的单个子节点移除，再将新的多个子节点挂载上去

```js
function patchChildren(
  prevChildFlags,
  nextChildFlags,
  prevChildren,
  nextChildren,
  container
) {
  switch (prevChildFlags) {
    // 旧的 children 是单个子节点，会执行该 case 语句块
    case ChildrenFlags.SINGLE_VNODE:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          patch(prevChildren, nextChildren, container)
          break
        case ChildrenFlags.NO_CHILDREN:
          container.removeChild(prevChildren.el)
          break
        default:
          // 移除旧的单个子节点
          container.removeChild(prevChildren.el)
          // 遍历新的多个子节点，逐个挂载到容器中
          for (let i = 0; i < nextChildren.length; i++) {
            mount(nextChildren[i], container)
          }
          break
      }
      break

    // 省略...
  }
}
```


情况一：有多个旧的子节点，但新的子节点是单个子节点，这时只需要把所有旧的子节点移除，再将新的单个子节点添加到容器元素即可。
情况二：有多个旧的子节点，但没有新的子节点，这时只需要把所有旧的子节点移除即可。
情况三：新旧子节点都是多个子节点，这时将进入到至关重要的一步，即核心 diff 算法的用武之地。

```js
function patchChildren(
  prevChildFlags,
  nextChildFlags,
  prevChildren,
  nextChildren,
  container
) {
  switch (prevChildFlags) {
    // 省略...

    // 旧的 children 中有多个子节点时，会执行该 case 语句块
    default:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          for (let i = 0; i < prevChildren.length; i++) {
            container.removeChild(prevChildren[i].el)
          }
          mount(nextChildren, container)
          break
        case ChildrenFlags.NO_CHILDREN:
          for (let i = 0; i < prevChildren.length; i++) {
            container.removeChild(prevChildren[i].el)
          }
          break
        default:
          // 遍历旧的子节点，将其全部移除
          for (let i = 0; i < prevChildren.length; i++) {
            container.removeChild(prevChildren[i].el)
          }
          // 遍历新的子节点，将其全部添加
          for (let i = 0; i < nextChildren.length; i++) {
            mount(nextChildren[i], container)
          }
          break
      }
      break
  }
}
```

真正的核心 diff 算法我们将会在下一章统一着重讲解，简化版本的实现如上。


## 更新文本节点

```js
// 创建一个文本节点
const textEl = document.createTextNode('a')
textEl.nodeValue  // 'a'
textEl.nodeValue = 'b'
textEl.nodeValue  // 'b'
```

```js
function patchText(prevVNode, nextVNode) {
  // 拿到文本元素 el，同时让 nextVNode.el 指向该文本元素
  const el = (nextVNode.el = prevVNode.el)
  // 只有当新旧文本内容不一致时才有必要更新
  if (nextVNode.children !== prevVNode.children) {
    el.nodeValue = nextVNode.children
  }
}
```


## 更新 Fragment

片段的更新是简化版的标签元素的更新

```js
function patchFragment(prevVNode, nextVNode, container) {
  // 直接调用 patchChildren 函数更新 新旧片段的子节点即可
  patchChildren(
    prevVNode.childFlags, // 旧片段的子节点类型
    nextVNode.childFlags, // 新片段的子节点类型
    prevVNode.children,   // 旧片段的子节点
    nextVNode.children,   // 新片段的子节点
    container
  )

  switch (nextVNode.childFlags) {
    case ChildrenFlags.SINGLE_VNODE:
      nextVNode.el = nextVNode.children.el
      break
    case ChildrenFlags.NO_CHILDREN:
      nextVNode.el = prevVNode.el
      break
    default:
      nextVNode.el = nextVNode.children[0].el
  }
}
```


## 更新 Portal

不严谨但很直观的比喻：可以把 Portal 当作可以到处挂载的 Fragment。

```js
function patchPortal(prevVNode, nextVNode) {
  patchChildren(
    prevVNode.childFlags,
    nextVNode.childFlags,
    prevVNode.children,
    nextVNode.children,
    prevVNode.tag // 注意 container 是旧的 container
  )
  // 让 nextVNode.el 指向 prevVNode.el
  nextVNode.el = prevVNode.el

  // 如果新旧容器不同，才需要搬运
  if (nextVNode.tag !== prevVNode.tag) {
    // 获取新的容器元素，即挂载目标
    const container =
      typeof nextVNode.tag === 'string'
        ? document.querySelector(nextVNode.tag)
        : nextVNode.tag

    switch (nextVNode.childFlags) {
      case ChildrenFlags.SINGLE_VNODE:
        // 如果新的 Portal 是单个子节点，就把该节点搬运到新容器中
        container.appendChild(nextVNode.children.el)
        break
      case ChildrenFlags.NO_CHILDREN:
        // 新的 Portal 没有子节点，不需要搬运
        break
      default:
        // 如果新的 Portal 是多个子节点，遍历逐个将它们搬运到新容器中
        for (let i = 0; i < nextVNode.children.length; i++) {
          container.appendChild(nextVNode.children[i].el)
        }
        break
    }
  }
}
```


## 有状态组件的更新

有状态组件来说它的更新方式有两种：主动更新 和 被动更新。

所谓主动更新指的是组件自身的状态发生变化所导致的更新，它除了自身状态之外，很可能还包含从父组件传递进来的外部状态(props)，所以父组件自身状态的变化很可能引起子组件外部状态的变化，此时就需要更新子组件，像这种因为外部状态变化而导致的组件更新就叫做被动更新。

### 主动更新

数据变化之后需要重新执行渲染函数，得到新的 VNode。

组件挂载的核心步骤分为三步：1、创建组件实例，2、调用组件的 render 获得 VNode，3、将 VNode 挂载到容器元素。

```js
function mountStatefulComponent(vnode, container, isSVG) {
  // 创建组件实例
  const instance = new vnode.tag()

  instance._update = function() {
    // 如果 instance._mounted 为真，说明组件已挂载，应该执行更新操作
    if (instance._mounted) {
      // 1、拿到旧的 VNode
      const prevVNode = instance.$vnode
      // 2、重渲染新的 VNode
      const nextVNode = (instance.$vnode = instance.render())
      // 3、patch 更新
      patch(prevVNode, nextVNode, prevVNode.el.parentNode)
      // 4、更新 vnode.el 和 $el
      instance.$el = vnode.el = instance.$vnode.el
    } else {
      // 1、渲染VNode
      instance.$vnode = instance.render()
      // 2、挂载
      mount(instance.$vnode, container, isSVG)
      // 3、组件已挂载的标识
      instance._mounted = true
      // 4、el 属性值 和 组件实例的 $el 属性都引用组件的根DOM元素
      instance.$el = vnode.el = instance.$vnode.el
      // 5、调用 mounted 钩子
      instance.mounted && instance.mounted()
    }
  }

  instance._update()
}
```


### 初步了解组件的外部状态 props

组件的被动更新是由组件的外部状态变化所导致的，而 props 就是组件的外部状态。

```js
function mountStatefulComponent(vnode, container, isSVG) {
  // 创建组件实例
  const instance = (vnode.children = new vnode.tag())
  // 初始化 props
  instance.$props = vnode.data

  // 省略...
}
```


### 被动更新

被动更新指的是由外部状态变化而引起的更新操作，通常父组件自身状态的变化可能会引起子组件的更新。

```js
// 子组件类
class ChildComponent {
  render() {
    // 子组件中访问外部状态：this.$props.text
    return h('div', null, this.$props.text)
  }
}
// 父组件类
class ParentComponent {
  localState = 'one'

  mounted() {
    // 两秒钟后将 localState 的值修改为 'two'
    setTimeout(() => {
      this.localState = 'two'
      this._update()
    }, 2000)
  }

  render() {
    return h(ChildComponent, {
      // 父组件向子组件传递的 props
      text: this.localState
    })
  }
}

// 有状态组件 VNode
const compVNode = h(ParentComponent)
render(compVNode, document.getElementById('app'))
```

```js
function patchComponent(prevVNode, nextVNode, container) {
  // 检查组件是否是有状态组件
  if (nextVNode.flags & VNodeFlags.COMPONENT_STATEFUL_NORMAL) {
    // 1、获取组件实例
    const instance = (nextVNode.children = prevVNode.children)
    // 2、更新 props
    instance.$props = nextVNode.data
    // 3、更新组件
    instance._update()
  }
}
```


## 函数式组件的更新

```js
function mountFunctionalComponent(vnode, container, isSVG) {
  vnode.handle = {
    prev: null,
    next: vnode,
    container,
    update: () => {
      if (vnode.handle.prev) {
        // 更新
        // prevVNode 是旧的组件VNode，nextVNode 是新的组件VNode
        const prevVNode = vnode.handle.prev
        const nextVNode = vnode.handle.next
        // prevTree 是组件产出的旧的 VNode
        const prevTree = prevVNode.children
        // 更新 props 数据
        const props = nextVNode.data
        // nextTree 是组件产出的新的 VNode
        const nextTree = (nextVNode.children = nextVNode.tag(props))
        // 调用 patch 函数更新
        patch(prevTree, nextTree, vnode.handle.container)
      } else {
        // 获取 props
        const props = vnode.data
        // 获取 VNode
        const $vnode = (vnode.children = vnode.tag(props))
        // 挂载
        mount($vnode, container, isSVG)
        // el 元素引用该组件的根元素
        vnode.el = $vnode.el
      }
    }
  }

  // 立即调用 vnode.handle.update 完成初次挂载
  vnode.handle.update()
}
```

```js
function patchComponent(prevVNode, nextVNode, container) {
  if (nextVNode.tag !== prevVNode.tag) {
    replaceVNode(prevVNode, nextVNode, container)
  } else if (nextVNode.flags & VNodeFlags.COMPONENT_STATEFUL_NORMAL) {
    // 省略...
  } else {
    // 更新函数式组件
    // 通过 prevVNode.handle 拿到 handle 对象
    const handle = (nextVNode.handle = prevVNode.handle)
    // 更新 handle 对象
    handle.prev = prevVNode
    handle.next = nextVNode
    handle.container = container

    // 调用 update 函数完成更新
    handle.update()
  }
}
```


---


# 渲染器的核心 Diff 算法

## 减小DOM操作的性能开销

只有当新旧子节点的类型都是多个子节点时，核心 Diff 算法才派得上用场。

```js
function patchChildren(
  prevChildFlags,
  nextChildFlags,
  prevChildren,
  nextChildren,
  container
) {
  switch (prevChildFlags) {
    // 省略...

    // 旧的 children 中有多个子节点
    default:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          // 省略...
        case ChildrenFlags.NO_CHILDREN:
          // 省略...
        default:
          // 新的 children 中有多个子节点
          // 获取公共长度，取新旧 children 长度较小的那一个
          const prevLen = prevChildren.length
          const nextLen = nextChildren.length
          const commonLength = prevLen > nextLen ? nextLen : prevLen
          for (let i = 0; i < commonLength; i++) {
            patch(prevChildren[i], nextChildren[i], container)
          }
          // 如果 nextLen > prevLen，将多出来的元素添加
          if (nextLen > prevLen) {
            for (let i = commonLength; i < nextLen; i++) {
              mount(nextChildren[i], container)
            }
          } else if (prevLen > nextLen) {
            // 如果 prevLen > nextLen，将多出来的元素移除
            for (let i = commonLength; i < prevLen; i++) {
              container.removeChild(prevChildren[i].el)
            }
          }
          break
      }
      break
  }
}
```


## 尽可能的复用 DOM 元素

### key的作用

通过移动元素的位置来达到更新的目的。

```js
// 遍历新的 children
for (let i = 0; i < nextChildren.length; i++) {
  const nextVNode = nextChildren[i]
  let j = 0
  // 遍历旧的 children
  for (j; j < prevChildren.length; j++) {
    const prevVNode = prevChildren[j]
    // 如果找到了具有相同 key 值的两个节点，则调用 `patch` 函数更新之
    if (nextVNode.key === prevVNode.key) {
      patch(prevVNode, nextVNode, container)
      break // 这里需要 break
    }
  }
}
```

### 找到需要移动的节点

如果在寻找的过程中遇到的索引呈现递增趋势，则说明新旧 children 中节点顺序相同，不需要移动操作。相反的，如果在寻找的过程中遇到的索引值不呈现递增趋势，则说明需要移动操作。

寻找过程中在旧 children 中所遇到的最大索引值。如果在后续寻找的过程中发现存在索引值比最大索引值小的节点，意味着该节点需要被移动。

```js
// 用来存储寻找过程中遇到的最大索引值
let lastIndex = 0
// 遍历新的 children
for (let i = 0; i < nextChildren.length; i++) {
  const nextVNode = nextChildren[i]
  let j = 0
  // 遍历旧的 children
  for (j; j < prevChildren.length; j++) {
    const prevVNode = prevChildren[j]
    // 如果找到了具有相同 key 值的两个节点，则调用 `patch` 函数更新之
    if (nextVNode.key === prevVNode.key) {
      patch(prevVNode, nextVNode, container)
      if (j < lastIndex) {
        // 需要移动
      } else {
        // 更新 lastIndex
        lastIndex = j
      }
      break // 这里需要 break
    }
  }
}
```

### 移动节点

```js
// 用来存储寻找过程中遇到的最大索引值
let lastIndex = 0
// 遍历新的 children
for (let i = 0; i < nextChildren.length; i++) {
  const nextVNode = nextChildren[i]
  let j = 0
  // 遍历旧的 children
  for (j; j < prevChildren.length; j++) {
    const prevVNode = prevChildren[j]
    // 如果找到了具有相同 key 值的两个节点，则调用 `patch` 函数更新之
    if (nextVNode.key === prevVNode.key) {
      patch(prevVNode, nextVNode, container)
      if (j < lastIndex) {
        // 需要移动
        // refNode 是为了下面调用 insertBefore 函数准备的
        const refNode = nextChildren[i - 1].el.nextSibling
        // 调用 insertBefore 函数移动 DOM
        container.insertBefore(prevVNode.el, refNode)
      } else {
        // 更新 lastIndex
        lastIndex = j
      }
      break // 这里需要 break
    }
  }
}
```

### 添加新元素

如果内层循环结束后，变量 find 的值仍然为 false，则说明在旧的 children 中找不到可复用的节点。

```js
let lastIndex = 0
for (let i = 0; i < nextChildren.length; i++) {
  const nextVNode = nextChildren[i]
  let j = 0,
    find = false
  for (j; j < prevChildren.length; j++) {
    const prevVNode = prevChildren[j]
    if (nextVNode.key === prevVNode.key) {
      find = true
      patch(prevVNode, nextVNode, container)
      if (j < lastIndex) {
        // 需要移动
        const refNode = nextChildren[i - 1].el.nextSibling
        container.insertBefore(prevVNode.el, refNode)
        break
      } else {
        // 更新 lastIndex
        lastIndex = j
      }
    }
  }
  if (!find) {
    // 挂载新节点
    // 找到 refNode
    const refNode =
      i - 1 < 0
        ? prevChildren[0].el
        : nextChildren[i - 1].el.nextSibling
    mount(nextVNode, container, false, refNode)
  }
}
```

调用 mount 函数挂载新节点时，我们为其传递了第四个参数 refNode，当 refNode 存在时，我们应该使用 insertBefore 方法代替 appendChild 方法，这就需要我们修改之前实现的 mount 函数了 mountElement 函数，为它们添加第四个参数。

```js
// mount 函数
function mount(vnode, container, isSVG, refNode) {
  const { flags } = vnode
  if (flags & VNodeFlags.ELEMENT) {
    // 挂载普通标签
    mountElement(vnode, container, isSVG, refNode)
  }

  // 省略...
}

// mountElement 函数
function mountElement(vnode, container, isSVG, refNode) {
  // 省略...

  refNode ? container.insertBefore(el, refNode) : container.appendChild(el)
}
```

### 移除不存在的元素

```js
let lastIndex = 0
for (let i = 0; i < nextChildren.length; i++) {
  const nextVNode = nextChildren[i]
  let j = 0,
    find = false
  for (j; j < prevChildren.length; j++) {
    // 省略...
  }
  if (!find) {
    // 挂载新节点
    // 省略...
  }
}
// 移除已经不存在的节点
// 遍历旧的节点
for (let i = 0; i < prevChildren.length; i++) {
  const prevVNode = prevChildren[i]
  // 拿着旧 VNode 去新 children 中寻找相同的节点
  const has = nextChildren.find(
    nextVNode => nextVNode.key === prevVNode.key
  )
  if (!has) {
    // 如果没有找到相同的节点，则移除
    container.removeChild(prevVNode.el)
  }
}
```

## 另一个思路 - 双端比较

所谓双端比较，就是同时从新旧 children 的两端开始进行比较的一种方式，所以我们需要四个索引值，分别指向新旧 children 的两端。

```js
let oldStartIdx = 0
let oldEndIdx = prevChildren.length - 1
let newStartIdx = 0
let newEndIdx = nextChildren.length - 1

let oldStartVNode = prevChildren[oldStartIdx]
let oldEndVNode = prevChildren[oldEndIdx]
let newStartVNode = nextChildren[newStartIdx]
let newEndVNode = nextChildren[newEndIdx]
```

```js
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
  if (oldStartVNode.key === newStartVNode.key) {
    // 步骤一：oldStartVNode 和 newStartVNode 比对

    // 调用 patch 函数更新
    patch(oldStartVNode, newStartVNode, container)
    // 更新索引，指向下一个位置
    oldStartVNode = prevChildren[++oldStartIdx]
    newStartVNode = nextChildren[++newStartIdx]
  } else if (oldEndVNode.key === newEndVNode.key) {
    // 步骤二：oldEndVNode 和 newEndVNode 比对

    // 调用 patch 函数更新
    patch(oldEndVNode, newEndVNode, container)
    // 更新索引，指向下一个位置
    oldEndVNode = prevChildren[--oldEndIdx]
    newEndVNode = newEndVNode[--newEndIdx]
  } else if (oldStartVNode.key === newEndVNode.key) {
    // 步骤三：oldStartVNode 和 newEndVNode 比对

    // 调用 patch 函数更新
    patch(oldStartVNode, newEndVNode, container)
    // 将 oldStartVNode.el 移动到 oldEndVNode.el 的后面，也就是 oldEndVNode.el.nextSibling 的前面
    container.insertBefore(
      oldStartVNode.el,
      oldEndVNode.el.nextSibling
    )
    // 更新索引，指向下一个位置
    oldStartVNode = prevChildren[++oldStartIdx]
    newEndVNode = nextChildren[--newEndIdx]
  } else if (oldEndVNode.key === newStartVNode.key) {
    // 步骤四：oldEndVNode 和 newStartVNode 比对

    // 先调用 patch 函数完成更新
    patch(oldEndVNode, newStartVNode, container)
    // 更新完成后，将容器中最后一个子节点移动到最前面，使其成为第一个子节点
    container.insertBefore(oldEndVNode.el, oldStartVNode.el)
    // 更新索引，指向下一个位置
    oldEndVNode = prevChildren[--oldEndIdx]
    newStartVNode = nextChildren[++newStartIdx]
  }
}
```

### 双端比较的优势

双端比较在移动 DOM 方面更具有普适性，不会因为 DOM 结构的差异而产生影响。

### 非理想情况的处理方式

每一步比对，都无法找到可复用的节点，我们只能拿新 children 中的第一个节点尝试去旧 children 中寻找，试图找到拥有相同 key 值的节点。

```js
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
  if (!oldStartVNode) {
    oldStartVNode = prevChildren[++oldStartIdx]
  } else if (!oldEndVNode) {
    oldEndVNode = prevChildren[--oldEndIdx]
  } else if (oldStartVNode.key === newStartVNode.key) {
    // 省略...
  } else if (oldEndVNode.key === newEndVNode.key) {
    // 省略...
  } else if (oldStartVNode.key === newEndVNode.key) {
    // 省略...
  } else if (oldEndVNode.key === newStartVNode.key) {
    // 省略...
  } else {
    // 遍历旧 children，试图寻找与 newStartVNode 拥有相同 key 值的元素
    const idxInOld = prevChildren.findIndex(
      node => node.key === newStartVNode.key
    )
    
    if (idxInOld >= 0) {
      // vnodeToMove 就是在旧 children 中找到的节点，该节点所对应的真实 DOM 应该被移动到最前面
      const vnodeToMove = prevChildren[idxInOld]
      // 调用 patch 函数完成更新
      patch(vnodeToMove, newStartVNode, container)
      // 把 vnodeToMove.el 移动到最前面，即 oldStartVNode.el 的前面
      container.insertBefore(vnodeToMove.el, oldStartVNode.el)
      // 由于旧 children 中该位置的节点所对应的真实 DOM 已经被移动，所以将其设置为 undefined
      prevChildren[idxInOld] = undefined
    }
    // 将 newStartIdx 下移一位
    newStartVNode = nextChildren[++newStartIdx]
  }
}
```


### 添加新元素

```js
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
  if (!oldStartVNode) {
    oldStartVNode = prevChildren[++oldStartIdx]
  } else if (!oldEndVNode) {
    oldEndVNode = prevChildren[--oldEndIdx]
  } else if (oldStartVNode.key === newStartVNode.key) {
    // 省略...
  } else if (oldEndVNode.key === newEndVNode.key) {
    // 省略...
  } else if (oldStartVNode.key === newEndVNode.key) {
    // 省略...
  } else if (oldEndVNode.key === newStartVNode.key) {
    // 省略...
  } else {
    const idxInOld = prevChildren.findIndex(
      node => node.key === newStartVNode.key
    )
    if (idxInOld >= 0) {
      const vnodeToMove = prevChildren[idxInOld]
      patch(vnodeToMove, newStartVNode, container)
      prevChildren[idxInOld] = undefined
      container.insertBefore(vnodeToMove.el, oldStartVNode.el)
    } else {
      // 使用 mount 函数挂载新节点
      mount(newStartVNode, container, false, oldStartVNode.el)
    }
    newStartVNode = nextChildren[++newStartIdx]
  }
}
if (oldEndIdx < oldStartIdx) {
  // 添加新节点
  for (let i = newStartIdx; i <= newEndIdx; i++) {
    mount(nextChildren[i], container, false, oldStartVNode.el)
  }
}
```

我们在循环结束之后，立即判断 oldEndIdx 的值是否小于 oldStartIdx 的值，如果条件成立，则需要使用 for 循环把所有位于 newStartIdx 到 newEndIdx 之间的元素都当做全新的节点添加到容器元素中，这样我们就完整的实现了完整的添加新节点的功能。


### 移除不存在的元素

循环结束后，一旦满足条件 newEndIdx < newStartId 则说明有元素需要被移除。

```js
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
  // 省略...
}
if (oldEndIdx < oldStartIdx) {
  // 添加新节点
  for (let i = newStartIdx; i <= newEndIdx; i++) {
    mount(nextChildren[i], container, false, oldStartVNode.el)
  }
} else if (newEndIdx < newStartIdx) {
  // 移除操作
  for (let i = oldStartIdx; i <= oldEndIdx; i++) {
    container.removeChild(prevChildren[i].el)
  }
}
```


## inferno 所采用的核心 Diff 算法及原理

在创建 VNode 时就确定其类型，以及在 mount/patch 的过程中采用位运算来判断一个 VNode 的类型，在这个基础之上再配合核心的 Diff 算法，才使得性能上产生一定的优势。

### 相同的前置和后置元素

如果两个文本相等，则无需进行真正的 Diff，预处理的好处之一就是在某些情况下能够避免 Diff 算法的执行，还有比这更加高效的方式吗？当然，这是一个简单的情形，除此之外，在文本的 Diff 中还有其他的预处理过程，其中就包含：去除相同的前缀和后缀。

```js
// 更新相同的前缀节点
// j 为指向新旧 children 中第一个节点的索引
let j = 0
let prevVNode = prevChildren[j]
let nextVNode = nextChildren[j]
// while 循环向后遍历，直到遇到拥有不同 key 值的节点为止
while (prevVNode.key === nextVNode.key) {
  // 调用 patch 函数更新
  patch(prevVNode, nextVNode, container)
  j++
  prevVNode = prevChildren[j]
  nextVNode = nextChildren[j]
}

// 指向旧 children 最后一个节点的索引
let prevEnd = prevChildren.length - 1
// 指向新 children 最后一个节点的索引
let nextEnd = nextChildren.length - 1

prevVNode = prevChildren[prevEnd]
nextVNode = nextChildren[nextEnd]

// while 循环向前遍历，直到遇到拥有不同 key 值的节点为止
while (prevVNode.key === nextVNode.key) {
  // 调用 patch 函数更新
  patch(prevVNode, nextVNode, container)
  prevEnd--
  nextEnd--
  prevVNode = prevChildren[prevEnd]
  nextVNode = nextChildren[nextEnd]
}

// 满足条件，则说明从 j -> nextEnd 之间的节点应作为新节点插入
if (j > prevEnd && j <= nextEnd) {
  // j -> nextEnd 之间的节点应该被添加
  const nextPos = nextEnd + 1
  const refNode =
    nextPos < nextChildren.length ? nextChildren[nextPos].el : null
  while (j <= nextEnd) {
    mount(nextChildren[j++], container, false, refNode)
  }
} else if (j > nextEnd) {
  // j -> prevEnd 之间的节点应该被移除
  while (j <= prevEnd) {
    container.removeChild(prevChildren[j++].el)
  }
}
```

### 判断是否需要进行 DOM 移动

Diff 算法，其重点无非就是：判断是否有节点需要移动，以及应该如何移动和寻找出那些需要被添加或移除的节点

```js
  const prevStart = j
  const nextStart = j
  let moved = false
  let pos = 0
  // for (let i = prevStart; i <= prevEnd; i++) {
  //   const prevVNode = prevChildren[i]
  //   for (let k = nextStart; k <= nextEnd; k++) {
  //     const nextVNode = nextChildren[k]
  //     if (prevVNode.key === nextVNode.key) {
  //       // patch 更新
  //       patch(prevVNode, nextVNode, container)
  //       // 更新 source 数组
  //       source[k - nextStart] = i
  //       // 判断是否需要移动
  //       if (k < pos) {
  //         moved = true
  //       } else {
  //         pos = k
  //       }
  //     }
  //   }
  // }

  // 构建索引表
  const keyIndex = {}
  for (let i = nextStart; i <= nextEnd; i++) {
    keyIndex[nextChildren[i].key] = i
  }
  let patched = 0
  // 遍历旧 children 的剩余未处理节点
  for (let i = prevStart; i <= prevEnd; i++) {
    prevVNode = prevChildren[i]

    if (patched < nextLeft) {
      // 通过索引表快速找到新 children 中具有相同 key 的节点的位置
      const k = keyIndex[prevVNode.key]
      if (typeof k !== 'undefined') {
        nextVNode = nextChildren[k]
        // patch 更新
        patch(prevVNode, nextVNode, container)
        patched++
        // 更新 source 数组
        source[k - nextStart] = i
        // 判断是否需要移动
        if (k < pos) {
          moved = true
        } else {
          pos = k
        }
      } else {
        // 没找到，说明旧节点在新 children 中已经不存在了，应该移除
        container.removeChild(prevVNode.el)
      }
    } else {
      // 多余的节点，应该移除
      container.removeChild(prevVNode.el)
    }
  }
```

这是典型的用空间换时间的方式，复杂度能够降低到 O(n)。但无论采用哪一种方式，最终我们的目的是对新旧 children 中具有相同 key 值的节点进行更新，同时检测是否需要移动操作。 


### DOM 移动的方式

1、判断出是否需要进行 DOM 移动操作，所以我们建立了 moved 变量作为标识，当它的值为 true 时则说明需要进行 DOM 移动。

2、构建 source 数组，它的长度与“去掉”相同的前置/后置节点后新 children 中剩余未处理节点的数量相等，并存储着新 children 中的节点在旧 children 中位置，后面我们会根据 source 数组计算出一个最长递增子序列，并用于 DOM 移动操作。

```js
if (moved) {
  const seq = lis(source)
  // j 指向最长递增子序列的最后一个值
  let j = seq.length - 1
  // 从后向前遍历新 children 中的剩余未处理节点
  for (let i = nextLeft - 1; i >= 0; i--) {
    if (source[i] === -1) {
      // 作为全新的节点挂载

      // 该节点在新 children 中的真实位置索引
      const pos = i + nextStart
      const nextVNode = nextChildren[pos]
      // 该节点下一个节点的位置索引
      const nextPos = pos + 1
      // 挂载
      mount(
        nextVNode,
        container,
        false,
        nextPos < nextChildren.length
          ? nextChildren[nextPos].el
          : null
      )
    } else if (i !== seq[j]) {
      // 说明该节点需要移动

      // 该节点在新 children 中的真实位置索引
      const pos = i + nextStart
      const nextVNode = nextChildren[pos]
      // 该节点下一个节点的位置索引
      const nextPos = pos + 1
      // 移动
      container.insertBefore(
        nextVNode.el,
        nextPos < nextChildren.length
          ? nextChildren[nextPos].el
          : null
      )
    } else {
      // 当 i === seq[j] 时，说明该位置的节点不需要移动
      // 并让 j 指向下一个位置
      j--
    }
  }
}
```


---


# 自定义渲染器和异步渲染

## 自定义渲染器的原理

渲染器是围绕 Virtual DOM 而存在的，在 Web 平台下它能够把 Virtual DOM 渲染为浏览器中的真实 DOM 对象，通过前面几章的讲解，相信你已经能够认识到渲染器的实现原理，为了能够将 Virtual DOM 渲染为真实 DOM，渲染器内部需要调用浏览器提供的 DOM 编程接口，下面罗列了在出上一章中我们曾经使用到的那些浏览器为我们提供的 DOM 编程接口：

- document.createElement / createElementNS：创建标签元素。
- document.createTextNode：创建文本元素。
- el.nodeValue：修改文本元素的内容。
- el.removeChild：移除 DOM 元素。
- el.insertBefore：插入 DOM 元素。
- el.appendChild：追加 DOM 元素。
- el.parentNode：获取父元素。
- el.nextSibling：获取下一个兄弟元素。
- document.querySelector：挂载 Portal 类型的 VNode 时，用它查找挂载点。

这些 DOM 编程接口完成了 Web 平台(或者说浏览器)下对 DOM 的增加、删除、查找的工作，它是 Web 平台独有的，所以如果渲染器自身强依赖于这些方法(函数)，那么这个渲染器也只能够运行在浏览器中，它不具备跨平台的能力。换句话说，如果想要实现一个平台无关的渲染器，那么渲染器自身必须不能强依赖于任何一个平台下特有的接口，而是应该提供一个抽象层，将 “DOM” 的增加、删除、查找等操作使用抽象接口实现，具体到某个平台下时，由开发者决定如何使用该平台下的接口实现这个抽象层，这就是自定义渲染器的本质。

一个跨平台的渲染器应该至少包含两个可自定义的部分：可自定义元素的增加、删除、查找等操作、可自定义元素自身属性/特性的修改操作。这样对于任何一个元素来说，它的增删改查都已经变成了可自定义的部分，我们只需要“告知”渲染器在对元素进行增删改查时应该做哪些具体的操作即可。

整个 render.js 文件的核心代码
```js
// 导出渲染器
export default function render(vnode, container) { /* ... */ }

// ========== 挂载 ==========

function mount(vnode, container, isSVG, refNode) { /* ... */ }

function mountElement(vnode, container, isSVG, refNode) { /* ... */ }

function mountText(vnode, container) { /* ... */ }

function mountFragment(vnode, container, isSVG) { /* ... */ }

function mountPortal(vnode, container) { /* ... */ }

function mountComponent(vnode, container, isSVG) { /* ... */ }

function mountStatefulComponent(vnode, container, isSVG) { /* ... */ }

function mountFunctionalComponent(vnode, container, isSVG) { /* ... */ }

// ========== patch ==========

function patch(prevVNode, nextVNode, container) { /* ... */ }

function replaceVNode(prevVNode, nextVNode, container) { /* ... */ }

function patchElement(prevVNode, nextVNode, container) { /* ... */ }

function patchChildren(
  prevChildFlags,
  nextChildFlags,
  prevChildren,
  nextChildren,
  container
) { /* ... */ }

function patchText(prevVNode, nextVNode) { /* ... */ }

function patchFragment(prevVNode, nextVNode, container) { /* ... */ }

function patchPortal(prevVNode, nextVNode) { /* ... */ }

function patchComponent(prevVNode, nextVNode, container) { /* ... */ }

// https://en.wikipedia.org/wiki/Longest_increasing_subsequence
function lis(arr) { /* ... */ }
```

在 mount 和 patch 中都会调用浏览器提供的 DOM 编程接口来完成真正的渲染工作。

```js
export default function createRenderer(options) {
  // options.nodeOps 选项中包含了本章开头罗列的所有操作 DOM 的方法
  // options.patchData 选项就是 patchData 函数
  const {
    nodeOps: {
      createElement: platformCreateElement,
      createText: platformCreateText,
      setText: platformSetText, // 等价于 Web 平台的 el.nodeValue
      appendChild: platformAppendChild,
      insertBefore: platformInsertBefore,
      removeChild: platformRemoveChild,
      parentNode: platformParentNode,
      nextSibling: platformNextSibling,
      querySelector: platformQuerySelector
    },
    patchData: platformPatchData
  } = options

  function render(vnode, container) { /* ... */ }

  // ========== 挂载 ==========
  // 省略...

  // ========== patch ==========
  // 省略...

  return { render }
}
```

接下来我们要做的就是将渲染器中原本使用了 Web 平台进行 DOM 操作的地方修改成使用通过解构得到的函数进行替代，例如在创建 DOM 元素时，原来的实现如下：

```js
function mountElement(vnode, container, isSVG, refNode) {
  isSVG = isSVG || vnode.flags & VNodeFlags.ELEMENT_SVG
  const el = isSVG
    ? document.createElementNS('http://www.w3.org/2000/svg', vnode.tag)
    : document.createElement(vnode.tag)
  // 省略...
}
```

现在我们应该使用 platformCreateElement 函数替代 document.createElement(NS)：

```js
function mountElement(vnode, container, isSVG, refNode) {
  isSVG = isSVG || vnode.flags & VNodeFlags.ELEMENT_SVG
  const el = platformCreateElement(vnode.tag, isSVG)
  // 省略...
}
```


当我们实现了所有 nodeOps 下的规定的抽象接口之后，实际上就完成了一个面向 Web 平台的渲染器，如下代码所示：

```js
const { render } = createRenderer({
  nodeOps: {
    createElement(tag, isSVG) {
      return isSVG
        ? document.createElementNS('http://www.w3.org/2000/svg', tag)
        : document.createElement(tag)
    },
    removeChild(parent, child) {
      parent.removeChild(child)
    },
    createText(text) {
      return document.createTextNode(text)
    },
    setText(node, text) {
      node.nodeValue = text
    },
    appendChild(parent, child) {
      parent.appendChild(child)
    },
    insertBefore(parent, child, ref) {
      parent.insertBefore(child, ref)
    },
    parentNode(node) {
      return node.parentNode
    },
    nextSibling(node) {
      return node.nextSibling
    },
    querySelector(selector) {
      return document.querySelector(selector)
    }
  }
})
```

```js
import { patchData } from './patchData'
const { render } = createRenderer({
  nodeOps: {
    // 省略...
  },
  patchData
})
```

以上我们就完成了对渲染器的抽象，使它成为一个平台无关的工具。并基于此实现了一个 Web 平台的渲染器，专门用于浏览器环境。


## 自定义渲染器的应用

Vue3 提供了一个叫做 @vue/runtime-test 的包，其作用是方便开发者在无 DOM 环境时有能力对组件的渲染内容进行测试，这实际上就是对自定义渲染器的应用。本节我们尝试来实现与 @vue/runtime-test 具有相同功能的渲染器。


---


<a href="http://hcysun.me/vue-design/zh/essence-of-comp.html" target="_blank">→ 此文章为学习总结文档，感谢原作者！</a>

