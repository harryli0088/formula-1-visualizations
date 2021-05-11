<script lang="ts">
  import { scaleLinear } from 'd3'
  import BarChart from "../BarChart.svelte"
  import type { ResultType } from '../../utils/types'
  import type { DistributionMapType } from './types';


  export let distributionMaps:DistributionMapType[] = []
  export let possiblePositions: string[] = []
  export let resultsForQualifyings: ResultType[][] = []


  let qualifyingPositionFilterIndex:number = 0 //the current qualifying position to look at
  let resultPositionHoverIndex:number = -1 //the current result index being hovered over
  
  $: filteredResults = resultsForQualifyings[qualifyingPositionFilterIndex] || [] //get the results for this qualifying
  $: relevantDistributionMap = distributionMaps[qualifyingPositionFilterIndex] || {} //get the distribution map for this qualifying
  $: data = possiblePositions.map(p => ({ //map over all the positions to make bar chart data
    key: p,
    value: relevantDistributionMap[p] || 0
  }))

  $: colorScale = scaleLinear().domain([possiblePositions[0], possiblePositions[possiblePositions.length-3]]).range(["green", "white"])
  $: colorFunction = (position: string) => colorScale(position) || "gray"

  $: resultPositionHover = data[resultPositionHoverIndex] //get the bar chart result data being hovered over
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
    {:else}
      Hover over the chart to see more!
    {/if}
  </div>
</main>

<style>
</style>