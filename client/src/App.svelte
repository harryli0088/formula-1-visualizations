<script lang="ts">
  import { onMount, afterUpdate } from "svelte";
  import { scaleBand, scaleLinear } from 'd3'
  import parseCsvFile from './utils/parseCsvFile'
  import type {
    ObjectMapType,
    DriverType,
    QualifyingType,
    RaceType,
    ResultType,
  } from './utils/types'


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

  $: possiblePositions = Array.from(new Set(results.map(r => r.position))).sort((a,b) => {
    const parsedA = parseInt(a)
    const parsedB = parseInt(b)
    if(isNaN(parsedA)) return 1
    if(isNaN(parsedB)) return -1
    return parsedA - parsedB
  })
  $: filteredQualifyings = qualifying.filter(q => q.position === positionFilter)
  $: filteredResults = filteredQualifyings.map(
    q => results.find(
      r => (
        q.raceId === r.raceId
        && q.driverId === r.driverId
      )
    )
  )
  $: ({
    distributionMap,
    maxValue,
  } = filteredResults.reduce((acc, r) => {
    if(acc.distributionMap[r.position] === undefined) acc.distributionMap[r.position] = 0 //initialize the value to 0 if we are encountering this key for the first time
    acc.distributionMap[r.position]++ //increment the count for this position

    if(acc.maxValue < acc.distributionMap[r.position]) acc.maxValue = acc.distributionMap[r.position]

    return acc
  }, {
    distributionMap: {},
    maxValue: 0
  }))
  $: data = possiblePositions.map(p => ({
    position: p,
    value: distributionMap[p] || 0
  }))

  $: colorScale = scaleLinear().domain([possiblePositions[0], possiblePositions[possiblePositions.length-3]]).range(["green", "white"])
  $: xScale = scaleBand().domain(possiblePositions).range([50, 500])
  $: yScale = scaleLinear().domain([0, maxValue]).range([500, 0])
  $: stackedScale = scaleLinear().domain([0, filteredResults.length]).range([500, 0])

  $: stackedData = data.map(d => ({ ...d, lastValue: 0 }))
  $: data.reduce((acc, d, i) => {
    stackedData[i].lastValue = acc
    acc += d.value
    return acc
  }, 0)

  afterUpdate(() => {
    console.log(stackedData)
  })
</script>

<main>
	<div>
    <select bind:value={positionFilter}>
      {#each possiblePositions as p}
        <option value={p}>{p}</option>
      {/each}
    </select>
  </div>
  <div>
    <svg width={500} height={500}>
      <g>
        {#each stackedData as d}
          <rect x={0} width={25} y={stackedScale(d.value + d.lastValue)} height={stackedScale(filteredResults.length - d.value)} fill={colorScale(d.position) || "grey"}/>
        {/each}
      </g>
      <g>
        {#each data as d}
          <rect x={xScale(d.position)} width={xScale.bandwidth()} y={yScale(d.value)} height={yScale(0) - yScale(d.value)} fill={colorScale(d.position) || "grey"}/>
        {/each}
      </g>
    </svg>
  </div>
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