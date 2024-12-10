import sqlite from "sqlite3";
import { config } from "../../config.js";

export function getConnection() {
    return new sqlite.Database(
        config.database.path,
        (err) => console.error(err),
    );
}

/**
 * @param {string} sql
 * @param {any[]} params
 * @param {sqlite.Database} db
 */
export function executePreparedStatement(sql, params = [], db) {
    return new Promise((res, rej) => {
        const stmt = db.prepare(sql, params);
        stmt.all([], (err, rows) => {
            if (err) throw err;
            return res(rows);
        });
    });
}
