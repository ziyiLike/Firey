import {defineConfig} from "firey/hooks-test";

export default defineConfig({
    logger: {
        level: 'INFO',
        appenders: {
            console: {
                type: 'console',
                layout: {
                    type: 'colored',
                    pattern: '%d{yyyy-MMdd hh:mm:ss} %[[%p]%] %m'
                }
            },
            file: {
                type: 'file',
                filename: 'logs/firey.log',
                maxLogSize: 10485760,
                backups: 3
            }
        }
    },
    database: {
        default: {
            type: 'mysql',
            host: '127.0.0.1', // 例如 'localhost'
            port: 3306,
            user: 'root',
            password: '123456',
            database: 'firey' // 如果有特定数据库
        },
        test: {
            type: 'mysql',
            host: '127.0.0.1',
            port: 3307,
            user: 'root',
            password: '123456',
            database: 'firey'
        }
    }
})