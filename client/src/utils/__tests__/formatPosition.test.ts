import formatPosition from "../formatPosition"

test("numeric cases", () => {
  for(let i=1; i<30; ++i) {
    expect(formatPosition(i.toString())).toEqual(i.toString())
  }
})

test("DNF cases", () => {
  expect(formatPosition("")).toEqual("DNF")
  expect(formatPosition("\N")).toEqual("DNF")
  expect(formatPosition("ABC")).toEqual("DNF")
})