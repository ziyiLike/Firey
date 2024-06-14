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
            database: 'firey', // 如果有特定数据库
            waitForConnections: true, // 当没有连接可用时，请求将会等待而不是立即抛出错误
            connectionLimit: 10, // 连接池的最大连接数量
            queueLimit: 0, // 连接池队列的最大长度，0表示无限制
        },
        test: {
            type: 'mysql',
            host: '127.0.0.1', // 例如 'localhost'
            user: 'root',
            password: '123456',
            database: 'firey', // 如果有特定数据库
            waitForConnections: true, // 当没有连接可用时，请求将会等待而不是立即抛出错误
            connectionLimit: 10, // 连接池的最大连接数量
            queueLimit: 0, // 连接池队列的最大长度，0表示无限制
        }
    }
})