<script lang="ts">
  import { scaleLinear } from 'd3'
  import Matrix, { processColumns, processRows } from "../Matrix/Matrix.svelte"
  import type { DistributionMapType } from './types';

  export let distributionMaps: DistributionMapType[] = []
  export let possiblePositions: string[] = []

  let maxMatrixValue = 0
  $: matrix = distributionMaps.map((d,r) => //map over all the distributionMaps
    Object.values(d).map((z, c) => { //map over all the values in the distributionMap
      maxMatrixValue = Math.max(maxMatrixValue, z) //set the new max value if applicable
      return {c, r, z} //return the cell
    })
  )
  $: columns = processColumns(matrix,possiblePositions)
  $: rows = processRows(matrix,possiblePositions)
  $: colorFunction = scaleLinear().domain([0, maxMatrixValue]).range(["white", "green"])
</script>

<main>
	<Matrix
    {colorFunction}
    {columns}
    data={matrix}
    orderBy="name"
    {rows}
  />
</main>

<style>
</style>