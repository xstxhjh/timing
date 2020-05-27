[title]: # (Typescript文档笔记)
[date]: # (2019-10-13 &nbsp; 22:15:42)
[categories]: # (Typescript)
[description]: # (TypeScript 是 JavaScript 的一个超集，主要提供了类型系统和对 ES6 的支持，由 Microsoft 开发。)
[image]: # (https://i.loli.net/2020/04/10/hwr6LAyOuk3lXWS.png)

---

# Typescript

TypeScript 是 JavaScript 的一个超集，主要提供了类型系统和对 ES6 的支持，由 Microsoft 开发。


---

# 基础

## 原始数据类型

原始数据类型包括：布尔值、数值、字符串、null、undefined 以及 ES6 中的新类型 Symbol。

```javascript
// 布尔值
let isDone: boolean = false;


// 数值
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
// ES6 中的二进制表示法
let binaryLiteral: number = 0b1010;
// ES6 中的八进制表示法
let octalLiteral: number = 0o744;
let notANumber: number = NaN;
let infinityNumber: number = Infinity;


// 字符串
let myName: string = 'Tom';
let myAge: number = 25;
// 模板字符串
let sentence: string = `Hello, my name is ${myName}.
I'll be ${myAge + 1} years old next month.`;


// 空值
// (只能将它赋值为 undefined 和 null)
function alertName(): void {
    alert('My name is Tom');
}


// Null 和 Undefined
// (是所有类型的子类型)
let u: undefined = undefined;
let n: null = null;
```


## 任意值
任意值（Any）用来表示允许赋值为任意类型。

在任意值上访问任何属性都是允许的：

```javascript
let anyThing: any = 'hello';
console.log(anyThing.myName);
console.log(anyThing.myName.firstName);
```


## 类型推论

如果没有明确的指定类型，那么 TypeScript 会依照类型推论（Type Inference）的规则推断出一个类型。

如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 any 类型而完全不被类型检查。

```javascript
let myFavoriteNumber = 'seven';

// 等价于

let myFavoriteNumber: string = 'seven';
```


## 联合类型

联合类型（Union Types）表示取值可以为多种类型中的一种。

```javascript
let myFavoriteNumber: string | number;
myFavoriteNumber = 'seven';
myFavoriteNumber = 7;
```

当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，我们只能访问此联合类型的所有类型里共有的属性或方法。


## 对象的类型——接口

在 TypeScript 中，我们使用接口（Interfaces）来定义对象的类型。

在面向对象语言中，接口（Interfaces）是一个很重要的概念，它是对行为的抽象，而具体如何行动需要由类（classes）去实现（implement）。

定义的变量比接口多(少)一些属性是不允许的。

接口一般首字母大写。有的编程语言中会建议接口的名称加上 I 前缀。

```javascript
interface Person {
    readonly id: number;
    name: string;
    age?: number;
    [propName: string]: any;
}

let tom: Person = {
    id: 89757,
    name: 'Tom',
    gender: 'male'
};
```

```javascript
// 可选属性
interface Person {
    name: string;
    age?: number;
}

// 任意属性
interface Person {
    [propName: string]: any;
}

