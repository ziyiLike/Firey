import http from "http";
import {ContentType} from "../httpEnums/contentType";
import {BaseError, NotFoundError} from "../exceptions";
import StatusCode from "../httpEnums/statusCode";
import log4js from '../log'
import {IFY} from "../types";
import {Effects} from "./effects";
import {parseBodyMiddleware} from "../middlewares/parseBodyMiddleware";
import {parse} from "querystring";
import {useStore} from "../hooks/useStore";
import {useHooks} from "../utils";

const logger = log4js.getLogger();

export default class FireflyExtends extends Effects {
    protected routes?: any = []
    protected middlewares?: any = [];

    protected initRequest(req: http.IncomingMessage): IFY.Request {
        const state = useStore()
        state.response && (state.response = undefined)

        const method = req.method?.toUpperCase() as IFY.HttpMethod;
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
        const {method, path, fullPath} = request;
        res.on("finish", () => {
            logger.info(`- ${method} ${fullPath} ${res.statusCode}`);
        })

        let middlewareIndex = 0;

        const _dispatch = async () => {
            const state = useStore()
            let response = {} as IFY.Response;

            middlewareIndex++;
            if (middlewareIndex < this.middlewares.length) {
                await this.middlewares[middlewareIndex](request, res, _dispatch);
            } else {
                const {handler, params} = this.compilePath(method, path);
                response = await handler(request, ...params)
                state.waitResponse = response;
            }
            return response;
        };

        return _dispatch
    }

    protected _initValidation() {
        if (!Object.keys(this.routes).length) {
            throw new Error('routers is empty! Did you forget to install the router? please use `app.router()` to install it!')
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


    protected async _exceptionDispatchHandler(dispatch: () => Promise<void>) {
        try {
            return await dispatch();
        } catch (err) {
            const state = useStore()
            if (err instanceof BaseError && err.message !== 'No response') {
                state.releaseResponse = {
                    code: err.code!,
                    data: {message: err.message || err.name},
                    contentType: ContentType.APPLICATION_JSON
                }
            } else {
                console.error('Server Error:', err);
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
            console.log('【Firefly Error】:', err)
        })
    }

}

export {FireflyExtends}