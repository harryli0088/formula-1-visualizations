import arrayToObjectMap from "./utils/arrayToObjectMap"
import readCsvFile from "./utils/readCsvFile"

type ObjectMapType<T> = {
  [key:string]: T
}

type DriverType = {
  driverId: '854',
  driverRef: 'mick_schumacher',
  number: '47',
  code: 'MSC',
  forename: 'Mick',
  surname: 'Schumacher',
  dob: '1999-03-22',
  nationality: 'German',
  url: 'http://en.wikipedia.org/wiki/Mick_Schumacher'
}

type QualifyingType = {
  qualifyId: string,
  raceId: string,
  driverId: string,
  constructorId: string,
  number: string,
  position: string,
  q1: string,
  q2: string,
  q3: string,
}

type RaceType = {
  raceId: string,
  year: string,
  round: string,
  circuitId: string,
  name: string,
  date: string,
  time: string,
  url: string,
}

type ResultType = {
  resultId: string,
  raceId: string,
  driverId: string,
  constructorId: string,
  number: string,
  grid: string,
  position: string,
  positionText: string,
  positionOrder: string,
  points: string,
  laps: string,
  time: string,
  milliseconds: string,
  fastestLap: string,
  rank: string,
  fastestLapTime: string,
  fastestLapSpeed: string,
  statusId: string,
}

async function run() {
  const [
    drivers,
    qualifying,
    races,
    results,
  ]: [
    ObjectMapType<DriverType>,
    ObjectMapType<QualifyingType>,
    ObjectMapType<RaceType>,
    ObjectMapType<ResultType>,
  ] = await Promise.all([
    readCsvFile("drivers.csv").then(d => arrayToObjectMap(d, "driverId")),
    readCsvFile("qualifying.csv").then(d => arrayToObjectMap(d, "qualifyId")),
    readCsvFile("races.csv").then(d => arrayToObjectMap(d, "raceId")),
    readCsvFile("results.csv").then(d => arrayToObjectMap(d, "resultId")),
  ])

  console.log(Object.values(qualifying).filter(q => q.position === "1").map(q => drivers[q.driverId].surname))
}

run()