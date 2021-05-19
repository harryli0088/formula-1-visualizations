import type { ObjectMapType } from "../../utils/arrayToObjectMap";
import type { ResultType, StatusType } from "../../utils/types";
import type { BarChartDataType } from "../BarChart/types";

export default function processFinishVsFailureData(
  results: ResultType[],
  statusIdMap: ObjectMapType<StatusType>,
  didFinish: (status: string) => boolean,
):BarChartDataType[] {
  return Object.entries(
    results.reduce((acc, r) => {
      const status = statusIdMap[r.statusId]?.status
      
      if(status) { //if our data is loaded
        if(didFinish(status)) { //if this result finished
          acc.Finished++ //increment the finished count
        }
        else {
          acc.DNF++ //else increment the DNF count
        }
      }

      return acc
    }, {Finished: 0, DNF: 0})
  ).map(([key, value]) => ({
    keys: [key],
    label: key,
    values: [value],
  }))
}