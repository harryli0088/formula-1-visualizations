<script lang="ts">
  import Icon from 'fa-svelte'
  import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
  import { scaleLinear } from 'd3'

  import Matrix, { processColumns, processRows } from "../Matrix/Matrix.svelte"
  import Popover from '../Popover.svelte'
  import type { CellDataType } from '../Matrix/types';
  import type { DistributionMapType } from './types';

  import formatPosition from '../../utils/formatPosition';

  export let distributionMaps: DistributionMapType[] = []
  export let getHoverText: (
    qualNum: number,
    qualPosition: string,
    resultNum: number,
    resultPosition: string,
  ) => string = (qualNum, qualPosition, resultNum, resultPosition) => ""
  export let qualifyingPositions: string[] = []
  export let resultPositions: string[] = []

  $: matrix = distributionMaps.map((d,r) => //map over all the distributionMaps
    resultPositions.map((p, c) => { //map over all the possible result positions
      const z = d[p] //get the count for this result position
      maxMatrixValue = Math.max(maxMatrixValue, z) //set the new max value if applicable
      return {c, r, z} //return the cell
    })
  )
  $: maxMatrixValue = matrix.reduce((acc,row) =>
    Math.max(acc, row.reduce((acc,cell) => Math.max(acc, cell.z), 0)),
    0
  )
  $: columns = processColumns(matrix,resultPositions.map(p => formatPosition(p)))
  $: rows = processRows(matrix,qualifyingPositions)
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
  <h3>
    Qualifying vs Race Finish Positions
    <Popover content="This matrix plots all the qualifyings finishes (rows) with the actual race finish (columns)">
      <Icon icon={faQuestionCircle}/>
    </Popover>
  </h3>
	<Matrix
    {colorFunction}
    {columns}
    data={matrix}
    gridLinesColor={"white"}
    {onMouseOverHandler}
    orderBy="name"
    {rows}
    xTitle="Qualifying Position"
    yTitle="Race Finish Position"
  />

  {#if hoverCell}
    <div>{getHoverText(rows[hoverCell.r].count, resultPositions[hoverCell.r], hoverCell.z, columns[hoverCell.c].name)}</div>
  {:else}
    Hover over the matrix to see more!
  {/if}
</main>

<style>
</style>