[title]: # (NestJS文档整理)
[date]: # (2020-01-08 &nbsp; 19:22:05)
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

```javascript
import { Controller, Get, Post, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Controller('cats')
export class CatsController {
  @Post()
  create(@Res() res: Response) {
    res.status(HttpStatus.CREATED).send();
  }

  @Get()
  findAll(@Res() res: Response) {
     res.status(HttpStatus.OK).json([]);
  }
}
```

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


## 子域路由

@Controller装饰可以配置host选项，要求进入的请求的HTTP主机相匹配一些特定的值。

```javascript
@Controller({ host: 'admin.example.com' })
export class AdminController {
  @Get()
  index(): string {
    return 'Admin page';
  }
}
```

与路由路径类似，该host选项可以捕获动态值，使用@HostParam()装饰器访问以这种方式声明的主机参数，该装饰器应添加到函数签名中。

```javascript
@Controller({ host: ':account.example.com' })
export class AccountController {
  @Get()
  getInfo(@HostParam('account') account: string) {
    return account;
  }
}
```


## 范围

对于来自不同编程语言背景的人来说，了解在 Nest 中几乎所有内容都可以在传入的请求之间共享，这让人意外。比如我们有一个数据库连接池，具有全局状态的单例服务等。请记住，Node.js 不遵循请求/响应多线程无状态模型，每个请求都由主线程处理。因此，使用单例实例对我们的应用程序来说是完全安全的。


## Async / await

```javascript
@Get()
async findAll(): Promise<any[]> {
  return [];
}
```

这是完全有效的。此外,通过返回 RxJS observable 流。 Nest 路由处理程序更强大。Nest 将自动订阅下面的源并获取最后发出的值（在流完成后）。

```javascript
@Get()
findAll(): Observable<any[]> {
  return of([]);
}
```


## 请求负载

之前的 POST 路由处理程序不接受任何客户端参数。我们在这里添加 @Body() 参数来解决这个问题。

首先(如果您使用 TypeScript)，我们需要确定 DTO(数据传输对象)模式。DTO是一个对象，它定义了如何通过网络发送数据。我们可以通过使用 TypeScript接口或简单的类来完成。令人惊讶的是，我们在这里推荐使用类。为什么?类是JavaScript ES6标准的一部分，因此它们在编译后的 JavaScript中保留为实际实体。另一方面，由于 TypeScript接口在转换过程中被删除，所以 Nest不能在运行时引用它们。这一点很重要，因为诸如管道之类的特性在运行时能够访问变量的元类型时提供更多的可能性。

```javascript
// create-cat.dto.ts
export class CreateCatDto {
  readonly name: string;
  readonly age: number;
  readonly breed: string;
}


// cats.controller.ts
@Post()
async create(@Body() createCatDto: CreateCatDto) {
  return 'This action adds a new cat';
}
```


---


# 提供者

Providers 是 Nest 的一个基本概念。许多基本的 Nest 类可能被视为 provider - service,repository, factory, helper 等等。 他们都可以通过 constructor 注入依赖关系。 这意味着对象可以彼此创建各种关系，并且“连接”对象实例的功能在很大程度上可以委托给 Nest运行时系统。 Provider只是一个用 @Injectable() 装饰器注释的类。

在前面的章节中，我们已经创建了一个简单的控制器 CatsController 。控制器应处理 HTTP 请求并将更复杂的任务委托给 providers。Providers 是纯粹的 JavaScript 类，在其类声明之前带有 @Injectable()装饰器。

## 服务

让我们从创建一个简单的 CatsService 开始。该服务将负责数据存储和检索，由其使用 CatsController，因此它被定义为provider是一个很好的选择。因此，我们用这个类来装饰 @Injectable()。

```javascript
// cats.service.ts

import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}

// 要使用 CLI 创建服务类，只需执行 $ nest g service cats 命令。
```

我们的 CatsService 是具有一个属性和两个方法的基本类。唯一的新特点是它使用 @Injectable() 装饰器。该 @Injectable() 附加有元数据，因此 Nest 知道这个类是一个 Nest provider。需要注意的是，上面有一个 Cat 接口。看起来像这样：

```javascript
export interface Cat {
  name: string;
  age: number;
  breed: string;
}
```

```javascript
import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```

CatsService 是通过类构造函数注入的。注意这里使用了私有的只读语法。这意味着我们已经在同一位置创建并初始化了 catsService 成员。

## 依赖注入

Nest 是建立在一种强大的设计模式之上的, 我们通常称之为依赖注入。我们建议在官方的 Angular文档中阅读有关此概念的精彩文章。

依赖注入（DI）是一种重要的应用设计模式。在设计应用时常会用到它，以提升它们的开发效率和模块化程度。
依赖，是当类需要执行其功能时，所需要的服务或对象。 DI 是一种编码模式，其中的类会从外部源中请求获取依赖，而不是自己创建它们。

在 Nest 中，借助 TypeScript 功能，管理依赖项非常容易，因为它们仅按类型进行解析。在下面的示例中，Nest 将 catsService 通过创建并返回一个实例来解析 CatsService（或者，在单例的正常情况下，如果现有实例已在其他地方请求，则返回现有实例）。解析此依赖关系并将其传递给控制器的构造函数（或分配给指定的属性）：

```javascript
constructor(private readonly catsService: CatsService) {}
```

## 作用域

Provider通常具有与应用程序生命周期同步的生命周期（“作用域”）。在启动应用程序时，必须解析每个依赖项，因此必须实例化每个提供程序。同样，当应用程序关闭时，每个provider都将被销毁。但是，有一些方法可以该标provider生命周期的请求范围。


## 定制providers

Nest 有一个内置的控制反转（"IoC"）容器，可以解决providers之间的关系。 此功能是上述依赖注入功能的基础，但要比上面描述的要强大得多。@Injectable() 装饰器只是冰山一角, 并不是定义 providers 的唯一方法。相反，您可以使用普通值、类、异步或同步工厂。

## 可选的providers

有时，您可能需要解决一些依赖项。例如，您的类可能依赖于一个配置对象，但如果没有传递，则应使用默认值。在这种情况下，关联变为可选的，provider 不会因为缺少配置导致错误。

要指示provider是可选的，请在 constructor 的参数中使用 @optional() 装饰器。

