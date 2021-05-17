<script lang="ts">

  import arrayToObjectMap from "../../utils/arrayToObjectMap"
  import type { CircuitType, DriverType, QualifyingType, RaceType, ResultType } from '../../utils/types'
  import fetchWikipediaImages from "../../utils/fetchWikipediaImages"
  import getPositionsRange from "../../utils/getPositionsRange";
  import type { ObjectMapType } from "../../utils/arrayToObjectMap";

  import QualToResBarChart from './QualToResBarChart.svelte'
  import QualToResMatrix from './QualToResMatrix.svelte'
  import TypeaheadFilters from "./TypeaheadFilters.svelte";


  export let circuits: CircuitType[] = []
  export let drivers: DriverType[] = []
  export let latestRace: RaceType | null = null
  export let qualifying: QualifyingType[] = []
  export let raceIdMap: ObjectMapType<RaceType> = {}
  export let races: RaceType[] = []
  export let results: ResultType[] = []

  $: circuitIdMap = arrayToObjectMap(circuits, "circuitId")

  let circuitFilter: CircuitType | null = null
  const getCircuitName = (circuit: CircuitType) => `${circuit.name}, ${circuit.country}`
  const setCircuitFilter = (circuit: CircuitType | null) => circuitFilter = circuit
  $: circuitFilterButtons = (() => {
    const nowTime = new Date().getTime()
    return races.filter(
      r => new Date(r.date).getTime() - nowTime + 1.728e+8 > 0
    ).sort(
      (a: RaceType, b: RaceType) => a.date>b.date ? 1 : -1
    ).slice(0,2).map(r => getCircuitName(circuitIdMap[r.circuitId]))
  })()

  let driverFilter: DriverType | null = null
  const getFullDriverName = (d: DriverType) => `${d.forename} ${d.surname}`
  const setDriverFilter = (driver: DriverType | null) => driverFilter = driver


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
  $: filteredQualifying = qualifying.filter(q => (
    (circuitFilter===null || raceIdMap[q.raceId]?.circuitId === circuitFilter.circuitId) //matching circuit
    && (driverFilter===null || q.driverId === driverFilter.driverId) //matching driver
  ))
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

<main class="qualifying-to-results">
  <header>
    <div class="img-container">
      <img src="redbull.jpg" alt="redbull"/>
      <p>Photo from <a href="https://www.formula1.com/en/latest/article.tech-tuesday-why-red-bull-could-hit-the-ground-running-in-2020.4h5ZgPepX96WB0HsianTBT.html" target="_blank" rel="noopener noreferrer">Formula 1</a></p>
    </div>
    <div class="heading-text">
      <h1>How do drivers' qualifying finishes correlate with their race results?</h1>
    </div>
  </header>

  <section>
    <div>
      <p>F1 currently runs a <b>qualifying</b> session on the Saturday before each Sunday race to determine the race's starting lineup. Loosely, based on their best lap times, the drivers line up fastest to slowest, with the fastest driver in front (aka "pole position"). During the actual race, of course, drivers constantly change positions, and the final race results are usually different from the initial lineup. Given a driver who qualified first, what are their chances of finishing the race first? Explore the data below! {#if latestRace } (Up-to-date to the {latestRace.date} {latestRace.name}) {/if}</p>
    </div>

    <TypeaheadFilters
      data={circuits}
      extract={getCircuitName}
      filterButtons={circuitFilterButtons}
      label="Filter by Circuit"
      setFilter={setCircuitFilter}
    />

    <TypeaheadFilters
      data={drivers}
      extract={getFullDriverName}
      filterButtons={[
        "Lewis Hamilton", "Max Verstappen", "Valtteri Bottas", "Lando Norris", "Sergio Pérez"
      ]}
      label="Filter by Driver"
      setFilter={setDriverFilter}
    />

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
  header {
    background: #34495E;
    min-height: 80vh;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  header > * {
    width: calc(50% - 0.5em);
  }
  @media only screen and (max-width: 800px) {
    header {
      flex-direction: column;
      justify-content: center;
    }
    header > * {
      width: 100%;
    }

  }

  .img-container img {
    width: 100%;
  }
  .img-container p {
    font-style: italic;
    font-size: 12px;
    text-align: center;
    color: #bbb;
    letter-spacing: 1px;
    margin-top: 0;
  }

  header h1 {
    font-weight: normal;
    letter-spacing: 1px;
    font-size: 25px;
  }
</style>
