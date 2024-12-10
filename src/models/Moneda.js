import {
    executePreparedStatement,
    getConnection,
} from "../database/database.js";
import { objectHasAllProperties } from "../utils/utils.js";

const PROP_LIST = [
    "symbol",
];

export async function insertMoneda(data) {
    try {
        if (objectHasAllProperties(data, PROP_LIST)) {
            const sql = `INSERT INTO Monedas(symbol) VALUES (:symbol)`;
            const db = getConnection();
            return await executePreparedStatement(sql, [data.symbol], db);
        }
    } catch (e) {
        console.error(e);
    }
}

export async function getMoneda(id) {
    try {
        const sql = `SELECT * FROM Monedas WHERE id=?`;
        const db = getConnection();
        return await executePreparedStatement(sql, [id], db);
    } catch (e) {
        console.error(e);
    }
}

export async function getAllMonedas() {
    try {
        const sql = `SELECT * FROM Monedas`;
        const db = getConnection();
        const rows = await executePreparedStatement(sql, [], db);
        return rows;
    } catch (e) {
        console.error(e);
    }
}