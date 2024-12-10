import { executePreparedStatement } from "../database/database.js";
import { objectHasAllProperties } from "../utils/utils.js";

const PROP_LIST = [
    "price",
    "idEmpresa",
];

export async function insertUpdate(data) {
    try {
        if (objectHasAllProperties(data)) {
            const sql =
                `INSERT INTO Updates (dateHour, price, idEmpresa) VALUES (?,?,?)`;
            
        }
    } catch (e) {
        console.error(e);
    }
}
