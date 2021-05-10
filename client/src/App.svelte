<script lang="ts">
  import { onMount, afterUpdate } from "svelte";
  import arrayToObjectMap from './utils/arrayToObjectMap'
  import parseCsvFile from './utils/parseCsvFile'
  import type {
    ObjectMapType,
    DriverType,
    QualifyingType,
    RaceType,
    ResultType,
  } from './utils/types'


	export let name: string;

  let positionFilter = "1"
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
    results = result[3] 
  })

  $: possiblePositions = Array.from(new Set(results.map(r => r.position)))
  $: filteredQualifyings = qualifying.filter(q => q.position === positionFilter)
  $: filteredResults = filteredQualifyings.map(
    q => results.find(
      r => (
        q.raceId === r.raceId
        && q.driverId === r.driverId
      )
    )
  )
  $: distributionMap = filteredResults.reduce((acc, r) => {
    if(acc[r.position] === undefined) acc[r.position] = 0 //initialize the value to 0 if we are encountering this key for the first time
    acc[r.position]++ //increment the count for this position
    return acc
  }, {})

  afterUpdate(() => {
    console.log(distributionMap)
  })

  
</script>

<main>
	<select bind:value={positionFilter}>
    {#each possiblePositions as p}
      <option value={p}>{p}</option>
    {/each}
  </select>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>