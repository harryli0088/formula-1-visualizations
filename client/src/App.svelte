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
</script>

<main>
	<QualifyingToResults
    {drivers}
    {qualifying}
    {results}
  />
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