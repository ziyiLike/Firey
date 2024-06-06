import {IFY} from "../types";
import path from "path";

export const useConfig = <T extends keyof IFY.Config>(key: T) => {
    if (!process.env.FIREY_ROOT_PATH) return {}

    const settingPath = path.join(process.env.FIREY_ROOT_PATH, 'config')
    try {
        const config = require(settingPath).default || require(settingPath)
        return config[key] || {}
    } catch (e) {
        return {}
    }
}