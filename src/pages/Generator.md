[title]: # (你需要学习的 Generator函数)
[date]: # (2018-12-26 &nbsp; 16:22:53)
[categories]: # (ES6+)
[description]: # (一个人至少拥有一个梦想，有一个理由去坚强。)
[image]: # (https://i.loli.net/2020/04/01/OakCPpTlvBwRGAJ.jpg)

---

# 一、理解 Generator(生成器)

生成器对象是由一个 generator function 返回的,并且它符合可迭代协议和迭代器协议。

形式上，Generator 函数是一个普通函数，但是有两个特征。

- 一是，function 关键字与函数名之间有一个星号；

- 二是，函数体内部使用 yield 语句，定义不同的内部状态（yield 语句在英语里的意思就是“产出”）。

我们来看一个简单的小例子：

```js
function* gen() {
  yield '1'
  yield '2'
  return '3'
}

var g = gen()

var a = g.next()
console.log(a) // { value: '1', done: false }

var b = g.next()
console.log(b) // { value: '2', done: false }

var c = g.next()
console.log(c) // { value: '3', done: true }

var d = g.next()
console.log(d) // { value: undefined, done: true }
```

总结：

调用 Generator 函数，返回一个遍历器对象，代表 Generator 函数的内部指针。以后，每次调用遍历器对象的 next 方法，就会返回一个有着 **value** 和 **done** 两个属性的对象。

value 属性表示当前的内部状态的值，是 yield 语句后面那个表达式的值；done 属性是一个布尔值，表示是否遍历结束。

---

# 二、yield

由于 Generator 函数返回的遍历器对象，只有调用 next 方法才会遍历下一个内部状态，所以其实提供了一种可以暂停执行的函数。**yield 语句就是暂停标志。**

遍历器对象的 next 方法的运行逻辑如下。

- 遇到 yield 语句，就暂停执行后面的操作，并将紧跟在 yield 后面的那个表达式的值，作为返回的对象的 value 属性值。

- 下一次调用 next 方法时，再继续往下执行，直到遇到下一个 yield 语句。

- 如果没有再遇到新的 yield 语句，就一直运行到函数结束，直到 return 语句为止，并将 return 语句后面的表达式的值，作为返回的对象的 value 属性值。

- 如果该函数没有 return 语句，则返回的对象的 value 属性值为 undefined。

> 需要注意的是，yield 语句后面的表达式，只有当调用 next 方法、内部指针指向该语句时才会执行，因此等于为 JavaScript 提供了手动的“惰性求值”（Lazy Evaluation）的语法功能。

## yield\*

- yield 的返回值是当作一个元素

- yield\* 的返回值是一个 iterator，会依次返回这个 iterator 中的每个元素

```js
function* sub() {
  for (let i = 65; i < 70; i++) {
    yield String.fromCharCode(i)
  }
}

function* main() {
  yield sub() // 返回的是 sub() 的结果, Object [Generator] {}
  yield '---------'
  yield* sub() // 依次返回 sub() 结果的的每一项
}

for (var v of main()) {
  console.log(v)
}
```

## 注意事项

1. yield 语句不能用在普通函数中，否则会报错。

```js
var arr = [1, [[2, 3], 4], [5, 6]];

var flat = function* (a) {
  a.forEach(function (item) {   // forEach方法的参数是一个普通函数
    if (typeof item !== 'number') {
      yield* flat(item);
    } else {
      yield item;
    }
  }
};

for (var f of flat(arr)){
  console.log(f);   // SyntaxError: Unexpected number

}

————————————————————————————————修改方法————————————————————————————————

var arr = [1, [[2, 3], 4], [5, 6]];

var flat = function* (a) {
  var length = a.length;
  for (var i = 0; i < length; i++) {  // 改用for循环
    var item = a[i];
    if (typeof item !== 'number') {
      yield* flat(item);
    } else {
      yield item;
    }
  }
};

for (var f of flat(arr)) {
  console.log(f);
}
// 1, 2, 3, 4, 5, 6
```

