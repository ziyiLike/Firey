import http from "http";
import {BadRequestError, NotFoundError} from "./exceptions";

export default class Firefly {
    private routes: {
        [method: string]: { [path: string]: (req: http.IncomingMessage, res: http.ServerResponse) => void }
    } = {};
    private middlewares: Array<(req: http.IncomingMessage, res: http.ServerResponse, next: () => void) => void> = [];

    use(middleware: (req: http.IncomingMessage, res: http.ServerResponse, next: () => void) => void) {
        this.middlewares.push(middleware);
    }

    route(method: string, path: string, handler: (req: http.IncomingMessage, res: http.ServerResponse) => void) {
        if (!this.routes[method]) this.routes[method] = {};
        this.routes[method][path] = handler;
    }

    createServer(port: number, hostname: string = 'localhost') {
        const server = http.createServer(this.requestListener.bind(this))
        server.on('error', (err: Error) => {
            // TODO Exception Catch
        });
        server.listen(port, hostname, () => console.log(`Server listening on http://${hostname}:${port}`));
    }

    private requestListener(req: http.IncomingMessage, res: http.ServerResponse) {
        const method = req.method?.toUpperCase();
        const path = req.url;

        if (!method || !path) {
            throw new BadRequestError()
        }

        if (!Object.keys(this.routes).length) {
            throw new NotFoundError()
        }

        // 处理中间件
        let middlewareIndex = 0;
        const next = () => {
            middlewareIndex++;
            if (middlewareIndex < this.middlewares.length) {
                this.middlewares[middlewareIndex](req, res, next);
            } else {
                // 查找并执行路由处理
                const handler = this.routes[method][path];
                if (handler) {
                    handler(req, res);
                } else {
                    throw new NotFoundError()
                }
            }
        };
        this.middlewares[middlewareIndex](req, res, next);
    }
}

module.exports = Firefly