```javascript
import { Injectable, Optional, Inject } from '@nestjs/common';

@Injectable()
export class HttpService<T> {
  constructor(
    @Optional() @Inject('HTTP_OPTIONS') private readonly httpClient: T
  ) {}
}
```

请注意，在上面的示例中，我们使用自定义 provider，这是我们包含 HTTP_OPTIONS自定义标记的原因。前面的示例显示了基于构造函数的注入，通过构造函数中的类指示依赖关系。

## 基于属性的注入

我们目前使用的技术称为基于构造函数的注入，即通过构造函数方法注入providers。在某些非常特殊的情况下，基于属性的注入可能会有用。例如，如果顶级类依赖于一个或多个 providers，那么通过从构造函数中调用子类中的 super() 来传递它们就会非常烦人了。因此，为了避免出现这种情况，可以在属性上使用 @inject() 装饰器。

```javascript
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class HttpService<T> {
  @Inject('HTTP_OPTIONS')
  private readonly httpClient: T;
}

// 如果您的类没有扩展其他provider，你应该总是使用基于构造函数的注入。
```

## 注册 provider

现在我们已经定义了 provider（CatsService），并且已经有了该服务的使用者（CatsController），我们需要在 Nest 中注册该服务，以便它可以执行注入。 为此，我们可以编辑模块文件（app.module.ts），然后将服务添加到@Module()装饰器的 providers 数组中。

```javascript
// app.module.ts

import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class AppModule {}
```


---


# 模块

模块是具有 @Module() 装饰器的类。 @Module() 装饰器提供了元数据，Nest 用它来组织应用程序结构。

每个 Nest 应用程序至少有一个模块，即根模块。根模块是 Nest 开始安排应用程序树的地方。事实上，根模块可能是应用程序中唯一的模块，特别是当应用程序很小时，但是对于大型程序来说这是没有意义的。在大多数情况下，您将拥有多个模块，每个模块都有一组紧密相关的功能。

@module() 装饰器接受一个描述模块属性的对象：

|属性|说明|
|:-------|:------:|
|providers | 由 Nest 注入器实例化的提供者，并且可以至少在整个模块中共享
|controllers | 必须创建的一组控制器
|imports | 导入模块的列表，这些模块导出了此模块中所需提供者
|exports | 由本模块提供并应在其他模块中可用的提供者的子集。

默认情况下, 模块封装提供者。这意味着如果提供者即不是当前模块的一部分, 也不是从另外模块(已导入)导出的，那么它就是无法注入的。


## 功能模块

CatsController 和 CatsService 属于同一个应用程序域。 应该考虑将它们移动到一个功能模块下，即 CatsModule。

```javascript
// cats/cats.module.ts

import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}

// 要使用 CLI 创建模块，只需执行 $ nest g module cats 命令。
```

我已经创建了 cats.module.ts 文件，并把与这个模块相关的所有东西都移到了 cats 目录下。我们需要做的最后一件事是将这个模块导入根模块 (ApplicationModule)。

```javascript
// app.module.ts

import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class ApplicationModule {}
```

## 共享模块

在 Nest 中，默认情况下，模块是单例，因此您可以轻松地在多个模块之间共享同一个提供者实例。

实际上，每个模块都是一个共享模块。一旦创建就能被任意模块重复使用。假设我们将在几个模块之间共享 CatsService 实例。 我们需要把 CatsService 放到 exports 数组中，如下所示：

```javascript
// cats.module.ts

import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService]
})
export class CatsModule {}
```

现在，每个导入 CatsModule 的模块都可以访问 CatsService ，并且它们将共享相同的 CatsService 实例。

实际上，每个模块都是一个共享模块。一旦创建就能被任意模块重复使用。假设我们将在几个模块之间共享 CatsService 实例。 我们需要把 CatsService 放到 exports 数组中，如下所示：

```javascript
// cats.module.ts

import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService]
})
export class CatsModule {}
```

现在，每个导入 CatsModule 的模块都可以访问 CatsService ，并且它们将共享相同的 CatsService 实例。


## 模块重新导出

模块可以导出他们的内部提供者。 而且，他们可以再导出自己导入的模块。

```javascript
@Module({
  imports: [CommonModule],
  exports: [CommonModule],
})
export class CoreModule {}
```


## 依赖注入

提供者也可以注入到模块(类)中（例如，用于配置目的）：

```javascript
// cats.module.ts

import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {
  constructor(private readonly catsService: CatsService) {}
}
```

但是，由于循环依赖性，模块类不能注入到提供者中。


## 全局模块

如果你不得不在任何地方导入相同的模块，那可能很烦人。在 Angular 中，提供者是在全局范围内注册的。一旦定义，他们到处可用。另一方面，Nest 将提供者封装在模块范围内。您无法在其他地方使用模块的提供者而不导入他们。但是有时候，你可能只想提供一组随时可用的东西 - 例如：helper，数据库连接等等。这就是为什么你能够使模块成为全局模块。

```javascript
import { Module, Global } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Global()
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}
```

@Global 装饰器使模块成为全局作用域。 全局模块应该只注册一次，最好由根或核心模块注册。 在上面的例子中，CatsService 组件将无处不在，而想要使用 CatsService 的模块则不需要在 imports 数组中导入 CatsModule。

使一切全局化并不是一个好的解决方案。 全局模块可用于减少必要模板文件的数量。 imports 数组仍然是使模块 API 透明的最佳方式。


## 动态模块

Nest 模块系统带有一个称为动态模块的功能。 它使您能够毫不费力地创建可定制的模块。 让我们来看看 DatabaseModule：

```javascript
import { Module, DynamicModule } from '@nestjs/common';
import { createDatabaseProviders } from './database.providers';
import { Connection } from './connection.provider';

@Module({
  providers: [Connection],
})
export class DatabaseModule {
  static forRoot(entities = [], options?): DynamicModule {
    const providers = createDatabaseProviders(options, entities);
    return {
      module: DatabaseModule,
      providers: providers,
      exports: providers,
    };
  }
}

// forRoot() 可以同步或异步（Promise）返回动态模块。
```

此模块默认定义了 Connection 提供者，但另外 - 根据传递的 options 和 entities - 创建一个提供者集合，例如存储库。实际上，动态模块扩展了模块元数据。当您需要动态注册组件时，这个实质特性非常有用。然后你可以通过以下方式导入 DatabaseModule：