2. yield 语句如果用在一个表达式之中，必须放在圆括号里面

```js
console.log('Hello' + yield); // SyntaxError
console.log('Hello' + yield 123); // SyntaxError

console.log('Hello' + (yield)); // OK
console.log('Hello' + (yield 123)); // OK
```

3. yield 语句用作函数参数或赋值表达式的右边，可以不加括号。

```js
foo(yield 'a', yield 'b'); // OK

let input = yield; // OK
```

---

# 三、next 方法的参数

yield 句本身没有返回值，或者说总是返回 undefined。

**next 方法可以带一个参数，该参数就会被当作上一个 yield 语句的返回值。**

```js
function* f() {
  for (var i = 0; true; i++) {
    var reset = yield i
    if (reset) {
      i = -1
    }
  }
}

var g = f()

g.next() // { value: 0, done: false }
g.next() // { value: 1, done: false }
g.next(true) // { value: 0, done: false }
```

上面代码先定义了一个可以无限运行的 Generator 函数 f，如果 next 方法没有参数，每次运行到 yield 语句，变量 reset 的值总是 undefined。当 next 方法带一个参数 true 时，当前的变量 reset 就被重置为这个参数（即 true），因此 i 会等于-1，下一轮循环就会从-1 开始递增。

这个功能有很重要的语法意义。Generator 函数从暂停状态到恢复运行，它的上下文状态（context）是不变的。通过 next 方法的参数，就有办法在 Generator 函数开始运行之后，继续向函数体内部注入值。也就是说，可以在 Generator 函数运行的不同阶段，从外部向内部注入不同的值，从而调整函数行为。

---

# 四、配合使用 for...of 循环

for...of 循环可以自动遍历 Generator 函数时生成的 Iterator 对象，且此时不再需要调用 next 方法。

```js
function* foo() {
  yield 1
  yield 2
  yield 3
  yield 4
  yield 5
  return 6
}

for (let v of foo()) {
  console.log(v)
}
// 1 2 3 4 5
```

> 注意：一旦 next 方法的返回对象的 done 属性为 true，for...of 循环就会中止，且不包含该返回对象，所以上面代码的 return 语句返回的 6，不包括在 for...of 循环之中。

利用 for...of 循环，可以写出遍历任意对象（object）的方法。原生的 JavaScript 对象没有遍历接口，无法使用 for...of 循环，通过 Generator 函数为它加上这个接口，就可以用了：

<span id = "jump"></span>

```js
function* objectEntries(obj) {
  let propKeys = Reflect.ownKeys(obj);

  for (let propKey of propKeys) {
    yield [propKey, obj[propKey]];
  }
}

let jane = { first: 'Jane', last: 'Doe' };

for (let [key, value] of objectEntries(jane)) {
  console.log(`${key}: ${value}`);
}
// first: Jane
// last: Doe

————————————————————————————————另一种写法————————————————————————————————

// 上面代码中，对象jane原生不具备Iterator接口，无法用for...of遍历。
// 这时，我们通过Generator函数objectEntries为它加上遍历器接口，就可以用for...of遍历了。
// 加上遍历器接口的另一种写法是，将Generator函数加到对象的Symbol.iterator属性上面。

function* objectEntries() {
  let propKeys = Object.keys(this);

  for (let propKey of propKeys) {
    yield [propKey, this[propKey]];
  }
}

let jane = { first: 'Jane', last: 'Doe' };

jane[Symbol.iterator] = objectEntries;

for (let [key, value] of jane) {
  console.log(`${key}: ${value}`);
}
// first: Jane
// last: Doe
```

除了 for...of 循环以外，扩展运算符（...）、解构赋值和 Array.from 方法内部调用的，都是遍历器接口。这意味着，它们都可以将 Generator 函数返回的 Iterator 对象，作为参数。

