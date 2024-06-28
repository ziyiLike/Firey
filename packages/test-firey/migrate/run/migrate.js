import {useRuntimeEnv, useConnectPool, useAsyncGetFiles, useTransferMigrateSQL} from 'firey/hooks-test'
import fs from 'fs';
import path from 'path';

useRuntimeEnv('FIREY_ROOT_PATH', path.resolve(__dirname, '../../'))

const migrationsPath = 'migrate/migrations';
const migrationsFiles = await useAsyncGetFiles(migrationsPath);
const cache = {}
const preMigrations = []

for (const file of migrationsFiles) {
    const migrationData = await Bun.file(file, {type: 'application/json'}).json()
    !migrationData.isMigrate && preMigrations.push(migrationData)
}

!preMigrations.length && console.log('No migrations to migrate') && process.exit(0)

const getCacheConnect = async (database) => {
    if (cache[database]) return cache[database]
    const connect = await useConnectPool(database)
    if (!connect) throw new Error(`Database ${database} not found`)
    const content_ = new connect(false)
    await content_.beginTransaction()
    cache[database] = content_
    return content_
}

try {
    for (const migration of preMigrations) {
        for (const change of migration.changes) {
            const connect = await getCacheConnect(change.database || 'default')
            const sql = useTransferMigrateSQL(migration.models[change.model], change)
            await connect.execute(sql)
            console.log(`- ${change.model}${change.key ? `.${change.key}` : ''} [${change.type}] OK`)
        }
    }
} catch (e) {
    for (const database in cache) {
        const connect = cache[database]
        await connect.rollback()
        await connect.release()
    }
    console.error(e)
    process.exit(1)
}

// for (const database in cache) {
//     const connect = cache[database]
//     await connect.commit()
//     await connect.release()
// }

console.log('All Changes Migrate OK')
process.exit(0)