// 只读属性
// 只读的约束存在于第一次给对象赋值的时候，而不是第一次给只读属性赋值的时候
interface Person {
    readonly id: number;
}
```


## 数组的类型

### 「类型 + 方括号」表示法

```javascript
let fibonacci: number[] = [1, 1, 2, 3, 5];
```
数组的项中不允许出现其他的类型

```javascript
let list: any[] = ['xcatliu', 25, { website: 'http://xcatliu.com' }];
```
any 表示数组中允许出现任意类型

### 数组泛型

```javascript
let fibonacci: Array<number> = [1, 1, 2, 3, 5];
```

### 用接口表示数组

```javascript
interface NumberArray {
    [index: number]: number;
}
let fibonacci: NumberArray = [1, 1, 2, 3, 5];
```

### 类数组

常用的类数组都有自己的接口定义

```javascript
function sum() {
    let args: IArguments = arguments;
}
```


## 函数的类型

### 函数声明

```javascript
function sum(x: number, y: number): number {
    return x + y;
}
```

### 函数表达式

通过赋值操作进行类型推论而推断出来
```javascript
let mySum = function (x: number, y: number): number {
    return x + y;
};
```

手动添加类型
```javascript
let mySum: (x: number, y: number) => number = function (x: number, y: number): number {
    return x + y;
};
```

### 用接口定义函数的形状

```javascript
interface SearchFunc {
    (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    return source.search(subString) !== -1;
}
```

### 可选参数

可选参数后面不允许再出现必需参数了

TypeScript 会将添加了默认值的参数识别为可选参数，此时就不受「可选参数必须接在必需参数后面」的限制了

```javascript
function buildName(firstName?: string, lastName: string = 'Cat') {
    if (lastName) {
        return firstName + ' ' + lastName;
    } else {
        return firstName;
    }
}
let tomcat = buildName('Tom', 'Cat');
let tom = buildName('Tom');
```

### 剩余参数

...rest 的方式获取函数中的剩余参数

```javascript
function push(array: any[], ...items: any[]) {
    items.forEach(function(item) {
        array.push(item);
    });
}

let a = [];
push(a, 1, 2, 3);
```

### 重载

重载允许一个函数接受不同数量或类型的参数时，作出不同的处理。

```javascript
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```


## 类型断言

类型断言可以用来手动指定一个值的类型。

```javascript
<类型>值
// 或者
值 as 类型
```

```javascript
function getLength(something: string | number): number {
    if ((<string>something).length) {
        return (<string>something).length;
    } else {
        return something.toString().length;
    }
}
```

类型断言不是类型转换，断言成一个联合类型中不存在的类型是不允许的。


## 声明文件

declare var 声明全局变量
declare function 声明全局方法
declare class 声明全局类
declare enum 声明全局枚举类型
declare namespace 声明（含有子属性的）全局对象
interface 和 type 声明全局类型
export 导出变量
export namespace 导出（含有子属性的）对象
export default ES6 默认导出
export = commonjs 导出模块
export as namespace UMD 库声明全局变量
declare global 扩展全局变量
declare module 扩展模块
/// <reference /> 三斜线指令

通常我们会把声明语句放到一个单独的文件（jQuery.d.ts）中，这就是声明文件。

```javascript
// src/jQuery.d.ts
declare var jQuery: (selector: string) => any;

// src/index.ts
jQuery('#foo');
```

使用 @types 统一管理第三方库的声明文件。

```
npm install @types/jquery --save-dev
```

### npm 包

```javascript
// types/foo/index.d.ts

declare const name: string;
declare function getName(): string;
declare class Animal {
    constructor(name: string);
    sayHi(): string;
}
declare enum Directions {
    Up,
    Down,
    Left,
    Right
}
interface Options {
    data: any;
}

export { name, getName, Animal, Directions, Options };
```

对应的导入和使用模块应该是这样：

```javascript
// src/index.ts

import { name, getName, Animal, Directions, Options } from 'foo';

console.log(name);
let myName = getName();
let cat = new Animal('Tom');
let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
let options: Options = {
    data: {
        name: 'foo'
    }
};
```

### UMD 库

既可以通过 `<script>` 标签引入，又可以通过 import 导入的库，称为 UMD 库。

一般使用 export as namespace 时，都是先有了 npm 包的声明文件，再基于它添加一条 export as namespace 语句，即可将声明好的一个变量声明为全局变量。

```javascript
// types/foo/index.d.ts

export as namespace foo;
export default foo;

declare function foo(): string;
declare namespace foo {
    const bar: number;
}
```

### 自动生成声明文件

如果库的源码本身就是由 ts 写的，那么在使用 tsc 脚本将 ts 编译为 js 的时候，添加 declaration 选项，就可以同时也生成 .d.ts 声明文件了。

```json
{
    "compilerOptions": {
        "module": "commonjs",
        "outDir": "lib",
        "declaration": true,
    }
}
```


## 内置对象

内置对象是指根据标准在全局作用域上存在的对象。这里的标准是指 ECMAScript 和其他环境（比如 DOM）的标准。

DOM 和 BOM 提供的内置对象有：
Document、HTMLElement、Event、NodeList 等。

[TypeScript 核心库的定义文件](https://github.com/Microsoft/TypeScript/tree/master/src/lib") 中定义了所有浏览器环境需要用到的类型，并且是预置在 TypeScript 中的。



---

# 进阶

## 类型别名

类型别名用来给一个类型起个新名字。

```javascript
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
    if (typeof n === 'string') {
        return n;
    } else {
        return n();
    }
}
```


## 字符串字面量类型

字符串字面量类型用来约束取值只能是某几个字符串中的一个。

```javascript
type EventNames = 'click' | 'scroll' | 'mousemove';
function handleEvent(ele: Element, event: EventNames) {
    // do something
}

