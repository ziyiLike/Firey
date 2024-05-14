import http from "http";

export namespace IFY {

    interface Routers {
        [method: string]: { [path: string]: Handler }
    }

    type Middleware = (req: http.IncomingMessage, res: http.ServerResponse, dispatch: () => any) => void

    type BaseHandler = (req: http.IncomingMessage, res: http.ServerResponse) => any

    type Handler = (request: Request) => any

    type Response = {
        data: any;
        code: number;
        contentType: string;
    } & Record<string, any>

    type BaseRequest<T> = http.IncomingMessage & T

    type Request = BaseRequest<{
        query: Record<string, any>,
    }>

    type BaseRouter<T> = {
        method: string;
        path: string;
        handler: Handler;
    } & T

    type Router = BaseRouter<{
        middleware?: Middleware;
    }>

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
}