```javascript
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [DatabaseModule.forRoot([User])],
})
export class ApplicationModule {}
```

为了导出动态模块，可以省略函数调用部分：

```javascript
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [DatabaseModule.forRoot([User])],
  exports: [DatabaseModule],
})
export class ApplicationModule {}
```


---


# 中间件

中间件是在路由处理程序 之前 调用的函数。 中间件函数可以访问请求和响应对象，以及应用程序请求响应周期中的 next() 中间件函数。 next() 中间件函数通常由名为 next 的变量表示。

Nest 中间件实际上等价于 express 中间件。 下面是Express官方文档中所述的中间件功能：

中间件函数可以执行以下任务:

- 执行任何代码。
- 对请求和响应对象进行更改。
- 结束请求-响应周期。
- 调用堆栈中的下一个中间件函数。
- 如果当前的中间件函数没有结束请求-响应周期, 它必须调用 next() 将控制传递给下一个中间件函数。否则, 请求将被挂起。

您可以在函数中或在具有 @Injectable() 装饰器的类中实现自定义 Nest中间件。 这个类应该实现 NestMiddleware 接口, 而函数没有任何特殊的要求。 让我们首先使用类方法实现一个简单的中间件功能。

```javascript
// logger.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    console.log('Request...');
    next();
  }
}

```

## 依赖注入

Nest中间件完全支持依赖注入。 就像提供者和控制器一样，它们能够注入属于同一模块的依赖项（通过 constructor ）。


## 应用中间件

中间件不能在 @Module() 装饰器中列出。我们必须使用模块类的 configure() 方法来设置它们。包含中间件的模块必须实现 NestModule 接口。我们将 LoggerMiddleware 设置在 ApplicationModule 层上。

```javascript
// app.module.ts

import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('cats');
  }
}
```

我们还可以在配置中间件时将包含路由路径的对象和请求方法传递给forRoutes()方法。我们为之前在CatsController中定义的/cats路由处理程序设置了LoggerMiddleware。我们还可以在配置中间件时将包含路由路径的对象和请求方法传递给 forRoutes()方法，从而进一步将中间件限制为特定的请求方法。在下面的示例中，请注意我们导入了 RequestMethod来引用所需的请求方法类型。

```javascript
// app.module.ts

import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'cats', method: RequestMethod.GET });
  }
}

// 可以使用 async/await来实现 configure()方法的异步化(例如，可以在 configure()方法体中等待异步操作的完成)。
```


## 路由通配符

路由同样支持模式匹配。例如，星号被用作通配符，将匹配任何字符组合。

```javascript
forRoutes({ path: 'ab*cd', method: RequestMethod.ALL });
```

以上路由地址将匹配 abcd 、 ab_cd 、 abecd 等。字符 ? 、 + 、 * 以及 () 是它们的正则表达式对应项的子集。连字符 (-) 和点 (.) 按字符串路径解析。


## 中间件消费者

MiddlewareConsumer 是一个帮助类。它提供了几种内置方法来管理中间件。他们都可以被简单地链接起来。forRoutes() 可接受一个字符串、多个字符串、对象、一个控制器类甚至多个控制器类。在大多数情况下，您可能只会传递一个由逗号分隔的控制器列表。以下是单个控制器的示例：

```javascript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';
import { CatsController } from './cats/cats.controller.ts';

@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(CatsController);
  }
}

// 该 apply() 方法可以使用单个中间件，也可以使用多个参数来指定多个多个中间件。
```

