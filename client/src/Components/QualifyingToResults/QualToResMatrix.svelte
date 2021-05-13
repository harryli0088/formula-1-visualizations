<script lang="ts">
  import { scaleLinear } from 'd3'
  import Matrix, { processColumns, processRows } from "../Matrix/Matrix.svelte"
  import type { CellDataType } from '../Matrix/types';
  import type { DistributionMapType } from './types';

  export let distributionMaps: DistributionMapType[] = []
  export let getHoverText: (
    qualNum: number,
    qualPosition: string,
    resultNum: number,
    resultPosition: string,
  ) => string = (qualNum, qualPosition, resultNum, resultPosition) => ""
  export let numericPositions: string[] = []
  export let possiblePositions: string[] = []

  $: matrix = distributionMaps.map((d,r) => //map over all the distributionMaps
    possiblePositions.map((p, c) => { //map over all the possible result positions
      const z = d[p] //get the count for this result position
      maxMatrixValue = Math.max(maxMatrixValue, z) //set the new max value if applicable
      return {c, r, z} //return the cell
    })
  )
  $: maxMatrixValue = matrix.reduce((acc,row) =>
    Math.max(acc, row.reduce((acc,cell) => Math.max(acc, cell.z), 0)),
    0
  )
  $: columns = processColumns(matrix,possiblePositions)
  $: rows = processRows(matrix,numericPositions)
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
  <h3>Qualifying vs Race Finish Positions</h3>
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
    <div>{getHoverText(rows[hoverCell.r].count, possiblePositions[hoverCell.r], hoverCell.z, possiblePositions[hoverCell.c])}</div>
  {:else}
    Hover over the matrix to see more!
  {/if}
</main>

<style>
</style>