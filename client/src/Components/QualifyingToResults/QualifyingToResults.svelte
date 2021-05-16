<script lang="ts">
  import Typeahead from "svelte-typeahead"
  import Icon from 'fa-svelte'
  import { faTimes } from '@fortawesome/free-solid-svg-icons'

  import fetchWikipediaImages from "../../utils/fetchWikipediaImages"
  import getPositionsRange from "../../utils/getPositionsRange";
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
    ():DriverType[] => {
      const unorderedDrivers = drivers.filter( //get the target drivers in an unordered array
        d => driverFilterNames.includes(getFullDriverName(d))
      )
      return driverFilterNames.map(
        name => unorderedDrivers.find(d => name===getFullDriverName(d)) //order the drivers
      ).filter(d => d) //filter out any missing drivers
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


  //create an object that maps all the qualifying ids to the respective result
  //this is only run once when the qualifying data loads
  $: qualIdToResult = qualifying.reduce((acc, q) => {
    acc[q.qualifyId] = results.find( //find and set the result
      r => ( //given the result
        q.raceId === r.raceId //must have the same race id
        && q.driverId === r.driverId //must have the same driver id
      )
    )
    return acc
  }, {} as {[qualifyId: string]: ResultType})

  //filter the qualifyings based on the driver
  $: filteredQualifying = qualifying.filter(q => driverFilter===null || q.driverId === driverFilter.driverId)
  $: fitleredResults = filteredQualifying.map(q => qualIdToResult[q.qualifyId]).filter(r => r)


  
  $: resultPositions = getPositionsRange(fitleredResults) //array of positions from results
  $: qualifyingPositions = getPositionsRange(filteredQualifying) //array of positions from qualifying

  //create a default distribution map where each position has a value of 0
  //ie { 1: 0, 2: 0, 3: 0, ... "\N": 0 }
  $: defaultDistributionMap = resultPositions.reduce((acc, p) => {
    acc[p] = 0
    return acc
  }, {})

  //2d array of qualifyings, where each row is all the qualifyings corresponding to its respective position
  //qualifyingsForPositions[qualifyingIndex] = [qualifyings for the given qualifyingIndex]
  $: qualifyingsForPositions = qualifyingPositions.map(p => filteredQualifying.filter(q => q.position === p))

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
      <p>F1 currently runs a <b>qualifying</b> session on the Saturday before each Sunday race to determine the race's starting lineup. Loosely, based on their best lap times, the drivers line up fastest to slowest, with the fastest driver in front (aka "pole position"). During the actual race, of course, drivers constantly change positions, and the final race results are usually different from the initial lineup. Given a driver who qualified first, what are their chances of finishing the race first? Explore the data below!</p>
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

      <div class="driver-filter-buttons-container">
        {#each driversForFilterButtons as d}
          <button class="driver-filter-button" on:click={() => setDriverFilters(d)}>{getFullDriverName(d)}</button>
        {/each}

        {#if driversForFilterButtons.length > 0 && driverFilterValue}
          <span class="clear-driver-filter-button" on:click={() => setDriverFilters(null)}>
            <Icon icon={faTimes}/>
          </span>
        {/if}
      </div>
    </div>

    <hr/>

    <QualToResBarChart
      {distributionMaps}
      {getHoverText}
      {qualifyingPositions}
      {resultPositions}
      {resultsForPositions}
    />

    <br/>
    <hr/>

    <QualToResMatrix
      {distributionMaps}
      {getHoverText}
      {qualifyingPositions}
      {resultPositions}
    />
  </section>
</main>

<style>
  .filters {
    display: flex;
    flex-wrap: wrap;
  }

  :global(.qualifying-to-results [data-svelte-search]) {
    margin-right: 1em;
  }

  :global(.qualifying-to-results [data-svelte-search] input) {
    width: 200px;
    display: block;
    border-radius: 3px;
  }

  @media only screen and (max-width: 600px) {
    .filters {
      display: block;
    }

    :global(.qualifying-to-results [data-svelte-search] input) {
      width: 100%;
    }
  }

  .driver-filter-buttons-container {
    margin-top: 1.5em;
    align-items: center;
    display: flex;
    flex-wrap: wrap;
  }

  .driver-filter-button {
    margin-right: 0.5em;
    background-color: transparent;
    border-radius: 3px;
    border: 1px solid gray;
    color: #555;
  }

  .clear-driver-filter-button {
    cursor: pointer;
    transition: 0.5s;
  }
  .clear-driver-filter-button:hover {
    transform: scale(1.2);
  }
</style>