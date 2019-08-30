[title]: # (你需要学习的 Async函数)
[date]: # (2018-12-28 &nbsp; 14:10:46)
[categories]: # (ES6+)
[description]: # (位卑未敢忘忧国)
[image]: # (https://i.loli.net/2019/08/30/5D1RqguHyVrdW6w.jpg)

---

# 一、Async/await

ES7 提供了 async 函数，使得异步操作变得更加方便。async 函数是什么？

一句话，async 函数就是 Generator 函数的语法糖。

## Async functions

- 这个函数总是返回一个 **promise**，如果代码中有 return **<非 promise>语句**，JavaScript 会自动把返回的这个 value 值包装成 promise 的 **resolved** 值。当 async 函数抛出异常时，promise 的 **reject** 方法也会传递这个异常值。

```js
async function f() {
  return 1
}
f().then(e => {
  console.log(e) // 1
})
```

## Await

- async 函数中可能会有 **await** 表达式，这会使 async 函数**暂停**执行，等待 Promise 的结果出来，然后**恢复** async 函数的执行并返回解析值（resolved）。

> 注意：await 只能在 async 函数内部使用

```js
async function f() {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve('done!'), 1000)
  })
  let result = await promise // 直到promise返回一个resolve值
  console.log(result) // 'done!'
}
f()
```

函数执行到 await promise 行会暂停，当 promise 处理完成后重新恢复运行， resolve 的值成了最终的 result，所以上面的代码会在 1s 后输出'done!'。

我们强调一下：await 字面上使得 JavaScript 等待，直到 promise 处理完成，然后将结果继续下去。

但这并不会花费任何的 cpu 资源，因为引擎能够同时做其他工作：执行其他脚本，处理事件等等。

---

# 二、错误处理

```js
async function f() {
    try {
        let response = await fetch('/no-user-here')
        let user = await response.json()
    } catch(err) {
        // 在fetch和response.json中都能捕获错误
        console.log(err)
    }
}
f()

-----------------分割线-----------------

//如果我们不使用try-catch，然后async函数f()的调用产生的promise变成reject状态的话，我们可以添加.catch去处理它。

async function f() {
	let response = await fetch('http://no-such-url')
}
f().
catch (e => {
	console.log(e)  // TypeError: failed to fetch
})
```

> async 函数是非常新的语法功能，新到都不属于 ES6，而是属于 ES7。目前，它仍处于提案阶段，但是转码器 Babel 和 regenerator 都已经支持，转码后就能使用。

## Async 函数的多种使用形式

```js
// 函数声明
async function foo() {}

// 函数表达式
const foo = async function() {}

// 对象的方法
let obj = { async foo() {} }

// 箭头函数
const foo = async () => {}
```

## Async 与 Promise、Generator 的比较

我们通过一个例子，来看 Async 函数与 Promise、Generator 函数的区别。

假定某个 DOM 元素上面，部署了一系列的动画，前一个动画结束，才能开始后一个。如果当中有一个动画出错，就不再往下执行，返回上一个成功执行的动画的返回值。

```js
function chainAnimationsPromise(elem, animations) {
  // Promise的写法
  // 变量ret用来保存上一个动画的返回值
  var ret = null
  // 新建一个空的Promise
  var p = Promise.resolve()
  // 使用then方法，添加所有动画
  for (var anim of animations) {
    p = p.then(function(val) {
      ret = val
      return anim(elem)
    })
  }
  // 返回一个部署了错误捕捉机制的Promise
  return p
    .catch(function(e) {
      /* 忽略错误，继续执行 */
    })
    .then(function() {
      return ret
    })
}

function chainAnimationsGenerator(elem, animations) {
  // Generator的写法
  return spawn(function*() {
    var ret = null
    try {
      for (var anim of animations) {
        ret = yield anim(elem)
      }
    } catch (e) {
      /* 忽略错误，继续执行 */
    }
    return ret
  })
}

async function chainAnimationsAsync(elem, animations) {
  // Async的写法
  var ret = null
  try {
    for (var anim of animations) {
      ret = await anim(elem)
    }
  } catch (e) {
    /* 忽略错误，继续执行 */
  }
  return ret
}
```

可以看到 Async 函数的实现最简洁，最符合语义，几乎没有语义不相关的代码。它将 Generator 写法中的自动执行器，改在语言层面提供，不暴露给用户，因此代码量最少。如果使用 Generator 写法，自动执行器需要用户自己提供。

上一段代码的 spawn 函数就是自动执行器,下面给出 spawn 函数的实现:

```js
function spawn(genF) {
  return new Promise(function(resolve, reject) {
    var gen = genF()
    function step(nextF) {
      try {
        var next = nextF()
      } catch (e) {
        return reject(e)
      }
      if (next.done) {
        return resolve(next.value)
      }
      Promise.resolve(next.value).then(
        function(v) {
          step(function() {
            return gen.next(v)
          })
        },
        function(e) {
          step(function() {
            return gen.throw(e)
          })
        }
      )
    }
    step(function() {
      return gen.next(undefined)
    })
  })
}
```