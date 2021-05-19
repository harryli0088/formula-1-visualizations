import type { ObjectMapType } from "../../utils/arrayToObjectMap";
import type { RaceType, ResultType, StatusType } from "../../utils/types";
import type { BarChartDataType } from "../BarChart/types";

export default function processFinishVsFailureData(
  results: ResultType[],
  raceIdMap: ObjectMapType<RaceType>,
  statusIdMap: ObjectMapType<StatusType>,
  didFinish: (status: string) => boolean,
):BarChartDataType[] {
  return Object.entries(
    results.reduce((acc, result) => {
      const year = raceIdMap[result.raceId].year
      const status = statusIdMap[result.statusId].status

      if(acc[year] === undefined) { //if we have not seen this year yet
        acc[year] = {Finished: 0, DNF: 0} //initialize its counts
      }

      if(didFinish(status)) { //if this result finished
        acc[year].Finished++ //increment the finished count
      }
      else {
        acc[year].DNF++ //else increment the DNF count
      }


      return acc
    }, {} as {[year: string]: {Finished: number, DNF: number}})
  ).map(([year, counts]) => ({
    keys: Object.keys(counts),
    label: year.slice(2),
    values: Object.values(counts),
  }))
}