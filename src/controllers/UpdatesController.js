import { getAllEmpresas } from "../models/Empresa.js";
import { getAllUpdates, getAllUpdatesByEmpresa } from "../models/Update.js";

export class UpdatesController {
    static async get(req, res) {
        try {
            const empresas = await getAllEmpresas();
            if (!req.query.simbolo) {
                const allUpdates = await getAllUpdatesByEmpresa();
                console.log(allUpdates);
                res.json(allUpdates ?? []);
            }
            const empresa = empresas.find((empresa) => empresa.symbol == req.query.simbolo);
            const update = await getAllUpdates(empresa.id);
            res.json(update);
        } catch (err) {
            res.status(500).send(`Error in server ${err}`);
            res.end()
        }
    }
}
