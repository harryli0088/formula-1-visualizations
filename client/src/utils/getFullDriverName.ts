import type { DriverType } from "./types";

export default function getFullDriverName(d: DriverType) {
  return `${d.forename} ${d.surname}`
}