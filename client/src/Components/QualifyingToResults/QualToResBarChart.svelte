<script lang="ts">
  // import Icon from 'fa-svelte'
  // import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons' //<Icon icon={faQuestionCircle}/>
  import { scaleLinear } from 'd3'

  import BarChart from "../BarChart.svelte"
  import type { DistributionMapType } from './types'

  import formatPosition from '../../utils/formatPosition'
  import type { ResultType } from '../../utils/types'


  export let distributionMaps:DistributionMapType[] = []
  export let getHoverText: (
    qualNum: number,
    qualPosition: string,
    resultNum: number,
    resultPosition: string,
  ) => string = (qualNum, qualPosition, resultNum, resultPosition) => ""
  export let numericPositions: string[] = []
  export let possiblePositions: string[] = []
  export let resultsForPositions: ResultType[][] = []


  let qualifyingPositionFilterIndex:number = 0 //the current qualifying position to look at
  $: {
    //going from all drivers to a driver with a smaller spread of qualifying positions would make qualifyingPositionFilterIndex too big
    //if it is too big, we want to set it back to 0
    if(resultsForPositions[qualifyingPositionFilterIndex] === undefined) { //if the qualifying position filter is invalid
      qualifyingPositionFilterIndex = 0 //set it to zero
    }
  }
  let resultPositionHoverIndex:number = -1 //the current result index being hovered over
  let rotated: boolean = false
  
  $: filteredResults = resultsForPositions[qualifyingPositionFilterIndex] || [] //get the results for this qualifying
  $: relevantDistributionMap = distributionMaps[qualifyingPositionFilterIndex] || {} //get the distribution map for this qualifying
  $: data = possiblePositions.map(p => ({ //map over all the positions to make bar chart data
    key: formatPosition(p),
    value: relevantDistributionMap[p] || 0
  }))

  $: colorScale = scaleLinear().domain([numericPositions[0], numericPositions[numericPositions.length-1]]).range(["green", "#E9F7EF"])
  $: colorFunction = (position: string) => colorScale(position) || "gray"

  $: resultPositionHover = data[resultPositionHoverIndex] //get the bar chart result data being hovered over
</script>

<main>
  <h3>Race Results Given a Qualifying Position</h3>
	<div>Qualifying Position:</div>
  <div class="positions-container">
    {#each numericPositions as p,i}
      <span class="position-option-container">
        <span
          class={`position-option ${qualifyingPositionFilterIndex===i ? "selected" : ""}`}
          on:click={e => qualifyingPositionFilterIndex = i}
        >{p}</span>
      </span>
    {/each}
  </div>
  <div>Rotate Chart <input type="checkbox" bind:checked={rotated}/></div>

  <div>
    <BarChart
      bind:keyHoverIndex={resultPositionHoverIndex}
      {colorFunction}
      {data}
      {rotated}
      stackedTitle="Stacked Together"
      xTitle="Race Finish Position"
      yTitle={`Number of Finishes (total ${filteredResults.length})`}
    />
    {#if resultPositionHover}
      <div>{getHoverText(filteredResults.length, possiblePositions[qualifyingPositionFilterIndex], resultPositionHover.value, resultPositionHover.key)}</div>
    {:else}
      Hover over the chart to see more!
    {/if}
  </div>
</main>

<style>
  .positions-container {
    margin-top: 0.5em;
  }

  .position-option-container {
    display: inline-block;
  }

  .position-option {
    border: 1px solid gray;
    border-radius: 50%;
    height: 1.75em;
    width: 1.75em;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-bottom: 0.5em;
    margin-right: 0.5em;
    transition: 0.5s;
  }
  .position-option:hover {
    transform: scale(1.2);
  }
  .position-option:active {
    transform: scale(0.9);
  }
  .position-option.selected {
    border-color: green;
    background-color: green;
    color: white;
    font-weight: bold;
  }
</style>