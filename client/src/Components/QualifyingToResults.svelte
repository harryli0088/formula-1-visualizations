<script lang="ts">
  import { afterUpdate } from "svelte";
  import { scaleBand, scaleLinear } from 'd3'
  import parseCsvFile from '../utils/parseCsvFile'
  import type {
    QualifyingType,
    ResultType,
  } from '../utils/types'


  export let possiblePositions: string[] = []
  export let qualifying: QualifyingType[] = []
  export let results: ResultType[] = []

  //2d array of qualifyings, where each row is all the qualifyings corresponding to its respective position
  $: qualifyingsForPositions = possiblePositions.map(p => qualifying.filter(q => q.position === p))

  //2d array of results, where each cell is the respective result of the originating qualifying
  $: resultsForQualifyings = qualifyingsForPositions.map(
    qRow => qRow.map(
      q => results.find(
        r => (
          q.raceId === r.raceId
          && q.driverId === r.driverId
        )
      )
    )
  )

  let qualifyingPositionFilterIndex:number = 0
  let resultPositionHoverIndex:number = -1

  $: distributionMaps = resultsForQualifyings.map(
    filteredResults => filteredResults.reduce((acc, r) => {
      if(acc.distributionMap[r.position] === undefined) acc.distributionMap[r.position] = 0 //initialize the value to 0 if we are encountering this key for the first time
      acc.distributionMap[r.position]++ //increment the count for this position

      if(acc.maxValue < acc.distributionMap[r.position]) acc.maxValue = acc.distributionMap[r.position]

      return acc
    }, { distributionMap: {}, maxValue: 0 })
  )
  
  $: filteredResults = resultsForQualifyings[qualifyingPositionFilterIndex] || []
  $: (
    {
      distributionMap: relevantDistributionMap,
      maxValue
    } = distributionMaps[qualifyingPositionFilterIndex] || { distributionMap: {}, maxValue: 0 }
  )
  $: data = possiblePositions.map(p => ({
    position: p,
    value: relevantDistributionMap[p] || 0
  }))

  $: colorScale = scaleLinear().domain([possiblePositions[0], possiblePositions[possiblePositions.length-3]]).range(["green", "white"])
  $: xScale = scaleBand().domain(possiblePositions).range([50, 500])
  $: yScale = scaleLinear().domain([0, maxValue]).range([500, 0])
  $: stackedScale = scaleLinear().domain([0, filteredResults.length || 0]).range([500, 0])

  $: stackedData = data.map(d => ({ ...d, lastValue: 0 }))
  $: data.reduce((acc, d, i) => {
    stackedData[i].lastValue = acc
    acc += d.value
    return acc
  }, 0)

  $: resultPositionHover = data[resultPositionHoverIndex]

  afterUpdate(() => {
    console.log(stackedData)
  })
</script>

<main>
	<div>
    <label for="qualifying-filter">Qualifying Position</label>
    <input
      id="qualifying-filter"
      on:change={e => qualifyingPositionFilterIndex = parseInt(e.target.value)}
      max={possiblePositions.length - 1}
      min={0} 
      type="range" 
      value={qualifyingPositionFilterIndex}
    /> {possiblePositions[qualifyingPositionFilterIndex]}
  </div>
  <div>
    <svg width={500} height={500}>
      <g>
        {#each stackedData as d, i}
          <rect
            fill={colorScale(d.position) || "grey"}
            height={stackedScale(filteredResults.length - d.value)}
            on:mouseover={e => resultPositionHoverIndex=i}
            on:mouseout={e => resultPositionHoverIndex=-1}
            width={25}
            x={0}
            y={stackedScale(d.value + d.lastValue)}
          />
        {/each}
      </g>
      <g>
        {#each data as d, i}
          <rect 
            fill={colorScale(d.position) || "grey"}
            height={yScale(0) - yScale(d.value)}
            on:mouseover={e => resultPositionHoverIndex=i}
            on:mouseout={e => resultPositionHoverIndex=-1}
            width={xScale.bandwidth()} 
            x={xScale(d.position)} 
            y={yScale(d.value)} 
          />
        {/each}
      </g>
    </svg>
    {#if resultPositionHover}
      <div>Out of {filteredResults.length} drivers who finished qualifying in position {possiblePositions[qualifyingPositionFilterIndex]}, {resultPositionHover.value} ({Math.round(100*resultPositionHover.value/filteredResults.length)}%) finished the actual race in position {resultPositionHover.position}</div>
    {/if}
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