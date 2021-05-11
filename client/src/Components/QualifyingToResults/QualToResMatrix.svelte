<script lang="ts">
  import { scaleLinear } from 'd3'
  import Matrix, { processColumns, processRows } from "../Matrix/Matrix.svelte"
  import type { CellDataType } from '../Matrix/types';
  import type { DistributionMapType } from './types';

  export let distributionMaps: DistributionMapType[] = []
  export let possiblePositions: string[] = []

  let maxMatrixValue = 0
  $: matrix = distributionMaps.map((d,r) => //map over all the distributionMaps
    possiblePositions.map((p, c) => { //map over all the possible result positions
      const z = d[p] //get the count for this result position
      maxMatrixValue = Math.max(maxMatrixValue, z) //set the new max value if applicable
      return {c, r, z} //return the cell
    })
  )
  $: columns = processColumns(matrix,possiblePositions)
  $: rows = processRows(matrix,possiblePositions)
  $: colorScale = scaleLinear().domain([0, Math.sqrt(maxMatrixValue)]).range(["white", "green"])
  $: colorFunction = (cell: CellDataType) => colorScale(Math.sqrt(cell.z)) || ""


  let colHoverIndex = -1
  let rowHoverIndex = -1
  function onMouseOverHandler(e, rowIndex: number, colIndex: number) {
    colHoverIndex = colIndex
    rowHoverIndex = rowIndex
  }
  $: hoverCell = matrix[rowHoverIndex]?.[colHoverIndex]
</script>

<main>
	<Matrix
    {colorFunction}
    {columns}
    data={matrix}
    gridLinesColor={"white"}
    {onMouseOverHandler}
    orderBy="name"
    {rows}
  />

  {#if hoverCell}
    <div>Out of {rows[hoverCell.r].count} qualifyings in which a driver finished in position {possiblePositions[hoverCell.r]}, {hoverCell.z} ({Math.ceil(100*hoverCell.z/rows[hoverCell.r].count)}%) of those drivers finished the race in position {possiblePositions[hoverCell.c]}</div>
  {:else}
    Hover over the matrix to see more!
  {/if}
</main>

<style>
</style>