我们可能经常希望将某些路由排除在中间件应用之外。当使用类定义中间件时(正如我们到目前为止所做的，而不是使用替代函数式中间件），我们可以使用该 exclude() 方法轻松地排除某些路由。该方法采用一个或多个对象标识要排除的 path 和 method，如下所示：

```javascript
consumer
  .apply(LoggerMiddleware)
  .exclude(
    { path: 'cats', method: RequestMethod.GET },
    { path: 'cats', method: RequestMethod.POST }
  )
  .forRoutes(CatsController);
```

通过上面的示例，LoggerMiddleware 将绑定到 CatsController 除了 exclude() 方法的两个内部定义的所有路由。请注意，该 exclude()方法不适用于函数中间件（在函数中而不是在类中定义的中间件;有关更多详细信息，请参阅下文）。此外，此方法不排除来自更通用路由（例如，通配符）的路径。如果您需要这种级别的控制，您应该将路径限制逻辑直接放入中间件，例如，访问请求的 URL以有条件地应用中间件逻辑。


## 函数式中间件

我们使用的 LoggerMiddleware 类非常简单。它没有成员，没有额外的方法，没有依赖关系。为什么我们不能只使用一个简单的函数？这是一个很好的问题，因为事实上 - 我们可以做到。这种类型的中间件称为函数式中间件。让我们把 logger 转换成函数。

```javascript
// logger.middleware.ts
export function logger(req, res, next) {
  console.log(`Request...`);
  next();
};


// 现在在 ApplicationModule 中使用它。

// app.module.ts
consumer
  .apply(logger)
  .forRoutes(CatsController);

//当您的中间件没有任何依赖关系时，我们可以考虑使用函数式中间件。
```


## 多个中间件

如前所述，为了绑定顺序执行的多个中间件，我们可以在 apply() 方法内用逗号分隔它们。

```javascript
consumer.apply(cors(), helmet(), logger).forRoutes(CatsController);
```


## 全局中间件

如果我们想一次性将中间件绑定到每个注册路由，我们可以使用由INestApplication实例提供的 use()方法：

```javascript
const app = await NestFactory.create(AppModule);
app.use(logger);
await app.listen(3000);
```


---


# 异常过滤器

内置的异常层负责处理整个应用程序中的所有抛出的异常。当捕获到未处理的异常时，最终用户将收到友好的响应。

每个发生的异常都由全局异常过滤器处理, 当这个异常无法被识别时 (既不是 HttpException 也不是继承的类 HttpException ) , 用户将收到以下 JSON 响应:

```json
{
    "statusCode": 500,
    "message": "Internal server error"
}
```


## 基础异常类

Nest提供了一个内置的 HttpException 类，它从 @nestjs/common 包中导入。对于典型的基于HTTP REST/GraphQL API的应用程序，最佳实践是在发生某些错误情况时发送标准HTTP响应对象。

在 CatsController，我们有一个 findAll() 方法（GET 路由）。假设此路由处理程序由于某种原因引发异常。 为了说明这一点，我们将对其进行如下硬编码：

```javascript
// cats.controller.ts

@Get()
async findAll() {
  throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
}

// 我们在这里使用了 HttpStatus 。它是从 @nestjs/common 包导入的辅助枚举器。
```

现在当客户端调用这个端点时，响应如下所示：

```json
{
    "statusCode": 403,
    "message": "Forbidden"
}
```

HttpException 构造函数有两个必要的参数来决定响应:

- response 参数定义 JSON 响应体。它可以是 string 或 object，如下所述。

- status参数定义HTTP状态代码。

默认情况下，JSON 响应主体包含两个属性：

- statusCode：默认为 status 参数中提供的 HTTP 状态代码

- message:基于状态的 HTTP 错误的简短描述

仅覆盖 JSON 响应主体的消息部分，请在 response参数中提供一个 string。

要覆盖整个 JSON 响应主体，请在response 参数中传递一个object。 Nest将序列化对象，并将其作为JSON 响应返回。

第二个构造函数参数-status-是有效的 HTTP 状态代码。 最佳实践是使用从@nestjs/common导入的 HttpStatus枚举。

这是一个覆盖整个响应正文的示例：

```javascript
// cats.controller.ts

@Get()
async findAll() {
  throw new HttpException({
    status: HttpStatus.FORBIDDEN,
    error: 'This is a custom message',
  }, 403);
}
```


## 自定义异常

在许多情况下，您无需编写自定义异常，而可以使用内置的 Nest HTTP异常，如下一节所述。 如果确实需要创建自定义的异常，则最好创建自己的异常层次结构，其中自定义异常从基 HttpException 类继承。 使用这种方法，Nest可以识别您的异常，并自动处理错误响应。 让我们实现这样一个自定义异常：

```javascript
// forbidden.exception.ts

export class ForbiddenException extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}
```

由于 ForbiddenException 扩展了基础 HttpException，它将和核心异常处理程序一起工作，因此我们可以在 findAll()方法中使用它。

```javascript
// cats.controller.ts

@Get()
async findAll() {
  throw new ForbiddenException();
}
```


## 内置HTTP异常

为了减少样板代码，Nest 提供了一系列继承自核心异常 HttpException 的可用异常。所有这些都可以在 @nestjs/common包中找到：

- BadRequestException
- UnauthorizedException
- NotFoundException
- ForbiddenException
- NotAcceptableException
- RequestTimeoutException
- ConflictException
- GoneException
- PayloadTooLargeException
- UnsupportedMediaTypeException
- UnprocessableException
- InternalServerErrorException
- NotImplementedException
- BadGatewayException
- ServiceUnavailableException
- GatewayTimeoutException

## 异常过滤器

虽然基本（内置）异常过滤器可以为您自动处理许多情况，但有时您可能希望对异常层拥有完全控制权，例如，您可能要添加日志记录或基于一些动态因素使用其他 JSON模式。 异常过滤器正是为此目的而设计的。 它们使您可以控制精确的控制流以及将响应的内容发送回客户端。

让我们创建一个异常过滤器，它负责捕获作为HttpException类实例的异常，并为它们设置自定义响应逻辑。为此，我们需要访问底层平台 Request和 Response。我们将访问Request对象，以便提取原始 url并将其包含在日志信息中。我们将使用 Response.json()方法，使用 Response对象直接控制发送的响应。

```javascript
// http-exception.filter.ts

import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}

// 所有异常过滤器都应该实现通用的 ExceptionFilter<T> 接口。它需要你使用有效签名提供 catch(exception: T, host: ArgumentsHost)方法。T 表示异常的类型。
```

@Catch() 装饰器绑定所需的元数据到异常过滤器上。它告诉 Nest这个特定的过滤器正在寻找 HttpException 而不是其他的。在实践中，@Catch() 可以传递多个参数，所以你可以通过逗号分隔来为多个类型的异常设置过滤器。


## 参数主机

让我们看看 catch()方法的参数。exception参数是当前正在处理的异常对象。host 参数是一个 ArgumentsHost 对象。ArgumentsHost 是传递给原始处理程序的参数的一个包装 ，我们将在其他章节中进一步讨论它。在这个上下文中，它的主要目的是为我们提供一个 Request 和 Response 对象的引用，这些对象被传递给原始请求处理程序(在产生异常的控制器中)。在本文中，我们使用了 ArgumentsHost上的一些帮助方法来获得所需的Request 和 Response 对象。

switchtohttp() 返回一个 HttpArgumentsHost 对象。HttpArgumentsHost 对象有两个方法。我们使用这些方法来提取所需的对象，在本例中还使用了 Express 类型断言来返回原生的 Express类型化对象:

```javascript
const response = ctx.getResponse<Response>();
const request = ctx.getRequest<Request>();
```

这种抽象级别的原因是 ArgumentsHost 在所有上下文中都起作用（例如，我们现在正在使用的HTTP Server上下文，以及微服务和 Sockets）。 稍后，我们将看到如何利用ArgumentsHost及其辅助函数的功能为任何执行上下文访问适当的基础参数。 这将使我们能够编写可在所有上下文中运行的通用异常过滤器。


## 绑定过滤器

让我们将 HttpExceptionFilter 绑定到 CatsController 的 create() 方法上。

```javascript
// cats.controller.ts

@Post()
@UseFilters(new HttpExceptionFilter())
async create(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}

// @UseFilters() 装饰器需要从 @nestjs/common 包导入。
```

我们在这里使用了 @UseFilters() 装饰器。和 @Catch()装饰器类似，它可以使用单个过滤器实例，也可以使用逗号分隔的过滤器实例列表。 我们创建了 HttpExceptionFilter 的实例。另一种可用的方式是传递类（不是实例），让框架承担实例化责任并启用依赖注入。

```javascript
// cats.controller.ts

@Post()
@UseFilters(HttpExceptionFilter)
async create(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}

// 尽可能使用类而不是实例。由于 Nest 可以轻松地在整个模块中重复使用同一类的实例，因此可以减少内存使用。
```

在上面的示例中，HttpExceptionFilter 仅应用于单个 create() 路由处理程序，使其成为方法范围的。 异常过滤器的作用域可以划分为不同的级别：方法范围，控制器范围或全局范围。 例如，要将过滤器设置为控制器作用域，您可以执行以下操作：

```javascript
// cats.controller.ts

@UseFilters(new HttpExceptionFilter())
export class CatsController {}
```

此结构为 CatsController 中的每个路由处理程序设置 HttpExceptionFilter。

要创建一个全局范围的过滤器，您需要执行以下操作:

```javascript
// main.ts

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();

// 该 useGlobalFilters() 方法不会为网关和混合应用程序设置过滤器。
```

全局过滤器用于整个应用程序、每个控制器和每个路由处理程序。就依赖注入而言，从任何模块外部注册的全局过滤器（使用上面示例中的 useGlobalFilters()）不能注入依赖，因为它们不属于任何模块。为了解决这个问题，你可以注册一个全局范围的过滤器直接为任何模块设置过滤器：

```javascript
// app.module.ts

import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}

// 当使用此方法对过滤器执行依赖注入时，请注意，无论采用哪种结构的模块，过滤器实际上都是全局的。 应该在哪里做？ 选择定义了过滤器（以上示例中为 HttpExceptionFilter）的模块。 同样，useClass不是处理自定义提供程序注册的唯一方法。 在这里了解更多。
```

您可以根据需要添加任意数量的过滤器;只需将每个组件添加到 providers（提供者）数组。


## 捕获异常

为了捕获每一个未处理的异常(不管异常类型如何)，将 @Catch() 装饰器的参数列表设为空，例如 @Catch()。

```javascript
// any-exception.filter.ts

import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

在上面的示例中，过滤器将捕获抛出的每个异常，而不管其类型(类)如何。


## 继承

通常，您将创建完全定制的异常过滤器，以满足您的应用程序需求。如果您希望重用已经实现的核心异常过滤器，并基于某些因素重写行为，请看下面的例子。

为了将异常处理委托给基础过滤器，需要继承 BaseExceptionFilter 并调用继承的 catch() 方法。

```javascript
// all-exceptions.filter.ts

import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);
  }
}

