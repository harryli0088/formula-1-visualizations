import { derived, writable } from 'svelte/store'
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

export const circuits = writable<CircuitType[]>([], function start(set) {
  parseCsvFile('data/circuits.csv').then(set)
  return function stop() {}
})
export const drivers = writable<DriverType[]>([], function start(set) {
  parseCsvFile('data/drivers.csv').then(set)
  return function stop() {}
})
export const qualifying = writable<QualifyingType[]>([], function start(set) {
  parseCsvFile('data/qualifying.csv').then(set)
  return function stop() {}
})
export const races = writable<RaceType[]>([], function start(set) {
  parseCsvFile('data/races.csv').then(set)
  return function stop() {}
})
export const results = writable<ResultType[]>([], function start(set) {
  parseCsvFile('data/results.csv').then(results => set(results.filter(r => r.resultId?.length)))
  return function stop() {}
})
export const statuses = writable<StatusType[]>([], function start(set) {
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
	$statuses => {
    console.log($statuses)
    return arrayToObjectMap($statuses, "statusId")
  },
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