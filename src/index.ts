import http from "http";
import FireflyExtends from "./extends";
import {IFY} from './types'

export default class Firefly extends FireflyExtends {
    protected routes: IFY.Routers = {};
    protected middlewares: IFY.Middleware[] = [];

    use(middleware: IFY.Middleware) {
        this.middlewares.push(middleware);
    }

    router(router: IFY.Router) {
        const method = router.method.toUpperCase()
        const {path, handler} = router

        if (!this.routes[method]) this.routes[method] = {};
        this.routes[method][path] = handler
    }

    createServer(port: number, hostname: string = 'localhost', debug: boolean = false) {
        console.log(`Firefly State Debug: ${debug}`)

        // Exception Handler
        this._exceptionHandler()

        const server = http.createServer(this.requestListener.bind(this))

        server.listen(port, hostname, () => console.log(`Server listening on http://${hostname}:${port}`));
    }

    private requestListener(request: http.IncomingMessage, response: http.ServerResponse) {

        // Dispatch
        const _dispatch = this.dispatch(request, response)
        this.middlewares.length ? this.middlewares[0](request, response, _dispatch) : _dispatch()
    }
}

module.exports = Firefly