// 继承自基础类的过滤器必须由框架本身实例化（不要使用 new 关键字手动创建实例）
```

上面的实现只是一个演示。扩展异常过滤器的实现将包括定制的业务逻辑(例如，处理各种情况)。

全局过滤器可以扩展基本过滤器。这可以通过两种方式来实现。

您可以通过注入 HttpServer 来使用继承自基础类的全局过滤器。

```javascript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  await app.listen(3000);
}
bootstrap();
```


---


# 管道

管道是具有 @Injectable() 装饰器的类。管道应实现 PipeTransform 接口。

管道有两个类型:

- 转换：管道将输入数据转换为所需的数据输出
- 验证：对输入数据进行验证，如果验证成功继续传递; 验证失败则抛出异常;

在这两种情况下, 管道 参数(arguments) 会由 控制器(controllers)的路由处理程序 进行处理. Nest 会在调用这个方法之前插入一个管道，管道会先拦截方法的调用参数,进行转换或是验证处理，然后用转换好或是验证好的参数调用原方法。

管道在异常区域内运行。这意味着当抛出异常时，它们由核心异常处理程序和应用于当前上下文的 异常过滤器 处理。当在 Pipe 中发生异常，controller 不会继续执行任何方法。


## 内置管道

Nest 自带三个开箱即用的管道，即 ValidationPipe，ParseIntPipe 和 ParseUUIDPipe。他们从 @nestjs/common 包中导出。为了更好地理解它们是如何工作的，我们将从头开始构建它们。

我们从 ValidationPipe. 开始。 首先它只接受一个值并立即返回相同的值，其行为类似于一个标识函数。

```javascript
// validation.pipe.ts

import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}

// PipeTransform<T, R> 是一个通用接口，其中 T 表示 value 的类型，R 表示 transform() 方法的返回类型。
```

每个管道必须提供 transform() 方法。 这个方法有两个参数：

- value
- metadata

value 是当前处理的参数，而 metadata 是其元数据。元数据对象包含一些属性：

```javascript
export interface ArgumentMetadata {
  readonly type: 'body' | 'query' | 'param' | 'custom';
  readonly metatype?: Type<any>;
  readonly data?: string;
}
```

|参数|描述|
|:-------|:------:|
|type | 告诉我们该属性是一个 body @Body()，query @Query()，param @Param() 还是自定义参数 |
|metatype | 属性的元类型，例如 String。 如果在函数签名中省略类型声明，或者使用原生 JavaScript，则为 undefined。 |
|data | 传递给装饰器的字符串，例如 @Body('string')。 如果您将括号留空，则为 undefined。 |

TypeScript接口在编译期间消失，所以如果你使用接口而不是类，那么 metatype 的值将是一个 Object。


## 测试用例

我们来关注一下 CatsController 的 create() 方法：

```javascript
// cats.controler.ts

@Post()
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}

// create-cat.dto.ts

export class CreateCatDto {
  readonly name: string;
  readonly age: number;
  readonly breed: string;
}
```

我们要确保create方法能正确执行，所以必须验证 CreateCatDto 里的三个属性。我们可以在路由处理程序方法中做到这一点，但是我们会打破单个责任原则（SRP）。另一种方法是创建一个验证器类并在那里委托任务，但是不得不每次在方法开始的时候我们都必须使用这个验证器。那么验证中间件呢？ 这可能是一个好主意，但我们不可能创建一个整个应用程序通用的中间件(因为中间件不知道 execution context执行环境,也不知道要调用的函数和它的参数)。

在这种情况下，你应该考虑使用管道。


## 类验证器

让我们看一下验证的另外一种实现方式

Nest 与 class-validator 配合得很好。这个优秀的库允许您使用基于装饰器的验证。装饰器的功能非常强大，尤其是与 Nest 的 Pipe 功能相结合使用时，因为我们可以通过访问 metatype 信息做很多事情，在开始之前需要安装一些依赖。

```shell
$ npm i --save class-validator class-transformer
```

安装完成后，我们就可以向 CreateCatDto 类添加一些装饰器。

```javascript
// create-cat.dto.ts

import { IsString, IsInt } from 'class-validator';

export class CreateCatDto {
  @IsString()
  readonly name: string;

  @IsInt()
  readonly age: number;

  @IsString()
  readonly breed: string;
}
```

现在我们来创建一个 ValidationPipe 类。

```javascript
// validation.pipe.ts

