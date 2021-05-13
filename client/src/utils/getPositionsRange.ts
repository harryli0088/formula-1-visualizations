import type { QualifyingType, ResultType } from "./types"

/**
 * Given an array of qualifying or results data,
 * return an array of unique and sorted positions
 * @param data  qualifying or results data
 */
export default function getPositionsRange(data: (QualifyingType | ResultType)[]) {
  let min = null
  let max = null
  let dnf = "" //initially assume there is no DNF

  data.forEach(d => {
    const position = d.position
    if(position) {
      const value = parseInt(position)
      if(value) {
        if(min>value || min===null) { //if we have encountered a new min
          min = value //set the new min value
        }
        if(max<value || max===null) { //if we have encountered a new max
          max = value //set the new max value
        }
      }
      else { //ASSUME this is a DNF
        if(dnf && dnf!==position) { //if we have already encoutnered a DNF and are now encountering a different string
          console.warn(`Unexpectedly encountered multiple non-integer positions '${dnf}' and '${position}'.`)
        }

        dnf = position //mark that we have encountered a DNF
      }
    }
  })

  const positions:string[] = []

  if(min!==null && max!==null) { //if we have encountered maxes and mins
    for(let i=min; i<=max; ++i) { //iterate through the range between the min and max
      positions.push(i.toString()) //push this position as a string
    }
  }

  if(dnf) { //if we encountered a DNF
    positions.push(dnf) //push the DNF string
  }

  return positions
}