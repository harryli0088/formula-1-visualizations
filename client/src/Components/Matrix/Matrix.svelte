<script lang="ts">
  import { range, scaleBand } from 'd3'
import { identity } from 'svelte/internal'
  import ColGrid from "./ColGrid.svelte"
  import ColHeading from "./ColHeading.svelte"
  import Row from "./Row.svelte"
  import type { CellDataType, HeadingType, OrdersType } from "./types"

  const SCROLLBAR_SIZE = 17;

  export let colorFunction:(cell: CellDataType) => string = (cell: CellDataType) => ""
  export let columns:HeadingType[] = []
  export let data:CellDataType[][] = []
  export let orderBy:string = ""
  export let rows:HeadingType[] = []

  export let defaultHighlight: boolean = true
  export let font:string = "16px Arial"
  export let formatColHeading:(text: number, count: string) => string[] = (text, count) => [text, (count>0 ? `(${count})` : "")]
  export let formatRowHeading:(text: number, count: string) => string[] = (text, count) => [text, (count>0 ? `(${count})` : "")]
  export let gridLinesColor:string = "gray"
  export let height:number = 700
  export let linesHighlightedWidth:number = 3
  export let linesNotHighlightedWidth:number = 1
  export let minRectSize:number = 20
  export let normalOpacity:number = 1
  export let notHighlightedOpacity:number = 0.25
  export let onClickHandler = (e, rowIndex, colIndex) => {}
  export let onMouseOutHandler = (e) => {}
  export let onMouseOverHandler = (e, rowIndex, colIndex) => {}
  export let textOffset:number = 5
  export let transition:string = "1s"
  export let xTitle:string = ""
  export let yTitle:string = ""

  let mouseoverColIndex: number = -1
  let mouseoverRowIndex: number = -1
  let width: number = 500

  const ctx = document.createElement('canvas').getContext("2d")
  $: ctx.font = font

  $: mouseover = (e, rowIndex: number, colIndex: number) => {
    mouseoverColIndex = colIndex
    mouseoverRowIndex = rowIndex

    onMouseOverHandler(e, rowIndex, colIndex);
  }

  $: mouseout = e => {
    mouseoverColIndex = -1
    mouseoverRowIndex = -1

    onMouseOutHandler(e);
  }

  $: orders = {
    rows: {
      name: range(rows.length).sort((a:number, b:number) => rows),
      count: range(rows.length).sort((a:number, b:number) => rows[b].count - rows[a].count)
    },
    columns: {
      name: range(columns.length).sort((a:number, b:number) => columns),
      count: range(columns.length).sort((a:number, b:number) => columns[b].count - columns[a].count)
    }
  }


  //get text label lengths
  const titleSize = 20
  $: xTitleSize = (xTitle ? titleSize : 0)
  $: yTitleSize = (yTitle ? titleSize : 0)
  $: horizontalTextSize = getTextSize(ctx, rows, formatRowHeading, textOffset) + xTitleSize;
  $: verticalTextSize = getTextSize(ctx, columns, formatColHeading, textOffset) + yTitleSize;

  $: minHeight = verticalTextSize + rows.length*minRectSize;
  $: effectiveHeight = Math.max(minHeight, height);
  $: gridHeight = effectiveHeight - verticalTextSize - 10;
  $: tooTall = minHeight > height
  $: minWidth = horizontalTextSize + columns.length*minRectSize + (tooTall?SCROLLBAR_SIZE:0);
  $: effectiveWidth = Math.max(minWidth, width);
  $: gridWidth = effectiveWidth - horizontalTextSize - (tooTall?SCROLLBAR_SIZE:0);


  //in svg, y is rows and x is columns
  $: xScale = scaleBand().range([0, gridWidth]).domain(orders.columns[orderBy]);
  $: yScale = scaleBand().range([0, gridHeight]).domain(orders.rows[orderBy]);

  $: rectWidth = xScale.bandwidth();
  $: rectHeight = yScale.bandwidth();


  //given a canvas context and some text, return the longest length in pixels
  function getTextSize(ctx, headings, formatText, textOffset) {
    let longestLength = 0;
    for(let i=0; i<headings.length; ++i) {
      const length = ctx.measureText(formatText(headings[i].name, headings[i].count).join(" ")).width;
      if(length > longestLength) {
        longestLength = length;
      }
    }

    return longestLength + textOffset + 5;
  }
