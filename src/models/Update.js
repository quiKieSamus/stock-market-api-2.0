import { DateTime } from "luxon";
import { executePreparedStatement, getConnection } from "../database/database.js";
import { getTimeFormatted, objectHasAllProperties } from "../utils/utils.js";

const PROP_LIST = [
    "price",
    "idEmpresa",
];

export async function insertUpdate(data) {
    try {
        if (objectHasAllProperties(data, PROP_LIST)) {
            const sql =
                `INSERT INTO Updates (dateHour, price, idEmpresa) VALUES (?,?,?)`;
            const time = data?.dateHour ?? getTimeFormatted();
            const db = getConnection();
            return await executePreparedStatement(sql, [time, data.price, data.idEmpresa], db);
        }
    } catch (e) {
        console.error(e);
    }
}

export async function getAllUpdates(idEmpresa) {
    try {
        const db = getConnection();
        let sql = "SELECT * FROM Updates";
        if (idEmpresa) {
            sql = "SELECT * FROM Updates WHERE idEmpresa = ?";
            return await executePreparedStatement(sql, [idEmpresa], db);
        }
        return await executePreparedStatement(sql, [], db);
    } catch (e) {
        console.error(e);
    }
}

export async function getAllUpdatesByEmpresa() {
    try {
        const allUpdates = await getAllUpdates();
        const empresasIds = [];
        allUpdates.forEach((update) => {
            if (!empresasIds.includes(update.idEmpresa)) empresasIds.push(update.empresasIds);
        });

        return empresasIds.map((id) => {
            const empresaUpdates = allUpdates.filter((update) => update.idEmpresa == id);
            return {
                idEmpresa: id,
                updates: empresaUpdates
            }
        })
    } catch (e) {
        console.error(e);
    }
}