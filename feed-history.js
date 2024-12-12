// this script should be executed once
// otherwise you'll probably duplicate data in the updates table
import { fetchCompanyPriceHistory } from "./src/helpers/ApiFetcher.js";
import { getAllEmpresas } from "./src/models/Empresa.js";
import { insertUpdate } from "./src/models/Update.js";
import { convertDateFromFormatToFormat } from "./src/utils/utils.js";

try {
    const empresasFromDB = await getAllEmpresas();

    empresasFromDB.forEach(async (empresa) => {
        const empresaDataFromAPi = await fetchCompanyPriceHistory(
            empresa.symbol,
        );
        setTimeout(() => {
            empresaDataFromAPi.forEach(async (priceData) => {
                console.log(empresa, priceData);
                const formatDate = convertDateFromFormatToFormat(
                    priceData.FEC,
                    "dd/LL/yy",
                    "yyyy-LL-dd",
                );
                await insertUpdate({
                    price: priceData.PRECIO_CIE,
                    dateHour: formatDate,
                    idEmpresa: empresa.id,
                });
            });
        }, 1000);
    });
} catch (e) {
    console.error(e);
}
