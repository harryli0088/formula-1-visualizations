import { derived, readable } from 'svelte/store'
import arrayToObjectMap from '../utils/arrayToObjectMap'
import parseCsvFile from '../utils/parseCsvFile'
import type {
  CircuitType,
  DriverType,
  QualifyingType,
  RaceType,
  ResultType,
  StatusType
} from '../utils/types'

export const circuits = readable<CircuitType[]>([], function start(set) {
  parseCsvFile('data/circuits.csv').then(set)
  return function stop() {}
})
export const drivers = readable<DriverType[]>([], function start(set) {
  parseCsvFile('data/drivers.csv').then(set)
  return function stop() {}
})
export const qualifying = readable<QualifyingType[]>([], function start(set) {
  parseCsvFile('data/qualifying.csv').then(set)
  return function stop() {}
})
export const races = readable<RaceType[]>([], function start(set) {
  parseCsvFile('data/races.csv').then(set)
  return function stop() {}
})
export const results = readable<ResultType[]>([], function start(set) {
  parseCsvFile('data/results.csv').then(results => set(results.filter(r => r.resultId?.length)))
  return function stop() {}
})
export const statuses = readable<StatusType[]>([], function start(set) {
  parseCsvFile('data/status.csv').then(set)
  return function stop() {}
})

export const raceIdMap = derived(
	races,
	$races => arrayToObjectMap($races, "raceId"),
  {}
)

export const statusIdMap = derived(
	statuses,
	$statuses => arrayToObjectMap($statuses, "statusId"),
  {}
)

export const latestRace = derived(
	[results, raceIdMap],
  //find the latest race
  //the accumulator in this case is the latest race or null
	([$results,$raceIdMap]) => $results.reduce((acc: RaceType | null, result) => {
    const race = $raceIdMap[result.raceId] //get the race for this result
    return (
      acc === null || acc.date<race.date //if the acc is null OR this race's date is later
      ? race //return the later race
      : acc //else return the acc
    )
  }, null),
  null
)

export const latestRaceText = derived(
  latestRace,
  $latestRace => $latestRace ? `(Up-to-date to the ${$latestRace.date} ${$latestRace.name})` : ""
)