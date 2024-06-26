import mysql from 'mysql2/promise';
import {useConfig} from "./useConfig";

export const useConnectPool = async (dbName?: string) => {
    const db = useConfig('database')

    const dbType = db.default.type;

    delete db.default.type

    const poolConfig = dbName ? db[dbName] : db.default;

    if (dbType === 'mysql') {
        const pool = mysql.createPool(poolConfig);

        return async (sql: string, params = []) => {
            const connection = await pool.getConnection().catch(err => {
                throw err
            })
            try {
                return await connection.execute(sql, params);
            } catch (err) {
                throw err;
            } finally {
                connection.release();
            }
        }
    }

}