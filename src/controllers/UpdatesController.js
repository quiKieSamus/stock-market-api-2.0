import { getAllEmpresas } from "../models/Empresa.js";
import { getAllUpdates, getAllUpdatesByEmpresa } from "../models/Update.js";
import { areDatesStringEqual, substractDaysFromDate } from "../utils/utils.js";

export class UpdatesController {
    static async get(req, res) {
        try {
            const empresas = await getAllEmpresas();
            let allUpdates = await getAllUpdatesByEmpresa();
            if (req.query.date) {
                const minusOneDay = substractDaysFromDate(req.query.date, 1);
                const updates = allUpdates.map((updateObj) => {
                    const empresasUpdate = updateObj.updates.filter((update) => {
                        if (areDatesStringEqual(update.dateHour, req.query.date)) return update;
                        if (areDatesStringEqual(update.dateHour, minusOneDay)) return update;
                    });
                    return { empresa: updateObj.empresa, updates: empresasUpdate };
                });

                return res.json(updates.filter((item) => item.updates.length > 0));
            }
            if (!req.query.simbolo) {
                return res.json(allUpdates ?? []);
            }
            const empresa = empresas.find((empresa) => empresa.symbol == req.query.simbolo);
            const update = await getAllUpdates(empresa.id);
            return res.json(update);
        } catch (err) {
            res.status(500).send(`Error in server ${err}`);
            res.end()
        }
    }
}