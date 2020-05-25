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