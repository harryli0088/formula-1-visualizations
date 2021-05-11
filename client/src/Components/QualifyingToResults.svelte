<script lang="ts">
  import { afterUpdate } from "svelte";
  import { scaleBand, scaleLinear } from 'd3'
  import BarChart from "../Components/BarChart.svelte"
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
    key: p,
    value: relevantDistributionMap[p] || 0
  }))

  $: colorScale = scaleLinear().domain([possiblePositions[0], possiblePositions[possiblePositions.length-3]]).range(["green", "white"])
  $: colorFunction = (position: string) => colorScale(position) || "gray"

  $: resultPositionHover = data[resultPositionHoverIndex]
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
    <BarChart
      bind:keyHoverIndex={resultPositionHoverIndex}
      {colorFunction}
      {data}
      stackedTitle="Stacked Finishes"
      xTitle="Race Finish Position"
      yTitle="Number of Finishes"
    />
    <BarChart
      bind:keyHoverIndex={resultPositionHoverIndex}
      {colorFunction}
      {data}
      rotated
      stackedTitle="Stacked Finishes"
      xTitle="Race Finish Position"
      yTitle="Number of Finishes"
    />
    {#if resultPositionHover}
      <div>Out of {filteredResults.length} qualifyings in which a driver finished in position {possiblePositions[qualifyingPositionFilterIndex]}, {resultPositionHover.value} ({Math.ceil(100*resultPositionHover.value/filteredResults.length)}%) of those drivers finished the race in position {resultPositionHover.key}</div>
    {/if}
  </div>
</main>

<style>
</style>