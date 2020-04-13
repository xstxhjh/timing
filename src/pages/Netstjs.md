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

# 控制器

控制器负责处理传入的 **请求** 和向客户端返回 **响应** 。

控制器的目的是接收应用的特定请求。路由机制控制哪个控制器接收哪些请求。通常，每个控制器有多个路由，不同的路由可以执行不同的操作。

为了创建一个基本的控制器，我们必须使用装饰器。装饰器将类与所需的元数据关联，并使 Nest 能够创建路由映射（将请求绑定到相应的控制器）。

## 路由

我们将使用 @Controller() 装饰器，这是定义基本控制器所必需的。我们将指定一个路径前缀(可选) cats。
在 @Controller() 装饰器中使用路径前缀，它允许我们轻松对一组相关路由进行分组，并减少重复代码。
例如，我们可以选择管理该路由下的客户实体的交互的这部分进行分组 /customers ，这样, 我们可以在 @Controller() 装饰器中指定路径前缀, 这样我们就不必为文件中的每个路由重新定义前缀。

```javascript
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}

// 提示：要使用CLI创建控制器，只需执行$ nest g controller cats命令。
```

findAll()方法之前的 @Get() HTTP 请求方法装饰器告诉 Nest 为HTTP请求的特定端点创建处理程序。端点对应于 HTTP 请求方法（在本例中为 GET）和路由。什么是路由 ？ 处理程序的路由是通过连接为控制器声明的（可选）前缀和请求装饰器中指定的任何路由来确定的。由于我们已经为每个 route（cats） 声明了一个前缀，并且没有在装饰器中添加任何路由信息，因此 Nest会将 GET /cats 请求映射到此处理程序。如上所述，该路由包括可选的控制器路由前缀和请求方法装饰器中声明的任何路由。例如，customers 与装饰器组合的路由前缀 @Get('profile') 会为请求生成路由映射 GET /customers/profile。

## 请求对象

处理程序通常需要访问客户端请求详细信息。Nest提供对基础平台的请求对象的访问（默认情况下为Express）。我们可以通过将@Req()装饰器添加到处理程序的签名中来指示Nest注入请求对象，从而访问该请求对象。

```javascript
import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(@Req() request: Request): string {
    return 'This action returns all cats';
  }
}

// 为了在 express 中使用 Typescript （如 request: Request 上面的参数示例所示），请安装 @types/express 。
```

Request 对象表示 HTTP 请求，并具有 Request 查询字符串，参数，HTTP 标头 和 正文的属性（在这里阅读更多），但在大多数情况下, 不必手动获取它们。 我们可以使用专用的装饰器，比如开箱即用的 @Body() 或 @Query() 。 下面是装饰器和 普通表达对象的比较。

|装饰器|普通表达对象|
|:-------|:------:|
| @Request() | req |
| @Response() | res |
| @Next() | next |
| @Session() | req.session |
| @Param(key?: string) | req.params / req.params[key] |
| @Body(key?: string) | req.body / req.body[key] |
| @Query(key?: string) | req.query / req.query[key] |
| @Headers(name?: string) | req.headers / req.headers[name] |
| @Ip() | req.ip |
