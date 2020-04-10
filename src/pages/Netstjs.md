[title]: # (NestJS)
[date]: # (2019-11-02 &nbsp; 19:22:05)
[categories]: # (Typescript)
[description]: # (NestJS是用于构建高效，可扩展的Node.js服务器端应用程序的框架。<br>渐进式JavaScript，内置并完全支持TypeScript。<br>结合了OOP（面向对象编程），FP（函数式编程）和FRP（函数响应式编程）。)
[image]: # (https://i.loli.net/2020/04/10/YbNBVixDGlqoULe.png)

---

# NestJS

- NestJS是用于构建高效，可扩展的Node.js服务器端应用程序的框架。
- 渐进式JavaScript，内置并完全支持TypeScript。
- 结合了OOP（面向对象编程），FP（函数式编程）和FRP（函数响应式编程）。

Nest利用了诸如Express（默认）之类的健壮的HTTP Server框架，并且可以选择配置为也使用Fastify！

```json
src
├── app.controller.ts   // 带有单个路由的基本控制器示例
├── app.module.ts       // 应用程序的根模块
└── main.ts             // 应用程序入口文件
```

## 控制器

控制器负责处理传入的 **请求** 和向客户端返回 **响应** 。

控制器的目的是接收应用的特定请求。路由机制控制哪个控制器接收哪些请求。通常，每个控制器有多个路由，不同的路由可以执行不同的操作。

为了创建一个基本的控制器，我们必须使用装饰器。装饰器将类与所需的元数据关联，并使 Nest 能够创建路由映射（将请求绑定到相应的控制器）。

