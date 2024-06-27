import mysql from 'mysql2/promise';
import {useConfig} from "./useConfig";

export const useConnectPool = async (dbName?: string) => {
    const db = useConfig('database')

    const dbType = db.default.type;

    delete db.default.type

    const poolConfig = dbName ? db[dbName] : db.default;

    if (dbType === 'mysql') {
        const pool = mysql.createPool(poolConfig);
        const connection = await pool.getConnection().catch(err => {
            throw err
        })

        class Connect {
            conn: mysql.PoolConnection;

            constructor() {
                this.conn = connection;
            }

            async execute(sql: string, params = []) {
                !sql.endsWith(';') && (sql += ';')
                connection.beginTransaction()
                try {
                    const result = await connection.execute(sql, params);
                    connection.commit();
                    return result;
                } catch (err) {
                    console.log(`Execute SQL Error: ${sql}`)
                    connection.rollback();
                    throw err;
                } finally {
                    connection.release();
                }
            }
        }

        return new Connect();
    }

}