import express from "express";
import { router } from "./src/routes/UpdatesRouter.js";
import { empresaRouter } from "./src/routes/EmpresaRouter.js";
import { config } from "./config.js";

const app = express();

app.use((req, res, next) => {
    console.log(req.method, req.url, req.statusCode);
    next();
});

app.use("/updates", router);
app.use("/empresas", empresaRouter);
app.listen(config.app.port, (err) => {
    console.log("app in port 8000");
});
