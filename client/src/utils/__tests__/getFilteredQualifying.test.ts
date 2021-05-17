import {
  DEFAULT_CIRCUIT,
  DEFAULT_DRIVER,
  DEFAULT_QUALIFYING,
  DEFAULT_RACE
} from "../testUtils"
import getFilteredQualifyings from "../getFilteredQualifyings"

test("can handle empty array", () => {
  expect(
    getFilteredQualifyings([], {}, null, null)
  ).toStrictEqual([])
})

test("can handle no filters", () => {
  expect(
    getFilteredQualifyings(
      [ DEFAULT_QUALIFYING, DEFAULT_QUALIFYING ], {}, null, null
    )
  ).toStrictEqual([DEFAULT_QUALIFYING,DEFAULT_QUALIFYING])
})

test("circuit filter only", () => {
  const qual1 = {...DEFAULT_QUALIFYING, raceId: "1", driverId: "1"}
  const qual2 = {...DEFAULT_QUALIFYING, raceId: "0", driverId: "2"}
  const qual3 = {...DEFAULT_QUALIFYING, raceId: "2", driverId: "3"}

  const raceIdMap = {
    0: {...DEFAULT_RACE, raceId: "0", circuitId: "0"}
  }
  const circuit = {...DEFAULT_CIRCUIT, circuitId: "0"}

  expect(
    getFilteredQualifyings(
      [ qual1, qual2, qual3 ], raceIdMap, circuit, null
    )
  ).toStrictEqual([qual2])
})


test("driver filter only", () => {
  const qual1 = {...DEFAULT_QUALIFYING, raceId: "1", driverId: "1"}
  const qual2 = {...DEFAULT_QUALIFYING, raceId: "2", driverId: "0"}
  const qual3 = {...DEFAULT_QUALIFYING, raceId: "3", driverId: "0"}

  const driver = {...DEFAULT_DRIVER, driverId: "0"}

  expect(
    getFilteredQualifyings(
      [ qual1, qual2, qual3 ], {}, null, driver
    )
  ).toStrictEqual([qual2, qual3])
})


test("circuit and driver filters", () => {
  const qual1 = {...DEFAULT_QUALIFYING, raceId: "0", driverId: "0"}
  const qual2 = {...DEFAULT_QUALIFYING, raceId: "0", driverId: "1"}
  const qual3 = {...DEFAULT_QUALIFYING, raceId: "0", driverId: "2"}
  const qual4 = {...DEFAULT_QUALIFYING, raceId: "1", driverId: "0"}
  const qual5 = {...DEFAULT_QUALIFYING, raceId: "1", driverId: "1"}
  const qual6 = {...DEFAULT_QUALIFYING, raceId: "1", driverId: "2"}
  const qual7 = {...DEFAULT_QUALIFYING, raceId: "2", driverId: "0"}
  const qual8 = {...DEFAULT_QUALIFYING, raceId: "2", driverId: "1"}
  const qual9 = {...DEFAULT_QUALIFYING, raceId: "2", driverId: "2"}

  const raceIdMap = {
    1: {...DEFAULT_RACE, raceId: "1", circuitId: "1"}
  }
  const circuit = {...DEFAULT_CIRCUIT, circuitId: "1"}

  const driver = {...DEFAULT_DRIVER, driverId: "2"}

  expect(
    getFilteredQualifyings(
      [ qual1, qual2, qual3, qual4, qual5, qual6, qual7, qual8, qual9 ], raceIdMap, circuit, driver
    )
  ).toStrictEqual([qual6])
})