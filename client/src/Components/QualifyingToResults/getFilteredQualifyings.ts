import type { ObjectMapType } from "../../utils/arrayToObjectMap"
import isMatchingCircuit from "../../utils/isMatchingCircuit"
import isMatchingDriver from "../../utils/isMatchingDriver"
import type { CircuitType, DriverType, QualifyingType, RaceType } from "../../utils/types"

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
    isMatchingCircuit(circuitFilter, raceIdMap[q.raceId]?.circuitId) //matching circuit
    && isMatchingDriver(driverFilter, q.driverId) //matching driver
  ))
}