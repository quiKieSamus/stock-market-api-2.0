import { getAllEmpresas } from "../models/Empresa.js";
import { getAllUpdates } from "../models/Update.js";
import { areDatesStringEqual, getClosestDateFromList, getTimeFormatted, substractDaysFromDate } from "../utils/utils.js";

export class EmpresaController {
    /**
     * /empresas
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async get(req, res) {
        try {
            const empresas = await getAllEmpresas();

            if (!req.query.simbolo) {
                return res.json(empresas);
            }

            const filterEmpresa = empresas.find((empresa) => empresa.symbol == req.query.simbolo);

            if (!filterEmpresa) {
                res.type("text");
                return res.status(404).send("Not found");
            }
            return res.json(filterEmpresa);
        } catch (err) {
            console.error(err);
            res.type("text");
            return res.status(500).send(`Error in server`);
        }
    }
    /**
     * /empresas/precios
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async getPrecios(req, res) {
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
                    empresa: {
                        ...empresasUpdate.empresa,
                        endPrice: newestUpdate?.price ?? {},
                        startPrice: secondNewestUpdate[secondNewestUpdate.length - 1]?.price ?? newestUpdate
                    },
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
            console.error(err);
            res.type("text");
            return res.status(500).send(`Error in server`);
        }
    }
}
