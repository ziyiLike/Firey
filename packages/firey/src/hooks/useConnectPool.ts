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
            autoTransaction = false;

            constructor(autoTransaction: boolean = false) {
                this.conn = connection;
                this.autoTransaction = autoTransaction;
            }

            public async beginTransaction() {
                await connection.beginTransaction();
            }

            public async commit() {
                await connection.commit();
            }

            public async rollback() {
                await connection.rollback();
            }

            public async release() {
                await connection.release();
            }

            public async execute(sql: string, params = []) {
                !sql.endsWith(';') && (sql += ';')
                this.autoTransaction && connection.beginTransaction()
                try {
                    const result = await connection.query(sql, params);
                    this.autoTransaction && connection.commit();
                    return result;
                } catch (err) {
                    console.log(`Execute SQL Error: ${sql}`)
                    this.autoTransaction && connection.rollback();
                    throw err;
                } finally {
                    this.autoTransaction && connection.release();
                }
            }
        }

        return Connect;
    }

}