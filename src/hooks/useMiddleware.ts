import {IFY} from "../types";

export const useMiddleware = ({before, after}: IFY.MiddlewareProps): IFY.Middleware => {
    return (request, response, dispatch) => {
        before && before(request, response)
        const _response = dispatch();
        after && after(request, _response)
    };
}