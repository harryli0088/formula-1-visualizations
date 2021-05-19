/**
 * Return the sum of an array of numbers
 * @param arr array of numbers
 * @returns   sum of array values
 */
export default function sum(arr: number[]) {
  return arr.reduce((sum, value) => sum + value, 0)
}