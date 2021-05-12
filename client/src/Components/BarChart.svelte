<script lang="ts">
  import { scaleBand, scaleLinear } from 'd3'
import App from '../App.svelte';

  type BarChartDataType = {
    key: string,
    value: number,
  }

  export let colorFunction: (value: any) => string = () => "black"
  export let data: BarChartDataType[] = []
  export let height: number = 500
  export let keyHoverIndex: number = -1
  export let margin: {bottom: number, left: number, right:number, top: number} = {bottom: 40, left: 20, right:0, top: 20}
  export let rotated: boolean = false
  export let stackedTitle: string = ""
  export let xTitle: string = ""
  export let yTitle: string = ""

  function setKeyHoverIndex(index: number) {
    keyHoverIndex = index
  }
  
  let width = 500
  $:rotatedHeight = rotated ? width: height
  $:rotatedWidth = rotated ? height: width

  let stackedBarsWidth = 25
  let gap = 50
  $: chartLeftOffset = stackedBarsWidth + gap + margin.left

  $: effectiveBottom = rotatedHeight - margin.bottom
  $: keys = data.map(d => d.key)
  $: values = data.map(d => d.value)
  $: maxValue = Math.max(...values)
  $: sum = values.reduce((acc, v) => acc + v, 0)
  $: xScale = scaleBand().domain(keys).range([chartLeftOffset, rotatedWidth])
  $: yScale = scaleLinear().domain([0, maxValue]).range([effectiveBottom, margin.top])
  $: stackedScale = scaleLinear().domain([0, sum || 0]).range([effectiveBottom, margin.top])

  $: barBandWidth = xScale.bandwidth()

  $: stackedData = data.map(d => ({ ...d, lastSum: 0 }))
  $: data.reduce((acc, d, i) => {
    stackedData[i].lastSum = acc
    acc += d.value
    return acc
  }, 0)

  $: extendedData = data.map(d => ({
    ...d,
    height: yScale(0) - yScale(d.value),
    width: barBandWidth,
    x: xScale(d.key),
    y: yScale(d.value),
  }))
</script>

<main>
  <div bind:clientWidth={width} style={`height: ${height}px`}>
    <svg height={rotatedHeight} width={rotatedWidth} style={`margin-top: ${(rotatedWidth - width)/2}px; transform: rotate(${rotated?"90":"0"}deg)`}>
      <g>
        {#each stackedData as d, i}
          <rect
            fill={colorFunction(d.key)}
            height={stackedScale(sum - d.value) - stackedScale(sum)}
            on:mouseover={e => setKeyHoverIndex(i)}
            on:mouseout={e => setKeyHoverIndex(-1)}
            opacity={keyHoverIndex===i || keyHoverIndex===-1 ? 1 : 0.5}
            width={stackedBarsWidth}
            x={margin.left}
            y={stackedScale(d.value + d.lastSum)}
          />
        {/each}
      </g>
      <g>
        {#each extendedData as d, i}
          <rect 
            fill={colorFunction(d.key)}
            height={d.height}
            on:mouseover={e => setKeyHoverIndex(i)}
            on:mouseout={e => setKeyHoverIndex(-1)}
            opacity={keyHoverIndex===i || keyHoverIndex===-1 ? 1 : 0.5}
            width={d.width} 
            x={d.x} 
            y={d.y} 
          />
          <text
            class="position-label"
            dy="1em"
            fill={d.value > 0 ? "" : "#bbb"}
            text-anchor={rotated ? "end" : "middle"}
            transform={`
              translate(${d.x + (rotated ? 0 : barBandWidth/2)},${effectiveBottom + (rotated ? 1 : 0)})
              rotate(${rotated?"-90":"0"})
            `}
            x={0}
            y={0}
          >{d.key}</text>

          {#if d.value > 0}
            <text
              class="position-label"
              text-anchor={rotated ? "start" : "middle"}
              dy={rotated ? "1em" : 0}
              transform={`
                translate(${d.x + (rotated ? 0 : barBandWidth/2)},${d.y - 2})
                rotate(${rotated?"-90":"0"})
              `}
              x={0}
              y={0}
            >{d.value}</text>
          {/if}
        {/each}
      </g>
  
      <text text-anchor="middle" x={0} y={0} transform={`translate(${rotatedWidth/2},${rotatedHeight - (rotated?18:0)}) rotate(${rotated?"180":"0"})`}>{xTitle}</text>
      <text text-anchor="middle" x={0} y={0} transform={`translate(0,${effectiveBottom/2}) rotate(-90)`} dy={chartLeftOffset - 3}>{yTitle}</text>
      <text text-anchor="middle" x={0} y={0} transform={`translate(0,${effectiveBottom/2}) rotate(-90)`} dy={margin.left - 3}>{stackedTitle}</text>
    </svg>
  </div>
</main>

<style>
	main {
		text-align: center;
	}

  rect {
    stroke: white;
    stroke-width: 1px;
    transition: 0.25s;
  }

  text {
    transition: 0.25s;
  }

  .position-label {
    font-size: 12px;
  }
</style>