import mysql from 'mysql2/promise';
import {useConfig} from "./useConfig";


// 使用连接池执行查询 柯里化缓存连接池
export const useConnectPool = async (dbName?: string) => {
    const db = useConfig('database')

    console.log(db)

    delete db.default.type

    const poolConfig = db.default;

    const pool = mysql.createPool(poolConfig);

    return async (sql: string, params = []) => {
        const connection = await pool.getConnection().catch(err => {
            throw err
        })
        try {
            const [rows, fields] = await connection.query(sql, params);
            return rows;
        } catch (err) {
            throw err;
        } finally {
            connection.release();
        }
    }
}