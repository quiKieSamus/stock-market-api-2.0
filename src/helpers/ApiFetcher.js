import { formDataToString, makeFormDataBasedOnObject } from "../utils/utils.js";

const API_URL = "https://bolsadecaracas.com/wp-admin/admin-ajax.php";

export async function fetchResumenMercadoRentaVariable() {
    try {
        const queries = `action=resumenMercadoRentaVariable`;
        const formData = makeFormDataBasedOnObject({ type: "online" });
        const res = await fetch(`${API_URL}?${queries}`, {
            method: "post",
            body: formDataToString(formData),
            headers: {
                "content-type":
                    "application/x-www-form-urlencoded; charset=utf-8",
            },
        });
        const json = await res.json();
        return json;
    } catch (e) {
        console.error(e);
    }
}

export async function fetchSimboloEmisora(simbolo = "ABC.B") {
    // https://www.bolsadecaracas.com/wp-admin/admin-ajax.php?action=getSimbolosDetalle
    try {
        const queries = `action=getSimbolosDetalle`;
        const formData = makeFormDataBasedOnObject({
            tipo: "rv",
            simbolo: simbolo,
        });
        const res = await fetch(`${API_URL}?${queries}`, {
            method: "post",
            body: formDataToString(formData),
            headers: {
                "content-type":
                    "application/x-www-form-urlencoded; charset=utf-8",
            },
            signal: AbortSignal.timeout(1000*60)
        });
        const json = await res.json();
        if (!json.success) {
            throw new Error("Not the response you were expecting");
        }
        if (!("response" in json)) {
            throw new Error("Not the response you were expecting");
        }
        return json.response;
    } catch (e) {
        console.error(e);
    }
}

export async function fetchEmpresa(simbolo = "ABC.B") {
    try {
        const simboloEmisora = await fetchSimboloEmisora(simbolo);
        return ("cur_encab_simb_rv" in simboloEmisora)
            ? simboloEmisora?.cur_encab_simb_rv
            : {};
    } catch (e) {
        console.error(e);
    }
}

export async function fetchAllEmpresas() {
    try {
        const formData = makeFormDataBasedOnObject({action: "get_cotizaciones"});
        const res = await fetch(`${API_URL}`, {
            method:"post",
            body: formDataToString(formData),
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=utf-8"
            }
        });
        const json = await res.json();
        if (!json.response) throw new Error("Not the response you were expecting");
        return json.response;
    } catch (e) {
        console.error(e);
    }
}

export async function fetchCompanyPriceHistory(
    simbolo = "ABC.B",
    currentSession = false,
) {
    try {
        const simboloEmisora = await fetchSimboloEmisora(simbolo);
        if (!simboloEmisora) throw new Error("Looks like the Company has no data");
        if (currentSession) {
            return ("cur_grf_sesion_rv" in simboloEmisora)
                ? simboloEmisora.cur_grf_sesion_rv
                : [];
        }
        return ("cur_grf_anual_pre_rv" in simboloEmisora)
            ? simboloEmisora.cur_grf_anual_pre_rv
            : [];
    } catch (e) {
        console.error(e);
    }
}