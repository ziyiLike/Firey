import http from "http";
import {ContentType} from "../httpEnums/contentType";
import {BaseError, NotFoundError} from "../exceptions";
import StatusCode from "../httpEnums/statusCode";
import log4js from '../log'
import {IFY} from "../types";
import {Effects} from "../exceptions/effects";
import {parseBodyMiddleware} from "../middlewares/parseBodyMiddleware";
import {parse} from "querystring";

const logger = log4js.getLogger();

export default class FireflyExtends extends Effects {
    protected routes?: any = []
    protected middlewares?: any = [];
    protected state: IFY.State = {}

    protected setState(state: IFY.State) {
        this.state = {...this.state, ...state}
    }

    protected initRequest(req: http.IncomingMessage): IFY.Request {
        this.state.response && delete this.state.response

        const method = req.method?.toUpperCase();
        const fullPath = req.url || '';
        const [path, queryString] = [fullPath?.split('?')[0], fullPath?.split('?')[1]];

        // 构建Request对象
        return Object.assign(req, {
            method,
            fullPath,
            path,
            query: parse(queryString),
            data: {},
            body: {
                __chunksData: ''
            }
        })

    }

    protected initSetupMiddleware(use: IFY.Use) {
        use(parseBodyMiddleware);
    }

    response(res: http.ServerResponse, response: IFY.Response) {
        res.writeHead(response.code, {'Content-Type': response.contentType});
        res.end(JSON.stringify(response.data));
    }

    protected dispatch(request: IFY.Request, res: http.ServerResponse) {
        const {method, path, fullPath} = request;
        res.on("finish", () => {
            logger.info(`- ${method} ${fullPath} ${res.statusCode}`);
        })

        let middlewareIndex = 0;

        const _dispatch = () => {
            let response = {} as IFY.Response;

            middlewareIndex++;
            if (middlewareIndex < this.middlewares.length) {
                this.middlewares[middlewareIndex](request, res, this.setState.bind(this), _dispatch);
            } else {
                const handler = this.routes[method!][path];
                if (handler) {
                    response = handler(request);
                    response && this.setState({response})
                } else {
                    throw new NotFoundError()
                }
            }
            return response;
        };

        return _dispatch
    }

    protected _initValidation() {
        if (!Object.keys(this.routes).length) {
            throw new TypeError('routers is empty! Did you forget to install the router? please use `app.router()` to install it!')
        }
    }

    protected _requestDataChunksHandler(req: http.IncomingMessage, request: IFY.Request, handler: () => void) {
        let __chunksData = '';
        req.on('data', (chunk) => {
            __chunksData += chunk.toString();
        });
        req.on('end', () => {
            request.body.__chunksData = __chunksData
            handler()
        })
    }


    protected _exceptionDispatchHandler(dispatch: () => void) {
        try {
            return dispatch();
        } catch (err) {
            if (err instanceof BaseError && err.message !== 'No response') {
                this.setState({
                    response: {
                        code: err.code!,
                        data: {message: err.message || err.name},
                        contentType: ContentType.APPLICATION_JSON
                    }
                })
            } else {
                console.error('Server Error:', err);
                this.setState({
                    response: {
                        code: StatusCode.INTERNAL_SERVER_ERROR,
                        data: 'Internal Server Error',
                        contentType: ContentType.TEXT_PLAIN
                    }
                });
            }
        }
    }

    protected _exceptionHandler() {
        process.on('uncaughtException', (err: Error) => {
            console.log('【Firefly Error】:', err)
        })
    }

}

export {FireflyExtends}