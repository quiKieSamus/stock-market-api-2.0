import { getAllEmpresas } from "../models/Empresa.js";

export class EmpresaController {
    static async get(req, res) {
        try {
            const empresas = await getAllEmpresas();
            if (!req.query.simbolo) {
                return res.json(empresas);
            }            
            return res.json(empresas.find((empresa) => empresa.symbol == req.query.simbolo));
        } catch (err) {
            return res.status(500).send(`Error in server ${err}`);
        }
    }
}
