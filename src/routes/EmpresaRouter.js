import { Router } from "express";
import { EmpresaController } from "../controllers/EmpresaController.js";


export const empresaRouter = Router();

empresaRouter.get("/", (req, res) => EmpresaController.get(req, res));
empresaRouter.get("/precios", (req, res) => EmpresaController.getPrecios(req, res))