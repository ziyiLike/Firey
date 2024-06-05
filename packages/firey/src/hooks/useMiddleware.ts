import {IFY} from "../types";
import {useStore} from "./useStore";

export const useMiddleware = ({before, after}: IFY.MiddlewareProps): IFY.Middleware => {
    const state = useStore()
    return async (req, res, dispatch) => {
        if (before && !state.isReleaseResponse) {
            const response = await before(req, res)
            response && (state.releaseResponse = response)
        }
        if (!state.response) {
            await dispatch();
            if (after && !state.isReleaseResponse) {
                const response = await after(req, state.response)
                response && (state.releaseResponse = response)
            }
        }
    };
}