import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
```

让我们来看看这个代码。首先你会发现 transform() 函数是 异步 的, Nest 支持同步和异步管道。这样做的原因是因为有些 class-validator 的验证是可以异步的(Promise)

接下来请注意，我们正在使用解构赋值（从 ArgumentMetadata 中提取参数）到方法中。这是一个先获取全部 ArgumentMetadata 然后用附加语句提取某个变量的简写方式。

下一步，请观察 toValidate() 方法。当验证类型不是 JavaScript 的数据类型时，跳过验证。

下一步，我们使用 class-transformer 的 plainToClass() 方法来转换 JavaScript 的参数为可验证的类型对象。一个请求中的 body 数据是不包行类型信息的，Class-validator 需要使用前面定义过的 DTO，就需要做一个类型转换。

最后，如前所述，这就是一个验证管道，它要么返回值不变，要么抛出异常。

最后一步是设置 ValidationPipe 。管道，与异常过滤器相同，它们可以是方法范围的、控制器范围的和全局范围的。另外，管道可以是参数范围的。我们可以直接将管道实例绑定到路由参数装饰器，例如@Body()。让我们来看看下面的例子：

```javascript
// cats.controler.ts

@Post()
@UsePipes(ValidationPipe)
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

由于 ValidationPipe 被创建为尽可能通用，所以我们将把它设置为一个全局作用域的管道，用于整个应用程序中的每个路由处理器。

```javascript
// main.ts

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();

// 在 混合应用中 useGlobalPipes() 方法不会为网关和微服务设置管道, 对于标准(非混合) 微服务应用使用 useGlobalPipes() 全局设置管道。
```

全局管道用于整个应用程序、每个控制器和每个路由处理程序。就依赖注入而言，从任何模块外部注册的全局管道（如上例所示）无法注入依赖，因为它们不属于任何模块。为了解决这个问题，可以使用以下构造直接为任何模块设置管道：

```javascript
// app.module.ts

import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    }
  ]
})
export class AppModule {}
```


## 转换管道

验证不是管道唯一的用处。在本章的开始部分，我已经提到管道也可以将输入数据转换为所需的输出。这是可以的，因为从 transform 函数返回的值完全覆盖了参数先前的值。在什么时候使用？有时从客户端传来的数据需要经过一些修改（例如字符串转化为整数），然后处理函数才能正确的处理。还有种情况，比如有些数据具有默认值，用户不必传递带默认值参数，一旦用户不穿就使用默认值。转换管道被插入在客户端请求和请求处理程序之间用来处理客户端请求。

```javascript
// parse-int.pipe.ts

import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }
    return val;
  }
}

// 如下所示, 我们可以很简单的配置管道来处理所参数 id:

@Get(':id')
async findOne(@Param('id', new ParseIntPipe()) id) {
  return await this.catsService.findOne(id);
}
```

## 内置验证管道

幸运的是，由于 ValidationPipe 和 ParseIntPipe 是内置管道，因此您不必自己构建这些管道（请记住， ValidationPipe 需要同时安装 class-validator 和 class-transformer 包）。

内置的 ValidationPipe 提供了比本章描述的更多的选项，为了简单和减少学习曲线，这些选项一直保持基本。你可以在这里查看很多例子。

另一个选项是转换，回想一下前面提到过的反序列化 body 数据没有验证类型（DTO 定义）。到目前为止我们已经使用管道来验证数据，你可能还记得在这个过程中，我们用class-transform把普通对象转换为 DTO 可验证对象来进行验证。内置的 ValidationPipe 也可以返回转换后的对象，该对象 transform 的值为 true，如下所示：

```javascript
// cats.controller.ts

@Post()
@UsePipes(new ValidationPipe({ transform: true }))
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}

// ValidationPipe 是从 @nestjs/common 包中导入的。
```

因为这个管道是基于 class-validator 和 class-transformer 库的，所以有很多选项可配置。选项如下：

```javascript
export interface ValidationPipeOptions extends ValidatorOptions {
  transform?: boolean;
  disableErrorMessages?: boolean;
  exceptionFactory?: (errors: ValidationError[]) => any;
}
```

您可以在他的库中找到关于 class-validator 包的更多信息。


---


# 守卫

守卫是一个使用 @Injectable() 装饰器的类。 守卫应该实现 CanActivate 接口。

守卫有一个单独的责任。它们根据运行时出现的某些条件（例如权限，角色，访问控制列表等）来确定给定的请求是否由路由处理程序处理。 这通常称为授权。在传统的 Express 应用程序中，通常由中间件处理授权。中间件是身份验证的良好选择。到目前为止，访问限制逻辑大多在中间件内。这样很好，因为诸如 token 验证或将 request 对象附加属性与特定路由没有强关联。

中间件不知道调用 next() 函数后会执行哪个处理程序。另一方面，警卫可以访问 ExecutionContext 实例，因此确切地知道接下来要执行什么。它们的设计与异常过滤器、管道和拦截器非常相似，目的是让您在请求/响应周期的正确位置插入处理逻辑，并以声明的方式进行插入。这有助于保持代码的简洁和声明性。

守卫在所有中间件执行之后执行，但在任何拦截器或管道之前执行。


## 授权守卫

正如前面提到的，授权是保护的一个很好的用例，因为只有当调用者(通常是经过身份验证的特定用户)具有足够的权限时，特定的路由才可用。我们现在要构建的 AuthGuard 假设用户是经过身份验证的(因此，请求头附加了一个token)。它将提取和验证token，并使用提取的信息来确定请求是否可以继续。

```javascript
// auth.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
```

validateRequest() 函数中的逻辑可以根据需要变得简单或复杂。本例的主要目的是说明保护如何适应请求/响应周期。

每个保护必须实现一个canActivate()函数。此函数应该返回一个布尔值，指示是否允许当前请求。它可以同步或异步地返回响应(通过 Promise 或 Observable)。Nest使用返回值来控制下一个行为:

- 如果返回 true, 将处理用户调用。
- 如果返回 false, 则 Nest 将忽略当前处理的请求。


## 执行上下文

canActivate() 函数接收单个参数 ExecutionContext 实例。ExecutionContext 继承自 ArgumentsHost 。ArgumentsHost 是传递给原始处理程序的参数的包装器，在上面的示例中，我们只是使用了之前在 ArgumentsHost上定义的帮助器方法来获得对请求对象的引用。有关此主题的更多信息。你可以在这里了解到更多(在异常过滤器章节)。

