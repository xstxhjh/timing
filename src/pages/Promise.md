[title]: # (你需要学习的 Promise对象)
[date]: # (2018-12-21 &nbsp; 10:42:11)
[categories]: # (ES6+)
[description]: # (沉下心来，去做一件事情，这便是快乐的时光。)
[image]: # (https://i.loli.net/2020/04/01/iSIp8K4BRExfjzw.jpg)

---

# 一、Promise 的含义

摘自：MDN —— [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise#描述)

> **Promise** 对象是一个代理对象（代理一个值），被代理的值在 Promise 对象创建时可能是未知的。它允许你为异步操作的成功和失败分别绑定相应的处理方法（handlers）。 这让异步方法可以像同步方法那样返回值，但并不是立即返回最终执行结果，而是一个能代表未来出现的结果的 promise 对象
>
> 一个 Promise 有以下几种状态:
>
> - pending: 初始状态，既不是成功，也不是失败状态。
>
> - fulfilled: 意味着操作成功完成。
>
> - rejected: 意味着操作失败。
>
> pending 状态的 Promise 对象可能触发 fulfilled 状态并传递一个值给相应的状态处理方法，也可能触发失败状态（rejected）并传递失败信息。当其中任一种情况出现时，Promise 对象的 then 方法绑定的处理方法（handlers ）就会被调用（then 方法包含两个参数：onfulfilled 和 onrejected，它们都是 Function 类型。当 Promise 状态为 fulfilled 时，调用 then 的 onfulfilled 方法，当 Promise 状态为 rejected 时，调用 then 的 onrejected 方法， 所以在异步操作的完成和绑定处理方法之间不存在竞争）。
>
> 因为 Promise.prototype.then 和 Promise.prototype.catch 方法返回 promise 对象， 所以它们可以被链式调用。

# 二、基本用法

## 简单的例子

```js
let myFirstPromise = new Promise(function(resolve, reject) {
  //当异步代码执行成功时，我们才会调用resolve(...), 当异步代码失败时就会调用reject(...)
  //在本例中，我们使用setTimeout(...)来模拟异步代码，实际编码时可能是XHR请求或是HTML5的一些API方法.
  console.log('Promise')
  setTimeout(() => {
    resolve('Resolved.') //代码正常执行！
  }, 100)
})

myFirstPromise.then(function(successMessage) {
  //successMessage的值是上面调用resolve(...)方法传入的值.
  console.log(successMessage)
})

console.log('Hi!')

// 上述代码会依次打印
// Promise
// Hi!
// Resolved.
```

传递到 then 中的函数被置入了一个微任务队列，而不是立即执行，这意味着它是在 JavaScript 事件队列的所有运行时结束了，事件队列被清空之后才开始执行:

```js
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

wait().then(() => console.log(4))

Promise.resolve()
  .then(() => console.log(2))
  .then(() => console.log(3))

console.log(1) // 1, 2, 3, 4
```

## Catch 的后续链式操作

```js
new Promise((resolve, reject) => {
  console.log('Initial')

  resolve()
})
  .then(() => {
    throw new Error('Something failed')

    console.log('Do this')
  })
  .catch(() => {
    console.log('Do that')
  })
  .then(() => {
    console.log('Do this whatever happened before')
  })

// 上述代码会依次打印
// Initial
// Do that
// Do this whatever happened before

// 注意，由于“Something failed”错误导致了拒绝操作，所以“Do this”文本没有被输出。
```

## Promise.prototype.done()

Promise 对象的回调链，不管以 then 方法或 catch 方法结尾，要是最后一个方法抛出错误，都有可能无法捕捉到（因为 Promise 内部的错误不会冒泡到全局）。因此，我们可以提供一个 done 方法，总是处于回调链的尾端，保证抛出任何可能出现的错误。

## Promise.prototype.finally()

finally 方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。它与 done 方法的最大区别，它接受一个普通的回调函数作为参数，该函数不管怎样都必须执行。

## Promise.all()

Promise.all()接受一个由 promise 任务组成的数组，可以同时处理多个 promise 任务，当所有的任务都执行完成时，Promise.all()返回 resolve，但当有一个失败(reject)，则返回失败的信息，即使其他 promise 执行成功，也会返回失败。

## Promise.race()

顾名思义，Promse.race()就是赛跑的意思，意思就是说，Promise.race([p1, p2, p3])里面哪个结果获得的快，就返回那个结果，不管结果本身是成功状态还是失败状态。

## Promise.resolve()

有时需要将现有对象转为 Promise 对象，Promise.resolve 方法就起到这个作用。

```js
var p = Promise.resolve('foo')
// 等价于
var p = new Promise(resolve => resolve('foo'))

p.then(function(s) {
  console.log(s) // foo
})
```

## Promise.reject()

Promise.reject(reason)方法也会返回一个新的 Promise 实例，该实例的状态为 rejected。

```js
var p = Promise.reject('出错了')
// 等同于
var p = new Promise((resolve, reject) => reject('出错了'))

p.then(null, function(s) {
  console.log(s) // 出错了
})
```
