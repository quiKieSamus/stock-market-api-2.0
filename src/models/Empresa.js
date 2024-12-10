import {
    executePreparedStatement,
    getConnection,
} from "../database/database.js";
import { objectHasAllProperties } from "../utils/utils.js";
import { getMoneda } from "./Moneda.js";

const PROP_LIST = [
    "name",
    "isin",
    "symbol",
    "status",
    "accCirc",
    "iconURL",
    "idCurrency",
];

export async function getEmpresa(id) {
    try {
        const sql = `SELECT * FROM Empresas WHERE id=:id`;
        const db = getConnection();
        return await executePreparedStatement(sql, [id], db);
    } catch (e) {
        console.error(e);
    }
}

export async function getAllEmpresas() {
    try {
        const sql = `SELECT * FROM Empresas`;
        const db = getConnection();
        return await executePreparedStatement(sql, [], db);
    } catch (e) {
        console.error(e);
    }
}

export async function insertEmpresa(data) {
    try {
        if (objectHasAllProperties(data, PROP_LIST)) {
            if ((await getMoneda(data.idCurrency)).length <= 0) throw new Error("Moneda doesn't exists");
            const sql =
                `INSERT INTO Empresas (name, isin, status, accCirc, idCurrency) VALUES (?, ?, ?, ?, ?)`;
            const db = getConnection();
            return await executePreparedStatement(sql, [data.name, data.isin, data.status, data.accCirc, data.idCurrency], db);
        }
    } catch (e) {
        console.log(e);
    }
}