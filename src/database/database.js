import sqlite from "sqlite3";
import { config } from "../../config.js";

export function getConnection() {
    return new sqlite.Database(config.database.path, (err => console.error(err)));
}