import {defineConfig} from "firey/hooks-test";

export default defineConfig({
    logger: {
        level: 'INFO',
        appenders: {
            console: {type: 'console'},
            file: {
                type: 'file',
                filename: 'logs/firey.log',
                maxLogSize: 10485760,
                backups: 3
            }
        }
    }
})