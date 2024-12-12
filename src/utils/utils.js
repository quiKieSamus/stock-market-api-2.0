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

export function convertDateFromFormatToFormat(date, luxonFromFormat, luxonToFormat) {
    return DateTime.fromFormat(date, luxonFromFormat).toFormat(luxonToFormat);
}

export function substractDaysFromDate(date, days) {
    return DateTime.fromISO(date).minus({ days: days }).toFormat("yyyy-LL-dd");
}

export function areDatesStringEqual(date1, date2, ignoreTime = false) {
    const dt1 = DateTime.fromISO(date1);
    const dt2 = DateTime.fromISO(date2);

    if (!ignoreTime) return dt1.equals(dt2);

    return (dt1.year == dt2.year && dt1.month == dt2.month && dt1.day == dt2.day)
}