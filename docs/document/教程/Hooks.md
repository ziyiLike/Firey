# Hooks

`Firey` 提供了一系列的 `Hooks` 来帮助开发者更加高效的开发。

## Import

所有 `Hooks` 均通过以下方式引入。

```ts
import { hook } from "firey/hooks";
```

## `defineConfig`

`defineConfig` 用于定义配置文件，`Firey` 会自动读取配置app统计目录下的`config.ts`文件并注入到 `app` 实例中。

- `config.ts`

```ts
export default defineConfig({
    logger: {}
})
```

## `useConfig`

`useConfig` 用于获取配置文件中的配置。

```ts
const logger = useConfig('logger'); // 获取logger配置
```

- Type Declarations

```ts
/**
 * @param key config key
 * @returns config value
 */
export declare function useConfig<T extends keyof IFY.Config>(key: T): IFY.Config[T];
```

## `useIncludeRouter`

`useIncludeRouter` 用于连接子路由`router.ts`文件。

```ts
app.router([
    useIncludeRouter('/system', 'apps.system'),
    useIncludeRouter('/business', 'apps.business')
])
```

- Type Declarations

```ts
/**
 * @param path router path
 * @param rootPath router root path
 * @returns router
 */
export declare function useIncludeRouter(path: string, rootPath: string): IFY.IncludeRouter;
```

## `useLogger`

`useLogger` 用于获取日志实例。

```ts
const logger = useLogger();

logger.info('This is a info log');
```

- Type Declarations

```ts
/**
 * @param logger logger name
 * @returns logger
 */
export declare const useLogger: (logger?: string) => log4js.Logger;

```

## `useMiddleware`

`useMiddleware` 用于注册中间件。

```ts
const TestMiddleware = useMiddleware({
    before: async (req, res) => {
        console.log('before handle');
    },
    after: async (req, res) => {
        console.log('after handle');
    }
})

app.use(TestMiddleware);
```

- Type Declarations

```ts
/**
 * @param middleware middleware
 * @returns middleware
 */
export declare const useMiddleware: ({before, after}: IFY.MiddlewareProps) => IFY.Middleware;
```

## `useResponse`

`useResponse` 用于处理响应。

```ts
const user = async () => useResponse({'message': 'success'});
const user = async () => useJsonResponse({'message': 'success'});
const user = async () => useHtmlResponse('<h1>hello firey</h1>');
const user = async () => useTextResponse('hello firey');
const user = async () => useFileResponse(blob);


```

- Type Declarations

```ts
export declare const useResponse: (data: any, code?: number, contentType?: string) => IFY.Response;
export declare const useJsonResponse: (data: any, code?: number) => IFY.Response;
export declare const useHtmlResponse: (data: any, code?: number) => IFY.Response;
export declare const useTextResponse: (data: any, code?: number) => IFY.Response;
export declare const useFileResponse: (data: any, code?: number) => IFY.Response;
```

## `useRouter`

`useRouter` 用于注册路由。

```ts
import * as api from './api'

export default useRouter([
    {method: 'GET', path: '/test', handler: api.testApi},
    {method: 'GET', path: '/test2', handler: api.testApi2}
])
```

- Type Declarations

```ts
/**
 * @param routers routers
 * @returns router
 */
export declare const useRouter: (routers: IFY.Router[]) => IFY.Router;
```

## `useRuntimeEnv`

`useRuntimeEnv` 用于获取或设置运行时环境变量。

```ts
// get
const env = useRuntimeEnv('NODE_ENV');

// set
useRuntimeEnv('NODE_ENV', 'production');
```

- Type Declarations

```ts
/**
 * @param key env key
 * @param value env value
 * @returns env value
 */
export declare const useRuntimeEnv: <T extends keyof IFY.RuntimeEnv>(KEY: T, VALUE?: IFY.RuntimeEnv[T]) => IFY.RuntimeEnv[T] | undefined;
```

## `useSetupMiddleware`

用于注册原始中间件。

```ts
const TestMiddleware = useSetupMiddleware((req, res, next) => {
    const start = Date.now();
    next();
    console.log('Time:', Date.now() - start, 'ms');
})
```

- Type Declarations

```ts
/**
 * @param middleware middleware
 * @returns middleware
 */
export declare const useSetupMiddleware: (fn: IFY.Middleware) => IFY.Middleware;

```

## `useStore`

`useStore` 用于获取或设置全局状态。

```ts
const state = useStore();
```

- Type Declarations

```ts
/**
 * @returns store
 */
declare class Store {
    private static instance;
    private data;

    private constructor();

    get response(): IFY.Response | undefined;
    set response(response: IFY.Response | undefined);

    get isWaitResponse(): boolean;

    set waitResponse(response: IFY.Response | undefined);

    get isReleaseResponse(): boolean;

    set releaseResponse(response: IFY.Response | undefined);

    static getInstance(): Store;
}

export declare const useStore: typeof Store.getInstance;
```

