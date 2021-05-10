export type ObjectMapType<T> = {
  [key:string]: T
}

export type DriverType = {
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

export type QualifyingType = {
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

export type RaceType = {
  raceId: string,
  year: string,
  round: string,
  circuitId: string,
  name: string,
  date: string,
  time: string,
  url: string,
}

export type ResultType = {
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