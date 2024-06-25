import {useRuntimeEnv} from 'firey/hooks-test'
import fs from 'fs';
import path from 'path';

useRuntimeEnv('FIREY_ROOT_PATH', path.resolve(__dirname, '../../'))

const getAllFiles = async (dirPath) => {
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

const install = async () => {
    try {
        const dirPath = 'migrate/models';
        const migrationsPath = 'migrate/migrations';
        const migrationsFiles = await getAllFiles(migrationsPath);
        const allFiles = await getAllFiles(dirPath);
        const savedMigrations = {
            date: new Date().toLocaleString(),
            isMigrate: false,
            models: {},
            changes: []
        }
        const OPERATE_TYPE = {
            ADD: 'ADD',
            REMOVE: 'REMOVE',
            ALERT: 'ALERT',
            RENAME: 'RENAME'
        }
        let maxNum = 0
        let isChanged = false

        if (migrationsFiles.length) {
            maxNum = Math.max(...migrationsFiles.map(filename => parseInt(filename.split('-')[1])))
            const migrationData = await Bun.file(migrationsPath + path.sep + `migrations-${maxNum}.json`, {type: 'application/json'}).json()

            for (const filePath of allFiles) {
                const models = require('../../' + filePath);
                for (const model in models) {
                    const deleteFields = []
                    if (migrationData.models[model]) {
                        if (JSON.stringify(migrationData.models[model]) !== JSON.stringify(models[model])) {
                            isChanged = true
                            for (const key in migrationData.models[model].fields) {
                                if (!models[model].fields[key]) {
                                    deleteFields.push({
                                        key,
                                        field: migrationData.models[model].fields[key]
                                    })
                                }
                            }
                            for (const key in models[model].fields) {
                                if (migrationData.models[model].fields[key]) {
                                    if (JSON.stringify(migrationData.models[model].fields[key]) !== JSON.stringify(models[model].fields[key])) {
                                        console.log(`- Alert ${model}.${key}`)
                                        savedMigrations.changes.push({
                                            model,
                                            key,
                                            type: OPERATE_TYPE.ALERT,
                                            field: models[model].fields[key]
                                        })
                                    }
                                } else {
                                    if (deleteFields.length) {
                                        for (const deleteField of deleteFields) {
                                            if (JSON.stringify(deleteField.field) === JSON.stringify(models[model].fields[key])) {
                                                console.write(`Did you rename ${model}.${deleteField.key} to ${model}.${key} (a ${deleteField.field.type} Field)? [y/n]`);
                                                for await (const line of console) {
                                                    if (line.toLowerCase() === 'y') {
                                                        savedMigrations.changes.push({
                                                            model,
                                                            key,
                                                            oldKey: deleteField.key,
                                                            type: OPERATE_TYPE.RENAME
                                                        })
                                                        deleteFields.splice(deleteFields.indexOf(deleteField), 1)
                                                        console.log(`- Rename ${model}.${deleteField.key} to ${model}.${key}`)
                                                    } else {
                                                        savedMigrations.changes.push({
                                                            model,
                                                            key,
                                                            type: OPERATE_TYPE.ADD,
                                                            field: models[model].fields[key]
                                                        })
                                                        console.log(`- Add ${model}.${key}`)
                                                    }
                                                    break
                                                }
                                            } else {
                                                savedMigrations.changes.push({
                                                    model,
                                                    key,
                                                    type: OPERATE_TYPE.ADD,
                                                    field: models[model].fields[key]
                                                })
                                                console.log(`- Add ${model}.${key}`)
                                            }
                                        }
                                    } else {
                                        savedMigrations.changes.push({
                                            model,
                                            key,
                                            type: OPERATE_TYPE.ADD,
                                            field: models[model].fields[key]
                                        })
                                        console.log(`- Add ${model}.${key}`)
                                    }
                                }
                            }
                        }
                        for (const deleteField of deleteFields) {
                            savedMigrations.changes.push({
                                model,
                                key: deleteField.key,
                                type: OPERATE_TYPE.DELETE
                            })
                            console.log(`- Delete ${model}.${deleteField.key}`)
                        }
                        savedMigrations.models[model] = models[model]
                    } else {
                        isChanged = true
                        console.log(`- Add model ${model}`)
                        savedMigrations.models[model] = models[model]
                    }
                }
            }
        } else {
            isChanged = true
            console.log('- Init all models')
            for (const filePath of allFiles) {
                const models = require('../../' + filePath);
                for (const model in models) {
                    console.log(`- Add model ${model}`)
                    savedMigrations.models[model] = models[model]
                }
            }
        }
        if (isChanged) {
            await Bun.write(migrationsPath + path.sep + `migrations-${maxNum + 1}.json`, JSON.stringify(savedMigrations, null, 2));
            console.log(`- Migration ${maxNum + 1} created`)
        } else {
            console.log('- No changes')
        }
    } catch (err) {
        console.error('Read directory error:', err);
    }
};


install().then(() => process.exit(0))
