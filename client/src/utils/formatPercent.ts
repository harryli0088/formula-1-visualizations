/**
 * Convert a value to a percent, then round and convert into a string
 * @param value   the value to convert into a percent (ie 0.5 becomes 50%)
 * @param toFixed to fixed argument
 * @returns       percent string  
 */
export default function formatPercent(
  value: number, 
  toFixed: number = 0,
) {
  return (100 * value).toFixed(toFixed) + "%"
}