<script lang="ts">
  import Typeahead from "svelte-typeahead"
  import type { DriverType, QualifyingType, ResultType } from '../../utils/types'
  import QualToResBarChart from './QualToResBarChart.svelte'
  import QualToResMatrix from './QualToResMatrix.svelte'

  export let drivers: DriverType[] = []
  export let qualifying: QualifyingType[] = []
  export let results: ResultType[] = []


  const getFullDriverName = (d: DriverType) => `${d.forename} ${d.surname}` //used for Typeahead

  let driverFilter: DriverType | null = null
  $: driverFullName = driverFilter ? getFullDriverName(driverFilter) : ""
  $: getHoverText = (
    qualNum: number,
    qualPosition: string,
    resultNum: number,
    resultPosition: string,
  ) => (
    `Out of ${qualNum} qualifyings in position ${qualPosition}, ${driverFullName || "drivers"} finished the race in position ${resultPosition} a total of ${resultNum} times (${Math.ceil(100*resultNum/qualNum)}%)`
  )

  //filter the qualifyings based on the driver
  $: filteredQualifying = qualifying.filter(q => driverFilter===null || q.driverId === driverFilter.driverId)

  //create an object that maps the qualifying id to the result
  $: qualIdToResult = filteredQualifying.reduce((acc, q) => {
    acc[q.qualifyId] = results.find( //find and set the result
      r => ( //given the result
        q.raceId === r.raceId //must have the same race id
        && q.driverId === r.driverId //must have the same driver id
      )
    )
    return acc
  }, {} as {[qualifyId: string]: ResultType})

  $: fitleredResults = filteredQualifying.map(q => qualIdToResult[q.qualifyId]).filter(r => r)

  //create an array of all the possible positions given the filtered results
  $: possiblePositions = Array.from( //convert the Set into an Array
    new Set( //create a new Set to get rid of duplicates
      fitleredResults.map(r => r.position) //create an array of all the result positions
    )
  ).sort((a,b) => { //sort the positions so that the numbers come first, followed by "\N"
    const parsedA = parseInt(a)
    const parsedB = parseInt(b)
    if(isNaN(parsedA)) return 1 //if a is not a number
    if(isNaN(parsedB)) return -1 //if b is not a number
    return parsedA - parsedB //else both are numbers, return the difference
  })
  $: numericPositions = possiblePositions.filter(p => !isNaN(parseInt(p)))

  //create a default distribution map where each position has a value of 0
  //ie { 1: 0, 2: 0, 3: 0, ... "\N": 0 }
  $: defaultDistributionMap = possiblePositions.reduce((acc, p) => {
    acc[p] = 0
    return acc
  }, {})

  //2d array of qualifyings, where each row is all the qualifyings corresponding to its respective position
  //qualifyingsForPositions[qualifyingIndex] = [qualifyings for the given qualifyingIndex]
  $: qualifyingsForPositions = numericPositions.map(p => filteredQualifying.filter(q => q.position === p))

  //2d array of results, where each cell is the respective result of the originating qualifying
  //resultsForPositions[qualifyingIndex] = [results for the given qualifyingIndex]
  $: resultsForPositions = qualifyingsForPositions.map(
    qRow => qRow.map(
      q => qualIdToResult[q.qualifyId]
    )
  )

  //array of distribution maps that sum the results for the given qualifying
  //distributionMaps[qualifyingIndex] = for the given qualifyingIndex, a key-value object { [position]: number of results that ended in this position  }
  $: distributionMaps = resultsForPositions.map(
    filteredResults => filteredResults.reduce((acc, r) => {
      if(acc[r.position] === undefined) { //if this is an unexpected position
        console.warn(`Encountered unexpected position ${r.position}`)
      }
      else {
        acc[r.position]++ //increment the count for this position
      }

      return acc
    }, JSON.parse(JSON.stringify(defaultDistributionMap)))
  )

</script>

<main>
  <section>
    <h1>How do drivers' qualifying finishes correlate with their race results?</h1>
    <div>
      <Typeahead
        data={drivers}
        extract={getFullDriverName}
        label="Filter by Driver"
        limit={5}
        on:select={e => driverFilter = e.detail.original}
        on:clear={() => driverFilter = null}
      />
    </div>

    <hr/>

    <QualToResBarChart
      {distributionMaps}
      {getHoverText}
      {numericPositions}
      {possiblePositions}
      {resultsForPositions}
    />

    <br/>
    <hr/>

    <QualToResMatrix
      {distributionMaps}
      {getHoverText}
      {numericPositions}
      {possiblePositions}
    />
  </section>
</main>

<style>
</style>