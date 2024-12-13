import { fetchAllEmpresas, fetchCompanyPriceHistory, fetchSimboloEmisora } from "./src/helpers/ApiFetcher.js";
import { getAllEmpresas, insertEmpresa } from "./src/models/Empresa.js";
import { getAllMonedas, insertMoneda } from "./src/models/Moneda.js";
import { insertUpdate } from "./src/models/Update.js";

/**
 * 
 */
async function daemonEmpresas() {
    try {
        const empresas = await fetchAllEmpresas();
        const empresasFromDb = await getAllEmpresas();
        let monedas = await getAllMonedas();
        empresas.forEach(async (empresa) => {
            const symbol = empresa.COD_SIMB;
            const simboloEmisora = await fetchSimboloEmisora(symbol);

            if (!simboloEmisora?.cur_encab_simb_rv[0]) {
                // empresa es undefined
                console.log("Empresa de simbolo", symbol, "no pudo tener su data extraída");
                console.log(empresa);
                return
            };

            if (!monedas.find((moneda) => moneda?.symbol?.toLowerCase() == simboloEmisora?.cur_encab_simb_rv[0]?.MONEDA?.toLowerCase())) {
                // registrar moneda que no existe
                await insertMoneda({ symbol: simboloEmisora?.cur_encab_simb_rv[0]?.MONEDA });
                // execute again;
                monedas = await getAllMonedas();
            }

            const moneda = monedas.find((monedaItem) => monedaItem?.symbol?.toLowerCase() == simboloEmisora?.cur_encab_simb_rv[0]?.MONEDA?.toLowerCase());

            if (!empresasFromDb.find((empresa) => symbol == empresa.symbol)) {
                // registrar empresa que no existe
                const empresaDataFromApi = simboloEmisora.cur_encab_simb_rv;
                console.log("Registrando nueva empresa en base a estos datos", empresaDataFromApi);
                await insertEmpresa({
                    name: empresaDataFromApi[0].DESC_SIMB,
                    isin: empresaDataFromApi[0].COD_ISIN,
                    symbol: empresaDataFromApi[0].COD_SIMB,
                    status: empresaDataFromApi[0].ESTATUS == "ACTIVO" ? 1 : 0,
                    accCirc: empresaDataFromApi[0].ACC_CIRC,
                    iconURL: "N/A",
                    idCurrency: moneda?.id
                });
            }
        });
    } catch (e) {
        console.error(e);
    }
}

async function daemonPrices() {
    try {
        const empresas = await getAllEmpresas();
        empresas.forEach(async (empresa) => {
            const empresaDataFromAPi = await fetchSimboloEmisora(empresa?.symbol);
            if (!Array.isArray(empresaDataFromAPi?.cur_precio_var_rv)) {
                console.log("Parece que no hay data de precios");
                return;
            }
            console.log("Actualizando precio para la empresa: ", empresa.name);
            insertUpdate({ price: empresaDataFromAPi?.cur_precio_var_rv[0]?.PRECIO_ULT, idEmpresa: empresa.id });
        });
    } catch (e) {
        console.error(e);
    }
}

async function main() {
    await daemonEmpresas();
    await daemonPrices();
}

try {
    await main();
} catch (e) {
    console.log(e);
}

setInterval(async () => {
    try {
        await main();
    } catch (e) {
        console.log(e);
    }
}, 1000 * 60 * 60);