ExecutionContext 提供了更多功能，它扩展了 ArgumentsHost，但是也提供了有关当前执行过程的更多详细信息。

```javascript
export interface ExecutionContext extends ArgumentsHost {
  getClass<T = any>(): Type<T>;
  getHandler(): Function;
}
```

getHandler()方法返回对将要调用的处理程序的引用。getClass()方法返回这个特定处理程序所属的 Controller 类的类型。例如，如果当前处理的请求是 POST 请求，目标是 CatsController上的 create() 方法，那么 getHandler() 将返回对 create() 方法的引用，而 getClass()将返回一个CatsControllertype(而不是实例)。


## 基于角色认证

一个更详细的例子是一个 RolesGuard 。这个守卫只允许具有特定角色的用户访问。我们将从一个基本模板开始，并在接下来的部分中构建它。目前，它允许所有请求继续:

```javascript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return true;
  }
}
```


## 绑定守卫

与管道和异常过滤器一样，守卫可以是控制范围的、方法范围的或全局范围的。下面，我们使用 @UseGuards()装饰器设置了一个控制范围的守卫。这个装饰器可以使用单个参数，也可以使用逗号分隔的参数列表。也就是说，你可以传递几个守卫并用逗号分隔它们。

```javascript
@Controller('cats')
@UseGuards(RolesGuard)
export class CatsController {}

// @UseGuards() 装饰器需要从 @nestjs/common 包导入。
```

上面的构造将守卫附加到此控制器声明的每个处理程序。如果我们决定只限制其中一个, 我们只需要在方法级别设置守卫。为了绑定全局守卫, 我们使用 Nest 应用程序实例的 useGlobalGuards() 方法:

为了设置一个全局警卫，使用Nest应用程序实例的 useGlobalGuards() 方法：

```javascript
const app = await NestFactory.create(AppModule);
app.useGlobalGuards(new RolesGuard());

// 对于混合应用程序，useGlobalGuards() 方法不会为网关和微服务设置守卫。对于“标准”(非混合)微服务应用程序，useGlobalGuards()在全局安装守卫。
```

全局守卫用于整个应用程序, 每个控制器和每个路由处理程序。在依赖注入方面, 从任何模块外部注册的全局守卫 (如上面的示例中所示) 不能插入依赖项, 因为它们不属于任何模块。为了解决此问题, 您可以使用以下构造直接从任何模块设置一个守卫:

```javascript
// app.module.ts

import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}

// 当使用此方法为守卫程序执行依赖项注入时，请注意，无论使用此构造的模块是什么，守卫程序实际上是全局的。应该在哪里进行?选择定义守卫的模块(上例中的 RolesGuard)。此外，useClass不是处理自定义 providers 注册的唯一方法。
``` 


---


# 拦截器

拦截器是使用 @Injectable() 装饰器注解的类。拦截器应该实现 NestInterceptor 接口。

拦截器具有一系列有用的功能，这些功能受面向切面编程（AOP）技术的启发。它们可以：

- 在函数执行之前/之后绑定额外的逻辑
- 转换从函数返回的结果
- 转换从函数抛出的异常
- 扩展基本函数行为
- 根据所选条件完全重写函数 (例如, 缓存目的)


## 基础

每个拦截器都有 intercept() 方法，它接收2个参数。 第一个是 ExecutionContext 实例（与守卫完全相同的对象）。 ExecutionContext 继承自 ArgumentsHost 。 ArgumentsHost 是传递给原始处理程序的参数的一个包装 ，它根据应用程序的类型包含不同的参数数组。


## 执行上下文

ExecutionContext 提供了更多功能，它扩展了 ArgumentsHost，但是也提供了有关当前执行过程的更多详细信息。

```javascript
export interface ExecutionContext extends ArgumentsHost {
  getClass<T = any>(): Type<T>;
  getHandler(): Function;
}
```

getHandler() 方法返回对当前处理的处理程序的引用,而 getClass() 返回此特定处理程序所属的 Controller 类的类型。用另外的话来说,如果用户指向在 CatsController 中定义和注册的 create() 方法, getHandler() 将返回对 create() 方法的引用，在这种情况下, getClass() 将只返回一个 CatsController 的类型（不是实例）。


## 调用处理程序

第二个参数是 CallHandler。如果不手动调用 handle() 方法，则主处理程序根本不会进行求值。这是什么意思？基本上，CallHandler是一个包装执行流的对象，因此推迟了最终的处理程序执行。

比方说，有人提出了 POST /cats 请求。此请求指向在 CatsController 中定义的 create() 处理程序。如果在此过程中未调用拦截器的 handle() 方法，则 create() 方法不会被计算。只有 handle() 被调用（并且已返回值），最终方法才会被触发。为什么？因为Nest订阅了返回的流，并使用此流生成的值来为最终用户创建单个响应或多个响应。而且，handle() 返回一个 Observable，这意味着它为我们提供了一组非常强大的运算符，可以帮助我们进行例如响应操作。


## 截取切面

第一个用例是使用拦截器在函数执行之前或之后添加额外的逻辑。当我们要记录与应用程序的交互时，它很有用，例如 存储用户调用，异步调度事件或计算时间戳。作为一个例子，我们来创建一个简单的例子 LoggingInterceptor。

```javascript
// logging.interceptor.ts

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => console.log(`After... ${Date.now() - now}ms`)),
      );
  }
}

// 拦截器的作用与控制器，提供程序，守卫等相同，这意味着它们可以通过构造函数注入依赖项。
```

由于 handle() 返回一个RxJS Observable，我们有很多种操作符可以用来操作流。在上面的例子中，我们使用了 tap() 运算符，该运算符在可观察序列的正常或异常终止时调用函数。


## 绑定拦截器

为了设置拦截器, 我们使用从 @nestjs/common 包导入的 @UseInterceptors() 装饰器。与守卫一样, 拦截器可以是控制器范围内的, 方法范围内的或者全局范围内的。

```javascript
// cats.controller.ts

@UseInterceptors(LoggingInterceptor)
export class CatsController {}

// @UseInterceptors() 装饰器从 @nestjs/common 导入。
```

由此，CatsController 中定义的每个路由处理程序都将使用 LoggingInterceptor。当有人调用 GET /cats 端点时，您将在控制台窗口中看到以下输出：

