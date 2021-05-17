import type { ObjectMapType } from "./arrayToObjectMap"
import type { CircuitType, DriverType, QualifyingType, RaceType } from "./types"

/**
 * Return an array of filtered qualifyings given the circuit and driver filters
 * @param qualifying    full array of qualifyings
 * @param raceIdMap     object mapping the race id to the race
 * @param circuitFilter circuit fitler
 * @param driverFilter  driver filter
 * @returns             array of qualifyings that match the circuit and driver filters
 */
export default function getFilteredQualifyings(
  qualifying: QualifyingType[],
  raceIdMap: ObjectMapType<RaceType>,
  circuitFilter: CircuitType | null,
  driverFilter: DriverType | null,
) {
  return qualifying.filter(q => (
    (circuitFilter===null || raceIdMap[q.raceId]?.circuitId === circuitFilter.circuitId) //matching circuit
    && (driverFilter===null || q.driverId === driverFilter.driverId) //matching driver
  ))
}