```js
function* numbers() {
  yield 1
  yield 2
  return 3
  yield 4
}

// 扩展运算符
;[...numbers()] // [1, 2]

// Array.form 方法
Array.from(numbers()) // [1, 2]

// 解构赋值
let [x, y] = numbers()
x // 1
y // 2

// for...of 循环
for (let n of numbers()) {
  console.log(n)
}
// 1
// 2
```

---

# 五、Generator 函数返回的遍历器对象的方法

## 1. Generator.prototype.throw()

Generator 函数返回的遍历器对象，都有一个 throw 方法，**可以在函数体外抛出错误，然后在 Generator 函数体内捕获。**

```js
var g = function*() {
  try {
    yield
  } catch (e) {
    console.log('内部捕获', e) // 注：此处代码运行结束有一个隐藏的return
  }
}
var i = g()
i.next()

try {
  i.throw('a')
  var b = i.next('b')
  console.log(b)
  i.throw('c')
} catch (e) {
  console.log('外部捕获', e)
}
//  依次打印如下:
//  内部捕获 a
//  { value: undefined, done: true }
//  外部捕获 c
```

上面代码中，遍历器对象 i 连续抛出两个错误。第一个错误被 Generator 函数体内的 catch 语句捕获。i 第二次抛出错误，由于 Generator 函数内部的 catch 语句已经执行过了，不会再捕捉到这个错误了，所以这个错误就被抛出了 Generator 函数体，被函数体外的 catch 语句捕获。

> 注意：throw 方法被捕获以后，会附带执行下一条 yield 语句。也就是说，会附带执行一次 next 方法。

```js
var gen = function* gen() {
  try {
    yield console.log('a')
  } catch (e) {
    // ...
  }
  yield console.log('b')
  yield console.log('c')
}

var g = gen()
g.next() // a
g.throw() // b
g.next() // c
```

上面代码中，g.throw 方法被捕获以后，自动执行了一次 next 方法，所以会打印 b。另外，也可以看到，只要 Generator 函数内部部署了 try...catch 代码块，那么遍历器的 throw 方法抛出的错误，不影响下一次遍历。

需要注意的是，不要混淆遍历器对象的 throw 方法和全局的 throw 命令。

- 用 throw 命令抛出的，如：**throw new Error('a')**,只能被函数体外的 catch 语句捕获。

- 而 Generator 函数 throw 方法 抛出的错误，可以在函数体内捕获，也可以被函数体外的 catch 捕获。

```js
function* foo() {
  var x = yield 3
  var y = x.toUpperCase()
  yield y
}

var it = foo()

it.next() // { value:3, done:false }

try {
  it.next(42)
} catch (err) {
  console.log(err)
}
```

上面代码中，第二个 next 方法向函数体内传入一个参数 42，数值是没有 toUpperCase 方法的，所以会抛出一个 TypeError 错误，被函数体外的 catch 捕获。

## 2. Generator.prototype.return()

Generator 函数返回的遍历器对象，还有一个 return 方法，可以返回给定的值，并且终结遍历 Generator 函数。

```js
function* gen() {
  yield 1
  yield 2
  yield 3
}

var g = gen()

g.next() // { value: 1, done: false }
g.return('foo') // { value: "foo", done: true }
g.next() // { value: undefined, done: true }
```

上面代码中，遍历器对象 g 调用 return 方法后，返回值的 value 属性就是 return 方法的参数 foo。并且，Generator 函数的遍历就终止了，返回值的 done 属性为 true，以后再调用 next 方法，done 属性总是返回 true。

**如果 Generator 函数内部有 try...finally 代码块，那么 return 方法会推迟到 finally 代码块执行完再执行。**

```js
function* numbers() {
  yield 1
  try {
    yield 2
    yield 3
  } finally {
    yield 4
    yield 5
  }
  yield 6
}
var g = numbers()
g.next() // { done: false, value: 1 }
g.next() // { done: false, value: 2 }
g.return(7) // { done: false, value: 4 }
g.next() // { done: false, value: 5 }
g.next() // { done: true, value: 7 }
```

