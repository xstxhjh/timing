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


---


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

// 要使用CLI创建控制器，只需执行$ nest g controller cats命令。
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


为了与底层 HTTP平台(如 Express和 Fastify)之间的类型兼容，Nest 提供了 @Res()和 @Response() 装饰器。@Res()只是 @Response()的别名。两者都直接公开底层响应对象接口。在使用它们时，您还应该导入底层库的类型(例如：@types/express)以充分利用它们。注意，在方法处理程序中注入 @Res()或 @Response() 时，将 Nest置于该处理程序的特定于库的模式中，并负责管理响应。这样做时，必须通过调用响应对象(例如，res.json(…)或 res.send(…))发出某种响应，否则HTTP服务器将挂起。


## 资源

我们已经创建了一个端点来获取数据（GET 路由）。 我们通常还希望提供一个创建新记录的端点。为此，让我们创建 POST 处理程序:

```javascript
import { Controller, Get, Post } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Post()
  create(): string {
    return 'This action adds a new cat';
  }

  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
```

就这么简单。Nest以相同的方式提供其余的端点装饰器- @Put() 、 @Delete()、 @Patch()、 @Options()、 @Head()和 @All()。这些表示各自的 HTTP请求方法。


## 路线通配符

还支持基于模式的路由。例如，星号用作通配符，并将匹配任何字符组合。

```javascript
@Get('ab*cd')
findAll() {
  return 'This route uses a wildcard';
}
```

`该'ab*cd'路由路径匹配abcd，ab_cd，abecd，等等。字符?，+，*，和()可在路由路径中使用，并且是其正则表达式的对应的子集。连字符（-）和点（.）由基于字符串的路径按字面意义进行解释。`


## 状态代码

如前面所说，默认情况下，响应的状态码总是200，除了 POST 请求外，此时它是201，我们可以通过在处理程序层添加@HttpCode（...） 装饰器来轻松更改此行为。

```javascript
@Post()
@HttpCode(204)
create() {
  return 'This action adds a new cat';
}

// HttpCode从@nestjs/common包中导入。
```

通常，状态码不是固定的，而是取决于各种因素。在这种情况下，您可以使用类库特有的的响应（通过@Res()注入 ）对象（或者，在出现错误时，抛出异常）。


## Headers

要指定自定义响应头，可以使用 @header() 修饰器或类库特有的响应对象,（使用 并 res.header()直接调用）。

```javascript
@Post()
@Header('Cache-Control', 'none')
create() {
  return 'This action adds a new cat';
}

// Header 需要从 @nestjs/common 包导入。
```

## 重定向

要将响应重定向到特定的 URL，可以使用 @Redirect()装饰器或特定于库的响应对象(并直接调用 res.redirect())。

@Redirect() 带有必需的 url参数和可选的 statusCode参数。 如果省略，则 statusCode 默认为 302。

```javascript
@Get('docs')
@Redirect('https://docs.nestjs.com', 302)
getDocs(@Query('version') version) {
  if (version && version === '5') {
    return { url: 'https://docs.nestjs.com/v5/' };
  }
}
```

有时您可能想动态确定HTTP状态代码或重定向URL。通过从路由处理程序方法返回一个形状为以下形式的对象：

```json
{
  "url": string,
  "statusCode": number
}
```


## 路由参数

当您需要接受动态数据作为请求的一部分时（例如，使用GET /cats/1来获取 id为 1的 cat），带有静态路径的路由将无法工作。为了定义带参数的路由，我们可以在路由中添加路由参数标记，以捕获请求 URL 中该位置的动态值。@Get() 下面的装饰器示例中的路由参数标记演示了此用法。可以使用 @Param() 装饰器访问以这种方式声明的路由参数，该装饰器应添加到函数签名中。

```javascript
@Get(':id')
findOne(@Param() params): string {
  console.log(params.id);
  return `This action returns a #${params.id} cat`;
}

@Get(':id')
findOne(@Param('id') id): string {
  return `This action returns a #${id} cat`;
}

// Param从@nestjs/common包中导入。
```

@Param()用于修饰方法参数（上面示例中的参数），并使路由参数可用作该修饰的方法参数在方法体内的属性。 如上面的代码所示，我们可以通过引用 params.id来访问 id参数。 您还可以将特定的参数标记传递给装饰器，然后在方法主体中按名称直接引用路由参数。

