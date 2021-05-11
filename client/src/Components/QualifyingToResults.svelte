<script lang="ts">
  import { scaleLinear } from 'd3'
import { xlink_attr } from 'svelte/internal';
  import BarChart from "../Components/BarChart.svelte"
  import Matrix, { processColumns, processRows } from "../Components/Matrix/Matrix.svelte"
  import type {
    QualifyingType,
    ResultType,
  } from '../utils/types'


  export let possiblePositions: string[] = []
  export let qualifying: QualifyingType[] = []
  export let results: ResultType[] = []

  $: defaultDistributionMap = possiblePositions.reduce((acc, p) => {
    acc[p] = 0
    return acc
  }, {})

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
      if(acc[r.position] === undefined) { //if this is an unexpected position
        console.warn(`Encountered unexpected position ${r.position}`)
      }
      else {
        acc[r.position]++ //increment the count for this position
      }

      return acc
    }, JSON.parse(JSON.stringify(defaultDistributionMap)))
  )
  
  $: filteredResults = resultsForQualifyings[qualifyingPositionFilterIndex] || []
  $: relevantDistributionMap = distributionMaps[qualifyingPositionFilterIndex] || {}
  $: data = possiblePositions.map(p => ({
    key: p,
    value: relevantDistributionMap[p] || 0
  }))

  $: colorScale = scaleLinear().domain([possiblePositions[0], possiblePositions[possiblePositions.length-3]]).range(["green", "white"])
  $: colorFunction = (position: string) => colorScale(position) || "gray"

  $: resultPositionHover = data[resultPositionHoverIndex]


  let maxMatrixValue = 0
  $: matrix = distributionMaps.map((d,r) =>
    Object.values(d).map((z, c) => {
      maxMatrixValue = Math.max(maxMatrixValue, z)
      return {c, r, z}
    })
  )
  $: columns = processColumns(matrix,possiblePositions)
  $: rows = processRows(matrix,possiblePositions)
  $: matrixColorFunction = scaleLinear().domain([0, maxMatrixValue]).range(["white", "green"])
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

    <table>
      <tbody>
        {#each distributionMaps as d}
          <tr>
            {#each Object.entries(d) as cell}
              <td>{cell[1]}</td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>

    <Matrix
      colorFunction={matrixColorFunction}
      {columns}
      data={matrix}
      orderBy="name"
      {rows}
    />
  </div>
</main>

<style>
</style>