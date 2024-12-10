import { fetchAllEmpresas, fetchSimboloEmisora } from "./src/helpers/ApiFetcher.js";
import { getAllEmpresas } from "./src/models/Empresa.js";
import { getAllMonedas } from "./src/models/Moneda.js";

/**
 * 1. Get All empresas
 * 2. Loop through array and get latest values
 * 3. Update
 */
async function main() {
    try {
        const empresas = await fetchAllEmpresas();
        const monedas = await getAllMonedas();
        /**
         * @type {Promise[]}
        */
        const symbolPromises = empresas.map((empresa) => {
            const simbolo = empresa.COD_SIMB;
            return fetchSimboloEmisora(simbolo);
        });
        (await Promise.all(symbolPromises)).forEach(async (resolved) => {
            const lastPrice = Number(resolved?.cur_precio_var_rv[0]?.PRECIO_ULT);
            const symbol = resolved.cur_encab_simb_rv[0]?.COD_SIMB;
            const currencySymbol = resolved?.cur_encab_simb_rv[0]?.MONEDA;
            const historyPrices = resolved?.cur_grf_anual_pre_rv;
            const empresasFromDb = await getAllEmpresas();
            empresasFromDb.forEach(empresa => {
                const id = empresa.id;
                const currency = monedas.find(moneda => moneda.symbol == currencySymbol);
            });
        });
    } catch (e) {
        console.error(e);
    }
}

main();