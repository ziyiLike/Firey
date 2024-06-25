import http from "http";
import {Appender, Configuration} from "log4js";
import {PoolOptions} from 'mysql2'
import {StoreType} from "../hooks/useStore";

export namespace IFY {

    type Config = {
        logger?: ConfigLogger,
        database: Record<string, PoolOptions>
    }

    interface RuntimeEnv {
        FIREY_NODE_ENV: string
        FIREY_PORT: number
        FIREY_HOSTNAME: string
        FIREY_DEBUG: boolean
        FIREY_ROOT_PATH: string
    }

    interface ConfigLogger {
        config?: Configuration
        level?: string
        appenders?: { [name: string]: Appender }
        categories?: { [name: string]: { appenders: string[], level: string } }
    }

    type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD" | "CONNECT" | "TRACE" | string

    type State = StoreType

    type ResponseStatus = 'Wait' | 'Release'

    interface StoreDefinition<State, Actions> {
        state: () => State;
        getters?: { [key: string]: (state: State) => any };
        actions?: {
            [key in keyof Actions]: (context: {
                state: State
            }, ...args: Actions[key] extends ((...args: infer P) => any) ? P : never[]) => void
        };
    }

    type SetState = (state: State) => void

    type Use = (middleware: Middleware) => void

    interface Routers {
        [method: string]: { [path: string]: Handler }
    }

    type Middleware = (req: Request, res: http.ServerResponse, dispatch: () => any) => void

    type Handler = (request: Request, ...args: any[]) => any

    type Response = {
        data: any
        code: number
        contentType: string
        __status?: ResponseStatus
    } & Record<string, any>

    type BaseRequest<T> = http.IncomingMessage & T

    type Request = BaseRequest<{
        method: HttpMethod
        fullPath: string
        path: string
        query: Record<string, any>
        data: any
        body: RequestBody
        __state: State
        __startTime: number
    }>

    type RequestBody = {
        __chunksData: string
    }

    type BaseRouter<T> = {
        method: HttpMethod | HttpMethod[]
        path: string
        handler: Handler
    } & T

    type Router = BaseRouter<{
        middleware?: Middleware
    }>

    type IncludeRouter = {
        path: string
        appPath: string
    }

    type MiddlewareProps = {
        before: (req: Request, res: http.ServerResponse) => any
        after: (req: Request, res: Response | undefined) => any
    }

    interface ErrorState extends Partial<{
        request: http.IncomingMessage
        response: http.ServerResponse
        contentType: string
    }> {
    }

    interface File {
        key: string
        name: string
        content: string | undefined
    }
}

