import {useRuntimeEnv, useAsyncGetFiles, useDeepClone} from 'firey/hooks-test'
import path from 'path';
import {createInterface} from 'readline/promises'
import OPERATE_TYPE from "firey/enums-test/OPERATE_TYPE";
import fs from "fs";

useRuntimeEnv('FIREY_ROOT_PATH', path.resolve(__dirname, '../../'))

const rl = createInterface({input: process.stdin, output: process.stdout})

const eq = (obj1, obj2) => {
    if (obj1 === obj2) return true;

    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
        return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (const key of keys1) {
        if (!keys2.includes(key) || !eq(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
}

const $ = (oldChanges, newChange) => {
    for (const oldChange of oldChanges) {
        const oldChange_clone = useDeepClone(oldChange)
        const isMigrate = oldChange_clone.isMigrate
        delete oldChange_clone.isMigrate
        if (eq(oldChange_clone, newChange)) {
            return isMigrate ? {...oldChange_clone, isMigrate: true} : oldChange_clone
        }
    }
    return newChange
}

const inputMessage = async (key, models, model, deleteFields, deleteField, savedMigrations, oldChanges) => {
    const line = await rl.question(`Did you rename ${model}.${deleteField.key} to ${model}.${key} (a ${deleteField.field.type} Field)? [y/n]`)
    if (line.toLowerCase() !== 'n') {
        savedMigrations.changes.push($(oldChanges, {
            model,
            key,
            oldKey: deleteField.key,
            type: OPERATE_TYPE.RENAME
        }))
        deleteFields.splice(deleteFields.indexOf(deleteField), 1)
        console.log(`- Rename ${model}.${deleteField.key} to ${model}.${key}`)
    } else {
        savedMigrations.changes.push($(oldChanges, {
            model,
            key,
            type: OPERATE_TYPE.ADD,
            field: models[model].fields[key]
        }))
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
        let isCreateNewFile

        if (migrationsFiles.length && migrationsFiles.length > 1) {
            maxNum = Math.max(...migrationsFiles.map(filename => parseInt(filename.split('-')[1])))
            const migrationData_new = await Bun.file(migrationsPath + path.sep + `migrations-${maxNum}.json`, {type: 'application/json'}).json()
            const migrationData_old = await Bun.file(migrationsPath + path.sep + `migrations-${maxNum - 1}.json`, {type: 'application/json'}).json()
            isCreateNewFile = migrationData_new.isMigrate
            const migrationData = isCreateNewFile ? migrationData_new : migrationData_old
            const oldChanges = isCreateNewFile ? {} : migrationData_new.changes

            for (const filePath of allFiles) {
                const models = require('../../' + filePath);
                for (const model in models) {
                    const deleteFields = []
                    if (migrationData.models[model]) {
                        if (migrationData.models[model].name !== models[model].name) {
                            savedMigrations.changes.unshift($(oldChanges, {
                                model,
                                type: OPERATE_TYPE.TABLENAME,
                                oldName: migrationData.models[model].name,
                                name: models[model].name
                            }))
                            console.log(`- Rename Tabla name ${migrationData.models[model].name} to ${models[model].name}`)
                        }
                        if (!eq(migrationData.models[model], models[model])) {
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
                                    if (!eq(migrationData.models[model].fields[key], models[model].fields[key])) {
                                        savedMigrations.changes.push($(oldChanges, {
                                            model,
                                            key,
                                            type: OPERATE_TYPE.ALERT,
                                            field: models[model].fields[key],
                                            oldField: migrationData.models[model].fields[key]
                                        }))
                                        console.log(`- Alert ${model}.${key}`)
                                    }
                                } else {
                                    let isUpdate = false
                                    if (deleteFields.length) {
                                        for (const deleteField of deleteFields) {
                                            if (eq(deleteField.field, models[model].fields[key]) && !isUpdate) {
                                                isUpdate = true
                                                await inputMessage(key, models, model, deleteFields, deleteField, savedMigrations, oldChanges)
                                            }
                                        }
                                        if (!isUpdate) {
                                            savedMigrations.changes.push($(oldChanges, {
                                                model,
                                                key,
                                                type: OPERATE_TYPE.ADD,
                                                field: models[model].fields[key]
                                            }))
                                            console.log(`- Add ${model}.${key}`)
                                        }
                                    } else {
                                        savedMigrations.changes.push($(oldChanges, {
                                            model,
                                            key,
                                            type: OPERATE_TYPE.ADD,
                                            field: models[model].fields[key]
                                        }))
                                        console.log(`- Add ${model}.${key}`)
                                    }
                                }
                            }
                        }
                        for (const deleteField of deleteFields) {
                            savedMigrations.changes.push($(oldChanges, {
                                model,
                                key: deleteField.key,
                                type: OPERATE_TYPE.REMOVE
                            }))
                            console.log(`- Delete ${model}.${deleteField.key}`)
                        }
                        savedMigrations.models[model] = models[model]
                    } else {
                        savedMigrations.models[model] = models[model]
                        savedMigrations.changes.push($(oldChanges, {
                            model,
                            type: OPERATE_TYPE.INIT
                        }))
                        console.log(`- Add model ${model}`)
                    }
                }
            }
        } else {
            isCreateNewFile = true
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
        if (savedMigrations.changes.length) {
            await Bun.write(migrationsPath + path.sep + `migrations-${isCreateNewFile ? maxNum + 1 : maxNum}.json`, JSON.stringify(savedMigrations, null, 4));
            console.log(`- Migration ${isCreateNewFile ? maxNum + 1 + ' created' : maxNum + ' updated'}`)
        } else {
            if (!isCreateNewFile) {
                fs.unlinkSync(migrationsPath + path.sep + `migrations-${maxNum}.json`)
            }
            console.log('- No changes')
        }
    } catch (err) {
        console.error('Something wrong, error:', err);
    }
};


install().then(() => {
    rl.close();
    process.exit(0)
})
