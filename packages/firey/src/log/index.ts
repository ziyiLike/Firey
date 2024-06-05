import log4js from "log4js";

log4js.configure({
    appenders: {
        out: {
            type: 'stdout',
            layout: {type: 'pattern', pattern: '%d{yyyy-MM-dd hh:mm:ss.SSS} %p %c %m'}
        }
    },
    categories: {default: {appenders: ['out'], level: 'info'}},
});

export const logger = log4js
export default logger