handleEvent(document.getElementById('hello'), 'scroll');  // 没问题
handleEvent(document.getElementById('world'), 'dbclick'); // 报错，event 不能为 'dbclick'
```


## 元组

数组合并了相同类型的对象，而元组（Tuple）合并了不同类型的对象。
元组起源于函数编程语言（如 F#），这些语言中会频繁使用元组。

```javascript
let tom: [string, number];
tom[0] = 'Tom';
tom[1] = 25;

tom[0].slice(1);
tom[1].toFixed(2);

tom = ['Jack', 21];
```

当添加越界的元素时，它的类型会被限制为元组中每个类型的联合类型。


## 枚举

枚举（Enum）类型用于取值被限定在一定范围内的场景，比如一周只能有七天，颜色限定为红绿蓝等。

```javascript
enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};

console.log(Days["Sun"] === 0); // true
console.log(Days["Mon"] === 1); // true
console.log(Days["Tue"] === 2); // true
console.log(Days["Sat"] === 6); // true

console.log(Days[0] === "Sun"); // true
console.log(Days[1] === "Mon"); // true
console.log(Days[2] === "Tue"); // true
console.log(Days[6] === "Sat"); // true
```


---

# 类

类(Class)：定义了一件事物的抽象特点，包含它的属性和方法

对象（Object）：类的实例，通过 new 生成

面向对象（OOP）的三大特性：封装、继承、多态

- 封装（Encapsulation）：将对数据的操作细节隐藏起来，只暴露对外的接口。外界调用端不需要（也不可能）知道细节，就能通过对外提供的接口来访问该对象，同时也保证了外界无法任意更改对象内部的数据

- 继承（Inheritance）：子类继承父类，子类除了拥有父类的所有特性外，还有一些更具体的特性

- 多态（Polymorphism）：由继承而产生了相关的不同的类，对同一个方法可以有不同的响应。比如 Cat 和 Dog 都继承自 Animal，但是分别实现了自己的 eat 方法。此时针对某一个实例，我们无需了解它是 Cat 还是 Dog，就可以直接调用 eat 方法，程序会自动判断出来应该如何执行 eat

存取器（getter & setter）：用以改变属性的读取和赋值行为

修饰符（Modifiers）：修饰符是一些关键字，用于限定成员或类型的性质。比如 public 表示公有属性或方法

抽象类（Abstract Class）：抽象类是供其他类继承的基类，抽象类不允许被实例化。抽象类中的抽象方法必须在子类中被实现

接口（Interfaces）：不同类之间公有的属性或方法，可以抽象成一个接口。接口可以被类实现（implements）。一个类只能继承自另一个类，但是可以实现多个接口

## ES6 中类的用法

### 属性和方法

```javascript
class Animal {
    constructor(name) {
        this.name = name;
    }
    sayHi() {
        return `My name is ${this.name}`;
    }
}

let a = new Animal('Jack');
console.log(a.sayHi()); // My name is Jack
```

### 类的继承

使用 extends 关键字实现继承，子类中使用 super 关键字来调用父类的构造函数和方法。

```javascript
class Cat extends Animal {
    constructor(name) {
        super(name); // 调用父类的 constructor(name)
        console.log(this.name);
    }
    sayHi() {
        return 'Meow, ' + super.sayHi(); // 调用父类的 sayHi()
    }
}

let c = new Cat('Tom'); // Tom
console.log(c.sayHi()); // Meow, My name is Tom
```

### 存取器

使用 getter 和 setter 可以改变属性的赋值和读取行为：

```javascript
class Animal {
    constructor(name) {
        this.name = name;
    }
    get name() {
        return 'Jack';
    }
    set name(value) {
        console.log('setter: ' + value);
    }
}

let a = new Animal('Kitty'); // setter: Kitty
a.name = 'Tom'; // setter: Tom
console.log(a.name); // Jack
```

## ES7 中类的用法

### 静态方法

使用 static 修饰符修饰的方法称为静态方法，它们不需要实例化，而是直接通过类来调用：

```javascript
class Animal {
    static isAnimal(a) {
        return a instanceof Animal;
    }
}

let a = new Animal('Jack');
Animal.isAnimal(a); // true
a.isAnimal(a); // TypeError: a.isAnimal is not a function
```

### 实例属性
ES6 中实例的属性只能通过构造函数中的 this.xxx 来定义，ES7 提案中可以直接在类里面定义：

```javascript
class Animal {
    name = 'Jack';

    constructor() {
        // ...
    }
}

let a = new Animal();
console.log(a.name); // Jack
```

### 静态属性

ES7 提案中，可以使用 static 定义一个静态属性：

```javascript
class Animal {
    static num = 42;

    constructor() {
        // ...
    }
}