上面代码中，调用 return 方法后，就开始执行 finally 代码块，然后等到 finally 代码块执行完，再执行 return 方法。

---

# 六、Generator 函数的 this

Generator 函数总是返回一个遍历器，ES6 规定这个遍历器是 Generator 函数的实例，也继承了 Generator 函数的 prototype 对象上的方法。

```js
function* g() {}

g.prototype.hello = function() {
  return 'hi!'
}

let obj = g()

obj instanceof g // true
obj.hello() // 'hi!'
```

上面代码表明，Generator 函数 g 返回的遍历器 obj，是 g 的实例，而且继承了 g.prototype。

但是，**如果把 g 当作普通的构造函数，并不会生效，因为 g 返回的总是遍历器对象，而不是 this 对象。**

```js
function* g() {
  this.a = 11
}

let obj = g()
obj.a // undefined
```

上面代码中，Generator 函数 g 在 this 对象上面添加了一个属性 a，但是 obj 对象拿不到这个属性。

那么，有没有办法让 Generator 函数返回一个正常的对象实例，既可以用 next 方法，又可以获得正常的 this？

下面是一个变通方法。首先，生成一个空对象，使用 bind 方法绑定 Generator 函数内部的 this。这样，构造函数调用以后，这个空对象就是 Generator 函数的实例对象了。

```js
function* F() {
  this.a = 1
  yield (this.b = 2)
  yield (this.c = 3)
}
var obj = {}
var f = F.call(obj)

f.next() // Object {value: 2, done: false}
f.next() // Object {value: 3, done: false}
f.next() // Object {value: undefined, done: true}

obj.a // 1
obj.b // 2
obj.c // 3
```

上面代码中，首先是 F 内部的 this 对象绑定 obj 对象，然后调用它，返回一个 Iterator 对象。这个对象执行三次 next 方法（因为 F 内部有两个 yield 语句），完成 F 内部所有代码的运行。这时，所有内部属性都绑定在 obj 对象上了，因此 obj 对象也就成了 F 的实例。

上面代码中，执行的是遍历器对象 f，但是生成的对象实例是 obj，有没有办法将这两个对象统一呢？

一个办法就是将 obj 换成 F.prototype。

```js
function* F() {
  this.a = 1
  yield (this.b = 2)
  yield (this.c = 3)
}
var f = F.call(F.prototype)

f.next() // Object {value: 2, done: false}
f.next() // Object {value: 3, done: false}
f.next() // Object {value: undefined, done: true}

f.a // 1
f.b // 2
f.c // 3
```

Generator 函数也不能跟 new 命令一起用，会报错。

```js
function* F() {
  yield (this.x = 2)
  yield (this.y = 3)
}

new F()
// TypeError: F is not a constructor
```

上面代码中，**new 命令跟函数 F 一起使用，结果报错，因为 F 不是构造函数。**

将 F 改成构造函数，就可以对它执行 new 命令了。

```js
function* gen() {
  this.a = 1
  yield (this.b = 2)
  yield (this.c = 3)
}

function F() {
  return gen.call(gen.prototype)
}

var f = new F()

f.next() // Object {value: 2, done: false}
f.next() // Object {value: 3, done: false}
f.next() // Object {value: undefined, done: true}

f.a // 1
f.b // 2
f.c // 3
```

---

# 七、Generator 与状态机、Generator 与协程

## 状态机

> Generator 是实现状态机的最佳结构。

```js
var ticking = true;
var clock = function() {    // ES5实现
  if (ticking)
    console.log('Tick!');
  else
    console.log('Tock!');
  ticking = !ticking;
}

 ----------------分割线----------------

var clock = function*() {   // Generator实现
  while (true) {
    console.log('Tick!');
    yield;
    console.log('Tock!');
    yield;
  }
};
```

