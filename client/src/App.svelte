<script lang="ts">
  import { onMount } from "svelte";
  import parseCsvFile from './utils/parseCsvFile'
  import type {
    DriverType,
    QualifyingType,
    RaceType,
    ResultType,
  } from './utils/types'
import QualifyingToResults from "./Components/QualifyingToResults.svelte";


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

  $: possiblePositions = Array.from(new Set(results.map(r => r.position))).sort((a,b) => {
    const parsedA = parseInt(a)
    const parsedB = parseInt(b)
    if(isNaN(parsedA)) return 1
    if(isNaN(parsedB)) return -1
    return parsedA - parsedB
  })
</script>

<main>
	<QualifyingToResults
    {possiblePositions}
    {qualifying}
    {results}
  />
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>