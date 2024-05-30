import http from "http";

export namespace IFY {

    type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD" | "CONNECT" | "TRACE"

    interface FireflyProps {
        rootPath: string;
    }

    type State = Partial<{
        response: Response;
    }>

    type SetState = (state: State) => void

    type Use = (middleware: Middleware) => void

    interface Routers {
        [method: string]: { [path: string]: Handler }
    }

    type Middleware = (req: Request, res: http.ServerResponse, setState: SetState, dispatch: () => any) => void

    type BaseHandler = (req: Request, res: http.ServerResponse) => any

    type Handler = (request: Request) => any

    type Response = {
        data: any;
        code: number;
        contentType: string;
    } & Record<string, any>

    type BaseRequest<T> = http.IncomingMessage & T

    type Request = BaseRequest<{
        fullPath: string;
        path: string;
        query: Record<string, any>,
        data: any;
        body: RequestBody
    }>

    type RequestBody = {
        __chunksData: string;
    }

    type BaseRouter<T> = {
        method: string;
        path: string;
        handler: Handler;
    } & T

    type Router = BaseRouter<{
        middleware?: Middleware;
    }>

    type IncludeRouter = {
        path: string;
        appPath: string;
    }

    type MiddlewareProps = {
        before: BaseHandler;
        after: BaseHandler;
    }

    interface ErrorState extends Partial<{
        request: http.IncomingMessage;
        response: http.ServerResponse;
        contentType: string;
    }> {
    }

    interface File {
        key: string;
        name: string;
        content: string | undefined;
    }
}

