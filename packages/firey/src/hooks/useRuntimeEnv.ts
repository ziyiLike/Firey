import {IFY} from "../types";

export const useRuntimeEnv = <T extends keyof IFY.RuntimeEnv>(KEY: T, VALUE?: IFY.RuntimeEnv[T]): IFY.RuntimeEnv[T] | undefined => {
    if (VALUE) {
        Reflect.set(process.env, KEY, VALUE)
        return undefined
    } else {
        return Reflect.get(process.env, KEY) as IFY.RuntimeEnv[T] | undefined
    }
}