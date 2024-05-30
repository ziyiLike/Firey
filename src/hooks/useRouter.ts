import {IFY} from "../types";

export const useRouter = (router: {
    method: IFY.HttpMethod,
    path: string,
    handler: IFY.Handler
}[]) => (router)