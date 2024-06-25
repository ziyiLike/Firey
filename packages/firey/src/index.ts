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

    run(port: number = 3000, hostname: string = 'localhost', debug: boolean = true): any {

        const setIfUndefined = <T extends keyof IFY.RuntimeEnv>(key: T, value: IFY.RuntimeEnv[T]): any => {
            useRuntimeEnv(key) === undefined && useRuntimeEnv(key, value)
            return useRuntimeEnv(key)
        }

        const h = setIfUndefined('FIREY_HOSTNAME', hostname);
        const p = setIfUndefined('FIREY_PORT', port);
        const d = setIfUndefined('FIREY_DEBUG', debug);

        this.debug = d === 'true'
        useHooks('tagLog', `Debug : ${d}`)

        this._exceptionHandler()

        this._initValidation()

        this.initSetupMiddleware(this.use.bind(this))

        return new Promise((resolve: any, _) => {
            const server = http.createServer(this.requestListener.bind(this))
            server.listen(p, h, () => {
                if (h === 'localhost' || h === '127.0.0.1') {
                    useHooks('tagLog', `🚀 http://${h}:${p}`)
                } else if (h === '0.0.0.0') {
                    const interfaces = require('os').networkInterfaces()
                    useHooks('tagLog', 'Network server running on: ')
                    Object.keys(interfaces).forEach(key => {
                        const ip = interfaces[key].find((item: any) => item.family === 'IPv4')
                        ip && useHooks('tagLog', `🚀 http://${ip.address}:${p}`)
                    })
                } else {
                    useHooks('tagLog', `Server running on http://${h}:${p}`)
                }
                useHooks('tagLog', `(Press Ctrl+C to stop server)`)
                useHooks('tagLog', `Startup time: ${Date.now() - this.initTime}ms`)
                resolve()
            });
        })
    }

    exit() {
        process.exit(0)
    }

    private async requestListener(req: http.IncomingMessage, res: http.ServerResponse) {

        const request = this.initRequest(req, res)

        this._requestDataChunksHandler(req, request, async () => {
            const _dispatch = this.dispatch(request, res);

            await this._exceptionDispatchHandler(request, async () => {
                this.middlewares.length ? await this.middlewares[0](request, res, _dispatch) : await _dispatch();

                this.parseResponse(request);
            });

            this.response(request, res);
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