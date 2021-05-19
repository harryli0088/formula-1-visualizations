import type { ObjectMapType } from "../../utils/arrayToObjectMap";
import type { ResultType, StatusType } from "../../utils/types";

export default function processFinishVsFailureData(
  results: ResultType[],
  statusIdMap: ObjectMapType<StatusType>,
  didFinish: (status: string) => boolean,
) {
  return Object.entries(
    results.reduce((acc, r) => {
      if(didFinish(statusIdMap[r.statusId].status)) { //if this result finished
        acc.Finished++ //increment the finished count
      }
      else {
        acc.DNF++ //else increment the DNF count
      }
      return acc
    }, {Finished: 0, DNF: 0})
  ).map(([key, value]) => ({key, value}))
}