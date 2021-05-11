<script lang="ts">
  export let chartWidth: number = 0
  export let colorFunction: Function = () => {}
  export let columns = []
  export let data = []
  export let defaultHighlight: boolean = false
  export let formatRowHeading: Function = () => {}
  export let gridLinesColor: string = ""
  export let heading = {name: "", count: 0}
  export let horizontalTextSize: number = 0
  export let index: number = 0
  export let linesHighlightedWidth: number = 0
  export let linesNotHighlightedWidth: number = 0
  export let mouseover: Function = () => {}
  export let mouseoverColIndex: number = 0
  export let mouseoverRowIndex: number = 0
  export let normalOpacity: number = 1
  export let notHighlightedOpacity: number = 0
  export let onClickHandler: Function = () => {}
  export let rectHeight: number = 0
  export let rectWidth: number = 0
  export let textOffset: number = 0
  export let transition: string = ""
  export let xScale: Function = () => {}
  export let yScale: Function = () => {}

  $: formattedHeading = formatRowHeading(heading.name, heading.count)
  $: fullName = heading.name + " " + formattedHeading[1]
  $: rowIsFullOpacity = index===mouseoverRowIndex || (mouseoverRowIndex===-1&&mouseoverColIndex===-1&&defaultHighlight)
  $: rowIsHightlighted = index===mouseoverRowIndex
</script>


<g
  style={`
    font-weight: ${(index===mouseoverRowIndex) ? "bold" : "normal"};
    transform: translateY(${yScale(index)}px);
    transition: ${transition};
    transition-property: transform;
  `}
>
  {#each data as d,i}
    <rect
      fill={colorFunction(d)}
      height={rectHeight}
      width={rectWidth}
      x={xScale(d.c)}
      y={0}

      on:mouseover={e => mouseover(e, index, i)}
      on:click={e => onClickHandler(e, index, i)}

      style={`
        opacity:${(rowIsFullOpacity || i===mouseoverColIndex) ? normalOpacity : notHighlightedOpacity};
        transition: ${transition};
        transition-property: x;
      `}
    >
      <title>{heading.name + ", " + columns[i].name + ": " + d.z}</title>
    </rect>
  {/each}


  <line
    stroke={gridLinesColor}
    stroke-width={rowIsHightlighted ? linesHighlightedWidth : linesNotHighlightedWidth}
    x2={chartWidth}
  />

  <line
    stroke={gridLinesColor}
    stroke-width={rowIsHightlighted ? linesHighlightedWidth : linesNotHighlightedWidth}
    x2={chartWidth}
    y1={rectHeight}
    y2={rectHeight}
  />

  <g
    on:click={e => onClickHandler(e, index, -1)}
    on:mouseover={e => mouseover(e, index, -1)}
    opacity={rowIsFullOpacity ? normalOpacity : notHighlightedOpacity}
    transform={"translate(-"+(textOffset)+","+(rectHeight/2)+")"}
  >
    <text
      dy="0.35em"
      text-anchor="start"
      x={10 - horizontalTextSize}
      y={0}
    >
      <title>{fullName}</title>
      {formattedHeading[0]}
    </text>

    <text
      dy="0.35em"
      text-anchor="end"
      x={0}
      y={0}
    >
      <title>{fullName}</title>
      {formattedHeading[1]}
    </text>
  </g>
</g>


<style>

</style>