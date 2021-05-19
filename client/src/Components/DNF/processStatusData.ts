import type { ObjectMapType } from "../../utils/arrayToObjectMap"
import type { ResultType, StatusType } from "../../utils/types"
import type { BarChartDataType } from "../BarChart/types"

export default function processStatusData(
  results: ResultType[],
  statusIdMap: ObjectMapType<StatusType>,
):BarChartDataType[] {
  //create an object that maps the status id to the numebr of times it's appeared
  const statusCounts = (() => {
    const counts: {[statusId: string]: number} = {}
    results.forEach(r => { //iterate through the results
      if(counts[r.statusId] === undefined) { //if we have not seen this status id yet
        counts[r.statusId] = 0 //initialize its value to zero
      }

      counts[r.statusId]++ //increment the value for this status id
    })

    return counts
  })()

  //convert the count map into array data for the bar chart
  return Object.entries(statusCounts).map(
    (d):BarChartDataType => {
      //convert the entries array into an object
      const label = statusIdMap[d[0]].status
      return {
        keys: [label],
        label, 
        values: [d[1]]
      }
    }
  ).sort(
    (a,b) => b.values[0] - a.values[0] //sort the array by values largest to smallest
  )
}