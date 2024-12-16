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

/**
 * 
 * @param {string} inputDate 
 * @returns 
 */
export function getTimeFormatted(inputDate = "") {
    const format = "yyyy-LL-dd HH:mm:ss"
    if (inputDate) return DateTime.fromFormat(inputDate, "yyyy-LL-dd").toFormat(format)
    return DateTime.now().toFormat(format);
}

/**
 * 
 * @param {string} date 
 * @param {string} luxonFromFormat 
 * @param {string} luxonToFormat 
 * @returns 
 */
export function convertDateFromFormatToFormat(date, luxonFromFormat, luxonToFormat) {
    return DateTime.fromFormat(date, luxonFromFormat).toFormat(luxonToFormat);
}

/**
 * 
 * @param {string} date 
 * @param {number} days 
 * @returns 
 */
export function substractDaysFromDate(date, days) {
    return DateTime.fromISO(date).minus({ days: days }).toFormat("yyyy-LL-dd");
}

/**
 * 
 * @param {string} date1 ISO dates string
 * @param {string} date2 ISO dates string
 * @param {boolean} ignoreTime 
 * @returns 
 */
export function areDatesStringEqual(date1, date2, ignoreTime = false) {
    const dt1 = DateTime.fromISO(date1);
    const dt2 = DateTime.fromISO(date2);

    if (!ignoreTime) return dt1.equals(dt2);

    return (dt1.year == dt2.year && dt1.month == dt2.month && dt1.day == dt2.day)
}

/**
 * 
 * @param {string} referenceDate 
 * @param {string[]} dateList 
 * @returns {string}
 */
export function getClosestDateFromList(referenceDate, dateList) {
    const days = dateList.map((date) => {
        return { day: daysDifferenceBetweenDates(referenceDate, date), date: date };
    });
    return days.filter((item) => {
        if (item.day < 0) return;
        return true;
    }).sort((a, b) => a.day - b.day)[0];
}

/**
 * 
 * @param {string} date1 
 * @param {string} date2 
 * @returns {number} if negative, it's x days in the future, otherwise, it's x days in the past
 */
export function daysDifferenceBetweenDates(date1, date2) {
    const dt1 = DateTime.fromFormat(date1, "yyyy-LL-dd");
    const dt2 = DateTime.fromFormat(date2, "yyyy-LL-dd");

    return dt1.diff(dt2).milliseconds / 1000 / 3600 / 24;
}

// google gemini function
export function formatNumber(input) {
    // 1. Handle number inputs directly:
    if (typeof input === 'number') {
      return input.toLocaleString("en-US");
    }
  
    // 2. Handle non-string inputs (e.g., null, undefined):
      if (typeof input !== 'string') {
          return "Invalid input type. Please provide a string or number.";
      }
  
    // 3. Trim whitespace:
    let numberString = input.trim();
  
    // 4. Handle empty strings:
    if (numberString === "") {
      return "Invalid number (empty string)";
    }
  
    // 5. Handle leading comma:
    if (numberString.startsWith(",")) {
      numberString = "0" + numberString;
    }
  
      // 6. Remove spaces (for thousands separators if present)
      numberString = numberString.replace(/\s/g, "");
  
    // 7. Determine decimal separator and parse:
    let number;
    if (numberString.includes(".") && numberString.includes(",")) {
      number = parseFloat(numberString); // Period takes precedence
    } else if (numberString.includes(".")) {
      number = parseFloat(numberString);
    } else if (numberString.includes(",")) {
      number = parseFloat(numberString.replace(",", "."));
    } else {
      number = parseFloat(numberString); // Handles integers without separators
    }
  
    // 8. Check for parsing errors:
    if (isNaN(number)) {
      return "Invalid number";
    }
  
    // 9. Format the number (using en-US locale):
    return number.toLocaleString("en-US");
  }