[title]: # (Typescript文档笔记)
[date]: # (2019-10-13 &nbsp; 22:15:42)
[categories]: # (Typescript)
[description]: # ()
[image]: # (https://i.loli.net/2020/04/10/hwr6LAyOuk3lXWS.png)

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