console.log(Animal.num); // 42
```


## TypeScript 中类的用法

public 修饰的属性或方法是公有的，可以在任何地方被访问到，默认所有的属性和方法都是 public 的
private 修饰的属性或方法是私有的，不能在声明它的类的外部访问
protected 修饰的属性或方法是受保护的，它和 private 类似，区别是它在子类中也是允许被访问的

readonly 只读属性关键字，只允许出现在属性声明或索引签名中。
注意如果 readonly 和其他访问修饰符同时存在的话，需要写在其后面。

```javascript
class Animal {
    // public readonly name;
    public constructor(public readonly name) {
        // this.name = name;
    }
}
```

### 抽象类

abstract 用于定义抽象类和其中的抽象方法。

抽象类是不允许被实例化
抽象类中的抽象方法必须被子类实现

```javascript
abstract class Animal {
    public name;
    public constructor(name) {
        this.name = name;
    }
    public abstract sayHi();
}

class Cat extends Animal {
    public sayHi() {
        console.log(`Meow, My name is ${this.name}`);
    }
}

let cat = new Cat('Tom');
```


## 类的类型

```javascript
class Animal {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    sayHi(): string {
      return `My name is ${this.name}`;
    }
}

let a: Animal = new Animal('Jack');
console.log(a.sayHi()); // My name is Jack
```


---

# 类与接口

接口（Interfaces）可以用于对「对象的形状（Shape）」进行描述。

另一用途，对类的一部分行为进行抽象。

## 类实现接口

实现（implements）是面向对象中的一个重要概念。一般来讲，一个类只能继承自另一个类，有时候不同类之间可以有一些共有的特性，这时候就可以把特性提取成接口（interfaces），用 implements 关键字来实现。这个特性大大提高了面向对象的灵活性。

```javascript
interface Alarm {
    alert(): void;
}

interface Light {
    lightOn(): void;
    lightOff(): void;
}

class Door {
}

class SecurityDoor extends Door implements Alarm {
    alert() {
        console.log('SecurityDoor alert');
    }
}

// 一个类可以实现多个接口
class Car implements Alarm, Light {
    alert() {
        console.log('Car alert');
    }
    lightOn() {
        console.log('Car light on');
    }
    lightOff() {
        console.log('Car light off');
    }
}
```


## 接口继承接口

```javascript
interface Alarm {
    alert();
}

interface LightableAlarm extends Alarm {
    lightOn();
    lightOff();
}
```


## 接口继承类

```javascript
class Point {
    x: number;
    y: number;
}

interface Point3d extends Point {
    z: number;
}

let point3d: Point3d = {x: 1, y: 2, z: 3};
```


## 混合类型

一个对象可以同时做为函数和对象使用，并带有额外的属性

```javascript
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}

function getCounter(): Counter {
    let counter = <Counter>function (start: number) { };
    counter.interval = 123;
    counter.reset = function () { };
    return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```


---

# 泛型

泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。

```javascript
function createArray<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray<string>(3, 'x'); // ['x', 'x', 'x']
```

上例中，我们在函数名后添加了 <T>，其中 T 用来指代任意输入的类型，在后面的输入 value: T 和输出 Array<T> 中即可使用了。

## 多个类型参数

```javascript
function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]];
}

swap([7, 'seven']); // ['seven', 7]
```

## 泛型约束

我们可以对泛型进行约束，只允许这个函数传入那些包含 length 属性的变量。

```javascript
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}
```

## 泛型接口

```javascript
interface CreateArrayFunc<T> {
    (length: number, value: T): Array<T>;
}

let createArray: CreateArrayFunc<any>;
createArray = function<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray(3, 'x'); // ['x', 'x', 'x']
```

## 泛型类

```javascript
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```

## 泛型参数的默认类型

```javascript
function createArray<T = string>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}
```


---

# 声明合并

如果定义了两个相同名字的函数、接口或类，那么它们会合并成一个类型。

## 函数的合并

我们可以使用重载定义多个函数类型

```javascript
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```

## 接口的合并

合并的属性的类型必须是唯一的

```javascript
interface Alarm {
    price: number;
}
interface Alarm {
    weight: number;
}
```

接口中方法的合并，与函数的合并一样

```javascript
interface Alarm {
    price: number;
    alert(s: string): string;
}
interface Alarm {
    weight: number;
    alert(s: string, n: number): string;
}

// 相当于

interface Alarm {
    price: number;
    weight: number;
    alert(s: string): string;
    alert(s: string, n: number): string;
}
```

## 类的合并

类的合并与接口的合并规则一致。


