import type { RaceType } from "./types";

/**
 * Return the array of races (sorted by date) that happened recently or will happen in the near future.
 * This is useful for getting the races that recently happened or will happen soon.
 * @param races           array of races
 * @param maxCount        maximum number of races to return
 * @param pastTimeBuffer  how far back in time a race can be
 * @returns               array of nearby rances
 */
export default function getNearbyRaces(
  races: RaceType[],
  maxCount: number = 2,
  pastTimeBuffer: number = 1.728e+8,
) {
  const nowTime = new Date().getTime() //get the current time

  return races.filter(
    r => new Date(r.date).getTime() - nowTime + pastTimeBuffer > 0 //fitler by races that happened 2 days ago or later
  ).sort(
    (a: RaceType, b: RaceType) => a.date>b.date ? 1 : -1 //sort in chronological order
  ).slice(0,maxCount)
}