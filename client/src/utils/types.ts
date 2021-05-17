export type CircuitType = {
  alt: string,
  circuitId: string,
  circuitRef: string,
  country: string,
  lat: string,
  lng: string,
  location: string,
  name: string,
  url: string,
}

export type DriverType = {
  driverId: string,
  driverRef: string,
  number: string,
  code: string,
  forename: string,
  surname: string,
  dob: string,
  nationality: string,
  url: string,
}

export type QualifyingType = {
  qualifyId: string,
  raceId: string,
  driverId: string,
  constructorId: string,
  number: string,
  position?: string,
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
  position?: string,
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