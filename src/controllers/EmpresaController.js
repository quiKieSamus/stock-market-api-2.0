import { getAllEmpresas } from "../models/Empresa.js";
import { getAllUpdates } from "../models/Update.js";
import { areDatesStringEqual, getClosestDateFromList, getTimeFormatted, substractDaysFromDate } from "../utils/utils.js";

export class EmpresaController {
    static async get(req, res) {
        try {
            const empresas = await getAllEmpresas();
            const updates = await getAllUpdates();

            const empresasWithUpdates = empresas.map((empresa) => {
                return {
                    empresa: empresa,
                    updates: updates.filter((updates) => updates.idEmpresa == empresa.id)
                }
            });

            const empresasWithLastPrices = empresasWithUpdates.map((empresasUpdate) => {
                const updatesSorted = empresasUpdate.updates.sort((a, b) => new Date(a.dateHour) < new Date(b.dateHour));
                const newestUpdate = updatesSorted[updatesSorted.length - 1];
                const secondNewestUpdate = updatesSorted.filter((update) => {
                    return !areDatesStringEqual(update.dateHour.replace(" ", "T"), newestUpdate.dateHour.replace(" ", "T"), true);
                }).sort((a, b) => new Date(a.dateHour) - new Date(b.dateHour));

                return {
                    empresa: empresasUpdate.empresa,
                    updates: {
                        updatesSorted: updatesSorted,
                        closing: newestUpdate ?? {},
                        beginning: secondNewestUpdate[secondNewestUpdate.length - 1] ?? newestUpdate
                    }
                }
            });

            if (!req.query.simbolo) {
                return res.json(empresasWithLastPrices);
            }
            return res.json(empresasWithLastPrices.filter((empresaUpdate) => empresaUpdate.empresa.symbol == req.query.simbolo));
        } catch (err) {
            return res.status(500).send(`Error in server ${err}`);
        }
    }
}
