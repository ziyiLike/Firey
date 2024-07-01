import mysql from 'mysql2/promise';
import {useConfig} from "./useConfig";

export const useConnectPool = async (dbName?: string) => {
    const db = useConfig('database')

    const dbType = db.default.type;

    delete db.default.type

    const poolConfig = dbName ? db[dbName] : db.default;

    if (dbType === 'mysql') {
        const pool = mysql.createPool(poolConfig);

        return async () => {
            const conn = await pool.getConnection().catch(err => {
                throw err
            })

            const execute = async (sql: string, params = []) => {
                !sql.endsWith(';') && (sql += ';')
                try {
                    return await conn.execute(sql, params);
                } catch (err) {
                    console.log(`Execute SQL Error: ${sql}`)
                    throw err;
                }
            }
            return {
                conn,
                execute
            }
        };
    }

}