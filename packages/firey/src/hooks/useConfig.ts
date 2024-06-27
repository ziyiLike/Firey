import {IFY} from "../types";
import path from "path";
import {useRuntimeEnv} from "./useRuntimeEnv";
import {useDeepClone} from "./useDeepClone";

export const useConfig = <T extends keyof IFY.Config>(key: T) => {
    if (!useRuntimeEnv('FIREY_ROOT_PATH')) return {}

    const settingPath = path.join(useRuntimeEnv('FIREY_ROOT_PATH')!, 'config')
    try {
        const config = require(settingPath).default || require(settingPath)
        return useDeepClone(config[key]) || {}
    } catch (e) {
        return {}
    }
}