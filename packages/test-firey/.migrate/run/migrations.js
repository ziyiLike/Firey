import {useRuntimeEnv} from 'firey/hooks-test'

useRuntimeEnv('FIREY_ROOT_PATH', path.resolve(__dirname, '../../'))

console.log(useRuntimeEnv('FIREY_ROOT_PATH'), 1111)

import fs from 'fs';
import path from 'path';


async function getAllFiles(dirPath) {
    const files = await fs.promises.readdir(dirPath);
    let filePaths = [];

    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = await fs.promises.stat(filePath);

        if (stats.isDirectory()) {
            filePaths = filePaths.concat(await getAllFiles(filePath));
        } else {
            filePaths.push(filePath);
        }
    }

    return filePaths;
}


(async () => {
    try {
        const dirPath = '.migrate/models';
        const allFiles = await getAllFiles(dirPath);
        for (const filePath of allFiles) {
            const models = require('../../' + filePath);
            for (const model in models) {
                console.log(model, models[model])
            }
        }
    } catch (err) {
        console.error('Read directory error:', err);
    }
})();

const {useConnectPool} = require('firey/hooks-test')

const connect = await useConnectPool()

console.log(await connect('select 1'))

process.exit(0)