上面的 Generator 实现与 ES5 实现对比，可以看到少了用来保存状态的外部变量 ticking，这样就更简洁，更安全（状态不会被非法篡改）、更符合函数式编程的思想，在写法上也更优雅。Generator 之所以可以不用外部变量保存状态，是因为它本身就包含了一个状态信息，即目前是否处于暂停态。

## 协程

> 协程（coroutine）是一种程序运行的方式，可以理解成“协作的线程”或“协作的函数”。协程既可以用单线程实现，也可以用多线程实现。前者是一种特殊的子例程，后者是一种特殊的线程。

<font color=#0099ff>1. 协程与子例程的差异</font>

传统的“子例程”（subroutine）采用堆栈式“后进先出”的执行方式，只有当调用的子函数完全执行完毕，才会结束执行父函数。

协程与其不同，多个线程（单线程情况下，即多个函数）可以并行执行，但是只有一个线程（或函数）处于正在运行的状态，其他线程（或函数）都处于暂停态（suspended），线程（或函数）之间可以交换执行权。

也就是说，一个线程（或函数）执行到一半，可以暂停执行，将执行权交给另一个线程（或函数），等到稍后收回执行权的时候，再恢复执行。这种可以并行执行、交换执行权的线程（或函数），就称为协程。

从实现上看，在内存中，子例程只使用一个栈（stack），而协程是同时存在多个栈，但只有一个栈是在运行状态，也就是说，协程是以多占用内存为代价，实现多任务的并行。

<font color=#0099ff>2. 协程与普通线程的差异</font>

不难看出，协程适合用于多任务运行的环境。在这个意义上，它与普通的线程很相似，都有自己的执行上下文、可以分享全局变量。它们的不同之处在于，同一时间可以有多个线程处于运行状态，但是运行的协程只能有一个，其他协程都处于暂停状态。

此外，普通的线程是抢先式的，到底哪个线程优先得到资源，必须由运行环境决定，但是协程是合作式的，执行权由协程自己分配。

由于 ECMAScript 是单线程语言，只能保持一个调用栈。引入协程以后，每个任务可以保持自己的调用栈。这样做的最大好处，就是抛出错误的时候，可以找到原始的调用栈。不至于像异步操作的回调函数那样，一旦出错，原始的调用栈早就结束。

Generator 函数是 ECMAScript 6 对协程的实现，但属于不完全实现。Generator 函数被称为“半协程”（semi-coroutine），意思是只有 Generator 函数的调用者，才能将程序的执行权还给 Generator 函数。如果是完全执行的协程，任何函数都可以让暂停的协程继续执行。

如果将 Generator 函数当作协程，完全可以将多个需要互相协作的任务写成 Generator 函数，它们之间使用 yield 语句交换控制权。

## 应用

Generator 可以暂停函数执行，返回任意表达式的值。这种特点使得 Generator 有多种应用场景。

（1）异步操作的同步化表达

Generator 函数的暂停执行的效果，意味着可以把异步操作写在 yield 语句里面，等到调用 next 方法时再往后执行。这实际上等同于不需要写回调函数了，因为异步操作的后续操作可以放在 yield 语句下面，反正要等到调用 next 方法时再执行。所以，Generator 函数的一个重要实际意义就是用来处理异步操作，改写回调函数。

Ajax 是典型的异步操作，通过 Generator 函数部署 Ajax 操作，可以用同步的方式表达。

```js
function* main() {
  var result = yield request('http://some.url')
  var resp = JSON.parse(result)
  console.log(resp.value)
}

function request(url) {
  makeAjaxCall(url, function(response) {
    it.next(response)
  })
}

var it = main()
it.next()
```

上面代码的 main 函数，就是通过 Ajax 操作获取数据。可以看到，除了多了一个 yield，它几乎与同步操作的写法完全一样。注意，makeAjaxCall 函数中的 next 方法，必须加上 response 参数，因为 yield 语句构成的表达式，本身是没有值的，总是等于 undefined。

下面是另一个例子，通过 Generator 函数逐行读取文本文件。

