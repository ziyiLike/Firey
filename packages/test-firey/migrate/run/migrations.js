import {useRuntimeEnv, useAsyncGetFiles} from 'firey/hooks-test'
import path from 'path';
import {createInterface} from 'readline/promises'
import OPERATE_TYPE from "firey/enums-test/OPERATE_TYPE";

useRuntimeEnv('FIREY_ROOT_PATH', path.resolve(__dirname, '../../'))

const rl = createInterface({input: process.stdin, output: process.stdout})

const inputMessage = async (key, models, model, deleteFields, deleteField, savedMigrations) => {
    const line = await rl.question(`Did you rename ${model}.${deleteField.key} to ${model}.${key} (a ${deleteField.field.type} Field)? [y/n]`)
    if (line.toLowerCase() !== 'n') {
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
}

const install = async () => {
    try {
        const dirPath = 'migrate/models';
        const migrationsPath = 'migrate/migrations';
        const migrationsFiles = await useAsyncGetFiles(migrationsPath);
        const allFiles = await useAsyncGetFiles(dirPath);
        const savedMigrations = {
            date: new Date().toLocaleString(),
            isMigrate: false,
            models: {},
            changes: []
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
                        if (migrationData.models[model].name !== models[model].name) {
                            savedMigrations.changes.unshift({
                                model,
                                type: OPERATE_TYPE.TABLENAME,
                                oldName: migrationData.models[model].name,
                                name: models[model].name
                            })
                        }
                        if (JSON.stringify(migrationData.models[model]) !== JSON.stringify(models[model])) {
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
                                        savedMigrations.changes.push({
                                            model,
                                            key,
                                            type: OPERATE_TYPE.ALERT,
                                            field: models[model].fields[key]
                                        })
                                        console.log(`- Alert ${model}.${key}`)
                                    }
                                } else {
                                    let isUpdate = false
                                    if (deleteFields.length) {
                                        for (const deleteField of deleteFields) {
                                            if (JSON.stringify(deleteField.field) === JSON.stringify(models[model].fields[key]) && !isUpdate) {
                                                isUpdate = true
                                                await inputMessage(key, models, model, deleteFields, deleteField, savedMigrations)
                                            }
                                        }
                                        if (!isUpdate) {
                                            savedMigrations.changes.push({
                                                model,
                                                key,
                                                type: OPERATE_TYPE.ADD,
                                                field: models[model].fields[key]
                                            })
                                            console.log(`- Add ${model}.${key}`)
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
                                type: OPERATE_TYPE.REMOVE
                            })
                            console.log(`- Delete ${model}.${deleteField.key}`)
                        }
                        savedMigrations.changes.length && (isChanged = true)
                        savedMigrations.models[model] = models[model]
                    } else {
                        isChanged = true
                        savedMigrations.models[model] = models[model]
                        savedMigrations.changes.push({
                            model,
                            type: OPERATE_TYPE.INIT
                        })
                        console.log(`- Add model ${model}`)
                    }
                }
            }
        } else {
            isChanged = true
            console.log('You have no migrations, Initialize your models first.')
            for (const filePath of allFiles) {
                const models = require('../../' + filePath);
                for (const model in models) {
                    savedMigrations.models[model] = models[model]
                    savedMigrations.changes.push({
                        model,
                        type: OPERATE_TYPE.INIT
                    })
                    console.log(`- Add model ${model}`)
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


install().then(() => {
    rl.close();
    process.exit(0)
})
