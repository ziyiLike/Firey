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

const getCachePool = async (database, cache = {}) => {
    if (cache[database]) return cache[database]
    const pool = await useConnectPool(database)
    cache[database] = pool
    return pool
}

for (const migration of preMigrations) {
    for (const change of migration.changes) {
        const pool = await getCachePool(change.database)
        const sql = useTransferMigrateSQL(migration.models[change.model], change)
    }
}
