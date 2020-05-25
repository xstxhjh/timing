[title]: # (Typescript文档笔记)
[date]: # (2019-10-13 &nbsp; 22:15:42)
[categories]: # (Typescript)
[description]: # ()
[image]: # (https://i.loli.net/2020/04/10/hwr6LAyOuk3lXWS.png)

---

# 原始数据类型

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
// JavaScript 没有空值（Void）的概念，在 TypeScript 中，可以用 void 表示没有任何返回值的函数
function alertName(): void {
    alert('My name is Tom');
}


// Null 和 Undefined
let u: undefined = undefined;
let n: null = null;
```