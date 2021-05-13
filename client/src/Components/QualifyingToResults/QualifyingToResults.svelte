<script lang="ts">
  import Typeahead from "svelte-typeahead"

  import fetchWikipediaImages from "../../utils/fetchWikipediaImages"
  import type { DriverType, QualifyingType, ResultType } from '../../utils/types'

  import QualToResBarChart from './QualToResBarChart.svelte'
  import QualToResMatrix from './QualToResMatrix.svelte'

  export let drivers: DriverType[] = []
  export let qualifying: QualifyingType[] = []
  export let results: ResultType[] = []

  let driverFilter: DriverType | null = null
  let driverFilterValue = ""
  const driverFilterNames = [
    "Lewis Hamilton", "Max Verstappen", "Valtteri Bottas", "Lando Norris", "Sergio Pérez"
  ]
  function setDriverFilters(driver: DriverType | null) {
    if(driver) {
      driverFilter = driver
      driverFilterValue = getFullDriverName(driver)
    }
    else {
      driverFilter = null
      driverFilterValue = ""
    }
  }
  const getFullDriverName = (d: DriverType) => `${d.forename} ${d.surname}` //used for Typeahead
  $: driversForFilterButtons = (
    () => {
      const tmpDrivers = drivers.filter(d => driverFilterNames.includes(getFullDriverName(d)))
      return driverFilterNames.map(name => tmpDrivers.find(d => name===getFullDriverName(d)))
    }
  )()

  // $: {
  //   if(driverFilter) {
  //     const title = driverFilter.url.slice(29) //str.indexOf("http://en.wikipedia.org/wiki/") + "http://en.wikipedia.org/wiki/".length
  //     fetchWikipediaImages(title).then(console.log)
  //   }
  // }
  $: driverFullName = driverFilter ? getFullDriverName(driverFilter) : ""
  $: getHoverText = (
    qualNum: number,
    qualPosition: string,
    resultNum: number,
    resultPosition: string,
  ) => {
    const resultPositionStr = (
      resultPosition === "DNF"
      ? `did not finish (DNF) the race`
      : `finished the race in position ${resultPosition}`
    )

    return `Out of ${qualNum} qualifyings in position ${qualPosition}, ${driverFullName || "drivers"} ${resultPositionStr} a total of ${resultNum} times (${Math.ceil(100*resultNum/qualNum)}%)`
  }

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
  <section class="qualifying-to-results">
    <h1>How do drivers' qualifying finishes correlate with their race results?</h1>

    <div>
      <p>F1 currently runs a <b>qualifying</b> session on the Saturday before each Sunday race to determine the race's starting lineup. Loosely, based on their fastest lap times, the drivers line up fastest to slowest, with the fastest driver in front (aka "pole position"). During the actual race, of course, drivers constantly change positions, and the final race results are usually different from the initial lineup. Given a driver who qualified first, what are their chances of finishing the race first? Explore the data below!</p>
    </div>
    <div class="filters">
      <Typeahead
        bind:value={driverFilterValue}
        data={drivers}
        extract={getFullDriverName}
        label="Filter by Driver"
        limit={5}
        on:select={e => setDriverFilters(e.detail.original)}
        on:clear={() => setDriverFilters(null)}
      />

      {#each driversForFilterButtons as d}
        {#if d}
          <button class="driver-filter-button" on:click={() => setDriverFilters(d)}>{getFullDriverName(d)}</button>
        {/if}
      {/each}

      
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
  .filters {
    display: flex;
  }

  .driver-filter-button {
    margin-left: 1em;
    margin-top: 1.5em;
    background-color: transparent;
    border-radius: 3px;
    border: 1px solid gray;
  }

  :global(.qualifying-to-results [data-svelte-search] input) {
    width: 200px;
    display: block;
    border-radius: 3px;
  }
</style>