import { Router } from "express";
import { UpdatesController } from "../controllers/UpdatesController.js";

export const router = Router();

router.get("/", async (req, res) => await UpdatesController.get(req, res));
