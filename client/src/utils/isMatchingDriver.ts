import type { DriverType } from "./types";

/**
 * Given a driver and a possible driver id, return true if the driver is null or the driverId matches
 * @param driver   the driver filter
 * @param driverId the driver id (of the race result for example)
 * @returns        true if match, else false
 */
export default function isMatchingCircuit(
  driver: DriverType | null,
  driverId?: string,
) {
  return driver===null || driverId === driver.driverId
}