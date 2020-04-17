[title]: # (NestJS)
[date]: # (2020-01-25 &nbsp; 19:22:05)
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