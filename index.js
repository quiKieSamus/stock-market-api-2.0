import express from "express";
import { router } from "./src/routes/UpdatesRouter.js";

const app = express();

app.use((req, res, next) => {
    console.log(req.method, req.url, req.statusCode);
    next();
});

app.use("/updates", router);

app.listen(8000, (err) => {
    console.log("app in port 8000");
});
