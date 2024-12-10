/**
 * 
 * @param {unknown} input 
 * @returns {FormData}
 */
export function makeFormDataBasedOnObject(input = {}) {
    const formData = new FormData();
    Object.keys(input).forEach(prop => formData.append(prop, input[prop]));
    return formData;
}

/**
 * 
 * @param {FormData} formData 
 * @returns {string}
 */
export function formDataToString(formData) {
    const entries = new URLSearchParams(formData);
    return entries.toString();
}