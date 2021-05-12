<script lang="ts">
  import { onMount } from "svelte";
  import parseCsvFile from './utils/parseCsvFile'
  import type {
    DriverType,
    QualifyingType,
    RaceType,
    ResultType,
  } from './utils/types'
  import QualifyingToResults from "./Components/QualifyingToResults/QualifyingToResults.svelte";


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


  //create an object that maps the race id to the race object
  $: raceIdMap = races.reduce((acc,r) => {
    acc[r.raceId] = r
    return acc
  }, {} as {[raceId: string]: RaceType})

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
    {#if latestRace}
      <hr/>
      <div>Data last updated on {latestRace.date} at the {latestRace.name}</div>
    {/if}
  </footer>
</main>

<style>
  :global([data-svelte-typeahead] label) {
    font-size: 1em;
  }
  :global(.svelte-typeahead-list) {
    margin: 0;
    z-index: 2;
  }

  footer {
    padding: 1em;
  }
</style>