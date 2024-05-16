import {IFY} from "../types";
import {Dispatcher} from "undici-types";
import HttpMethod = Dispatcher.HttpMethod;

export const useRouter = (method: HttpMethod, path: string, handler: IFY.Handler) => ({method, path, handler})