import http from "http";
import FireyExtends from "./extends";
import {IFY} from './types'
import path from "path";
import {useHooks} from "./utils";
import {useLogger, useRuntimeEnv} from "./hooks";

export default class Firey extends FireyExtends {

    constructor(rootPath?: string) {
        super()
        this.rootPath = rootPath || ''
        useRuntimeEnv('FIREY_ROOT_PATH', rootPath)

        this.logger = useLogger()
    }

    use(middleware: IFY.Middleware) {
        this.middlewares.push(middleware);
    }

    router(router_: IFY.Router | IFY.IncludeRouter[]) {
        if (Array.isArray(router_)) {
            if (!this.rootPath) {
                throw Error('rootPath is empty! Do you forget to set rootPath? Please use \`' +
                    'const app = new Firey(__dirname)` instead of `const app = new Firey()` !')
            }
            router_.forEach(parentRouter => {
                const _preImportRouters = require(path.join(this.rootPath, parentRouter.appPath.replace(/[.]/g, path.sep), 'router'))
                const routers = _preImportRouters.default || _preImportRouters
                routers.forEach((childRouter: IFY.Router) => {
                    childRouter.path = parentRouter.path + childRouter.path
                    this.router(childRouter)
                })
            })
        } else {
            const {method, path, handler} = router_
            const {convertedPath, params} = this.convertPathToRegex(path)

            const __registerRouter = (m: string) => {
                const Im = m.toUpperCase()
                if (!this.routes[Im]) this.routes[Im] = {};
                this.routes[Im][convertedPath] = {handler, params}
            }

            Array.isArray(method) ? method.forEach(m => __registerRouter(m)) : __registerRouter(method)
        }
    }

    run(port: number, hostname: string = 'localhost', debug: boolean = false) {
        useHooks('tagLog', `Debug : ${debug}`)
        useRuntimeEnv('FIREY_HOSTNAME', hostname)
        useRuntimeEnv('FIREY_DEBUG', debug)
        useRuntimeEnv('FIREY_PORT', port)

        // Exception Handler
        this._exceptionHandler()

        // Init Validation
        this._initValidation()

        // Install Setup Middleware
        this.initSetupMiddleware(this.use.bind(this))

        const server = http.createServer(this.requestListener.bind(this))

        server.listen(port, hostname, () => {
            if (hostname === 'localhost' || hostname === '127.0.0.1') {
                useHooks('tagLog', `Localhost server running on http://${hostname}:${port}`)
            } else if (hostname === '0.0.0.0') {
                // Get Network Interface
                const interfaces = require('os').networkInterfaces()
                useHooks('tagLog', 'Network server running on: ')
                Object.keys(interfaces).forEach(key => {
                    const ip = interfaces[key].find((item: any) => item.family === 'IPv4')
                    ip && useHooks('tagLog', `🚀 http://${ip.address}:${port}`)
                })
            } else {
                useHooks('tagLog', `Server running on http://${hostname}:${port}`)
            }
            useHooks('tagLog', `(Press Ctrl+C to stop server)`)
        });
    }

    private async requestListener(req: http.IncomingMessage, res: http.ServerResponse) {
        // Init Request
        const request = this.initRequest(req)

        // Request Data Chunks Handler
        this._requestDataChunksHandler(req, request, async () => {
            const _dispatch = this.dispatch(request, res);

            // Execute Middleware and Dispatch with Exception Handler
            await this._exceptionDispatchHandler(async () => {
                this.middlewares.length ? await this.middlewares[0](request, res, _dispatch) : await _dispatch();

                this.parseResponse();
            });

            this.response(res);
        })
    }
}

// TODO: Router Decorator
export function router(target: Firey, path: string, method: IFY.HttpMethod) {
    return (target_: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const router: IFY.Router = {
            path,
            method,
            handler: descriptor.value
        }
        Reflect.apply(target.router, target, [router])
    }
}