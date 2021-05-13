import getPositionsRange from "../getPositionsRange"

const defaultRow = {
  "constructorId": "",
  "driverId": "",
  "number": "",
  //"position": "",
  "q1": "1:26.572",
  "q2": "1:25.187",
  "q3": "1:26.714",
  "qualifyId": "",
  "raceId": "",
}

test("empty array", () => {
  expect(getPositionsRange([])).toEqual([])
})

test("undefineds are ignored", () => {
  expect(getPositionsRange([{...defaultRow},{...defaultRow},{...defaultRow}])).toEqual([])
})

test("one position", () => {
  expect(
    getPositionsRange([{...defaultRow, position: "3"}])
  ).toEqual(["3"])
})

test("multiple positions with gaps", () => {
  expect(
    getPositionsRange([{...defaultRow, position: "3"}, {...defaultRow, position: "7"}])
  ).toEqual(["3","4","5","6","7"])
})

test("one DNF", () => {
  expect(
    getPositionsRange([{...defaultRow, position: "\N"}])
  ).toEqual(["\N"])

  expect(
    getPositionsRange([{...defaultRow, position: "ABC"}])
  ).toEqual(["ABC"])
})


test("multiple positions, multiple DNF", () => {
  expect(
    getPositionsRange([
      {...defaultRow, position: "2"},{...defaultRow, position: "9"},{...defaultRow, position: "1"},
      {...defaultRow, position: "\N"},{...defaultRow, position: "5"},{...defaultRow, position: "\N"}
    ])
  ).toEqual(["1","2","3","4","5","6","7","8","9","\N"])
})