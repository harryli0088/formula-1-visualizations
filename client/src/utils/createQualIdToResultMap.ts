import type { QualifyingType, ResultType } from "./types"

/**
 * Given the qualifyings and results, create an object that maps
 * the qualifying ids to the respective results
 * @param qualifying  array of qualifying data
 * @param results     array of results data
 * @returns           qualifying id to result map, ex { qual1: result1, qual2: result2, ... }
 */
export default function createQualIdToResultMap(
  qualifying: QualifyingType[],
  results: ResultType[],
):{[qualifyId: string]: ResultType} {
  //first create an intermediary object that maps the driver and race ids to the result
  const tmpMap: {[driverRacePair: string]: ResultType} = results.reduce((acc,r) => {
    acc[getDriverRacePair(r)] = r
    return acc
  }, {})

  //now we can directly map the qualifying to the result, based on the driver and race ids pair
  return qualifying.reduce((acc, q) => {
    acc[q.qualifyId] = tmpMap[getDriverRacePair(q)]
    return acc
  }, {})
}

function getDriverRacePair(d: QualifyingType | ResultType) {
  return `${d.driverId}-${d.raceId}`
}