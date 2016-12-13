/**
 * Rounds number to the nearest 100th
 * @param {Number} number
 * @returns Number
 */
export function round100(number) {
  let tempNumber = 100 * number;
  return Math.round(tempNumber) / 100;
}
