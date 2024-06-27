import {useRuntimeEnv, useConnectPool, useAsyncGetFiles, useTransferMigrateSQL} from 'firey/hooks-test'
import fs from 'fs';
import path from 'path';

useRuntimeEnv('FIREY_ROOT_PATH', path.resolve(__dirname, '../../'))

const migrationsPath = 'migrate/migrations';
const migrationsFiles = await useAsyncGetFiles(migrationsPath);

const preMigrations = []

for (const file of migrationsFiles) {
    const migrationData = await Bun.file(file, {type: 'application/json'}).json()
    !migrationData.isMigrate && preMigrations.push(migrationData)
}

!preMigrations.length && console.log('No migrations to migrate') && process.exit(0)

const getCacheConnect = async (database, cache = {}) => {
    if (cache[database]) return cache[database]
    const connect = await useConnectPool(database)
    cache[database] = connect
    return connect
}

for (const migration of preMigrations) {
    for (const change of migration.changes) {
        const connect = await getCacheConnect(change.database)
        const sql = useTransferMigrateSQL(migration.models[change.model], change)
        await connect.execute(sql)
        console.log(`- ${change.model}${change.key ? `.${change.key}` : ''} [${change.type}] OK`)
    }
}

console.log('All Changes Migrate OK')
process.exit(0)