</script>

<script context="module" lang="ts">
  import type { CellDataType, HeadingType } from "./types"

  function sumAlongColumn(data: CellDataType[][], colIndex: number) {
    let sum:number = 0
    data.forEach(d => sum += d[colIndex].z)
    return sum
  }

  export function processColumns(data: CellDataType[][], columns: string[]):HeadingType[] {
    return columns.map((name,i) => ({
      name,
      count: sumAlongColumn(data, i)
    }))
  }

  export function processRows(data: CellDataType[][], rows: string[]):HeadingType[] {
    return rows.map((name,i) => ({
      name,
      count: data[i].reduce((acc,cell) => acc+cell.z, 0) //sum along the row
    }))
  }
</script>

<main>
  <div 
    bind:clientWidth={width} 
    class="matrix" 
    on:mouseleave={mouseout} 
    style={`font: ${font}`}
  >
    <svg width={effectiveWidth} height={verticalTextSize}>
      {#if yTitle}
        <text x={horizontalTextSize + gridWidth/2} y={0} dy="1em" text-anchor="middle">{yTitle}</text>
      {/if}
      <g transform={`translate(${horizontalTextSize}, ${verticalTextSize})`}>
        {#each columns as d, i}
          <ColHeading
            data={d}
            {defaultHighlight}
            {formatColHeading}
            index={i}
            {normalOpacity}
            {notHighlightedOpacity}
            {rectWidth}
            {textOffset}
            {transition}
            {verticalTextSize}
            {xScale}
            {yTitleSize}

            {mouseover}
            {mouseoverColIndex}
            {mouseoverRowIndex}
            {onClickHandler}
          />
        {/each}
      </g>
    </svg>

    <div style={`${height<effectiveHeight ? `width:${effectiveWidth}px` : ""};overflow-x:hidden;overflow-y:auto;`}>
      <svg width={effectiveWidth - (tooTall?SCROLLBAR_SIZE:0)} height={gridHeight}>
        {#if xTitle}
          <text x={0} y={0} dy="1em" text-anchor="middle" transform={`translate(0,${gridHeight/2}) rotate(-90)`}>{xTitle}</text>
        {/if}
        <g transform={`translate(${horizontalTextSize})`}>
          {#each data as d,i}
            <Row
              data={d}
              chartWidth={gridWidth}
              {colorFunction}
              columns={columns}
              {defaultHighlight}
              {formatRowHeading}
              {gridLinesColor}
              heading={rows[i]}
              {horizontalTextSize}
              index={i}
              {linesHighlightedWidth}
              {linesNotHighlightedWidth}
              {normalOpacity}
              {notHighlightedOpacity}
              {rectHeight}
              {rectWidth}
              {textOffset}
              {transition}
              {xScale}
              {xTitleSize}
              {yScale}


              {mouseover}
              {mouseoverColIndex}
              {mouseoverRowIndex}
              {onClickHandler}
            />
          {/each}

          {#each columns as d,i}
            <ColGrid
              chartHeight={gridHeight}
              index={i}
              {gridLinesColor}
              {linesHighlightedWidth}
              {linesNotHighlightedWidth}
              {rectWidth}
              {xScale}

              {mouseoverColIndex}
            />
          {/each}
        </g>
      </svg>
    </div>
  </div>
</main>

<style>
  .matrix {
    overflow: auto;
    width: 100%;
  }
</style>