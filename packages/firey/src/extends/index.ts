import http from "http";
import ContentType from "../httpEnums/contentType";
import {BaseError, InternalServerError, NotFoundError, ResponseError} from "../exceptions";
import StatusCode from "../httpEnums/statusCode";
import log4js from "log4js";
import {IFY} from "../types";
import {Effects} from "./effects";
import {parseBodyMiddleware} from "../middlewares/parseBodyMiddleware";
import {parse} from "querystring";
import {useStore} from "../hooks";

export default class FireyExtends extends Effects {
    protected initTime: number = Date.now();
    protected debug: boolean = true;
    protected rootPath: string = '';
    protected routes?: any = []
    protected middlewares?: any = [];
    protected logger: log4js.Logger = log4js.getLogger()

    response(request: IFY.Request, res: http.ServerResponse) {
        const response = request.__state.response;
        res.writeHead(response!.code, {'Content-Type': response!.contentType});
        res.end(response!.contentType === ContentType.APPLICATION_JSON ? JSON.stringify(response!.data) : response!.data);
    }

    protected parseResponse(request: IFY.Request) {
        const response = request.__state.response;

        if (!response) {
            throw new InternalServerError('No response');
        }

        if (!response?.code || !response?.contentType || !response?.data) {
            const tipsText = !response?.code ? 'status code' : !response?.contentType ? 'content type' : 'data';
            throw new ResponseError(`Unable to find ${tipsText} in the response! Have you missed setting` +
                'the status code? Please use `useResponse()` to rectify this issue.')
        }
    }

    protected initRequest(req: http.IncomingMessage, res: http.ServerResponse): IFY.Request {
        const __startTime = Date.now()
        const state = useStore()
        state.response && (state.response = undefined)

        const method = req.method?.toUpperCase() as IFY.HttpMethod;
        const fullPath = req.url || '';
        const [path, queryString] = [fullPath?.split('?')[0], fullPath?.split('?')[1]];

        res.on("finish", () => {
            this.logger.info(`${req.socket.remoteAddress || 'UnknownIP'} ${method} ${fullPath} ${res.statusCode} ${Date.now() - __startTime}ms`);
        })

        // 构建Request对象
        return Object.assign(req, {
            method,
            fullPath,
            path,
            query: parse(queryString),
            data: {},
            body: {
                __chunksData: ''
            },
            __state: state,
            __startTime
        })

    }

    protected initSetupMiddleware(use: IFY.Use) {
        use(parseBodyMiddleware);
    }

    protected convertPathToRegex(pathWithParams: string) {
        const dynamicParamPattern = /<(\w+):([\w|,]+)(:\?)?>/g;
        let convertedPath = pathWithParams;
        let params: Record<string, any>[] = [];

        convertedPath = convertedPath.replace(dynamicParamPattern, (match, paramName, paramTypes, optionalMarker) => {
            const types = paramTypes.split('|');
            params.push({paramName, types});
            const typeRegexes = types.map((type: any) => {
                switch (type) {
                    case 'string':
                        return '.*';
                    case 'number':
                        return '[0-9]+';
                    case 'boolean':
                        return 'true|false';
                    default:
                        throw new Error(`Your path:${pathWithParams} unsupported parameter type: ${type}`);
                }
            });

            const combinedRegex = `(?:(${typeRegexes.join('|')}))`;

            return optionalMarker === ':?' ? `[${combinedRegex}]+?` : `${combinedRegex}`;
        });

        convertedPath = `^${convertedPath}$`;

        return {convertedPath, params};
    }

    protected compilePath(method: IFY.HttpMethod, path: string) {
        let paramsList: any[] = [];
        if (!this.routes[method]) {
            this.routes[method] = {};
        }
        const prePath = Object.keys(this.routes[method]).find((regexPath) => {
            const pattern = new RegExp(regexPath);
            if (pattern.test(path)) {
                path.match(pattern)?.forEach((match, index) => {
                    if (index > 0) {
                        paramsList.push(match);
                    }
                })
                return true;
            }
        })

        if (!prePath) {
            throw new NotFoundError()
        }
        const {handler, params} = this.routes[method!][prePath];

        // parse params only when params length is 1
        params.forEach((param: { types: any[]; }, index: number) => {
            if (param.types.length === 1) {
                if (param.types[0] === 'number') {
                    paramsList[index] = Number(paramsList[index])
                }
                if (param.types[0] === 'boolean') {
                    paramsList[index] = paramsList[index] === 'true'
                }
            }
        })
        return {handler, params: paramsList}
    }

    protected dispatch(request: IFY.Request, res: http.ServerResponse) {
        const {method, path} = request;

        let middlewareIndex = 0;

        const _dispatch = async () => {
            const state = request.__state
            let response = {} as IFY.Response;

            middlewareIndex++;
            if (middlewareIndex < this.middlewares.length) {
                await this.middlewares[middlewareIndex](request, res, _dispatch);
            } else {
                const {handler, params} = this.compilePath(method, path);
                response = await handler(request, ...params)
                response && (state.waitResponse = response);
            }
            return response;
        };

        return _dispatch
    }

    protected _initValidation() {
        if (!Object.keys(this.routes).length) {
            throw new Error('The router collection is empty! Have you forgotten to install the routers? Please use `app.router()` to initialize them.')
        }
    }

    protected _requestDataChunksHandler(req: http.IncomingMessage, request: IFY.Request, handler: () => void) {
        let __chunksData: any[] = [];
        req.on('data', (chunk) => {
            __chunksData.push(chunk)
        });
        req.on('end', () => {
            request.body.__chunksData = Buffer.concat(__chunksData).toString('binary')
            handler()
        })
    }

    protected async _exceptionDispatchHandler(request: IFY.Request, dispatch: () => Promise<void>) {
        try {
            return await dispatch();
        } catch (err) {
            const state = request.__state
            if (err instanceof BaseError && err.message !== 'No response') {
                if (err.code === StatusCode.INTERNAL_SERVER_ERROR) {
                    this.logger.error(err)
                }
                state.releaseResponse = {
                    code: err.code!,
                    data: {message: this.debug ? err.message || err.name : err.name},
                    contentType: ContentType.APPLICATION_JSON
                }
            } else {
                this.logger.error(err)
                state.releaseResponse = {
                    code: StatusCode.INTERNAL_SERVER_ERROR,
                    data: 'Internal Server Error',
                    contentType: ContentType.TEXT_PLAIN
                }
            }
        }
    }

    protected _exceptionHandler() {
        process.on('uncaughtException', (err: Error) => {
            this.logger.error(err)
        })
    }
}

export {FireyExtends}