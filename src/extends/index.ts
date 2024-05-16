import http from "http";
import {ContentType} from "../httpEnums/contentType";
import {BaseError, NotFoundError} from "../exceptions";
import StatusCode from "../httpEnums/statusCode";
import log4js from '../log'
import {IFY} from "../types";
import {Effects} from "../exceptions/effects";

const logger = log4js.getLogger();

export default class FireflyExtends extends Effects {
    protected routes?: any
    protected middlewares?: any = [];
    protected state: IFY.State = {}

    protected setState(state: IFY.State) {
        this.state = {...this.state, ...state}
    }

    protected initRequest(req: http.IncomingMessage) {
        this.state.response && delete this.state.response
    }

    response(res: http.ServerResponse, response: IFY.Response) {
        res.writeHead(response.code, {'Content-Type': response.contentType});
        res.end(JSON.stringify(response.data));
    }

    protected dispatch(req: http.IncomingMessage, res: http.ServerResponse) {
        const method = req.method?.toUpperCase();
        const fullPath = req.url || '';
        const path = fullPath?.split('?')[0];

        res.on("finish", () => {
            logger.info(`- ${method} ${fullPath} ${res.statusCode}`);
        })

        // 构建Request对象
        const request = {
            ...req,
            query: this.splitQuery(fullPath),
        }

        // 处理中间件
        let middlewareIndex = 0;

        if (!method || !path) {
            throw new TypeError('{【Firefly Error】 method or path is empty')
        }

        if (!Object.keys(this.routes).length) {
            throw new TypeError('【Firefly Error】 routes is empty')
        }

        const _dispatch = () => {
            let response = {} as IFY.Response;
            console.log(this.routes)
            middlewareIndex++;
            if (middlewareIndex < this.middlewares.length) {
                this.middlewares[middlewareIndex](req, res, this.setState.bind(this), _dispatch);
            } else {
                const handler = this.routes[method][path];
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


    protected _exceptionDispatchHandler(res: http.ServerResponse, dispatch: () => void) {
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
            console.log('Server Process Error:', err)
        })
    }

    private splitQuery(path: string) {
        const queryObj = {} as any;
        const queryStr = path.split('?')[1];
        if (queryStr) {
            const queryArr = queryStr.split('&');
            queryArr.forEach((item: string) => {
                const [key, value] = item.split('=');
                queryObj[key] = value;
            })
        }
        return queryObj;
    }

}

export {FireflyExtends}