<script lang="ts">
  import Icon from 'fa-svelte'
  import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
  import { scaleLinear } from 'd3'

  import BarChart from "../BarChart/BarChart.svelte"
  import Popover from '../Popover.svelte'
  import type { DistributionMapType } from './types'

  import formatPosition from '../../utils/formatPosition'
  import type { ResultType } from '../../utils/types'
  import type { BarChartDataType } from '../BarChart/types'


  export let distributionMaps:DistributionMapType[] = []
  export let getHoverText: (
    qualNum: number,
    qualPosition: string,
    resultNum: number,
    resultPosition: string,
  ) => string = (qualNum, qualPosition, resultNum, resultPosition) => ""
  export let qualifyingPositions: string[] = []
  export let resultPositions: string[] = []
  export let resultsForPositions: ResultType[][] = []


  let qualifyingPositionFilterIndex:number = 0 //the current qualifying position to look at
  $: {
    //going from all drivers to a driver with a smaller spread of qualifying positions would make qualifyingPositionFilterIndex too big
    //if it is too big, we want to set it back to 0
    if(resultsForPositions[qualifyingPositionFilterIndex] === undefined) { //if the qualifying position filter is invalid
      qualifyingPositionFilterIndex = 0 //set it to zero
    }
  }
  $: popoverText = `Given all the drivers who qualified in position ${qualifyingPositions[qualifyingPositionFilterIndex]}, this chart plots the distribution of their race finishes.`

  let hover = {labelIndex: -1, keyIndex: -1}
  let rotated: boolean = false

  $: qualifyingPositionsFilterData = qualifyingPositions.map((position,i) => { //get meta data for qualifying position filters
    const disabled = resultsForPositions[i].length === 0
    return {
      disabled,
      onClick: () => {
        if(!disabled) {
          qualifyingPositionFilterIndex = i
        }
      },
      position,
      selected: qualifyingPositionFilterIndex===i,
    }
  })
  
  $: filteredResults = resultsForPositions[qualifyingPositionFilterIndex] || [] //get the results for this qualifying
  $: relevantDistributionMap = distributionMaps[qualifyingPositionFilterIndex] || {} //get the distribution map for this qualifying
  $: data = resultPositions.map((p): BarChartDataType => {
    const label = formatPosition(p)
    return { //map over all the positions to make bar chart data
      keys: [label],
      label,
      values: [relevantDistributionMap[p] || 0]
    }
  })

  $: colorScale = scaleLinear().domain([qualifyingPositions[0], qualifyingPositions[qualifyingPositions.length-1]]).range(["green", "#E9F7EF"])
  $: colorFunction = (position: string) => colorScale(position) || "gray"

  $: hoveredResultData = data[hover.labelIndex] //get the bar chart result data being hovered over

  let barChartContainerWidth: number = 0
  $: allowRotateToggle = barChartContainerWidth >= 700
</script>

<main>
  <h3>
    Race Results Given a Qualifying Position
    <Popover content={popoverText}>
      <Icon icon={faQuestionCircle}/>
    </Popover>
  </h3>

	<div>Qualifying Position:</div>
  <div class="positions-container">
    {#each qualifyingPositionsFilterData as d}
      <span class="position-option-container">
        <span
          class={`position-option ${
            d.selected ? "selected" : ""
          }${
            d.disabled ? "disabled" : ""
          }`}
          on:click={d.onClick}
        >{d.position}</span>
      </span>
    {/each}
  </div>
  {#if allowRotateToggle}
    <div>Rotate Chart <input type="checkbox" bind:checked={rotated}/></div>
  {/if}

  <div bind:clientWidth={barChartContainerWidth}>
    <BarChart
      bind:hover={hover}
      {colorFunction}
      {data}
      rotated={!allowRotateToggle || rotated}
      stackedTitle="Stacked Together"
      xTitle="Race Finish Position"
      yTitle={`Number of Finishes (total ${filteredResults.length})`}
    />
    {#if hoveredResultData}
      <div>{getHoverText(filteredResults.length, resultPositions[qualifyingPositionFilterIndex], hoveredResultData.values[hover.keyIndex], hoveredResultData.keys[hover.keyIndex])}</div>
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
  .position-option.disabled {
    user-select: none;
    transform: none;
    cursor: not-allowed;
    border-color: #ddd;
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 4px,
      #ddd 4px,
      #ddd 7px
    );
  }
</style>