```shell
Before...
After... 1ms
```

如上所述, 上面的构造将拦截器附加到此控制器声明的每个处理程序。如果我们决定只限制其中一个, 我们只需在方法级别设置拦截器。为了绑定全局拦截器, 我们使用 Nest 应用程序实例的 useGlobalInterceptors() 方法:

```javascript
const app = await NestFactory.create(ApplicationModule);
app.useGlobalInterceptors(new LoggingInterceptor());
```

全局拦截器用于整个应用程序、每个控制器和每个路由处理程序。在依赖注入方面, 从任何模块外部注册的全局拦截器 (如上面的示例中所示) 无法插入依赖项, 因为它们不属于任何模块。为了解决此问题, 您可以使用以下构造直接从任何模块设置一个拦截器:

```javascript
// app.module.ts

import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class ApplicationModule {}
```


## 响应映射

我们已经知道, handle() 返回一个 Observable。此流包含从路由处理程序返回的值, 因此我们可以使用 map() 运算符轻松地对其进行改变。

> 响应映射功能不适用于特定于库的响应策略（禁止直接使用 @Res() 对象）。

让我们创建一个 TransformInterceptor, 它将打包响应并将其分配给 data 属性。

```javascript
// transform.interceptor.ts

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(map(data => ({ data })));
  }
}

// Nest 拦截器就像使用异步 intercept() 方法的魅力一样, 意思是, 如果需要，您可以毫不费力地将方法切换为异步。
```

之后，当有人调用GET /cats端点时，请求将如下所示（我们假设路由处理程序返回一个空 arry []）：

```json
{
    "data": []
}
```

拦截器在创建用于整个应用程序的可重用解决方案时具有巨大的潜力。例如，我们假设我们需要将每个发生的 null 值转换为空字符串 ''。我们可以使用一行代码并将拦截器绑定为全局代码。由于这一点，它会被每个注册的处理程序自动重用。

```javascript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(map(value => value === null ? '' : value ));
  }
}
```


## 异常映射

另一个有趣的用例是利用 catchError() 操作符来覆盖抛出的异常：

```javascript
// exception.interceptor.ts

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  BadGatewayException,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        catchError(err => throwError(new BadGatewayException())),
      );
  }
}
```


## Stream 重写

有时我们可能希望完全阻止调用处理程序并返回不同的值 (例如, 由于性能问题而从缓存中获取), 这是有多种原因的。一个很好的例子是缓存拦截器，它将使用一些TTL存储缓存的响应。不幸的是, 这个功能需要更多的代码并且由于简化, 我们将仅提供简要解释主要概念的基本示例。

```javascript
// cache.interceptor.ts

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isCached = true;
    if (isCached) {
      return of([]);
    }
    return next.handle();
  }
}
```

这是一个 CacheInterceptor，带有硬编码的 isCached 变量和硬编码的响应 [] 。我们在这里通过 of 运算符创建并返回了一个新的流, 因此路由处理程序根本不会被调用。当有人调用使用 CacheInterceptor 的端点时, 响应 (一个硬编码的空数组) 将立即返回。为了创建一个通用解决方案, 您可以利用 Reflector 并创建自定义修饰符。反射器 Reflector 在守卫章节描述的很好。


## 更多操作者

返回流的可能性为我们提供了许多可能性。让我们考虑另一个常见的用例。假设您想处理 timeout 。当端点在一段时间后没有返回任何内容时, 我们希望得到错误响应。

```javascript
// timeout.interceptor.ts

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(timeout(5000))
  }
}
```

5秒后，请求处理将被取消。


---


# 自定义路由参数装饰器

Nest 是基于装饰器这种语言特性而创建的。它是许多常用编程语言中众所周知的概念，但在 JavaScript 世界中，这个概念仍然相对较新。所以为了更好地理解装饰器是如何工作的，你应该看看 这篇 文章。下面给出一个简单的定义：

ES2016 的装饰器是一个可以将目标对象，名称和属性描述符作为参数的返回函数的表达式。你可以通过装饰器前缀 @ 来使用它，并将其放置在您想要装饰的最顶端。装饰器可以被定义为一个类或是属性。

## 参数装饰器

Nest 提供了一组有用的参数装饰器，可以和 HTTP 路由处理器（route handlers）一起使用。

另外，你还可以创建自定义装饰器。为什么它很有用呢？

在 Node.js 的世界中，把属性值附加到 request 对象中是一种很常见的做法。然后你可以在任何时候在路由处理程器（route handlers）中手动取到它们，例如，使用下面这个构造：

```javascript
const user = req.user;
```

为了使其更具可读性和透明性，我们可以创建 @User() 装饰器并且在所有控制器中重复利用它。

```javascript
// user.decorator.ts

import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((data, req) => {
  return req.user;
});
```

现在你可以在任何你想要的地方很方便地使用它。


```javascript
@Get()
async findOne(@User() user: UserEntity) {
  console.log(user);
}
```


## 传递数据

当装饰器的行为取决于某些条件时，可以使用 data 参数将参数传递给装饰器的工厂函数。 一个用例是自定义装饰器，它通过键从请求对象中提取属性。 例如，假设我们的身份验证层验证请求并将用户实体附加到请求对象。 经过身份验证的请求的用户实体可能类似于：

```json
{
  "id": 101,
  "firstName": "Alan",
  "lastName": "Turing",
  "email": "alan@email.com",
  "roles": ["admin"]
}
```

让我们定义一个将属性名作为键的装饰器，如果存在则返回关联的值（如果不存在则返回未定义的值，或者如果尚未创建 user 对象，则返回未定义的值）。

```javascript
// user.decorator.ts

import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((data: string, req) => {
  return data ? req.user && req.user[data] : req.user;
});
```

然后，您可以通过控制器中的 @User() 装饰器访问以下特定属性：

```javascript
@Get()
async findOne(@User('firstName') firstName: string) {
  console.log(`Hello ${firstName}`);
}
```


## 使用管道

Nest 对待自定义的路由参数装饰器和这些内置的装饰器（@Body()，@Param() 和 @Query()）一样。这意味着管道也会因为自定义注释参数（在本例中为 user 参数）而被执行。此外，你还可以直接将管道应用到自定义装饰器上：

```javascript
@Get()
async findOne(@User(new ValidationPipe()) user: UserEntity) {
  console.log(user);
}
```