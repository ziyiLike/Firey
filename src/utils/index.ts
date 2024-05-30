import * as packageHooksFn from './packageHooks'

export const useHooks = <T extends keyof typeof packageHooksFn, R extends any[]>(funcName: T, ...args: R) => Reflect.apply(packageHooksFn[funcName], null, args)