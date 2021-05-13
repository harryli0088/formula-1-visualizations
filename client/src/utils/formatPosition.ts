export default function formatPosition(position: string) {
  return isNaN(parseInt(position)) ? "DNF" : position
}