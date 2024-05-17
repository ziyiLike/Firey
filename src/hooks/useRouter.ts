import {IFY} from "../types";

export const useRouter = (method: IFY.HttpMethod, path: string, handler: IFY.Handler) => ({method, path, handler})