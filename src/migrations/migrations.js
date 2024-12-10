import { getConnection } from "../database/database.js";

function createTableMoneda() {
    const sql = `CREATE TABLE IF NOT EXISTS Monedas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                symbol TEXT NOT NULL UNIQUE
            )`;
    return sql;
}

function createTableEmpresa() {
    const sql = `CREATE TABLE IF NOT EXISTS Empresas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                symbol TEXT NOT NULL UNIQUE,
                isin TEXT NOT NULL,
                status INTEGER NOT NULL,
                accCirc TEXT NOT NULL DEFAULT 0,
                iconURL TEXT NOT NULL DEFAULT "N/A",
                idCurrency INTEGER NOT NULL,
                FOREIGN KEY(idCurrency)  REFERENCES Monedas(id)
            )`;
    return sql;
}

function createTableUpdates() {
    const sql = `CREATE TABLE IF NOT EXISTS Updates (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                dateHour TEXT NOT NULL,
                price REAL NOT NULL DEFAULT 0,
                idEmpresa INTEGER NOT NULL,
                FOREIGN KEY(idEmpresa) REFERENCES Empresas(id)
            )`;
    return sql;
}

function createTableLastUpdatedAt() {
    const sql = `CREATE TABLE IF NOT EXISTS LastUpdatedAt (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                dateHour TEXT NOT NULL,
                idEmpresa INTEGER NOT NULL,
                FOREIGN KEY(idEmpresa) REFERENCES Empresas(id)
            )`;
    return sql;
}

[
    createTableMoneda,
    createTableEmpresa,
    createTableUpdates,
    createTableLastUpdatedAt,
].forEach((migration) => {
    try {
        const sql = migration();
        const db = getConnection();
        console.log("executing ", migration.name);
        db.run(sql);
        console.log("finishing execution of ", migration.name);
    } catch (e) {
        console.error(e);
    }
});