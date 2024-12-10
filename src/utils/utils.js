import { DateTime } from "luxon";

/**
 * @param {unknown} input
 * @returns {FormData}
 */
export function makeFormDataBasedOnObject(input = {}) {
    const formData = new FormData();
    Object.keys(input).forEach((prop) => formData.append(prop, input[prop]));
    return formData;
}

/**
 * @param {FormData} formData
 * @returns {string}
 */
export function formDataToString(formData) {
    const entries = new URLSearchParams(formData);
    return entries.toString();
}

/**
 * @param {object} inputObject
 * @param {string[]} propList
 * @returns
 */
export function objectHasAllProperties(inputObject, propList) {
    if (
        !Object.keys(inputObject).filter((inputObjectProp) =>
            propList.includes(inputObjectProp)
        ).length == propList.length
    ) {
        throw new Error(
            "Input data does not meet properties expectations. Make sure object has all needed data",
        );
    }
    return true;
}

export function getTimeFormatted(inputDate = "") {
    const format = "yyyy-LL-dd hh:mm:ss"
    if (inputDate) return DateTime.fromFormat(inputDate, "yyyy-LL-dd").toFormat(format)
    return DateTime.now().toFormat(format);
}

console.log(getTimeFormatted());