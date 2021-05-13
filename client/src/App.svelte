<script lang="ts">
  import { onMount } from "svelte"
  import parseCsvFile from './utils/parseCsvFile'
  import type {
    DriverType,
    QualifyingType,
    RaceType,
    ResultType,
  } from './utils/types'

  import Loading from "./Components/Loading.svelte"
  import QualifyingToResults from "./Components/QualifyingToResults/QualifyingToResults.svelte"
import arrayToObjectMap from "./utils/arrayToObjectMap";


  let drivers: DriverType[] = []
  let qualifying: QualifyingType[] = []
  let races: RaceType[] = []
  let results: ResultType[] = []

  onMount(async () => {
    //load all the data
    const result = await Promise.all([
      parseCsvFile('data/drivers.csv'),
      parseCsvFile('data/qualifying.csv'),
      parseCsvFile('data/races.csv'),
      parseCsvFile('data/results.csv'),
    ])
    drivers = result[0]
    qualifying = result[1] 
    races = result[2] 
    results = result[3].filter(r => r.resultId?.length)
  })

  $: isLoaded = drivers.length > 0


  //create an object that maps the race id to the race object
  $: raceIdMap = arrayToObjectMap(races, "raceId")

  //find the latest race
  //the accumulator in this case is the latest race or null
  $:latestRace = results.reduce((acc: RaceType | null, result) => {
    const race = raceIdMap[result.raceId] //get the race for this result
    return (
      acc === null || acc.date<race.date //if the acc is null OR this race's date is later
      ? race //return the later race
      : acc //else return the acc
    )
  }, null)
</script>

<main>
	<QualifyingToResults
    {drivers}
    {qualifying}
    {results}
  />

  <footer>
    <p>Data provided by <a href="https://www.kaggle.com/rohanrao" target="_blank" rel="noopener noreferrer">Vopani</a> on <a href="https://www.kaggle.com/rohanrao/formula-1-world-championship-1950-2020" target="_blank" rel="noopener noreferrer">Kaggle</a>. {#if latestRace} Last updated on {latestRace.date} at the {latestRace.name}. {/if}</p>
    <p>Github Repo: <a href="https://github.com/harryli0088/formula-one-visualizations" target="_blank" rel="noopener noreferrer">https://github.com/harryli0088/formula-one-visualizations</a></p>
  </footer>

  {#if !isLoaded}
    <Loading/>
  {/if}
</main>

<style>
  :global([data-svelte-typeahead] label) {
    font-size: 1em;
  }
  :global(.svelte-typeahead-list) {
    margin: 0;
    z-index: 2;
  }
</style>