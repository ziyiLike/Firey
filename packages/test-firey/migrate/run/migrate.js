import {useRuntimeEnv, useConnectPool, useAsyncGetFiles, useTransferMigrateSQL} from 'firey/hooks-test'
import path from 'path';

useRuntimeEnv('FIREY_ROOT_PATH', path.resolve(__dirname, '../../'))

const migrationsPath = 'migrate/migrations';
const migrationsFiles = await useAsyncGetFiles(migrationsPath);
const cache = {}
const preMigrations = []

for (const file of migrationsFiles) {
    const migrationData = await Bun.file(file, {type: 'application/json'}).json()
    !migrationData.isMigrate && preMigrations.push({...migrationData, fileName: file})
}

!preMigrations.length && (console.log('No migrations to migrate') , process.exit(0))

const getCacheConnect = async (database) => {
    if (cache[database]) return cache[database]
    const connect = await useConnectPool(database)
    if (!connect) throw new Error(`Database ${database} not found`)
    const {conn, execute} = await connect()
    await conn.beginTransaction()
    cache[database] = {conn, execute}
    return {conn, execute}
}

const autoSaveMigrateHistory = async () => {
    for (const migration of preMigrations) {
        await Bun.write(migration.fileName, JSON.stringify(migration, null, 4))
    }
}


for (const migration of preMigrations) {
    try {
        for (const change of migration.changes.filter(change => !change.isMigrate)) {
            const {execute} = await getCacheConnect(change.database || 'default')
            const {sql, relationSql} = useTransferMigrateSQL(migration.models, migration.models[change.model], change)
            await execute(sql)
            await execute(relationSql)
            change.isMigrate = true
            console.log(`- ${change.model}${change.key ? `.${change.key}` : ''} [${change.type}] OK`)
        }
        migration.isMigrate = true
    } catch (e) {
        for (const database in cache) {
            const {conn} = cache[database]
            await conn.release()
        }
        migration.isMigrate = false
        await autoSaveMigrateHistory()
        console.error(e)
        process.exit(1)
    } finally {
        for (const database in cache) {
            const {conn} = cache[database]
            await conn.release()
        }
        await autoSaveMigrateHistory()
    }
}


console.log('All Changes Migrate is OK')
process.exit(0)