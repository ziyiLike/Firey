import {IFY} from "../types";

export const useMiddleware = ({before, after}: IFY.MiddlewareProps): IFY.Middleware => {
    return (req, res, setState, dispatch) => {
        if (before) {
            const response = before(req, res)
            response && setState({response})
        }
        const result = dispatch();
        if (after) {
            const response = after(req, result)
            response && setState({response})
        }
    };
}