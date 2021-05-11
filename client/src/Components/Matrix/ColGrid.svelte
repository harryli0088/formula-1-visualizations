<script lang="ts">
  export let chartHeight: number = 0
  export let gridLinesColor: string = ""
  export let index: number = 0
  export let linesHighlightedWidth: number = 0
  export let linesNotHighlightedWidth: number = 0
  export let mouseoverColIndex: number = 0
  export let rectWidth: number = 0
  export let xScale: Function = () => {}

  $: colIsHighlighted = index === mouseoverColIndex
</script>

<g transform={`translate(${xScale(index)}) rotate(-90)`}>
  <line
    stroke={gridLinesColor} 
    stroke-width={colIsHighlighted ? linesHighlightedWidth : linesNotHighlightedWidth}
    x1={-1*chartHeight} 
  />

  <line
    stroke={gridLinesColor} 
    stroke-width={colIsHighlighted ? linesHighlightedWidth : linesNotHighlightedWidth}
    x1={-1*chartHeight} 
    y1={rectWidth} 
    y2={rectWidth} 
  />
</g>

<style>

</style>