```js
function* numbers() {
  let file = new FileReader('numbers.txt')
  try {
    while (!file.eof) {
      yield parseInt(file.readLine(), 10)
    }
  } finally {
    file.close()
  }
}
```

上面代码打开文本文件，使用 yield 语句可以手动逐行读取文件。

（2）控制流管理

回调函数

```js
step1(function(value1) {
  step2(value1, function(value2) {
    step3(value2, function(value3) {
      step4(value3, function(value4) {
        // Do something with value4
      })
    })
  })
})

// -------------↓Promise改写↓-------------

Promise.resolve(step1)
  .then(step2)
  .then(step3)
  .then(step4)
  .then(
    function(value4) {
      // Do something with value4
    },
    function(error) {
      // Handle any error from step1 through step4
    }
  )
  .done()

// -------------↓Generator函数改善代码运行流程↓-------------

function* longRunningTask(value1) {
  try {
    var value2 = yield step1(value1)
    var value3 = yield step2(value2)
    var value4 = yield step3(value3)
    var value5 = yield step4(value4)
    // Do something with value4
  } catch (e) {
    // Handle any error from step1 through step4
  }
}
// 然后，使用一个函数，按次序自动执行所有步骤。

scheduler(longRunningTask(initialValue))

function scheduler(task) {
  var taskObj = task.next(task.value)
  // 如果Generator函数未结束，就继续调用
  if (!taskObj.done) {
    task.value = taskObj.value
    scheduler(task)
  }
}

// 注意，上面这种做法，只适合同步操作，即所有的task都必须是同步的，不能有异步操作。
// 因为这里的代码一得到返回值，就继续往下执行，没有判断异步操作何时完成。
```

（3）部署 Iterator 接口

利用 Generator 函数，可以在任意对象上部署 Iterator 接口。

→ <a href="#jump" target="_self">可参考<标题:四>的例子</a>

```js
function* iterEntries(obj) {
  let keys = Object.keys(obj)
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i]
    yield [key, obj[key]]
  }
}

let myObj = { foo: 3, bar: 7 }

for (let [key, value] of iterEntries(myObj)) {
  console.log(key, value)
}
// foo 3
// bar 7
```

上述代码中，myObj 是一个普通对象，通过 iterEntries 函数，就有了 Iterator 接口。也就是说，可以在任意对象上部署 next 方法。

下面是一个对数组部署 Iterator 接口的例子，尽管**数组原生具有这个接口**。

```js
function* makeSimpleGenerator(array) {
  var nextIndex = 0

  while (nextIndex < array.length) {
    yield array[nextIndex++]
  }
}

var gen = makeSimpleGenerator(['yo', 'ya'])

gen.next().value // 'yo'
gen.next().value // 'ya'
gen.next().done // true
```

（4）作为数据结构

Generator 可以看作是数据结构，更确切地说，可以看作是一个数组结构，因为 Generator 函数可以返回一系列的值，这意味着它可以对任意表达式，提供类似数组的接口。

```js
function *doStuff() {
  yield fs.readFile.bind(null, 'hello.txt');
  yield fs.readFile.bind(null, 'world.txt');
  yield fs.readFile.bind(null, 'and-such.txt');
}
// 上面代码就是依次返回三个函数，但是由于使用了Generator函数，导致可以像处理数组那样，处理这三个返回的函数。
for (task of doStuff()) {
  // task是一个函数，可以像回调函数那样使用它
}

 -------------分割线-------------

// 实际上，如果用ES5表达，完全可以用数组模拟Generator的这种用法。

function doStuff() {
  return [
    fs.readFile.bind(null, 'hello.txt'),
    fs.readFile.bind(null, 'world.txt'),
    fs.readFile.bind(null, 'and-such.txt')
  ];
}
```

上面的函数，可以用一模一样的 for...of 循环处理！两相一比较，就不难看出 Generator 使得数据或者操作，具备了类似数组的接口。