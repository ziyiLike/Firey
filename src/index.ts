import http from "http";
import FireflyExtends from "./extends";
import {IFY} from './types'
import {InternalServerError} from "./exceptions";
import path from "path";

export default class Firefly extends FireflyExtends {
    protected routes: IFY.Routers = {};
    protected middlewares: IFY.Middleware[] = [];
    protected state: IFY.State = {};
    protected rootPath: string;

    constructor({rootPath}: IFY.FireflyProps) {
        super()
        this.rootPath = rootPath
    }

    use(middleware: IFY.Middleware) {
        this.middlewares.push(middleware);
    }

    router(router_: IFY.Router | IFY.IncludeRouter[]) {
        if (Array.isArray(router_)) {
            router_.forEach(parentRouter => {
                const routers = require(path.join(this.rootPath, parentRouter.appPath.replace(/[.]/g, path.sep), 'router')).default
                routers.forEach((childRouter: IFY.Router) => {
                    childRouter.path = parentRouter.path + childRouter.path
                    this.router(childRouter)
                })
            })
        } else {
            const method = router_.method.toUpperCase()
            const {path, handler} = router_

            if (!this.routes[method]) this.routes[method] = {};
            this.routes[method][path] = handler
        }
    }

    createServer(port: number, hostname: string = 'localhost', debug: boolean = false) {
        console.log(`Firefly Debug: ${debug}`)

        // Exception Handler
        this._exceptionHandler()

        const server = http.createServer(this.requestListener.bind(this))

        server.listen(port, hostname, () => console.log(`Server listening at http://${hostname}:${port}`));
    }

    private requestListener(req: http.IncomingMessage, res: http.ServerResponse) {
        // initRequest
        this.initRequest(req)

        // Dispatch
        const _dispatch = this.dispatch(req, res)

        // Execute Middleware and Dispatch with Exception Handler
        this._exceptionDispatchHandler(res, () => {
            this.middlewares.length ? this.middlewares[0](req, res, this.setState.bind(this), _dispatch) : _dispatch()

            if (!this.state.response) {
                throw new InternalServerError('No response')
            }
        })

        this.response(res, this.state.response!)
    }
}

module.exports = Firefly