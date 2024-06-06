import log4js from "log4js";
import {useConfig} from "./useConfig";

export const useLogger = (logger: string = 'default'): log4js.Logger => {
    const logConfig = useConfig('logger');
    if (logConfig.config) {
        log4js.configure(logConfig.config);
    } else {
        const appenders = logConfig.appenders || {
            default: {
                type: 'console',
            }
        }
        const categories = logConfig.categories || {
            default: {
                appenders: Object.keys(appenders), level: logConfig.level || 'INFO'
            }
        }
        log4js.configure({
            appenders,
            categories
        });
    }
    return log4js.getLogger(logger)
}